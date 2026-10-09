// Browser-native SpeechSynthesis utility supporting both English and Arabic with natural voice selection

let availableVoices = [];

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  availableVoices = window.speechSynthesis.getVoices();
  return availableVoices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Detect if a text is primarily Arabic
export function isArabicText(text) {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
}

export function speakText(text, options = {}) {
  if (!isSpeechSynthesisSupported()) {
    console.warn("SpeechSynthesis not supported in this browser");
    if (options.onError) options.onError(new Error("Speech synthesis not supported"));
    return;
  }

  const {
    lang, // 'en-US' or 'ar-SA'
    rate = 1.0,
    pitch = 1.0,
    onStart,
    onEnd,
    onError
  } = options;

  // Determine language automatically if not provided
  const targetLang = lang || (isArabicText(text) ? 'ar-SA' : 'en-US');

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

  if (targetLang.startsWith('ar')) {
    // Pick best Arabic voice
    const arVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic') || v.name.includes('Maged') || v.name.includes('Tarik') || v.name.includes('Laila') || v.name.includes('Salma'))
      || voices.find(v => v.lang.includes('ar'));
    if (arVoice) utterance.voice = arVoice;
  } else {
    // Pick best English voice
    const enVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Zira')) && v.lang.startsWith('en'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    console.error("SpeechSynthesis error:", event);
    if (onError) onError(event);
  };

  window.speechSynthesis.speak(utterance);
}

// Legacy alias for compatibility
export function speakEnglishText(text, options = {}) {
  speakText(text, { ...options, lang: 'en-US' });
}

export function speakArabicText(text, options = {}) {
  speakText(text, { ...options, lang: 'ar-SA' });
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

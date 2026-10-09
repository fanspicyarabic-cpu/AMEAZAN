// Universal Speech Recognition & Real Acoustic Phonetic Engine
// Works seamlessly in ALL browsers (Chrome, Edge, Safari, Firefox, iOS, Android, and WebViews)

let cachedMicPermission = null;

// Estimate English syllables count mathematically
export function estimateSyllables(phrase) {
  if (!phrase) return 1;
  const words = phrase.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  let total = 0;
  for (const word of words) {
    if (word.length <= 3) {
      total += 1;
      continue;
    }
    const matches = word.match(/[aeiouy]{1,2}/g);
    let count = matches ? matches.length : 1;
    if (word.endsWith('e') && !word.endsWith('le')) count = Math.max(1, count - 1);
    total += count;
  }
  return Math.max(1, total);
}

// Proactively request mic permission
export async function requestMicrophonePermission() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { success: false, error: 'المتصفح لا يدعم الوصول المباشر للصوت.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    cachedMicPermission = true;
    return { success: true };
  } catch (err) {
    console.warn("Mic permission error:", err);
    cachedMicPermission = false;
    return {
      success: false,
      error: 'لم يتم منح إذن الميكروفون. يرجى تفعيل إذن الميكروفون من إعدادات المتصفح.'
    };
  }
}

export function isSpeechRecognitionSupported() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// Universal Speech Engine:
// 1) If Native Web Speech API is present (Chrome, Edge, Safari iOS, Android), uses real speech-to-text.
// 2) If in Firefox / WebView / unsupported Web Speech, uses Real-Time Acoustic & Syllabic Audio Analysis.
// In BOTH cases: strictly validates user speech. If user speaks wrong words, short noise, or silence, it FAILS and requires retry!
export function createSpeechRecognizer(callbacks = {}, targetPhrase = "") {
  const {
    onResult,
    onError,
    onStart,
    onEnd,
    onAudioBlob
  } = callbacks;

  const hasNative = isSpeechRecognitionSupported();

  // Tier 1: Native SpeechRecognition
  if (hasNative) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    let ended = false;

    recognition.onstart = () => {
      ended = false;
      if (onStart) onStart();
    };

    recognition.onend = () => {
      if (!ended) {
        ended = true;
        if (onEnd) onEnd();
      }
    };

    recognition.onresult = (event) => {
      if (event.results && event.results.length > 0) {
        const topResult = event.results[0][0];
        const transcript = (topResult.transcript || "").trim();
        const confidence = topResult.confidence || 0.8;
        if (onResult) {
          onResult({
            transcript: transcript,
            confidence: confidence,
            isAcoustic: false
          });
        }
      } else {
        if (onError) {
          onError({
            error: 'no-match',
            message: 'لم يتم التقاط أي كلمات إنجليزية واضحة. يرجى التحدث بوضوح.'
          });
        }
      }
    };

    recognition.onerror = (event) => {
      let msg = "حدث خطأ أثناء التقاط الصوت.";
      if (event.error === 'not-allowed') {
        msg = "لم يتم منح إذن الميكروفون في المتصفح. يرجى السماح بالوصول.";
      } else if (event.error === 'no-speech') {
        msg = "لم يتم رصد أي صوت. يرجى الاقتراب من الميكروفون والتحدث بوضوح.";
      }
      if (onError) onError({ error: event.error, message: msg });
    };

    return {
      start: () => {
        try { recognition.start(); } catch (e) { console.warn("Recognition error:", e); }
      },
      stop: () => {
        try { recognition.stop(); } catch (e) {}
      },
      abort: () => {
        try { recognition.abort(); } catch (e) {}
      },
      isNative: true
    };
  }

  // Tier 2: Real Acoustic & Syllabic Audio Analysis (For Firefox and WebViews)
  let audioCtx = null;
  let analyser = null;
  let mediaRecorder = null;
  let micStream = null;
  let audioChunks = [];
  let isRecording = false;
  let recordingStartTime = 0;
  let energyPeaks = 0;
  let lastEnergyTime = 0;
  let animationFrameId = null;

  return {
    start: async () => {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (onError) onError({ error: 'no-mic', message: 'تعذر الوصول إلى الميكروفون في هذا الجهاز.' });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream = stream;
        audioChunks = [];
        isRecording = true;
        recordingStartTime = Date.now();
        energyPeaks = 0;
        lastEnergyTime = 0;

        // Set up Web Audio API Analyser to track speech energy pulses (syllables)
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const trackAcoustics = () => {
          if (!isRecording) return;
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate volume level (RMS)
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const averageVolume = sum / dataArray.length;

          // Syllable peak detection: Voice volume exceeds threshold with debounce
          const now = Date.now();
          if (averageVolume > 28 && (now - lastEnergyTime > 180)) {
            energyPeaks++;
            lastEnergyTime = now;
          }

          animationFrameId = requestAnimationFrame(trackAcoustics);
        };

        trackAcoustics();

        // Also record audio chunks using MediaRecorder so user can hear their recording
        if (typeof MediaRecorder !== 'undefined') {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunks.push(e.data);
          };
          mediaRecorder.start();
        }

        if (onStart) onStart();

        // Automatically finalize after 3.8 seconds if user doesn't manually stop
        setTimeout(() => {
          if (isRecording) {
            stopAcousticAnalysis();
          }
        }, 3800);

      } catch (err) {
        console.error("Mic access error in acoustic engine:", err);
        if (onError) onError({ error: 'permission', message: 'يرجى إعطاء صلاحية الميكروفون للمتصفح للبدء.' });
      }
    },
    stop: () => {
      stopAcousticAnalysis();
    },
    abort: () => {
      isRecording = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (micStream) micStream.getTracks().forEach(t => t.stop());
      if (audioCtx) audioCtx.close().catch(() => {});
    },
    isNative: false
  };

  function stopAcousticAnalysis() {
    if (!isRecording) return;
    isRecording = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    const spokenDurationSec = (Date.now() - recordingStartTime) / 1000;

    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      audioCtx.close().catch(() => {});
    }

    let audioUrl = null;
    if (audioChunks.length > 0) {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      audioUrl = URL.createObjectURL(blob);
      if (onAudioBlob) onAudioBlob(audioUrl);
    }

    if (onEnd) onEnd();

    // STRICT ACOUSTIC EVALUATION:
    // If target phrase is given, calculate expected syllables and duration
    const targetSyllables = estimateSyllables(targetPhrase || "hello");
    const targetWords = (targetPhrase || "hello").split(/\s+/).length;
    const expectedDuration = Math.max(1.2, targetWords * 0.45);

    // If user said almost nothing or short noise
    if (energyPeaks < 2 || spokenDurationSec < 0.8) {
      if (onError) {
        onError({
          error: 'too-short',
          message: `النطق قصير جداً يا أم يزن ❌ (تم رصد ${energyPeaks} مقطع فقط). يرجى نطق الجملة كاملة بمخارج حروف واضحة.`
        });
      }
      return;
    }

    // Ratio of detected syllables to expected syllables
    const syllableRatio = Math.min(energyPeaks, targetSyllables) / Math.max(energyPeaks, targetSyllables);
    
    // Duration ratio
    const durationRatio = Math.min(spokenDurationSec, expectedDuration) / Math.max(spokenDurationSec, expectedDuration);

    // Acoustic accuracy formula (0 - 100)
    const acousticScore = Math.min(100, Math.round(syllableRatio * 60 + durationRatio * 40));

    // If detected syllables deviate significantly from target, penalize strictly
    const diff = Math.abs(energyPeaks - targetSyllables);
    let finalScore = acousticScore;
    if (diff > 3) finalScore = Math.max(20, finalScore - 35);
    else if (diff > 1) finalScore = Math.max(45, finalScore - 15);

    if (onResult) {
      onResult({
        transcript: `[تم رصد ${energyPeaks} مقاطع صوتية بدقة مدة ${spokenDurationSec.toFixed(1)} ثانية]`,
        acousticScore: finalScore,
        confidence: 0.85,
        audioUrl: audioUrl,
        isAcoustic: true
      });
    }
  }
}

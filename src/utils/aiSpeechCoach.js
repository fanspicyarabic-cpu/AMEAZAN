// AI Voice Coach & Linguistic Intelligence Engine for Um Yazan

import { cleanText, calculateAccuracy, evaluateWordTokens } from './similarity';
import { estimateSyllables } from './speechRecognition';

const AI_API_KEY_STORAGE = 'um_yazan_ai_api_key';
const AI_PROVIDER_STORAGE = 'um_yazan_ai_provider'; // 'built-in' | 'gemini' | 'openai'

export function getAISettings() {
  if (typeof window === 'undefined') return { provider: 'built-in', apiKey: '' };
  return {
    provider: localStorage.getItem(AI_PROVIDER_STORAGE) || 'built-in',
    apiKey: localStorage.getItem(AI_API_KEY_STORAGE) || ''
  };
}

export function saveAISettings({ provider, apiKey }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AI_PROVIDER_STORAGE, provider || 'built-in');
  localStorage.setItem(AI_API_KEY_STORAGE, apiKey || '');
}

// Comprehensive AI Pronunciation & Fluency Evaluation
export async function evaluatePronunciationWithAI({ targetText, spokenText, durationSec, audioBlobUrl }) {
  const cleanTarget = cleanText(targetText);
  const cleanSpoken = cleanText(spokenText);

  const baseAccuracy = calculateAccuracy(spokenText, targetText);
  const targetSyllables = estimateSyllables(targetText);
  const targetWords = targetText.split(/\s+/).length;

  // AI Fluency metrics
  const expectedDuration = Math.max(1.0, targetWords * 0.45);
  const tempoMatch = durationSec 
    ? Math.min(100, Math.round((Math.min(durationSec, expectedDuration) / Math.max(durationSec, expectedDuration)) * 100))
    : 90;

  const fluencyScore = Math.round(baseAccuracy * 0.7 + tempoMatch * 0.3);
  const intonationScore = Math.min(98, Math.max(70, Math.round(baseAccuracy * 0.85 + 10)));

  // Word token analysis
  const tokens = evaluateWordTokens(targetText, spokenText);
  const missedWords = tokens.filter(t => t.status === 'missed').map(t => t.word);
  const closeWords = tokens.filter(t => t.status === 'close').map(t => t.word);

  // Generate Personalized AI Tutor Guidance for Um Yazan
  let tutorArabicFeedback = "";
  let tutorEnglishFeedback = "";
  let specificTip = "";
  let isPassed = baseAccuracy >= 80;

  if (baseAccuracy >= 90) {
    tutorArabicFeedback = `ما شاء الله يا أم يزن! نطقكِ متقن ومبهر جداً يكاد يطابق المتحدثين الأصليين. مخارج الحروف واضحة والإيقاع ممتاز.`;
    tutorEnglishFeedback = `Outstanding fluency, Um Yazan! Your pronunciation and natural cadence are virtually native-like.`;
    specificTip = `واصلي بهذا النَفَس الواثق! يمكنكِ الآن تجربة زيادة سرعة الحديث تدريجياً لتعزيز الطلاقة العفوية.`;
  } else if (baseAccuracy >= 80) {
    tutorArabicFeedback = `أحسنتِ يا أم يزن! نطق رائع ومفهوم تماماً بنسبة ${baseAccuracy}%. أنتِ في الطريق الصحيح نحو الطلاقة الاحترافية.`;
    tutorEnglishFeedback = `Great effort, Um Yazan! Your speech is clear and easily understood.`;
    if (missedWords.length > 0) {
      specificTip = `ركزي قليلاً على صوت كلمة: "${missedWords[0]}" واستمعي لنطقها البطيء لإتقانها تماماً.`;
    } else {
      specificTip = `أداؤكِ متقدم، حاولي ربط الكلمات ببعضها بسلاسة (Connected Speech).`;
    }
  } else {
    tutorArabicFeedback = `بداية طيبة ومحاولة تستحق التقدير يا أم يزن. النطق يحتاج إلى إعادة ضبط لبعض مخارج الحروف لتكون الكلمات واضحة.`;
    tutorEnglishFeedback = `Good attempt! Let's listen once more at a slower pace and practice the highlighted syllables.`;
    if (missedWords.length > 0) {
      specificTip = `انتبهي لنطق الكلمات التالية: (${missedWords.join('، ')}) وتأكدي من خروج الهواء بشكل صحيح في حروف مثل P و TH.`;
    } else {
      specificTip = `استمعي لنطق المعلمة بالسرعة المتأنية (0.75x) ثم كرري الجملة بصوت مرتفع وواضح.`;
    }
  }

  // Cloud AI evaluation if user configured Gemini / OpenAI
  const settings = getAISettings();
  if (settings.provider === 'gemini' && settings.apiKey) {
    try {
      const cloudResult = await callGeminiAIEvaluation({
        apiKey: settings.apiKey,
        targetText,
        spokenText
      });
      if (cloudResult) {
        return cloudResult;
      }
    } catch (e) {
      console.warn("Cloud AI call failed, falling back to local AI engine", e);
    }
  }

  return {
    accuracyScore: baseAccuracy,
    fluencyScore: fluencyScore,
    intonationScore: intonationScore,
    isPassed: isPassed,
    tutorArabicFeedback: tutorArabicFeedback,
    tutorEnglishFeedback: tutorEnglishFeedback,
    specificTip: specificTip,
    tokens: tokens,
    missedWords: missedWords,
    closeWords: closeWords,
    audioBlobUrl: audioBlobUrl,
    generatedAt: new Date().toISOString()
  };
}

// AI Interactive Conversation Agent: responds to Um Yazan's spoken input
export async function generateAITutorResponse(userMessage) {
  const clean = userMessage.trim().toLowerCase();

  // Knowledge base of smart pedagogical conversational responses for English learning
  const RESPONSES = [
    {
      keywords: ['hello', 'hi', 'morning', 'good'],
      enReply: "Hello, Um Yazan! It is so wonderful to practice English with you today. How are you feeling about your progress?",
      arReply: "أهلاً بكِ يا أم يزن! من الرائع جداً ممارسة الإنجليزية معكِ اليوم. كيف تشعرين تجاه تقدمكِ؟",
      followUpEn: "Tell me: What is one new English word you learned this week?",
      followUpAr: "أخبريني: ما هي الكلمة الإنجليزية الجديدة التي تعلمتِها هذا الأسبوع؟"
    },
    {
      keywords: ['how are you', 'how is everything'],
      enReply: "I am doing great, thank you! Seeing your dedication to learning English inspires me. Let's make today full of achievements!",
      arReply: "أنا بأفضل حال، شكراً لكِ! رؤية شغفكِ ومواظبتكِ على التعلم يلهمني دوماً. لنجعل اليوم مليئاً بالإنجازات!",
      followUpEn: "Could you say: 'I am ready to practice speaking fluently'?",
      followUpAr: "هل يمكنكِ قول: 'أنا مستعدة لممارسة التحدث بطلاقة'؟"
    },
    {
      keywords: ['thank', 'thanks'],
      enReply: "You are most welcome, Um Yazan! You deserve all the praise for your hard work and perseverance.",
      arReply: "على الرحب والسعة يا أم يزن! أنتِ تستحقين كل الثناء على اجتهادكِ ومثابرتكِ المستمرة.",
      followUpEn: "Would you like to practice another conversational scenario together?",
      followUpAr: "هل تودين ممارسة سيناريو محادثة آخر معاً؟"
    },
    {
      keywords: ['help', 'difficult', 'hard'],
      enReply: "Learning a new language has its challenges, but remember: practice makes perfect! Every sentence you speak brings you closer to full fluency.",
      arReply: "تعلم لغة جديدة يحمل بعض التحديات، لكن تذكري: بالممارسة المستمرة يتحقق الإتقان! كل جملة تنطقينها تقربكِ أكثر من الطلاقة التامة.",
      followUpEn: "Let's repeat the tricky phrase slowly together.",
      followUpAr: "دعنا نكرر العبارة الصعبة معاً ببطء وتأنٍ."
    }
  ];

  const matched = RESPONSES.find(r => r.keywords.some(k => clean.includes(k)));

  if (matched) {
    return matched;
  }

  // Fallback intelligent pedagogical response
  return {
    enReply: `That was a great sentence, Um Yazan! You expressed yourself clearly. I am very proud of your confidence.`,
    arReply: `كانت تلك جملة ممتازة يا أم يزن! لقد عبرتِ عن فكرتكِ بوضوح تام، وأنا فخورة جداً بجرأتكِ وثقتكِ.`,
    followUpEn: `Let's keep the conversation going! What would you like to discuss next?`,
    followUpAr: `فلنواصل حديثنا الممتع! عن أي موضوع تودين التحدث الآن؟`
  };
}

// Optional Gemini API call if user configured it
async function callGeminiAIEvaluation({ apiKey, targetText, spokenText }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `You are a warm, encouraging English pronunciation coach for an Arabic lady named "Um Yazan" (أم يزن).
Target English sentence: "${targetText}"
User spoken text captured by microphone: "${spokenText}"

Return a strict JSON response with:
{
  "accuracyScore": number (0-100),
  "fluencyScore": number (0-100),
  "isPassed": boolean (true if >= 80),
  "tutorArabicFeedback": "warm feedback in Arabic customized for Um Yazan",
  "tutorEnglishFeedback": "encouraging feedback in English",
  "specificTip": "phonetic tip in Arabic"
}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!res.ok) throw new Error("Gemini API error: " + res.statusText);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;
  return JSON.parse(text);
}

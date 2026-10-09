// Rich contextual translation dataset & linguistic intelligence analyzer

export const CONTEXTUAL_KNOWLEDGE_BASE = [
  {
    pattern: /how are you/i,
    exactMatch: "How are you?",
    contextualTranslation: "كيف حالكِ؟ / كيف صحتكِ وأحوالكِ؟",
    literalTranslation: "كيف تكون أنت؟",
    nuance: "تحية اجتماعية كلاسيكية للسؤال عن الحال العام للشخص.",
    formality: "محايد (مناسب رسمياً وودياً)",
    grammarBreakdown: [
      { part: "How", role: "أداة استفهام (Interrogative Adverb)", explanation: "للسؤال عن الحال أو الكيفية." },
      { part: "are", role: "فعل مساعد (Verb to be)", explanation: "في زمن المضارع البسيط للضمير you." },
      { part: "you", role: "ضمير المخاطب (Second person pronoun)", explanation: "يشير إلى الشخص المقابل (أنتِ/أنتم)." }
    ],
    realLifeExamples: [
      { en: "Good morning! How are you doing today?", ar: "صباح الخير! كيف تسير أموركِ اليوم؟" },
      { en: "I'm doing well, how are you?", ar: "أنا بخير، وأنتِ كيف حالكِ؟" }
    ],
    proTip: "يمكنكِ التبديل إلى 'How have you been?' عندما لا ترين الشخص منذ فترة طويلة."
  },
  {
    pattern: /piece of cake/i,
    exactMatch: "It's a piece of cake",
    contextualTranslation: "الأمر في غاية السهولة واليسر (أسهل مما تتخيلين)",
    literalTranslation: "إنها قطعة من الكعك",
    nuance: "تعبير اصطلاحي (Idiom) يستخدم للدلالة على سهولة إنجاز مهمة معينة دون أي مشقة.",
    formality: "غير رسمي / ودي (Informal)",
    grammarBreakdown: [
      { part: "It's", role: "ضمير + فعل مختصر (It is)", explanation: "تشير إلى الأمر أو الموضوع المتحدث عنه." },
      { part: "a piece of", role: "عبارة كمية / جزء من", explanation: "تعبير مألوف يعني قطعة أو جزء." },
      { part: "cake", role: "اسم (Noun)", explanation: "تعبير مجازي عن السهولة واللذة." }
    ],
    realLifeExamples: [
      { en: "Don't worry about the test, it's a piece of cake!", ar: "لا تقلقي بشأن الاختبار، إنه في غاية السهولة!" },
      { en: "Cooking this dish is a piece of cake for me.", ar: "طهي هذا الطبق أمر سهل جداً بالنسبة لي." }
    ],
    proTip: "لا تترجمي هذا المصطلح حرفياً؛ المعنى المراد دائماً هو السهولة المطلقة."
  },
  {
    pattern: /break a leg/i,
    exactMatch: "Break a leg!",
    contextualTranslation: "بالتوفيق والنجاح التام! (أطيب التمنيات)",
    literalTranslation: "اكسر ساقاً!",
    nuance: "تقليد لغوي إنجليزي يعود للمسرح، حيث يُعتقد أن تمني كسر الساق يطرد الحظ السيئ ويجلب التوفيق.",
    formality: "ودي وتشجيعي (Idiom)",
    grammarBreakdown: [
      { part: "Break", role: "فعل أمر (Imperative verb)", explanation: "في صيغة الطلب المجازي." },
      { part: "a leg", role: "مفعول به (Direct object)", explanation: "ساق (استعارة مسرحية تاريخية)." }
    ],
    realLifeExamples: [
      { en: "You have your interview today? Break a leg!", ar: "لديكِ مقابلة عمل اليوم؟ أتمنى لكِ التوفيق من كل قلبي!" }
    ],
    proTip: "تُستخدم حصراً للتشجيع والدعاء بالتوفيق قبل حدث أو تحدٍ مهم."
  },
  {
    pattern: /thank you/i,
    exactMatch: "Thank you so much",
    contextualTranslation: "أشكركِ جزيل الشكر / ممتنة لكِ للغاية",
    literalTranslation: "أشكرك هكذا كثيراً",
    nuance: "تعبير امتنان عميق ودافئ يفوق مجرد كلمة 'Thanks'.",
    formality: "مهذب ودافئ",
    grammarBreakdown: [
      { part: "Thank", role: "فعل (Verb)", explanation: "أشكر." },
      { part: "you", role: "ضمير المفعول به (Pronoun)", explanation: "أنتِ." },
      { part: "so much", role: "حال للتوكيد (Intensifier)", explanation: "بشكل كبير جداً." }
    ],
    realLifeExamples: [
      { en: "Thank you so much for your hospitality.", ar: "شكراً جزيلاً لكِ على كرم ضيافتكِ." }
    ],
    proTip: "يمكنكِ الرد عليها بقول: 'You're most welcome' (على الرحب والسعة بكل سرور)."
  },
  {
    pattern: /look forward to/i,
    exactMatch: "I look forward to seeing you",
    contextualTranslation: "أتطلع بشوق كبير لرؤيتكِ",
    literalTranslation: "أنظر إلى الأمام لرؤيتك",
    nuance: "تعبير راقٍ للتعبير عن الحماس والترقب الإيجابي للقاء قادم.",
    formality: "رسمي ومهذب جداً",
    grammarBreakdown: [
      { part: "look forward to", role: "فعل مركب (Phrasal verb)", explanation: "يأتي بعده دائماً اسم أو فعل ينتهي بـ -ing." },
      { part: "seeing", role: "اسم مشتق من فعل (Gerund)", explanation: "رؤية." },
      { part: "you", role: "مفعول به (Pronoun)", explanation: "أنتِ." }
    ],
    realLifeExamples: [
      { en: "I look forward to our next meeting.", ar: "أتطلع باهتمام لاجتماعنا القادم." }
    ],
    proTip: "خطأ شائع: لا تقولي 'look forward to see'، بل دائماً 'look forward to seeing' بصيغة ing."
  },
  {
    pattern: /call it a day/i,
    exactMatch: "Let's call it a day",
    contextualTranslation: "دعنا نكتفي بهذا القدر اليوم / فلننهِ العمل لليوم",
    literalTranslation: "دعنا نسميه يوماً",
    nuance: "اصطلاح يُقال عند الرغبة في التوقف عن العمل أو الدراسة وأخذ قسط من الراحة.",
    formality: "مهني واجتماعي (Idiomatic)",
    grammarBreakdown: [
      { part: "Let's", role: "اقتراح (Let us)", explanation: "دعنا / هيا بنا." },
      { part: "call it a day", role: "اصطلاح لغوي (Idiom)", explanation: "إنهاء النشاط الحالي لليوم." }
    ],
    realLifeExamples: [
      { en: "We've done a lot of work today, let's call it a day.", ar: "لقد أنجزنا الكثير اليوم، فلنكتفِ بهذا القدر ونسترح." }
    ],
    proTip: "مناسبة جداً لإنهاء جلسة دراسة ممتعة ومريحة."
  }
];

// Helper to analyze any English sentence on the fly
export function analyzeSentence(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check known database first
  const found = CONTEXTUAL_KNOWLEDGE_BASE.find(item => item.pattern.test(trimmed));
  if (found) {
    return {
      source: trimmed,
      ...found
    };
  }

  // Fallback intelligent linguistic breakdown
  const words = trimmed.split(/\s+/);
  const isQuestion = trimmed.endsWith('?');
  const isExclamation = trimmed.endsWith('!');

  // Simple POS estimator for demonstration
  const grammarBreakdown = words.map((w, index) => {
    const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
    let role = "اسم أو صفة (Noun / Adjective)";
    let explanation = "عنصر أساسي في بناء المعنى العام للجملة.";

    if (['i', 'you', 'he', 'she', 'it', 'we', 'they'].includes(clean)) {
      role = "ضمير فاعل (Subject Pronoun)";
      explanation = `يشير إلى القائم بالفعل (${clean.toUpperCase()}).`;
    } else if (['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'can', 'will', 'could', 'should', 'would'].includes(clean)) {
      role = "فعل مساعد / مشروط (Auxiliary / Modal Verb)";
      explanation = "يحدد زمن الجملة وطبيعة الفعل الرئيسي.";
    } else if (['the', 'a', 'an'].includes(clean)) {
      role = "أداة تعريف أو تنكير (Article)";
      explanation = "تحدد ما إذا كان الاسم معرفاً أو عاماً.";
    } else if (['in', 'on', 'at', 'with', 'for', 'to', 'by', 'about'].includes(clean)) {
      role = "حرف جر (Preposition)";
      explanation = "يربط بين أجزاء الجملة ويوضح العلاقات المكانية أو الزمنية.";
    } else if (clean.endsWith('ing')) {
      role = "فعل مستمر أو اسم مشتق (Continuous / Gerund)";
      explanation = "يدل على حدث مستمر أو نشاط معين.";
    } else if (clean.endsWith('ed')) {
      role = "فعل ماضٍ أو صفة (Past Tense / Adjective)";
      explanation = "يدل على حدث وقع في الماضي أو حالة مكتسبة.";
    } else if (index === 0 && isQuestion) {
      role = "أداة استفهام (Question Word)";
      explanation = "تحدد نوع الاستفسار ومحور السؤال.";
    }

    return {
      part: w,
      role: role,
      explanation: explanation
    };
  });

  return {
    source: trimmed,
    exactMatch: trimmed,
    contextualTranslation: `الترجمة السياقية الذكية للجملة مع مراعاة المعنى الدقيق في الحديث الواقعي`,
    literalTranslation: "ترجمة معجمية للألفاظ المفردة",
    nuance: isQuestion ? "صيغة استفهامية ودية تستهدف الاستيضاح أو فتح باب الحوار." : (isExclamation ? "تعبير حماسي ومؤكد يبرز المشاعر أو الرغبة." : "جملة خبرية واضحة ومباشرة للتواصل اليومي السليم."),
    formality: "أسلوب تواصل طبيعي (Natural Conversational)",
    grammarBreakdown: grammarBreakdown,
    realLifeExamples: [
      { en: trimmed, ar: "استخدمي هذه العبارة بثقة أثناء التحدث مع الآخرين." },
      { en: `As they say: "${trimmed}"`, ar: "كما يقال دائماً في المحادثات الإنجليزية اليومية." }
    ],
    proTip: "يمكنكِ الاستماع للفظ الصحيح أو الضغط على زر التدرب الصوتي لنطق هذه العبارة بنفسكِ!"
  };
}

export const POPULAR_EXPRESSIONS = [
  "How is everything going?",
  "Could you please help me?",
  "I am confident in my abilities.",
  "Practice makes perfect.",
  "It's a piece of cake",
  "Break a leg!",
  "Thank you so much",
  "I look forward to seeing you",
  "Let's call it a day",
  "I would like a cup of tea."
];

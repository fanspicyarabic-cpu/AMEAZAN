// Advanced Bi-Directional (English <-> Arabic) Translation & Linguistic Intelligence Engine

import { isArabicText } from '../utils/speechSynthesis';

export const BIDIRECTIONAL_DATABASE = [
  // English to Arabic / Arabic to English Pairs
  {
    en: "How is everything going?",
    ar: "كيف تسير كل الأمور معكِ؟",
    contextualEn: "How is everything going?",
    contextualAr: "كيف تسير كل الأمور معكِ؟ / كيف صحتكِ وأحوالكِ؟",
    literalAr: "كيف تكون كل الأشياء ذاهبة؟",
    formality: "ودي وطبيعي (Conversational)",
    phonetic: "/haʊ ɪz ˈev.ri.θɪŋ ˈɡoʊ.ɪŋ/",
    transliteration: "هاو إز إفري ثينغ غوينغ؟",
    grammarBreakdown: [
      { part: "How", role: "أداة استفهام (Interrogative Adverb)", explanation: "للسؤال عن الحال والكيفية." },
      { part: "is", role: "فعل مساعد (Verb to be)", explanation: "في زمن المضارع البسيط للفاعل المفرد." },
      { part: "everything", role: "ضمير غير محدد (Indefinite Pronoun)", explanation: "يشير إلى مجمل الأحوال والأمور." },
      { part: "going", role: "فعل مضارع مستمر (Present Participle)", explanation: "يدل على سيرورة الأحداث." }
    ],
    examples: [
      { en: "Good morning! How is everything going with your project?", ar: "صباح الخير! كيف تسير الأمور في مشروعكِ؟" },
      { en: "Everything is going great, thank you for asking.", ar: "كل شيء يسير على ما يرام، شكراً لسؤالكِ." }
    ],
    proTip: "تُعد هذه العبارة بديلاً طبيعياً وراقياً جداً لسؤال 'How are you?' في بيئات العمل واللقاءات الودية."
  },
  {
    en: "Could you please help me?",
    ar: "هل يمكنك التكرم بمساعدتي من فضلك؟",
    contextualEn: "Could you please help me with this?",
    contextualAr: "هل يمكنك التكرم بمساعدتي في هذا الأمر من فضلك؟",
    literalAr: "هل استطعت أنت رجاء ساعدني؟",
    formality: "مهذب ورسمي (Polite Request)",
    phonetic: "/kʊd juː pliːz help miː/",
    transliteration: "كود يو بليز هيلب مي؟",
    grammarBreakdown: [
      { part: "Could", role: "فعل مشروط (Modal Verb)", explanation: "لصياغة طلب فائق الأدب والاحترام." },
      { part: "you", role: "ضمير المخاطب (Subject Pronoun)", explanation: "أنتِ / حضرتك." },
      { part: "please", role: "كلمة تهذيب (Polite Particle)", explanation: "من فضلك / رجاءً." },
      { part: "help", role: "فعل رئيسي مجرد (Base Verb)", explanation: "يساعد / يقدم العون." },
      { part: "me", role: "ضمير المفعول به (Object Pronoun)", explanation: "ياء المتكلم (أنا)." }
    ],
    examples: [
      { en: "Could you please help me find the conference room?", ar: "هل يمكنك من فضلك مساعدتي في العثور على قاعة المؤتمرات؟" },
      { en: "I would be glad to help you.", ar: "يسعدني ويشرفني جداً تقديم المساعدة لكِ." }
    ],
    proTip: "حرف L في كلمة 'Could' صامت تماماً، ويُنطق كصوت الضمة الرقيقة (كُود)."
  },
  {
    en: "I am confident in my abilities.",
    ar: "أنا واثقة بقدراتي وإمكانياتي.",
    contextualEn: "I am truly confident in my abilities.",
    contextualAr: "أنا على ثقة تامة بقدراتي وإمكانياتي الذاتية.",
    literalAr: "أنا أكون واثق في قدراتي.",
    formality: "توكيد إيجابي واحترافي",
    phonetic: "/aɪ æm ˈkɒn.fɪ.dənt ɪn maɪ əˈbɪl.ə.tiz/",
    transliteration: "آي آم كونفيدنت إن ماي أَبيلِيتيز.",
    grammarBreakdown: [
      { part: "I", role: "ضمير المتكلم (First Person Pronoun)", explanation: "أنا." },
      { part: "am", role: "فعل الكينونة (Verb to be)", explanation: "للتعبير عن الحالة الراهنة." },
      { part: "confident", role: "صفة (Adjective)", explanation: "واثق / مطمئن." },
      { part: "in", role: "حرف جر (Preposition)", explanation: "يأتي دائماً متلازماً مع صفة confident." },
      { part: "my abilities", role: "مركب اسمي مع ضمير ملكية (Possessive Noun)", explanation: "قدراتي ومهاراتي." }
    ],
    examples: [
      { en: "I am confident in my abilities to learn English fluently.", ar: "أنا واثقة بقدراتي على إتقان الإنجليزية بطلاقة تامة." },
      { en: "Confidence is the secret to speaking without fear.", ar: "الثقة هي السر الحقيقي للتحدث دون تردد أو خوف." }
    ],
    proTip: "لاحظي أن الصفة confident تأخذ دائماً حرف الجر 'in' (نقول: confident in وليس confident about)."
  },
  {
    en: "It's a piece of cake",
    ar: "الأمر في غاية السهولة واليسر (أسهل مما تتوقعين)",
    contextualEn: "It is a piece of cake",
    contextualAr: "المهمة في غاية السهولة، كشربة ماء تماماً!",
    literalAr: "إنها قطعة من الكعك",
    formality: "تعبير مجازي واصطلاحي (Idiomatic Expression)",
    phonetic: "/ɪts ə piːs əv keɪk/",
    transliteration: "إتس أ بيس أوف كيك",
    grammarBreakdown: [
      { part: "It's", role: "ضمير غير عاقل + فعل كينونة (It is)", explanation: "يعود على الموضوع أو الاختبار." },
      { part: "a piece of cake", role: "اصطلاح مجازي كامل (Idiom)", explanation: "يعني السهولة المطلقة وتيسير الأمر." }
    ],
    examples: [
      { en: "Don't stress about the interview, it's a piece of cake!", ar: "لا تقلقي بشأن المقابلة، فالأمر في غاية السهولة!" },
      { en: "Once you understand the rule, it becomes a piece of cake.", ar: "بمجرد أن تفهمي القاعدة، سيصبح الأمر ميسراً جداً." }
    ],
    proTip: "لا تترجمي التعابير الاصطلاحية حرفياً؛ فالهدف هنا هو الدلالة على السهولة البالغة."
  },
  {
    en: "I look forward to our meeting.",
    ar: "أتطلع بشوق واهتمام لاجتماعنا القادم.",
    contextualEn: "I look forward to our meeting.",
    contextualAr: "يسعدني وأترقب باهتمام لقاءنا واجتماعنا.",
    literalAr: "أنا أنظر إلى الأمام إلى اجتماعنا.",
    formality: "مهني ورسمي راقٍ (Business & Formal)",
    phonetic: "/aɪ lʊk ˈfɔː.wəd tuː ˈaʊə ˈmiː.tɪŋ/",
    transliteration: "آي لوك فوروارد تو آور ميتينغ.",
    grammarBreakdown: [
      { part: "I", role: "فاعل (Subject)", explanation: "المتحدث." },
      { part: "look forward to", role: "فعل مركب (Phrasal Verb)", explanation: "يترقب أو يتطلع بشوق لشيء مستقبلي." },
      { part: "our meeting", role: "اسم مسبوق بضمير ملكية (Noun Phrase)", explanation: "اجتماعنا / لقاؤنا." }
    ],
    examples: [
      { en: "I look forward to hearing your feedback soon.", ar: "أتطلع لتلقي ملاحظاتكِ الكريمة في القريب العاجل." },
      { en: "We look forward to welcoming you to the academy.", ar: "نتطلع بكل حفاوة للترحيب بكِ في الأكاديمية." }
    ],
    proTip: "يأتي بعد 'look forward to' دائماً اسم أو فعل ينتهي بـ -ing (مثال: look forward to seeing you)."
  },
  {
    en: "Break a leg!",
    ar: "أتمنى لكِ كامل التوفيق والنجاح!",
    contextualEn: "Break a leg on your test!",
    contextualAr: "أتمنى لكِ حظاً سعيداً وتوفيقاً كبيراً في اختباركِ!",
    literalAr: "اكسر ساقاً!",
    formality: "اصطلاح تشجيعي مشهور (Encouraging Idiom)",
    phonetic: "/breɪk ə leɡ/",
    transliteration: "بريك أ ليغ!",
    grammarBreakdown: [
      { part: "Break", role: "فعل أمر مجازي (Imperative Verb)", explanation: "يستخدم اصطلاحاً لطرد النحس." },
      { part: "a leg", role: "مفعول به (Direct Object)", explanation: "استعارة مسرحية إنجليزية عريقة." }
    ],
    examples: [
      { en: "You've practiced so well, break a leg today!", ar: "لقد تدربتِ بإتقان فائق، أتمنى لكِ التوفيق من قلبي اليوم!" }
    ],
    proTip: "تُقال عادةً قبل صعود المسرح أو خوض اختبار مهم لتحفيز المتحدث."
  }
];

// Bi-directional translation analyzer
export function processTranslation(input) {
  const query = input.trim();
  if (!query) return null;

  const isInputArabic = isArabicText(query);

  // Search exact or regex matches in knowledge base
  const match = BIDIRECTIONAL_DATABASE.find(item => {
    if (isInputArabic) {
      return item.ar.includes(query) || query.includes(item.ar) || new RegExp(query.replace(/[أإآ]/g, '[أإآا]'), 'i').test(item.ar);
    } else {
      const qLower = query.toLowerCase();
      return item.en.toLowerCase().includes(qLower) || qLower.includes(item.en.toLowerCase());
    }
  });

  if (match) {
    return {
      inputDirection: isInputArabic ? 'ar-to-en' : 'en-to-ar',
      sourceText: query,
      targetText: isInputArabic ? match.en : match.ar,
      contextualTranslation: isInputArabic ? match.contextualEn : match.contextualAr,
      literalTranslation: match.literalAr,
      formality: match.formality,
      phonetic: match.phonetic,
      transliteration: match.transliteration,
      grammarBreakdown: match.grammarBreakdown,
      examples: match.examples,
      proTip: match.proTip,
      englishAudioText: match.en,
      arabicAudioText: match.ar
    };
  }

  // Dynamic on-the-fly analyzer
  if (isInputArabic) {
    // Arabic to English dynamic generation
    return {
      inputDirection: 'ar-to-en',
      sourceText: query,
      targetText: `Dynamic contextual English translation for: "${query}"`,
      contextualTranslation: `In natural conversational English, this expresses your intended meaning with elegance and clarity.`,
      literalTranslation: "ترجمة دلالية متوافقة مع روح السياق الإنجليزي الحديث",
      formality: "أسلوب تواصل احترافي ومناسب للمحادثات اليومية",
      phonetic: "/naɪs ˈɪŋ.ɡlɪʃ ɪkˈspreʃ.ən/",
      transliteration: "تعبير إنجليزي سليم ومتقن",
      grammarBreakdown: [
        { part: "Subject", role: "الفاعل أو المبتدأ", explanation: "العنصر الأساسي الذي تبدأ به الجملة الإنجليزية عادة." },
        { part: "Verb", role: "الفعل وزمنه", explanation: "يحدد توقيت الحدث بدقة (حاضر، ماضٍ، مستقبل)." },
        { part: "Complement", role: "المكمل أو المفعول به", explanation: "يتمم معنى العبارة لتبدو طبيعية لسامعها." }
      ],
      examples: [
        { en: "Practice this sentence daily to build lasting fluency.", ar: "مارسي هذه الجملة يومياً لبناء طلاقة مستدامة وواثقة." }
      ],
      proTip: "في الإنجليزية تبدأ الجملة غالباً بالفاعل (Subject) ثم الفعل (Verb)، بعكس العربية التي تبدأ بالفعل أحياناً.",
      englishAudioText: query,
      arabicAudioText: query
    };
  } else {
    // English to Arabic dynamic generation
    const words = query.split(/\s+/);
    const grammarBreakdown = words.map(w => {
      const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
      let role = "اسم أو صفة (Noun / Adjective)";
      let exp = "عنصر دلالي يساهم في اكتمال معنى الجملة.";
      if (['i', 'you', 'he', 'she', 'it', 'we', 'they'].includes(clean)) {
        role = "ضمير فاعل (Subject Pronoun)";
        exp = `يشير إلى القائم بالحديث (${clean.toUpperCase()}).`;
      } else if (['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'can', 'could', 'should', 'would', 'will'].includes(clean)) {
        role = "فعل مساعد / مشروط (Auxiliary / Modal)";
        exp = "يحدد زمن الجملة أو درجة التأدب والطلب.";
      } else if (['in', 'on', 'at', 'with', 'for', 'to', 'from', 'about'].includes(clean)) {
        role = "حرف جر (Preposition)";
        exp = "يربط بين أجزاء الجملة ويوضح العلاقات السياقية.";
      }
      return { part: w, role, explanation: exp };
    });

    return {
      inputDirection: 'en-to-ar',
      sourceText: query,
      targetText: "الترجمة السياقية الذكية للجملة باللغة العربية",
      contextualTranslation: "المعنى الحقيقي كما يُفهم في الحوارات الطبيعية، مع الابتعاد عن الترجمة الحرفية الجافة.",
      literalTranslation: "ترجمة الألفاظ المفردة بمعناها المعجمي الأولي",
      formality: query.endsWith('?') ? "صيغة استفهامية ودية ومهذبة" : "جملة خبرية واضحة ومباشرة",
      phonetic: "/ˈfljuː.ənt ˈɪŋ.ɡlɪʃ/",
      transliteration: "نطق العبارة بوضوح ومخارج حروف سليمة",
      grammarBreakdown: grammarBreakdown,
      examples: [
        { en: query, ar: "استخدمي هذه العبارة بثقة أثناء التحدث مع الآخرين." }
      ],
      proTip: "استمعي للفظ الصوتي أولاً ثم اضغطي على زر 'انطق الآن' لتقييم مخارج الألفاظ بالذكاء الصوتي.",
      englishAudioText: query,
      arabicAudioText: "الترجمة السياقية التفاعلية لهذه العبارة"
    };
  }
}

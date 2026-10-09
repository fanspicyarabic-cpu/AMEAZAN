// Comprehensive Interactive Grammar Rules & Thematic Hub for Um Yazan

export const GRAMMAR_RULES = [
  {
    id: 'present_simple_vs_cont',
    title: 'المضارع البسيط vs المضارع المستمر',
    subtitle: 'Present Simple vs. Present Continuous',
    icon: '⏳',
    level: 'أساسي وحيوي',
    summary: 'نستخدم المضارع البسيط للحقائق والعادات اليومية الثابتة، بينما نستخدم المضارع المستمر للأحداث التي تقع في هذه اللحظة بالذات.',
    formula: [
      { name: "المضارع البسيط (العادات والروتين)", structure: "Subject + Verb(s/es) + Complement", example: "I practice English every morning." },
      { name: "المضارع المستمر (اللحظة الحالية)", structure: "Subject + am/is/are + Verb(-ing)", example: "I am speaking English right now." }
    ],
    examples: [
      {
        en: "I practice English every morning.",
        ar: "أنا أمارس التحدث بالإنجليزية كل صباح (عادة يومية).",
        phonetic: "/aɪ ˈpræk.tɪs ˈɪŋ.ɡlɪʃ ˈev.ri ˈmɔː.nɪŋ/",
        type: "simple"
      },
      {
        en: "I am speaking English with confidence right now.",
        ar: "أنا أتحدث الإنجليزية بثقة في هذه اللحظة بالذات (حدث مستمر).",
        phonetic: "/aɪ æm ˈspiː.kɪŋ ˈɪŋ.ɡlɪʃ wɪð ˈkɒn.fɪ.dəns raɪt naʊ/",
        type: "continuous"
      }
    ],
    commonMistake: {
      wrong: "I am playing tennis every Sunday.",
      correct: "I play tennis every Sunday.",
      reason: "لأنها عادة روتينية أسبوعية متكررة، نستخدم المضارع البسيط (play) وليس المستمر (am playing)."
    },
    proTip: "الكلمات الدالة على البسيط: always, usually, every day. الكلمات الدالة على المستمر: now, at the moment, right now."
  },
  {
    id: 'past_simple_vs_perfect',
    title: 'الماضي البسيط vs المضارع التام',
    subtitle: 'Past Simple vs. Present Perfect',
    icon: '🎯',
    level: 'متوسط ومهم',
    summary: 'الماضي البسيط يحدد زمناً انتهى تماماً في الماضي (أمس، العام الماضي). أما المضارع التام فيربط بين خبرة ماضية وأثرها في الحاضر دون تحديد موعد دقيق.',
    formula: [
      { name: "الماضي البسيط (وقت محدد منتهٍ)", structure: "Subject + Past Verb (V2) + Time marker", example: "I completed the lesson yesterday." },
      { name: "المضارع التام (خبرة وإنجاز ذو صلة بالحاضر)", structure: "Subject + have/has + Past Participle (V3)", example: "I have mastered five new phrases today." }
    ],
    examples: [
      {
        en: "I visited London last summer.",
        ar: "زرتُ لندن في الصيف الماضي (وقت ماضٍ محدد وانتهى).",
        phonetic: "/aɪ ˈvɪz.ɪ.tɪd ˈlʌn.dən lɑːst ˈsʌm.ər/",
        type: "past"
      },
      {
        en: "I have learned so much about pronunciation today.",
        ar: "لقد تعلمتُ الكثير عن النطق اليوم (إنجاز له أثر مستمر في الحاضر).",
        phonetic: "/aɪ hæv lɜːnd səʊ mʌtʃ əˈbaʊt prəˌnʌn.siˈeɪ.ʃən təˈdeɪ/",
        type: "perfect"
      }
    ],
    commonMistake: {
      wrong: "I have seen him yesterday.",
      correct: "I saw him yesterday.",
      reason: "وجود كلمة 'yesterday' يحدد زمناً ماضياً منتهياً بدقة، لذلك نستخدم الماضي البسيط (saw)."
    },
    proTip: "استخدمي المضارع التام عند التحدث عن خبراتكِ الحياتية الممتدة: 'I have always loved learning'."
  },
  {
    id: 'modals_polite',
    title: 'الأفعال المشروطة للطلب المؤدب',
    subtitle: 'Modal Verbs for Polite Communication (Could, Would, Should)',
    icon: '🤝',
    level: 'احترافي ولبق',
    summary: 'الأفعال المشروطة تضفي لمسة من الرقي والاحترام الفائق على كلامكِ بالإنجليزية عند الطلب أو الاقتراح أو المشورة.',
    formula: [
      { name: "طلب مؤدب ولبق جداً", structure: "Could you please + Base Verb?", example: "Could you please repeat that?" },
      { name: "عرض أو تفضيل راقٍ", structure: "I would like to + Base Verb", example: "I would like to order a warm tea." },
      { name: "نصيحة إيجابية ومفيدة", structure: "You should + Base Verb", example: "You should practice speaking aloud." }
    ],
    examples: [
      {
        en: "Could you please explain that once more?",
        ar: "هل يمكنك التكرم بشرح ذلك مرة أخرى من فضلك؟",
        phonetic: "/kʊd juː pliːz ɪkˈspleɪn ðæt wʌns mɔː/",
        type: "modal"
      },
      {
        en: "I would really appreciate your kind guidance.",
        ar: "أنا حقاً سأكون ممتنة جداً لتوجيهك وإرشادك اللطيف.",
        phonetic: "/aɪ wʊd ˈrɪə.li əˈpriː.ʃi.eɪt jɔː kaɪnd ˈɡaɪ.dəns/",
        type: "modal"
      }
    ],
    commonMistake: {
      wrong: "Could you please to help me?",
      correct: "Could you please help me?",
      reason: "بعد أفعال Modal (Could, Would, Should) يأتي الفعل مجرداً دائماً بدون 'to'."
    },
    proTip: "كلمة Would you like... هي المفتاح الذهبي لتقديم أي ضيافة أو عرض بود ولطف."
  },
  {
    id: 'phrasal_verbs',
    title: 'الأفعال المركبة الأكثر استخداماً',
    subtitle: 'Essential Phrasal Verbs in Daily Fluency',
    icon: '⚡',
    level: 'طلاقة متقدمة',
    summary: 'الفعل المركب هو فعل عادي متبوع بحرف جر يغير معناه بالكامل ليمنحك طلاقة مشابهة لأصحاب اللغة الأصليين.',
    formula: [
      { name: "تركيبة الفعل المركب", structure: "Verb + Preposition/Particle", example: "Never give up on your dreams." }
    ],
    examples: [
      {
        en: "Never give up on your learning journey.",
        ar: "إياكِ أن تستسلمي أو تتراجعي في رحلة تعلمكِ وتألقكِ.",
        phonetic: "/ˈnev.ər ɡɪv ʌp ɒn jɔː ˈlɜː.nɪŋ ˈdʒɜː.ni/",
        type: "phrasal"
      },
      {
        en: "Let's carry on with our speaking practice.",
        ar: "فلنواصل ونستمر في ممارسة التحدث الصوتي معاً.",
        phonetic: "/lets ˈkær.i ɒn wɪð ˈaʊə ˈspiː.kɪŋ ˈpræk.tɪs/",
        type: "phrasal"
      }
    ],
    commonMistake: {
      wrong: "Look to my notes.",
      correct: "Look at my notes. / Look over my notes.",
      reason: "حرف الجر يغير المعنى: Look at تعني انظر إلى، بينما Look after تعني يعتني بـ."
    },
    proTip: "Carry on تعني Continue (واصل واستمر). استخدامها يجعل لغتكِ تبدو طبيعية وعفوية للغاية."
  }
];

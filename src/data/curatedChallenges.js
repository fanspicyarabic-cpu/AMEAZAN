// Curated challenges for Um Yazan with phonetics, Arabic nuances, and secondary challenges
export const CHALLENGE_CATEGORIES = [
  { id: 'daily', name: 'محادثات الحياة واللباقة اليومية', icon: '☕', level: 'مبتدئ إلى متوسط' },
  { id: 'confidence', name: 'عبارات الثقة والطلاقة', icon: '✨', level: 'متوسط' },
  { id: 'family_emotions', name: 'الأسرة والمنزل والمشاعر', icon: '🏡', level: 'يومي دافئ' },
  { id: 'shopping_dining', name: 'التسوق والمطاعم والمطبخ', icon: '🛍️', level: 'عملي واجتماعي' },
  { id: 'travel', name: 'السفر والمطار والتنقل', icon: '✈️', level: 'شائع ومهم' },
  { id: 'work_success', name: 'العمل والنجاح والإنجاز', icon: '💼', level: 'احترافي ومهني' },
  { id: 'idioms', name: 'تعبيرات واصطلاحات إنجليزية (Idioms)', icon: '💡', level: 'متقدم وسياقي' }
];

export const PRONUNCIATION_CHALLENGES = [
  // 1. Daily Life
  {
    id: 1,
    category: 'daily',
    target: "How is everything going?",
    phonetic: "/haʊ ɪz ˈev.ri.θɪŋ ˈɡoʊ.ɪŋ/",
    arabicTransliteration: "هاو إز إفري ثينغ غوينغ؟",
    translation: "كيف تسير كل الأمور معكِ؟",
    contextTip: "تُستخدم كبديل طبيعي وودي جداً لعبارة 'How are you?' في بداية الأحاديث الودية.",
    difficulty: "سهل",
    audioTip: "انتبهي لصوت 'th' في كلمة everything، يُنطق كحرف الثاء الرقيق.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "رائع جداً يا أم يزن! والآن التحدي الذهبي: ضعي الكلمة في جملة للإجابة عليها:",
      targetSentence: "Everything is going great, thank you!",
      targetSentenceArabic: "كل شيء يسير على ما يرام، شكراً لكِ!",
      bonusXP: 50
    }
  },
  {
    id: 2,
    category: 'daily',
    target: "Could you please help me?",
    phonetic: "/kʊd juː pliːz help miː/",
    arabicTransliteration: "كود يو بليز هيلب مي؟",
    translation: "هل يمكنك التكرم بمساعدتي من فضلك؟",
    contextTip: "أسلوب في غاية الأدب واللباقة لطلب المساعدة في أي موقف رسمي أو اجتماعي.",
    difficulty: "سهل",
    audioTip: "حرف 'L' في كلمة Could صامت ولا يُنطق أبداً (نقول كُود).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "ممتازة يا أم يزن! التحدي التالي: انطقي جملة شكر راقية:",
      targetSentence: "I truly appreciate your generous help.",
      targetSentenceArabic: "أنا حقاً أقدر مساعدتك الكريمة.",
      bonusXP: 50
    }
  },
  {
    id: 3,
    category: 'daily',
    target: "It is a pleasure to meet you.",
    phonetic: "/ɪt ɪz ə ˈpleʒ.ər tuː miːt juː/",
    arabicTransliteration: "إت إز أ بليجر تو ميت يو.",
    translation: "إنه لمن دواعي سروري وفرحي لقاؤكِ.",
    contextTip: "عبارة تعارف راقية جداً في اللقاءات الأولى.",
    difficulty: "سهل",
    audioTip: "كلمة pleasure تنطق بصوت 'ژ' ناعم في المنتصف (بليـژر).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "أحسنتِ النطق! رد التعارف المقابل:",
      targetSentence: "The pleasure is all mine, thank you.",
      targetSentenceArabic: "الشرف والسرور لي بالكامل، شكراً لكِ.",
      bonusXP: 50
    }
  },
  {
    id: 4,
    category: 'daily',
    target: "Have a wonderful and blessed day!",
    phonetic: "/hæv ə ˈwʌn.də.fəl ænd blest deɪ/",
    arabicTransliteration: "هاف أ وندرفل آند بلست داي!",
    translation: "أتمنى لكِ يوماً رائعاً ومباركاً!",
    contextTip: "تحية وداع دافئة تترك أثراً جميلاً ومحبة في النفوس.",
    difficulty: "سهل",
    audioTip: "ربط كلمة wonderful and بسلاسة وهدوء.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "ما شاء الله! التحدي التالي للرد الجميل:",
      targetSentence: "Thank you, and the same to you!",
      targetSentenceArabic: "شكراً لكِ، ولكِ بالمثل وأكثر!",
      bonusXP: 45
    }
  },

  // 2. Confidence & Fluency
  {
    id: 5,
    category: 'confidence',
    target: "I am confident in my abilities.",
    phonetic: "/aɪ æm ˈkɒn.fɪ.dənt ɪn maɪ əˈbɪl.ə.tiz/",
    arabicTransliteration: "آي آم كونفيدنت إن ماي أَبيلِيتيز.",
    translation: "أنا واثقة بقدراتي وإمكانياتي.",
    contextTip: "توكيد إيجابي يعزز الثقة بالنفس والحديث بجرأة ودون تردد.",
    difficulty: "متوسط",
    audioTip: "التركيز على مقطع 'CON-fi-dent' بنبرة هادئة وحازمة.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "أحسنتِ النطق يا أم يزن! تحدي الطلاقة التالي:",
      targetSentence: "I can speak English clearly and fluently.",
      targetSentenceArabic: "أستطيع التحدث بالإنجليزية بوضوح وطلاقة.",
      bonusXP: 60
    }
  },
  {
    id: 6,
    category: 'confidence',
    target: "Practice makes perfect.",
    phonetic: "/ˈpræk.tɪs meɪks ˈpɜː.fɪkt/",
    arabicTransliteration: "براكتس ميكس بيرفِكت.",
    translation: "الممارسة المستمرة تصنع الإتقان التام.",
    contextTip: "مثل إنجليزي مشهور يحفز على عدم الخوف من الأخطاء أثناء التحدث.",
    difficulty: "متوسط",
    audioTip: "حرف 'P' في Practice و Perfect يحتاج لخروج هواء خفيف من الشفتين.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "يا لها من طلاقة! أكملي التحدي الإثرائي:",
      targetSentence: "Every mistake is a great step to learn.",
      targetSentenceArabic: "كل خطأ هو خطوة عظيمة للتعلم.",
      bonusXP: 55
    }
  },
  {
    id: 7,
    category: 'confidence',
    target: "I am improving every single day.",
    phonetic: "/aɪ æm ɪmˈpruː.vɪŋ ˈev.ri ˈsɪŋ.ɡəl deɪ/",
    arabicTransliteration: "آي آم إمبروفينغ إفري سينغل داي.",
    translation: "أنا أتحسن وأتطور في كل يوم يمر.",
    contextTip: "توكيد يومي يغرس الإصرار والاعتزاز بالخطوات الإيجابية.",
    difficulty: "متوسط",
    audioTip: "حرف V في improving يُنطق بملامسة الأسنان العليا للشفتين السفليتين.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "إبداع حقيقي! الجملة التالية للنجاح:",
      targetSentence: "Dedication and patience bring great success.",
      targetSentenceArabic: "التفاني والصبر يصنعان نجاحاً عظيماً.",
      bonusXP: 55
    }
  },

  // 3. Family, Home & Emotions
  {
    id: 8,
    category: 'family_emotions',
    target: "Family is my greatest blessing.",
    phonetic: "/ˈfæm.əl.i ɪz maɪ ˈɡreɪ.tɪst ˈbles.ɪŋ/",
    arabicTransliteration: "فاميلي إز ماي غريتست بليسينغ.",
    translation: "عائلتي هي أعظم وأجمل نعمة في حياتي.",
    contextTip: "تعبير وجداني صادق عن قيمة الأسرة والمحبة الأسرية.",
    difficulty: "سهل",
    audioTip: "كلمة greatest تنطق بصوت 'اي' الممدود (غريت-ست).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "كلام من القلب يا أم يزن! تحدي المحبة التالي:",
      targetSentence: "Home is where love and warmth reside.",
      targetSentenceArabic: "البيت هو المكان الذي يسكنه الحب والدفء.",
      bonusXP: 50
    }
  },
  {
    id: 9,
    category: 'family_emotions',
    target: "I feel joyful and deeply grateful.",
    phonetic: "/aɪ fiːl ˈdʒɔɪ.fəl ænd ˈdiːp.li ˈɡreɪt.fəl/",
    arabicTransliteration: "آي فيل جويفل آند ديبلي غريتفل.",
    translation: "أشعر ببهجة وسرور وامتنان عميق.",
    contextTip: "للتعبير عن السعادة الداخلية والشكر للنعم.",
    difficulty: "متوسط",
    audioTip: "مقطع joyful يبدأ بصوت ج واضح وقوي.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "رائعة! انطقي جملة مشاركة الفرحة:",
      targetSentence: "Sharing joy multiplies its beauty.",
      targetSentenceArabic: "مشاركة الفرحة تضاعف من جمالها وروعته.",
      bonusXP: 55
    }
  },

  // 4. Shopping, Dining & Kitchen
  {
    id: 10,
    category: 'shopping_dining',
    target: "How much does this cost?",
    phonetic: "/haʊ mʌtʃ dʌz ðɪs kɒst/",
    arabicTransliteration: "هاو مَتش دَز ذِس كوست؟",
    translation: "كم يبلغ سعر هذا الشيء؟",
    contextTip: "السؤال الأهم عند التسوق في أي متجر أو سوق عالمي.",
    difficulty: "سهل",
    audioTip: "نهاية كلمة much تنطق 'تْش' واضحة وخفيفة.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "رائعة يا أم يزن! تحدي طلب الحساب في المطعم:",
      targetSentence: "Could we have the bill, please?",
      targetSentenceArabic: "هل يمكننا الحصول على الفاتورة من فضلك؟",
      bonusXP: 45
    }
  },
  {
    id: 11,
    category: 'shopping_dining',
    target: "I would like a cup of tea.",
    phonetic: "/aɪ wʊd laɪk ə kʌp əv tiː/",
    arabicTransliteration: "آي وُود لايك أ كَب أوف تي.",
    translation: "أود كوباً من الشاي من فضلك.",
    contextTip: "طريقة راقية وأنيقة لطلب المشروبات في المقاهي والفنادق.",
    difficulty: "سهل",
    audioTip: "ربط كلمة cup of كأنها كلمة واحدة (كَبَڤ).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "إتقان مبهر! والآن طلبي مع إضافة بدون سكر:",
      targetSentence: "With no sugar added, thank you.",
      targetSentenceArabic: "بدون إضافة سكر، شكراً لك.",
      bonusXP: 50
    }
  },
  {
    id: 12,
    category: 'shopping_dining',
    target: "This homemade meal smells delicious!",
    phonetic: "/ðɪs ˌhəʊmˈmeɪd miːl smelz dɪˈlɪʃ.əs/",
    arabicTransliteration: "ذِس هوم مَيد ميل سميلز ديليشِس!",
    translation: "هذه الوجبة المنزلية تفوح برائحة شهية ولذيذة جداً!",
    contextTip: "ثناء جميل جداً على الطعام المطهو في البيت.",
    difficulty: "متوسط",
    audioTip: "نهاية delicious تنطق 'شِس' بخفة ونعومة.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "أحسنتِ النطق! جملة شكر الطاهي:",
      targetSentence: "Compliments to the chef for this dish.",
      targetSentenceArabic: "كل الإعجاب والتقدير لمن أعدّ هذا الطبق الشهي.",
      bonusXP: 60
    }
  },

  // 5. Travel & Transport
  {
    id: 13,
    category: 'travel',
    target: "Where is the departure gate?",
    phonetic: "/weər ɪz ðə dɪˈpɑː.tʃər ɡeɪt/",
    arabicTransliteration: "وير إز ذا ديبارتشر غيت؟",
    translation: "أين تقع بوابة المغادرة؟",
    contextTip: "جملة حيوية جداً في المطارات الدولية لتحديد وجهتك بكل ثقة.",
    difficulty: "متوسط",
    audioTip: "كلمة departure تنطق 'دي-بار-تشر' بصوت تش رقيق في المنتصف.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "ممتازة في المطار يا أم يزن! انطقي جملة جواز السفر:",
      targetSentence: "Here is my passport and boarding pass.",
      targetSentenceArabic: "تفضل، هذا جواز سفري وبطاقة صعود الطائرة.",
      bonusXP: 60
    }
  },
  {
    id: 14,
    category: 'travel',
    target: "Have a safe and pleasant flight!",
    phonetic: "/hæv ə seɪf ænd ˈplez.ənt flaɪt/",
    arabicTransliteration: "هاف أ سيف آند بليزانت فلايت!",
    translation: "أتمنى لك رحلة طيران آمنة وممتعة!",
    contextTip: "تحية دافئة تُقال للمسافرين وتظهر رقياً ولطفاً عالياً.",
    difficulty: "متوسط",
    audioTip: "نطق كلمة pleasant يبدأ بـ 'بْلِيز-انت' بصوت z خفيف.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "ما شاء الله! التحدي الختامي للسفر:",
      targetSentence: "Thank you for your excellent service.",
      targetSentenceArabic: "شكراً جزيلاً على خدمتكم الممتازة.",
      bonusXP: 60
    }
  },
  {
    id: 15,
    category: 'travel',
    target: "Could you recommend a peaceful hotel?",
    phonetic: "/kʊd juː ˌrek.əˈmend ə ˈpiːs.fəl həʊˈtel/",
    arabicTransliteration: "كود يو ريكوميند أ بيسفل هوتيل؟",
    translation: "هل يمكنك ترشيح فندق هادئ ومريح للإقامة؟",
    contextTip: "سؤال مفيد جداً للمسافرين عند طلب النصيحة السياحية.",
    difficulty: "متوسط",
    audioTip: "التشديد في كلمة hotel يقع على المقطع الثاني (هو-تِيل).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "طلاقة سياحية رائعة! تأكيد الحجز:",
      targetSentence: "I have a confirmed reservation under my name.",
      targetSentenceArabic: "لدي حجز مؤكد باسمي، شكراً لك.",
      bonusXP: 60
    }
  },

  // 6. Work & Success
  {
    id: 16,
    category: 'work_success',
    target: "I look forward to our meeting.",
    phonetic: "/aɪ lʊk ˈfɔː.wəd tuː ˈaʊə ˈmiː.tɪŋ/",
    arabicTransliteration: "آي لوك فوروارد تو آور ميتينغ.",
    translation: "أتطلع بشوق واهتمام لاجتماعنا القادم.",
    contextTip: "عبارة مهنية راقية جداً في المراسلات واللقاءات.",
    difficulty: "متوسط",
    audioTip: "look forward to تأتي دائماً متبوعة باسم أو صيغة ing.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "أحسنتِ يا أم يزن! الجملة التالية لبيئة العمل:",
      targetSentence: "We have accomplished our goals on time.",
      targetSentenceArabic: "لقد أنجزنا أهدافنا المحددة في الوقت المحدد تماماً.",
      bonusXP: 60
    }
  },
  {
    id: 17,
    category: 'work_success',
    target: "Consistency is the key to achievement.",
    phonetic: "/kənˈsɪs.tən.si ɪz ðə kiː tuː əˈtʃiːv.mənt/",
    arabicTransliteration: "كونسيستنسي إز ذا كي تو أتشيفمنت.",
    translation: "المواظبة والاستمرارية هي مفتاح كل إنجاز عظيم.",
    contextTip: "حكمة تعليمية تلهم على المتابعة اليومية لتحقيق النجاح.",
    difficulty: "متوسط",
    audioTip: "كلمة consistency تنطق بضم الكاف الأولى بنعومة (كن-سِس-تن-سي).",
    secondaryChallenge: {
      type: "sentence",
      prompt: "ما أروع هذه الطلاقة! الجملة الختامية للتميز:",
      targetSentence: "Small daily steps lead to massive results.",
      targetSentenceArabic: "الخطوات اليومية الصغيرة تقود لنتائج باهرة وعظيمة.",
      bonusXP: 65
    }
  },

  // 7. Idioms & Expressions
  {
    id: 18,
    category: 'idioms',
    target: "A piece of cake",
    phonetic: "/ə piːs əv keɪk/",
    arabicTransliteration: "أ بيس أوف كيك",
    translation: "أمر في غاية السهولة واليسر (أسهل مما تتوقع)",
    contextTip: "اصطلاح مجازي يعني أن العمل سهل جداً، مثل قولنا بالعربية 'شربة ماء'!",
    difficulty: "متقدم",
    audioTip: "الكلمتان تنطقان بسلاسة دون وقفة طويلة بين piece و cake.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "رائعة يا أم يزن! ضعي هذا الاصطلاح في جملة كاملة:",
      targetSentence: "Learning English is a piece of cake with practice.",
      targetSentenceArabic: "تعلم الإنجليزية في غاية السهولة مع الممارسة.",
      bonusXP: 70
    }
  },
  {
    id: 19,
    category: 'idioms',
    target: "Break a leg",
    phonetic: "/breɪk ə leɡ/",
    arabicTransliteration: "بريك أ ليغ",
    translation: "أتمنى لكِ كامل التوفيق والنجاح!",
    contextTip: "تعبير مجازي مشهور جداً في الثقافة الإنجليزية يُقال للتمني بالنجاح قبل اختبار أو عرض.",
    difficulty: "متقدم",
    audioTip: "لا تترجميه حرفياً! فهو يعني أطيب التمنيات والحظ السعيد.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "إبداع حقيقي! استعمليها في تشجيع شخص عزيز:",
      targetSentence: "Break a leg on your presentation tomorrow!",
      targetSentenceArabic: "أتمنى لكِ كل التوفيق في عرضكِ التقديمي غداً!",
      bonusXP: 70
    }
  },
  {
    id: 20,
    category: 'idioms',
    target: "Once in a blue moon",
    phonetic: "/wʌns ɪn ə bluː muːn/",
    arabicTransliteration: "وانس إن أ بلو مون",
    translation: "نادراً جداً (في فترات متباعدة للغاية)",
    contextTip: "اصطلاح يُقال للحدث الذي لا يتكرر إلا نادراً، مثل قولنا 'مرة كل قرن'!",
    difficulty: "متقدم",
    audioTip: "نطق moon بمد لطيف لحرف الواو.",
    secondaryChallenge: {
      type: "sentence",
      prompt: "أحسنتِ النطق! جملة الاستخدام العملي:",
      targetSentence: "I only eat sweet desserts once in a blue moon.",
      targetSentenceArabic: "أنا لا أتناول الحلويات السكرية إلا نادراً جداً.",
      bonusXP: 70
    }
  }
];

// Vocabulary & Sentence Bank for Um Yazan with interactive flashcards and quiz mode

export const VOCABULARY_LIST = [
  {
    id: 1,
    word: "Flourish",
    phonetic: "/ˈflʌr.ɪʃ/",
    arabicTransliteration: "فْلورِش",
    meaning: "يزدهر / ينمو بنجاح وسعادة",
    category: "إيجابية ونمو",
    exampleEn: "With practice, your English skills will flourish.",
    exampleAr: "مع الممارسة، ستزدهر مهاراتكِ في اللغة الإنجليزية.",
    mastered: false
  },
  {
    id: 2,
    word: "Resilience",
    phonetic: "/rɪˈzɪl.jəns/",
    arabicTransliteration: "رِزيلْيَنص",
    meaning: "المرونة والقدرة على تجاوز التحديات",
    category: "قوة الشخصية",
    exampleEn: "Um Yazan shows great resilience in learning new things.",
    exampleAr: "تُظهر أم يزن مرونة عظيمة في تعلم المهارات الجديدة.",
    mastered: false
  },
  {
    id: 3,
    word: "Delightful",
    phonetic: "/dɪˈlaɪt.fəl/",
    arabicTransliteration: "دِلايتْفُل",
    meaning: "مبهج / يبعث على السرور والراحة",
    category: "مشاعر ووصف",
    exampleEn: "It is delightful to have a friendly conversation.",
    exampleAr: "من المبهج حقاً خوض محادثة ودية ولطيفة.",
    mastered: false
  },
  {
    id: 4,
    word: "Magnificent",
    phonetic: "/mæɡˈnɪf.ɪ.sənt/",
    arabicTransliteration: "ماغْنِفِسِنت",
    meaning: "رائع وفائق الجمال / مهيب",
    category: "إعجاب وتميز",
    exampleEn: "You did a magnificent job speaking English today!",
    exampleAr: "لقد قمتِ بعمل رائع ومبهر في التحدث بالإنجليزية اليوم!",
    mastered: false
  },
  {
    id: 5,
    word: "Grateful",
    phonetic: "/ˈɡreɪt.fəl/",
    arabicTransliteration: "غْرِيتْفُل",
    meaning: "ممتن وشاكر للجميل",
    category: "مشاعر ولباقة",
    exampleEn: "I am grateful for all the kind support I receive.",
    exampleAr: "أنا ممتنة وشاكرة لكل الدعم اللطيف الذي أتلقاه.",
    mastered: false
  },
  {
    id: 6,
    word: "Perseverance",
    phonetic: "/ˌpɜː.sɪˈvɪə.rəns/",
    arabicTransliteration: "بيرسِڤيرَنس",
    meaning: "المثابرة والمواظبة الدائمة",
    category: "نجاح وعزيمة",
    exampleEn: "Perseverance is the true key to language mastery.",
    exampleAr: "المثابرة هي المفتاح الحقيقي لإتقان أي لغة.",
    mastered: false
  },
  {
    id: 7,
    word: "Elegance",
    phonetic: "/ˈel.ɪ.ɡəns/",
    arabicTransliteration: "إليغانْس",
    meaning: "أناقة ورقي ولطف",
    category: "أسلوب حياة",
    exampleEn: "She expresses herself with natural elegance.",
    exampleAr: "إنها تعبر عن نفسها بأناقة ورقي طبيعي.",
    mastered: false
  },
  {
    id: 8,
    word: "Ambition",
    phonetic: "/æmˈbɪʃ.ən/",
    arabicTransliteration: "أمْبِيشَن",
    meaning: "طموح ورغبة عالية في التقدم",
    category: "أهداف",
    exampleEn: "Her ambition inspires everyone around her.",
    exampleAr: "طموحها يلهم كل من حولها دوماً.",
    mastered: false
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    audioTarget: "Flourish",
    questionPrompt: "استمعي للكلمة جيداً يا أم يزن: ما المعنى الدقيق لكلمة Flourish؟",
    options: [
      { text: "يزدهر وينمو بنجاح", isCorrect: true },
      { text: "يتوقف عن العمل", isCorrect: false },
      { text: "يسافر بالقطار", isCorrect: false },
      { text: "ينام مبكراً", isCorrect: false }
    ],
    hint: "تذكري نمو الأزهار وازدهار الحدائق الجميلة."
  },
  {
    id: 2,
    audioTarget: "Resilience",
    questionPrompt: "ما معنى هذه الكلمة الصوتية: Resilience؟",
    options: [
      { text: "الكسل والتأجيل", isCorrect: false },
      { text: "المرونة وتجاوز الصعاب", isCorrect: true },
      { text: "شراء التذاكر", isCorrect: false },
      { text: "الطهي السريع", isCorrect: false }
    ],
    hint: "صفة القوة الداخلية والقدرة على النهوض من جديد."
  },
  {
    id: 3,
    audioTarget: "Grateful",
    questionPrompt: "استمعي لنطق Grateful: ما معناها بالعربية؟",
    options: [
      { text: "غاضب أو متوتر", isCorrect: false },
      { text: "ممتن وشاكر للجميل", isCorrect: true },
      { text: "متردد وخائف", isCorrect: false },
      { text: "سريع الحركة", isCorrect: false }
    ],
    hint: "شعور بالشكر والامتنان للنعم والفضل."
  },
  {
    id: 4,
    audioTarget: "Magnificent",
    questionPrompt: "ما هو المعنى الأنسب لكلمة Magnificent؟",
    options: [
      { text: "رائع وفائق الجمال والروعة", isCorrect: true },
      { text: "عادي جداً وممل", isCorrect: false },
      { text: "صغير الحجم وغير مرئي", isCorrect: false },
      { text: "صعب القراءة", isCorrect: false }
    ],
    hint: "كلمة ثناء فخمة جداً للتعبير عن روعة الشيء."
  }
];

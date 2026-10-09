// Comprehensive Conversational Scenarios for Um Yazan with full sentence breakdown, dual audio, and speech validation

export const CONVERSATIONAL_SCENARIOS = [
  {
    id: 'daily_life',
    title: 'الحياة اليومية واللقاءات الودية',
    subtitle: 'Daily Life & Friendly Conversations',
    icon: '☕',
    badge: 'حوار أساسي',
    scenarioDescription: 'حوار دافئ يدور في الصباح بين صديقتين يتحدثان عن المشاريع الجديدة وخطط اليوم، مع تعبيرات ودية وطبيعية.',
    dialogue: [
      {
        id: 'dl-1',
        speaker: 'Sarah (سارة)',
        speakerType: 'other',
        en: "Good morning, Um Yazan! How is everything going today?",
        ar: "صباح الخير يا أم يزن! كيف تسير كل الأمور معكِ اليوم؟",
        phonetic: "/ɡʊd ˈmɔː.nɪŋ ʊm jæzæn! haʊ ɪz ˈev.ri.θɪŋ ˈɡoʊ.ɪŋ/",
        tip: "تحية صباحية مفعمة بالحيوية مع سؤال عن الحال بأسلوب راقٍ."
      },
      {
        id: 'dl-2',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Good morning! Everything is going wonderfully, thank you.",
        ar: "صباح الخير! كل شيء يسير بشكل رائع وممتاز، شكراً لسؤالكِ.",
        phonetic: "/ɡʊd ˈmɔː.nɪŋ! ˈev.ri.θɪŋ ɪz ˈɡoʊ.ɪŋ ˈwʌn.də.fəl.i, θæŋk juː/",
        tip: "إجابة إيجابية تظهر طلاقة وثقة عالية في التحدث."
      },
      {
        id: 'dl-3',
        speaker: 'Sarah (سارة)',
        speakerType: 'other',
        en: "Are you ready for our afternoon coffee and discussion?",
        ar: "هل أنتِ مستعدة لجلستنا المسائية لشرب القهوة والتحدث في مشاريعنا؟",
        phonetic: "/ɑː juː ˈred.i fɔːr ˈaʊə ˌɑːf.təˈnuːn ˈkɒf.i ænd dɪˈskʌʃ.ən/",
        tip: "سؤال لطيف لتأكيد الموعد المشترك بود."
      },
      {
        id: 'dl-4',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Absolutely! I look forward to spending a lovely time together.",
        ar: "بكل تأكيد! أتطلع بشوق لقضاء وقت لطيف ومثمر معاً.",
        phonetic: "/ˈæb.sə.luːt.li! aɪ lʊk ˈfɔː.wəd tuː ˈspen.dɪŋ ə ˈlʌv.li taɪm təˈɡeð.ər/",
        tip: "استخدام كلمة Absolutely يمنح المتحدث طابع الثقة والحماس."
      }
    ]
  },
  {
    id: 'work_meetings',
    title: 'بيئة العمل والاجتماعات الاحترافية',
    subtitle: 'Professional Work & Business Meetings',
    icon: '💼',
    badge: 'مهني ورسمي',
    scenarioDescription: 'اجتماع عمل احترافي لمناقشة أهداف جديدة، واستعراض تقارير الإنجاز، والتعبير عن الآراء بأسلوب لبق.',
    dialogue: [
      {
        id: 'wm-1',
        speaker: 'Mr. David (المدير)',
        speakerType: 'other',
        en: "Welcome everyone! Could we please review the project milestones?",
        ar: "أهلاً بالجميع! هل يمكننا من فضلكم مراجعة المحطات الرئيسية للمشروع؟",
        phonetic: "/ˈwel.kəm ˈev.ri.wʌn! kʊd wiː pliːz rɪˈvjuː ðə ˈprɒdʒ.ekt ˈmaɪl.stəʊnz/",
        tip: "افتتاحية اجتماع احترافية ومباشرة."
      },
      {
        id: 'wm-2',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Certainly! I have prepared the complete summary report for you.",
        ar: "بكل تأكيد! لقد قمتُ بإعداد التقرير التلخيصي الشامل لحضراتكم.",
        phonetic: "/ˈsɜː.tən.li! aɪ hæv prɪˈpeəd ðə kəmˈpliːt ˈsʌm.ər.i rɪˈpɔːt fɔːr juː/",
        tip: "Certainly بديل راقٍ لكلمة Yes في المحيط العملي."
      },
      {
        id: 'wm-3',
        speaker: 'Mr. David (المدير)',
        speakerType: 'other',
        en: "Your presentation was truly impressive and well-organized.",
        ar: "لقد كان عرضكِ التقديمي مبهراً حقاً ومتقناً ومنظماً للغاية.",
        phonetic: "/jɔː ˌprez.ənˈteɪ.ʃən wɒz ˈtruː.li ɪmˈpres.ɪv ænd wel ˈɔː.ɡən.aɪzd/",
        tip: "إشادة وتقدير للأداء العالي."
      },
      {
        id: 'wm-4',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Thank you so much! I appreciate your valuable feedback.",
        ar: "شكراً جزيلاً لك! أنا ممتنة جداً لملاحظاتك القيمة وتوجيهك.",
        phonetic: "/θæŋk juː səʊ mʌtʃ! aɪ əˈpriː.ʃi.eɪt jɔː ˈvæl.jʊ.ə.bəl ˈfiːd.bæk/",
        tip: "أسلوب راقٍ للرد على الإشادات في بيئة الأعمال."
      }
    ]
  },
  {
    id: 'travel_airport',
    title: 'السفر والمطار والجمارك',
    subtitle: 'Travel, Airport & Immigration',
    icon: '✈️',
    badge: 'شائع ومهم',
    scenarioDescription: 'موقف واقعي في المطار الدولي لإنهاء إجراءات صعود الطائرة وتسليم الأمتعة بكل هدوء ويسر.',
    dialogue: [
      {
        id: 'ta-1',
        speaker: 'Airline Agent (موظف المطار)',
        speakerType: 'other',
        en: "May I see your passport and boarding pass, please?",
        ar: "هل يمكنني الاطلاع على جواز سفركِ وبطاقة صعود الطائرة من فضلكِ؟",
        phonetic: "/meɪ aɪ siː jɔː ˈpɑːs.pɔːt ænd ˈbɔː.dɪŋ pɑːs, pliːz/",
        tip: "السؤال المعياري في منصة التدقيق ومنافذ السفر."
      },
      {
        id: 'ta-2',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Here they are! Which gate does the flight board from?",
        ar: "تفضل، ها هما! من أي بوابة ستصعد الطائرة من فضلك؟",
        phonetic: "/hɪər ðeɪ ɑː! wɪtʃ ɡeɪt dʌz ðə flaɪt bɔːd frɒm/",
        tip: "سؤال ذكي ودقيق لمعرفة بوابة المغادرة."
      },
      {
        id: 'ta-3',
        speaker: 'Airline Agent (موظف المطار)',
        speakerType: 'other',
        en: "Gate B12. Boarding begins in forty-five minutes. Have a safe flight!",
        ar: "البوابة B12. سيبدأ صعود الطائرة خلال 45 دقيقة. رحلة سعيدة وآمنة!",
        phonetic: "/ɡeɪt biː twelv. ˈbɔː.dɪŋ bɪˈɡɪnz ɪn ˈfɔː.ti faɪv ˈmɪn.ɪts. hæv ə seɪf flaɪt/",
        tip: "توجيه واضح مع تحية لطيفة للمسافر."
      },
      {
        id: 'ta-4',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Thank you for your kind assistance. Have a wonderful day!",
        ar: "شكراً لك على مساعدتك اللطيفة. أتمنى لك يوماً رائعاً!",
        phonetic: "/θæŋk juː fɔːr jɔː kaɪnd əˈsɪs.təns. hæv ə ˈwʌn.də.fəl deɪ/",
        tip: "خاتمة مهذبة تترك انطباعاً إيجابياً للغاية."
      }
    ]
  },
  {
    id: 'dining_shopping',
    title: 'المطاعم الراقية والتسوق',
    subtitle: 'Fine Dining & Shopping Experience',
    icon: '🛍️',
    badge: 'عملي واجتماعي',
    scenarioDescription: 'طلب وجبة في مطعم راقٍ، الاستفسار عن المكونات، وطلب الحساب بأسلوب أنيق.',
    dialogue: [
      {
        id: 'ds-1',
        speaker: 'Waiter (نادل المطعم)',
        speakerType: 'other',
        en: "Good evening! Are you ready to order, or do you need a moment?",
        ar: "مساء الخير! هل أنتم مستعدون للطلب، أم تودون بضع دقائق للاختيار؟",
        phonetic: "/ɡʊd ˈiːv.nɪŋ! ɑː juː ˈred.i tuː ˈɔː.dər, ɔː duː juː niːd ə ˈməʊ.mənt/",
        tip: "سؤال النادل المعتاد عند تقديم قائمة الطعام."
      },
      {
        id: 'ds-2',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "I would like grilled salmon with steamed vegetables, please.",
        ar: "أود الحصول على طبق السلمون المشوي مع الخضار المطهوة على البخار من فضلك.",
        phonetic: "/aɪ wʊd laɪk ɡrɪld ˈsæm.ən wɪð stiːmd ˈvedʒ.tə.bəlz, pliːz/",
        tip: "تذكري: حرف L في كلمة salmon صامت تماماً (نقول سامون)."
      },
      {
        id: 'ds-3',
        speaker: 'Waiter (نادل المطعم)',
        speakerType: 'other',
        en: "Excellent choice! Would you care for any dessert or tea afterward?",
        ar: "اختيار ممتاز! هل تودون أي حلوى أو شاي بعد الوجبة؟",
        phonetic: "/ˈek.səl.ənt tʃɔɪs! wʊd juː keər fɔːr ˈen.i dɪˈzɜːt ɔː tiː ˈɑːf.tə.wəd/",
        tip: "عرض الحلوى والمشروبات الساخنة."
      },
      {
        id: 'ds-4',
        speaker: 'Um Yazan (أم يزن)',
        speakerType: 'user',
        en: "Just green tea with no sugar, and could we have the bill, please?",
        ar: "فقط شاي أخضر بدون سكر، وهل يمكننا الحصول على الفاتورة من فضلك؟",
        phonetic: "/dʒʌst ɡriːn tiː wɪð nəʊ ˈʃʊɡ.ər, ænd kʊd wiː hæv ðə bɪl, pliːz/",
        tip: "طلب الفاتورة بلباقة باستخدام Could we have the bill."
      }
    ]
  }
];

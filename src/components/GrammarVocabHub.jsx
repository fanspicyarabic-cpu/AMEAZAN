import React, { useState } from 'react';
import { 
  GraduationCap, Volume2, Mic, CheckCircle2, XCircle, 
  Lightbulb, Layers, BookMarked, HelpCircle, ArrowRight, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GRAMMAR_RULES } from '../data/grammarHub';
import { VOCABULARY_LIST, QUIZ_QUESTIONS } from '../data/vocabularyBank';
import { speakEnglishText, speakArabicText } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { calculateAccuracy } from '../utils/similarity';
import { playClickSound, playSuccessSound, playTryAgainSound } from '../utils/soundEffects';

export default function GrammarVocabHub({ onRecordAttempt, onUpdateMastered }) {
  const [activeSubTab, setActiveSubTab] = useState('grammar'); // 'grammar' | 'flashcards' | 'quiz'
  const [selectedRuleId, setSelectedRuleId] = useState('present_simple_vs_cont');

  // Voice Evaluation on grammar examples
  const [isListeningEx, setIsListeningEx] = useState(null);
  const [exScores, setExScores] = useState({});

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const rule = GRAMMAR_RULES.find(r => r.id === selectedRuleId) || GRAMMAR_RULES[0];
  const currentCard = VOCABULARY_LIST[cardIndex];
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  const handleListenEn = (text) => {
    playClickSound();
    speakEnglishText(text, { rate: 0.95 });
  };

  const handleListenAr = (text) => {
    playClickSound();
    speakArabicText(text, { rate: 0.95 });
  };

  const handleSpeakExample = async (exText, idx) => {
    playClickSound();
    setIsListeningEx(idx);

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      setIsListeningEx(null);
      return;
    }

    const recognizer = createSpeechRecognizer({
      onStart: () => setIsListeningEx(idx),
      onEnd: () => setIsListeningEx(null),
      onError: () => {
        setIsListeningEx(null);
        playTryAgainSound();
      },
      onResult: (res) => {
        setIsListeningEx(null);
        const transcript = res.transcript;
        const score = res.isAcoustic ? res.acousticScore : calculateAccuracy(transcript, exText);
        setExScores(prev => ({ ...prev, [idx]: score }));

        if (score >= 85) {
          playSuccessSound();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: 'grammar-' + idx,
              accuracy: score,
              phrase: exText,
              isPassed: true
            });
          }
        } else {
          playTryAgainSound();
        }
      }
    }, exText);

    recognizer.start();
  };

  // Flashcards
  const toggleMastered = (id) => {
    playClickSound();
    const updated = { ...masteredWords, [id]: !masteredWords[id] };
    setMasteredWords(updated);
    if (onUpdateMastered) {
      onUpdateMastered(Object.values(updated).filter(Boolean).length);
    }
    if (!masteredWords[id]) {
      playSuccessSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-right">
      
      {/* Subtabs Selector */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('grammar');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'grammar'
              ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>مركز القواعد التفاعلي (Grammar Rules)</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('flashcards');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'flashcards'
              ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>البطاقات الذكية ثلاثية الأبعاد (Flashcards)</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveSubTab('quiz');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>اختبار التمييز والاستماع (Audio Quiz)</span>
        </button>
      </div>

      {/* Mode 1: Grammar Rules */}
      {activeSubTab === 'grammar' && (
        <div className="space-y-6">
          
          {/* Rules Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GRAMMAR_RULES.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  playClickSound();
                  setSelectedRuleId(r.id);
                  setExScores({});
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedRuleId === r.id
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.title}</span>
              </button>
            ))}
          </div>

          {/* Active Rule Details Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{rule.icon}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{rule.title}</h3>
                  <p className="font-en text-xs sm:text-sm text-teal-400 font-semibold" dir="ltr">{rule.subtitle}</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
                {rule.level}
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {rule.summary}
            </p>

            {/* Formula Breakdown Cards */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Layers className="w-4 h-4" />
                <span>التركيبة والمعادلة القواعدية (Grammar Formula):</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rule.formula.map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-teal-300 block mb-1">{f.name}</span>
                    <div className="font-en text-xs font-mono text-white text-left py-1" dir="ltr">{f.structure}</div>
                    <div className="font-en text-xs text-amber-200/80 text-left mt-1" dir="ltr">مثال: {f.example}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Examples with Dual Audio & Speak Now */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-400" />
                <span>أمثلة نطقية تفاعلية مع تقييم الصوت:</span>
              </h4>

              <div className="space-y-3">
                {rule.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-right flex-1">
                      <p className="font-en text-base font-bold text-white text-left" dir="ltr">
                        "{ex.en}"
                      </p>
                      <p className="font-en text-xs text-indigo-300 font-mono text-left my-0.5" dir="ltr">
                        {ex.phonetic}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {ex.ar}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleListenEn(ex.en)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/30 text-indigo-200 text-xs font-bold hover:bg-indigo-600/50 transition"
                        title="استماع إنجليزي"
                      >
                        EN 🔊
                      </button>
                      <button
                        onClick={() => handleListenAr(ex.ar)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                        title="استماع عربي"
                      >
                        AR 🔊
                      </button>

                      <button
                        onClick={() => handleSpeakExample(ex.en, idx)}
                        disabled={isListeningEx === idx}
                        className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                          isListeningEx === idx
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>انطقيها 🎙️</span>
                      </button>

                      {exScores[idx] !== undefined && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          exScores[idx] >= 85 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          %{exScores[idx]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Mistake Comparison Card */}
            {rule.commonMistake && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-amber-400 block mb-3">
                  ⚠️ خطأ شائع يقع فيه الكثيرون مع التصحيح الفوري:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-rose-400 block">شائع وخاطئ:</span>
                      <p className="font-en text-sm text-rose-200 text-left line-through" dir="ltr">{rule.commonMistake.wrong}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-400 block">الصواب الاحترافي:</span>
                      <p className="font-en text-sm text-emerald-200 text-left font-bold" dir="ltr">{rule.commonMistake.correct}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  💡 السبب الأكاديمي: {rule.commonMistake.reason}
                </p>
              </div>
            )}

            {/* Pro Tip */}
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/20 text-xs sm:text-sm text-teal-200">
              <span className="font-bold text-teal-300 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4" />
                توجيه تعليمي لأم يزن:
              </span>
              <p>{rule.proTip}</p>
            </div>

          </div>

        </div>
      )}

      {/* Mode 2: Flashcards */}
      {activeSubTab === 'flashcards' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">بطاقة {cardIndex + 1} من {VOCABULARY_LIST.length}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
              {currentCard.category}
            </span>
          </div>

          <div
            onClick={() => {
              playClickSound();
              setIsFlipped(!isFlipped);
            }}
            className="min-h-[320px] sm:min-h-[360px] p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-750 shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer transition relative"
          >
            <div className="absolute top-5 left-5 text-[11px] text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              اضغطي لقلب البطاقة 🔄
            </div>

            {!isFlipped ? (
              <div>
                <span className="text-xs font-semibold text-teal-400 mb-2 block uppercase">Target Vocabulary</span>
                <h3 className="font-en text-4xl sm:text-6xl font-black text-white my-3">{currentCard.word}</h3>
                <p className="font-en text-base text-indigo-300 font-mono mb-2">{currentCard.phonetic}</p>
                <p className="text-sm text-amber-300/90 font-medium mb-6">النطق: {currentCard.arabicTransliteration}</p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListenEn(currentCard.word);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-200 text-xs font-bold hover:bg-indigo-600/50 transition"
                  >
                    استماع للكلمة 🔊
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-right w-full max-w-lg">
                <span className="text-xs font-semibold text-teal-400 mb-2 block">المعنى والسياق العربي:</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{currentCard.meaning}</h3>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 mb-4">
                  <p className="font-en text-base font-semibold text-teal-300 text-left mb-1" dir="ltr">"{currentCard.exampleEn}"</p>
                  <p className="text-xs sm:text-sm text-slate-300">{currentCard.exampleAr}</p>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListenEn(currentCard.exampleEn);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-indigo-300 text-xs font-bold"
                  >
                    استماع للمثال EN 🔊
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleListenAr(currentCard.exampleAr);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    استماع بالعربي AR 🔊
                  </button>
                </div>
              </div>
            )}

            <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  masteredWords[currentCard.id]
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{masteredWords[currentCard.id] ? 'تم إتقانها بنجاح ✅' : 'تحديد كمتقنة'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => {
                playClickSound();
                setIsFlipped(false);
                setCardIndex(cardIndex > 0 ? cardIndex - 1 : VOCABULARY_LIST.length - 1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابقة</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setIsFlipped(false);
                setCardIndex(cardIndex < VOCABULARY_LIST.length - 1 ? cardIndex + 1 : 0);
              }}
              className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow"
            >
              <span>التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Audio Quiz */}
      {activeSubTab === 'quiz' && (
        <div className="text-right">
          {!quizCompleted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">سؤال {quizIndex + 1} من {QUIZ_QUESTIONS.length}</span>
                <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  النقاط: {quizScore}
                </span>
              </div>

              <div className="text-center py-6">
                <p className="text-sm sm:text-base font-bold text-white mb-4">
                  {currentQuiz.questionPrompt}
                </p>

                <button
                  onClick={() => handleListenEn(currentQuiz.audioTarget)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-base shadow-xl hover:opacity-95 transition cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>اضغطي للاستماع للفظ الكلمة 🔊</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuiz.options.map((opt, i) => (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => {
                      if (selectedOption !== null) return;
                      playClickSound();
                      setSelectedOption(i);
                      if (opt.isCorrect) {
                        playSuccessSound();
                        setQuizScore(s => s + 1);
                        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                      } else {
                        playTryAgainSound();
                      }
                    }}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm sm:text-base transition cursor-pointer ${
                      selectedOption !== null
                        ? (opt.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                          : (selectedOption === i ? 'bg-rose-500/20 text-rose-300 border-rose-500' : 'bg-slate-850 text-slate-500 border-slate-800'))
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {selectedOption !== null && (
                <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                  <span className="text-xs sm:text-sm font-bold text-teal-300">
                    {currentQuiz.options[selectedOption].isCorrect ? 'أحسنتِ يا أم يزن! إجابة صحيحة 🌟' : 'حاولي التركيز على مخرج الحرف والمعنى الصحيح.'}
                  </span>

                  <button
                    onClick={() => {
                      playClickSound();
                      setSelectedOption(null);
                      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
                        setQuizIndex(quizIndex + 1);
                      } else {
                        setQuizCompleted(true);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow"
                  >
                    السؤال التالي ⬅️
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 sm:p-12 rounded-3xl bg-slate-900 border border-teal-500/30">
              <h3 className="text-2xl font-black text-white mb-2">مبارك يا أم يزن! أتممتِ الاختبار الأكاديمي بنجاح 🌟</h3>
              <p className="text-slate-300 mb-6">درجتكِ: {quizScore} من {QUIZ_QUESTIONS.length}</p>
              <button
                onClick={() => {
                  playClickSound();
                  setQuizIndex(0);
                  setSelectedOption(null);
                  setQuizScore(0);
                  setQuizCompleted(false);
                }}
                className="px-8 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold text-sm shadow"
              >
                إعادة الاختبار 🔁
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

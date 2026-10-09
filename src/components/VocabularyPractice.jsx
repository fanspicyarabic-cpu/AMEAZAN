import React, { useState } from 'react';
import { 
  BookMarked, Volume2, CheckCircle2, RotateCcw, 
  Sparkles, Award, ArrowRight, ArrowLeft, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_LIST, QUIZ_QUESTIONS } from '../data/vocabularyBank';
import { speakEnglishText } from '../utils/speechSynthesis';
import { playClickSound, playSuccessSound, playTryAgainSound } from '../utils/soundEffects';

export default function VocabularyPractice({ onUpdateMastered }) {
  const [subMode, setSubMode] = useState('flashcards'); // 'flashcards' | 'quiz'
  
  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState({});

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAnswerFeedback, setQuizAnswerFeedback] = useState(null);

  const currentCard = VOCABULARY_LIST[cardIndex];
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  // Audio Playback
  const handlePlayAudio = (word) => {
    playClickSound();
    speakEnglishText(word, { rate: 0.9 });
  };

  const handleNextCard = () => {
    playClickSound();
    setIsFlipped(false);
    if (cardIndex < VOCABULARY_LIST.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handlePrevCard = () => {
    playClickSound();
    setIsFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    } else {
      setCardIndex(VOCABULARY_LIST.length - 1);
    }
  };

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

  // Quiz Answer Select
  const handleAnswerSelect = (option, idx) => {
    if (selectedOption !== null) return;
    playClickSound();
    setSelectedOption(idx);

    if (option.isCorrect) {
      playSuccessSound();
      setQuizScore(prev => prev + 1);
      setQuizAnswerFeedback({ isCorrect: true, message: 'إجابة صحيحة وممتازة يا أم يزن! 🌟' });
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } else {
      playTryAgainSound();
      setQuizAnswerFeedback({ isCorrect: false, message: 'إجابة قريبة، لكن حاولي التركيز على نطق الكلمة ومعناها الصحيح.' });
    }
  };

  const handleNextQuiz = () => {
    playClickSound();
    setSelectedOption(null);
    setQuizAnswerFeedback(null);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setQuizCompleted(true);
      playSuccessSound();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const resetQuiz = () => {
    playClickSound();
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswerFeedback(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Submode Switcher Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => {
            playClickSound();
            setSubMode('flashcards');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            subMode === 'flashcards'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>البطاقات الذكية التفاعلية (Flashcards)</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setSubMode('quiz');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            subMode === 'quiz'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>تحدي الاستماع والتمييز الصوتي (Audio Quiz)</span>
        </button>
      </div>

      {/* Mode 1: Flashcards */}
      {subMode === 'flashcards' && (
        <div className="text-right">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400">
              بطاقة {cardIndex + 1} من {VOCABULARY_LIST.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                {currentCard.category}
              </span>
            </div>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => {
              playClickSound();
              setIsFlipped(!isFlipped);
            }}
            className="relative min-h-[320px] sm:min-h-[360px] p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
          >
            
            {/* Top Badge: Flip indicator */}
            <div className="absolute top-5 left-5 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              <span>اضغطي لقلب البطاقة</span>
            </div>

            {/* Front Side: English Word + Audio */}
            {!isFlipped ? (
              <div className="animate-in fade-in duration-200">
                <span className="text-xs font-semibold text-emerald-400 mb-2 block tracking-wider uppercase">
                  المفردة باللغة الإنجليزية
                </span>
                
                <h3 className="font-en text-4xl sm:text-6xl font-black text-white tracking-wide my-3">
                  {currentCard.word}
                </h3>

                <p className="font-en text-base text-indigo-300 font-mono mb-2">
                  {currentCard.phonetic}
                </p>

                <p className="text-sm text-amber-300/90 font-medium mb-6">
                  النطق الصوتي: {currentCard.arabicTransliteration}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(currentCard.word);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استمعي للنطق</span>
                </button>
              </div>
            ) : (
              /* Back Side: Arabic Meaning & Example */
              <div className="animate-in fade-in duration-200 text-right w-full max-w-lg">
                <span className="text-xs font-semibold text-emerald-400 mb-2 block">
                  المعنى والسياق العربي:
                </span>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  {currentCard.meaning}
                </h3>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-4">
                  <p className="font-en text-base font-semibold text-emerald-300 text-left mb-1">
                    "{currentCard.exampleEn}"
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {currentCard.exampleAr}
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAudio(currentCard.exampleEn);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمعي للمثال الكامل</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Status / Mastered Button */}
            <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  masteredWords[currentCard.id]
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{masteredWords[currentCard.id] ? 'تم إتقانها بنجاح ✅' : 'تحديد كمتقنة'}</span>
              </button>
            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevCard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>البطاقة السابقة</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black transition shadow-md shadow-emerald-500/20"
            >
              <span>البطاقة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Mode 2: Audio Quiz */}
      {subMode === 'quiz' && (
        <div className="text-right">
          {!quizCompleted ? (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md">
              
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400">
                  سؤال {quizIndex + 1} من {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  النقاط: {quizScore}
                </span>
              </div>

              {/* Audio Prompt Button */}
              <div className="text-center py-6">
                <p className="text-sm sm:text-base font-bold text-white mb-4">
                  {currentQuiz.questionPrompt}
                </p>

                <button
                  onClick={() => handlePlayAudio(currentQuiz.audioTarget)}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition cursor-pointer"
                >
                  <Volume2 className="w-6 h-6 animate-pulse" />
                  <span>اضغطي للاستماع للكلمة 🔊</span>
                </button>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {currentQuiz.options.map((option, idx) => {
                  let btnStyle = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';

                  if (selectedOption !== null) {
                    if (option.isCorrect) {
                      btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/30';
                    } else if (selectedOption === idx) {
                      btnStyle = 'bg-rose-500/20 text-rose-300 border-rose-500';
                    } else {
                      btnStyle = 'bg-slate-800/40 text-slate-500 border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswerSelect(option, idx)}
                      className={`p-4 rounded-2xl border text-right font-bold text-sm sm:text-base transition cursor-pointer ${btnStyle}`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next */}
              {quizAnswerFeedback && (
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                  <p className={`text-xs sm:text-sm font-bold ${quizAnswerFeedback.isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                    {quizAnswerFeedback.message}
                  </p>

                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition shadow"
                  >
                    السؤال التالي ⬅️
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Quiz Completion Card */
            <div className="text-center p-8 sm:p-12 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                مبارك يا أم يزن! أتممتِ اختبار الاستماع بنجاح 🌟
              </h3>
              <p className="text-base text-slate-300 mb-6">
                نتيجتكِ: {quizScore} من {QUIZ_QUESTIONS.length} إجابات صحيحة
              </p>
              <button
                onClick={resetQuiz}
                className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow"
              >
                إعادة الاختبار الصوتي 🔁
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

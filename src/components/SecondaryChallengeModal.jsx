import React, { useState, useEffect } from 'react';
import { Sparkles, Volume2, Mic, CheckCircle2, RotateCcw, X, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakEnglishText } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { calculateAccuracy, evaluateWordTokens } from '../utils/similarity';
import { playClickSound, playSuccessSound, playTryAgainSound } from '../utils/soundEffects';

export default function SecondaryChallengeModal({
  isOpen,
  onClose,
  challenge,
  onComplete,
  userStats
}) {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [resultScore, setResultScore] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSpokenText('');
      setResultScore(null);
      setErrorMessage('');
      setCompleted(false);
    }
  }, [isOpen]);

  if (!isOpen || !challenge || !challenge.secondaryChallenge) return null;

  const sec = challenge.secondaryChallenge;

  const handleListen = (rate = 1.0) => {
    playClickSound();
    setIsPlayingAudio(true);
    speakEnglishText(sec.targetSentence, {
      rate,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleStartSpeaking = async () => {
    playClickSound();
    setErrorMessage('');
    setSpokenText('');
    setResultScore(null);

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      setErrorMessage(perm.error || 'يرجى منح إذن الميكروفون في المتصفح.');
      return;
    }

    const recognizer = createSpeechRecognizer({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err.message || 'تعذر التعرف على الصوت');
        playTryAgainSound();
      },
      onResult: (res) => {
        setIsListening(false);
        const transcript = res.transcript;
        setSpokenText(transcript);

        const score = res.isAcoustic ? res.acousticScore : calculateAccuracy(transcript, sec.targetSentence);
        setResultScore(score);

        if (score >= 80) {
          playSuccessSound();
          setCompleted(true);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          if (onComplete) {
            onComplete(sec.bonusXP || 50);
          }
        } else {
          playTryAgainSound();
        }
      }
    }, sec.targetSentence);

    recognizer.start();
  };

  const tokenDiff = spokenText ? evaluateWordTokens(sec.targetSentence, spokenText) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden text-right">
        
        {/* Glow ambient background */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            التحدي الذهبي المتقدم 🏆 (+{sec.bonusXP} XP)
          </span>
        </div>

        {/* Prompt */}
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-relaxed">
          {sec.prompt}
        </h3>
        <p className="text-sm text-slate-300 mb-6">
          لقد اجتزتِ الكلمة السابقة بتفوق! الآن ضعيها في سياق جملة كاملة واختبري طلاقتك الصوتية.
        </p>

        {/* Target Sentence Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400">الجملة المستهدفة:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleListen(1.0)}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-medium transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'جاري القراءة...' : 'استمع للجملة'}</span>
              </button>
            </div>
          </div>

          <div className="font-en-block text-xl sm:text-2xl font-bold text-white text-left tracking-wide py-2 leading-relaxed">
            {sec.targetSentence}
          </div>

          <p className="text-sm sm:text-base text-slate-300 mt-2 border-t border-slate-700/60 pt-2 font-medium">
            {sec.targetSentenceArabic}
          </p>
        </div>

        {/* Feedback / Results Area */}
        {spokenText && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-800/90 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">ما تم التقاطه من صوتكِ:</span>
              {resultScore !== null && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    resultScore >= 75
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  الدقة: %{resultScore}
                </span>
              )}
            </div>

            <p className="font-en text-left text-base text-amber-200 py-1">
              "{spokenText}"
            </p>

            {/* Token evaluation */}
            <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-700/50" dir="ltr">
              {tokenDiff.map((token, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                    token.status === 'exact'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : token.status === 'close'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {token.word}
                </span>
              ))}
            </div>

            {completed && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>إنجاز مذهل يا أم يزن! تمت إضافة +{sec.bonusXP} نقطة XP إلى رصيدكِ 💎</span>
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleStartSpeaking}
            disabled={isListening}
            className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
            <span>{isListening ? 'جاري الاستماع لصوتكِ... تحدثي الآن' : 'انطقي الجملة الآن 🎙️'}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition border border-slate-700"
          >
            {completed ? 'إنهاء التحدي الذهبي' : 'تخطي التحدي'}
          </button>
        </div>

      </div>
    </div>
  );
}

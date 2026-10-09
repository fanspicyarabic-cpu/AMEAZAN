import React, { useState } from 'react';
import { 
  MessageSquareText, Volume2, Mic, CheckCircle2, RotateCcw, 
  Sparkles, Lightbulb, User, Bot, ArrowRight, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONVERSATIONAL_SCENARIOS } from '../data/conversationalScenarios';
import { speakEnglishText, speakArabicText } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { calculateAccuracy, evaluateWordTokens } from '../utils/similarity';
import { playClickSound, playSuccessSound, playTryAgainSound } from '../utils/soundEffects';

export default function ConversationalStudio({ onTriggerSecondaryChallenge, onRecordAttempt }) {
  const [activeScenarioId, setActiveScenarioId] = useState('daily_life');
  const [activeLineId, setActiveLineId] = useState(null);
  const [isListeningLineId, setIsListeningLineId] = useState(null);
  const [lineResults, setLineResults] = useState({}); // { [lineId]: { score, spoken, tokens } }
  const [lineErrors, setLineErrors] = useState({});

  const scenario = CONVERSATIONAL_SCENARIOS.find(s => s.id === activeScenarioId) || CONVERSATIONAL_SCENARIOS[0];

  const handleListenEn = (text) => {
    playClickSound();
    speakEnglishText(text, { rate: 0.95 });
  };

  const handleListenAr = (text) => {
    playClickSound();
    speakArabicText(text, { rate: 0.95 });
  };

  const handleStartSpeakingLine = async (line) => {
    playClickSound();
    setActiveLineId(line.id);
    setIsListeningLineId(line.id);
    setLineErrors(prev => ({ ...prev, [line.id]: null }));

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      setLineErrors(prev => ({ ...prev, [line.id]: perm.error || 'يرجى إعطاء صلاحية الميكروفون في المتصفح.' }));
      setIsListeningLineId(null);
      return;
    }

    const recognizer = createSpeechRecognizer({
      onStart: () => setIsListeningLineId(line.id),
      onEnd: () => setIsListeningLineId(null),
      onError: (err) => {
        setIsListeningLineId(null);
        setLineErrors(prev => ({ ...prev, [line.id]: err.message }));
        playTryAgainSound();
      },
      onResult: (res) => {
        setIsListeningLineId(null);
        const transcript = res.transcript;
        const score = res.isAcoustic ? res.acousticScore : calculateAccuracy(transcript, line.en);
        const tokens = res.isAcoustic 
          ? line.en.split(/\s+/).map(w => ({ word: w, status: score >= 85 ? 'exact' : 'missed' }))
          : evaluateWordTokens(line.en, transcript);

        setLineResults(prev => ({
          ...prev,
          [line.id]: { score, spoken: transcript, tokens }
        }));

        const isPassed = score >= 85;

        if (isPassed) {
          playSuccessSound();
          confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: line.id,
              accuracy: score,
              phrase: line.en,
              isPassed: true
            });
          }

          // Trigger secondary challenge for high scores
          if (onTriggerSecondaryChallenge) {
            setTimeout(() => {
              onTriggerSecondaryChallenge({
                id: line.id,
                target: line.en,
                translation: line.ar,
                secondaryChallenge: {
                  prompt: `أحسنتِ النطق في هذا الحوار يا أم يزن! تحدي الرد التالي:`,
                  targetSentence: `I am very glad to discuss this topic with you.`,
                  targetSentenceArabic: "يسعدني جداً مناقشة هذا الموضوع معكِ.",
                  bonusXP: 45
                }
              });
            }, 1500);
          }
        } else {
          playTryAgainSound();
          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: line.id,
              accuracy: score,
              phrase: line.en,
              isPassed: false
            });
          }
        }
      }
    }, line.en);

    recognizer.start();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-right">
      
      {/* Scenario Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
        {CONVERSATIONAL_SCENARIOS.map(sc => (
          <button
            key={sc.id}
            onClick={() => {
              playClickSound();
              setActiveScenarioId(sc.id);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeScenarioId === sc.id
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{sc.icon}</span>
            <span>{sc.title}</span>
          </button>
        ))}
      </div>

      {/* Scenario Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{scenario.icon}</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">{scenario.title}</h3>
            <p className="font-en text-xs sm:text-sm text-emerald-400 font-semibold" dir="ltr">{scenario.subtitle}</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          {scenario.scenarioDescription}
        </p>
      </div>

      {/* Dialogue Stream */}
      <div className="space-y-6">
        {scenario.dialogue.map((line, idx) => {
          const isUser = line.speakerType === 'user';
          const evalResult = lineResults[line.id];
          const isListening = isListeningLineId === line.id;
          const errorMsg = lineErrors[line.id];

          return (
            <div
              key={line.id}
              className={`p-6 rounded-3xl border transition-all ${
                isUser
                  ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              
              {/* Speaker Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isUser ? 'bg-emerald-500/20 text-emerald-300' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white">{line.speaker}</span>
                    {isUser && (
                      <span className="mr-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                        دوركِ في الحديث 🌟
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Listen Buttons (Both English and Arabic) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleListenEn(line.en)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                    title="استمع للنطق الإنجليزي"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استماع بالإنجليزي</span>
                  </button>

                  <button
                    onClick={() => handleListenAr(line.ar)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    title="استمع للترجمة العربية"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>بالعربي</span>
                  </button>
                </div>
              </div>

              {/* English Line */}
              <div className="font-en-block text-xl sm:text-2xl font-bold text-white text-left tracking-wide py-2 leading-relaxed" dir="ltr">
                {line.en}
              </div>

              {/* Phonetic guide */}
              <div className="font-en text-xs sm:text-sm text-indigo-300 font-mono text-left mb-2" dir="ltr">
                {line.phonetic}
              </div>

              {/* Arabic Meaning */}
              <div className="text-sm sm:text-base text-slate-200 font-medium mb-3">
                {line.ar}
              </div>

              {/* Educational Tip */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-750 text-xs text-slate-400 flex items-center gap-2 mb-4">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>💡 {line.tip}</span>
              </div>

              {/* Voice Recognition Evaluation for THIS Line */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleStartSpeakingLine(line)}
                  disabled={isListening}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isListening ? 'جاري الاستماع إليكِ... انطقي الآن' : 'انطقي هذه الجملة الآن بصوتكِ 🎙️'}</span>
                </button>

                {evalResult && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-en" dir="ltr">
                      "{evalResult.spoken}"
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      evalResult.score >= 85
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      دقة النطق: %{evalResult.score} {evalResult.score >= 85 ? '✓' : '↺'}
                    </span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <p className="mt-2 text-xs text-rose-300">{errorMsg}</p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

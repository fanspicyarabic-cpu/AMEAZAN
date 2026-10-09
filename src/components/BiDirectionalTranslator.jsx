import React, { useState } from 'react';
import { 
  Languages, Volume2, Mic, ArrowLeftRight, Sparkles, 
  Layers, CheckCircle2, Copy, BookOpen, Compass, AlertCircle
} from 'lucide-react';
import { processTranslation } from '../data/bidirectionalTranslator';
import { speakEnglishText, speakArabicText, isArabicText } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { calculateAccuracy, evaluateWordTokens } from '../utils/similarity';
import { playClickSound, playSuccessSound, playTryAgainSound } from '../utils/soundEffects';

export default function BiDirectionalTranslator({ onSendToVoiceStudio, onRecordAttempt }) {
  const [inputText, setInputText] = useState('How is everything going?');
  const [translationResult, setTranslationResult] = useState(() => processTranslation('How is everything going?'));
  const [copied, setCopied] = useState(false);
  
  // Voice Evaluation on the target text
  const [isListening, setIsListening] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const [micError, setMicError] = useState('');

  const handleTranslate = (textOverride) => {
    playClickSound();
    const query = textOverride !== undefined ? textOverride : inputText;
    if (!query.trim()) return;
    const res = processTranslation(query);
    setTranslationResult(res);
    setVoiceResult(null);
    setMicError('');
  };

  const handleListenEn = (text) => {
    playClickSound();
    speakEnglishText(text, { rate: 0.95 });
  };

  const handleListenAr = (text) => {
    playClickSound();
    speakArabicText(text, { rate: 0.95 });
  };

  const handleCopy = (text) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickSwap = () => {
    playClickSound();
    if (!translationResult) return;
    const nextInput = translationResult.targetText;
    setInputText(nextInput);
    handleTranslate(nextInput);
  };

  // Evaluate voice directly on the English target sentence
  const handleSpeakNow = async () => {
    playClickSound();
    if (!translationResult) return;
    setMicError('');
    setVoiceResult(null);

    const targetEnglish = translationResult.englishAudioText;

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      setMicError(perm.error || 'يرجى إعطاء صلاحية الميكروفون في المتصفح.');
      return;
    }

    const recognizer = createSpeechRecognizer({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onError: (err) => {
        setIsListening(false);
        setMicError(err.message);
        playTryAgainSound();
      },
      onResult: (res) => {
        setIsListening(false);
        const transcript = res.transcript;
        const score = res.isAcoustic ? res.acousticScore : calculateAccuracy(transcript, targetEnglish);
        const tokens = res.isAcoustic
          ? targetEnglish.split(/\s+/).map(w => ({ word: w, status: score >= 85 ? 'exact' : 'missed' }))
          : evaluateWordTokens(targetEnglish, transcript);

        setVoiceResult({ score, transcript, tokens });

        if (score >= 85) {
          playSuccessSound();
          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: 'trans-' + Date.now(),
              accuracy: score,
              phrase: targetEnglish,
              isPassed: true
            });
          }
        } else {
          playTryAgainSound();
        }
      }
    }, targetEnglish);

    recognizer.start();
  };

  const isCurrentInputArabic = isArabicText(inputText);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-right">
      
      {/* Module Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Languages className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl sm:text-2xl font-black text-white">
            استوديو الترجمة ثنائية الاتجاه مع النطق الصوتي المزدوج
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          اكتبي بالعربية أو بالإنجليزية: سيكتشف النظام اللغة تلقائياً ويوفر ترجمة سياقية دقيقة، تفكيكاً قواعدياً، واستماعاً صوتياً لكلا اللغتين.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-slate-300">
            {isCurrentInputArabic ? 'النص المدخل: (لغة عربية 🇸🇦)' : 'النص المدخل: (English 🇬🇧)'}
          </label>
          
          <button
            onClick={handleQuickSwap}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 transition"
            title="تبديل اتجاه الترجمة"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>تبديل النص بالنتيجة</span>
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          dir={isCurrentInputArabic ? 'rtl' : 'ltr'}
          placeholder="اكتبي بالعربية (مثلاً: كيف تسير الأمور معكِ؟) أو بالإنجليزية (e.g. Could you please help me?)..."
          className="w-full text-base sm:text-lg p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none leading-relaxed"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Audio Listen for the Input Text itself! */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => isCurrentInputArabic ? handleListenAr(inputText) : handleListenEn(inputText)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 text-xs font-bold transition"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمع للنص المدخل</span>
            </button>
          </div>

          <button
            onClick={() => handleTranslate()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ترجمة وتحليل سياقي متقدم</span>
          </button>
        </div>
      </div>

      {/* Output Results Card */}
      {translationResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
            
            {/* Top Bar Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  {translationResult.formality}
                </span>
                <span className="text-xs text-slate-400">
                  {translationResult.inputDirection === 'ar-to-en' ? 'من العربية إلى الإنجليزية' : 'من الإنجليزية إلى العربية'}
                </span>
              </div>

              {/* Complete Audio Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleListenEn(translationResult.englishAudioText)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع بالإنجليزي 🇬🇧</span>
                </button>

                <button
                  onClick={() => handleListenAr(translationResult.arabicAudioText)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع بالعربي 🇸🇦</span>
                </button>

                <button
                  onClick={() => handleCopy(translationResult.targetText)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title="نسخ النتيجة"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Target Translation Output */}
            <div className="py-5">
              <span className="text-xs text-slate-400 block mb-1">الترجمة واللفظ المعتمد:</span>
              <div className="font-en text-2xl sm:text-3xl font-extrabold text-white text-left py-1 tracking-wide" dir="ltr">
                {translationResult.targetText}
              </div>

              {translationResult.phonetic && (
                <div className="font-en text-xs sm:text-sm text-indigo-300 font-mono text-left mt-1" dir="ltr">
                  {translationResult.phonetic}
                </div>
              )}
            </div>

            {/* Dual Translation Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  الترجمة السياقية الحقيقية (المعنى الدلالي):
                </span>
                <p className="text-base sm:text-lg font-bold text-emerald-100 leading-relaxed">
                  {translationResult.contextualTranslation}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-4 h-4" />
                  الترجمة الحرفية المعجمية (للمقارنة وتجنب الخطأ):
                </span>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {translationResult.literalTranslation}
                </p>
              </div>
            </div>

            {/* Cultural & Linguistic Pro-Tip */}
            {translationResult.proTip && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <Compass className="w-4 h-4" />
                  إضاءة لغوية لأم يزن:
                </span>
                <p>{translationResult.proTip}</p>
              </div>
            )}

            {/* Interactive Speak Now Button directly on this translated sentence! */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={handleSpeakNow}
                disabled={isListening}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-slate-950 hover:opacity-95'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isListening ? 'جاري الاستماع إليكِ... انطقي الإنجليزية الآن' : 'انطقي العبارة الإنجليزية الآن لتقييم النطق 🎙️'}</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  if (onSendToVoiceStudio) {
                    onSendToVoiceStudio({
                      id: Date.now(),
                      target: translationResult.englishAudioText,
                      translation: translationResult.contextualTranslation,
                      phonetic: translationResult.phonetic || "/fluent english/",
                      arabicTransliteration: translationResult.transliteration || "نطق إنجليزي سليم",
                      contextTip: translationResult.proTip || "تدربي على النطق السليم.",
                      difficulty: "مخصص"
                    });
                  }
                }}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
              >
                نقل إلى محرك النطق الرئيسي ⬅️
              </button>
            </div>

            {/* Voice Evaluation Feedback */}
            {voiceResult && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left" dir="ltr">
                <div className="flex items-center justify-between mb-1" dir="rtl">
                  <span className="text-xs text-slate-400">صوتكِ الملتقط:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    voiceResult.score >= 85 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    الدقة: %{voiceResult.score} {voiceResult.score >= 85 ? '✓ إتقان فائق' : '↺ حاولي مجدداً'}
                  </span>
                </div>
                <p className="font-en text-base text-amber-200 py-1">"{voiceResult.transcript}"</p>
              </div>
            )}

            {micError && (
              <p className="mt-3 text-xs text-rose-300">{micError}</p>
            )}

          </div>

          {/* Grammar Breakdown Cards */}
          {translationResult.grammarBreakdown && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  التفكيك والتحليل القواعدي المبسط (Grammar Breakdown)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {translationResult.grammarBreakdown.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-750">
                    <div className="font-en text-sm font-bold text-amber-300 text-left mb-1" dir="ltr">
                      {item.part}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mb-1">
                      {item.role}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-Life Usage Examples */}
          {translationResult.examples && translationResult.examples.length > 0 && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-white">
                  أمثلة استخدام حية في سياقات يومية
                </h3>
              </div>

              <div className="space-y-3">
                {translationResult.examples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-750 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-right flex-1">
                      <p className="font-en text-base font-bold text-white text-left" dir="ltr">
                        "{ex.en}"
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        {ex.ar}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleListenEn(ex.en)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold"
                        title="استمع للإنجليزي"
                      >
                        EN 🔊
                      </button>
                      <button
                        onClick={() => handleListenAr(ex.ar)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="استمع للعربي"
                      >
                        AR 🔊
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

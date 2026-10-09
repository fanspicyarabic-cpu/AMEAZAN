import React, { useState } from 'react';
import { 
  Languages, Volume2, Sparkles, BookOpen, Layers, CheckCircle2, 
  ArrowLeft, Copy, Mic, HelpCircle, Compass
} from 'lucide-react';
import { analyzeSentence, POPULAR_EXPRESSIONS } from '../data/contextualDictionary';
import { speakEnglishText } from '../utils/speechSynthesis';
import { playClickSound } from '../utils/soundEffects';

export default function ContextualTranslator({ onSendToVoiceStudio }) {
  const [inputText, setInputText] = useState('How is everything going?');
  const [analysisResult, setAnalysisResult] = useState(() => analyzeSentence('How is everything going?'));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = (textToAnalyze) => {
    playClickSound();
    const query = textToAnalyze !== undefined ? textToAnalyze : inputText;
    if (!query.trim()) return;
    const result = analyzeSentence(query);
    setAnalysisResult(result);
  };

  const handleListen = (text) => {
    playClickSound();
    setIsPlayingAudio(true);
    speakEnglishText(text, {
      rate: 0.95,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleCopy = (text) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickSelect = (exp) => {
    setInputText(exp);
    handleTranslate(exp);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Intro Header */}
      <div className="mb-6 text-right">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 justify-start">
          <Languages className="w-6 h-6 text-indigo-400" />
          <span>استوديو الترجمة والتحليل السياقي المتقدم</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          ترجمة تفهم روح المحادثات الإنجليزية اليومية دون جمود الترجمة الحرفية، مع تحليل القواعد وأمثلة الاستخدام الحي.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md mb-6 text-right">
        <label className="block text-xs font-bold text-slate-300 mb-2">
          اكتبي أو الصقي أي عبارة أو جملة باللغة الإنجليزية:
        </label>
        
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            rows={3}
            dir="ltr"
            placeholder="Type or paste any English sentence here..."
            className="w-full font-en text-base sm:text-lg p-4 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            {/* Quick expressions pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-1">تعبيرات مقترحة:</span>
              {POPULAR_EXPRESSIONS.slice(0, 4).map((exp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSelect(exp)}
                  className="font-en text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white transition whitespace-nowrap border border-slate-700/60"
                >
                  {exp}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleTranslate()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحليل وترجمة سياقية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Output Result Card */}
      {analysisResult && (
        <div className="space-y-6 text-right animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Main Contextual vs Literal Comparison Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {analysisResult.formality || 'أسلوب طبيعي'}
                </span>
                <span className="text-xs text-slate-400">
                  النتيجة السياقية المعتمدة
                </span>
              </div>

              {/* Actions: Listen / Copy / Send to Studio */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleListen(analysisResult.source)}
                  disabled={isPlayingAudio}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
                  title="استمع للفظ الإنجليزي"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'جاري الاستماع...' : 'استمع'}</span>
                </button>

                <button
                  onClick={() => handleCopy(analysisResult.source)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  title="نسخ العبارة"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Transfer to Voice Challenge button */}
                <button
                  onClick={() => {
                    playClickSound();
                    if (onSendToVoiceStudio) {
                      onSendToVoiceStudio({
                        id: Date.now(),
                        target: analysisResult.source,
                        phonetic: "/natural english/",
                        arabicTransliteration: "عبارة مخصصة لأم يزن",
                        translation: analysisResult.contextualTranslation,
                        contextTip: analysisResult.nuance,
                        difficulty: "مخصص",
                        audioTip: "تدربي على النطق السليم في استوديو الصوت."
                      });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-xs font-bold shadow transition cursor-pointer"
                  title="تدربي على نطق هذه الجملة بصوتك"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>تدربي على نطقها 🎙️</span>
                </button>
              </div>
            </div>

            {/* Original English Text */}
            <div className="py-4">
              <span className="text-xs text-slate-400 block mb-1">العبارة الأصلية (English):</span>
              <p className="font-en text-2xl sm:text-3xl font-extrabold text-white text-left py-1 tracking-wide">
                {analysisResult.source}
              </p>
            </div>

            {/* Translations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              
              {/* Contextual Translation (Highlight) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  الترجمة السياقية الحقيقية (المقصود بالحديث):
                </span>
                <p className="text-lg font-bold text-emerald-100 leading-relaxed">
                  {analysisResult.contextualTranslation}
                </p>
              </div>

              {/* Literal Translation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-1.5">
                  <HelpCircle className="w-4 h-4" />
                  الترجمة الحرفية المعجمية (للمقارنة):
                </span>
                <p className="text-base text-slate-300 leading-relaxed">
                  {analysisResult.literalTranslation}
                </p>
              </div>

            </div>

            {/* Nuance & Cultural Pro-Tip */}
            <div className="mt-4 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200 leading-relaxed">
              <p className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                الدلالة والملاحظة الثقافية:
              </p>
              <p>{analysisResult.nuance}</p>
              {analysisResult.proTip && (
                <p className="mt-2 text-amber-300/90 font-medium border-t border-indigo-900/40 pt-1.5">
                  💡 نصيحة لأم يزن: {analysisResult.proTip}
                </p>
              )}
            </div>

          </div>

          {/* Grammar Breakdown Module */}
          {analysisResult.grammarBreakdown && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">
                  التحليل القواعدي والتركيبي المبسط للجملة (Grammar Breakdown)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysisResult.grammarBreakdown.map((item, index) => (
                  <div key={index} className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                    <div className="font-en text-sm font-bold text-amber-300 text-left mb-1">
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
          {analysisResult.realLifeExamples && analysisResult.realLifeExamples.length > 0 && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-white">
                  أمثلة استخدام حية في مواقف واقعية (Real-Life Examples)
                </h3>
              </div>

              <div className="space-y-3">
                {analysisResult.realLifeExamples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-right flex-1">
                      <p className="font-en text-base font-bold text-white text-left">
                        "{ex.en}"
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 mt-1">
                        {ex.ar}
                      </p>
                    </div>

                    <button
                      onClick={() => handleListen(ex.en)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                      title="استمع للمثال"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
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

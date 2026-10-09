import React, { useState } from 'react';
import { Mic, X, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function CustomPracticeModal({ isOpen, onClose, onAddCustomChallenge }) {
  const [customPhrase, setCustomPhrase] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customPhrase.trim()) return;

    playClickSound();
    onAddCustomChallenge({
      id: Date.now(),
      target: customPhrase.trim(),
      phonetic: "/custom practice/",
      arabicTransliteration: "عبارة مخصصة لأم يزن",
      translation: customMeaning.trim() || "عبارة تدريب شخصية",
      contextTip: "عبارة أضفتِها بنفسكِ لاختبار طلاقتكِ ونطقكِ الصوتي.",
      difficulty: "مخصص",
      audioTip: "استمعي للفظ الصوتي أولاً ثم انطقيها بكل ثقة.",
      secondaryChallenge: {
        type: "sentence",
        prompt: "أحسنتِ النطق يا أم يزن! استخدمي العبارة في حديثكِ اليومي:",
        targetSentence: customPhrase.trim(),
        targetSentenceArabic: customMeaning.trim() || "عبارة تدريب شخصية",
        bonusXP: 40
      }
    });

    setCustomPhrase('');
    setCustomMeaning('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              إضافة عبارة مخصصة للتدريب الصوتي
            </h3>
            <p className="text-xs text-slate-400">
              أدخلي أي جملة تريدين اختبار نطقكِ لها بالذكاء الصوتي
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الجملة الإنجليزية المستهدفة (Target English):
            </label>
            <input
              type="text"
              value={customPhrase}
              onChange={(e) => setCustomPhrase(e.target.value)}
              placeholder="e.g. I am very proud of my daily progress"
              dir="ltr"
              required
              className="w-full font-en p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              المعنى بالعربية (اختياري):
            </label>
            <input
              type="text"
              value={customMeaning}
              onChange={(e) => setCustomMeaning(e.target.value)}
              placeholder="مثال: أنا فخورة جداً بتقدمي اليومي"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>بدء التدرب على هذه الجملة الآن</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

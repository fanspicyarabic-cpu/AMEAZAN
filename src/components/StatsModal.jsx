import React from 'react';
import { Award, Flame, BookOpen, Target, Sparkles, X, CheckCircle2, Trophy } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const badges = [
    { name: "فارسة البداية", desc: "بدء رحلة التحدث بالإنجليزية", icon: "🌱", unlocked: true },
    { name: "شعلة المواظبة", desc: "الحفاظ على حماس مستمر لأكثر من 5 أيام", icon: "🔥", unlocked: stats.streak >= 5 },
    { name: "دقة النطق الفائقة", desc: "تحقيق نسبة دقة نطق تتجاوز 80%", icon: "🎯", unlocked: stats.accuracyScore >= 80 },
    { name: "سفيرة الطلاقة", desc: "إتقان أكثر من 30 كلمة وعبارة", icon: "💎", unlocked: stats.wordsLearned >= 30 },
    { name: "بطلة التحدي الذهبي", desc: "إتمام التحديات الثانوية بنجاح", icon: "🏆", unlocked: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-right max-h-[90vh] overflow-y-auto">
        
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

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl">
            🏆
          </div>
          <div>
            <h3 className="text-xl font-black text-white">
              لوحة إنجازات وتألق أم يزن
            </h3>
            <p className="text-xs text-slate-400">
              ملخص تقدمكِ الرائع في الطلاقة اللغوية واستخدام الذكاء الصوتي
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <span className="block text-xs text-slate-400">أيام الممارسة</span>
            <span className="block text-lg font-bold text-orange-300">{stats.streak} أيام</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <BookOpen className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <span className="block text-xs text-slate-400">المفردات</span>
            <span className="block text-lg font-bold text-emerald-300">{stats.wordsLearned} متقنة</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <Target className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="block text-xs text-slate-400">معدل الدقة</span>
            <span className="block text-lg font-bold text-indigo-300">%{stats.accuracyScore}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
            <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="block text-xs text-slate-400">رصيد النقاط</span>
            <span className="block text-lg font-bold text-amber-300">{stats.xp} XP</span>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>الأوسمة والجوائز المكتسبة:</span>
          </h4>

          <div className="space-y-2.5">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition ${
                  b.unlocked
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-900/50 border-slate-800/60 opacity-50'
                }`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{b.name}</span>
                    {b.unlocked && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        مكتمل ✨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-sm shadow transition"
          >
            متابعة التدرب بحماس 🚀
          </button>
        </div>

      </div>
    </div>
  );
}

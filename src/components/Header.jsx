import React from 'react';
import { Flame, BookOpen, Target, Sparkles, Award, Mic } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function Header({ stats, onOpenStats, onOpenCustomModal }) {
  return (
    <header className="relative border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 transition-all">
      {/* Top corporate educational gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5 text-right w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-2xl">
                  🎓
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full" title="محرك الذكاء الصوتي متصل وجاهز"></div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
                    Lingua Um Yazan
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    موقع أم يزن للتعليم المتطور
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                  <span>منصة تعليمية متقدمة • محاكاة النطق الصوتي والترجمة ثنائية الاتجاه</span>
                  <span className="text-emerald-400">✨</span>
                </p>
              </div>
            </div>

            {/* Quick Action Button on Mobile */}
            <button
              onClick={() => {
                playClickSound();
                onOpenStats();
              }}
              className="md:hidden p-2 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700 transition"
              title="لوحة الإنجازات"
            >
              <Award className="w-5 h-5" />
            </button>
          </div>

          {/* User Progress Stats Tracker */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center w-full md:w-auto">
            
            {/* Streak */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm" title="أيام الممارسة المتتالية">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-orange-400 text-orange-500 animate-pulse" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-medium">الأيام</span>
                <span className="block text-xs sm:text-sm font-bold text-orange-300">{stats.streak} أيام 🔥</span>
              </div>
            </div>

            {/* Words Learned */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm" title="مجموع الكلمات المتقنة">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-medium">المفردات</span>
                <span className="block text-xs sm:text-sm font-bold text-emerald-300">{stats.wordsLearned} متقنة</span>
              </div>
            </div>

            {/* Accuracy Score */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-sm" title="متوسط دقة النطق الصوتي">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-400 font-medium">دقة النطق</span>
                <span className="block text-xs sm:text-sm font-bold text-indigo-300">%{stats.accuracyScore}</span>
              </div>
            </div>

            {/* Level / XP */}
            <button
              onClick={() => {
                playClickSound();
                onOpenStats();
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 hover:border-amber-400/50 transition cursor-pointer text-right group"
              title="اضغطي لعرض تقرير الإنجازات"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="block text-[10px] text-amber-200/70 font-medium">النقاط</span>
                <span className="block text-xs sm:text-sm font-bold text-amber-300">{stats.xp} XP 💎</span>
              </div>
            </button>

            {/* Custom phrase button */}
            <button
              onClick={() => {
                playClickSound();
                onOpenCustomModal();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 hover:bg-emerald-600/50 text-emerald-200 text-xs font-semibold transition"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>جملة مخصصة</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { 
  Flame, BookOpen, Target, Sparkles, Award, ArrowLeft, 
  MessageSquareText, Mic, Languages, GraduationCap, CheckCircle2, TrendingUp, Clock
} from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function DashboardView({ stats, onNavigateTab, onOpenStatsModal }) {
  const learningSections = [
    {
      tabId: 'conversations',
      title: 'وحدات المحادثة الحية',
      description: 'حوارات تفاعلية واقعية في العمل، السفر، والمطاعم مع ميكروفون لتقييم كل جملة.',
      icon: MessageSquareText,
      color: 'from-emerald-500 to-teal-600',
      badge: '4 سيناريوهات واقعية'
    },
    {
      tabId: 'pronunciation',
      title: 'محرك النطق والذكاء الصوتي',
      description: 'تحديات مخارج الحروف مع خوارزمية قياس الدقة الصوتية والتحدي الذهبي.',
      icon: Mic,
      color: 'from-amber-500 to-rose-500',
      badge: 'الميزة الأساسية 🎙️'
    },
    {
      tabId: 'translation',
      title: 'الترجمة ثنائية الاتجاه مع النطق',
      description: 'كتابة بالعربية أو الإنجليزية مع نطق صوتي متبادل وتحليل قواعدي تفصيلي.',
      icon: Languages,
      color: 'from-blue-600 to-indigo-600',
      badge: 'عربي ⇄ إنجليزي'
    },
    {
      tabId: 'grammar_vocab',
      title: 'مركز القواعد والمفردات الأكاديمي',
      description: 'قواعد مبسطة، مقارنات الأخطاء الشائعة، وبطاقات حفظ ذكية ثلاثية الأبعاد.',
      icon: GraduationCap,
      color: 'from-teal-600 to-emerald-700',
      badge: 'شرح أكاديمي منظم'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-right">
      
      {/* Welcome Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أكاديمية أم يزن للتعليم والطلاقة المتطورة • Lingua Um Yazan</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
              مرحباً بكِ مجدداً يا أم يزن 🌸
            </h2>
            
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              منصتكِ التعليمية المتطورة أصبحت جاهزة بالكامل بنظام النطق الصوتي المزدوج (عربي وإنجليزي)، وحوارات العمل والسفر، والترجمة السياقية المتقدمة.
            </p>
          </div>

          {/* Quick Stat Pill in Banner */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-amber-300">{stats.accuracyScore}%</span>
              <span className="text-xs text-slate-400">متوسط دقة النطق</span>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-300">{stats.streak}</span>
              <span className="text-xs text-slate-400">أيام متتالية 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Trackers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-400" />
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">مستمر</span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">الأيام المتتالية</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-orange-300 mt-1 block">{stats.streak} أيام 🔥</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">إتقان</span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">المفردات والعبارات</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-1 block">{stats.wordsLearned} عبارة</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-md">دقيق</span>
          </div>
          <span className="text-xs text-slate-400 block font-medium">معدل دقة الصوت</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-1 block">%{stats.accuracyScore}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenStatsModal();
              }}
              className="text-xs text-amber-300 font-semibold underline hover:text-amber-200 cursor-pointer"
            >
              عرض الأوسمة
            </button>
          </div>
          <span className="text-xs text-slate-400 block font-medium">رصيد الخبرة والمستوى</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 block">{stats.xp} XP 💎</span>
        </div>

      </div>

      {/* Main Educational Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>مسارات التعلم الأكاديمي المتاحة</span>
            <span className="text-xs text-slate-400 font-normal">(اختاري أي مسار للانتقال إليه مباشرة)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.tabId}
                onClick={() => {
                  playClickSound();
                  onNavigateTab(sec.tabId);
                }}
                className="group p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sec.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sec.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white group-hover:text-emerald-300 transition mb-2">
                    {sec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>ابدئي التدريب الآن</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History / Audio Evaluation Records */}
      {stats.history && stats.history.length > 0 && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>سجل آخر تقييمات صوتية لأم يزن:</span>
            </h4>
            <span className="text-xs text-slate-400">{stats.history.length} محاولات مسجلة</span>
          </div>

          <div className="space-y-2.5">
            {stats.history.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                <div className="text-left font-en font-medium text-sm text-slate-200 truncate max-w-xs sm:max-w-md" dir="ltr">
                  "{item.phrase}"
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.accuracy >= 85
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    الدقة: %{item.accuracy}
                  </span>
                  {item.isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { LayoutDashboard, MessageSquareText, Mic, Languages, GraduationCap } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function NavigationTabs({ activeTab, onSelectTab }) {
  const tabs = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم والمتابعة',
      sublabel: 'تتبع الإنجاز، الأيام، ونقاط الطلاقة',
      icon: LayoutDashboard,
      badge: 'نظرة شاملة',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'conversations',
      label: 'وحدات المحادثة الواقعية',
      sublabel: 'حوارات حية: العمل، السفر، والحياة اليومية',
      icon: MessageSquareText,
      badge: 'حوارات حية 💬',
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'pronunciation',
      label: 'محرك النطق والتحدي الصوتي',
      sublabel: 'تحليل دقة مخارج الحروف والكلمات المخصصة',
      icon: Mic,
      badge: 'الأساسي 🎙️',
      color: 'from-amber-500 to-rose-500'
    },
    {
      id: 'translation',
      label: 'الترجمة ثنائية الاتجاه (عربي ⇄ إنجليزي)',
      sublabel: 'ترجمة سياقية ذكية ونطق صوتي متكامل',
      icon: Languages,
      badge: 'ثنائي الاتجاه 🔄',
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'grammar_vocab',
      label: 'مركز القواعد والمفردات',
      sublabel: 'قواعد تفاعلية، أخطاء شائعة، وبطاقات حفظ',
      icon: GraduationCap,
      badge: 'أكاديمي 📚',
      color: 'from-teal-600 to-emerald-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-start p-3 sm:p-3.5 rounded-xl text-right transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/95 text-white shadow-md border border-slate-700 ring-1 ring-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <div className={`absolute top-0 right-0 left-0 h-1 rounded-t-xl bg-gradient-to-r ${tab.color}`}></div>
              )}

              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? `bg-gradient-to-tr text-white shadow-md scale-105 ${tab.color}`
                      : 'bg-slate-850 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950/60 text-slate-300 font-medium border border-slate-800">
                  {tab.badge}
                </span>
              </div>

              <span className={`font-bold text-xs sm:text-sm line-clamp-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                {tab.label}
              </span>
              <p className="text-[11px] text-slate-400/90 line-clamp-1 mt-0.5 hidden sm:block">
                {tab.sublabel}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

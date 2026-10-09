import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import DashboardView from './components/DashboardView';
import ConversationalStudio from './components/ConversationalStudio';
import PronunciationStudio from './components/PronunciationStudio';
import BiDirectionalTranslator from './components/BiDirectionalTranslator';
import GrammarVocabHub from './components/GrammarVocabHub';
import SecondaryChallengeModal from './components/SecondaryChallengeModal';
import StatsModal from './components/StatsModal';
import CustomPracticeModal from './components/CustomPracticeModal';
import { loadUserStats, saveUserStats, recordAttempt } from './utils/storage';
import { playClickSound } from './utils/soundEffects';

export default function App() {
  const [stats, setStats] = useState(() => loadUserStats());
  // Active learning tab: 'dashboard' | 'conversations' | 'pronunciation' | 'translation' | 'grammar_vocab'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSecondaryModalOpen, setIsSecondaryModalOpen] = useState(false);
  const [selectedSecondaryChallenge, setSelectedSecondaryChallenge] = useState(null);

  // Custom challenge transferred from translator or custom input
  const [customChallengeData, setCustomChallengeData] = useState(null);

  // Sync stats changes to localStorage
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  // Handler for recording voice attempt
  const handleRecordAttempt = ({ challengeId, accuracy, phrase, isPassed }) => {
    setStats(prev => recordAttempt(prev, { challengeId, accuracy, phrase, isPassed }));
  };

  // Handler for triggering secondary challenge modal (when accuracy >= 85%)
  const handleTriggerSecondaryChallenge = (challenge) => {
    setSelectedSecondaryChallenge(challenge);
    setIsSecondaryModalOpen(true);
  };

  // Handler for completing secondary challenge
  const handleCompleteSecondary = (bonusXP) => {
    setStats(prev => ({
      ...prev,
      xp: (prev.xp || 0) + bonusXP,
      wordsLearned: (prev.wordsLearned || 34) + 1
    }));
  };

  // Handler to send sentence from Translator straight to Voice Studio
  const handleSendToVoiceStudio = (challengeObj) => {
    setCustomChallengeData(challengeObj);
    setActiveTab('pronunciation');
  };

  // Handler for adding custom challenge
  const handleAddCustomChallenge = (challengeObj) => {
    setCustomChallengeData(challengeObj);
    setActiveTab('pronunciation');
  };

  // Update mastered words count
  const handleUpdateMastered = (count) => {
    setStats(prev => ({
      ...prev,
      wordsLearned: Math.max(prev.wordsLearned || 34, 34 + count)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      
      {/* Top Header */}
      <Header
        stats={stats}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Main Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Learning Hub Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            onNavigateTab={setActiveTab}
            onOpenStatsModal={() => setIsStatsModalOpen(true)}
          />
        )}

        {activeTab === 'conversations' && (
          <ConversationalStudio
            onTriggerSecondaryChallenge={handleTriggerSecondaryChallenge}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationStudio
            onTriggerSecondaryChallenge={handleTriggerSecondaryChallenge}
            onRecordAttempt={handleRecordAttempt}
            customChallengeData={customChallengeData}
          />
        )}

        {activeTab === 'translation' && (
          <BiDirectionalTranslator
            onSendToVoiceStudio={handleSendToVoiceStudio}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'grammar_vocab' && (
          <GrammarVocabHub
            onRecordAttempt={handleRecordAttempt}
            onUpdateMastered={handleUpdateMastered}
          />
        )}
      </main>

      {/* Modals */}
      <SecondaryChallengeModal
        isOpen={isSecondaryModalOpen}
        onClose={() => setIsSecondaryModalOpen(false)}
        challenge={selectedSecondaryChallenge}
        onComplete={handleCompleteSecondary}
        userStats={stats}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />

      <CustomPracticeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddCustomChallenge={handleAddCustomChallenge}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            منصة <span className="font-bold text-slate-400">Lingua Um Yazan (موقع أم يزن للتعليم المتطور)</span> • صُممت خصيصاً لدعم الطلاقة اللغوية
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>محرك صوتي متكامل (Web Speech API)</span>
              <span>🎙️</span>
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-500/30 text-amber-300 font-bold tracking-wide shadow-sm">
              <span className="text-slate-400 font-normal">تطوير:</span>
              <span className="font-en text-amber-200">MAHDI ABO QESAR</span>
              <span>⭐</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

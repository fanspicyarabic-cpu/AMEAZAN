// LocalStorage persistence for Um Yazan's progress, streak, and achievements

const STORAGE_KEY = 'um_yazan_lingua_progress';

const DEFAULT_STATS = {
  streak: 7,
  wordsLearned: 34,
  totalAttempts: 48,
  accuracyScore: 86,
  xp: 1250,
  level: "فارسة الطلاقة الإنجليزية 🌟",
  masteredChallengeIds: [1, 2],
  history: []
};

export function loadUserStats() {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to load user stats", e);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save user stats", e);
  }
}

export function recordAttempt(stats, { challengeId, accuracy, phrase, isPassed }) {
  const newAttempts = (stats.totalAttempts || 0) + 1;
  const currentAvg = stats.accuracyScore || 80;
  // Rolling average
  const newAvg = Math.round((currentAvg * 0.7) + (accuracy * 0.3));
  
  const xpGained = isPassed ? (accuracy >= 90 ? 30 : 20) : 5;
  const newXP = (stats.xp || 0) + xpGained;

  let mastered = stats.masteredChallengeIds || [];
  if (isPassed && !mastered.includes(challengeId)) {
    mastered = [...mastered, challengeId];
  }

  const updated = {
    ...stats,
    totalAttempts: newAttempts,
    accuracyScore: newAvg,
    xp: newXP,
    wordsLearned: mastered.length + 32, // base starting words
    masteredChallengeIds: mastered,
    history: [
      {
        date: new Date().toISOString(),
        phrase,
        accuracy,
        isPassed
      },
      ...(stats.history || []).slice(0, 19)
    ]
  };

  saveUserStats(updated);
  return updated;
}

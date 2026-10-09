// Advanced speech validation algorithm using normalized Levenshtein distance and token diffing

export function cleanText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Compute Levenshtein distance between two strings
export function levenshteinDistance(a, b) {
  const s1 = a || "";
  const s2 = b || "";
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

// Calculate similarity score between 0 and 100
export function calculateAccuracy(spoken, target) {
  const cleanSpoken = cleanText(spoken);
  const cleanTarget = cleanText(target);

  if (!cleanSpoken || !cleanTarget) return 0;
  if (cleanSpoken === cleanTarget) return 100;

  // Character-level Levenshtein similarity
  const maxCharLen = Math.max(cleanSpoken.length, cleanTarget.length);
  const charDist = levenshteinDistance(cleanSpoken, cleanTarget);
  const charScore = Math.max(0, (1 - charDist / maxCharLen) * 100);

  // Word-level token similarity
  const spokenWords = cleanSpoken.split(" ");
  const targetWords = cleanTarget.split(" ");

  let wordMatches = 0;
  targetWords.forEach(tw => {
    const matched = spokenWords.some(sw => {
      if (sw === tw) return true;
      const dist = levenshteinDistance(sw, tw);
      return dist <= 1 && tw.length > 3; // allow 1 minor typo/phonetic variation
    });
    if (matched) wordMatches++;
  });

  const wordScore = (wordMatches / targetWords.length) * 100;

  // Weighted hybrid score
  const finalScore = Math.round(charScore * 0.45 + wordScore * 0.55);
  return Math.min(100, Math.max(0, finalScore));
}

// Token diffing to highlight which words were spoken accurately vs missed
export function evaluateWordTokens(targetSentence, spokenSentence) {
  const cleanTarget = cleanText(targetSentence);
  const cleanSpoken = cleanText(spokenSentence);

  const targetTokens = targetSentence.split(/\s+/);
  const spokenTokens = cleanSpoken.split(/\s+/).filter(Boolean);

  return targetTokens.map((rawWord) => {
    const cleanWord = cleanText(rawWord);
    
    // Check exact or close match
    const exactMatch = spokenTokens.includes(cleanWord);
    const closeMatch = !exactMatch && spokenTokens.some(sw => {
      const dist = levenshteinDistance(sw, cleanWord);
      return dist <= 1 && cleanWord.length > 3;
    });

    return {
      word: rawWord,
      clean: cleanWord,
      status: exactMatch ? 'exact' : (closeMatch ? 'close' : 'missed')
    };
  });
}

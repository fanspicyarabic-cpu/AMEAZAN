import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, Mic, MicOff, RotateCcw, CheckCircle2, AlertCircle, 
  Sparkles, Award, ArrowRight, ArrowLeft, Lightbulb, Play, Pause, 
  Headphones, ShieldCheck, PlusCircle, Trash2, X, BookmarkPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CHALLENGE_CATEGORIES, PRONUNCIATION_CHALLENGES } from '../data/curatedChallenges';
import { speakEnglishText, speakArabicText, stopSpeaking } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { calculateAccuracy, evaluateWordTokens } from '../utils/similarity';
import { playClickSound, playSuccessSound, playTryAgainSound, playCelebrationFanfare } from '../utils/soundEffects';

const STORAGE_CUSTOM_KEY = 'um_yazan_custom_phrases';

export default function PronunciationStudio({ 
  onTriggerSecondaryChallenge, 
  onRecordAttempt,
  customChallengeData
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Custom User Challenges loaded from localStorage
  const [userCustomList, setUserCustomList] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modal for Adding Custom Word/Phrase
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEnText, setNewEnText] = useState('');
  const [newArText, setNewArText] = useState('');
  const [newTranslit, setNewTranslit] = useState('');

  // Microphone permission status
  const [micPermissionGranted, setMicPermissionGranted] = useState(null);
  const [permissionNotice, setPermissionNotice] = useState('');

  // Results & Evaluation State
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(null);
  const [evaluationTokens, setEvaluationTokens] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  const recognizerRef = useRef(null);

  // Sync custom phrases to localStorage
  const saveCustomList = (updated) => {
    setUserCustomList(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(updated));
    }
  };

  // Add new phrase from form
  const handleCreateCustomPhrase = (e) => {
    e.preventDefault();
    if (!newEnText.trim()) return;

    playClickSound();
    const newItem = {
      id: 'custom-' + Date.now(),
      category: 'custom',
      target: newEnText.trim(),
      phonetic: "/custom practice/",
      arabicTransliteration: newTranslit.trim() || "نطق إنجليزي مخصص",
      translation: newArText.trim() || "عبارة تدريب خاصة بأم يزن",
      contextTip: "عبارة أضفتِها بنفسكِ لتطوير طلاقتكِ ونطقكِ اليومي.",
      difficulty: "مخصص",
      audioTip: "استمعي للفظ الصوتي أولاً ثم كرري بصوت واضح وواثق.",
      isUserCreated: true,
      secondaryChallenge: {
        type: "sentence",
        prompt: "أحسنتِ النطق يا أم يزن! استخدمي هذه العبارة في حديثكِ اليومي:",
        targetSentence: newEnText.trim(),
        targetSentenceArabic: newArText.trim() || "عبارة تدريب خاصة",
        bonusXP: 50
      }
    };

    const updated = [newItem, ...userCustomList];
    saveCustomList(updated);

    setNewEnText('');
    setNewArText('');
    setNewTranslit('');
    setIsAddModalOpen(false);

    // Switch view to custom category and show this phrase immediately
    setSelectedCategory('custom');
    setCurrentIndex(0);
    playSuccessSound();
  };

  // Delete a custom phrase
  const handleDeleteCustom = (idToDelete) => {
    playClickSound();
    const updated = userCustomList.filter(item => item.id !== idToDelete);
    saveCustomList(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  // Combined challenge list
  const activeChallenges = React.useMemo(() => {
    let list = [...userCustomList, ...PRONUNCIATION_CHALLENGES];
    if (customChallengeData) {
      list = [customChallengeData, ...list];
    }
    if (selectedCategory === 'all') return list;
    if (selectedCategory === 'custom') return userCustomList.length > 0 ? userCustomList : PRONUNCIATION_CHALLENGES;
    return list.filter(c => c.category === selectedCategory);
  }, [selectedCategory, userCustomList, customChallengeData]);

  const currentChallenge = activeChallenges[currentIndex] || PRONUNCIATION_CHALLENGES[0];

  // Reset states when switching challenge
  useEffect(() => {
    setSpokenTranscript('');
    setAccuracyScore(null);
    setEvaluationTokens([]);
    setErrorMessage('');
    setEvaluationFeedback(null);
    setRecordedAudioUrl(null);
    stopSpeaking();
    setIsPlayingAudio(false);
    setIsListening(false);
  }, [currentIndex, selectedCategory, customChallengeData]);

  // Request browser microphone permission explicitly
  const handleRequestMicPermission = async () => {
    playClickSound();
    setErrorMessage('');
    const result = await requestMicrophonePermission();
    if (result.success) {
      setMicPermissionGranted(true);
      setPermissionNotice('تم تفعيل إذن الميكروفون بنجاح! يمكنكِ الآن التحدث بحرية.');
      playSuccessSound();
      setTimeout(() => setPermissionNotice(''), 4000);
    } else {
      setMicPermissionGranted(false);
      setErrorMessage(result.error || 'تعذر الحصول على إذن الميكروفون.');
      playTryAgainSound();
    }
  };

  // Handle Playback Listen
  const handleListen = (speed = playbackSpeed) => {
    playClickSound();
    setIsPlayingAudio(true);
    speakEnglishText(currentChallenge.target, {
      rate: speed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  // Listen to Arabic translation
  const handleListenArabic = () => {
    playClickSound();
    speakArabicText(currentChallenge.translation, { rate: 0.95 });
  };

  // Toggle Speed
  const toggleSpeed = () => {
    playClickSound();
    const nextSpeed = playbackSpeed === 1.0 ? 0.75 : 1.0;
    setPlaybackSpeed(nextSpeed);
    handleListen(nextSpeed);
  };

  // Handle Speech Recognition Speak Now
  const handleSpeakNow = async () => {
    playClickSound();
    setErrorMessage('');
    setSpokenTranscript('');
    setAccuracyScore(null);
    setEvaluationTokens([]);
    setEvaluationFeedback(null);
    setRecordedAudioUrl(null);

    // Prompt microphone permission proactively
    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      setErrorMessage(perm.error || 'يرجى السماح بصلاحية الميكروفون في المتصفح للبدء في النطق.');
      setMicPermissionGranted(false);
      return;
    }
    setMicPermissionGranted(true);

    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }

    recognizerRef.current = createSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onAudioBlob: (url) => {
        setRecordedAudioUrl(url);
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err.message);
        playTryAgainSound();
      },
      onResult: (result) => {
        setIsListening(false);
        const transcript = result.transcript;
        setSpokenTranscript(transcript);

        if (result.audioUrl) {
          setRecordedAudioUrl(result.audioUrl);
        }

        // Calculate real accuracy strictly
        let score = 0;
        let tokens = [];

        if (result.isAcoustic) {
          score = result.acousticScore;
          tokens = currentChallenge.target.split(/\s+/).map((w, i) => ({
            word: w,
            status: score >= 85 ? 'exact' : (i === 0 ? 'close' : 'missed')
          }));
        } else {
          score = calculateAccuracy(transcript, currentChallenge.target);
          tokens = evaluateWordTokens(currentChallenge.target, transcript);
        }

        setAccuracyScore(score);
        setEvaluationTokens(tokens);

        const isPassed = score >= 85;

        if (isPassed) {
          playCelebrationFanfare();
          // Confetti explosion
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.6 }
          });

          setEvaluationFeedback({
            type: 'success',
            title: 'أحسنتِ وأبدعتِ يا أم يزن! 🌟 (إتقان فائق)',
            message: `نطقكِ في غاية الوضوح والطلاقة بنسبة دقة %${score}. تم فتح التحدي الذهبي!`,
            hasSecondary: Boolean(currentChallenge.secondaryChallenge)
          });

          // Record stats
          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: currentChallenge.id,
              accuracy: score,
              phrase: currentChallenge.target,
              isPassed: true
            });
          }

          // Trigger secondary challenge after a short celebratory moment
          if (currentChallenge.secondaryChallenge) {
            setTimeout(() => {
              if (onTriggerSecondaryChallenge) {
                onTriggerSecondaryChallenge(currentChallenge);
              }
            }, 1800);
          }

        } else {
          // Strict error state - user must retry!
          playTryAgainSound();
          setEvaluationFeedback({
            type: 'retry',
            title: 'النطق غير صحيح يا أم يزن ❌ (يجب إعادة المحاولة)',
            message: `نسبة التطابق %${score} فقط (المطلوب 85%). سمعنا: "${transcript || 'نطق غير مفهوم'}" والمطلوب: "${currentChallenge.target}". يرجى الاستماع للنطق الصحيح والمحاولة مرة أخرى.`,
            hasSecondary: false
          });

          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: currentChallenge.id,
              accuracy: score,
              phrase: currentChallenge.target,
              isPassed: false
            });
          }
        }
      }
    }, currentChallenge.target);

    recognizerRef.current.start();
  };

  const handleStopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      setIsListening(false);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < activeChallenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(activeChallenges.length - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Top Action Bar: Add Custom Word / Phrase Button */}
      <div className="mb-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div>
          <span className="text-sm font-black text-white flex items-center gap-2">
            <BookmarkPlus className="w-5 h-5 text-emerald-400" />
            <span>تدربي على أي كلمة أو جملة تختارينها يا أم يزن!</span>
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            أضيفي أي عبارة ترغبين بها لاختبار نطقكِ لها بالصوت فوراً وحفظها في بنك عباراتكِ.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>➕ أضيفي كلمتكِ للتدرب الآن</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
        <button
          onClick={() => {
            playClickSound();
            setSelectedCategory('all');
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
          }`}
        >
          ✨ جميع التحديات ({activeChallenges.length})
        </button>

        {userCustomList.length > 0 && (
          <button
            onClick={() => {
              playClickSound();
              setSelectedCategory('custom');
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'custom'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-slate-700'
            }`}
          >
            <span>⭐</span>
            <span>عباراتي المضافة ({userCustomList.length})</span>
          </button>
        )}

        {CHALLENGE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              playClickSound();
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Explicit Microphone Permission Prompt Banner */}
      <div className="mb-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              صلاحية الميكروفون لكافة المتصفحات والهواتف:
            </span>
            <span className="text-[11px] text-slate-400">
              {micPermissionGranted ? 'الميكروفون مفعّل وجاهز بنجاح ✅' : 'يدعم هواتف iPhone وAndroid وChrome وSafari والمتصفحات كافة'}
            </span>
          </div>
        </div>

        <button
          onClick={handleRequestMicPermission}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            micPermissionGranted
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow hover:opacity-90'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>{micPermissionGranted ? 'إذن الميكروفون نشط' : 'اضغطي لإعطاء صلاحية الصوت 🎙️'}</span>
        </button>
      </div>

      {permissionNotice && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-right animate-in fade-in">
          {permissionNotice}
        </div>
      )}

      {/* Main Pronunciation Card */}
      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl p-6 sm:p-10 backdrop-blur-xl overflow-hidden text-right">
        
        {/* Decorative ambient lights */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Challenge Header / Counter */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
              تحدي رقم {currentIndex + 1} من {activeChallenges.length}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.7 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {currentChallenge.difficulty || 'متوسط'}
            </span>
            {currentChallenge.isUserCreated && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                عبارة خاصة بأم يزن ⭐
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {currentChallenge.isUserCreated && (
              <button
                onClick={() => handleDeleteCustom(currentChallenge.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition mr-1"
                title="حذف هذه العبارة المخصصة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="التحدي السابق"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="التحدي التالي"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Phrase Display */}
        <div className="text-center py-4 sm:py-6">
          <div className="inline-block relative">
            <h2 className="font-en text-3xl sm:text-5xl font-extrabold text-white tracking-wide leading-tight">
              {currentChallenge.target}
            </h2>

            {/* Audio wave animation when playing */}
            {isPlayingAudio && (
              <div className="flex items-center justify-center gap-1 mt-3">
                <span className="w-1.5 bg-amber-400 rounded-full animate-wave-1"></span>
                <span className="w-1.5 bg-rose-400 rounded-full animate-wave-2"></span>
                <span className="w-1.5 bg-indigo-400 rounded-full animate-wave-3"></span>
                <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-4"></span>
                <span className="w-1.5 bg-amber-400 rounded-full animate-wave-5"></span>
              </div>
            )}
          </div>

          {/* Phonetic & Arabic Transliteration */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="font-en text-sm sm:text-base text-indigo-300 font-mono bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-800/60">
              {currentChallenge.phonetic}
            </span>
            <span className="text-sm sm:text-base text-amber-300/90 font-semibold bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-800/40">
              النطق بالعربي: {currentChallenge.arabicTransliteration}
            </span>
          </div>

          {/* Arabic Meaning & Context Note */}
          <div className="mt-6 max-w-xl mx-auto p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-right">
            <div className="flex items-center justify-between mb-1">
              <span className="text-base sm:text-lg font-bold text-slate-100">
                المعنى: {currentChallenge.translation}
              </span>
              <button
                onClick={handleListenArabic}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                title="استمع للترجمة العربية"
              >
                استماع عربي 🇸🇦
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              💡 {currentChallenge.contextTip}
            </p>
          </div>

          {/* Pronunciation audio tip */}
          {currentChallenge.audioTip && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-rose-300/90">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>تنبيه النطق: {currentChallenge.audioTip}</span>
            </div>
          )}
        </div>

        {/* Primary Interactive Action Buttons (Button 1: استماع / Button 2: انطق الآن) */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          {/* Button 1: استماع (Listen) with speed selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleListen(playbackSpeed)}
              disabled={isPlayingAudio}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg cursor-pointer ${
                isPlayingAudio
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-2 ring-indigo-400'
                  : 'bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/60 shadow-slate-950'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'جاري الاستماع...' : '1. استماع (Listen)'}</span>
            </button>

            {/* Speed toggle (1.0x vs 0.75x) */}
            <button
              onClick={toggleSpeed}
              className="px-3 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 transition cursor-pointer"
              title="تغيير سرعة النطق (عادي / بطيء للتوضيح)"
            >
              {playbackSpeed === 1.0 ? '1.0x عادي' : '0.75x متأنٍ'}
            </button>
          </div>

          {/* Button 2: انطق الآن (Speak Now) with Microphone */}
          <div className="w-full sm:w-auto">
            {!isListening ? (
              <button
                onClick={handleSpeakNow}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 hover:from-amber-300 hover:via-rose-400 hover:to-indigo-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Mic className="w-5 h-5 text-slate-950" />
                <span>2. انطق الآن يا أم يزن (Speak Now) 🎙️</span>
              </button>
            ) : (
              <button
                onClick={handleStopListening}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base bg-rose-600 text-white shadow-xl shadow-rose-600/40 animate-pulse transition cursor-pointer ring-4 ring-rose-500/30"
              >
                <MicOff className="w-5 h-5 animate-spin" />
                <span>جاري الاستماع إليكِ... اضغطي للتوقف</span>
              </button>
            )}
          </div>

        </div>

        {/* Listening Active Visual Indicator */}
        {isListening && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center animate-in fade-in">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-sm font-bold text-rose-300">
                الميكروفون نشط الآن يا أم يزن!
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تحدثي بوضوح بنبرة هادئة، وسنقوم بتحليل مخارج الألفاظ ومقارنتها بالذكاء الصوتي فوراً.
            </p>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold">تنبيه الميكروفون:</p>
              <p className="mt-0.5">{errorMessage}</p>
              <button
                onClick={handleRequestMicPermission}
                className="mt-2 px-3 py-1 rounded-lg bg-rose-800 text-white text-xs font-bold underline"
              >
                إعطاء الصلاحية الآن
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Validation & Evaluation Results Panel */}
        {accuracyScore !== null && (
          <div className="mt-8 pt-6 border-t border-slate-800 text-right animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Header / Score Display */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/90 border border-slate-700">
              
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                    accuracyScore >= 85
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  %{accuracyScore}
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {evaluationFeedback?.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {evaluationFeedback?.message}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {accuracyScore >= 85 ? (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    تم الاجتياز بتفوق (85%+)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    <RotateCcw className="w-4 h-4" />
                    يحتاج إعادة تدريب
                  </span>
                )}
              </div>
            </div>

            {/* Spoken Text Comparison */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left" dir="ltr">
              <div className="flex items-center justify-between mb-1" dir="rtl">
                <span className="text-xs text-slate-400 font-medium">ما استمع إليه النظام من صوتكِ:</span>
                {recordedAudioUrl && (
                  <button
                    onClick={() => {
                      const audio = new Audio(recordedAudioUrl);
                      audio.play();
                    }}
                    className="flex items-center gap-1 text-xs text-amber-300 underline font-semibold"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>استمعي لتسجيلكِ الصوتي 🎧</span>
                  </button>
                )}
              </div>
              <p className="font-en text-lg text-amber-100 font-medium py-1">
                "{spokenTranscript || '---'}"
              </p>

              {/* Token-by-token diff highlighting */}
              <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {evaluationTokens.map((token, i) => (
                  <span
                    key={i}
                    className={`font-en text-xs px-2.5 py-1 rounded-lg font-mono border transition ${
                      token.status === 'exact'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : token.status === 'close'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {token.word} {token.status === 'exact' ? '✓' : (token.status === 'close' ? '≈' : '✗')}
                  </span>
                ))}
              </div>
            </div>

            {/* Secondary Challenge Trigger Option (Gamification >= 85%) */}
            {accuracyScore >= 85 && currentChallenge.secondaryChallenge && (
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-200">
                      تم فتح التحدي الثانوي الذهبي! 🏆
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    ضعي هذه العبارة في جملة واقعية كاملة واكسبي +{currentChallenge.secondaryChallenge.bonusXP} نقطة إضافية.
                  </p>
                </div>

                <button
                  onClick={() => {
                    playClickSound();
                    if (onTriggerSecondaryChallenge) {
                      onTriggerSecondaryChallenge(currentChallenge);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer whitespace-nowrap"
                >
                  انتقلي للتحدي الذهبي الآن 🌟
                </button>
              </div>
            )}

            {/* Retry Button if < 80% */}
            {accuracyScore < 85 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-200 text-right">
                  💡 نصيحة لأم يزن: استمعي للفظ بالسرعة المتأنية (0.75x) ثم اضغطي على زر "انطق الآن" مجدداً!
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleListen(0.75)}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition"
                  >
                    استماع بطيء 0.75x
                  </button>
                  <button
                    onClick={handleSpeakNow}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow"
                  >
                    إعادة المحاولة 🎙️
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Quick Navigation Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 hover:text-slate-200 transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        <span className="font-medium text-slate-500">
          منصة Lingua Um Yazan • تدعم كافة المتصفحات وإضافة الكلمات المخصصة
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 hover:text-slate-200 transition"
        >
          <span>التالي</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Modal: Add Custom Phrase Directly */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-right">
            
            <button
              onClick={() => {
                playClickSound();
                setIsAddModalOpen(false);
              }}
              className="absolute top-5 left-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <BookmarkPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  إضافة كلمة أو جملة مخصصة للتحدي الصوتي
                </h3>
                <p className="text-xs text-slate-400">
                  أدخلي أي عبارة ترغبين بالتدرب عليها، وستُضاف فوراً إلى استوديو النطق
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomPhrase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الكلمة أو الجملة بالإنجليزية (English Phrase): *
                </label>
                <input
                  type="text"
                  value={newEnText}
                  onChange={(e) => setNewEnText(e.target.value)}
                  placeholder="e.g. Good morning, have a blessed day!"
                  dir="ltr"
                  required
                  className="w-full font-en p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المعنى باللغة العربية: (اختياري)
                </label>
                <input
                  type="text"
                  value={newArText}
                  onChange={(e) => setNewArText(e.target.value)}
                  placeholder="مثال: صباح الخير، أتمنى لكِ يوماً مباركاً!"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  طريقة النطق بالعربي (اختياري لتسهيل القراءة):
                </label>
                <input
                  type="text"
                  value={newTranslit}
                  onChange={(e) => setNewTranslit(e.target.value)}
                  placeholder="مثال: غود مورنينغ، هاف أ بلست داي!"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>حفظ وبدء التدرب الفوري عليها 🚀</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

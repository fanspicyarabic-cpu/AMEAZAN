import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Mic, MicOff, Volume2, Sparkles, Send, RotateCcw, 
  CheckCircle2, Headphones, Settings, MessageSquare, Award, ArrowLeft, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  evaluatePronunciationWithAI, 
  generateAITutorResponse, 
  getAISettings, 
  saveAISettings 
} from '../utils/aiSpeechCoach';
import { speakEnglishText, speakArabicText, stopSpeaking } from '../utils/speechSynthesis';
import { createSpeechRecognizer, requestMicrophonePermission } from '../utils/speechRecognition';
import { playClickSound, playSuccessSound, playTryAgainSound, playCelebrationFanfare } from '../utils/soundEffects';

export default function AITutorStudio({ onRecordAttempt }) {
  const [activeMode, setActiveMode] = useState('conversation'); // 'conversation' | 'analysis'
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      enText: "Hello, Um Yazan! I am your AI English Coach. How can I help you speak English fluently today?",
      arText: "أهلاً بكِ يا أم يزن! أنا معلمتكِ الذكية لتعليم الإنجليزية. كيف يمكنني مساعدتكِ على التحدث بطلاقة اليوم؟",
      time: "الآن"
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [userSpokenText, setUserSpokenText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState(() => getAISettings().provider);
  const [aiKey, setAiKey] = useState(() => getAISettings().apiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Analysis Mode State
  const [targetSentence, setTargetSentence] = useState("I am confident in my abilities to speak English fluently.");
  const [analysisResult, setAnalysisResult] = useState(null);

  const recognizerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Audio Playback
  const handleListenEn = (text) => {
    playClickSound();
    speakEnglishText(text, { rate: 0.95 });
  };

  const handleListenAr = (text) => {
    playClickSound();
    speakArabicText(text, { rate: 0.95 });
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    playClickSound();
    saveAISettings({ provider: aiProvider, apiKey: aiKey });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsOpen(false);
    }, 1500);
  };

  // Send message to AI in Conversation Mode
  const handleSendMessage = async (textToSend) => {
    const message = textToSend || typedMessage;
    if (!message.trim()) return;

    playClickSound();
    const newMsg = {
      sender: 'user',
      enText: message,
      arText: 'حديث أم يزن بالصوت / النص',
      time: 'الآن'
    };

    setChatMessages(prev => [...prev, newMsg]);
    setTypedMessage('');
    setIsAiThinking(true);

    try {
      const aiResponse = await generateAITutorResponse(message);
      setIsAiThinking(false);

      const aiMsg = {
        sender: 'ai',
        enText: aiResponse.enReply,
        arText: aiResponse.arReply,
        followUpEn: aiResponse.followUpEn,
        followUpAr: aiResponse.followUpAr,
        time: 'الآن'
      };

      setChatMessages(prev => [...prev, aiMsg]);
      playSuccessSound();

      // Automatically speak the AI response so Um Yazan hears the natural teacher's voice!
      speakEnglishText(aiResponse.enReply, { rate: 0.95 });

    } catch (e) {
      setIsAiThinking(false);
      console.error("AI response error:", e);
    }
  };

  // Voice Interaction for Conversation Mode
  const handleVoiceChat = async () => {
    playClickSound();
    setUserSpokenText('');

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      alert(perm.error || 'يرجى تفعيل صلاحية الميكروفون في المتصفح.');
      return;
    }

    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }

    recognizerRef.current = createSpeechRecognizer({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onAudioBlob: (url) => setAudioUrl(url),
      onError: (err) => {
        setIsListening(false);
        playTryAgainSound();
      },
      onResult: (res) => {
        setIsListening(false);
        const transcript = res.transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      }
    }, "Hello English coach");

    recognizerRef.current.start();
  };

  // Voice Interaction for Pronunciation Analysis Mode
  const handleAnalyzeVoice = async () => {
    playClickSound();
    setAnalysisResult(null);

    const perm = await requestMicrophonePermission();
    if (!perm.success) {
      alert(perm.error || 'يرجى تفعيل صلاحية الميكروفون.');
      return;
    }

    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }

    const startTime = Date.now();

    recognizerRef.current = createSpeechRecognizer({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onAudioBlob: (url) => setAudioUrl(url),
      onError: () => {
        setIsListening(false);
        playTryAgainSound();
      },
      onResult: async (res) => {
        setIsListening(false);
        const durationSec = (Date.now() - startTime) / 1000;
        const spoken = res.transcript;

        const evaluation = await evaluatePronunciationWithAI({
          targetText: targetSentence,
          spokenText: spoken,
          durationSec: durationSec,
          audioBlobUrl: res.audioUrl || audioUrl
        });

        setAnalysisResult(evaluation);

        if (evaluation.isPassed) {
          playCelebrationFanfare();
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          if (onRecordAttempt) {
            onRecordAttempt({
              challengeId: 'ai-eval-' + Date.now(),
              accuracy: evaluation.accuracyScore,
              phrase: targetSentence,
              isPassed: true
            });
          }
        } else {
          playTryAgainSound();
        }
      }
    }, targetSentence);

    recognizerRef.current.start();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-right">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-500/20">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  المعلمة الذكية للذكاء الاصطناعي (AI Voice Coach)
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold">
                  ذكاء اصطناعي صوتي متصل ✨
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                تحدثي بالصوت مع المعلمة الذكية، واحصلي على تقييم فوري لمخارج الحروف ونصائح مخصصة لأم يزن.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setIsSettingsOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="إعدادات الذكاء الاصطناعي"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>إعدادات الذكاء الاصطناعي</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              playClickSound();
              setActiveMode('conversation');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeMode === 'conversation'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>محادثة صوتية حية مع المعلمة الذكية</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveMode('analysis');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeMode === 'analysis'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>التحليل الصوتي المعمق لنطق جملة</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Live Voice Conversation with AI Teacher */}
      {activeMode === 'conversation' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[560px]">
          
          {/* Chat Stream Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, index) => {
              const isAi = msg.sender === 'ai';

              return (
                <div
                  key={index}
                  className={`flex flex-col ${isAi ? 'items-start text-right' : 'items-end text-left'}`}
                >
                  <div
                    className={`max-w-xl p-4 sm:p-5 rounded-3xl ${
                      isAi
                        ? 'bg-slate-800/90 border border-indigo-500/30 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-white/10">
                      <span className="text-[11px] font-bold text-indigo-300">
                        {isAi ? 'المعلمة الذكية (AI Coach) 🤖' : 'أم يزن 🌸'}
                      </span>
                      {isAi && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleListenEn(msg.enText)}
                            className="p-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-indigo-300"
                            title="استمع للرد الإنجليزي"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="font-en text-base sm:text-lg font-bold leading-relaxed" dir="ltr">
                      {msg.enText}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-300 mt-2 border-t border-white/10 pt-1.5 font-medium">
                      {msg.arText}
                    </p>

                    {msg.followUpEn && (
                      <div className="mt-3 p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 text-xs">
                        <span className="font-bold text-amber-300 block mb-0.5">سؤال المعلمة المقترح لأم يزن:</span>
                        <p className="font-en text-white font-semibold" dir="ltr">{msg.followUpEn}</p>
                        <p className="text-slate-300 text-[11px] mt-0.5">{msg.followUpAr}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs text-indigo-300 bg-slate-800/60 p-3 rounded-2xl w-fit">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span>المعلمة الذكية تستمع لصوتكِ وتعد الإجابة...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Control Input Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={handleVoiceChat}
              disabled={isListening}
              className={`p-3.5 rounded-2xl font-bold transition flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md hover:scale-105'
              }`}
              title="تحدثي بالصوت مباشرة"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتبي أو اضغطي الميكروفون للتحدث مع المعلمة..."
              dir="auto"
              className="flex-1 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!typedMessage.trim()}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* Mode 2: Deep Pronunciation AI Analysis */}
      {activeMode === 'analysis' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <label className="text-xs font-bold text-slate-300 block">
              الجملة الإنجليزية المراد فحصها بالذكاء الاصطناعي:
            </label>
            <input
              type="text"
              value={targetSentence}
              onChange={(e) => setTargetSentence(e.target.value)}
              className="w-full font-en p-4 rounded-2xl bg-slate-950 border border-slate-700 text-white text-base sm:text-lg focus:outline-none focus:border-indigo-500"
              dir="ltr"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleListenEn(targetSentence)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-indigo-300 text-xs font-bold hover:bg-slate-750 transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمعي للنطق النموذجي</span>
              </button>

              <button
                onClick={handleAnalyzeVoice}
                disabled={isListening}
                className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:opacity-95'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span>{isListening ? 'جاري الاستماع إليكِ... انطقي الآن' : 'انطقي الآن ليحلل الذكاء الاصطناعي صوتكِ 🎙️'}</span>
              </button>
            </div>
          </div>

          {/* AI Analysis Result Output */}
          {analysisResult && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
                  تقرير الذكاء الاصطناعي الصوتي الشامل 📊
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  analysisResult.isPassed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {analysisResult.isPassed ? 'تم الاجتياز بنجاح ✨' : 'يحتاج إعادة ضبط ↺'}
                </span>
              </div>

              {/* 3 AI Score Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">دقة مخارج الحروف</span>
                  <span className="text-2xl font-black text-indigo-300">%{analysisResult.accuracyScore}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">معدل الطلاقة اللغوية</span>
                  <span className="text-2xl font-black text-emerald-300">%{analysisResult.fluencyScore}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
                  <span className="text-xs text-slate-400 block mb-1">الإيقاع والنبرة الصوتية</span>
                  <span className="text-2xl font-black text-amber-300">%{analysisResult.intonationScore}</span>
                </div>
              </div>

              {/* AI Teacher's Personalized Arabic Guidance */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span>توجيه المعلمة الذكية لأم يزن:</span>
                  </span>
                  <button
                    onClick={() => handleListenAr(analysisResult.tutorArabicFeedback)}
                    className="text-xs text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>استمعي للتوجيه بالعربي</span>
                  </button>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {analysisResult.tutorArabicFeedback}
                </p>
                <div className="pt-2 border-t border-indigo-900/60 text-xs text-amber-300">
                  💡 {analysisResult.specificTip}
                </div>
              </div>

              {/* Audio Playback of User's Recording */}
              {audioUrl && (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-300 flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-emerald-400" />
                    <span>تسجيل صوتكِ المسجل:</span>
                  </span>
                  <button
                    onClick={() => {
                      const a = new Audio(audioUrl);
                      a.play();
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold transition"
                  >
                    استمعي لنطقكِ 🎧
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-right">
            <h3 className="text-lg font-bold text-white mb-2">إعدادات محرك الذكاء الاصطناعي</h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنكِ استخدام الذكاء الاصطناعي المدمج فائق السرعة، أو ربط مفتاح Gemini السحابي.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">مزود الذكاء الاصطناعي:</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                >
                  <option value="built-in">الذكاء الاصطناعي المدمج (تلقائي وسريع ومجاني)</option>
                  <option value="gemini">Google Gemini API (سحابي مباشر)</option>
                </select>
              </div>

              {aiProvider === 'gemini' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">مفتاح Gemini API Key:</label>
                  <input
                    type="password"
                    value={aiKey}
                    onChange={(e) => setAiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              )}

              {saveSuccess && (
                <p className="text-xs text-emerald-400 font-bold">تم حفظ الإعدادات بنجاح! ✨</p>
              )}

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

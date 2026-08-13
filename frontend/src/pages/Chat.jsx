import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Mic, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { sendChat } from "@/lib/api";

const Chat = () => {
  const { t } = useApp();
  const [messages, setMessages] = useState([{ role: "assistant", text: t.chat.greeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [recording, setRecording] = useState(false);
  const endRef = useRef(null);
  const recRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: content }]);
    setLoading(true);
    try {
      const data = await sendChat(content, sessionId);
      setSessionId(data.session_id);
      setMessages((m) => [...m, { role: "assistant", text: data.response }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: t.errors.ai, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (recording) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = "ar-SA";
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onend = () => setRecording(false);
    recRef.current = rec;
    setRecording(true);
    rec.start();
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-190px)] md:h-[calc(100vh-140px)]">
      <header className="flex items-center gap-3 mb-4">
        <span className="w-12 h-12 rounded-2xl bg-feat-purple flex items-center justify-center shrink-0"><Bot className="w-6 h-6 text-feat-purpleText" /></span>
        <div>
          <h1 className="text-xl font-extrabold text-ink">{t.chat.title}</h1>
          <p className="text-sm text-ink-muted">{t.chat.subtitle}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-2" data-testid="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-brand" : "bg-feat-purple"}`}>
              {m.role === "user" ? <User className="w-4.5 h-4.5 text-white" /> : <Bot className="w-4.5 h-4.5 text-feat-purpleText" />}
            </span>
            <div className={`max-w-[78%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
              m.role === "user" ? "bg-brand text-white rounded-tr-md" : m.error ? "bg-red-50 text-red-600 rounded-tl-md" : "bg-white text-ink shadow-subtle rounded-tl-md"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <span className="w-9 h-9 rounded-full bg-feat-purple flex items-center justify-center"><Bot className="w-4.5 h-4.5 text-feat-purpleText" /></span>
            <div className="bg-white shadow-subtle rounded-3xl rounded-tl-md px-5 py-4 flex gap-1.5">
              <span className="dot w-2 h-2 rounded-full bg-feat-purpleText" />
              <span className="dot w-2 h-2 rounded-full bg-feat-purpleText" />
              <span className="dot w-2 h-2 rounded-full bg-feat-purpleText" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-3">
          {t.chat.suggestions.map((s, i) => (
            <button key={i} data-testid={`suggestion-${i}`} onClick={() => send(s)}
              className="whitespace-nowrap bg-feat-purple text-feat-purpleText text-sm font-medium px-4 py-2.5 rounded-full hover:opacity-80 transition-opacity active:scale-95 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />{s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 bg-white rounded-full p-2 shadow-subtle mt-2">
        <button data-testid="voice-btn" onClick={toggleVoice} className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${recording ? "bg-red-500 text-white animate-pulse" : "bg-feat-purple text-feat-purpleText"}`}>
          <Mic className="w-5 h-5" />
        </button>
        <input
          data-testid="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t.chat.placeholder}
          className="flex-1 bg-transparent outline-none px-2 text-[15px] text-ink"
        />
        <button data-testid="chat-send-btn" onClick={() => send()} disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center shrink-0 hover:bg-brand-hover transition-colors active:scale-90 disabled:opacity-50">
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default Chat;

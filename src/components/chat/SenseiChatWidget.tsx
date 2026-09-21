"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Bot,
  Trash2,
  Code2,
  HelpCircle,
  Minimize2,
  BookOpen,
} from "lucide-react";
import gsap from "gsap";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Greetings, Adventurer! I am Sensei, your Python and Django coding master. Ask me any questions about Python syntax, Django views, models, URLs, or DRF APIs!",
  timestamp: "Just now",
};

const QUICK_PROMPTS = [
  "How do Django models and migrations work?",
  "Explain Django URLs and Views simply.",
  "What is the difference between a list and dict in Python?",
  "What is a DRF Serializer?",
];

/** Quick prompts that lean on the chapter the learner currently has open. */
const CHAPTER_QUICK_PROMPTS = [
  "Explain the current chapter topic more simply.",
  "Give me a small hint for this chapter's mission, not the full solution.",
  "Show a tiny example about the current topic before I try the mission.",
];

/** Reads the open chapter id from /play/<id>; null everywhere else. */
function useCurrentLevelId(): number | null {
  const pathname = usePathname();
  return useMemo(() => {
    const match = pathname?.match(/^\/play\/(\d+)/);
    if (!match) return null;
    const id = Number(match[1]);
    return Number.isInteger(id) && id >= 0 && id <= 100 ? id : null;
  }, [pathname]);
}

export function SenseiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextTopic, setContextTopic] = useState("");
  const levelId = useCurrentLevelId();
  const quickPrompts = levelId !== null ? CHAPTER_QUICK_PROMPTS : QUICK_PROMPTS;

  const windowRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // Monotonic id counter, so message keys never call impure Date.now() in render.
  const idCounterRef = useRef(1);
  const nextMessageId = () => `m${idCounterRef.current++}`;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // GSAP animation when opening
  useEffect(() => {
    if (isOpen && windowRef.current) {
      gsap.fromTo(
        windowRef.current,
        { scale: 0.88, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.8)" }
      );
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText ?? input).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: nextMessageId(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          // The chapter currently open, so Sensei answers in its context.
          levelId,
        }),
      });

      const data = await response.json();
      if (typeof data?.context?.topic === "string" && data.context.topic) {
        setContextTopic(data.context.topic);
      }

      const assistantMessage: ChatMessage = {
        id: nextMessageId(),
        role: "assistant",
        content: data.reply || "Sensei is pondering... Please ask again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Sensei chat error:", err);
      const errorMessage: ChatMessage = {
        id: nextMessageId(),
        role: "assistant",
        content:
          "Sensei could not connect right now. Please ensure your internet and Gemini connection are active.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Floating Yellow Chat Button on Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-12 sm:bottom-14 right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#191924] bg-[#f2b705] text-[#191924] shadow-[4px_4px_0_#191924] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#191924] active:translate-y-0.5 active:shadow-[2px_2px_0_#191924]"
          aria-label="Open Sensei Chat"
          title="Ask Sensei (Python & Django Master)"
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
            <MessageSquare className="h-6 w-6 text-[#191924]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d62839] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d62839]" />
            </span>
          </div>
        </button>
      )}

      {/* Sensei Comic Chat Popup Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-3 sm:p-6 pointer-events-none">
          <div
            ref={windowRef}
            className="comic-card pointer-events-auto flex h-[580px] max-h-[88vh] w-full max-w-[420px] flex-col overflow-hidden bg-white shadow-[8px_8px_0_#191924] dark:border-black dark:bg-[#191924]"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b-2 border-[#191924] bg-[#f2b705] p-3 text-[#191924] dark:border-black">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-[#191924] bg-[#191924] text-[#f2b705] shadow-[2px_2px_0_#191924]">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-comic text-xl leading-none">SENSEI</span>
                    <span className="rounded bg-[#191924] px-1.5 py-0.2 font-mono text-[9px] font-black text-[#f2b705]">
                      DOJO MASTER
                    </span>
                  </div>
                  <span className="text-[11px] font-bold opacity-80 block leading-tight">
                    Python & Django Mentor
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="rounded p-1 text-[#191924] hover:bg-black/10"
                  title="Clear conversation"
                  aria-label="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-[#191924] hover:bg-black/10 ml-1"
                  aria-label="Close Sensei chat"
                  title="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f5f3ec]/60 dark:bg-[#12121a]">
              {levelId !== null && (
                <div className="flex items-center gap-1.5 rounded border-2 border-[#191924]/30 bg-[#f2b705]/20 px-2 py-1 text-[10px] font-black text-[#191924] dark:border-white/15 dark:text-[#f2b705]">
                  <BookOpen className="h-3 w-3 shrink-0" />
                  <span>
                    Chapter {levelId}
                    {contextTopic ? ` — ${contextTopic}` : ""} attached. Sensei knows what you are learning.
                  </span>
                </div>
              )}
              {messages.map((m) => {
                const isSensei = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isSensei ? "items-start" : "items-end"}`}
                  >
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-black opacity-60">
                      <span>{isSensei ? "Sensei" : "You"}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[92%] rounded-lg p-3 text-xs sm:text-sm font-bold leading-relaxed border-2 border-[#191924] shadow-[3px_3px_0_#191924] ${
                        isSensei
                          ? "bg-white text-[#191924] dark:bg-[#262633] dark:text-white"
                          : "bg-[#191924] text-white dark:bg-[#2f6bff]"
                      }`}
                    >
                      <MarkdownRenderer content={m.content} isSensei={isSensei} />
                    </div>
                  </div>
                );
              })}

              {/* Sensei Thinking Spinner */}
              {loading && (
                <div className="flex flex-col items-start">
                  <div className="mb-1 text-[10px] font-black opacity-60">Sensei is writing...</div>
                  <div className="flex items-center gap-2 rounded-lg border-2 border-[#191924] bg-white p-3 text-xs font-bold dark:bg-[#262633]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#f2b705]" />
                    <span>Consulting the Django Scrolls...</span>
                  </div>
                </div>
              )}

              {/* Quick Prompt Suggestions */}
              {messages.length <= 1 && (
                <div className="mt-4 pt-2 border-t border-black/10 dark:border-white/10">
                  <div className="text-[11px] font-black opacity-60 mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#f2b705]" /> SUGGESTED TOPICS:
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left rounded-md border border-[#191924] bg-white p-2 text-xs font-bold text-[#191924] transition hover:bg-[#f2b705]/20 dark:border-black dark:bg-[#262633] dark:text-white hover:translate-x-1"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t-2 border-[#191924] bg-white p-2.5 dark:border-black dark:bg-[#191924]">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Sensei anything about Python & Django..."
                  rows={2}
                  className="min-h-[42px] max-h-[80px] w-full resize-none rounded-md border-2 border-[#191924] bg-[#f5f3ec] p-2 text-xs font-bold dark:border-black dark:bg-[#14141c] focus:outline-none focus:ring-2 focus:ring-[#f2b705]"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className="comic-btn shrink-0 bg-[#d62839] p-2.5 text-white disabled:opacity-50"
                  aria-label="Send message to Sensei"
                  title="Send message (Enter)"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] font-bold opacity-60 px-0.5">
                <span>Enter to send • Shift+Enter for new line</span>
                <span>Python & Django Questions Only</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

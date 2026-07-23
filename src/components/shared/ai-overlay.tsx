"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { useState, useRef, useEffect } from "react";

type Message = { id: string; role: "ai" | "user"; content: string };

/**
 * Global AI overlay — full-screen modal chat surface triggered by AIFab.
 * Now powered by real OpenAI responses via /api/ai/chat.
 */
export function AIOverlay() {
  const { aiOverlayOpen, setAiOverlayOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "ai",
      content:
        "Hello! I'm your Zedskillz AI Tutor. How can I help you today? I can summarize lessons, explain concepts in Bemba/Nyanja/Tonga, generate quizzes, or recommend next lessons.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loadingMessageIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Abort in-flight requests when the overlay closes
  useEffect(() => {
    if (!aiOverlayOpen) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      loadingMessageIdRef.current = null;
      setIsLoading(false);
    }
  }, [aiOverlayOpen]);

  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: msg };
    const loadingId = `loading-${Date.now()}`;
    loadingMessageIdRef.current = loadingId;
    const loadingMsg: Message = { id: loadingId, role: "ai", content: "" };

    // Abort any previous in-flight request
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        signal: abortController.signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // Replace the loading message with the real response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `a-${Date.now()}`,
                role: "ai",
                content: data.content || "Sorry, I couldn't process that.",
              }
            : m
        )
      );
    } catch (err: any) {
      // Ignore aborted requests
      if (err?.name === "AbortError") return;

      // Replace loading with error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                id: `a-${Date.now()}`,
                role: "ai",
                content:
                  "I'm having trouble connecting right now. Please check your internet and try again.",
              }
            : m
        )
      );
    } finally {
      loadingMessageIdRef.current = null;
      setIsLoading(false);
    }
  };

  if (!aiOverlayOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setAiOverlayOpen(false)}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg h-[560px] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-on-primary p-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center">
            <Icon name="psychology" filled size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-title text-sm font-semibold">ZedAI Assistant</div>
            <div className="text-xs opacity-80 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-yellow-300 animate-pulse" : "bg-green-300"}`} />
              {isLoading ? "Thinking..." : "Online • Ready to help in Bemba, Nyanja & English"}
            </div>
          </div>
          <button
            onClick={() => setAiOverlayOpen(false)}
            className="p-2 hover:bg-on-primary/10 rounded-full transition-colors"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <Icon name="smart_toy" filled size={18} className="text-on-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-on-primary rounded-tr-sm"
                    : "bg-surface-container-lowest border border-outline-variant rounded-tl-sm"
                }`}
              >
                {m.id === loadingMessageIdRef.current ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only when not loading and no user messages yet) */}
        {messages.length <= 1 && !isLoading && (
          <div className="px-3 py-2 border-t border-outline-variant flex flex-wrap gap-1.5 shrink-0">
            {["Explain concept", "Generate quiz", "Translate to Bemba", "Summarize lesson"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-outline-variant hover:bg-surface-container transition-colors"
                >
                  {s}
                </button>
              )
            )}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-outline-variant flex items-center gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 h-10 px-4 text-sm bg-surface-container-high rounded-full outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="send" filled size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

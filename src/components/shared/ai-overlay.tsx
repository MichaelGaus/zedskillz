"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { useState } from "react";

/**
 * Global AI overlay — full-screen modal chat surface triggered by AIFab.
 * Toggled by `aiOverlayOpen` in the global store.
 */
export function AIOverlay() {
  const { aiOverlayOpen, setAiOverlayOpen } = useAppStore();
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "ai" as const,
      content: "Hello! I'm your Zedskillz AI Tutor. How can I help you today? I can summarize lessons, explain concepts in Bemba/Nyanja/Tonga, generate quizzes, or recommend next lessons.",
    },
  ]);
  const [input, setInput] = useState("");

  if (!aiOverlayOpen) return null;

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages([
      ...messages,
      { id: `u-${Date.now()}`, role: "user" as const, content: msg },
      {
        id: `a-${Date.now()}`,
        role: "ai" as const,
        content: "Great question! Let me help with that. Based on your course content, here's what I'd suggest...",
      },
    ]);
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setAiOverlayOpen(false)}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-lg h-[560px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary text-on-primary p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center">
            <Icon name="psychology" filled size={22} />
          </div>
          <div className="flex-1">
            <div className="font-title text-sm font-semibold">ZedAI Assistant</div>
            <div className="text-xs opacity-80">Online • Ready to help in Bemba, Nyanja & English</div>
          </div>
          <button
            onClick={() => setAiOverlayOpen(false)}
            className="p-2 hover:bg-on-primary/10 rounded-full"
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
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Icon name="smart_toy" filled size={18} className="text-on-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-on-primary rounded-tr-sm"
                    : "bg-surface-container-lowest border border-outline-variant rounded-tl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="px-3 py-2 border-t border-outline-variant flex flex-wrap gap-1.5">
          {["Explain concept", "Generate quiz", "Translate to Bemba", "Summarize lesson"].map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-2.5 py-1 rounded-full border border-outline-variant hover:bg-surface-container transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-outline-variant flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Ask anything..."
            className="flex-1 h-10 px-4 text-sm bg-surface-container-high rounded-full outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={() => send()}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors"
          >
            <Icon name="send" filled size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

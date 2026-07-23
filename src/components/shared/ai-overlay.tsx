"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { useState, useRef, useEffect } from "react";

type Message = { id: string; role: "ai" | "user"; content: string };

const STORAGE_KEY = "zedskillz_ai_chat_history";

const GREETING: Message = {
  id: "m1",
  role: "ai",
  content:
    "Hello! I'm your Zedskillz AI Tutor. How can I help you today? I can summarize lessons, explain concepts in Bemba/Nyanja/Tonga, generate quizzes, or recommend next lessons.",
};

function loadSavedMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Message[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    if (!parsed.every((m) => m.id && m.role && typeof m.content === "string")) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch { /* quota exceeded */ }
}

function clearSavedMessages() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
}

/**
 * Combine multiple AbortSignals into one — any signal aborts the combined signal.
 */
function combineAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
  }
  return controller.signal;
}

/**
 * Parse an SSE stream line by line, calling onData for each parsed JSON payload.
 * Returns when [DONE] is received or the stream ends.
 */
async function readSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onData: (json: Record<string, unknown>) => void,
  signal: AbortSignal
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // Keep the last partial line in the buffer
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          onData(json);
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }
}

/**
 * Global AI overlay — full-screen modal chat surface triggered by AIFab.
 * Supports SSE streaming for real-time AI responses.
 */
export function AIOverlay() {
  const { aiOverlayOpen, setAiOverlayOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const streamingMessageIdRef = useRef<string | null>(null);
  const streamingContentRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved messages from localStorage on mount (client-side only)
  useEffect(() => {
    const saved = loadSavedMessages();
    if (saved.length > 0) {
      setMessages(saved);
      setShowSuggestions(false);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive or content streams in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist messages to localStorage whenever they change (skip loading/streaming placeholders)
  useEffect(() => {
    const realMessages = messages.filter(
      (m) => !m.id.startsWith("loading-") && !m.id.startsWith("stream-")
    );
    // Skip persisting the initial greeting if user hasn't sent anything yet
    if (realMessages.length === 1 && realMessages[0].id === GREETING.id) return;
    saveMessages(realMessages);
  }, [messages]);

  // Abort in-flight requests when the overlay closes
  useEffect(() => {
    if (!aiOverlayOpen) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      streamingMessageIdRef.current = null;
      streamingContentRef.current = "";
      setIsLoading(false);
    }
  }, [aiOverlayOpen]);

  const newConversation = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    streamingMessageIdRef.current = null;
    streamingContentRef.current = "";
    setMessages([GREETING]);
    setShowSuggestions(true);
    clearSavedMessages();
  };

  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    setShowSuggestions(false);

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: msg };
    const streamId = `stream-${Date.now()}`;
    streamingMessageIdRef.current = streamId;
    streamingContentRef.current = "";
    const streamMsg: Message = { id: streamId, role: "ai", content: "" };

    // Abort any previous in-flight request
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setMessages((prev) => [...prev, userMsg, streamMsg]);
    setInput("");
    setIsLoading(true);

    // Combine the abort controller signal with a 30-second timeout (generous for streaming)
    const timeoutSignal = AbortSignal.timeout(30000);
    const combinedSignal = combineAbortSignals(abortController.signal, timeoutSignal);

    try {
      const response = await fetch("/api/ai/chat", {
        signal: combinedSignal,
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

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      await readSSEStream(
        reader,
        (data) => {
          if (data.content && typeof data.content === "string") {
            streamingContentRef.current += data.content;
            const currentContent = streamingContentRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId
                  ? { ...m, content: currentContent }
                  : m
              )
            );
          }
        },
        abortController.signal
      );

      // Stream finished successfully — capture content BEFORE the finally block clears the ref
      const finalContent = streamingContentRef.current;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? {
                id: `a-${Date.now()}`,
                role: "ai",
                content: finalContent || "Sorry, I couldn't process that.",
              }
            : m
        )
      );
    } catch (err: any) {
      // Ignore aborted requests (overlay closed or superceded by new send)
      if (err?.name === "AbortError") return;

      const streamingSoFar = streamingContentRef.current;

      // If we already have some streamed content, keep it instead of showing an error
      if (streamingSoFar.trim().length > 0) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? {
                  id: `a-${Date.now()}`,
                  role: "ai",
                  content: streamingSoFar,
                }
              : m
          )
        );
      } else if (err?.name === "TimeoutError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? {
                  id: `a-${Date.now()}`,
                  role: "ai",
                  content: "The response is taking longer than expected. Please try again.",
                }
              : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? {
                  id: `a-${Date.now()}`,
                  role: "ai",
                  content:
                    "I'm having trouble connecting right now. Please check your internet and try again.",
                }
              : m
          )
        );
      }
    } finally {
      streamingMessageIdRef.current = null;
      streamingContentRef.current = "";
      setIsLoading(false);
    }
  };

  if (!aiOverlayOpen) return null;

  const userMessageCount = messages.filter((m) => m.role === "user").length;

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
              {isLoading ? "Thinking..." : `Online • ${userMessageCount} message${userMessageCount !== 1 ? "s" : ""}`}
            </div>
          </div>
          {/* New Chat button */}
          {userMessageCount > 0 && (
            <button
              onClick={newConversation}
              className="p-2 hover:bg-on-primary/10 rounded-full transition-colors"
              title="New conversation"
            >
              <Icon name="add" size={20} />
            </button>
          )}
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
                {m.id === streamingMessageIdRef.current ? (
                  m.content.trim() ? (
                    <span>
                      {m.content}
                      <span className="inline-flex items-center gap-0.5 ml-0.5">
                        <span className="w-1 h-1 bg-on-surface-variant rounded-full animate-pulse" />
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-on-surface-variant">Thinking</span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </span>
                  )
                ) : (
                  m.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only when not loading and no messages sent yet) */}
        {showSuggestions && !isLoading && messages.length <= 1 && (
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

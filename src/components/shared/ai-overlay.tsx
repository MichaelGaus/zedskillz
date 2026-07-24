"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────
type Message = { id: string; role: "ai" | "user"; content: string };
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

// ─── Constants ──────────────────────────────────────────────────────────
const STORAGE_KEY = "zedskillz_ai_conversations";
const ACTIVE_CONV_KEY = "zedskillz_ai_active_conv";
const SMOKE_FADE_DURATION_MS = 260; // matches CSS smoke-fade duration + buffer

const GREETING: Message = {
  id: "m1",
  role: "ai",
  content:
    "Hello! I'm your Zedskillz AI Tutor. How can I help you today? I can summarize lessons, explain concepts in Bemba/Nyanja/Tonga, generate quizzes, or recommend next lessons.",
};

// ─── Storage helpers ────────────────────────────────────────────────────
function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c: Conversation) =>
        c.id && c.title && Array.isArray(c.messages) && typeof c.createdAt === "number"
    );
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
  } catch { /* quota exceeded */ }
}

function loadActiveConvId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_CONV_KEY);
  } catch {
    return null;
  }
}

function saveActiveConvId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) localStorage.setItem(ACTIVE_CONV_KEY, id);
    else localStorage.removeItem(ACTIVE_CONV_KEY);
  } catch { /* noop */ }
}

/** Derive a short title from the first user message in a conversation. */
function deriveTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === "user");
  if (!firstUserMsg) return "New Chat";
  const text = firstUserMsg.content.trim();
  return text.length > 30 ? text.slice(0, 30) + "..." : text;
}

// ─── SSE helpers ────────────────────────────────────────────────────────
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
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload);
          onData(json);
        } catch { /* skip */ }
      }
    }
  }
}

// ─── Component ──────────────────────────────────────────────────────────
export function AIOverlay() {
  const { aiOverlayOpen, setAiOverlayOpen, activePage } = useAppStore();

  // ── Visibility & animation state ──────────────────────────────────
  // isVisible controls whether the panel DOM element is rendered.
  // animPhase tracks the animation phase: "open" | "closing" | "closed"
  // The store's aiOverlayOpen triggers transitions, but we keep the DOM
  // alive during the closing animation before removing it.
  const [isVisible, setIsVisible] = useState(false);
  const [animPhase, setAnimPhase] = useState<"closed" | "open" | "closing">("closed");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Conversation state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showConvList, setShowConvList] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Streaming refs
  const streamingMessageIdRef = useRef<string | null>(null);
  const streamingContentRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Responsive detection ────────────────────────────────────────────
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsSmallScreen(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auth pages don't have bottom nav
  const hasBottomNav = activePage !== "auth" && activePage !== "signup";

  // ── Animate open/close based on store state ────────────────────────
  useEffect(() => {
    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (aiOverlayOpen && animPhase === "closed") {
      // OPEN: render panel and animate in (smoke-rise)
      setIsVisible(true);
      setAnimPhase("open");
    } else if (!aiOverlayOpen && animPhase === "open") {
      // CLOSE: start closing animation (smoke-fade)
      setAnimPhase("closing");
      // Abort ongoing stream immediately
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      streamingMessageIdRef.current = null;
      streamingContentRef.current = "";
      setIsLoading(false);
      // After animation finishes, remove the DOM element
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setAnimPhase("closed");
        setShowConvList(false);
        closeTimerRef.current = null;
      }, SMOKE_FADE_DURATION_MS);
    }
    // If aiOverlayOpen is true and animPhase is "closing" (race condition),
    // cancel the close and reopen
    else if (aiOverlayOpen && animPhase === "closing") {
      setAnimPhase("open");
    }
  }, [aiOverlayOpen]); // intentionally not including animPhase to avoid loops

  // ── Load conversations from localStorage on mount ──────────────────
  useEffect(() => {
    const saved = loadConversations();
    const savedActiveId = loadActiveConvId();
    if (saved.length > 0) {
      setConversations(saved);
      const targetId = savedActiveId && saved.find((c) => c.id === savedActiveId)
        ? savedActiveId
        : saved[saved.length - 1].id;
      setActiveConvId(targetId);
      setShowSuggestions(false);
    }
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────
  const activeMessages = conversations.find((c) => c.id === activeConvId)?.messages || [];
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // ── Persist conversations ──────────────────────────────────────────
  useEffect(() => {
    if (conversations.length > 0) {
      const cleaned = conversations.map((c) => ({
        ...c,
        messages: c.messages.filter(
          (m) => !m.id.startsWith("loading-") && !m.id.startsWith("stream-")
        ),
        title: deriveTitle(c.messages),
      }));
      saveConversations(cleaned);
      saveActiveConvId(activeConvId);
    }
  }, [conversations, activeConvId]);

  // ── Helpers ─────────────────────────────────────────────────────────
  const updateConvMessages = (convId: string, msgs: Message[]) => {
    setConversations((prev) =>
      prev.map((c) => c.id === convId ? { ...c, messages: msgs, title: deriveTitle(msgs) } : c)
    );
  };

  const newConversation = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    streamingMessageIdRef.current = null;
    streamingContentRef.current = "";
    setIsLoading(false);

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "New Chat",
      messages: [{ ...GREETING, id: `m1-${newId}` }],
      createdAt: Date.now(),
    };
    setConversations((prev) => [...prev, newConv]);
    setActiveConvId(newId);
    setShowSuggestions(true);
    setShowConvList(false);
    setInput("");
  };

  const switchConversation = (convId: string) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    streamingMessageIdRef.current = null;
    streamingContentRef.current = "";
    setIsLoading(false);
    setActiveConvId(convId);
    setShowConvList(false);
    setShowSuggestions(false);
    setInput("");
  };

  const deleteConversation = (convId: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== convId);
      if (convId === activeConvId) {
        if (remaining.length > 0) {
          setActiveConvId(remaining[remaining.length - 1].id);
          setShowSuggestions(false);
        } else {
          const newId = `conv-${Date.now()}`;
          const newConv: Conversation = {
            id: newId,
            title: "New Chat",
            messages: [{ ...GREETING, id: `m1-${newId}` }],
            createdAt: Date.now(),
          };
          remaining.push(newConv);
          setActiveConvId(newId);
          setShowSuggestions(true);
        }
      }
      return remaining;
    });
  };

  const userMessageCount = activeMessages.filter((m) => m.role === "user").length;
  const hasMultipleConvs = conversations.length > 1;

  // ── Send message ───────────────────────────────────────────────────
  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading || !activeConvId) return;
    setShowSuggestions(false);

    const currentConvId = activeConvId;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: msg };
    const streamId = `stream-${Date.now()}`;
    streamingMessageIdRef.current = streamId;
    streamingContentRef.current = "";
    const streamMsg: Message = { id: streamId, role: "ai", content: "" };

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const currentConv = conversations.find((c) => c.id === currentConvId);
    const currentMsgs = currentConv?.messages || [];
    const updatedMsgs = [...currentMsgs, userMsg, streamMsg];
    updateConvMessages(currentConvId, updatedMsgs);
    setInput("");
    setIsLoading(true);

    const timeoutSignal = AbortSignal.timeout(30000);
    const combinedSignal = combineAbortSignals(abortController.signal, timeoutSignal);

    try {
      const response = await fetch("/api/ai/chat", {
        signal: combinedSignal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentMsgs, userMsg].map((m) => ({
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
            setConversations((prev) =>
              prev.map((c) =>
                c.id === currentConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === streamId ? { ...m, content: currentContent } : m
                      ),
                    }
                  : c
              )
            );
          }
        },
        abortController.signal
      );

      const finalContent = streamingContentRef.current;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConvId
            ? {
                ...c,
                title: deriveTitle(c.messages),
                messages: c.messages.map((m) =>
                  m.id === streamId
                    ? {
                        id: `a-${Date.now()}`,
                        role: "ai",
                        content: finalContent || "Sorry, I couldn't process that.",
                      }
                    : m
                ),
              }
            : c
        )
      );
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      const streamingSoFar = streamingContentRef.current;

      if (streamingSoFar.trim().length > 0) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === streamId
                      ? { id: `a-${Date.now()}`, role: "ai", content: streamingSoFar }
                      : m
                  ),
                }
              : c
          )
        );
      } else {
        const errorMsg =
          err?.name === "TimeoutError"
            ? "The response is taking longer than expected. Please try again."
            : "I'm having trouble connecting right now. Please check your internet and try again.";
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === streamId
                      ? { id: `a-${Date.now()}`, role: "ai", content: errorMsg }
                      : m
                  ),
                }
              : c
          )
        );
      }
    } finally {
      streamingMessageIdRef.current = null;
      streamingContentRef.current = "";
      setIsLoading(false);
    }
  };

  // ── Don't render if panel is not visible ─────────────────────────────
  if (!isVisible) return null;

  // ── Render ──────────────────────────────────────────────────────────
  // Non-modal panel: positioned on the right side, anchored near the FAB.
  // Uses smoke-rise animation on open, smoke-fade on close.
  // No backdrop overlay — user can interact with the page simultaneously.
  return (
    <div
      className={cn(
        "fixed z-[60] flex flex-col overflow-hidden shadow-2xl ai-glow-lg",
        // Animation class based on phase
        animPhase === "closing" ? "animate-smoke-fade" : "animate-smoke-rise",
        // Positioning: right side, bottom near the FAB button
        // Desktop (≥1024px): wider panel, positioned with FAB at bottom-6 right-6
        // Mobile (<1024px): nearly full-width, positioned with FAB at bottom-20 right-4
        isSmallScreen
          ? cn(
              "right-3 w-[calc(100vw-24px)]",
              hasBottomNav ? "bottom-20" : "bottom-4"
            )
          : cn(
              "right-6 w-[380px]",
              hasBottomNav ? "bottom-6" : "bottom-4"
            ),
        // Height: fill upward from the FAB position, capped to leave room at top
        isSmallScreen
          ? cn(hasBottomNav ? "max-h-[calc(100vh-140px)]" : "max-h-[calc(100vh-60px)]")
          : cn(hasBottomNav ? "max-h-[calc(100vh-80px)]" : "max-h-[calc(100vh-60px)]"),
        // Visual: glassmorphism background with rounded corners
        "rounded-t-2xl lg:rounded-2xl",
        "glass-panel border border-outline-variant/50",
      )}
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="bg-primary text-on-primary p-3 flex items-center gap-2 shrink-0 rounded-t-2xl lg:rounded-t-2xl">
        {/* Conversation list toggle */}
        {hasMultipleConvs && (
          <button
            onClick={() => setShowConvList(!showConvList)}
            className="p-2 hover:bg-on-primary/10 rounded-full transition-colors"
            title="Chat history"
          >
            <Icon name={showConvList ? "chat" : "history"} size={20} />
          </button>
        )}

        <div className="w-9 h-9 rounded-full bg-on-primary/20 flex items-center justify-center shrink-0">
          <Icon name="psychology" filled size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-title text-sm font-semibold">
            {showConvList ? "Chat History" : "ZedAI Assistant"}
          </div>
          {!showConvList && (
            <div className="text-xs opacity-80 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-yellow-300 animate-pulse" : "bg-green-300"}`} />
              {isLoading ? "Thinking..." : `Online \u2022 ${userMessageCount} msg${userMessageCount !== 1 ? "s" : ""}`}
            </div>
          )}
        </div>

        {/* New Chat button */}
        <button
          onClick={newConversation}
          className="p-2 hover:bg-on-primary/10 rounded-full transition-colors"
          title="New conversation"
        >
          <Icon name="add" size={20} />
        </button>
        <button
          onClick={() => setAiOverlayOpen(false)}
          className="p-2 hover:bg-on-primary/10 rounded-full transition-colors"
          title="Close"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* ─── Conversation List Panel ───────────────────────────── */}
      {showConvList ? (
        <div className="flex-1 overflow-y-auto bg-surface">
          <div className="p-3 space-y-2">
            {conversations
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((conv) => {
                const msgCount = conv.messages.filter((m) => m.role === "user").length;
                const isActive = conv.id === activeConvId;
                const preview = conv.messages.find((m) => m.role === "user")?.content || "New Chat";
                const previewShort = preview.length > 40 ? preview.slice(0, 40) + "..." : preview;
                const timeStr = new Date(conv.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={conv.id}
                    className={`flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                      isActive
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-surface-container hover:bg-surface-container-high"
                    }`}
                    onClick={() => switchConversation(conv.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isActive ? "bg-primary" : "bg-surface-container-high"
                    }`}>
                      <Icon name="chat" filled size={16} className={isActive ? "text-on-primary" : "text-on-surface-variant"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-body-sm font-semibold truncate ${isActive ? "text-primary" : "text-on-surface"}`}>
                        {conv.title || previewShort}
                      </div>
                      <div className="text-xs text-on-surface-variant flex items-center gap-2">
                        <span>{timeStr}</span>
                        <span>{msgCount} msg{msgCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                      className="p-1.5 hover:bg-error/10 rounded-full transition-colors shrink-0 text-on-surface-variant hover:text-error"
                      title="Delete conversation"
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <>
          {/* ─── Messages ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
            {activeMessages.map((m) => (
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

          {/* ─── Suggestions ───────────────────────────────────── */}
          {showSuggestions && !isLoading && activeMessages.length <= 1 && (
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

          {/* ─── Input ─────────────────────────────────────────── */}
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
        </>
      )}
    </div>
  );
}

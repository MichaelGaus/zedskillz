"use client";

// AUTO-GENERATED from Zedskillz_landing_page_ui.txt — DO NOT EDIT MANUALLY
// Conversion: HTML body → JSX (class=→className=, void tags self-closed, style attrs converted)
// Modified: AI chat mockup card is now fully functional with SSE streaming

import { useAppStore } from "@/lib/store";
import { useState, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────
type Message = { id: string; role: "ai" | "user"; content: string };

// ─── SSE helper (same as ai-overlay.tsx) ─────────────────────────────
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
        try { const json = JSON.parse(payload); onData(json); } catch { /* skip */ }
      }
    }
  }
}

const GREETING: Message = {
  id: "m1",
  role: "ai",
  content: "Muli bwanji! I'm your ZedSkillz AI Tutor — ready to help in Bemba, Nyanja & English. Ask me anything about math, science, coding, or any subject!",
};

export function LandingBody() {
  const { setActivePage, setAiOverlayOpen } = useAppStore();

  // ── AI chat state ───────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef("");

  // Auto-scroll to bottom on new messages or streaming content.
  // Uses scrollTop on the container ref directly instead of scrollIntoView,
  // because scrollIntoView({ behavior: "smooth" }) called on every token
  // during streaming causes the entire page to scroll down.
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  // ── Send message with SSE streaming ─────────────────────────────────
  const send = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: msg.trim() }; 
    const streamId = `stream-${Date.now()}`;
    const streamMsg: Message = { id: streamId, role: "ai", content: "" }; 

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;
    streamingContentRef.current = "";

    setMessages((prev) => [...prev, userMsg, streamMsg]);
    setStreamingId(streamId);
    setStreamingContent("");
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    const timeoutSignal = AbortSignal.timeout(120000);

    try {
      const response = await fetch("/api/ai/chat", {
        signal: AbortSignal.any([abortController.signal, timeoutSignal]),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      await readSSEStream(
        reader,
        (data) => {
          if (data.content && typeof data.content === "string") {
            streamingContentRef.current += data.content as string;
            const current = streamingContentRef.current;
            setStreamingContent(current);
            setMessages((prev) =>
              prev.map((m) => m.id === streamId ? { ...m, content: current } : m)
            );
            scrollToBottom();
          }
        },
        abortController.signal
      );

      // Finalize streaming message
      const finalContent = streamingContentRef.current;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId
            ? { id: `a-${Date.now()}`, role: "ai", content: finalContent || "Sorry, I couldn't process that." }
            : m
        )
      );
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      const partial = streamingContentRef.current;
      if (partial.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { id: `a-${Date.now()}`, role: "ai", content: partial } : m
          )
        );
      } else {
        const errorMsg = err?.name === "TimeoutError"
          ? "The response is taking longer than expected. Please try again."
          : "I'm having trouble connecting right now. Please check your internet and try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { id: `a-${Date.now()}`, role: "ai", content: errorMsg } : m
          )
        );
      }
    } finally {
      setStreamingId(null);
      setStreamingContent("");
      streamingContentRef.current = "";
      setIsLoading(false);
    }
  };

  return (
    <>
      
      
      <header className="w-full sticky top-0 z-50 bg-surface/80 backdrop-blur-md shadow-sm">
      <nav className="flex justify-between items-center px-container-margin md:px-xl h-touch-target lg:h-20 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-md">
      <span className="material-symbols-outlined text-primary">menu</span>
      <img src="/logo.png" alt="Zedskillz Hub" className="w-auto object-contain h-10" />
      </div>
      
      <div className="hidden md:flex items-center gap-xl">
      <a className="text-primary font-bold font-body-md" href="#">Home</a>
      <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Explore</a>
      <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Ranks</a>
      <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Community</a></div>
      <div className="flex items-center gap-md"><button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
          <span className="material-symbols-outlined">language</span>
      </button>
      <button className="hidden lg:flex items-center gap-xs px-md py-sm bg-secondary-container text-on-secondary-container rounded-full font-semibold active:scale-95 transition-all">
      <span className="material-symbols-outlined">school</span>
                          My Courses
                      </button>
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant">
      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBju0QN8XCOpAUBctPrD4Gn2bn1NuDS1pMBAoybg5LIqziXMibKpPgjKnb8LZ2h-TGbBOvKK_RnZysNgG6PebUtHtGVaSixDWtkW5Bv7Gwc3QLgI-aiwl0Qp8YV_w7i85zECK7VvgKyOyacL_HEZv9zOer1my8JIEv0DywJKJbFFbEuiQWCPT75INZv3QgwXOWDUVlmlZ8qplMTImUkCeJtPKUQsOC-YWBjJUqcZSubJB7h-7A_rFzaDw"  alt="" />
      </div>
      </div>
      </nav>
      </header>
      <main>
      
      <section className="relative overflow-hidden pt-xl pb-32">
      {/* Decorative blurred circles */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-container-margin md:px-xl relative z-10 flex flex-col lg:flex-row items-center gap-xl">

      {/* Left: Hero content */}
      <div className="flex-1 space-y-lg w-full max-w-2xl">
      <div className="inline-flex items-center gap-sm px-md py-xs bg-tertiary-fixed text-on-tertiary-fixed rounded-full">
      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
      <span className="font-label-caps text-label-caps">AI-POWERED EDUCATION IN ZAMBIA</span>
      </div>
      <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary max-w-2xl leading-tight">
                              Master New Skills with Your Personal AI Tutor
      </h2>
      <p className="text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                              Access world-class education tailored to local Zambian contexts. Learn in your preferred language, track your progress on national leaderboards, and get instant help from our AI mentor.
                          </p>
      <div className="flex flex-col sm:flex-row gap-md pt-md">
      <button className="px-xl py-md bg-primary text-on-primary rounded-xl font-bold text-title-sm hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-sm">
                                  Explore Courses
                                  <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      <button onClick={() => setAiOverlayOpen(true)} className="px-xl py-md bg-white border-2 border-primary text-primary rounded-xl font-bold text-title-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-sm"><span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
                                  Try AI Tutor</button>
      </div>
      <div className="flex items-center gap-md pt-md">
      <div className="flex -space-x-3">
      <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant"></div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant"></div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant"></div>
      </div>
      <p className="text-body-sm font-semibold text-on-surface-variant">Joined by 5,000+ Zambian students this month</p>
      </div>
      </div>

      {/* Right: Functional AI Tutor chat card */}
      <div className="flex-1 relative w-full max-w-2xl">
      <div className="glass-surface p-lg rounded-3xl ai-glow shadow-2xl relative overflow-hidden border-outline-variant/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-md">
      <div className="flex items-center gap-md">
      <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
      </div>
      <div>
      <p className="font-bold text-primary">ZedSkillz AI Assistant</p>
      <p className="text-xs text-on-surface-variant flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
        {isLoading ? "Thinking..." : "Online • Ready to help in Bemba, Nyanja & English"}
      </p>
      </div>
      </div>
      </div>            {/* Chat messages — scrollable area */}
            <div ref={chatContainerRef} className="space-y-md max-h-[320px] overflow-y-auto pr-sm" style={{ scrollbarWidth: "thin" }}>
      {messages.map((m) => (
        <div key={m.id} className={`flex gap-md ${m.role === "user" ? "flex-row-reverse" : ""}`}>
          {m.role === "ai" && (
            <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
            </div>
          )}
          {m.role === "user" && (
            <div className="w-8 h-8 rounded-full bg-primary-container shrink-0"></div>
          )}
          <div className={`p-md rounded-2xl max-w-[80%] whitespace-pre-wrap ${
            m.role === "user"
              ? "bg-primary text-white rounded-tr-none"
              : m.id === streamingId
                ? "bg-surface-container-low rounded-tl-none border-l-4 border-primary ai-glow"
                : "bg-surface-container-low rounded-tl-none border border-outline-variant/20"
          }`}>
            {m.id === streamingId ? (
              m.content.trim() ? (
                <>
                  {m.content}
                  <span className="inline-flex items-center gap-0.5 ml-0.5">
                    <span className="w-1 h-1 bg-on-surface-variant rounded-full animate-pulse" />
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="text-body-sm italic text-primary font-semibold">AI is thinking...</span>
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </span>
              )
            ) : (
              <p className="text-body-sm">{m.content}</p>
            )}
          </div>
        </div>
      ))}      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && !isLoading && (
        <div className="mt-sm flex flex-wrap gap-xs">
          {["Explain a concept", "Generate a quiz", "Translate to Bemba", "Summarize a lesson"].map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs px-sm py-xs rounded-full border border-outline-variant hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="mt-md flex gap-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type your question..."
          disabled={isLoading}
          className="flex-1 bg-surface rounded-full border border-outline-variant px-md py-sm text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
        <button
          onClick={() => send()}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
      </div>

      {/* Decorative blurred circles around card */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      </div>
      </section>
      
      <section className="bg-surface-container-low py-24 px-container-margin md:px-xl">
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-xl items-center">
      <div className="space-y-lg">
      <p className="font-label-caps text-label-caps text-tertiary">Member Access</p>
      <h3 className="font-display-lg text-display-lg text-primary max-w-2xl">Ready to continue learning?</h3>
      <p className="text-body-md text-on-surface-variant max-w-xl">Sign in to pick up where you left off, or create a free account to unlock ZedSkillz AI tutoring, course progress tracking, and leaderboards.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
      <button onClick={() => { useAppStore.getState().setIntendedPage(null); useAppStore.getState().setIntendedAiOverlay(false); setActivePage("auth"); }} className="w-full px-xl py-md bg-primary text-white rounded-2xl font-semibold hover:bg-primary-container transition-all">Sign In</button>
      <button onClick={() => { useAppStore.getState().setIntendedPage(null); useAppStore.getState().setIntendedAiOverlay(false); setActivePage("signup"); }} className="w-full px-xl py-md border border-outline-variant bg-surface text-on-surface rounded-2xl font-semibold hover:bg-surface-container transition-all">Sign Up</button>
      </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
      <div className="bg-white rounded-3xl p-lg shadow-sm border border-outline-variant/30">
      <h4 className="text-headline-sm font-headline-sm text-primary mb-3">Back to your dashboard</h4>
      <p className="text-body-sm text-on-surface-variant">Access your enrolled courses, AI notes, and progress reports instantly when you sign in.</p>
      </div>
      <div className="bg-white rounded-3xl p-lg shadow-sm border border-outline-variant/30">
      <h4 className="text-headline-sm font-headline-sm text-primary mb-3">New to Zedskillz?</h4>
      <p className="text-body-sm text-on-surface-variant">Create your account in minutes and start learning with local curriculum support, mentorship, and community features.</p>
      </div>
      </div>
      </div>
      </div>
      </section>
      <section className="bg-surface-container-low py-32 px-container-margin md:px-xl">
      <div className="max-w-[1600px] mx-auto">
      <div className="text-center mb-20 space-y-md">
      <h3 className="font-display-lg text-display-lg text-primary">Why Zambia chooses Zedskillz</h3>
      <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">Bridging the education gap with technology designed specifically for the Zambian classroom.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg h-auto md:h-[600px]">
      
      <div className="md:col-span-8 bg-white rounded-3xl p-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-all overflow-hidden relative">
      <div className="z-10">
      <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center text-primary mb-lg">
      <span className="material-symbols-outlined text-3xl">translate</span>
      </div>
      <h4 className="text-headline-md font-headline-md text-primary mb-md">Localized Intelligence</h4>
      <p className="text-body-md text-on-surface-variant max-w-md">Our AI understands Zambian context, curriculum, and can translate complex concepts into local languages including Bemba, Nyanja, and Tonga for better comprehension.</p>
      </div>
      <div className="absolute bottom-[-10%] right-[-5%] w-1/2 h-2/3 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className="material-symbols-outlined text-[200px]">language</span>
      </div>
      </div>
      
      <div className="md:col-span-4 bg-primary text-white rounded-3xl p-xl shadow-lg flex flex-col justify-center items-center text-center group hover:scale-[1.02] transition-transform">
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-xl">
      <span className="material-symbols-outlined text-4xl">track_changes</span>
      </div>
      <h4 className="text-headline-md font-headline-md mb-md">Personalized AI Paths</h4>
      <p className="text-body-sm opacity-80">Every student learns differently. Our AI maps your strengths and weaknesses to create a custom study plan that evolves with you.</p>
      <button className="mt-xl px-lg py-sm bg-white text-primary rounded-full font-bold text-label-caps">START JOURNEY</button>
      </div>
      
      <div className="md:col-span-4 bg-white rounded-3xl p-xl shadow-sm border border-outline-variant/30 flex flex-col group hover:shadow-md transition-all">
      <div className="w-14 h-14 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-on-tertiary-fixed mb-lg">
      <span className="material-symbols-outlined text-3xl">military_tech</span>
      </div>
      <h4 className="text-headline-md font-headline-md text-primary mb-md">Gamified Learning</h4>
      <p className="text-body-md text-on-surface-variant">Earn XP, climb the provincial leaderboards, and win real-world rewards while mastering your subjects.</p>
      </div>
      
      <div className="md:col-span-8 bg-surface-container-highest rounded-3xl p-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center gap-xl group">
      <div className="flex-1">
      <h4 className="text-headline-md font-headline-md text-primary mb-md">Peer Support Hub</h4>
      <p className="text-body-md text-on-surface-variant">Connect with thousands of students across Lusaka, Copperbelt, and beyond. Share notes, join study groups, and grow together.</p>
      </div>
      <div className="flex-1 w-full h-48 rounded-2xl overflow-hidden shadow-inner relative">
      <div className="bg-cover bg-center w-full h-full" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkyWbUuB_kB57jpLhYEGfKL5L3zXi1wH5EWt9uuTu6D09Q6O3MQ_DWNePzg4AHXGEB93ZiEUTo-C4fEP0IOMrdUoJGWExGcTrkE9y3rFEBbaP5eROsBmcMpGWYjkqRCD-ToWgIwq7uq_13JPlDv9WS4GsDiJlx4CiqUq9BuGakrL29oWp8aYdyS9jCaj5inSRjBFYGRLOZQ1GrHVxr3WuPXrFqKPE_8QX2aWlAWeKlfSftCb6YMnJOOA')"}}></div>
      </div>
      </div>
      </div>
      </div>
      </section><section className="py-32 px-container-margin md:px-xl max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-16">
      <div className="space-y-sm">
      <h3 className="font-display-lg text-display-lg text-primary">Featured Courses</h3>
      <p className="text-body-md text-on-surface-variant">Curated for the current Zambian Ministry of Education syllabus.</p>
      </div>
      <button className="text-primary font-bold flex items-center gap-sm group">
                          View all 200+ courses
                          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-lg">
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all group">
      <div className="h-48 overflow-hidden relative">
      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0aN_cVOKnLo-Dp6KNvcboOBh0tqSIWxUOtZA0bwOBz0bKD7OEuB5SEYDhYJKoBAJaJxcP7jb7OIL5wH9-5vdf0YDeVpj6UoHNbIWCLnOK24bdW8HifQX4sGpy2eXAHCwqDRo1GDEDHd5HMnZZ2BcW5TVhwcBN5xLEO_PA0lnSYpJLlqD4zve5avmm9CHvIZ8oviuGXJ2XHbYVMSbYKhaTKt9GU0CDxQ04ZFjAAPifG1N9-3ToyCKveQ"  alt="" />
      <div className="absolute top-4 left-4 px-md py-xs bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">Mathematics</div>
      </div>
      <div className="p-md space-y-md">
      <h5 className="text-title-sm text-primary">Grade 12: Advanced Calculus</h5>
      <div className="flex items-center gap-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-sm">schedule</span>
      <span className="text-xs">12 Modules • 24 Hours</span>
      </div>
      <div className="space-y-xs">
      <div className="flex justify-between text-xs font-semibold">
      <span className="">Progress</span>
      <span className="text-primary">65%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
      <div className="h-full bg-primary w-[65%]"></div>
      </div>
      </div>
      <button className="w-full py-sm bg-secondary-container text-on-secondary-container rounded-xl font-bold active:scale-95 transition-all">Continue Learning</button>
      </div>
      </div>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all group">
      <div className="h-48 overflow-hidden relative">
      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsB3r30QSS7RTM7Vk0bK4KSZ0xpn2rZBSuRupPpGYTsVgj8wQKZsGgX0Hbg0JcCBYuNsEpddRC6TTXnCLoCbKRMX9G_q8hDq6ZUjE8GhnE5rPGIORBuVu08CeJ3xbTOVzttVPAhSKhO-Glx26jLGaa9cVJAVAxxEp4JYP4nGw531ISuOnJ4uNAeMek9q2HVH8BJYwuENcGhEf4PkG8aUe5ENZamNfkYJEvY0D-nTWzXoHUp-bpCatC1A"  alt="" />
      <div className="absolute top-4 left-4 px-md py-xs bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">Technology</div>
      </div>
      <div className="p-md space-y-md">
      <h5 className="text-title-sm text-primary">Python for Beginners</h5>
      <div className="flex items-center gap-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-sm">schedule</span>
      <span className="text-xs">15 Modules • 30 Hours</span>
      </div>
      <div className="space-y-xs">
      <div className="flex justify-between text-xs font-semibold">
      <span className="">Progress</span>
      <span className="text-primary">20%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
      <div className="h-full bg-primary w-[20%]"></div>
      </div>
      </div>
      <button className="w-full py-sm bg-secondary-container text-on-secondary-container rounded-xl font-bold active:scale-95 transition-all">Continue Learning</button>
      </div>
      </div>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all group">
      <div className="h-48 overflow-hidden relative">
      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBcCJDSzvz9ja6s7rkWYkotYWZtD1J74E7uyEp_ToW8QW16N4jY5L7lhKbQrd5WiuS5tctCGaM7ofq66Mt7FN0CkcGqw5nTPksDheGKYuE2-l-F0wBDTuLDOFg3g2DI0BIKfxM97lCw3KNW-rITHy9rWf1Ee_p2_ox65PDFIrGK2WDRvTa1fjBnUejWtfYmD8ZpFxuRhElG-LvGb26cLprRxenSiiM6Vs5ucoEUYXsD4_oelBBw4jXzA"  alt="" />
      <div className="absolute top-4 left-4 px-md py-xs bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">Vocational</div>
      </div>
      <div className="p-md space-y-md">
      <h5 className="text-title-sm text-primary">Sustainable Agribusiness</h5>
      <div className="flex items-center gap-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-sm">schedule</span>
      <span className="text-xs">8 Modules • 18 Hours</span>
      </div>
      <div className="space-y-xs">
      <div className="flex justify-between text-xs font-semibold">
      <span className="">Progress</span>
      <span className="text-primary">0%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
      <div className="h-full bg-primary w-[0%]"></div>
      </div>
      </div>
      <button className="w-full py-sm bg-primary text-white rounded-xl font-bold active:scale-95 transition-all">Start Course</button>
      </div>
      </div>
      
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all group">
      <div className="h-48 overflow-hidden relative">
      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5F5azioJbMPiMHk_wvYckcXG0FQDzndq5Llav3_VysD1DpL871LSFIFirNa9Oe9kPxVJwNR_zKmAT6ACo0EGfVeL6RKzDUGolUkST-A-1v4QpzpEO9Q0YZb-n5mDX2-c6U96o3R91vmZRKnvmHMnj9I00onAulFaedD_NsgKkm9AYTp5rtnobf88EwuiVaD6nEnpOUvM6Jw1rBUxXsdjQIlb32I_eFi7YE6SyWoBMq3GT1RrAwOTQBw"  alt="" />
      <div className="absolute top-4 left-4 px-md py-xs bg-primary/90 text-white text-xs font-bold rounded-full backdrop-blur-md">Health</div>
      </div>
      <div className="p-md space-y-md">
      <h5 className="text-title-sm text-primary">Community Health Worker</h5>
      <div className="flex items-center gap-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-sm">schedule</span>
      <span className="text-xs">20 Modules • 45 Hours</span>
      </div>
      <div className="space-y-xs">
      <div className="flex justify-between text-xs font-semibold">
      <span className="">Progress</span>
      <span className="text-primary">10%</span>
      </div>
      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
      <div className="h-full bg-primary w-[10%]"></div>
      </div>
      </div>
      <button className="w-full py-sm bg-secondary-container text-on-secondary-container rounded-xl font-bold active:scale-95 transition-all">Continue Learning</button>
      </div>
      </div>
      </div>
      </section>
      
      <section className="max-w-[1600px] mx-auto px-container-margin md:px-xl pb-32">
      <div className="bg-primary-container rounded-[40px] p-xl md:p-32 text-center space-y-lg relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      <div className="relative z-10">
      <h3 className="text-display-lg text-white font-display-lg max-w-2xl mx-auto">Ready to accelerate your career with AI?</h3>
      <p className="text-on-primary-container text-body-md max-w-2xl mx-auto opacity-90">Join thousands of students and professionals in the largest AI-driven educational community in Zambia.</p>
      <div className="pt-xl flex flex-col sm:flex-row justify-center gap-md">
      <button className="px-xl py-lg bg-white text-primary rounded-2xl font-bold text-title-sm shadow-xl active:scale-95 transition-all">Get Started for Free</button>
      <button className="px-xl py-lg bg-primary text-white border-2 border-white/20 rounded-2xl font-bold text-title-sm hover:bg-primary-fixed-dim hover:text-primary active:scale-95 transition-all">Talk to an Advisor</button>
      </div>
      <p className="text-white/60 text-xs mt-xl">No credit card required. Free tier includes 5 AI tutoring hours monthly.</p>
      </div>
      </div>
      </section>
      </main>
      

      

    </>
  );
}

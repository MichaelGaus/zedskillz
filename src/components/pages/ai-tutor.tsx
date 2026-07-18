"use client";

import { useState } from "react";
import { aiTutorConversation, aiTutorSuggestions } from "@/lib/mock-data";
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Languages,
  Mic,
  Volume2,
  Plus,
  MessageSquare,
  Lightbulb,
  Target,
  GraduationCap,
  Zap,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

const capabilities: { icon: LucideIcon; title: string; desc: string; color: string }[] = [
  { icon: BookOpen, title: "Explain Concepts", desc: "Get clear, contextual explanations", color: "text-emerald-500 bg-emerald-500/10" },
  { icon: FileText, title: "Summarize Lessons", desc: "Quick recaps of long content", color: "text-amber-500 bg-amber-500/10" },
  { icon: Target, title: "Generate Quizzes", desc: "Test yourself on any topic", color: "text-violet-500 bg-violet-500/10" },
  { icon: Zap, title: "Create Flashcards", desc: "Memorize key concepts fast", color: "text-sky-500 bg-sky-500/10" },
  { icon: Languages, title: "Translate Lessons", desc: "Learn in Bemba, Nyanja, Tonga...", color: "text-rose-500 bg-rose-500/10" },
  { icon: Lightbulb, title: "Smart Hints", desc: "Stuck? Get a hint, not the answer", color: "text-lime-500 bg-lime-500/10" },
];

export function AITutorPage() {
  const [messages, setMessages] = useState(aiTutorConversation);
  const [input, setInput] = useState("");

  const send = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages([
      ...messages,
      {
        id: `m-${Date.now()}`,
        role: "user",
        content: msg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Great question! Based on what you're learning, here's how I'd approach this... [RAG-powered response using your course content]",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 800);
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="AI Tutor"
        description="Your personal learning companion — 24/7, in your language"
        icon={Brain}
        badge="RAG-Powered"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Mic className="w-4 h-4 mr-1" />Voice</Button>
            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />New Chat</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* CHAT */}
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b gradient-emerald text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center gap-2">
                  Zedskillz AI Tutor
                  <Badge className="bg-white/20 text-white border-0 text-[10px]">Online</Badge>
                </div>
                <div className="text-xs opacity-80">
                  Course-aware · Uses RAG with your course content · Speaks 8+ languages
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[440px] overflow-y-auto p-4 space-y-4">
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Tutor stays within your course context. It won't answer unrelated questions unless configured.
              </Badge>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2 max-w-[85%]", m.role === "user" && "ml-auto flex-row-reverse")}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === "user" ? "bg-primary text-primary-foreground" : "gradient-emerald text-white"
                )}>
                  {m.role === "user" ? (
                    <span className="text-xs font-bold">CB</span>
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className={cn(
                    "rounded-2xl p-3 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  </div>
                  <div className={cn(
                    "text-[10px] text-muted-foreground mt-1 flex items-center gap-1",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}>
                    {m.time}
                    {m.role === "assistant" && (
                      <>
                        <span>·</span>
                        <button className="hover:text-foreground"><Volume2 className="w-3 h-3" /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 px-1">
              <Sparkles className="w-3 h-3" />
              <span>Suggested actions</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {aiTutorSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full border hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex items-end gap-2">
              <Button size="sm" variant="ghost" className="p-2"><Mic className="w-4 h-4" /></Button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask your AI tutor anything about your courses..."
                rows={2}
                className="flex-1 resize-none bg-muted rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" onClick={() => send()} className="h-10 w-10 p-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                What AI Tutor Can Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {capabilities.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", c.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Recent Chats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: "Async/await explanation", time: "2h ago", course: "Web Dev" },
                { title: "Python list comprehension", time: "1d ago", course: "Python DS" },
                { title: "Quiz on CSS Grid", time: "3d ago", course: "Web Dev" },
                { title: "Translated to Bemba", time: "1w ago", course: "Web Dev" },
              ].map((c, i) => (
                <button key={i} className="w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                  <div className="text-sm font-medium line-clamp-1">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.course} · {c.time}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-5">
              <GraduationCap className="w-8 h-8 mb-2 opacity-90" />
              <div className="font-semibold mb-1">Unlock Pro AI</div>
              <p className="text-xs opacity-90 mb-3">
                Upgrade to Pro for unlimited AI tutor conversations, voice mode, and priority responses.
              </p>
              <Button size="sm" variant="secondary" className="bg-white text-emerald-700 hover:bg-white/90 w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

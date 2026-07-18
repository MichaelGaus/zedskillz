"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { courses, aiTutorConversation, aiTutorSuggestions } from "@/lib/mock-data";
import {
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Brain,
  Send,
  Video,
  FileText,
  Code,
  BookOpen,
  Headphones,
  Download,
  Maximize2,
  Settings,
  Volume2,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const lessonTypeIcons: Record<string, LucideIcon> = {
  video: Video,
  text: FileText,
  audio: Headphones,
  pdf: FileText,
  slides: FileText,
  code_editor: Code,
  coding_challenge: Code,
  interactive: BookOpen,
  live_class: Video,
  external_link: BookOpen,
  downloadable: Download,
};

export function CoursePlayer() {
  const { setActivePage } = useAppStore();
  const course = courses[0];
  const [activeLessonId, setActiveLessonId] = useState(course.sections[0].lessons[2].id);
  const [showAITutor, setShowAITutor] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(aiTutorConversation);

  // Find active lesson
  let activeLesson: any = null;
  let activeSection: any = null;
  let activeLessonIdx = -1;
  let activeSectionIdx = -1;
  for (let s = 0; s < course.sections.length; s++) {
    const idx = course.sections[s].lessons.findIndex((l) => l.id === activeLessonId);
    if (idx >= 0) {
      activeSection = course.sections[s];
      activeLesson = course.sections[s].lessons[idx];
      activeSectionIdx = s;
      activeLessonIdx = idx;
      break;
    }
  }

  // All lessons flat
  const flatLessons = course.sections.flatMap((s, sIdx) =>
    s.lessons.map((l, lIdx) => ({ ...l, sectionIdx: sIdx, lessonIdx: lIdx, sectionTitle: s.title }))
  );
  const flatIdx = flatLessons.findIndex((l) => l.id === activeLessonId);
  const prevLesson = flatIdx > 0 ? flatLessons[flatIdx - 1] : null;
  const nextLesson = flatIdx < flatLessons.length - 1 ? flatLessons[flatIdx + 1] : null;
  const progress = ((flatIdx + 1) / flatLessons.length) * 100;

  const Icon = lessonTypeIcons[activeLesson?.type] || FileText;

  const handleSendMessage = (text?: string) => {
    const msg = text || chatInput;
    if (!msg.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      role: "user" as const,
      content: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");
    setTimeout(() => {
      const aiReply = {
        id: `a-${Date.now()}`,
        role: "assistant" as const,
        content: "Great question! Let me break this down for you based on what you've learned so far in this course. The key concept here is to think step-by-step about how data flows through your program. Would you like me to generate a quick quiz to test your understanding?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top progress bar */}
      <div className="border-b bg-background sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setActivePage("course-detail")}
            className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to course
          </button>
          <div className="flex-1 max-w-md mx-4 hidden sm:flex items-center gap-3">
            <Progress value={progress} className="h-1.5" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {flatIdx + 1}/{flatLessons.length}
            </span>
          </div>
          <Button
            size="sm"
            variant={showAITutor ? "default" : "outline"}
            onClick={() => setShowAITutor(!showAITutor)}
          >
            <Brain className="w-4 h-4 mr-1" />
            AI Tutor
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Sidebar with lessons */}
        <aside className="hidden md:block w-72 shrink-0 border-r overflow-y-auto bg-background">
          <div className="p-4 border-b">
            <div className="font-semibold text-sm line-clamp-2">{course.title}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}% complete
            </div>
            <Progress value={progress} className="h-1.5 mt-2" />
          </div>
          <div className="p-2">
            {course.sections.map((section, sIdx) => (
              <div key={section.id} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Section {sIdx + 1}: {section.title}
                </div>
                {section.lessons.map((lesson, lIdx) => {
                  const LIcon = lessonTypeIcons[lesson.type] || FileText;
                  const active = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className={cn("w-4 h-4 shrink-0", active ? "text-primary-foreground" : "text-primary")} />
                      ) : (
                        <LIcon className={cn("w-4 h-4 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")} />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={cn("line-clamp-1 text-xs", !active && lesson.completed && "text-muted-foreground line-through")}>
                          {lIdx + 1}. {lesson.title}
                        </div>
                        <div className={cn("text-[10px]", active ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {lesson.duration}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER — Lesson content */}
        <main className="flex-1 overflow-y-auto bg-muted/20">
          {/* Video / content area */}
          <div className="bg-black aspect-video relative">
            {activeLesson?.type === "video" || activeLesson?.type === "live_class" ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={course.thumbnail}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                  <button className="absolute w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <PlayCircle className="w-12 h-12 text-primary" />
                  </button>
                </div>
                {/* Video controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 text-white">
                    <button className="hover:text-primary">
                      <PlayCircle className="w-5 h-5" />
                    </button>
                    <Volume2 className="w-5 h-5" />
                    <div className="flex-1 h-1 bg-white/20 rounded-full">
                      <div className="h-full w-1/3 bg-primary rounded-full" />
                    </div>
                    <span className="text-xs">8:24 / 12:15</span>
                    <Settings className="w-5 h-5" />
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Icon className="w-16 h-16 mb-3 opacity-50" />
                <div className="text-lg font-medium">{activeLesson?.type.replace("_", " ").toUpperCase()}</div>
                <div className="text-sm opacity-70">Content preview</div>
              </div>
            )}
          </div>

          {/* Lesson header */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>Section {activeSectionIdx + 1}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{activeSection?.title}</span>
              <ChevronRight className="w-3 h-3" />
              <span>Lesson {activeLessonIdx + 1}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{activeLesson?.title}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="capitalize">{activeLesson?.type.replace("_", " ")}</span>
              </span>
              <span>·</span>
              <span>{activeLesson?.duration}</span>
            </div>

            {/* Lesson body content */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Lesson Overview</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  In this lesson, you&apos;ll learn how to set up your development environment
                  for the course. We&apos;ll install Node.js, VS Code, and Git, then verify
                  everything works by running your first JavaScript command. By the end,
                  you&apos;ll be ready to start building real applications.
                </p>

                <Separator className="my-4" />

                <h4 className="font-medium text-sm mb-2">Key Takeaways</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Install Node.js LTS version (v20+)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Set up VS Code with essential extensions
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Configure Git with your name and email
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    Verify installation with `node --version`
                  </li>
                </ul>

                {activeLesson?.type === "code_editor" && (
                  <>
                    <Separator className="my-4" />
                    <h4 className="font-medium text-sm mb-2">Try it yourself</h4>
                    <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm">
                      <div className="text-zinc-500 mb-2">{"// Write your first JavaScript"}</div>
                      <div><span className="text-violet-400">console</span>.<span className="text-sky-400">log</span>(<span className="text-emerald-400">&quot;Hello, Zedskillz!&quot;</span>);</div>
                    </div>
                    <Button className="mt-3" size="sm">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Run Code
                    </Button>
                  </>
                )}

                {activeLesson?.resources && activeLesson.resources.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <h4 className="font-medium text-sm mb-2">Resources</h4>
                    <div className="space-y-1.5">
                      {activeLesson.resources.map((r: any, i: number) => (
                        <a
                          key={i}
                          href="#"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Download className="w-3 h-3" />
                          {r.name} ({r.size})
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
                disabled={!prevLesson}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={() => {
                  toast.success("Lesson marked complete! 🎉");
                  if (nextLesson) setActiveLessonId(nextLesson.id);
                }}
                disabled={!nextLesson}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Mark Complete & Next
              </Button>
            </div>
          </div>
        </main>

        {/* RIGHT — AI Tutor */}
        {showAITutor && (
          <aside className="hidden lg:flex w-80 shrink-0 border-l flex-col bg-background">
            <div className="p-4 border-b gradient-emerald text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">AI Tutor</div>
                  <div className="text-xs opacity-80">Course-aware · RAG-powered</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2",
                    m.role === "user" && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "gradient-emerald text-white"
                  )}>
                    {m.role === "user" ? (
                      <span className="text-[10px] font-bold">CB</span>
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-2xl p-3 max-w-[85%] text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                    <div className={cn(
                      "text-[10px] mt-1.5",
                      m.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick suggestions */}
            <div className="p-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 px-1">
                <Sparkles className="w-3 h-3" />
                <span>Suggested</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {aiTutorSuggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    className="text-[10px] px-2 py-1 rounded-full border hover:bg-muted transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t">
              <div className="flex items-end gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask anything about this lesson..."
                  rows={2}
                  className="flex-1 resize-none text-sm bg-muted rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" onClick={() => handleSendMessage()} className="h-9 w-9 p-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { conversations, messages, users } from "@/lib/mock-data";
import {
  Send,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Brain,
  Users as UsersIcon,
  MessageCircle,
  Plus,
  Mic,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function findUser(id: string) {
  return users.find((u) => u.id === id) || users[0];
}

export function MessagingPage() {
  const [activeConv, setActiveConv] = useState(conversations[0].id);
  const [input, setInput] = useState("");
  const [allMessages, setAllMessages] = useState(messages);

  const conv = conversations.find((c) => c.id === activeConv)!;
  const convMessages = allMessages[activeConv] || [];

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: "u-student-1",
      content: input,
      type: "text" as const,
      createdAt: new Date().toISOString(),
    };
    setAllMessages({
      ...allMessages,
      [activeConv]: [...convMessages, newMsg],
    });
    setInput("");
  };

  const isAI = conv.type === "ai";
  const otherUser = isAI ? null : findUser(conv.participants.find((p) => p !== "u-student-1") || "");

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* CONVERSATION LIST */}
      <aside className="w-80 border-r flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Messages</h2>
            <Button size="sm" variant="ghost" className="p-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => {
            const isAIConv = c.type === "ai";
            const other = isAIConv ? null : findUser(c.participants.find((p) => p !== "u-student-1") || "");
            const active = c.id === activeConv;
            return (
              <button
                key={c.id}
                onClick={() => setActiveConv(c.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border-b text-left hover:bg-muted/50 transition-colors",
                  active && "bg-primary/5 border-l-2 border-l-primary"
                )}
              >
                <div className="relative">
                  {isAIConv ? (
                    <div className="w-11 h-11 rounded-full gradient-emerald flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Avatar className="w-11 h-11">
                      <AvatarImage src={other?.avatar} />
                      <AvatarFallback>{other?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  {!isAIConv && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">
                      {isAIConv ? "AI Tutor" : other?.name}
                    </div>
                    {c.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] h-4 px-1.5">
                        {c.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    {isAIConv && <Brain className="w-3 h-3 text-primary shrink-0" />}
                    {c.type === "group" && <UsersIcon className="w-3 h-3 shrink-0" />}
                    {c.type === "course" && <MessageCircle className="w-3 h-3 shrink-0" />}
                    {c.lastMessage.content}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAI ? (
              <div className="w-10 h-10 rounded-full gradient-emerald flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
            ) : (
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherUser?.avatar} />
                <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <div className="font-semibold text-sm flex items-center gap-1">
                {isAI ? "AI Tutor" : otherUser?.name}
                {isAI && <Badge variant="secondary" className="text-[10px]">Online 24/7</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">
                {isAI
                  ? "Course-aware · RAG-powered"
                  : conv.type === "group"
                  ? `${conv.participants.length} members`
                  : "Active now"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="p-2"><Phone className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="p-2"><Video className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="p-2"><Info className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
          {isAI && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs">
                <Brain className="w-3 h-3 mr-1" />
                AI Tutor is course-aware. It uses RAG with course content and won't answer outside the course context.
              </Badge>
            </div>
          )}

          {convMessages.map((m) => {
            const isMe = m.senderId === "u-student-1";
            const sender = findUser(m.senderId);
            return (
              <div key={m.id} className={cn("flex gap-2 max-w-[80%]", isMe && "ml-auto flex-row-reverse")}>
                {!isMe && (
                  isAI ? (
                    <div className="w-7 h-7 rounded-full gradient-emerald flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarImage src={sender.avatar} />
                      <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )
                )}
                <div>
                  <div className={cn(
                    "rounded-2xl p-3 text-sm",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : isAI
                      ? "bg-muted rounded-tl-sm"
                      : "bg-background border rounded-tl-sm"
                  )}>
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  </div>
                  <div className={cn("text-[10px] text-muted-foreground mt-1", isMe ? "text-right" : "text-left")}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-3 border-t">
          {isAI && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {["Summarize this lesson", "Generate quiz", "Explain again", "Translate to Bemba"].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-2 py-1 rounded-full border hover:bg-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button size="sm" variant="ghost" className="p-2"><Paperclip className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="p-2"><ImageIcon className="w-4 h-4" /></Button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={isAI ? "Ask your AI tutor anything about the course..." : "Type a message..."}
              rows={1}
              className="flex-1 resize-none bg-muted rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary max-h-32"
            />
            <Button size="sm" variant="ghost" className="p-2"><Smile className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" className="p-2"><Mic className="w-4 h-4" /></Button>
            <Button size="sm" onClick={sendMessage} className="h-9 w-9 p-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Empty state for mobile */}
      <div className="md:hidden flex-1 flex items-center justify-center text-muted-foreground">
        Select a conversation
      </div>
    </div>
  );
}

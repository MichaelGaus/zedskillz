"use client";

import { liveClasses, users, courses } from "@/lib/mock-data";
import {
  Video,
  Calendar,
  Clock,
  Users,
  PlayCircle,
  Mic,
  Hand,
  MessageSquare,
  ScreenShare,
  Settings,
  Phone,
  VideoOff,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

function findInstructor(id: string) {
  return users.find((u) => u.id === id) || users[0];
}

function findCourse(id: string) {
  return courses.find((c) => c.id === id);
}

export function LiveClassesPage() {
  const upcoming = liveClasses.filter((c) => c.status === "scheduled");
  const ended = liveClasses.filter((c) => c.status === "ended");

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Live Classes"
        description="Join interactive sessions with your instructors"
        icon={Video}
        badge={`${upcoming.length} upcoming`}
      />

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.map((lc) => {
            const instr = findInstructor(lc.instructorId);
            const course = findCourse(lc.courseId);
            const startTime = new Date(lc.scheduledAt);
            const isStartingSoon = startTime.getTime() - Date.now() < 60 * 60 * 1000;

            return (
              <Card key={lc.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Date block */}
                    <div className="flex lg:flex-col items-center justify-center lg:justify-start gap-2 lg:gap-0 lg:w-20 shrink-0">
                      <div className="text-center lg:bg-primary/5 lg:rounded-lg lg:p-3 lg:w-full">
                        <div className="text-xs text-muted-foreground uppercase">
                          {startTime.toLocaleString("en-US", { month: "short" })}
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {startTime.getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {startTime.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </div>
                      </div>
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{lc.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {course?.title}
                          </div>
                        </div>
                        {isStartingSoon && (
                          <Badge className="bg-amber-500/10 text-amber-600">
                            <Clock className="w-3 h-3 mr-1" />
                            Starting soon
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={instr.avatar} />
                            <AvatarFallback>{instr.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{instr.name}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lc.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {lc.attendees} registered
                        </span>
                        <Badge variant="outline" className="capitalize">
                          {lc.platform.replace("_", " ")}
                        </Badge>
                      </div>

                      {/* Features list */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {["Live chat", "Q&A", "Screen sharing", "Recording", "Whiteboard", "Raise hand"].map((f) => (
                          <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className={isStartingSoon ? "animate-pulse" : ""}>
                          <PlayCircle className="w-4 h-4 mr-1" />
                          {isStartingSoon ? "Join Now" : "Set Reminder"}
                        </Button>
                        <Button variant="outline">
                          <Calendar className="w-4 h-4 mr-1" />
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="live">
          <Card className="overflow-hidden">
            {/* Mock live class viewport */}
            <div className="relative bg-black aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={courses[0].thumbnail} alt="" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center mb-3 animate-pulse">
                    <Video className="w-10 h-10" />
                  </div>
                  <div className="text-xl font-bold">Live Now</div>
                  <div className="text-sm opacity-80">Web Dev Q&amp;A with Dr. Gaus</div>
                </div>
              </div>

              {/* Live indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="bg-rose-500 text-white">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                  LIVE
                </Badge>
                <Badge className="bg-black/60 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  234 watching
                </Badge>
              </div>

              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <ScreenShare className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <Hand className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Phone className="w-4 h-4 mr-1" />
                      Leave
                    </Button>
                  </div>
                </div>
              </div>

              {/* Participant thumbnails */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-14 rounded-lg bg-zinc-800 border-2 border-white/20 flex items-center justify-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=participant${i}`} />
                      <AvatarFallback>P{i}</AvatarFallback>
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="p-4 grid md:grid-cols-[1fr_280px] gap-4">
              <div>
                <h2 className="font-semibold text-lg mb-1">Web Dev Q&amp;A with Dr. Gaus</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={users[1].avatar} />
                    <AvatarFallback>{users[1].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {users[1].name} · Started 10:00 AM
                </div>
                <div className="text-sm text-muted-foreground">
                  Topic: JavaScript async/await, Promises, and the event loop. Bring your questions!
                </div>
              </div>

              {/* Live chat */}
              <div className="border rounded-lg flex flex-col h-64">
                <div className="p-2 border-b text-xs font-medium flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Live Chat
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-xs">
                  {[
                    { user: "Mulenga P.", msg: "Thanks for explaining Promises!", color: "text-emerald-500" },
                    { user: "Esther M.", msg: "Can you show the buzzer analogy again?", color: "text-amber-500" },
                    { user: "David S.", msg: "🔥🔥🔥", color: "text-violet-500" },
                    { user: "Ruth K.", msg: "This makes so much sense now", color: "text-sky-500" },
                    { user: "Joseph L.", msg: "When is the next session?", color: "text-rose-500" },
                  ].map((c, i) => (
                    <div key={i}>
                      <span className={cn("font-medium", c.color)}>{c.user}:</span>{" "}
                      <span>{c.msg}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <input
                    placeholder="Send a message..."
                    className="w-full px-2 py-1 text-xs bg-muted rounded outline-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recordings" className="space-y-3">
          {ended.map((lc) => {
            const instr = findInstructor(lc.instructorId);
            const course = findCourse(lc.courseId);
            return (
              <Card key={lc.id}>
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-48 shrink-0">
                    <img src={course?.thumbnail} alt="" className="w-full h-28 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-white" />
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px]">
                      {lc.duration}:00
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{lc.title}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      {course?.title}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={instr.avatar} />
                          <AvatarFallback>{instr.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {instr.name}
                      </span>
                      <span>{new Date(lc.scheduledAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {lc.attendees} attended
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Watch Recording
                      </Button>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

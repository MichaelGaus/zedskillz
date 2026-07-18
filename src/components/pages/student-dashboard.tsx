"use client";

import { useAppStore } from "@/lib/store";
import { courses, liveClasses, achievements } from "@/lib/mock-data";
import {
  Flame,
  Trophy,
  Star,
  PlayCircle,
  Clock,
  Award,
  TrendingUp,
  Brain,
  Calendar,
  ArrowRight,
  Zap,
  BookOpen,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export function StudentDashboard() {
  const { currentUser, setActivePage } = useAppStore();
  const enrolledCourses = courses.slice(0, 3);
  const upcomingClass = liveClasses[0];

  const stats = [
    { label: "Learning Streak", value: "14 days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Total XP", value: "8,450", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Level", value: "12", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Badges", value: "4", icon: Trophy, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}! 👋`}
        description="Pick up where you left off and keep your streak alive."
        action={
          <Button onClick={() => setActivePage("ai-tutor")}>
            <Brain className="w-4 h-4 mr-2" />
            Ask AI Tutor
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — Continue learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  Continue Learning
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActivePage("courses")}
                >
                  Browse all
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrolledCourses.map((course, idx) => {
                const progress = idx === 0 ? 64 : idx === 1 ? 32 : 12;
                const instructor = currentUser.name; // mock
                return (
                  <div
                    key={course.id}
                    className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setActivePage("course-player")}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-1">
                            {course.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {course.category} · {course.duration}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="shrink-0">
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Tutor suggestion */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-emerald flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">AI Tutor Suggestion</h3>
                    <Badge variant="secondary" className="text-[10px]">Personalized</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on your recent activity, you might want to revisit{" "}
                    <span className="font-medium text-foreground">async/await</span>{" "}
                    — you scored 70% on the last quiz. Want me to explain it with
                    a Zambian example?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setActivePage("ai-tutor")}>
                      <Brain className="w-3 h-3 mr-1" />
                      Explain async/await
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="w-3 h-3 mr-1" />
                      Generate practice quiz
                    </Button>
                    <Button size="sm" variant="outline">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Create flashcards
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Active Goals
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActivePage("leaderboard")}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.slice(0, 3).map((ach) => (
                <div key={ach.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-medium">{ach.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {ach.description}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">
                      {ach.progress}/{ach.target}
                    </div>
                  </div>
                  <Progress
                    value={(ach.progress / ach.target) * 100}
                    className="h-1.5"
                  />
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      <Zap className="w-3 h-3 mr-0.5" />
                      +{ach.reward.xp} XP
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      +{ach.reward.coins} coins
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Sidebar widgets */}
        <div className="space-y-6">
          {/* Next live class */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-primary" />
                Next Live Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg gradient-emerald p-4 text-white mb-3">
                <div className="text-xs opacity-90 mb-1">Starts in 30 minutes</div>
                <div className="font-semibold mb-2">{upcomingClass.title}</div>
                <div className="text-xs opacity-90">
                  with Dr. Michael Gaus · Zoom
                </div>
              </div>
              <Button className="w-full" size="sm">
                Join Class
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent badges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="w-4 h-4 text-amber-500" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUser.badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      badge.rarity === "legendary" && "bg-amber-500/20",
                      badge.rarity === "epic" && "bg-violet-500/20",
                      badge.rarity === "rare" && "bg-sky-500/20",
                      badge.rarity === "common" && "bg-emerald-500/20"
                    )}
                  >
                    <Trophy
                      className={cn(
                        "w-5 h-5",
                        badge.rarity === "legendary" && "text-amber-500",
                        badge.rarity === "epic" && "text-violet-500",
                        badge.rarity === "rare" && "text-sky-500",
                        badge.rarity === "common" && "text-emerald-500"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{badge.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {badge.description}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] capitalize shrink-0"
                  >
                    {badge.rarity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Daily goal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-primary" />
                Today&apos;s Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <div className="text-3xl font-bold">45<span className="text-base text-muted-foreground">/60 min</span></div>
                <div className="text-xs text-muted-foreground mt-1">
                  15 minutes to go
                </div>
                <Progress value={75} className="h-2 mt-3" />
                <Button size="sm" className="w-full mt-3">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="w-4 h-4 text-primary" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {courses.slice(3, 5).map((course) => (
                <div
                  key={course.id}
                  className="flex gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => setActivePage("course-detail")}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium line-clamp-2">
                      {course.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {course.isFree ? "Free" : `$${course.price}`}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

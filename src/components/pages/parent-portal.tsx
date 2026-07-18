"use client";

import { useAppStore } from "@/lib/store";
import { childrenReports } from "@/lib/mock-data";
import {
  Heart,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Bell,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  DollarSign,
  Smartphone,
  Mail,
  Link2,
  Plus,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export function ParentPortal() {
  const { setActivePage } = useAppStore();

  const totalStats = childrenReports.reduce(
    (acc, c) => ({
      enrolled: acc.enrolled + c.enrolledCourses,
      completed: acc.completed + c.completedCourses,
      timeSpent: acc.timeSpent + c.timeSpent,
      aiUsage: acc.aiUsageHours + c.aiUsageHours,
    }),
    { enrolled: 0, completed: 0, timeSpent: 0, aiUsage: 0 }
  );

  const stats: { label: string; value: string; icon: LucideIcon; color: string; bg: string }[] = [
    { label: "Linked Children", value: String(childrenReports.length), icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Courses Enrolled", value: String(totalStats.enrolled), icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Time Spent (hrs)", value: String(totalStats.timeSpent), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "AI Usage (hrs)", value: String(totalStats.aiUsage), icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Parent Portal"
        description="Monitor your children's learning journey"
        icon={Heart}
        action={
          <Button>
            <Plus className="w-4 h-4 mr-1" />
            Link Child
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center", s.bg)}>
                  <Icon className={cn("w-5 h-5", s.color)} />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          {childrenReports.map((child) => (
            <Card key={child.studentId}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <Avatar className="w-16 h-16 ring-4 ring-primary/10">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>{child.studentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{child.studentName}</h2>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" />
                        Linked
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {child.enrolledCourses} courses · {child.completedCourses} completed · {child.learningStreak}-day streak 🔥
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Full Report
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Avg Progress</div>
                    <div className="text-xl font-bold mt-1">{child.averageProgress}%</div>
                    <Progress value={child.averageProgress} className="h-1.5 mt-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Avg Grade</div>
                    <div className="text-xl font-bold mt-1">{child.averageGrade}%</div>
                    <Progress value={child.averageGrade} className="h-1.5 mt-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Time Spent</div>
                    <div className="text-xl font-bold mt-1">{child.timeSpent}h</div>
                    <div className="text-xs text-muted-foreground mt-1">This month</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground">Certificates</div>
                    <div className="text-xl font-bold mt-1">{child.certificates.length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Earned</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Weak topics */}
                  <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <div className="font-medium text-sm">Needs Improvement</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {child.weakTopics.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Strong topics */}
                  <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <div className="font-medium text-sm">Strengths</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {child.strongTopics.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* PROGRESS — Detailed activity for each child */}
        <TabsContent value="progress" className="space-y-6">
          {childrenReports.map((child) => (
            <Card key={child.studentId}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>{child.studentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{child.studentName}</CardTitle>
                    <CardDescription>Recent activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {child.recentActivities.map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {act.type === "lesson_completed" && <BookOpen className="w-4 h-4" />}
                        {act.type === "quiz_passed" && <Award className="w-4 h-4" />}
                        {act.type === "ai_session" && <Brain className="w-4 h-4" />}
                        {act.type === "achievement" && <TrendingUp className="w-4 h-4" />}
                        {act.type === "quiz_attempted" && <Award className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">{act.description}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(act.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {child.upcomingAssignments.length > 0 && (
                  <div className="mt-6">
                    <div className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Upcoming Assignments
                    </div>
                    <div className="space-y-2">
                      {child.upcomingAssignments.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <div>
                            <div className="text-sm font-medium">{a.title}</div>
                            <div className="text-xs text-muted-foreground">{a.course}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-amber-600 font-medium">Due</div>
                            <div className="text-xs">{new Date(a.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ALERTS */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { type: "warning", title: "Inactivity detected", message: "Thandiwe hasn't logged in for 2 days. Consider a gentle reminder.", time: "2 hours ago" },
                { type: "info", title: "Achievement unlocked", message: "Chitalu earned the 'Streak Master' badge. Great progress!", time: "1 day ago" },
                { type: "warning", title: "Low quiz score", message: "Chitalu scored 60% on Database Design quiz. Extra practice recommended.", time: "2 days ago" },
                { type: "info", title: "New certificate", message: "Chitalu earned a certificate for 'Intro to Web Development'.", time: "1 week ago" },
                { type: "success", title: "Weekly goal met", message: "Chitalu completed 5 lessons this week. Keep it up!", time: "1 week ago" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    alert.type === "warning" && "bg-amber-500/10 text-amber-500",
                    alert.type === "info" && "bg-sky-500/10 text-sky-500",
                    alert.type === "success" && "bg-emerald-500/10 text-emerald-500"
                  )}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">{alert.message}</div>
                    <div className="text-[10px] text-muted-foreground/70 mt-0.5">{alert.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTROLS */}
        <TabsContent value="controls" className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-primary" />
                Screen Time Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {childrenReports.map((c) => (
                <div key={c.studentId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{c.studentName}</div>
                      <div className="text-xs text-muted-foreground">Daily limit: 2 hours</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Adjust</Button>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="text-xs text-muted-foreground mb-2">Weekend schedule</div>
                <div className="flex items-center justify-between text-sm">
                  <span>Saturday & Sunday</span>
                  <Badge variant="secondary">3 hours</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4 text-primary" />
                Purchase Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Python for Data Science</div>
                  <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Pending</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Requested by Chitalu · $199.99</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-7 text-xs">Approve</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Decline</Button>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Web Dev Bootcamp</div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Approved</Badge>
                </div>
                <div className="text-xs text-muted-foreground">$149.99 · 6 months ago</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Smartphone className="w-4 h-4 text-primary" />
                Notification Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Mail, label: "Email Reports", desc: "Weekly & monthly", on: true },
                { icon: Smartphone, label: "SMS Alerts", desc: "Urgent only", on: true },
                { icon: Bell, label: "Push Notifications", desc: "Real-time", on: true },
              ].map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.label} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{n.label}</div>
                        <div className="text-xs text-muted-foreground">{n.desc}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">{n.on ? "On" : "Off"}</Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="w-4 h-4 text-primary" />
                Linked Children
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {childrenReports.map((c) => (
                <div key={c.studentId} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={c.avatar} />
                      <AvatarFallback>{c.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{c.studentName}</div>
                      <div className="text-xs text-emerald-600">Approved · Parent</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">Manage</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-1" />
                Link another child
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS */}
        <TabsContent value="reports">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Weekly Progress Report", desc: "Detailed week summary for all children", icon: TrendingUp, color: "text-emerald-500" },
              { title: "Monthly Performance Report", desc: "Grades, time spent, achievements", icon: Award, color: "text-amber-500" },
              { title: "AI Usage Report", desc: "How your children use AI tutor", icon: Brain, color: "text-violet-500" },
              { title: "Certificate Transcript", desc: "All earned certificates", icon: BookOpen, color: "text-sky-500" },
              { title: "Spending Report", desc: "Course purchases & subscriptions", icon: DollarSign, color: "text-rose-500" },
              { title: "Learning Path Report", desc: "Recommended next steps", icon: Calendar, color: "text-lime-500" },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <Card key={r.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3")}>
                      <Icon className={cn("w-5 h-5", r.color)} />
                    </div>
                    <div className="font-semibold text-sm mb-1">{r.title}</div>
                    <div className="text-xs text-muted-foreground mb-3">{r.desc}</div>
                    <Button size="sm" variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

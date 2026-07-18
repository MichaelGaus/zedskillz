"use client";

import { useAppStore } from "@/lib/store";
import { courses, reviews, revenueData } from "@/lib/mock-data";
import {
  DollarSign,
  Users,
  Star,
  TrendingUp,
  PlayCircle,
  Wallet,
  MessageSquare,
  Megaphone,
  Plus,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  BookOpen,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export function InstructorDashboard() {
  const { currentUser } = useAppStore();
  const myCourses = courses.filter((c) => c.instructorId === "u-instr-1");

  const stats: {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bg: string;
  }[] = [
    { label: "Total Revenue", value: "$24,580", change: "+12.4%", trend: "up", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Students", value: "8,420", change: "+8.1%", trend: "up", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Avg Rating", value: "4.8", change: "+0.2", trend: "up", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Completion Rate", value: "68%", change: "-2.3%", trend: "down", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const engagementData = [
    { name: "Mon", views: 1240, completions: 89 },
    { name: "Tue", views: 1580, completions: 124 },
    { name: "Wed", views: 1420, completions: 102 },
    { name: "Thu", views: 1890, completions: 145 },
    { name: "Fri", views: 2240, completions: 178 },
    { name: "Sat", views: 1680, completions: 124 },
    { name: "Sun", views: 1920, completions: 156 },
  ];

  const courseDistribution = [
    { name: "Web Dev", value: 45, color: "#10b981" },
    { name: "Mobile", value: 25, color: "#f59e0b" },
    { name: "AI/ML", value: 20, color: "#8b5cf6" },
    { name: "Design", value: 10, color: "#ef4444" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title={`Hello, ${currentUser.name.split(" ")[1] || currentUser.name}! 🎓`}
        description="Your instructor dashboard at a glance"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Megaphone className="w-4 h-4 mr-1" />
              Announce
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Course
            </Button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", stat.bg)}>
                    <Icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT — Revenue chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Last 7 months performance</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Engagement</CardTitle>
              <CardDescription>Views vs Completions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* My courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left font-medium pb-2">Course</th>
                      <th className="text-right font-medium pb-2">Students</th>
                      <th className="text-right font-medium pb-2">Revenue</th>
                      <th className="text-right font-medium pb-2">Rating</th>
                      <th className="text-right font-medium pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses.map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <img src={c.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                            <div className="font-medium line-clamp-1">{c.title}</div>
                          </div>
                        </td>
                        <td className="text-right">{c.studentsCount.toLocaleString()}</td>
                        <td className="text-right font-medium">${(c.studentsCount * c.price * 0.7).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        <td className="text-right">
                          <span className="inline-flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {c.rating}
                          </span>
                        </td>
                        <td className="text-right">
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — Sidebar */}
        <div className="space-y-6">
          {/* Wallet */}
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Wallet Balance</span>
                </div>
                <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                  Withdraw
                </Button>
              </div>
              <div className="text-3xl font-bold">$8,420.00</div>
              <div className="text-xs opacity-80 mt-1">Available for withdrawal</div>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="opacity-80 text-xs">Pending</div>
                  <div className="font-semibold">$1,240.00</div>
                </div>
                <div>
                  <div className="opacity-80 text-xs">Lifetime</div>
                  <div className="font-semibold">$24,580</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={45}
                  >
                    {courseDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {courseDistribution.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-72 overflow-y-auto">
              {reviews.slice(0, 4).map((r) => (
                <div key={r.id} className="pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={r.avatar} />
                      <AvatarFallback>{r.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{r.studentName}</div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.comment}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { icon: Plus, label: "Add Lesson" },
                { icon: Video, label: "Go Live" },
                { icon: MessageSquare, label: "Messages" },
                { icon: Download, label: "Reports" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xs">{a.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  Brain,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Ticket,
  Tag,
  Megaphone,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import {
  platformStats,
  weeklyActiveUsersData,
  revenueData,
  auditLogs,
  supportTickets,
  coupons,
  courses,
  users,
} from "@/lib/mock-data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const statusColors = {
  open: "bg-rose-500/10 text-rose-600",
  in_progress: "bg-amber-500/10 text-amber-600",
  resolved: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/10 text-emerald-600",
  failed: "bg-rose-500/10 text-rose-600",
  warning: "bg-amber-500/10 text-amber-600",
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats: {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: LucideIcon;
    color: string;
    bg: string;
    sub: string;
  }[] = [
    { label: "Total Users", value: platformStats.totalUsers.toLocaleString(), change: "+4.2%", trend: "up", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10", sub: `${platformStats.activeToday.toLocaleString()} active today` },
    { label: "Total Courses", value: platformStats.totalCourses.toLocaleString(), change: "+1.8%", trend: "up", icon: BookOpen, color: "text-violet-500", bg: "bg-violet-500/10", sub: "127 pending review" },
    { label: "Revenue (MTD)", value: `$${(platformStats.monthlyRevenue / 1000).toFixed(0)}K`, change: "+12.4%", trend: "up", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10", sub: `$${(platformStats.totalRevenue / 1000).toFixed(0)}K all-time` },
    { label: "AI Usage", value: `${(platformStats.aiUsageHours / 1000).toFixed(1)}K hrs`, change: "+8.7%", trend: "up", icon: Brain, color: "text-sky-500", bg: "bg-sky-500/10", sub: "Tutor conversations" },
  ];

  const pendingCourses = courses.slice(0, 4).map((c, i) => ({
    ...c,
    status: i === 0 ? "pending_approval" : i === 1 ? "needs_revision" : i === 2 ? "submitted" : "approved",
  }));

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your Zedskillz platform"
        badge="Super Admin"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Megaphone className="w-4 h-4 mr-1" />
              Announce
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        }
      />

      {/* Stats */}
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
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{stat.sub}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">
            Courses
            <Badge variant="secondary" className="ml-1 text-[10px]">127</Badge>
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tickets">
            Tickets
            <Badge variant="secondary" className="ml-1 text-[10px]">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Active Users (Last 7 Days)</CardTitle>
                <CardDescription>{platformStats.activeToday.toLocaleString()} active today</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={weeklyActiveUsersData}>
                    <defs>
                      <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#users)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Real-time platform health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "API Response", status: "operational", value: "98ms", icon: Server },
                  { name: "Database", status: "operational", value: "1.2ms", icon: Activity },
                  { name: "AI Service", status: "operational", value: "Available", icon: Brain },
                  { name: "Payment Gateway", status: "operational", value: "100%", icon: DollarSign },
                  { name: "Video Streaming", status: "degraded", value: "Slow", icon: AlertTriangle },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.name} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{s.value}</span>
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          s.status === "operational" ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t text-center">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    All systems operational
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue & courses published</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="courses" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.slice(0, 5).map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="text-sm font-medium text-muted-foreground w-4">{idx + 1}</div>
                    <img src={c.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.studentsCount.toLocaleString()} students</div>
                    </div>
                    <div className="text-sm font-medium text-emerald-500">
                      ${((c.studentsCount * c.price) / 1000).toFixed(1)}K
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-72 overflow-y-auto">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      log.status === "success" && "bg-emerald-500/10",
                      log.status === "failed" && "bg-rose-500/10",
                      log.status === "warning" && "bg-amber-500/10"
                    )}>
                      {log.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {log.status === "failed" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{log.userName}</span>
                        <span className="text-muted-foreground"> · {log.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.resource}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {log.ipAddress} · {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* COURSES */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Approval Queue</CardTitle>
              <CardDescription>Review and approve submitted courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left font-medium pb-3 pr-3">Course</th>
                      <th className="text-left font-medium pb-3 pr-3">Instructor</th>
                      <th className="text-left font-medium pb-3 pr-3">Category</th>
                      <th className="text-left font-medium pb-3 pr-3">Status</th>
                      <th className="text-left font-medium pb-3 pr-3">Submitted</th>
                      <th className="text-right font-medium pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCourses.map((c) => {
                      const instr = users.find((u) => u.id === c.instructorId);
                      return (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2">
                              <img src={c.thumbnail} alt="" className="w-9 h-9 rounded object-cover" />
                              <div className="font-medium line-clamp-1 max-w-[200px]">{c.title}</div>
                            </div>
                          </td>
                          <td className="pr-3 text-muted-foreground">{instr?.name}</td>
                          <td className="pr-3">
                            <Badge variant="secondary" className="text-[10px]">{c.category}</Badge>
                          </td>
                          <td className="pr-3">
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full capitalize", statusColors[c.status as keyof typeof statusColors] || "bg-muted")}>
                              {c.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="pr-3 text-xs text-muted-foreground">{new Date(c.publishedAt).toLocaleDateString()}</td>
                          <td className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button size="sm" variant="ghost">Review</Button>
                              <Button size="sm">Approve</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Platform Users</CardTitle>
                  <CardDescription>{platformStats.totalUsers.toLocaleString()} total users</CardDescription>
                </div>
                <Button size="sm">Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left font-medium pb-3 pr-3">User</th>
                      <th className="text-left font-medium pb-3 pr-3">Role</th>
                      <th className="text-left font-medium pb-3 pr-3">Joined</th>
                      <th className="text-right font-medium pb-3 pr-3">XP</th>
                      <th className="text-right font-medium pb-3 pr-3">Status</th>
                      <th className="text-right font-medium pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={u.avatar} />
                              <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="pr-3">
                          <Badge variant="secondary" className="text-[10px] capitalize">{u.role.replace("_", " ")}</Badge>
                        </td>
                        <td className="pr-3 text-xs text-muted-foreground">{new Date(u.joinedAt).toLocaleDateString()}</td>
                        <td className="pr-3 text-right">{u.xp.toLocaleString()}</td>
                        <td className="pr-3 text-right">
                          {u.verified ? (
                            <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Verified</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">Pending</Badge>
                          )}
                        </td>
                        <td className="text-right">
                          <Button size="sm" variant="ghost">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAYMENTS */}
        <TabsContent value="payments">
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Today&apos;s Revenue</div><div className="text-2xl font-bold mt-1">$4,820</div><div className="text-xs text-emerald-500 mt-1">+18% vs yesterday</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Pending Payouts</div><div className="text-2xl font-bold mt-1">$12,340</div><div className="text-xs text-muted-foreground mt-1">23 instructors</div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Refund Requests</div><div className="text-2xl font-bold mt-1">7</div><div className="text-xs text-amber-500 mt-1">Avg 24h response</div></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Course Purchase</div>
                        <div className="text-xs text-muted-foreground">INV-2026-{(1240 + i).toString().padStart(4, "0")} · {["Stripe", "MTN Money", "PayPal", "Airtel Money"][i % 4]}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(49 + i * 20).toFixed(2)}</div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Completed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TICKETS */}
        <TabsContent value="tickets">
          <Card>
            <CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supportTickets.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      t.priority === "urgent" && "bg-rose-500/10",
                      t.priority === "high" && "bg-amber-500/10",
                      t.priority === "medium" && "bg-sky-500/10",
                      t.priority === "low" && "bg-muted"
                    )}>
                      <Ticket className={cn(
                        "w-5 h-5",
                        t.priority === "urgent" && "text-rose-500",
                        t.priority === "high" && "text-amber-500",
                        t.priority === "medium" && "text-sky-500",
                        t.priority === "low" && "text-muted-foreground"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">{t.subject}</div>
                        <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        #{t.id} · Last reply {new Date(t.lastReply).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-[10px] capitalize", statusColors[t.status as keyof typeof statusColors])}>
                        {t.status.replace("_", " ")}
                      </Badge>
                      <Button size="sm" variant="outline">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT */}
        <TabsContent value="audit">
          <Card>
            <CardHeader><CardTitle>Audit Logs</CardTitle><CardDescription>All platform activities</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      log.status === "success" && "bg-emerald-500/10",
                      log.status === "failed" && "bg-rose-500/10",
                      log.status === "warning" && "bg-amber-500/10"
                    )}>
                      {log.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {log.status === "failed" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {log.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium">{log.userName}</span>
                        <span className="text-muted-foreground"> {log.action.toLowerCase()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{log.resource}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <div>{log.ipAddress}</div>
                      <div>{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COUPONS */}
        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Coupons & Promotions</CardTitle>
                  <CardDescription>Manage discount codes</CardDescription>
                </div>
                <Button size="sm">
                  <Tag className="w-4 h-4 mr-1" />
                  New Coupon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-mono font-bold text-lg">{c.code}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.type === "percentage" ? `${c.value}% off` : `$${c.value} off`}
                        </div>
                      </div>
                      <Badge className={c.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}>
                        {c.active ? "Active" : "Expired"}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Used</span>
                        <span className="font-medium">{c.usedCount}/{c.usageLimit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Expires</span>
                        <span className="font-medium">{new Date(c.expiresAt).toLocaleDateString()}</span>
                      </div>
                      <Progress value={(c.usedCount / c.usageLimit) * 100} className="h-1.5 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


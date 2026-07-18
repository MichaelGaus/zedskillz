"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  platformStats,
  userGrowthData,
  adminActivity,
  adminUsers,
} from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AdminDashboard() {
  const { setActivePage } = useAppStore();
  const [chartRange, setChartRange] = useState<"WEEK" | "MONTH" | "YEAR">("WEEK");

  const stats = [
    {
      label: "TOTAL USERS",
      value: platformStats.totalUsers.toLocaleString(),
      trend: platformStats.userGrowth,
      trendUp: true,
      icon: "group",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
    },
    {
      label: "REVENUE (ZMK)",
      value: `${(platformStats.revenue / 1000).toFixed(1)}k`,
      trend: platformStats.revenueGrowth,
      trendUp: true,
      icon: "payments",
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-on-tertiary-container",
    },
    {
      label: "ACTIVE COURSES",
      value: platformStats.activeCourses.toString(),
      trend: platformStats.coursesGrowth,
      trendUp: null,
      icon: "local_library",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
    },
    {
      label: "AI INTERACTIONS",
      value: platformStats.aiInteractions,
      trend: platformStats.aiGrowth,
      trendUp: true,
      icon: "psychology",
      iconBg: "bg-primary-container/20",
      iconColor: "text-on-primary-container",
      filled: true,
    },
  ];

  return (
    <AppShell
      title="Admin Dashboard"
      searchPlaceholder="Search analytics..."
      activeNav="admin-dashboard"
      sidebarActivePage="admin-dashboard"
      navLinks={[
        { label: "Home", page: "landing" },
        { label: "Explore", page: "courses" },
        { label: "Ranks", page: "leaderboard" },
        { label: "Admin", page: "admin-dashboard" },
        { label: "Community", page: "community" },
      ]}
      bottomNavItems={[
        { label: "Home", icon: "home", page: "landing" },
        { label: "Explore", icon: "explore", page: "courses" },
        { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
        { label: "Admin", icon: "dashboard", page: "admin-dashboard" },
      ]}
      bottomNavActivePage="admin-dashboard"
    >
      <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    stat.iconBg
                  )}
                >
                  <Icon
                    name={stat.icon}
                    filled={stat.filled}
                    size={22}
                    className={stat.iconColor}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1",
                    stat.trendUp === true && "bg-green-100 text-green-600",
                    stat.trendUp === false && "bg-red-100 text-red-600",
                    stat.trendUp === null && "bg-primary/10 text-primary"
                  )}
                >
                  {stat.trendUp === true && <Icon name="trending_up" size={12} />}
                  {stat.trendUp === false && <Icon name="trending_down" size={12} />}
                  {stat.trend}
                </span>
              </div>
              <div className="font-label-caps text-xs uppercase tracking-wider opacity-70 text-on-surface-variant">
                {stat.label}
              </div>
              <div className="font-display text-3xl font-bold text-on-surface mt-1">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main analysis grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Growth Analytics — col-span-2 */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-5 h-[480px] flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-headline text-headline text-on-surface">
                  User Growth Analytics
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Real-time registration tracking across regions
                </p>
              </div>
              {/* Tab toggle */}
              <div className="bg-surface-container rounded-lg p-1 flex">
                {(["WEEK", "MONTH", "YEAR"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setChartRange(range)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      chartRange === range
                        ? "bg-surface-container-lowest shadow-sm text-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex-1 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 20, right: 20, bottom: 0, left: -10 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--outline-variant)"
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke="var(--on-surface-variant)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--on-surface-variant)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--surface-container)", opacity: 0.5 }}
                    contentStyle={{
                      backgroundColor: "var(--inverse-surface)",
                      border: "none",
                      borderRadius: "8px",
                      color: "var(--inverse-on-surface)",
                      fontSize: "10px",
                    }}
                    labelStyle={{ color: "var(--inverse-on-surface)" }}
                  />
                  <Bar dataKey="users" radius={[4, 4, 0, 0]} maxBarSize={48}>
                    {userGrowthData.map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={entry.active ? "var(--primary-container)" : "var(--primary-container)"}
                        fillOpacity={entry.active ? 1 : 0.2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity — col-span-1 */}
          <div className="glass-card rounded-2xl p-5 h-[480px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-headline text-on-surface">
                Recent Activity
              </h3>
              <button className="p-1.5 hover:bg-surface-container rounded-lg">
                <Icon name="refresh" size={18} className="text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="relative space-y-1">
                {/* Vertical connector line */}
                <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-outline-variant" />

                {adminActivity.map((activity, idx) => (
                  <div key={activity.id} className="relative flex gap-3 pb-6 last:pb-0">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center shrink-0">
                      <Icon
                        name={activity.icon}
                        size={18}
                        className={activity.iconColor}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="font-title text-sm font-semibold text-on-surface">
                        {activity.title}
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        {activity.description}
                      </div>
                      <div className="text-[10px] text-on-surface-variant opacity-70 mt-1">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-3 w-full py-2 text-xs font-label-caps uppercase tracking-widest text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
              View All Activity
            </button>
          </div>
        </div>

        {/* Users table */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-headline text-on-surface">
              Recent Users
            </h3>
            <button className="text-xs text-primary hover:underline">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-on-surface-variant border-b border-outline-variant">
                  <th className="text-left font-label-caps uppercase tracking-wider pb-3 pr-3">User</th>
                  <th className="text-left font-label-caps uppercase tracking-wider pb-3 pr-3">Role</th>
                  <th className="text-left font-label-caps uppercase tracking-wider pb-3 pr-3">Joined</th>
                  <th className="text-left font-label-caps uppercase tracking-wider pb-3 pr-3">Status</th>
                  <th className="text-right font-label-caps uppercase tracking-wider pb-3">XP</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => (
                  <tr key={u.id} className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container/50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-on-surface-variant">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="pr-3">
                      <span className="text-xs px-2 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                        {u.role}
                      </span>
                    </td>
                    <td className="pr-3 text-xs text-on-surface-variant">
                      {new Date(u.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="pr-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          u.status === "Active" && "bg-green-100 text-green-600",
                          u.status === "Verified" && "bg-primary/10 text-primary",
                          u.status === "Pending" && "bg-amber-100 text-amber-700"
                        )}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="text-right font-medium">{u.xp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

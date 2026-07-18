"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { leaderboard, currentUser } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";

export function Leaderboard() {
  const { setActivePage } = useAppStore();
  const [scope, setScope] = useState<"Global" | "Zambia">("Zambia");

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

  return (
    <AppShell
      activeNav="leaderboard"
      sidebarActivePage="leaderboard"
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
        { label: "Ranks", icon: "leaderboard", page: "leaderboard", elevated: true },
        { label: "Admin", icon: "dashboard", page: "admin-dashboard" },
      ]}
      bottomNavActivePage="leaderboard"
      showSearch={false}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* ===== Podium Section ===== */}
        <div className="text-center mb-10">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-2">
            National Ranks
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Top scholars across Zambia this week
          </p>

          {/* 3-column podium */}
          <div className="flex justify-center items-end gap-4 md:gap-8 mt-10">
            {podiumOrder.map((entry) => {
              const isFirst = entry.rank === 1;
              return (
                <div
                  key={entry.userId}
                  className={cn(
                    "flex flex-col items-center",
                    isFirst && "animate-float"
                  )}
                >
                  {/* Crown icon for 1st */}
                  {isFirst && (
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center mb-2 shadow-lg">
                      <Icon name="workspace_premium" filled size={24} />
                    </div>
                  )}

                  {/* Avatar */}
                  <div
                    className={cn(
                      "rounded-full border-4",
                      isFirst
                        ? "w-32 h-32 md:w-40 md:h-40 border-primary-container scale-110"
                        : entry.rank === 2
                        ? "w-24 h-24 md:w-32 md:h-32 border-surface-variant"
                        : "w-24 h-24 md:w-32 md:h-32 border-secondary-container"
                    )}
                  >
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  {/* Rank pill */}
                  <div
                    className={cn(
                      "mt-3 px-3 py-1 rounded-full text-xs font-bold",
                      isFirst
                        ? "bg-primary text-on-primary"
                        : entry.rank === 2
                        ? "bg-surface-variant text-on-surface"
                        : "bg-secondary-container text-on-secondary-container"
                    )}
                  >
                    {entry.rank === 1 ? "1st" : entry.rank === 2 ? "2nd" : "3rd"}
                  </div>

                  {/* Name */}
                  <div
                    className={cn(
                      "mt-2 font-title font-semibold text-on-surface",
                      isFirst && "font-headline text-headline text-primary"
                    )}
                  >
                    {entry.name}
                  </div>

                  {/* XP */}
                  <div className="font-bold text-primary-container text-sm mt-1">
                    {entry.xp.toLocaleString()} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Two-column grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 100 Table — col-span-2 */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30">
            {/* Header bar */}
            <div className="bg-surface-container px-5 py-4 flex items-center justify-between">
              <h3 className="font-headline text-headline text-on-surface">
                Top 100 Scholars
              </h3>
              {/* Scope toggle */}
              <div className="flex gap-1">
                {(["Global", "Zambia"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                      scope === s
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-xs text-on-surface-variant">
                  <th className="font-label-caps uppercase tracking-wider text-left px-5 py-3">Rank</th>
                  <th className="font-label-caps uppercase tracking-wider text-left px-5 py-3">Learner</th>
                  <th className="font-label-caps uppercase tracking-wider text-center px-5 py-3">Streak</th>
                  <th className="font-label-caps uppercase tracking-wider text-right px-5 py-3">XP</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((entry) => (
                  <tr
                    key={entry.userId}
                    className={cn(
                      "border-b border-outline-variant/30 last:border-0 hover:bg-surface-container cursor-pointer transition-colors",
                      entry.isMe && "bg-primary-container/5 border-l-4 border-primary"
                    )}
                  >
                    <td className="px-5 py-3 font-bold text-primary">#{entry.rank}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img src={entry.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-medium">
                          {entry.name}
                          {entry.isMe && (
                            <span className="ml-1 text-[10px] text-primary">(You)</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Icon
                          name="local_fire_department"
                          filled
                          size={16}
                          className="text-tertiary-container"
                        />
                        {entry.streak}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {entry.xp.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column — 3 stacked cards */}
          <div className="space-y-4">
            {/* Personal Stats */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30">
              <h3 className="font-title text-sm font-semibold mb-3">Your Stats</h3>
              <div className="space-y-2">
                {[
                  { icon: "military_tech", label: "Current Rank", value: `#${currentUser.rank}`, color: "text-primary" },
                  { icon: "bolt", label: "Total XP", value: currentUser.xp.toLocaleString(), color: "text-amber-500" },
                  { icon: "event_available", label: "Learning Days", value: String(currentUser.learningDays), color: "text-emerald-500" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 bg-surface-container-low rounded-lg p-3"
                  >
                    <Icon name={s.icon} filled size={20} className={s.color} />
                    <div className="flex-1">
                      <div className="text-xs text-on-surface-variant">{s.label}</div>
                      <div className="font-display text-lg font-bold text-primary">
                        {s.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Booster */}
            <div className="relative bg-primary-container text-on-primary-container rounded-2xl p-5 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-on-primary-container/20 blur-3xl rounded-full" />
              <div className="relative">
                <div className="font-label-caps text-[10px] uppercase tracking-widest opacity-80 mb-2">
                  AI Booster
                </div>
                <h3 className="font-headline text-headline mb-2">
                  Gain +500 XP with Smart Sprints
                </h3>
                <p className="text-sm opacity-90 mb-4 leading-relaxed">
                  Our AI detected a gap in your &apos;Advanced Physics&apos; module.
                  Complete a quick quiz to surge up 3 ranks!
                </p>
                <button
                  onClick={() => setActivePage("ai-tutor")}
                  className="px-4 py-2 bg-surface text-primary rounded-full text-sm font-semibold hover:bg-surface-container-lowest transition-colors"
                >
                  Start AI Sprint
                </button>
              </div>
            </div>

            {/* Scholar Spotlight */}
            <div className="bg-secondary-container rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-on-secondary-container flex items-center justify-center">
                  <Icon name="trending_up" size={18} className="text-secondary-container" />
                </div>
                <h3 className="font-title text-sm font-semibold text-on-secondary-container">
                  Scholar Spotlight
                </h3>
              </div>
              <div className="bg-white/50 rounded-xl p-4 flex items-center gap-3">
                <img
                  src={top3[0].avatar}
                  alt={top3[0].name}
                  className="w-12 h-12 rounded-full border-2 border-primary"
                />
                <div>
                  <div className="font-title text-sm font-semibold">{top3[0].name}</div>
                  <div className="text-xs text-on-surface-variant">
                    Moved up 5 ranks today! 🔥
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

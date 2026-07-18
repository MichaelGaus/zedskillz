"use client";

import { leaderboard, achievements, allBadges, users } from "@/lib/mock-data";
import {
  Trophy,
  Flame,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Zap,
  Award,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

const badgeRarityColors = {
  common: "from-emerald-500 to-teal-500",
  rare: "from-sky-500 to-blue-500",
  epic: "from-violet-500 to-purple-500",
  legendary: "from-amber-500 to-orange-500",
};

const badgeRarityBg = {
  common: "bg-emerald-500/10",
  rare: "bg-sky-500/10",
  epic: "bg-violet-500/10",
  legendary: "bg-amber-500/10",
};

const badgeIcons: Record<string, LucideIcon> = {
  zap: Zap,
  flame: Flame,
  award: Award,
  crown: Crown,
  footprints: TrendingUp,
  users: Trophy,
  heart: Award,
  trophy: Trophy,
  moon: Star,
  sunrise: Star,
  languages: Award,
  "graduation-cap": Award,
};

export function LeaderboardPage() {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const myRank = leaderboard.findIndex((e) => e.userId === "u-student-1") + 1;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Leaderboard & Achievements"
        description={`You're ranked #${myRank} out of 124,503 learners`}
        icon={Trophy}
      />

      <Tabs defaultValue="leaderboard">
        <TabsList className="mb-6">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* LEADERBOARD */}
        <TabsContent value="leaderboard">
          {/* Top 3 Podium */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[1, 0, 2].map((idx) => {
              const entry = top3[idx];
              const isFirst = idx === 0;
              return (
                <Card
                  key={entry.userId}
                  className={cn(
                    "text-center overflow-hidden",
                    isFirst && "sm:-mt-4 border-amber-500/50"
                  )}
                >
                  <CardContent className="p-6">
                    <div className={cn(
                      "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3",
                      idx === 0 && "bg-amber-500/20",
                      idx === 1 && "bg-slate-300/30",
                      idx === 2 && "bg-orange-700/20"
                    )}>
                      <Trophy className={cn(
                        "w-8 h-8",
                        idx === 0 && "text-amber-500",
                        idx === 1 && "text-slate-400",
                        idx === 2 && "text-orange-700"
                      )} />
                    </div>
                    <Avatar className={cn("w-16 h-16 mx-auto mb-2 ring-4", isFirst ? "ring-amber-500/30" : "ring-transparent")}>
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">Level {entry.level}</div>
                    <div className="text-2xl font-bold text-primary">{entry.xp.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">XP</div>
                    <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {entry.streak}d
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-primary" />
                        {entry.coursesCompleted} courses
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Rest of leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rest.map((entry, idx) => {
                  const rank = idx + 4;
                  const isMe = entry.userId === "u-student-1";
                  return (
                    <div
                      key={entry.userId}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        isMe && "bg-primary/5 border-primary"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0",
                        isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {rank}
                      </div>
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm">{entry.name}</span>
                          {isMe && <Badge variant="secondary" className="text-[10px]">You</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Level {entry.level} · {entry.streak}-day streak
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {entry.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                        {entry.trend === "down" && <TrendingDown className="w-3 h-3 text-rose-500" />}
                        {entry.trend === "same" && <Minus className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">{entry.xp.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACHIEVEMENTS */}
        <TabsContent value="achievements">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => {
              const Icon = badgeIcons[ach.icon] || Trophy;
              const pct = (ach.progress / ach.target) * 100;
              return (
                <Card key={ach.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl gradient-emerald flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{ach.title}</div>
                        <div className="text-xs text-muted-foreground">{ach.description}</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{ach.progress}/{ach.target}</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Badge variant="secondary" className="text-[10px]">
                        <Zap className="w-3 h-3 mr-0.5" />
                        +{ach.reward.xp} XP
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        +{ach.reward.coins} coins
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* BADGES */}
        <TabsContent value="badges">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Your Earned Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {users[0].badges.map((b) => {
                  const Icon = badgeIcons[b.icon] || Trophy;
                  return (
                    <div key={b.id} className="text-center p-3 rounded-lg border bg-muted/30">
                      <div className={cn(
                        "w-14 h-14 rounded-full bg-gradient-to-br mx-auto flex items-center justify-center mb-2",
                        badgeRarityColors[b.rarity]
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-medium text-sm">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                        {b.description}
                      </div>
                      <Badge className={cn("mt-2 text-[10px] capitalize", badgeRarityBg[b.rarity])}>
                        {b.rarity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Available Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {allBadges.map((b) => {
                  const Icon = badgeIcons[b.icon] || Trophy;
                  const earned = users[0].badges.some((eb) => eb.id === b.id.replace("ab", "b"));
                  return (
                    <div
                      key={b.id}
                      className={cn(
                        "text-center p-3 rounded-lg border",
                        earned ? "bg-muted/30" : "opacity-40 grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-full bg-gradient-to-br mx-auto flex items-center justify-center mb-2",
                        badgeRarityColors[b.rarity]
                      )}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-medium text-sm">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                        {b.description}
                      </div>
                      <Badge className={cn("mt-2 text-[10px] capitalize", badgeRarityBg[b.rarity])}>
                        {b.rarity}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

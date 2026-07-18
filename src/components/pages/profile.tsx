"use client";

import { useAppStore } from "@/lib/store";
import { users, courses } from "@/lib/mock-data";
import {
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Users,
  Star,
  Edit,
  Share2,
  Settings,
  Sparkles,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const { currentUser } = useAppStore();
  const user = currentUser;
  const enrolledCourses = courses.slice(0, 3);

  const socialIcons: Record<string, any> = {
    twitter: Twitter,
    github: Github,
    linkedin: Linkedin,
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="My Profile"
        description="View and manage your public profile"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" />Share</Button>
            <Button size="sm"><Edit className="w-4 h-4 mr-1" />Edit Profile</Button>
          </div>
        }
      />

      {/* Cover + Avatar */}
      <Card className="overflow-hidden mb-6">
        <div className="h-40 gradient-emerald relative">
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Settings className="w-3 h-3 mr-1" />
            Change Cover
          </Button>
        </div>
        <CardContent className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <Avatar className="w-28 h-28 ring-4 ring-background rounded-full">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 md:pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified && (
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">✓</span>
                )}
                <Badge className="capitalize">{user.role.replace("_", " ")}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </span>
                {user.education && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {user.education}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-6 md:pb-2">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* MAIN */}
        <div>
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      {user.role}
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      {user.education}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {user.socialLinks && user.socialLinks.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-xs font-medium text-muted-foreground mb-2">SOCIAL LINKS</div>
                      <div className="flex gap-2">
                        {user.socialLinks.map((s) => {
                          const Icon = socialIcons[s.platform] || LinkIcon;
                          return (
                            <a
                              key={s.platform}
                              href={s.url}
                              className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {user.skills && user.skills.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="capitalize">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.interests && user.interests.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Interests</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((i) => (
                        <Badge key={i} variant="outline" className="capitalize">
                          <Heart className="w-3 h-3 mr-1" />
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-3">
              <Card>
                <CardHeader><CardTitle className="text-base">Enrolled Courses ({enrolledCourses.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {enrolledCourses.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <img src={c.thumbnail} alt="" className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{c.instructorId}</div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {i === 0 ? "64%" : i === 1 ? "32%" : "12%"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Completed Courses ({user.completedCourses})</CardTitle></CardHeader>
                <CardContent>
                  {user.certificates.length > 0 ? (
                    user.certificates.map((cert) => (
                      <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg border bg-emerald-500/5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Award className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{cert.courseTitle}</div>
                          <div className="text-xs text-muted-foreground">
                            Issued {new Date(cert.issueDate).toLocaleDateString()} · {cert.certificateNumber}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No completed courses yet. Keep learning!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />Stats</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Total XP", value: user.xp.toLocaleString(), icon: Sparkles, color: "text-amber-500" },
                      { label: "Level", value: user.level, icon: GraduationCap, color: "text-primary" },
                      { label: "Coins", value: user.coins, icon: Award, color: "text-amber-600" },
                      { label: "Day Streak", value: `${user.streak} days 🔥`, icon: Heart, color: "text-rose-500" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <Icon className={cn("w-4 h-4", s.color)} />
                            {s.label}
                          </div>
                          <div className="font-bold">{s.value}</div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Award className="w-4 h-4 text-primary" />Badges</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {user.badges.map((b) => (
                        <div key={b.id} className="text-center p-2 rounded-lg border bg-muted/30">
                          <div className={cn(
                            "w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-1",
                            b.rarity === "legendary" && "bg-amber-500/20",
                            b.rarity === "epic" && "bg-violet-500/20",
                            b.rarity === "rare" && "bg-sky-500/20",
                            b.rarity === "common" && "bg-emerald-500/20"
                          )}>
                            <Award className={cn(
                              "w-5 h-5",
                              b.rarity === "legendary" && "text-amber-500",
                              b.rarity === "epic" && "text-violet-500",
                              b.rarity === "rare" && "text-sky-500",
                              b.rarity === "common" && "text-emerald-500"
                            )} />
                          </div>
                          <div className="text-[10px] font-medium">{b.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: BookOpen, label: "Completed lesson 'Your First HTML Page'", time: "2 hours ago", color: "text-emerald-500" },
                    { icon: Award, label: "Earned 'Quick Learner' badge", time: "1 day ago", color: "text-amber-500" },
                    { icon: Star, label: "Reviewed 'Web Dev Bootcamp'", time: "2 days ago", color: "text-violet-500" },
                    { icon: Users, label: "Joined community 'Zambian Developers'", time: "3 days ago", color: "text-sky-500" },
                    { icon: CheckCircle2, label: "Passed Module 1 Quiz with 92%", time: "4 days ago", color: "text-emerald-500" },
                  ].map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className={cn("w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0")}>
                          <Icon className={cn("w-4 h-4", a.color)} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{a.label}</div>
                          <div className="text-xs text-muted-foreground">{a.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Courses", value: enrolledCourses.length, icon: BookOpen, color: "text-primary" },
                { label: "Certificates", value: user.certificates.length, icon: Award, color: "text-amber-500" },
                { label: "Badges", value: user.badges.length, icon: Sparkles, color: "text-violet-500" },
                { label: "Followers", value: user.followers, icon: Users, color: "text-sky-500" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-3 p-2 rounded-lg border">
                    <Icon className={cn("w-5 h-5", s.color)} />
                    <div className="flex-1 text-sm">{s.label}</div>
                    <div className="font-bold">{s.value}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                "Public profile",
                "Show progress",
                "Show achievements",
                "Allow messages",
                "Show on leaderboard",
              ].map((p, i) => (
                <label key={p} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <span className="text-sm">{p}</span>
                  <input type="checkbox" defaultChecked={i < 4} className="rounded" />
                </label>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

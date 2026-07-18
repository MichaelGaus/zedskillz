"use client";

import { useAppStore } from "@/lib/store";
import { courses, categories, users } from "@/lib/mock-data";
import {
  GraduationCap,
  Brain,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Trophy,
  Globe,
  Shield,
  Zap,
  Heart,
  BookOpen,
  Award,
  CheckCircle2,
  Smartphone,
  MessageSquare,
  TrendingUp,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Footer } from "@/components/shell/footer";

export function LandingPage() {
  const { setActivePage, setRole } = useAppStore();

  const featuredCourses = courses.filter((c) => c.isFeatured).slice(0, 3);
  const topInstructors = users.filter((u) => u.role === "instructor");

  const stats = [
    { label: "Active Learners", value: "124K+", icon: Users },
    { label: "Expert Instructors", value: "1,200+", icon: GraduationCap },
    { label: "Courses Available", value: "1,800+", icon: BookOpen },
    { label: "Certificates Issued", value: "45K+", icon: Award },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Tutor 24/7",
      description:
        "Personal AI tutor that speaks Bemba, Nyanja, Tonga, Lozi and more. Get instant explanations, quizzes, and study plans tailored to you.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description:
        "Earn XP, badges, and certificates. Climb the leaderboard. Keep your streak alive with daily goals and weekly challenges.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Video,
      title: "Live Classes",
      description:
        "Join live Zoom & Google Meet sessions. Chat, ask questions, raise your hand, and access recordings anytime.",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: Heart,
      title: "Parent Portal",
      description:
        "Parents can monitor progress, view grades, control screen time, approve purchases, and receive weekly reports.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Globe,
      title: "Multi-country & Localized",
      description:
        "Currencies, languages, and educational systems across 12+ African countries. Built for low-connectivity areas with offline mode.",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Shield,
      title: "Secure & Accessible",
      description:
        "WCAG 2.2 compliant, JWT auth, 2FA, dark mode, keyboard navigation, and screen reader support for everyone.",
      color: "from-lime-500 to-green-500",
    },
  ];

  const testimonials = [
    {
      name: "Mulenga Phiri",
      role: "Software Engineer at Liquid Intelligent Tech",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mulenga",
      content:
        "Zedskillz changed my life. I went from selling airtime to landing a software engineering job in 8 months. The AI tutor felt like having a personal mentor.",
      rating: 5,
    },
    {
      name: "Esther Mumba",
      role: "Data Analyst, Bank of Zambia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther",
      content:
        "The Python for Data Science course is exceptional. Local context, real datasets from African markets, and the community support is unmatched.",
      rating: 5,
    },
    {
      name: "Joseph Lungu",
      role: "Founder, AgriTech Zambia",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JosephL",
      content:
        "As a parent and entrepreneur, Zedskillz helps me track my kids' learning while I upskill myself. The financial literacy course is a must for every founder.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-emerald flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-none">Zedskillz</div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">
                AI Learning Platform
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button onClick={() => setActivePage("courses")} className="hover:text-primary transition-colors">
              Courses
            </button>
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#instructors" className="hover:text-primary transition-colors">
              Instructors
            </a>
            <a href="#testimonials" className="hover:text-primary transition-colors">
              Stories
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage("auth")}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setRole("student");
                setActivePage("student-dashboard");
              }}
              className="hidden sm:inline-flex"
            >
              Start Learning
            </Button>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                <Sparkles className="w-3 h-3 mr-1" />
                Now with AI tutors in 8+ Zambian languages
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Learn skills that{" "}
                <span className="text-gradient-emerald">matter</span>.
                <br />
                Powered by AI that{" "}
                <span className="text-gradient-emerald">understands you</span>.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Zedskillz is Africa&apos;s AI-powered learning platform. Master
                in-demand skills with personalized AI tutors, expert-led courses,
                live classes, and a community of 124,000+ learners across the
                continent.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setRole("student");
                    setActivePage("student-dashboard");
                  }}
                  className="h-12 px-6 text-base"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setActivePage("courses")}
                  className="h-12 px-6 text-base"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Browse Courses
                </Button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  14-day money-back
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Cancel anytime
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 gradient-emerald opacity-20 blur-3xl rounded-3xl" />
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6" />
                    <div className="font-semibold">AI Tutor — Web Dev 101</div>
                    <Badge className="ml-auto bg-white/20 text-white border-0">
                      Live
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
                      <div className="text-xs text-white/70 mb-1">You</div>
                      <div className="text-sm">
                        Can you explain async/await using a Zambian example?
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tr-sm p-3 max-w-[80%] ml-auto text-slate-900">
                      <div className="text-xs text-slate-500 mb-1">AI Tutor</div>
                      <div className="text-sm">
                        Sure! Think of ordering nshima at a restaurant. You place
                        your order (start async operation), get a ticket number
                        (Promise), and continue chatting with friends (other
                        code runs) until your number is called (await resolves).
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {["Explain more", "Quiz me", "Show code"].map((s) => (
                        <button
                          key={s}
                          className="text-xs bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating stat cards */}
              <div className="absolute -top-4 -right-4 bg-background border rounded-xl shadow-lg p-3 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Your streak</div>
                    <div className="font-bold">14 days 🔥</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-background border rounded-xl shadow-lg p-3 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">This week</div>
                    <div className="font-bold">+245 XP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex w-12 h-12 rounded-xl bg-primary/10 text-primary items-center justify-center mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Top Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore what you can learn
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From coding to design, business to AI — find your path with
              courses crafted for African learners.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActivePage("courses")}
                className="group text-left"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className={`h-24 bg-gradient-to-br ${cat.color}`} />
                  <CardContent className="p-4">
                    <div className="font-semibold">{cat.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {cat.coursesCount} courses
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Why Zedskillz
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Built different. Built for Africa.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Every feature is designed with African learners in mind — from
              local languages to mobile-first, offline-ready experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COURSES ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="secondary" className="mb-3">
                Featured Courses
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Most loved by learners
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => setActivePage("courses")}
              className="hidden sm:inline-flex"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => {
              const instructor = users.find((u) => u.id === course.instructorId);
              return (
                <Card
                  key={course.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => setActivePage("course-detail")}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-44 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-background/95 text-foreground">
                      {course.category}
                    </Badge>
                    {course.discount && (
                      <Badge className="absolute top-3 right-3 bg-rose-500 text-white">
                        -{course.discount}%
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {course.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={instructor?.avatar} />
                        <AvatarFallback>
                          {instructor?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {instructor?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({course.reviewsCount})
                        </span>
                      </div>
                      <div className="font-bold">
                        {course.isFree ? (
                          <span className="text-primary">Free</span>
                        ) : (
                          <>
                            ${course.price}
                            {course.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through ml-1">
                                ${course.originalPrice}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== INSTRUCTORS ===== */}
      <section id="instructors" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Meet the Experts
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Learn from the best in Africa
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Our instructors are PhDs, founders, and senior engineers who&apos;ve
              built products used by millions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInstructors.map((ins) => (
              <Card key={ins.id}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-primary/10">
                    <AvatarImage src={ins.avatar} alt={ins.name} />
                    <AvatarFallback>{ins.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <h3 className="font-semibold">{ins.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {ins.bio}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <div>
                      <div className="font-semibold">
                        {(ins.followers / 1000).toFixed(1)}K
                      </div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <div className="font-semibold">
                        {courses.filter((c) => c.instructorId === ins.id).length}
                      </div>
                      <div className="text-muted-foreground">Courses</div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <div className="font-semibold flex items-center gap-0.5 justify-center">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.8
                      </div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Learners changing their lives
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    &quot;{t.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / CTA ===== */}
      <section id="pricing" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Simple Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Invest in your future
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready. Cancel anytime. We
              support MTN, Airtel, Zamtel, Visa, Mastercard, PayPal & more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for getting started",
                features: [
                  "Access to 50+ free courses",
                  "Community access",
                  "Basic AI tutor (5 queries/day)",
                  "Mobile app access",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "per month",
                description: "For serious learners",
                features: [
                  "Unlimited courses",
                  "24/7 AI tutor (unlimited)",
                  "Certificates of completion",
                  "Offline mode",
                  "Live class recordings",
                  "Priority support",
                ],
                cta: "Start 14-day Trial",
                highlighted: true,
              },
              {
                name: "Schools",
                price: "Custom",
                period: "per student",
                description: "For institutions & organizations",
                features: [
                  "Everything in Pro",
                  "Admin dashboard",
                  "Parent portal",
                  "Bulk enrollments",
                  "Custom curriculum",
                  "Dedicated success manager",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "border-primary shadow-lg relative"
                    : "relative"
                }
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <div className="font-semibold mb-1">{plan.name}</div>
                  <div className="text-xs text-muted-foreground mb-4">
                    {plan.description}
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <Button
                    className="w-full mb-6"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => {
                      setRole("student");
                      setActivePage("auth");
                    }}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== APP DOWNLOAD CTA ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <Card className="overflow-hidden border-0 gradient-emerald text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="mb-3 bg-white/20 text-white border-0">
                    <Smartphone className="w-3 h-3 mr-1" />
                    Mobile App
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Learn anywhere, even offline
                  </h2>
                  <p className="text-white/90 mb-6 max-w-lg">
                    Download lessons for offline learning. Built for low-connectivity
                    rural areas. Sync progress automatically. Available on Android
                    & iOS with biometric login.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-3 bg-white text-slate-900 px-5 py-3 rounded-xl hover:bg-white/90 transition-colors">
                      <Smartphone className="w-6 h-6" />
                      <div className="text-left">
                        <div className="text-[10px] leading-none">Get it on</div>
                        <div className="font-semibold leading-tight">
                          Google Play
                        </div>
                      </div>
                    </button>
                    <button className="flex items-center gap-3 bg-white text-slate-900 px-5 py-3 rounded-xl hover:bg-white/90 transition-colors">
                      <Smartphone className="w-6 h-6" />
                      <div className="text-left">
                        <div className="text-[10px] leading-none">Download on</div>
                        <div className="font-semibold leading-tight">
                          App Store
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="hidden lg:flex justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Zap, label: "Offline mode" },
                      { icon: MessageSquare, label: "AI chat on mobile" },
                      { icon: Bell, label: "Push notifications" },
                      { icon: Shield, label: "Biometric login" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="bg-white/10 backdrop-blur rounded-xl p-4 flex flex-col items-center text-center gap-2"
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Your learning journey starts today
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join 124,000+ African learners building their future with Zedskillz.
            No credit card. No commitment. Just learning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => {
                setRole("student");
                setActivePage("student-dashboard");
              }}
              className="h-12 px-8 text-base"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setActivePage("courses")}
              className="h-12 px-8 text-base"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

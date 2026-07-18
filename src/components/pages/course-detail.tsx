"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { courses, users, reviews } from "@/lib/mock-data";
import {
  Star,
  Clock,
  Users,
  Heart,
  Share2,
  PlayCircle,
  CheckCircle2,
  Globe,
  Smartphone,
  Award,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Headphones,
  Code,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const lessonTypeIcons: Record<string, LucideIcon> = {
  video: Video,
  text: FileText,
  audio: Headphones,
  pdf: FileText,
  slides: FileText,
  code_editor: Code,
  coding_challenge: Code,
  interactive: BookOpen,
  live_class: Video,
  external_link: BookOpen,
  downloadable: FileText,
};

export function CourseDetail() {
  const { setActivePage, wishlist, toggleWishlist, currentUser } = useAppStore();
  const course = courses[0]; // Featured course for demo
  const instructor = users.find((u) => u.id === course.instructorId);
  const courseReviews = reviews.filter((r) => r.courseId === course.id);
  const inWishlist = wishlist.includes(course.id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([course.sections[0].id])
  );

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  const toggleSection = (id: string) => {
    const next = new Set(expandedSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSections(next);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
        <button onClick={() => setActivePage("courses")} className="hover:text-foreground">Courses</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-muted-foreground">{course.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground line-clamp-1">{course.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* MAIN */}
        <div>
          {/* Hero */}
          <div className="relative mb-6 rounded-xl overflow-hidden">
            <img src={course.thumbnail} alt={course.title} className="w-full h-72 object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                <PlayCircle className="w-10 h-10 text-primary" />
              </button>
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-background/95 text-foreground">{course.category}</Badge>
              {course.isFeatured && (
                <Badge className="bg-amber-500 text-white">Featured</Badge>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{course.subtitle}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{course.rating}</span>
              <span className="text-muted-foreground">({course.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              {course.studentsCount.toLocaleString()} students
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Globe className="w-4 h-4" />
              {course.language}
            </div>
            <Badge variant="secondary" className="capitalize">{course.difficulty}</Badge>
          </div>

          {/* Instructor */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                <AvatarImage src={instructor?.avatar} />
                <AvatarFallback>{instructor?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Instructor</div>
                <div className="font-semibold flex items-center gap-1">
                  {instructor?.name}
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground">{instructor?.bio}</div>
              </div>
              <Button variant="outline" size="sm">Follow</Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4 flex-wrap h-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>What you&apos;ll learn</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.learningObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{obj}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Course Description</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Requirements</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base">Who this is for</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.targetAudience.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="text-base">This course includes</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {[
                      { icon: Video, label: `${course.duration} on-demand video` },
                      { icon: FileText, label: `${totalLessons} lessons` },
                      { icon: Code, label: "Coding exercises" },
                      { icon: Award, label: "Certificate of completion" },
                      { icon: Smartphone, label: "Mobile & TV access" },
                      { icon: Globe, label: "Full lifetime access" },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CURRICULUM */}
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Content</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {course.sections.length} sections · {totalLessons} lessons · {course.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {course.sections.map((section, sIdx) => {
                    const expanded = expandedSections.has(section.id);
                    return (
                      <div key={section.id} className="border-b last:border-0">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
                            <span className="font-medium text-sm">
                              Section {sIdx + 1}: {section.title}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {section.lessons.length} lessons
                          </div>
                        </button>
                        {expanded && (
                          <div className="bg-muted/20">
                            {section.lessons.map((lesson, lIdx) => {
                              const Icon = lessonTypeIcons[lesson.type] || FileText;
                              return (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 cursor-pointer text-sm border-t border-border/50"
                                  onClick={() => setActivePage("course-player")}
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                    ) : (
                                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                                    )}
                                    <span className={cn(lesson.completed && "text-muted-foreground line-through")}>
                                      {lIdx + 1}. {lesson.title}
                                    </span>
                                    {lesson.preview && (
                                      <Badge variant="outline" className="text-[10px]">Preview</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{lesson.duration}</span>
                                    {lesson.preview && (
                                      <Button size="sm" variant="ghost" className="h-6 text-xs">Preview</Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* INSTRUCTOR */}
            <TabsContent value="instructor">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-20 h-20 ring-4 ring-primary/10">
                      <AvatarImage src={instructor?.avatar} />
                      <AvatarFallback>{instructor?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold">{instructor?.name}</h3>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{instructor?.education}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <div className="font-semibold">{(instructor!.followers / 1000).toFixed(1)}K students</div>
                          <div className="text-xs text-muted-foreground">Across all courses</div>
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {course.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">{course.reviewsCount} reviews</div>
                        </div>
                        <div>
                          <div className="font-semibold">{courses.filter(c => c.instructorId === instructor!.id).length} courses</div>
                          <div className="text-xs text-muted-foreground">Published</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {instructor?.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {instructor?.skills?.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REVIEWS */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{course.rating}</div>
                      <div className="flex items-center gap-0.5 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-4 h-4", i < Math.round(course.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">{course.reviewsCount} reviews</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3">{stars}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <Progress value={stars === 5 ? 78 : stars === 4 ? 18 : stars === 3 ? 3 : stars === 2 ? 1 : 0} className="h-1.5 flex-1" />
                          <span className="text-muted-foreground w-8 text-right">
                            {stars === 5 ? "78%" : stars === 4 ? "18%" : stars === 3 ? "3%" : stars === 2 ? "1%" : "0%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseReviews.map((r) => (
                    <div key={r.id} className="pb-4 border-b last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={r.avatar} />
                          <AvatarFallback>{r.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{r.studentName}</div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <Button size="sm" variant="ghost" className="h-6">Helpful ({r.helpful})</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* SIDEBAR — Purchase card */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="overflow-hidden">
            <div className="relative">
              <img src={course.thumbnail} alt="" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                  <PlayCircle className="w-7 h-7 text-primary" />
                </button>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold">${course.price}</span>
                {course.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${course.originalPrice}
                  </span>
                )}
                {course.discount && (
                  <Badge className="bg-rose-500 text-white ml-auto">{course.discount}% off</Badge>
                )}
              </div>
              <div className="text-xs text-rose-500 mb-4">⏰ Sale ends in 2 days, 14 hours</div>

              <Button
                className="w-full h-11 mb-2"
                onClick={() => {
                  toast.success("Added to cart! 🛒");
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 mb-2"
                onClick={() => {
                  toast.success("Redirecting to checkout...");
                }}
              >
                Buy Now
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  toggleWishlist(course.id);
                  toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist 💖");
                }}
              >
                <Heart className={cn("w-4 h-4 mr-2", inWishlist && "fill-rose-500 text-rose-500")} />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>

              <div className="text-center text-xs text-muted-foreground my-3">
                30-Day Money-Back Guarantee
              </div>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="font-medium">This course includes:</div>
                {[
                  { icon: Video, label: `${course.duration} video` },
                  { icon: FileText, label: `${totalLessons} lessons` },
                  { icon: Code, label: "Coding exercises" },
                  { icon: Award, label: "Certificate" },
                  { icon: Smartphone, label: "Mobile access" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
                <Button variant="ghost" size="sm">Gift this course</Button>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                <div className="font-medium text-primary mb-1">Apply Coupon</div>
                <div className="flex gap-2">
                  <input
                    placeholder="ZEDSKILLZ50"
                    className="flex-1 px-2 py-1 text-xs border rounded"
                  />
                  <Button size="sm" className="h-7 text-xs">Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

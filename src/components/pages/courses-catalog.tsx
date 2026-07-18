"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { courses, categories, users } from "@/lib/mock-data";
import {
  Search,
  Star,
  Clock,
  Users,
  Heart,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export function CoursesCatalog() {
  const { setActivePage, wishlist, toggleWishlist } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest">("popular");

  const filtered = courses.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.tags.join(" ").toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
    if (selectedLevel !== "all" && c.difficulty !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Browse Courses"
        description={`${filtered.length} courses available · Learn from Africa's best`}
      />

      {/* Hero search bar */}
      <Card className="mb-6 overflow-hidden border-0 gradient-emerald text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-2">What do you want to learn today?</h2>
          <p className="text-white/80 text-sm mb-4">
            From coding to design, business to AI — find your path.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Try 'Python', 'design', or 'marketing'..."
              className="pl-10 h-12 bg-white text-foreground border-0"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* FILTERS */}
        <aside className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Categories</h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors",
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between",
                      selectedCategory === cat.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.coursesCount}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Difficulty</h3>
              <div className="space-y-1">
                {["all", "beginner", "intermediate", "advanced", "expert"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md capitalize transition-colors",
                      selectedLevel === lvl
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {lvl === "all" ? "All Levels" : lvl}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Price</h3>
              <div className="space-y-1">
                {["All", "Free", "Paid", "On Sale"].map((p) => (
                  <label key={p} className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    {p}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3">Language</h3>
              <div className="space-y-1">
                {["English", "Bemba", "Nyanja", "French", "Portuguese"].map((l) => (
                  <label key={l} className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    {l}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* COURSE LIST */}
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={view === "grid" ? "default" : "outline"}
                onClick={() => setView("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground ml-2">
                {filtered.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button variant="outline" size="sm" className="gap-1">
                {sortBy === "popular" ? "Most Popular" : sortBy === "rating" ? "Highest Rated" : "Newest"}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course) => {
                const instructor = users.find((u) => u.id === course.instructorId);
                const inWishlist = wishlist.includes(course.id);
                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
                    onClick={() => setActivePage("course-detail")}
                  >
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(course.id);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/95 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4",
                            inWishlist ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                          )}
                        />
                      </button>
                      <Badge className="absolute top-2 left-2 bg-background/95 text-foreground">
                        {course.category}
                      </Badge>
                      {course.discount && (
                        <Badge className="absolute bottom-2 left-2 bg-rose-500 text-white">
                          -{course.discount}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {course.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={instructor?.avatar} />
                          <AvatarFallback>{instructor?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{instructor?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{course.rating}</span>
                          <span>({course.reviewsCount})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {(course.studentsCount / 1000).toFixed(1)}k
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {course.difficulty}
                        </Badge>
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
          )}

          {/* List view */}
          {view === "list" && (
            <div className="space-y-3">
              {filtered.map((course) => {
                const instructor = users.find((u) => u.id === course.instructorId);
                const inWishlist = wishlist.includes(course.id);
                return (
                  <Card
                    key={course.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActivePage("course-detail")}
                  >
                    <div className="flex">
                      <div className="relative w-32 sm:w-48 shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        {course.discount && (
                          <Badge className="absolute top-2 left-2 bg-rose-500 text-white text-[10px]">
                            -{course.discount}%
                          </Badge>
                        )}
                      </div>
                      <CardContent className="flex-1 p-4 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Badge variant="secondary" className="text-[10px]">{course.category}</Badge>
                              <Badge variant="outline" className="text-[10px] capitalize">{course.difficulty}</Badge>
                            </div>
                            <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {course.subtitle}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(course.id);
                            }}
                            className="shrink-0"
                          >
                            <Heart
                              className={cn(
                                "w-5 h-5",
                                inWishlist ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
                              )}
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 mt-2">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-foreground">{course.rating}</span>
                            ({course.reviewsCount})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {course.studentsCount.toLocaleString()} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={instructor?.avatar} />
                              <AvatarFallback>{instructor?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{instructor?.name}</span>
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
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  No courses match your filters. Try clearing them.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

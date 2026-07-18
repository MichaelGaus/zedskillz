"use client";

import { useAppStore } from "@/lib/store";
import { forumCategories } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";

export function CommunityPage() {
  const { setActivePage } = useAppStore();

  return (
    <AppShell
      activeNav="community"
      sidebarActivePage="community"
      navLinks={[
        { label: "Home", page: "landing" },
        { label: "Explore", page: "courses" },
        { label: "Ranks", page: "leaderboard" },
        { label: "Admin", page: "admin-dashboard" },
        { label: "Community", page: "community" },
      ]}
      searchPlaceholder="Search discussions..."
      aiFabVariant="gradient"
      bottomNavItems={[
        { label: "Home", icon: "home", page: "landing" },
        { label: "Explore", icon: "explore", page: "courses" },
        { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
        { label: "Community", icon: "groups", page: "community" },
      ]}
      bottomNavActivePage="community"
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Hero row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-2">
              Community Forums
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              Engage with fellow learners, share your journey, and solve complex
              problems together in our moderated hubs.
            </p>
          </div>
          <button
            onClick={() => setActivePage("post")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl shadow-md font-title text-sm font-semibold hover:bg-primary-container transition-colors shrink-0"
          >
            <Icon name="post_add" size={18} />
            New Post
          </button>
        </div>

        {/* Forum layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories list — col-span-2 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline text-headline text-on-surface">Categories</h2>
              <button className="text-sm text-primary hover:underline">View All →</button>
            </div>

            <div className="space-y-3">
              {forumCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActivePage("post")}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {/* Icon tile */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform",
                      cat.color
                    )}
                  >
                    <Icon name={cat.icon} filled size={26} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-title text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  {/* Post count */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-on-surface-variant">{cat.postsCount} Posts</div>
                    <Icon
                      name="chevron_right"
                      size={20}
                      className="text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Recent Activity — empty state */}
            <div className="bg-surface-container border border-dashed border-outline-variant rounded-3xl p-6 min-h-[280px] flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-3">
                <Icon name="inbox" size={32} className="text-on-surface-variant" />
              </div>
              <h3 className="font-title text-sm font-semibold mb-1">No posts yet</h3>
              <p className="text-xs text-on-surface-variant mb-3 max-w-xs">
                Be the first to start a conversation in the Zedskillz community!
              </p>
              <button
                onClick={() => setActivePage("post")}
                className="text-sm text-primary font-medium hover:underline"
              >
                Start a Topic →
              </button>
            </div>

            {/* Top Members — skeleton loaders */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5">
              <h3 className="font-title text-sm font-semibold mb-4">Top Members</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-surface-container-high rounded animate-pulse" />
                      <div className="h-2.5 w-16 bg-surface-container rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

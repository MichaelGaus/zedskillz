"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { communityPost } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { AppShell } from "@/components/shared/app-shell";
import { cn } from "@/lib/utils";

export function IndividualPostView() {
  const { setActivePage } = useAppStore();
  const [upvoted, setUpvoted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [reply, setReply] = useState("");
  const upvoteCount = communityPost.stats.upvotes + (upvoted ? 1 : 0);

  return (
    <AppShell
      brand="scholarconnect"
      sidebarVariant="scholarconnect"
      sidebarActivePage="post"
      activeNav="post"
      navLinks={[
        { label: "Home", page: "landing" },
        { label: "Explore", page: "courses" },
        { label: "Ranks", page: "leaderboard" },
        { label: "Admin", page: "admin-dashboard" },
        { label: "Community", page: "community" },
      ]}
      searchPlaceholder="Search discussions..."
      showAiFab
      bottomNavItems={[
        { label: "Feed", icon: "home", page: "community" },
        { label: "Search", icon: "search", page: "courses" },
        { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
        { label: "Profile", icon: "person", page: "my-courses" },
      ]}
      bottomNavActivePage="post"
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-on-surface-variant mb-4">
          {communityPost.breadcrumbs.map((b, i) => (
            <span key={b} className="flex items-center gap-1">
              {i > 0 && <Icon name="chevron_right" size={14} />}
              <button className="hover:text-primary">{b}</button>
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ===== Main post + comments — col-span-8 ===== */}
          <div className="lg:col-span-8 space-y-4">
            {/* Main post card */}
            <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 md:p-6">
              {/* Author row */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={communityPost.author.avatar}
                  alt={communityPost.author.name}
                  className="w-11 h-11 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-title text-sm font-semibold">
                      {communityPost.author.name}
                    </span>
                    <span className="text-primary text-xs font-semibold">
                      {communityPost.author.badge}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Posted {communityPost.author.postedAt}
                  </div>
                </div>
                <button className="p-2 hover:bg-surface-container rounded-full">
                  <Icon name="more_vert" size={18} className="text-on-surface-variant" />
                </button>
              </div>

              {/* Title */}
              <h1 className="font-headline text-headline-mobile md:text-headline text-on-surface mb-3 leading-tight">
                {communityPost.title}
              </h1>

              {/* Body */}
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">
                {communityPost.body}
              </p>

              {/* Code block */}
              <div className="bg-surface-container mt-4 p-4 rounded-lg border-l-4 border-primary font-mono text-sm overflow-x-auto">
                <pre className="text-on-surface">{communityPost.code.content}</pre>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {communityPost.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-full font-medium uppercase tracking-wide",
                      tag.type === "highlight"
                        ? "bg-tertiary-fixed text-on-tertiary-fixed"
                        : "bg-secondary-container text-on-secondary-container"
                    )}
                  >
                    #{tag.label}
                  </span>
                ))}
              </div>

              {/* Action row */}
              <div className="flex items-center gap-1 mt-5 pt-4 border-t border-outline-variant/30">
                <button
                  onClick={() => setUpvoted(!upvoted)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    upvoted ? "text-primary bg-primary/5" : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  <Icon
                    name="thumb_up"
                    filled={upvoted}
                    size={16}
                    className={cn("transition-transform", upvoted && "scale-110")}
                  />
                  {upvoteCount} Upvotes
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container">
                  <Icon name="chat_bubble_outline" size={16} />
                  {communityPost.stats.replies} Replies
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-on-surface-variant hover:bg-surface-container">
                  <Icon name="share" size={16} />
                  Share
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="ml-auto p-1.5 rounded-lg hover:bg-surface-container"
                >
                  <Icon
                    name={bookmarked ? "bookmark" : "bookmark_border"}
                    filled={bookmarked}
                    size={18}
                    className={bookmarked ? "text-primary" : "text-on-surface-variant"}
                  />
                </button>
              </div>
            </article>

            {/* Comment input */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4">
              <div className="flex gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zambian%20Scholar"
                  alt="You"
                  className="w-9 h-9 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write your helpful reply..."
                    rows={3}
                    className="w-full bg-surface-container-low p-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-surface-container rounded">
                        <Icon name="image" size={18} className="text-on-surface-variant" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container rounded">
                        <Icon name="code" size={18} className="text-on-surface-variant" />
                      </button>
                    </div>
                    <button
                      onClick={() => setReply("")}
                      className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors"
                    >
                      Post Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thread section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-title text-sm font-semibold">Top Discussion</h4>
                <button className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary">
                  Sort by: Best
                  <Icon name="keyboard_arrow_down" size={16} />
                </button>
              </div>

              {/* Comment 1 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={communityPost.comments[0].author.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-title text-sm font-semibold">
                        {communityPost.comments[0].author.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-bold uppercase">
                        {communityPost.comments[0].author.badge}
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {communityPost.comments[0].postedAt}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                  {communityPost.comments[0].body}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary">
                    <Icon name="thumb_up" size={14} />
                    {communityPost.comments[0].upvotes}
                  </button>
                  <button className="text-on-surface-variant hover:text-primary">Reply</button>
                </div>

                {/* Nested comment */}
                <div className="mt-4 ml-4 pl-4 border-l-2 border-outline-variant">
                  {communityPost.comments[0].nested.map((nested) => (
                    <div key={nested.id}>
                      <div className="flex items-center gap-2 mb-2">
                        <img src={nested.author.avatar} alt="" className="w-7 h-7 rounded-full" />
                        <span className="font-title text-sm font-semibold">{nested.author.name}</span>
                        <span className="text-xs text-on-surface-variant">{nested.postedAt}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-2">{nested.body}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary">
                          <Icon name="thumb_up" size={14} />
                          {nested.upvotes}
                        </button>
                        <button className="text-on-surface-variant hover:text-primary">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tutor Summary Bubble */}
              <div className="relative bg-tertiary-container/10 border border-tertiary/20 rounded-xl p-5 ai-glow overflow-hidden">
                {/* Decorative bg icon */}
                <Icon
                  name="psychology"
                  size={120}
                  className="absolute -top-2 -right-2 text-tertiary opacity-10 pointer-events-none hover:rotate-12 transition-transform"
                />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center">
                      <Icon name="psychology" filled size={18} className="text-on-tertiary" />
                    </div>
                    <div>
                      <div className="font-title text-sm font-semibold text-tertiary">
                        AI Tutor Summary
                      </div>
                      <div className="text-[10px] text-on-surface-variant">
                        Generated from thread context
                      </div>
                    </div>
                  </div>

                  <p className="text-sm italic text-on-surface-variant leading-relaxed mb-3">
                    &quot;{communityPost.aiSummary.text}&quot;
                  </p>

                  <button className="text-sm text-tertiary font-medium hover:underline flex items-center gap-1">
                    {communityPost.aiSummary.followUp}
                    <Icon name="arrow_forward" size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Right sidebar — col-span-4 ===== */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Related Discussions */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
              <h3 className="font-title text-sm font-semibold mb-3">Related Discussions</h3>
              <div className="space-y-3">
                {communityPost.related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActivePage("post")}
                    className="block w-full text-left p-2 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
                      {r.category}
                    </div>
                    <div className="text-sm font-medium line-clamp-2 mb-1">{r.title}</div>
                    <div className="text-xs text-on-surface-variant">{r.meta}</div>
                  </button>
                ))}
              </div>
              <button className="mt-3 w-full py-2 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
                View All Discussions
              </button>
            </div>

            {/* Active Contributors */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-5">
              <h3 className="font-title text-sm font-semibold mb-3">Active Contributors</h3>
              <div className="space-y-3">
                {communityPost.contributors.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="relative">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full" />
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-surface-container-lowest",
                          c.rank === 1
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-secondary text-on-secondary"
                        )}
                      >
                        {c.rank}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-on-surface-variant">
                        {c.contributions} Contributions
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">{c.points}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Pulse — gradient card */}
            <div className="bg-gradient-to-br from-tertiary to-primary-container text-on-primary rounded-2xl p-5">
              <h3 className="font-title text-sm font-semibold mb-4 flex items-center gap-2">
                <Icon name="favorite" filled size={18} />
                Community Pulse
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-on-primary/10 backdrop-blur rounded-lg p-3">
                  <div className="font-display text-lg font-bold">
                    {communityPost.pulse.onlineNow}
                  </div>
                  <div className="text-[10px] opacity-80">Online Now</div>
                </div>
                <div className="bg-on-primary/10 backdrop-blur rounded-lg p-3">
                  <div className="font-display text-lg font-bold">
                    {communityPost.pulse.newTopics}
                  </div>
                  <div className="text-[10px] opacity-80">New Topics</div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-on-primary text-primary rounded-lg text-xs font-semibold hover:bg-on-primary/90 transition-colors">
                Invite a Friend
              </button>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

// Members Connect page — matches the community page layout with Members sidebar item active.
// Main content shows a members directory with search, filters, and member cards.

export function MembersBody() {
  return (
    <>
      {/* ===== TopAppBar ===== */}
      <header className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline shadow-sm sticky z-50">
        <div className="flex justify-between items-center px-lg py-md w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-xl">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEYHWSbBWFss50TSceaJIxWuzuiahbKQuC1SkKtCCksAznmNPkkJD6pAmPcAb23TakFxQwfnWHZyXZ1elmYxJ_BNMnViM2yrZtYrig_TLFFOOzG_3l8JUB8k2UXIq73b7Gc-gEynoPkOvkdiKZFSuMpZ4WaI45w8yWgi38qJHOduKySiSkZkAHxH-HvLrXIUY1HHcjuADWeDPDkLWH4RssMDuhoYlPS6d6rS0ZD_oBjzBKvJljMHuL3It59uKJQDBxfM8" alt="Zedskillz Hub" className="h-10 w-auto cursor-pointer" />
            <nav className="hidden lg:flex items-center gap-lg">
              <a className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Home</a>
              <a className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Courses</a>
              <a className="font-body-md text-body-md text-primary dark:text-inverse-primary font-bold border-b-2 border-primary pb-1" href="#">Community</a>
              <a className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Leaderboard</a>
              <a className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Support</a>
            </nav>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden sm:flex relative items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px]">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:ring-2 focus:ring-primary focus:border-primary w-64 transition-all" placeholder="Search members..." type="text" />
            </div>
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-surface-variant rounded-full transition-colors" title="Select Language"><span className="material-symbols-outlined">language</span></button>
              <button className="p-2 hover:bg-surface-variant rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant cursor-pointer">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUa1jux6VbUrNWVq2gfvKC7KGXzhQoc5qWVjPfukJhFBT-pF9Fbdr3eMipuG9tgoRMxoIBZwJZl5yQ9ZZ81_KwYRa3-kv4R_APrQ3K_GCg8-vAUeKO_So3g3NoQv0cKrsdKp4TDfvz6JVKgOpFAbZ4IbI1cSXd4AtDpYW58l11VETxoG_lAncKoG_J7MbpvmtExO-CZm7ZjK_mrlduoTLt0lvc9Bv5NSde-8MGvkbf5lzrKNaMOg1Bhw" alt="" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* ===== Sidebar ===== */}
        <aside className="h-[calc(100vh-64px)] w-64 fixed left-0 top-16 hidden lg:flex flex-col bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline p-md gap-sm z-40">
          <div className="flex flex-col gap-xs mb-lg">
            <div className="px-2 mb-2">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUmw2oAZE3rCcmhO4Hk-N6u9s8YewERNd1VJtFaz5l6Yo_dpMZJhFL8E_bZO8sGQTG7_qqpWDp1YNk35d5UGGu-Xgi-hlqWCt_DaSmrxNg_k_c8SFCfo_y2BPKDurdcwpQb_S28GFmZRDGe2BjoFEj8DOmSaBhvoSojaTv8vtdTRhB75KjAgq7sFYGJmw48je_FbAI_ih6Ws0Uui_XL74yLYkhXhWEZGXmeYw1CP-hl9119bsCshYl08Md5fonmxq2c8s" alt="Zedskillz Hub" className="h-14 w-auto" />
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">public</span>
              <span className="font-label-caps text-label-caps">Community</span>
            </a>
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">forum</span>
              <span className="font-label-caps text-label-caps">Feed</span>
            </a>
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">grid_view</span>
              <span className="font-label-caps text-label-caps">Categories</span>
            </a>
            {/* Members — ACTIVE */}
            <a className="flex items-center gap-md px-4 py-3 bg-secondary-container dark:bg-tertiary-container text-on-secondary-container dark:text-on-tertiary-container rounded-lg font-bold" href="#">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>group</span>
              <span className="font-label-caps text-label-caps">Members</span>
            </a>
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">bookmark</span>
              <span className="font-label-caps text-label-caps">Bookmarks</span>
            </a>
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">settings</span>
              <span className="font-label-caps text-label-caps">Settings</span>
            </a>
          </nav>
          <div className="mt-lg px-2">
            <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-sm active:scale-95 transition-transform shadow-md">
              <span className="material-symbols-outlined">add_circle</span>
              Create New Post
            </button>
          </div>
          <div className="mt-auto border-t border-outline-variant pt-md">
            <a className="flex items-center gap-md px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant/50 rounded-lg transition-colors group" href="#">
              <span className="material-symbols-outlined text-[22px] group-hover:text-primary transition-colors">help_outline</span>
              <span className="font-label-caps text-label-caps">Help Center</span>
            </a>
          </div>
        </aside>

        {/* ===== Main content ===== */}
        <main className="flex-1 lg:ml-64 p-lg lg:p-xl w-full">
          <div className="max-w-5xl mx-auto">
            {/* Hero row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
              <div>
                <h1 className="font-display-lg text-display-lg text-primary mb-xs">Members Connect</h1>
                <p className="text-on-surface-variant text-body-md max-w-lg">
                  Connect with fellow learners, mentors, and educators across Zambia. Follow, message, and collaborate with peers who share your interests.
                </p>
              </div>
              <button className="bg-primary text-on-primary px-lg py-md rounded-xl font-bold flex items-center gap-sm shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]">
                <span className="material-symbols-outlined">person_add</span>
                Invite Member
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md mb-xl">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md">
                <div className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Total Members</div>
                <div className="font-display-lg text-display-lg text-primary mt-xs">5,247</div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md">
                <div className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Online Now</div>
                <div className="font-display-lg text-display-lg text-primary mt-xs flex items-center gap-sm">
                  <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                  1,284
                </div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md">
                <div className="font-label-caps text-label-caps text-on-surface-variant opacity-70">New This Week</div>
                <div className="font-display-lg text-display-lg text-primary mt-xs">+142</div>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md">
                <div className="font-label-caps text-label-caps text-on-surface-variant opacity-70">Mentors</div>
                <div className="font-display-lg text-display-lg text-primary mt-xs">86</div>
              </div>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-sm mb-xl overflow-x-auto no-scrollbar pb-sm">
              <button className="shrink-0 px-md py-sm bg-primary text-on-primary rounded-full text-body-sm font-semibold whitespace-nowrap">All Members</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Educators</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Mentors</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Students</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Pro Contributors</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Following</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Lusaka</button>
              <button className="shrink-0 px-md py-sm bg-secondary-container text-on-secondary-container rounded-full text-body-sm font-semibold whitespace-nowrap hover:bg-secondary-container/80 transition-colors">Copperbelt</button>
            </div>

            {/* Members grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {MEMBERS.map((m) => (
                <div key={m.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg flex flex-col items-center text-center hover:shadow-lg transition-all group">
                  <div className="relative mb-md">
                    <img src={m.avatar} alt={m.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-surface-container-low group-hover:ring-primary/20 transition-all" />
                    {m.online && (
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-container-lowest" />
                    )}
                    {m.rank > 0 && (
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold border-2 border-surface-container-lowest">
                        #{m.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-xs mb-xs">
                    <h3 className="font-title-sm text-title-sm text-on-surface">{m.name}</h3>
                    {m.verified && (
                      <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                    )}
                  </div>
                  <div className="text-xs text-on-surface-variant mb-xs">{m.role}</div>
                  <div className="text-xs text-on-surface-variant mb-md line-clamp-2">{m.bio}</div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-xs justify-center mb-md">
                    {m.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-sm py-xs bg-secondary-container text-on-secondary-container rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-around w-full py-sm border-t border-outline-variant mb-md">
                    <div className="text-center">
                      <div className="font-bold text-on-surface text-body-sm">{m.followers}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">Followers</div>
                    </div>
                    <div className="w-px h-8 bg-outline-variant" />
                    <div className="text-center">
                      <div className="font-bold text-on-surface text-body-sm">{m.contributions}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">Posts</div>
                    </div>
                    <div className="w-px h-8 bg-outline-variant" />
                    <div className="text-center">
                      <div className="font-bold text-primary text-body-sm">{m.xp}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">XP</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-sm w-full">
                    <button className={`flex-1 py-sm rounded-xl font-bold text-body-sm transition-all active:scale-95 ${m.following ? "bg-secondary-container text-on-secondary-container" : "bg-primary text-on-primary hover:opacity-90"}`}>
                      {m.following ? "Following" : "Follow"}
                    </button>
                    <button className="px-sm py-sm border border-outline-variant rounded-xl hover:bg-surface-container transition-colors" title="Message">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">chat_bubble_outline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more */}
            <div className="text-center mt-xl">
              <button className="px-xl py-md bg-secondary-container text-on-secondary-container rounded-xl font-bold text-body-sm hover:bg-secondary-container/80 transition-colors inline-flex items-center gap-sm">
                Load More Members
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Sample member data — Zambian names and contexts
const AVATAR = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdad8,f5dddd,e5dedf`;

const MEMBERS = [
  {
    id: 1,
    name: "Chansa Mulenga",
    role: "Pro Contributor • Grade 12",
    bio: "ECZ exam prep enthusiast. Love Python and physics.",
    avatar: AVATAR("Chansa Mulenga"),
    online: true,
    rank: 1,
    verified: true,
    tags: ["Python", "Maths", "Lusaka"],
    followers: "1.2k",
    contributions: 89,
    xp: "12.5k",
    following: false,
  },
  {
    id: 2,
    name: "Mrs. Mutale Kapambwe",
    role: "Educator • Mathematics",
    bio: "Teacher at Lusaka Secondary. Helping students master calculus.",
    avatar: AVATAR("Mutale Kapambwe"),
    online: true,
    rank: 2,
    verified: true,
    tags: ["Educator", "Calculus", "Lusaka"],
    followers: "2.8k",
    contributions: 412,
    xp: "28.9k",
    following: true,
  },
  {
    id: 3,
    name: "C. Mwansa",
    role: "Top Scholar • Rank #1",
    bio: "Grade 12 scholar. National leaderboard champion 2024.",
    avatar: AVATAR("C Mwansa"),
    online: false,
    rank: 1,
    verified: true,
    tags: ["Top Scholar", "Kitwe", "Copperbelt"],
    followers: "3.4k",
    contributions: 156,
    xp: "12.5k",
    following: false,
  },
  {
    id: 4,
    name: "B. Lungu",
    role: "Mentor • Software Engineer",
    bio: "Full-stack dev at ZICTA. Mentoring future coders.",
    avatar: AVATAR("B Lungu"),
    online: true,
    rank: 2,
    verified: true,
    tags: ["Mentor", "React", "Node.js", "Ndola"],
    followers: "892",
    contributions: 67,
    xp: "8.4k",
    following: false,
  },
  {
    id: 5,
    name: "Mwila Banda",
    role: "Student • Grade 11",
    bio: "Learning Python and dreaming of building apps for Zambia.",
    avatar: AVATAR("Mwila Banda"),
    online: true,
    rank: 0,
    verified: false,
    tags: ["Python", "Beginner", "Ndola"],
    followers: "124",
    contributions: 32,
    xp: "1.2k",
    following: true,
  },
  {
    id: 6,
    name: "Loveness Zulu",
    role: "Pro Contributor • Data Science",
    bio: "Data analyst at Bank of Zambia. Love R and visualization.",
    avatar: AVATAR("Loveness Zulu"),
    online: false,
    rank: 0,
    verified: true,
    tags: ["Data Science", "R", "Livingstone"],
    followers: "1.8k",
    contributions: 234,
    xp: "15.2k",
    following: false,
  },
  {
    id: 7,
    name: "K. Phiri",
    role: "Top Scholar • Rank #3",
    bio: "Maths olympiad finalist. ECZ top performer 2023.",
    avatar: AVATAR("K Phiri"),
    online: true,
    rank: 3,
    verified: true,
    tags: ["Top Scholar", "Maths", "Lusaka"],
    followers: "2.1k",
    contributions: 98,
    xp: "7.9k",
    following: false,
  },
  {
    id: 8,
    name: "Jacob Soko",
    role: "Mentor • Mobile Developer",
    bio: "Flutter expert. Built 20+ apps for African markets.",
    avatar: AVATAR("Jacob Soko"),
    online: false,
    rank: 0,
    verified: true,
    tags: ["Mentor", "Flutter", "Mobile", "Lusaka"],
    followers: "567",
    contributions: 45,
    xp: "9.2k",
    following: false,
  },
  {
    id: 9,
    name: "Prof. Namwali Banda",
    role: "Educator • Data Science",
    bio: "Professor at UNZA. Author of 'Python for Zambian Schools'.",
    avatar: AVATAR("Namwali Banda"),
    online: true,
    rank: 0,
    verified: true,
    tags: ["Educator", "Python", "UNZA", "Lusaka"],
    followers: "4.2k",
    contributions: 287,
    xp: "45.6k",
    following: true,
  },
];

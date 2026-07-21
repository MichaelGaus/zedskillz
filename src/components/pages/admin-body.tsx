// AUTO-GENERATED from zedskillz_admin_dashboard_ui.txt — DO NOT EDIT MANUALLY
// Conversion: HTML body → JSX (class=→className=, void tags self-closed, style attrs converted)

export function AdminBody() {
  return (
    <>
      
      <div className="flex h-screen overflow-hidden">
      
      <aside className="hidden md:flex flex-col h-full w-72 bg-surface-container-low border-r border-outline-variant p-md space-y-sm z-50">
      <div className="flex items-center gap-sm px-md py-lg"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyRiUkqaqAvc2u_MdalN2oAXFsfqG11P8D_0FuE33cWt7_tXYn_5zbiCKOjnEQv8HLR9rkmhtB-WOtpg2NrmLkhYLd1dkaNfjUViOdSiIdXP5JwaatirlwMKSU5WSmKRh4AECIAzrCvmFO9oFqSEdge-6ZFZBvO6PRf571UslXRaUwjGeF6d75sdmdLwoJtoaRqlZAoIhbSqtloDdr-69PbT_-QTcQJOs6a_GxFrusEU7_9vcuLlo1zFQ039OuTmVyjIQ" alt="Zedskillz Logo" className="h-12 w-auto" />
      <h1 className="text-primary font-bold font-headline-md tracking-tight">Zedskillz Admin</h1></div>
      <nav className="flex-1 space-y-1">
      
      <div className="space-y-1">
      <a className="flex items-center gap-md px-md py-3 bg-primary-container text-on-primary-container font-semibold rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">dashboard</span>
      <span className="font-body-md text-body-md">Home</span>
      </a>
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">explore</span>
      <span className="font-body-md text-body-md">Explore</span>
      </a>
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">leaderboard</span>
      <span className="font-body-md text-body-md">Ranks</span>
      </a>
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">groups</span>
      <span className="font-body-md text-body-md">Community</span>
      </a></div>
      <div className="pt-lg pb-sm">
      <p className="px-md font-label-caps text-label-caps text-on-surface-variant/60">MANAGEMENT</p>
      </div>
      <div className="space-y-1">
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">school</span>
      <span className="font-body-md text-body-md">My Courses</span>
      </a>
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">psychology</span>
      <span className="font-body-md text-body-md">AI Tutor</span>
      </a>
      <a className="flex items-center gap-md px-md py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all active:translate-x-1 duration-150" href="#">
      <span className="material-symbols-outlined">library_books</span>
      <span className="font-body-md text-body-md">Resources</span>
      </a>
      </div>
      </nav>
      
      <div className="p-md bg-surface-container-high rounded-xl flex items-center gap-md">
      <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDPY_k44yYL-ZiYml3I1WmNawvyCw2YdJGFTQhClekylQ_GUGUiLNi1xsIUbrkZCLliT3TTyJexLKhJpzmx_dI247z_4UA7HXf1SFgO3QkBke2Uv1y3fHVWnjuWUnQM-X8X1HzqLwBrB3iRaTG5N7BHZZ6igPdJG8GQAgNgN3LgoIDM01kVF3qFG4A0MJpizpuc8UJ1_ahwFOpYEbe4IRkmrFn5m8UkqVD3MOqgogV8rCfw4mWPsh4AVw')"}}></div>
      <div className="flex-1 min-w-0">
      <p className="font-bold text-body-md truncate text-on-surface">Zambian Scholar</p>
      <p className="text-body-sm text-on-surface-variant truncate">Level 12 • 4500 XP</p>
      </div>
      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">settings</button>
      </div>
      </aside>
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface h-full overflow-hidden">
      
      <header className="w-full sticky top-0 z-40 bg-surface/80 backdrop-blur-md shadow-sm h-touch-target flex justify-between items-center px-container-margin">
      <div className="flex items-center gap-md">
      <button className="md:hidden material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full transition-colors active:scale-95">menu</button>
      <h2 className="font-headline-md text-headline-md text-primary tracking-tight">Admin Dashboard</h2>
      </div>
      <div className="flex items-center gap-lg">
      <div className="hidden lg:flex items-center bg-surface-container-high rounded-full px-4 py-1.5 border border-outline-variant">
      <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-body-sm w-48 text-on-surface" placeholder="Search analytics..." type="text" />
      </div>
      <div className="flex items-center gap-md"><button className="material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
                                  language
      </button>
      <button className="material-symbols-outlined p-2 hover:bg-surface-variant/50 rounded-full transition-colors relative">
                                  notifications
                                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
      </button>
      <div className="w-9 h-9 rounded-full bg-cover bg-center border border-outline-variant" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcOwY5S3gT0TvH3JUfj0hIvLnNTQ_av4UWlUCCTtil9cWD9bJOV4TngwAPhYujZFpx7WgNyKp8C0joIyQ765Ahw0zVSpFOrGyR9Ry71D6TFI9B2H8ASoUIDiSFU8YqI5mn2MmIMbUAPOFmtf_c9pLDTvUq87mQA_Y6dcTnfP2ZK_yccLk2VI4Po_zIajUbvYckJD584_LPMRxezBBntxCba1jO9Sdcb5VNu-zw81RmyieI4V3BX_E1ig')"}}></div>
      </div>
      </div>
      </header>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-md md:p-lg space-y-lg">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
      
      <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-base">
      <span className="material-symbols-outlined p-2 bg-primary-container/20 text-primary rounded-lg">group</span>
      <span className="text-xs font-bold text-green-600 flex items-center bg-green-100 px-2 py-0.5 rounded-full">
      <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                                  </span>
      </div>
      <h3 className="text-on-surface-variant font-label-caps text-label-caps opacity-70">TOTAL USERS</h3>
      <p className="text-display-lg font-display-lg text-on-surface mt-xs">24,512</p>
      </div>
      
      <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-base">
      <span className="material-symbols-outlined p-2 bg-tertiary-container/10 text-on-tertiary-container rounded-lg">payments</span>
      <span className="text-xs font-bold text-green-600 flex items-center bg-green-100 px-2 py-0.5 rounded-full">
      <span className="material-symbols-outlined text-[14px]">trending_up</span> 8.4%
                                  </span>
      </div>
      <h3 className="text-on-surface-variant font-label-caps text-label-caps opacity-70">REVENUE (ZMK)</h3>
      <p className="text-display-lg font-display-lg text-on-surface mt-xs">85.2k</p>
      </div>
      
      <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-base">
      <span className="material-symbols-outlined p-2 bg-secondary-container/50 text-on-secondary-container rounded-lg">local_library</span>
      <span className="text-xs font-bold text-primary flex items-center bg-primary-fixed px-2 py-0.5 rounded-full">
      <span className="material-symbols-outlined text-[14px]">remove</span> 0%
                                  </span>
      </div>
      <h3 className="text-on-surface-variant font-label-caps text-label-caps opacity-70">ACTIVE COURSES</h3>
      <p className="text-display-lg font-display-lg text-on-surface mt-xs">156</p>
      </div>
      
      <div className="glass-card p-md rounded-xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-base">
      <span className="material-symbols-outlined p-2 bg-primary-container text-on-primary-container rounded-lg" style={{ fontVariationSettings: '"FILL" 1' }}>psychology</span>
      <span className="text-xs font-bold text-green-600 flex items-center bg-green-100 px-2 py-0.5 rounded-full">
      <span className="material-symbols-outlined text-[14px]">trending_up</span> 24%
                                  </span>
      </div>
      <h3 className="text-on-surface-variant font-label-caps text-label-caps opacity-70">AI INTERACTIONS</h3>
      <p className="text-display-lg font-display-lg text-on-surface mt-xs">1.2M</p>
      </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
      
      <div className="lg:col-span-2 glass-card rounded-xl p-lg shadow-sm flex flex-col h-[480px]">
      <div className="flex justify-between items-center mb-lg">
      <div>
      <h3 className="font-headline-md text-headline-md text-on-surface">User Growth Analytics</h3>
      <p className="text-body-sm text-on-surface-variant">Real-time registration tracking across regions</p>
      </div>
      <div className="flex gap-xs bg-surface-container rounded-lg p-1">
      <button className="px-3 py-1 text-xs font-bold bg-white rounded-md shadow-sm">WEEK</button>
      <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">MONTH</button>
      <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-surface-variant/50 rounded-md transition-colors">YEAR</button>
      </div>
      </div>
      <div className="flex-1 relative mt-md">
      
      <div className="absolute inset-0 flex items-end justify-between px-md pb-xl">
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "40%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1.2k</div>
      </div>
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "55%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1.8k</div>
      </div>
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "45%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">1.5k</div>
      </div>
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "70%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">2.4k</div>
      </div>
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "85%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.1k</div>
      </div>
      <div className="w-12 bg-primary-container text-on-primary-container rounded-t-lg relative group transition-all shadow-lg" style={{height: "95%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">3.8k</div>
      </div>
      <div className="w-12 bg-primary-container/20 rounded-t-lg relative group transition-all hover:bg-primary-container/40" style={{height: "60%"}}>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">2.1k</div>
      </div>
      </div>
      
      <div className="absolute inset-0 border-b border-l border-outline-variant flex flex-col justify-between py-xs pointer-events-none">
      <div className="w-full border-t border-outline-variant/30 border-dashed"></div>
      <div className="w-full border-t border-outline-variant/30 border-dashed"></div>
      <div className="w-full border-t border-outline-variant/30 border-dashed"></div>
      <div className="w-full border-t border-outline-variant/30 border-dashed"></div>
      <div className="w-full border-t border-outline-variant/30 border-dashed"></div>
      </div>
      </div>
      <div className="flex justify-between mt-sm px-md text-label-caps font-label-caps text-on-surface-variant/60">
      <span className="">MON</span><span className="">TUE</span><span className="">WED</span><span className="">THU</span><span className="">FRI</span><span className="text-primary font-bold">SAT</span><span className="">SUN</span>
      </div>
      </div>
      
      <div className="glass-card rounded-xl p-lg shadow-sm flex flex-col h-[480px]">
      <div className="flex justify-between items-center mb-lg">
      <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h3>
      <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">refresh</button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-md pr-xs">
      
      <div className="flex gap-md group cursor-pointer">
      <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>person_add</span>
      </div>
      <div className="w-0.5 flex-1 bg-outline-variant mt-sm"></div>
      </div>
      <div className="pb-md">
      <p className="text-body-md font-semibold text-on-surface">New Student Enrollment</p>
      <p className="text-body-sm text-on-surface-variant">Chanda Musonda joined 'Intro to AI'.</p>
      <span className="text-[12px] font-medium text-on-surface-variant/50">2 mins ago</span>
      </div>
      </div>
      
      <div className="flex gap-md group cursor-pointer">
      <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
      <span className="material-symbols-outlined text-on-tertiary-container">workspace_premium</span>
      </div>
      <div className="w-0.5 flex-1 bg-outline-variant mt-sm"></div>
      </div>
      <div className="pb-md">
      <p className="text-body-md font-semibold text-on-surface">Course Completed</p>
      <p className="text-body-sm text-on-surface-variant">Loveness Zulu earned 'Digital Literacy' badge.</p>
      <span className="text-[12px] font-medium text-on-surface-variant/50">15 mins ago</span>
      </div>
      </div>
      
      <div className="flex gap-md group cursor-pointer">
      <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
      <span className="material-symbols-outlined text-on-primary-container">psychology</span>
      </div>
      <div className="w-0.5 flex-1 bg-outline-variant mt-sm"></div>
      </div>
      <div className="pb-md">
      <p className="text-body-md font-semibold text-on-surface">AI Interaction Peak</p>
      <p className="text-body-sm text-on-surface-variant">AI Tutor handled 500+ queries in 10 mins.</p>
      <span className="text-[12px] font-medium text-on-surface-variant/50">42 mins ago</span>
      </div>
      </div>
      
      <div className="flex gap-md group cursor-pointer">
      <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
      <span className="material-symbols-outlined text-error">report</span>
      </div>
      </div>
      <div className="">
      <p className="text-body-md font-semibold text-on-surface">System Alert</p>
      <p className="text-body-sm text-on-surface-variant">High latency detected in Lusaka Server Node.</p>
      <span className="text-[12px] font-medium text-on-surface-variant/50">1 hour ago</span>
      </div>
      </div>
      </div>
      <button className="w-full py-md mt-md text-primary font-bold text-body-sm border-t border-outline-variant hover:bg-surface-container transition-colors">
                                  VIEW ALL ACTIVITY
                              </button>
      </div>
      </div>
      
      </div>
      </main>
      </div>
      
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface/90 backdrop-blur-lg shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center h-16 pb-safe">
      <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
      <span className="material-symbols-outlined">home</span>
      <span className="font-label-caps text-label-caps">Home</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
      <span className="material-symbols-outlined">explore</span>
      <span className="font-label-caps text-label-caps">Explore</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
      <span className="material-symbols-outlined">leaderboard</span>
      <span className="font-label-caps text-label-caps">Ranks</span>
      </a>
      <a className="flex flex-col items-center justify-center text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform text-primary" href="#"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUXCw-tnC1Xz_cE3KlgB4tzqZcYIt9sY0T1l2GDKC-D53C9J3RMJREa_LVNp5Im5apNaQQoOh1pg8bunusWtDtEyyO8dTfJgpZERq-w5v6RUWenK5qgOdykhI0-pmaVMlo8dgDu9AZT2964nif7_rRx-AP-0IluyPgV-6-0uoe1hfUYT6e3ZPi7uv-dtG1SKTKkde4xRqR9MLVBG_1AQAlwmtysalCC-ZmTC7owq5qGn2ozG8p7qbUUVPiGbSfM747Aw0" alt="Zedskillz Logo" className="h-9 w-auto mb-1" />
      <span className="font-label-caps text-label-caps">Admin</span></a>
      </nav>
    </>
  );
}

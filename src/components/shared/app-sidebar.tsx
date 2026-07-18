"use client";

import { useAppStore } from "@/lib/store";
import { currentUser, sidebarNav } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  variant?: "default" | "scholarconnect";
  activePage?: string;
  showProfile?: boolean;
}

/**
 * NavigationDrawer — left sidebar with logo, profile card, nav groups, footer.
 * Variants:
 * - default: standard Zedskillz layout
 * - scholarconnect: ScholarConnect branding with tertiary-colored brand
 */
export function AppSidebar({ variant = "default", activePage, showProfile = true }: AppSidebarProps) {
  const { activePage: storePage, setActivePage } = useAppStore();
  const current = activePage ?? storePage;

  const nav = variant === "scholarconnect"
    ? {
        primary: [
          { label: "Dashboard", icon: "dashboard", page: "scholarconnect" },
          { label: "Community", icon: "groups", page: "post" },
          { label: "Study Partners", icon: "person_search", page: "scholarconnect" },
          { label: "AI Tutor", icon: "psychology", page: "ai-tutor" },
          { label: "Resources", icon: "library_books", page: "resources" },
        ],
        secondary: [
          { label: "Settings", icon: "settings", page: "settings" },
          { label: "Help", icon: "help", page: "help" },
        ],
      }
    : sidebarNav;

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-surface-container-low border-r border-outline-variant h-screen sticky top-0 z-30">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-outline-variant shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Icon name="school" filled size={22} className="text-on-primary" />
        </div>
        <div className="ml-2">
          {variant === "scholarconnect" ? (
            <>
              <div className="font-display text-base font-bold text-tertiary scale-125 origin-left leading-none">
                Zambian Scholar
              </div>
              <div className="font-title text-xs text-secondary mt-0.5">Academic Excellence</div>
            </>
          ) : (
            <>
              <div className="font-display text-base font-bold text-primary leading-none">
                Zedskillz Hub
              </div>
              <div className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant mt-0.5">
                AI Learning Platform
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile card */}
      {showProfile && (
        <div className="p-3">
          <div className="bg-surface-container-high rounded-xl p-3 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-title text-sm font-semibold text-on-surface truncate">
                {variant === "scholarconnect" ? "Zambian Scholar" : currentUser.name}
              </div>
              <div className="text-xs text-on-surface-variant">
                Level {currentUser.level} • {currentUser.xp.toLocaleString()} XP
              </div>
            </div>
            <button
              onClick={() => setActivePage("settings")}
              className="p-1.5 hover:bg-surface-container rounded-lg"
            >
              <Icon name="settings" size={18} className="text-on-surface-variant" />
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {nav.primary.map((item) => {
          const active = current === item.page;
          return (
            <button
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all active:translate-x-1 duration-150",
                active
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <Icon
                name={item.icon}
                filled={active}
                size={22}
                className={active ? "text-primary" : ""}
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Management divider — default variant only */}
        {variant === "default" && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Management
              </span>
            </div>
            {nav.management.map((item) => {
              const active = current === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.page)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all active:translate-x-1 duration-150",
                    active
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  <Icon
                    name={item.icon}
                    filled={active}
                    size={22}
                    className={active ? "text-primary" : ""}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </>
        )}

        <div className="pt-4 pb-1 px-3">
          <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">
            Account
          </span>
        </div>
        {nav.secondary.map((item) => {
          const active = current === item.page;
          return (
            <button
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all active:translate-x-1 duration-150",
                active
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <Icon name={item.icon} filled={active} size={22} className={active ? "text-primary" : ""} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div className="p-3 border-t border-outline-variant shrink-0">
        {variant === "scholarconnect" ? (
          <button
            onClick={() => setActivePage("ai-tutor")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md hover:bg-primary-container transition-colors"
          >
            <Icon name="psychology" filled size={18} />
            Ask AI Tutor
          </button>
        ) : (
          <div className="text-[10px] text-on-surface-variant opacity-60 text-center">
            © 2024 Zedskillz Hub Zambia.
            <br />
            Empowering through AI.
          </div>
        )}
      </div>
    </aside>
  );
}

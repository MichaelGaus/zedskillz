"use client";

import { useAppStore } from "@/lib/store";
import { currentUser, sidebarNav } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  variant?: "default" | "scholarconnect" | "community";
  activePage?: string;
  showProfile?: boolean;
  children?: React.ReactNode;
  /** True if the sidebar should be positioned below a sticky header */
  hasStickyHeader?: boolean;
}

/**
 * NavigationDrawer — left sidebar with logo, profile card, nav groups, footer.
 * Variants:
 * - default: standard Zedskillz layout
 * - scholarconnect: ScholarConnect branding with tertiary-colored brand
 * - community: Community/Members pages with customized nav items
 */
export function AppSidebar({
  variant = "default",
  activePage,
  showProfile = true,
  children,
  hasStickyHeader = false,
}: AppSidebarProps) {
  const { activePage: storePage, setActivePage } = useAppStore();
  const current = activePage ?? storePage;

  const getNav = () => {
    if (variant === "scholarconnect") {
      return {
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
      };
    }
    if (variant === "community") {
      return {
        primary: [
          { label: "Community", icon: "public", page: "community" },
          { label: "Feed", icon: "forum", page: "community" },
          { label: "Categories", icon: "grid_view", page: "community" },
          { label: "Members", icon: "group", page: "members" },
          { label: "Bookmarks", icon: "bookmark", page: "community" },
          { label: "Settings", icon: "settings", page: "settings" },
        ],
        secondary: [],
      };
    }
    return sidebarNav;
  };

  const nav = getNav();

  const topClass = hasStickyHeader
    ? "top-16 h-[calc(100vh-64px)]"
    : "top-0 h-full";

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-72 fixed left-0 bg-surface-container-low border-r border-outline-variant p-md space-y-sm z-40",
        topClass
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-sm px-md py-lg shrink-0">
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
        <div className="px-md">
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
      <nav className="flex-1 overflow-y-auto space-y-1">
        {nav.primary.map((item) => {
          const active = current === item.page;
          return (
            <button
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className={cn(
                "w-full flex items-center gap-md px-md py-3 rounded-lg font-body-md transition-all active:translate-x-1 duration-150",
                active
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-variant"
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
            <div className="pt-4 pb-1 px-md">
              <span className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Management
              </span>
            </div>
            {nav.management?.map((item) => {
              const active = current === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.page)}
                  className={cn(
                    "w-full flex items-center gap-md px-md py-3 rounded-lg font-body-md transition-all active:translate-x-1 duration-150",
                    active
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface-variant hover:bg-surface-variant"
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

        {/* Secondary items */}
        {nav.secondary.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-md">
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
                    "w-full flex items-center gap-md px-md py-3 rounded-lg font-body-md transition-all active:translate-x-1 duration-150",
                    active
                      ? "bg-secondary-container text-on-secondary-container font-semibold"
                      : "text-on-surface-variant hover:bg-surface-variant"
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
      </nav>

      {/* Custom content from pages (Create Post button, etc.) */}
      {children && (
        <div className="shrink-0 space-y-2">
          {children}
        </div>
      )}

      {/* Sidebar footer */}
      <div className="border-t border-outline-variant pt-4 shrink-0">
        {variant === "scholarconnect" ? (
          <button
            onClick={() => setActivePage("ai-tutor")}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md hover:bg-primary-container transition-colors"
          >
            <Icon name="psychology" filled size={18} />
            Ask AI Tutor
          </button>
        ) : variant !== "community" ? (
          <div className="text-[10px] text-on-surface-variant opacity-60 text-center pb-2">
            © 2024 Zedskillz Hub Zambia.
            <br />
            Empowering through AI.
          </div>
        ) : null}
      </div>
    </aside>
  );
}

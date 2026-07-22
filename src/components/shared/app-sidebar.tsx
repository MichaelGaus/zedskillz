"use client";

import { useAppStore } from "@/lib/store";
import { currentUser, sidebarNav } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AppSidebarProps {
  variant?: "default" | "scholarconnect" | "community";
  activePage?: string;
  showProfile?: boolean;
  children?: React.ReactNode;
}

/**
 * NavigationDrawer — left sidebar with logo, profile card, nav groups, footer.
 * Supports expanded (full) and collapsed (icon-only) modes via the store.
 * When collapsed, hovering over the sidebar temporarily expands it (VSCode-style).
 *
 * Always starts below the GlobalTopbar (top-16) to avoid overlap.
 *
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
}: AppSidebarProps) {
  const { activePage: storePage, setActivePage, sidebarExpanded } = useAppStore();
  const current = activePage ?? storePage;
  const [hovered, setHovered] = useState(false);

  // Collapsed + hover = temporarily expanded; hamburger toggle is persistent
  const isOpen = sidebarExpanded || hovered;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] bg-surface-container-low border-r border-outline-variant p-md z-40 transition-all duration-300 ease-in-out",
        isOpen ? "w-72" : "w-[68px]"
      )}
    >
      {/* Brand — collapsed: icon only; expanded: icon + text */}
      <div className={cn(
        "flex items-center shrink-0 overflow-hidden",
        isOpen ? "gap-sm px-md py-lg" : "justify-center py-lg"
      )}>
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Icon name="school" filled size={22} className="text-on-primary" />
        </div>
        <div className={cn(
          "transition-opacity duration-300 overflow-hidden",
          isOpen ? "opacity-100 ml-2 w-auto" : "opacity-0 w-0 ml-0"
        )}>
          {variant === "scholarconnect" ? (
            <>
              <div className="font-display text-base font-bold text-tertiary scale-125 origin-left leading-none whitespace-nowrap">
                Zambian Scholar
              </div>
              <div className="font-title text-xs text-secondary mt-0.5 whitespace-nowrap">Academic Excellence</div>
            </>
          ) : (
            <>
              <div className="font-display text-base font-bold text-primary leading-none whitespace-nowrap">
                Zedskillz Hub
              </div>
              <div className="font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant mt-0.5 whitespace-nowrap">
                AI Learning Platform
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile card — shown when open */}
      {showProfile && isOpen && (
        <div className="px-md">
          <div className="bg-surface-container-high rounded-xl p-3 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="flex-1 min-w-0 transition-opacity duration-300">
              <div className="font-title text-sm font-semibold text-on-surface truncate">
                {variant === "scholarconnect" ? "Zambian Scholar" : currentUser.name}
              </div>
              <div className="text-xs text-on-surface-variant">
                Level {currentUser.level} • {currentUser.xp.toLocaleString()} XP
              </div>
            </div>
            <button
              onClick={() => setActivePage("settings")}
              className="p-1.5 hover:bg-surface-container rounded-lg shrink-0"
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
              title={!isOpen ? item.label : undefined}
              className={cn(
                "w-full flex items-center rounded-lg transition-all active:translate-x-1 duration-150",
                isOpen ? "gap-md px-md py-3" : "justify-center py-3 px-0",
                active
                  ? "bg-secondary-container text-on-secondary-container font-semibold"
                  : "text-on-surface-variant hover:bg-surface-variant"
              )}
            >
              <Icon
                name={item.icon}
                filled={active}
                size={22}
                className={cn(
                  "shrink-0",
                  active ? "text-primary" : ""
                )}
              />
              <span className={cn(
                "font-body-md transition-all duration-300 overflow-hidden",
                isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
              )}>{item.label}</span>
            </button>
          );
        })}

        {/* Management divider — default variant only, hidden when collapsed */}
        {variant === "default" && isOpen && (
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

        {/* Secondary items — hidden when collapsed */}
        {nav.secondary.length > 0 && isOpen && (
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

      {/* Custom content from pages — hidden when collapsed */}
      {children && isOpen && (
        <div className="shrink-0 space-y-2">
          {children}
        </div>
      )}

      {/* Sidebar footer — hidden when collapsed */}
      {isOpen && (
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
      )}
    </aside>
  );
}

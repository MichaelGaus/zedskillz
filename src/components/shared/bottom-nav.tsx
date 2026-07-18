"use client";

import { useAppStore } from "@/lib/store";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activePage?: string;
  items?: { label: string; icon: string; page: string; elevated?: boolean }[];
}

const defaultItems = [
  { label: "Home", icon: "home", page: "landing" },
  { label: "Explore", icon: "explore", page: "courses" },
  { label: "AI Tutor", icon: "psychology", page: "ai-tutor", elevated: true },
  { label: "Ranks", icon: "leaderboard", page: "leaderboard" },
  { label: "Profile", icon: "account_circle", page: "my-courses" },
];

/**
 * Mobile bottom navigation bar.
 * Center item is elevated in a primary-container pill.
 */
export function BottomNav({ activePage, items = defaultItems }: BottomNavProps) {
  const { activePage: storePage, setActivePage } = useAppStore();
  const current = activePage ?? storePage;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-surface/95 backdrop-blur-lg border-t border-outline-variant flex items-center justify-around px-2 pb-safe">
      {items.map((item) => {
        const active = current === item.page;
        if (item.elevated) {
          return (
            <button
              key={item.label}
              onClick={() => setActivePage(item.page)}
              className="flex flex-col items-center -mt-6"
            >
              <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shadow-lg border-4 border-surface">
                <Icon name={item.icon} filled={active} size={26} className="text-on-primary-container" />
              </div>
              <span className="text-[10px] mt-1 font-medium text-on-surface-variant">
                {item.label}
              </span>
            </button>
          );
        }
        return (
          <button
            key={item.label}
            onClick={() => setActivePage(item.page)}
            className="flex flex-col items-center gap-1 px-3 py-2"
          >
            <Icon
              name={item.icon}
              filled={active}
              size={22}
              className={cn(active ? "text-primary" : "text-on-surface-variant")}
            />
            <span
              className={cn(
                "text-[10px] font-medium",
                active ? "text-primary" : "text-on-surface-variant"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

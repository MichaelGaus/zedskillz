"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Trophy,
  Settings,
  GraduationCap,
  Shield,
  UserCircle,
  Brain,
  Video,
  Sparkles,
  Heart,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { currentUser } from "@/lib/mock-data";

interface NavItem {
  label: string;
  icon: LucideIcon;
  page: string;
  roles?: string[]; // restrict to roles; if omitted, visible to all
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, page: "student-dashboard", roles: ["student"] },
  { label: "Dashboard", icon: LayoutDashboard, page: "instructor-dashboard", roles: ["instructor"] },
  { label: "Dashboard", icon: LayoutDashboard, page: "admin-dashboard", roles: ["admin", "super_admin", "school", "organization"] },
  { label: "Parent Portal", icon: Heart, page: "parent-portal", roles: ["parent"] },

  { label: "Browse Courses", icon: BookOpen, page: "courses" },
  { label: "AI Tutor", icon: Brain, page: "ai-tutor", roles: ["student", "instructor"] },
  { label: "Live Classes", icon: Video, page: "live-classes", roles: ["student", "instructor"] },
  { label: "Social Feed", icon: Users, page: "social", roles: ["student", "instructor", "parent"] },
  { label: "Messages", icon: MessageSquare, page: "messaging" },
  { label: "Leaderboard", icon: Trophy, page: "leaderboard", roles: ["student"] },
  { label: "Wallet", icon: Wallet, page: "settings", roles: ["student", "instructor"] },

  { label: "My Profile", icon: UserCircle, page: "profile" },
  { label: "Settings", icon: Settings, page: "settings" },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { currentRole, activePage, setActivePage, currentUser } = useAppStore();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(currentRole)
  );

  return (
    <div className="h-full bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-lg gradient-emerald flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg leading-none">Zedskillz</div>
          <div className="text-[10px] text-sidebar-foreground/60 leading-none mt-0.5">
            Learn. Teach. Grow.
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full ring-2 ring-primary/40"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-sidebar-foreground/60 capitalize">
              {currentRole.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.page;
          return (
            <button
              key={item.label + item.page}
              onClick={() => {
                setActivePage(item.page);
                onNavigate?.();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="rounded-lg gradient-emerald p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <div className="text-sm font-semibold">Go Premium</div>
          </div>
          <p className="text-xs text-white/90 mb-3">
            Unlock unlimited courses, AI tutor 24/7, and certificates.
          </p>
          <button className="w-full text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-md">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

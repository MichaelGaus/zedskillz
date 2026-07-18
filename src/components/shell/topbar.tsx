"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  MessageCircle,
  GraduationCap,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notifications } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "instructor", label: "Instructor" },
  { value: "admin", label: "Admin" },
  { value: "parent", label: "Parent" },
  { value: "school", label: "School" },
  { value: "organization", label: "Organization" },
  { value: "super_admin", label: "Super Admin" },
  { value: "guest", label: "Guest" },
] as const;

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const {
    currentUser,
    currentRole,
    setRole,
    theme,
    toggleTheme,
    setActivePage,
    unreadNotifications,
    markAllNotificationsRead,
  } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 h-16 bg-background/95 backdrop-blur border-b flex items-center px-4 lg:px-6 gap-3">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-lg"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo on mobile */}
      <button
        onClick={() => setActivePage("landing")}
        className="lg:hidden flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold">Zedskillz</span>
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setActivePage("courses")}
          placeholder="Search courses, instructors, communities..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border border-transparent focus:border-primary focus:bg-background outline-none transition-all"
        />
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Role switcher (demo) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border hover:bg-muted transition-colors">
              <Badge variant="secondary" className="capitalize text-[10px] px-1.5 py-0">
                {currentRole.replace("_", " ")}
              </Badge>
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Demo: switch role
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roleOptions.map((r) => (
              <DropdownMenuItem
                key={r.value}
                onClick={() => setRole(r.value)}
                className={currentRole === r.value ? "bg-accent" : ""}
              >
                {r.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* Messages */}
        <button
          onClick={() => setActivePage("messaging")}
          className="p-2 hover:bg-muted rounded-lg transition-colors relative"
          aria-label="Messages"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="font-semibold text-sm">Notifications</div>
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 border-b last:border-0 hover:bg-muted/50 ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {n.message}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-3 text-sm text-center text-primary hover:bg-muted/50">
              View all notifications
            </button>
          </PopoverContent>
        </Popover>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 pl-2 hover:bg-muted rounded-lg transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {currentUser.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActivePage("profile")}>
              <UserCircle className="w-4 h-4 mr-2" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActivePage("settings")}>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActivePage("landing")}>
              <LogOut className="w-4 h-4 mr-2" />
              Back to Home
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

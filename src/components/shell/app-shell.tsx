"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Footer } from "./footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top bar */}
      <Topbar onMenuClick={() => setMobileOpen((v) => !v)} />

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-[64px] h-[calc(100vh-64px)]">
          <Sidebar />
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <aside
              className="absolute left-0 top-0 h-full w-72 bg-sidebar text-sidebar-foreground shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

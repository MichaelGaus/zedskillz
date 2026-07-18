"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { BottomNav } from "@/components/shared/bottom-nav";
import { AIFab } from "@/components/shared/ai-fab";
import { Footer } from "@/components/shared/footer";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  navLinks?: { label: string; page: string }[];
  activeNav?: string;
  sidebarVariant?: "default" | "scholarconnect";
  sidebarActivePage?: string;
  showSidebar?: boolean;
  showAiFab?: boolean;
  aiFabVariant?: "solid" | "gradient" | "pulse";
  footerVariant?: "default" | "rounded";
  showFooter?: boolean;
  brand?: "zedskillz" | "scholarconnect";
  bottomNavItems?: { label: string; icon: string; page: string; elevated?: boolean }[];
  bottomNavActivePage?: string;
}

/**
 * AppShell — standard authenticated page layout.
 * Sidebar (desktop) + Header (top) + Content + Footer + BottomNav (mobile) + AIFab + AIOverlay.
 */
export function AppShell({
  children,
  title,
  searchPlaceholder,
  showSearch = true,
  navLinks,
  activeNav,
  sidebarVariant = "default",
  sidebarActivePage,
  showSidebar = true,
  showAiFab = true,
  aiFabVariant = "solid",
  footerVariant = "default",
  showFooter = true,
  brand = "zedskillz",
  bottomNavItems,
  bottomNavActivePage,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {showSidebar && <AppSidebar variant={sidebarVariant} activePage={sidebarActivePage} />}

      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title={title}
          brand={brand}
          searchPlaceholder={searchPlaceholder}
          showSearch={showSearch}
          navLinks={navLinks}
          activeNav={activeNav}
        />

        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {children}
          {showFooter && <Footer variant={footerVariant} />}
        </main>
      </div>

      {showAiFab && <AIFab variant={aiFabVariant} />}
      {bottomNavItems && <BottomNav items={bottomNavItems} activePage={bottomNavActivePage} />}
    </div>
  );
}

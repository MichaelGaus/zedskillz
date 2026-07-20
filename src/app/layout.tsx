import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zedskillz Hub | AI-Powered Learning for Zambia",
  description:
    "Access world-class education tailored to local Zambian contexts. Learn in your preferred language, track your progress on national leaderboards, and get instant help from our AI mentor.",
  keywords: [
    "Zedskillz",
    "Zambia",
    "AI tutor",
    "online learning",
    "Bemba",
    "Nyanja",
    "Tonga",
    "ECZ",
    "Lusaka",
    "Copperbelt",
  ],
  authors: [{ name: "Zedskillz Hub Zambia" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Zedskillz Hub | AI-Powered Learning for Zambia",
    description:
      "Master new skills with your personal Zambian AI tutor. Learn in Bemba, Nyanja & English.",
    siteName: "Zedskillz Hub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical inline CSS — prevents FOUC of duplicate headers before stylesheets load */}
        <style dangerouslySetInnerHTML={{ __html: `[data-global-topbar-active] header{display:none!important}` }} />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${hankenGrotesk.variable} font-sans antialiased bg-background text-on-surface`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}

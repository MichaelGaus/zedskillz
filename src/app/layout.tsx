import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zedskillz — AI-Powered Learning Platform for Africa",
  description:
    "Learn skills that matter. Teach what you know. Powered by AI tutors that speak your language. Built for African learners, schools, and organizations.",
  keywords: [
    "Zedskillz",
    "online learning",
    "AI tutor",
    "Africa",
    "Zambia",
    "courses",
    "LMS",
  ],
  authors: [{ name: "Zedskillz Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Zedskillz — AI-Powered Learning Platform for Africa",
    description:
      "Learn skills that matter. Teach what you know. Powered by AI tutors.",
    siteName: "Zedskillz",
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
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </body>
    </html>
  );
}

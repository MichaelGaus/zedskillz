"use client";

import { GraduationCap, Github, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg gradient-emerald flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Zedskillz</div>
                <div className="text-[10px] text-muted-foreground">
                  Learn. Teach. Grow.
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI-powered learning platform built for African learners, schools,
              and organizations. Master skills that matter with AI tutors that
              speak your language.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Facebook, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Learn",
              links: ["Browse Courses", "Categories", "Live Classes", "AI Tutor", "Free Courses"],
            },
            {
              title: "Teach",
              links: ["Become Instructor", "Instructor Dashboard", "Resources", "Earnings", "Community"],
            },
            {
              title: "Platform",
              links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Refund Policy"],
            },
          ].map((section) => (
            <div key={section.title}>
              <div className="font-semibold text-sm mb-3">{section.title}</div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>
            © 2026 Zedskillz. Built with ❤️ in Lusaka, Zambia.
          </div>
          <div className="flex items-center gap-4">
            <span>🇿🇲 English (Zambia)</span>
            <span>USD ($)</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

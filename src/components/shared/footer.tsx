"use client";

import { footerLinks } from "@/lib/mock-data";
import { Icon } from "@/components/shared/icon";

/**
 * Standard footer used across all pages.
 * Logo + copyright + 4 links + social icons.
 */
export function Footer({ variant = "default", className = "" }: { variant?: "default" | "rounded"; className?: string }) {
  return (
    <footer
      className={`${variant === "rounded"
        ? "mt-8 rounded-t-3xl w-full py-8 bg-surface-container-highest border-t border-outline-variant"
        : "w-full py-8 bg-surface-container-highest border-t border-outline-variant"
      } ${className}`.trim()}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Icon name="school" filled size={18} className="text-on-primary" />
          </div>
          <div className="text-sm">
            © 2024 Zedskillz Hub Zambia. Empowering through AI.
          </div>
        </div>

        <div className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
              aria-label="Facebook"
            >
              <Icon name="public" size={16} />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
              aria-label="Website"
            >
              <Icon name="language" size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

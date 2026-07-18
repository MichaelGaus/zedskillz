"use client";

import { cn } from "@/lib/utils";

interface IconProps {
  name: string; // Material Symbols name, e.g. "psychology", "school"
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
}

/**
 * Material Symbols (rounded variant) icon wrapper.
 *
 * Usage:
 *   <Icon name="psychology" filled />
 *   <Icon name="school" className="text-primary" size={24} />
 */
export function Icon({
  name,
  filled = false,
  className,
  style,
  size = 24,
  weight = 400,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-rounded", filled && "filled", className)}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        lineHeight: 1,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

"use client";

import { cn } from "@/lib/utils";

export type CosmicBadgeVariant = "purple" | "teal" | "coral" | "amber" | "gold";

const variantClass: Record<CosmicBadgeVariant, string> = {
  purple: "bg-[color-mix(in_oklab,var(--accent-purple)_18%,transparent)] text-accent-purple border-accent-purple/25",
  teal: "bg-[color-mix(in_oklab,var(--accent-teal)_18%,transparent)] text-accent-teal border-accent-teal/25",
  coral: "bg-[color-mix(in_oklab,var(--accent-coral)_18%,transparent)] text-accent-coral border-accent-coral/25",
  amber: "bg-[color-mix(in_oklab,var(--accent-amber)_18%,transparent)] text-accent-amber border-accent-amber/25",
  gold: "bg-accent-gold/15 text-accent-gold border-accent-gold/30",
};

interface CosmicBadgeProps {
  children: React.ReactNode;
  variant?: CosmicBadgeVariant;
  className?: string;
}

export function CosmicBadge({ children, variant = "purple", className }: CosmicBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

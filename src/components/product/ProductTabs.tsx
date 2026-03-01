"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ImageIcon, BarChart3, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "actions", label: "Actions", icon: Zap },
  { href: "creatives", label: "Creatives", icon: ImageIcon },
  { href: "performance", label: "Performance", icon: BarChart3 },
  { href: "intelligence", label: "Intelligence", icon: Brain },
];

export function ProductTabs({ productId }: { productId: string }) {
  const pathname = usePathname();
  const base = `/products/${productId}`;

  return (
    <div className="max-w-6xl mx-auto px-6 flex gap-1">
      {tabs.map(({ href, label, icon: Icon }) => {
        const path = `${base}/${href}`;
        const active = pathname === path || pathname.startsWith(path + "/");
        return (
          <Link
            key={href}
            href={path}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              active
                ? "border-gro-purple text-gro-purple"
                : "border-transparent text-zinc-500 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

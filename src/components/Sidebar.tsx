"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, FolderKanban, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/products", label: "Products", icon: Package },
  { href: "/winner-ads", label: "Winner ads", icon: ImageIcon },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

export function Sidebar() {
  const pathname = usePathname();
  const isProducts = pathname.startsWith("/products");

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-gro-border flex flex-col">
      <div className="p-4 border-b border-gro-border">
        <Link href="/products" className="text-xl font-semibold text-white tracking-tight">
          AdTool
        </Link>
        <p className="text-xs text-zinc-500 mt-0.5">P Personal</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/products" ? isProducts : pathname === href || (href !== "/products" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-gro-purple/20 text-gro-purple" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gro-border space-y-3">
        <div className="gro-panel p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Actions</span>
            <span className="text-xs font-medium text-white">—</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">AI compute for generation</p>
          <button type="button" className="mt-2 w-full gro-btn-primary text-xs py-1.5">
            Get more Actions
          </button>
        </div>
        <div>
          <h3 className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gro-purple" />
            What&apos;s new
          </h3>
          <ul className="mt-2 text-xs text-zinc-500 space-y-1">
            <li>AdTool v1.0 — Product hub & Ad Library flow</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

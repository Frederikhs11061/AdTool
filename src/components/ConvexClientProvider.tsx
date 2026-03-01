"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return <>{children}</>;
  }
  const convex = new ConvexReactClient(url);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}

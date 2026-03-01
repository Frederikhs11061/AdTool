"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";

export function RunResearchButton({
  productId,
  hasIntelligence,
}: {
  productId: string;
  hasIntelligence: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const runResearch = useAction(api.actions.runResearch);

  async function handleRun() {
    setLoading(true);
    try {
      await runResearch({ productId: productId as Id<"products"> });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRun}
      disabled={loading}
      className="gro-btn-primary flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : null}
      {hasIntelligence ? "Refine research" : "Run research"}
    </button>
  );
}

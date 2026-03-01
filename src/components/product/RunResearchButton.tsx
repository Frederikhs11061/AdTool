"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  async function handleRun() {
    setLoading(true);
    try {
      const res = await fetch("/api/intelligence/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Research failed");
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

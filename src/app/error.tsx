"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const isConvexError =
    error.message?.includes("Convex") ||
    error.message?.includes("NEXT_PUBLIC_CONVEX_URL") ||
    error.message?.includes("No address");

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-white mb-2">Der opstod en fejl</h1>
        <p className="text-zinc-400 text-sm mb-4">
          {isConvexError
            ? "Convex er ikke konfigureret. Kør npx convex dev og sæt NEXT_PUBLIC_CONVEX_URL i .env.local."
            : "Se server-logs for flere detaljer."}
        </p>
        {error.digest && (
          <p className="text-zinc-500 text-xs mb-4">Digest: {error.digest}</p>
        )}
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-gro-purple text-white text-sm font-medium hover:bg-gro-purple-dark"
        >
          Prøv igen
        </button>
      </div>
    </div>
  );
}

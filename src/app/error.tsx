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
      <div className="max-w-lg text-center">
        <h1 className="text-xl font-semibold text-white mb-2">Der opstod en fejl</h1>
        <p className="text-zinc-400 text-sm mb-2">
          {isConvexError
            ? "Convex er ikke koblet på. Som på screenshots: Gå til Vercel → Settings → Environment Variables → tilføj NEXT_PUBLIC_CONVEX_URL med værdien fra Convex Dashboard (Health → Cloud URL). Lav derefter Redeploy."
            : "Se server-logs for flere detaljer."}
        </p>
        {isConvexError && (
          <p className="text-green-400 text-xs font-mono mb-4 break-all">
            https://accomplished-cricket-635.eu-west-1.convex.cloud
          </p>
        )}
        {error.digest && (
          <p className="text-zinc-500 text-xs mb-2">Digest: {error.digest}</p>
        )}
        {error.message && (
          <details className="text-left mb-4">
            <summary className="text-zinc-500 text-xs cursor-pointer hover:text-zinc-400">Vis fejlbesked</summary>
            <pre className="mt-2 p-3 bg-zinc-900 rounded text-xs text-red-300 overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
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

"use client";

export const CONVEX_CLOUD_URL = "https://accomplished-cricket-635.eu-west-1.convex.cloud";

export function ConvexSetupBanner() {
  const url = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_CONVEX_URL : null;
  if (url) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
      <h2 className="font-semibold text-amber-200 mb-2">Convex er ikke koblet på</h2>
      <p className="text-sm text-zinc-400 mb-3">
        Sådan sætter du det op (som på screenshots):
      </p>
      <ol className="text-sm text-zinc-300 list-decimal list-inside space-y-1 mb-3">
        <li>Åbn dit Vercel-projekt → <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
        <li>Klik <strong>Add Environment Variable</strong>.</li>
        <li><strong>Name:</strong> <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_CONVEX_URL</code></li>
        <li><strong>Value:</strong> kopiér URL’en nedenfor.</li>
        <li>Vælg environment (fx Production) og gem.</li>
        <li>Lav <strong>Redeploy</strong> under Deployments, så ændringen træder i kraft.</li>
      </ol>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-zinc-900 border border-gro-border rounded px-3 py-2 text-xs text-green-400 break-all">
          {CONVEX_CLOUD_URL}
        </code>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(CONVEX_CLOUD_URL)}
          className="shrink-0 px-3 py-2 rounded-lg bg-gro-purple text-white text-sm"
        >
          Kopiér
        </button>
      </div>
    </div>
  );
}

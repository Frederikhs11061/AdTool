export const CONVEX_CLOUD_URL = "https://accomplished-cricket-635.eu-west-1.convex.cloud";

export function ConvexSetupRequired() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="gro-card p-6 border-amber-500/30 bg-amber-500/5">
        <h1 className="text-xl font-semibold text-white mb-2">Convex skal kobles på</h1>
        <p className="text-zinc-400 text-sm mb-4">
          Som på de screenshots: tilføj miljøvariablen i Vercel, så AdTool kan forbinde til Convex.
        </p>
        <ol className="text-sm text-zinc-300 list-decimal list-inside space-y-2 mb-4">
          <li>Åbn <strong>Vercel</strong> → dit AdTool-projekt → <strong>Settings</strong> → <strong>Environment Variables</strong>.</li>
          <li>Klik <strong>&quot;Add Environment Variable&quot;</strong>.</li>
          <li><strong>Name:</strong> <code className="bg-zinc-800 px-1.5 py-0.5 rounded">NEXT_PUBLIC_CONVEX_URL</code></li>
          <li><strong>Value:</strong> indsæt denne URL (fra Convex Dashboard → Health → Cloud URL):</li>
        </ol>
        <div className="bg-zinc-900 border border-gro-border rounded-lg p-3 mb-4">
          <code className="text-green-400 text-sm break-all">{CONVEX_CLOUD_URL}</code>
        </div>
        <p className="text-zinc-500 text-xs">
          Vælg environment (fx Production), gem, og lav derefter <strong>Redeploy</strong> under Deployments.
        </p>
      </div>
    </div>
  );
}

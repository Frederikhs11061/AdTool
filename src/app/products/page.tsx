import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "@/components/products/ProductGrid";
import { AddProductByLink } from "@/components/products/AddProductByLink";
import { CreateProductButton } from "@/components/products/CreateProductButton";

const CONVEX_CLOUD_URL = "https://accomplished-cricket-635.eu-west-1.convex.cloud";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="gro-card p-6 border-amber-500/30 bg-amber-500/5">
          <h1 className="text-xl font-semibold text-white mb-2">Convex skal kobles på</h1>
          <p className="text-zinc-400 text-sm mb-4">
            Tilføj miljøvariablen i Vercel, så AdTool kan forbinde til Convex.
          </p>
          <ol className="text-sm text-zinc-300 list-decimal list-inside space-y-2 mb-4">
            <li>Vercel → projekt → Settings → Environment Variables</li>
            <li>Name: <code className="bg-zinc-800 px-1.5 py-0.5 rounded">NEXT_PUBLIC_CONVEX_URL</code></li>
            <li>Value: Convex Dashboard → Health → Cloud URL</li>
          </ol>
          <div className="bg-zinc-900 border border-gro-border rounded-lg p-3 mb-4">
            <code className="text-green-400 text-sm break-all">{CONVEX_CLOUD_URL}</code>
          </div>
          <p className="text-zinc-500 text-xs">Redeploy efter du har gemt variablen.</p>
        </div>
      </div>
    );
  }

  let products;
  try {
    products = await fetchQuery(api.products.list, {});
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="gro-card p-6 border-red-500/30 bg-red-500/5">
          <h1 className="text-lg font-semibold text-white mb-2">Kunne ikke hente data fra Convex</h1>
          <p className="text-zinc-400 text-sm mb-2">Fejlbesked:</p>
          <pre className="p-3 bg-zinc-900 rounded text-sm text-red-300 overflow-auto mb-4">
            {message}
          </pre>
          <p className="text-zinc-500 text-xs">
            Tjek at NEXT_PUBLIC_CONVEX_URL på Vercel peger på din Convex deployment (Health → Cloud URL), og at du har kørt &quot;npx convex dev&quot; så schema og functions er pushet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AddProductByLink />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Products</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-gro-border">
            <button type="button" className="px-3 py-2 text-sm bg-zinc-800 text-white">
              My Products
            </button>
            <button type="button" className="px-3 py-2 text-sm text-zinc-500 hover:text-white">
              Shared with me
            </button>
          </div>
          <button type="button" className="p-2 rounded-lg border border-gro-border text-zinc-400 hover:text-white" title="Grid">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/></svg>
          </button>
          <button type="button" className="p-2 rounded-lg border border-gro-border text-zinc-400 hover:text-white" title="List">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </button>
          <input
            type="search"
            placeholder="Search"
            className="gro-input w-40 text-sm"
          />
          <CreateProductButton />
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}

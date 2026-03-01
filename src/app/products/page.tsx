import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CreateProductButton } from "@/components/products/CreateProductButton";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { creatives: true } },
    },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
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

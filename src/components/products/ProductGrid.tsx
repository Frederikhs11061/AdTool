import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";

type ProductRow = {
  id: string;
  name: string;
  imageUrl?: string | null;
  status: string;
  updatedAt: number;
  _count: { creatives: number };
};

export function ProductGrid({ products }: { products: ProductRow[] }) {
  if (products.length === 0) {
    return (
      <div className="gro-card p-12 text-center">
        <p className="text-zinc-500 mb-4">No products yet. Create your first product to start generating ads.</p>
        <p className="text-sm text-zinc-600">Click &quot;Create product&quot; above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}/actions`}
          className="gro-card overflow-hidden block hover:border-gro-purple/50 transition-colors"
        >
          <div className="aspect-square bg-zinc-800 relative">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="font-medium text-white truncate">{product.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-zinc-500">{product.status}</span>
              <span className="text-xs text-zinc-600">Edited {formatRelativeTime(new Date(product.updatedAt))}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

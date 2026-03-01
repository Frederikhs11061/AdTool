import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductTabs } from "@/components/product/ProductTabs";

export const dynamic = "force-dynamic";

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-gro-border bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="text-sm text-zinc-500 mb-4">
            <Link href="/products" className="hover:text-white">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-white truncate max-w-md inline-block">{product.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt="" width={56} height={56} className="object-contain" />
              ) : (
                <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white truncate max-w-xl">{product.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-gro-purple">
                  <span className="w-1.5 h-1.5 rounded-full bg-gro-purple animate-pulse" />
                  Research Brain Learning
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Ad Brain Needs setup — Connect ad account
                </span>
              </div>
            </div>
          </div>
        </div>
        <ProductTabs productId={product.id} />
      </div>
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">{children}</div>
    </div>
  );
}

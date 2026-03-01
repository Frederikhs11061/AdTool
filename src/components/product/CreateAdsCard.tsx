"use client";

import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";

export function CreateAdsCard({ productId }: { productId: string }) {
  return (
    <Link
      href={`/products/${productId}/create`}
      className="gro-card p-6 flex items-center justify-between group hover:border-gro-purple/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gro-purple flex items-center justify-center shrink-0">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Create Ads</h2>
          <p className="text-sm text-zinc-500">
            Create new ad images for this product. Vælg From Ad Library → indsæt ad-link → variationer eller nye koncepter.
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-gro-purple" />
    </Link>
  );
}

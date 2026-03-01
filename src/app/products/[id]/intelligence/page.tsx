import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { IntelligencePanel } from "@/components/product/IntelligencePanel";
import { RunResearchButton } from "@/components/product/RunResearchButton";
import type { Id } from "@/convex/_generated/dataModel";

export const dynamic = "force-dynamic";

export default async function ProductIntelligencePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const productId = id as Id<"products">;
  const [product, intelligence] = await Promise.all([
    fetchQuery(api.products.get, { id: productId }),
    fetchQuery(api.intelligence.get, { productId }),
  ]);

  if (!product) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Product Intelligence</h2>
        <RunResearchButton productId={id} hasIntelligence={!!intelligence} />
      </div>
      <IntelligencePanel product={product} intelligence={intelligence} />
    </div>
  );
}

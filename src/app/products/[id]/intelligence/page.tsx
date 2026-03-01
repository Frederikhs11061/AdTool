import { prisma } from "@/lib/db";
import { IntelligencePanel } from "@/components/product/IntelligencePanel";
import { RunResearchButton } from "@/components/product/RunResearchButton";

export const dynamic = "force-dynamic";

export default async function ProductIntelligencePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [product, intelligence] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.productIntelligence.findUnique({ where: { productId: id } }),
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

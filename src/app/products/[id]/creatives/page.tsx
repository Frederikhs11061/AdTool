import { prisma } from "@/lib/db";
import { CreateAdsCard } from "@/components/product/CreateAdsCard";
import { CreativeSetGrid } from "@/components/product/CreativeSetGrid";
import { CreativeSetDetail } from "@/components/product/CreativeSetDetail";

export const dynamic = "force-dynamic";

export default async function ProductCreativesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { set?: string };
}) {
  const { id } = params;
  const { set: setId } = searchParams;

  const [product, sets] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.creativeSet.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      include: {
        creatives: { orderBy: { sortOrder: "asc" } },
        _count: { select: { creatives: true } },
      },
    }),
  ]);

  if (!product) return null;

  if (setId) {
    const set = sets.find((s) => s.id === setId);
    if (set) {
      return (
        <div className="space-y-6">
          <CreateAdsCard productId={id} />
          <CreativeSetDetail productId={id} creativeSet={set} />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      <CreateAdsCard productId={id} />
      <CreativeSetGrid productId={id} sets={sets} />
    </div>
  );
}

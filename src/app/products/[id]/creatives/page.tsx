import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { CreateAdsCard } from "@/components/product/CreateAdsCard";
import { CreativeSetGrid } from "@/components/product/CreativeSetGrid";
import { CreativeSetDetail } from "@/components/product/CreativeSetDetail";
import type { Id } from "@/convex/_generated/dataModel";

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
  const productId = id as Id<"products">;

  const [product, sets] = await Promise.all([
    fetchQuery(api.products.get, { id: productId }),
    fetchQuery(api.creativeSets.list, { productId }),
  ]);

  if (!product) return null;

  if (setId) {
    const set = sets.find((s: { id: string; _id?: string }) => s.id === setId || s._id === setId);
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

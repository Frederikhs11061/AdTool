import Link from "next/link";
import { prisma } from "@/lib/db";
import { CreateAdsCard } from "@/components/product/CreateAdsCard";
import { formatRelativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductActionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const actions = await prisma.adAction.findMany({
    where: { productId: id },
    orderBy: { createdAt: "desc" },
    include: {
      creativeSet: {
        include: {
          creatives: { orderBy: { sortOrder: "asc" }, take: 3 },
          _count: { select: { creatives: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <CreateAdsCard productId={id} />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="search"
            placeholder="Search actions..."
            className="gro-input w-56 text-sm"
          />
          <select className="gro-input text-sm w-32">
            <option>All types</option>
          </select>
        </div>
        <ul className="space-y-3">
          {actions.map((action) => (
            <li key={action.id}>
              <Link
                href={`/products/${id}/creatives?set=${action.creativeSet?.id ?? ""}`}
                className="gro-card p-4 flex items-center gap-4 block hover:border-gro-purple/50 transition-colors"
              >
                <div className="flex gap-1 shrink-0">
                  {action.creativeSet?.creatives?.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="w-16 h-16 rounded bg-zinc-800 bg-cover bg-center"
                      style={{ backgroundImage: c.imageUrl ? `url(${c.imageUrl})` : undefined }}
                    />
                  ))}
                  {(!action.creativeSet?.creatives?.length || action.creativeSet.creatives.length === 0) && (
                    <div className="w-16 h-16 rounded bg-zinc-800 flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white">
                    {action.creativeSet
                      ? `${action.creativeSet._count?.creatives ?? 0} creatives generated`
                      : "Generating..."}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {action.adType === "variations"
                      ? "Generated creative variations from research"
                      : "Generated ad creatives"}
                  </p>
                </div>
                <span className="text-xs text-zinc-500 shrink-0">
                  {formatRelativeTime(action.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/utils";

type Creative = { id: string; imageUrl: string };
type SetWithCreatives = {
  id: string;
  creatives: Creative[];
  _count: { creatives: number };
  createdAt: number;
};

export function CreativeSetGrid({
  productId,
  sets,
}: {
  productId: string;
  sets: SetWithCreatives[];
}) {
  if (sets.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        No creatives yet. Click &quot;Create Ads&quot; and complete the flow to generate your first set.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-4">Generated sets</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sets.map((set) => (
          <Link
            key={set.id}
            href={`/products/${productId}/creatives?set=${set.id}`}
            className="gro-card overflow-hidden block hover:border-gro-purple/50 transition-colors"
          >
            <div className="grid grid-cols-3 gap-1 p-2 bg-zinc-900/50">
              {set.creatives.slice(0, 9).map((c) => (
                <div
                  key={c.id}
                  className="aspect-square relative bg-zinc-800 rounded overflow-hidden"
                >
                  <Image
                    src={c.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
              ))}
            </div>
            <div className="p-3">
              <p className="text-xs text-zinc-500">
                {set._count.creatives} creatives · {formatRelativeTime(new Date(set.createdAt))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

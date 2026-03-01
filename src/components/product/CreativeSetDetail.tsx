"use client";

import Link from "next/link";
import Image from "next/image";
import { Shuffle, Lightbulb, Users } from "lucide-react";

type SetWithCreatives = {
  audience?: string | null;
  angle?: string | null;
  concepts?: string | null;
  creatives: { id: string; imageUrl: string; copy?: string | null }[];
};

export function CreativeSetDetail({
  productId,
  creativeSet,
}: {
  productId: string;
  creativeSet: SetWithCreatives;
}) {
  return (
    <div className="space-y-6">
      <Link
        href={`/products/${productId}/creatives`}
        className="text-sm text-zinc-500 hover:text-white"
      >
        ← Back to creatives
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-80 shrink-0 space-y-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Generated just now</p>
          {creativeSet.audience && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">AUDIENCE</p>
              <p className="text-sm text-white">{creativeSet.audience}</p>
            </div>
          )}
          {creativeSet.angle && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">ANGLE</p>
              <p className="text-sm text-white">{creativeSet.angle}</p>
            </div>
          )}
          {creativeSet.concepts && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">CONCEPTS</p>
              <p className="text-sm text-white">{creativeSet.concepts}</p>
            </div>
          )}
          <p className="text-xs text-gro-purple pt-4">HOVER TO REMIX</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gro-border text-sm text-zinc-400 hover:text-white hover:border-gro-purple/50"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle angles
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gro-border text-sm text-zinc-400 hover:text-white hover:border-gro-purple/50"
            >
              <Lightbulb className="w-4 h-4" />
              New concepts
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gro-border text-sm text-zinc-400 hover:text-white hover:border-gro-purple/50"
            >
              <Users className="w-4 h-4" />
              Switch audience
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-3 gap-3">
            {creativeSet.creatives.map((c) => (
              <div
                key={c.id}
                className="gro-card overflow-hidden aspect-square relative group"
              >
                <Image
                  src={c.imageUrl}
                  alt={c.copy ?? "Creative"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 280px"
                />
                {c.copy && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs text-white truncate">{c.copy}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

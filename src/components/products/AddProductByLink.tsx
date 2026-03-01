"use client";

import { CreateProductButton } from "./CreateProductButton";

/**
 * Prominent section: paste product link → get product interface → Create Ad → From Ad Library → variations or new concepts.
 */
export function AddProductByLink() {
  return (
    <div className="gro-card p-6 mb-8 border-gro-purple/20 bg-gro-purple/5">
      <h2 className="text-lg font-semibold text-white mb-1">Tilføj produkt med link</h2>
      <p className="text-sm text-zinc-400 mb-4">
        Indsæt link til produktets side. Du kommer til produktets interface, hvor du kan klikke{" "}
        <strong className="text-zinc-300">Create Ad</strong> → vælge{" "}
        <strong className="text-zinc-300">From Ad Library</strong> → indsætte ad-link → vælge{" "}
        <strong className="text-zinc-300">variationer</strong> eller <strong className="text-zinc-300">nye koncepter</strong> og generere ads.
      </p>
      <CreateProductButton />
    </div>
  );
}

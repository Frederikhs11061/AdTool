"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, X } from "lucide-react";

export function CreateProductButton() {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url?.trim()) return;
    setLoading(true);
    try {
      const id = await createProduct({
        name: name.trim() || "Nyt produkt",
        url: url.trim(),
      });
      setOpen(false);
      setName("");
      setUrl("");
      router.push(`/products/${id}/actions`);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="gro-btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl border border-gro-border w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gro-border">
              <h2 className="text-lg font-semibold text-white">Indsæt produktlink</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="product-url" className="block text-sm font-medium text-zinc-300 mb-1">
                  Product URL (link til produktets side) *
                </label>
                <input
                  id="product-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://din-shop.dk/produkt/..."
                  className="gro-input w-full"
                  required
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Du kommer til produktets interface → Create Ad → From Ad Library → indsæt ad-link → variationer eller nye koncepter.
                </p>
              </div>
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-zinc-300 mb-1">
                  Produktnavn (valgfri)
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="fx DeluxeCare CarryCare"
                  className="gro-input w-full"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gro-border text-zinc-400 hover:text-white"
                >
                  Annuller
                </button>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="flex-1 gro-btn-primary disabled:opacity-50"
                >
                  {loading ? "Opretter…" : "Gå til produkt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

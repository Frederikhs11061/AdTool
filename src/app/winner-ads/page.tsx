"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Plus, Trash2, Upload } from "lucide-react";

export default function WinnerAdsPage() {
  const list = useQuery(api.winnerAds.list, { limit: 200 });
  const addOne = useMutation(api.winnerAds.add);
  const addBulk = useMutation(api.winnerAds.addBulk);
  const remove = useMutation(api.winnerAds.remove);

  const [imageUrl, setImageUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [adding, setAdding] = useState(false);
  const [bulking, setBulking] = useState(false);

  async function handleAddOne(e: React.FormEvent) {
    e.preventDefault();
    if (!imageUrl.trim() || !headline.trim()) return;
    setAdding(true);
    try {
      await addOne({
        imageUrl: imageUrl.trim(),
        headline: headline.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
      });
      setImageUrl("");
      setHeadline("");
      setSourceUrl("");
    } finally {
      setAdding(false);
    }
  }

  async function handleBulkImport() {
    const lines = bulkText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const ads: { imageUrl: string; headline: string }[] = [];
    for (const line of lines) {
      const [url, ...rest] = line.split(/\t|,/).map((s) => s.trim());
      if (url) ads.push({ imageUrl: url, headline: rest.join(" ").trim() || "Winner ad" });
    }
    if (!ads.length) return;
    setBulking(true);
    try {
      await addBulk({ ads });
      setBulkText("");
    } finally {
      setBulking(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-2">Winner ads</h1>
      <p className="text-zinc-400 text-sm mb-4">
        Reference-billeder systemet trækker på ved generering (Claude + billedgen). Kun billeder – video ignoreres. Fra fx Foreplay: højreklik på billede → Kopiér billedadresse, indsæt her med en kort headline. Flere ads = bedre træk på databasen.
      </p>
      <details className="mb-6 text-sm">
        <summary className="text-zinc-500 cursor-pointer hover:text-zinc-400">Foreplay-board links (åbn og kopiér billed-URLs)</summary>
        <ul className="mt-2 flex flex-wrap gap-2">
          {[
            "https://app.foreplay.co/share/boards/mbixVNkjcgpY5cn5vq5t",
            "https://app.foreplay.co/share/boards/0DcPlG9RPJCxg22SX7ez",
            "https://app.foreplay.co/share/boards/IwM3KvNDwN8Mru39p82h",
            "https://app.foreplay.co/share/boards/eIsVspsRHIkyS6OMNUbs",
            "https://app.foreplay.co/share/boards/BlwGiNKc1eRZSb9fA7TX",
            "https://app.foreplay.co/share/boards/qHGPtMNtiYmz8n46vR01",
            "https://app.foreplay.co/share/boards/O7zLaKXESbO56nTVfOWZ",
            "https://app.foreplay.co/share/boards/X4ATebDYkOceElLOdSFL",
            "https://app.foreplay.co/share/boards/3nOQc8e98iXoXrPbTo5O",
          ].map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-gro-purple hover:underline truncate max-w-[280px] inline-block">
                {url.replace("https://app.foreplay.co/share/boards/", "")}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="gro-card p-5">
          <h2 className="font-medium text-white mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tilføj én winner ad
          </h2>
          <form onSubmit={handleAddOne} className="space-y-3">
            <input
              type="url"
              placeholder="Billed-URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="gro-input w-full"
              required
            />
            <input
              type="text"
              placeholder="Headline / kort beskrivelse"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="gro-input w-full"
              required
            />
            <input
              type="url"
              placeholder="Kilde-URL (valgfri, fx Foreplay-board)"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="gro-input w-full"
            />
            <button type="submit" disabled={adding} className="gro-btn-primary w-full py-2 disabled:opacity-50">
              {adding ? "Tilføjer…" : "Tilføj"}
            </button>
          </form>
        </div>

        <div className="gro-card p-5">
          <h2 className="font-medium text-white mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Bulk-import
          </h2>
          <p className="text-xs text-zinc-500 mb-2">
            Én linje per ad: <code className="bg-zinc-800 px-1 rounded">billedURL</code> tab eller komma <code className="bg-zinc-800 px-1 rounded">headline</code>
          </p>
          <textarea
            placeholder={"https://eksempel.dk/billede1.jpg\tHeadline 1\nhttps://eksempel.dk/billede2.jpg\tHeadline 2"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="gro-input w-full min-h-[120px] resize-y font-mono text-sm"
            rows={5}
          />
          <button
            type="button"
            onClick={handleBulkImport}
            disabled={bulking || !bulkText.trim()}
            className="gro-btn-primary w-full py-2 mt-2 disabled:opacity-50"
          >
            {bulking ? "Importerer…" : "Importer linjer"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-medium text-white mb-3">
          I databasen ({list?.length ?? 0})
        </h2>
        {!list?.length ? (
          <div className="gro-card p-8 text-center text-zinc-500">
            Ingen winner ads endnu. Tilføj billed-URL + headline ovenfor, eller importer fra Foreplay/andre kilder (kopiér billed-URLs og headlines).
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map((ad) => (
              <div
                key={ad.id}
                className="gro-card overflow-hidden group"
              >
                <div className="aspect-square bg-zinc-800 relative">
                  <img
                    src={ad.imageUrl}
                    alt={ad.headline}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => remove({ id: ad.id })}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-zinc-400 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Slet"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="p-2 text-xs text-zinc-300 truncate" title={ad.headline}>
                  {ad.headline}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

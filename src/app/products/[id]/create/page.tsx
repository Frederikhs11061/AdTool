"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { X, Telescope, ClipboardList, Megaphone, Globe, Check } from "lucide-react";
import { FORMATS, LANGUAGES } from "@/lib/utils";

type Step = "start" | "source" | "paste" | "type" | "settings";

const STEPS: { id: Step; label: string; sublabel?: string }[] = [
  { id: "source", label: "Source", sublabel: "Choose ad source" },
  { id: "paste", label: "Select Ad", sublabel: "" },
  { id: "type", label: "Ad Type", sublabel: "Variations or New Ads" },
  { id: "settings", label: "Settings", sublabel: "" },
];

export default function CreateAdsPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;
  const [step, setStep] = useState<Step>("start");
  const [adLibraryUrl, setAdLibraryUrl] = useState("");
  const [adType, setAdType] = useState<"variations" | "new_ads" | null>(null);
  const [language, setLanguage] = useState("da");
  const [variations, setVariations] = useState(9);
  const [format, setFormat] = useState("1080x1080");
  const [customInstructions, setCustomInstructions] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analyzed, setAnalyzed] = useState<{ angle: string; hook: string; audience?: string; concept?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const analyzeAd = useAction(api.actions.analyzeAd);
  const generateAds = useAction(api.actions.generateAds);

  const handleFromAdLibrary = () => {
    setStep("source");
  };

  const handleSourceMetaLibrary = () => {
    setStep("paste");
  };

  const handleLookup = async () => {
    if (!adLibraryUrl.trim() || !productId) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeAd({ productId: productId as Id<"products">, adLibraryUrl: adLibraryUrl.trim() });
      setAnalyzed({
        angle: result.analyzed.angle,
        hook: result.analyzed.hook,
        audience: (result.analyzed as { audience?: string }).audience,
        concept: (result.analyzed as { concept?: string }).concept,
      });
      setStep("type");
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Kunne ikke analysere ad URL");
      setAnalyzed(null);
      setStep("type");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAdType = (type: "variations" | "new_ads") => {
    setAdType(type);
    setStep("settings");
  };

  const handleGenerate = async () => {
    if (!productId || !adType) return;
    setGenerating(true);
    setError(null);
    try {
      const { creativeSetId } = await generateAds({
        productId: productId as Id<"products">,
        adLibraryUrl: adLibraryUrl.trim() || undefined,
        adType,
        language,
        variations,
        format,
        customInstructions: customInstructions.slice(0, 500) || undefined,
      });
      router.push(`/products/${productId}/creatives?set=${creativeSetId}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Kunne ikke generere ads");
    } finally {
      setGenerating(false);
    }
  };

  if (!productId) return <div className="p-6">Loading…</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-2xl border border-gro-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gro-border">
          <h2 className="text-lg font-semibold text-white">
            {step === "start" ? "Create with AI" : "Create Ads"}
          </h2>
          <Link
            href={`/products/${productId}/actions`}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Link>
        </div>

        {step === "start" && (
          <div className="p-8">
            <p className="text-zinc-400 mb-6">How would you like to get started?</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="gro-card p-6 text-left hover:border-gro-purple/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <Telescope className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-white">From Recommendations</h3>
                <p className="text-sm text-zinc-500 mt-1">Create from AI recommendations</p>
              </button>
              <button
                type="button"
                className="gro-card p-6 text-left hover:border-gro-purple/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-white">From Scratch</h3>
                <p className="text-sm text-zinc-500 mt-1">Create from scratch with full control</p>
              </button>
              <button
                type="button"
                onClick={handleFromAdLibrary}
                className="gro-card p-6 text-left hover:border-gro-purple/50 transition-colors border-gro-purple/50"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center mb-4">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-white flex items-center gap-2">
                  From Ad <span className="text-xs bg-gro-purple px-1.5 py-0.5 rounded">Beta</span>
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Create new ads from existing ads</p>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-4 mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}
        {(step === "source" || step === "paste" || step === "type" || step === "settings") && (
          <>
            <div className="px-6 pt-4 flex gap-6 border-b border-gro-border">
              {STEPS.map((s, i) => {
                const stepOrder: Step[] = ["source", "paste", "type", "settings"];
                const currentIndex = stepOrder.indexOf(step);
                const thisIndex = stepOrder.indexOf(s.id);
                const done = thisIndex < currentIndex;
                const current = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-2 pb-4">
                    <span
                      className={
                        done
                          ? "text-gro-purple"
                          : current
                            ? "text-gro-purple font-medium"
                            : "text-zinc-500"
                      }
                    >
                      {i + 1} {s.label}
                    </span>
                    {done && <Check className="w-4 h-4 text-gro-purple" />}
                    {s.sublabel && current && (
                      <span className="text-xs text-zinc-500">{s.sublabel}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-1 overflow-auto p-6">
              {step === "source" && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Select Ad Source</h3>
                  <p className="text-zinc-500 mb-6">Choose where to pull your ad from</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="gro-card p-5 border-gro-border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">f</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">From your META ad account</h4>
                          <span className="text-xs text-zinc-500">Beta</span>
                        </div>
                        <span className="ml-auto text-xs bg-gro-purple/20 text-gro-purple px-2 py-1 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 mb-4">
                        Recreate your best-performing ads based on real spend and ROAS data.
                      </p>
                      <button type="button" className="gro-btn-primary text-sm">
                        Connect Meta Account
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleSourceMetaLibrary}
                      className="gro-card p-5 text-left border-gro-purple/50 hover:border-gro-purple transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">From Meta Ads Library</h4>
                          <span className="text-xs text-zinc-500">Beta</span>
                        </div>
                        <span className="ml-auto w-5 h-5 rounded-full border-2 border-gro-purple flex items-center justify-center">
                          <Check className="w-3 h-3 text-gro-purple" />
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">
                        Paste any public ad URL, to analyze and generate a new ad from it.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {step === "paste" && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Paste Ad URL</h3>
                  <p className="text-zinc-500 mb-4">
                    Enter a Meta Ads Library URL to analyze and use as inspiration.
                  </p>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Meta Ads Library URL or Ad ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={adLibraryUrl}
                      onChange={(e) => setAdLibraryUrl(e.target.value)}
                      placeholder="https://www.facebook.com/ads/library/?id=..."
                      className="gro-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleLookup}
                      disabled={analyzing}
                      className="gro-btn-primary shrink-0"
                    >
                      {analyzing ? "Analysing…" : "Lookup"}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Example: https://www.facebook.com/ads/library/?id=123456789 or just the ad ID
                  </p>
                  {analyzed && (
                    <div className="mt-4 p-3 rounded-lg bg-gro-purple/10 border border-gro-purple/30 text-sm">
                      <span className="text-zinc-400">Analyseret: </span>
                      <span className="text-white font-medium">{analyzed.angle}</span>
                      {analyzed.hook && analyzed.hook !== analyzed.angle && (
                        <>
                          <span className="text-zinc-500 mx-2">|</span>
                          <span className="text-zinc-300">{analyzed.hook}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === "type" && (
                <div className="flex gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">Choose ad type</h3>
                    <p className="text-zinc-500 mb-2">
                      See a preview of each option below. Both carry the winning strategy from your
                      reference ad.
                    </p>
                    {analyzed && (
                      <div className="text-sm text-gro-purple/90 mb-4 space-y-1">
                        <p><strong className="text-white">Angle:</strong> {analyzed.angle}</p>
                        {analyzed.audience && <p><strong className="text-white">Audience:</strong> {analyzed.audience.slice(0, 120)}{analyzed.audience.length > 120 ? "…" : ""}</p>}
                        {analyzed.concept && <p><strong className="text-white">Concept:</strong> {analyzed.concept}</p>}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleAdType("variations")}
                        className={`gro-card p-5 text-left transition-colors ${
                          adType === "variations" ? "border-gro-purple" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">Variations</h4>
                        </div>
                        <p className="text-sm text-zinc-500">
                          Same layout, your product. Keeps the winning visual structure and
                          composition while adapting it for your brand.
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdType("new_ads")}
                        className={`gro-card p-5 text-left transition-colors ${
                          adType === "new_ads" ? "border-gro-purple" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-white">New Ads</h4>
                        </div>
                        <p className="text-sm text-zinc-500">
                          Same messaging, fresh creative. Applies the winning psychological strategy
                          to entirely new ad designs generated for your product.
                        </p>
                      </button>
                    </div>
                  </div>
                  <div className="w-72 shrink-0 gro-card p-4 aspect-[9/16] flex items-center justify-center text-zinc-500 text-sm">
                    Analysing ad…
                  </div>
                </div>
              )}

              {step === "settings" && (
                <div className="flex gap-6">
                  <div className="flex-1 space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <Globe className="w-4 h-4" /> Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="gro-input w-full"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        <span className="w-4 h-4 grid place-center">⊞</span> Variations
                      </label>
                      <select
                        value={variations}
                        onChange={(e) => setVariations(Number(e.target.value))}
                        className="gro-input w-full"
                      >
                        {[3, 6, 9, 12].map((n) => (
                          <option key={n} value={n}>
                            {n} Variations
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-zinc-500 mt-1">
                        3 per concept (variations distributed across selected concepts)
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        Placement
                      </label>
                      <div className="space-y-2">
                        {FORMATS.map((f) => (
                          <label
                            key={f.id}
                            className="flex items-center gap-3 gro-card p-3 cursor-pointer hover:border-gro-purple/50"
                          >
                            <input
                              type="radio"
                              name="format"
                              value={f.id}
                              checked={format === f.id}
                              onChange={() => setFormat(f.id)}
                              className="text-gro-purple"
                            />
                            <span className="text-white">{f.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                        Custom Instructions
                      </label>
                      <textarea
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                        placeholder="e.g., Make sure the product is always in the center, use warm tones, include a call-to-action button..."
                        className="gro-input w-full min-h-[100px] resize-y"
                        maxLength={500}
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        {customInstructions.length}/500
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={generating}
                      className="w-full gro-btn-primary py-3 text-base"
                    >
                      {generating ? "Generating…" : "Generate"}
                    </button>
                  </div>
                  <div className="w-72 shrink-0 gro-card p-4 aspect-[9/16] flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-700" />
                      <div className="flex-1 text-xs text-zinc-500">Sponsored</div>
                    </div>
                    <div className="flex-1 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                      Ad preview
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">Learn More</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

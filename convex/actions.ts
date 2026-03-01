import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";

const FORMAT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  "1080x1080": { w: 1080, h: 1080 },
  "1440x1800": { w: 1440, h: 1800 },
  "1440x2560": { w: 1440, h: 2560 },
};

// --- Internal helpers (same module = internal.actions.*) ---
export const getProduct = internalQuery({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => ctx.db.get(productId),
});

export const getLatestAnalyzedForProductAndUrl = internalQuery({
  args: {
    productId: v.id("products"),
    adLibraryUrl: v.optional(v.string()),
  },
  handler: async (ctx, { productId, adLibraryUrl }) => {
    const actions = await ctx.db
      .query("adActions")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .collect();
    const withAnalysis = actions
      .filter((a) => a.analyzedAd && (adLibraryUrl == null || (a.sourceUrl && a.sourceUrl.trim() === adLibraryUrl.trim())))
      .sort((a, b) => b.createdAt - a.createdAt);
    return withAnalysis[0]?.analyzedAd ?? null;
  },
});

export const insertAnalyzeAction = internalMutation({
  args: {
    productId: v.id("products"),
    adLibraryUrl: v.string(),
    analyzedAd: v.string(),
  },
  handler: async (ctx, args) =>
    ctx.db.insert("adActions", {
      productId: args.productId,
      type: "from_ad_library",
      sourceUrl: args.adLibraryUrl,
      status: "completed",
      analyzedAd: args.analyzedAd,
      variations: 9,
      createdAt: Date.now(),
    }),
});

export const insertGenerateResult = internalMutation({
  args: {
    productId: v.id("products"),
    adLibraryUrl: v.optional(v.string()),
    adType: v.union(v.literal("variations"), v.literal("new_ads")),
    language: v.string(),
    variations: v.number(),
    format: v.string(),
    customInstructions: v.optional(v.string()),
    dims: v.object({ w: v.number(), h: v.number() }),
    audience: v.optional(v.string()),
    angle: v.optional(v.string()),
    concepts: v.optional(v.string()),
    copies: v.optional(v.array(v.string())),
    imageUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const actionId = await ctx.db.insert("adActions", {
      productId: args.productId,
      type: "from_ad_library",
      sourceUrl: args.adLibraryUrl ?? undefined,
      adType: args.adType,
      language: args.language,
      variations: args.variations,
      format: args.format,
      customInstructions: args.customInstructions ?? undefined,
      status: "completed",
      createdAt: Date.now(),
    });
    const defaultAudience = "Older adults, likely retirees, who experience back pain upon waking and desire a better start to their day.";
    const defaultAngle = "WAKE UP PAIN-FREE!";
    const defaultConcepts = "Lifestyle";
    const defaultCopies = ["Eksperternes valg for bedre søvn", "Slip stressen", "Find roen"];
    const creativeSetId = await ctx.db.insert("creativeSets", {
      productId: args.productId,
      actionId,
      audience: args.audience ?? defaultAudience,
      angle: args.angle ?? defaultAngle,
      concepts: args.concepts ?? defaultConcepts,
      createdAt: Date.now(),
    });
    const copies = args.copies?.length ? args.copies : defaultCopies;
    const imageUrls = args.imageUrls?.length ? args.imageUrls : null;
    for (let i = 0; i < args.variations; i++) {
      const imageUrl =
        imageUrls && imageUrls[i] ? imageUrls[i] : `https://placehold.co/${args.dims.w}x${args.dims.h}/1f2937/8b5cf6?text=Ad+${i + 1}`;
      await ctx.db.insert("creatives", {
        creativeSetId,
        imageUrl,
        width: args.dims.w,
        height: args.dims.h,
        copy: copies[i % copies.length],
        sortOrder: i,
        createdAt: Date.now(),
      });
    }
    return creativeSetId;
  },
});

export const upsertIntelligence = internalMutation({
  args: {
    productId: v.id("products"),
    keyFeatures: v.string(),
    keyBenefits: v.string(),
    targetPainPoints: v.string(),
    primaryUseCases: v.string(),
    targetScenarios: v.string(),
    offers: v.string(),
    valueProposition: v.string(),
    positioningStatement: v.optional(v.string()),
    uniqueSellingPoints: v.string(),
    competitiveAdvantages: v.string(),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productIntelligence")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();
    const now = Date.now();
    const doc = {
      productId: args.productId,
      keyFeatures: args.keyFeatures,
      keyBenefits: args.keyBenefits,
      targetPainPoints: args.targetPainPoints,
      primaryUseCases: args.primaryUseCases,
      targetScenarios: args.targetScenarios,
      offers: args.offers,
      valueProposition: args.valueProposition,
      positioningStatement: args.positioningStatement ?? undefined,
      uniqueSellingPoints: args.uniqueSellingPoints,
      competitiveAdvantages: args.competitiveAdvantages,
      confidence: args.confidence,
      updatedAt: now,
    };
    if (existing) await ctx.db.patch(existing._id, doc);
    else await ctx.db.insert("productIntelligence", doc);
  },
});

// --- Public actions ---
const UA = "Mozilla/5.0 (compatible; AdTool/1.0; +https://adtool.app)";

function parseOgFromHtml(html: string): { title?: string; description?: string; image?: string } {
  const out: { title?: string; description?: string; image?: string } = {};
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
  if (ogTitle) out.title = ogTitle[1].trim();
  const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i);
  if (ogDesc) out.description = ogDesc[1].trim();
  const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
  if (ogImage) out.image = ogImage[1].trim();
  return out;
}

function parseTitleFromHtml(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : undefined;
}

/** Research: fetch URL and return og + title */
async function fetchPageContext(url: string): Promise<{ title?: string; description?: string; image?: string }> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    const html = await res.text();
    const og = parseOgFromHtml(html);
    const title = og.title || parseTitleFromHtml(html);
    return { title, description: og.description, image: og.image };
  } catch {
    return {};
  }
}

/** Fallback when no LLM: derive audience, angle, concept from ad + brand */
function synthesizeFromResearchFallback(
  productName: string,
  brand: { title?: string; description?: string },
  ad: { title?: string; description?: string }
): { audience: string; angle: string; concept: string; copies: string[] } {
  const brandDesc = (brand.description || brand.title || "").slice(0, 300);
  const adCopy = (ad.description || ad.title || "").slice(0, 300);
  const adTitle = ad.title || ad.description?.split(/[.!?]/)[0]?.trim() || productName;
  const audience =
    brandDesc || adCopy
      ? `People interested in ${productName} who want ${(adCopy || brandDesc).slice(0, 80).replace(/\s+/g, " ")}`
      : `Target audience for ${productName}`;
  const angle = adTitle || productName;
  const concept =
    /lifestyle|livet|ro|søvn|stress|velvære|wellness/i.test(adCopy + brandDesc) ? "Lifestyle"
    : /rabat|tilbud|spar|save|deal|offer/i.test(adCopy + brandDesc) ? "Offer"
    : "Product benefit";
  const copies = [adTitle, ad.description?.split(/[.!?]/)[0]?.trim() || angle, brandDesc.slice(0, 80) || angle].filter(Boolean);
  return { audience, angle, concept, copies: [...new Set(copies)].length ? [...new Set(copies)] : [angle] };
}

type WinnerAd = { headline: string; bodyCopy?: string; angle?: string; concept?: string };

/** Call Claude to generate unique audience, angle, concept and copy variations from research */
async function synthesizeWithClaude(
  apiKey: string,
  productName: string,
  brand: { title?: string; description?: string },
  ad: { title?: string; description?: string },
  winnerAds: WinnerAd[] = []
): Promise<{ audience: string; angle: string; concept: string; copies: string[] }> {
  const brandText = [brand.title, brand.description].filter(Boolean).join("\n");
  const adText = [ad.title, ad.description].filter(Boolean).join("\n");
  const winnerSection =
    winnerAds.length > 0
      ? `\nEksempler på winner ads (brug som inspiration til angle og stil):\n${winnerAds
          .slice(0, 8)
          .map((w) => `- Headline: ${w.headline}${w.angle ? ` | Angle: ${w.angle}` : ""}${w.concept ? ` | Concept: ${w.concept}` : ""}`)
          .join("\n")}\n`
      : "";
  const prompt = `Du er en ekspert i annonce-strategi og markedsresearch. Baseret på webshop/brand og reference-annonce nedenfor, udled UNIKKE koncepter (ikke generiske).${winnerSection}

Produkt: ${productName}

Webshop/brand:
${brandText || "(ingen)"}

Reference Facebook-ad (tekst/titel):
${adText || "(ingen)"}

Svar KUN med ét JSON-objekt uden markdown, med nøglerne: audience, angle, concept, copies.
- audience: én sætning der beskriver målgruppen (demografisk + behov).
- angle: ét stærkt, unikt salgsargument/hook (kort).
- concept: ét ord eller kort frase for det kreative koncept (fx Lifestyle, Offer, Before/after, Testimonial).
- copies: array af 4–6 korte, forskellige annoncetekster/headlines til variationer (på dansk hvis brand/ad er dansk).

Eksempel-format: {"audience":"...","angle":"...","concept":"...","copies":["...","..."]}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API: ${res.status} ${err}`);
  }
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.[0]?.type === "text" ? data.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude returnerede ikke JSON");
  const parsed = JSON.parse(jsonMatch[0]) as { audience?: string; angle?: string; concept?: string; copies?: string[] };
  return {
    audience: typeof parsed.audience === "string" ? parsed.audience : "Målgruppe fra research",
    angle: typeof parsed.angle === "string" ? parsed.angle : "Hook fra reference-ad",
    concept: typeof parsed.concept === "string" ? parsed.concept : "Lifestyle",
    copies: Array.isArray(parsed.copies) && parsed.copies.length
      ? parsed.copies.slice(0, 8).filter((c): c is string => typeof c === "string")
      : [parsed.angle || "Headline"],
  };
}

/** Nano Banana Pro 2 (defapi.org): text-to-image, poll until done, return image URL */
async function generateImageNanoBanana(
  apiKey: string,
  prompt: string,
  options: { width: number; height: number; model?: string; baseUrl?: string; referenceImageUrls?: string[] }
): Promise<string> {
  const baseUrl = (options.baseUrl || "https://api.defapi.org").replace(/\/$/, "");
  const model = options.model || "google/gempix2";
  const body: { model: string; prompt: string; images?: string[] } = {
    model,
    prompt: `${prompt}. High quality, professional ad creative, ${options.width}x${options.height} aspect ratio.`,
  };
  if (options.referenceImageUrls?.length) {
    body.images = options.referenceImageUrls.slice(0, 4);
  }
  const res = await fetch(`${baseUrl}/api/image/gen`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Nano Banana API: ${res.status} ${err}`);
  }
  const data = (await res.json()) as { code?: number; data?: { task_id?: string } };
  const taskId = data.data?.task_id;
  if (!taskId) throw new Error("Nano Banana: no task_id");
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`${baseUrl}/api/task/query?task_id=${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) continue;
    const statusData = (await statusRes.json()) as {
      data?: { status?: string; result?: { image?: string }[] };
    };
    const status = statusData.data?.status;
    if (status === "success" && statusData.data?.result?.[0]?.image) {
      return statusData.data.result[0].image;
    }
    if (status === "failed") throw new Error("Nano Banana: image generation failed");
  }
  throw new Error("Nano Banana: timeout waiting for image");
}

export const analyzeAd = action({
  args: {
    productId: v.id("products"),
    adLibraryUrl: v.string(),
  },
  handler: async (
    ctx,
    { productId, adLibraryUrl }
  ): Promise<{
    actionId: Id<"adActions">;
    analyzed: {
      angle: string;
      hook: string;
      visualStructure: string;
      cta: string;
      audience: string;
      concept: string;
      copies: string[];
      brandContext?: string;
      title?: string;
      description?: string;
      image?: string;
    };
  }> => {
    const adUrl = adLibraryUrl.trim();

    const product = await ctx.runQuery(internal.actions.getProduct, { productId });
    if (!product) throw new Error("Product not found");
    const productName = product.name;

    let brandContext: { title?: string; description?: string; image?: string } = {};
    if (product.url?.trim()) {
      brandContext = await fetchPageContext(product.url.trim());
    }

    let adContext: { title?: string; description?: string; image?: string } = {};
    adContext = await fetchPageContext(adUrl);

    const winnerAdsList = await ctx.runQuery(api.winnerAds.list, { productId, limit: 12 });
    const winnerAdsForClaude: WinnerAd[] = winnerAdsList.map((w) => ({
      headline: w.headline,
      bodyCopy: w.bodyCopy,
      angle: w.angle ?? undefined,
      concept: w.concept ?? undefined,
    }));

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const { audience, angle, concept, copies } =
      anthropicKey?.trim()
        ? await synthesizeWithClaude(anthropicKey, productName, brandContext, adContext, winnerAdsForClaude)
        : synthesizeFromResearchFallback(productName, brandContext, adContext);

    const hook = adContext.description?.slice(0, 120) || adContext.title || angle;
    const visualStructure = adContext.image ? "Image-based creative" : "Lifestyle / product shot";
    const cta =
      (adContext.description || "").toLowerCase().includes("shop")
        ? "Shop now"
        : (adContext.description || "").toLowerCase().includes("learn")
          ? "Learn more"
          : "Shop now";

    const analyzedAd = {
      angle,
      hook,
      visualStructure,
      cta,
      audience,
      concept,
      copies,
      brandContext:
        brandContext.title || brandContext.description
          ? `Brand: ${brandContext.title || ""}. ${(brandContext.description || "").slice(0, 200)}. Image: ${brandContext.image || "none"}.`
          : undefined,
      title: adContext.title,
      description: adContext.description,
      image: adContext.image,
    };

    const actionId = await ctx.runMutation(internal.actions.insertAnalyzeAction, {
      productId,
      adLibraryUrl: adUrl,
      analyzedAd: JSON.stringify(analyzedAd),
    });
    return { actionId, analyzed: analyzedAd };
  },
});

export const generateAds = action({
  args: {
    productId: v.id("products"),
    adLibraryUrl: v.optional(v.string()),
    adType: v.union(v.literal("variations"), v.literal("new_ads")),
    language: v.optional(v.string()),
    variations: v.optional(v.number()),
    format: v.optional(v.string()),
    customInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ creativeSetId: Id<"creativeSets"> }> => {
    const variations = Math.min(Math.max(1, args.variations ?? 9), 12);
    const format = args.format ?? "1080x1080";
    const dims = FORMAT_DIMENSIONS[format] ?? FORMAT_DIMENSIONS["1080x1080"];

    const analyzedJson = await ctx.runQuery(internal.actions.getLatestAnalyzedForProductAndUrl, {
      productId: args.productId,
      adLibraryUrl: args.adLibraryUrl ?? undefined,
    });
    let audience: string | undefined;
    let angle: string | undefined;
    let concepts: string | undefined;
    let copies: string[] | undefined;
    let brandContext: string | undefined;
    if (analyzedJson) {
      try {
        const a = JSON.parse(analyzedJson) as {
          audience?: string;
          angle?: string;
          concept?: string;
          copies?: string[];
          brandContext?: string;
          hook?: string;
          title?: string;
          description?: string;
        };
        audience = a.audience;
        angle = a.angle ?? a.hook;
        concepts = a.concept ?? (a.title ? "From reference ad" : "Lifestyle");
        copies = a.copies?.length ? a.copies : a.hook ? [a.hook, a.angle ?? "", a.description?.slice(0, 80) ?? ""].filter(Boolean) : undefined;
        brandContext = a.brandContext;
      } catch {
        // ignore parse error
      }
    }

    const winnerAdsList = await ctx.runQuery(api.winnerAds.list, {
      productId: args.productId,
      limit: 10,
    });
    const referenceImageUrls = winnerAdsList
      .map((w) => w.imageUrl)
      .filter(Boolean)
      .slice(0, 4);

    const nanoBananaKey = process.env.NANO_BANANA_API_KEY?.trim();
    const nanoBananaUrl = process.env.NANO_BANANA_API_URL?.trim();
    const nanoBananaModel = process.env.NANO_BANANA_MODEL?.trim();
    const copyList = copies?.length ? copies : [angle ?? "Product", "Offer", "Lifestyle"];
    let imageUrls: string[] | undefined;
    if (nanoBananaKey && angle) {
      imageUrls = [];
      for (let i = 0; i < variations; i++) {
        const copyLine = copyList[i % copyList.length];
        const prompt = [
          brandContext || "",
          `Ad concept: ${angle}. Headline: ${copyLine}.`,
          args.customInstructions || "",
        ]
          .filter(Boolean)
          .join(" ");
        try {
          const url = await generateImageNanoBanana(nanoBananaKey, prompt, {
            width: dims.w,
            height: dims.h,
            model: nanoBananaModel || undefined,
            baseUrl: nanoBananaUrl || undefined,
            referenceImageUrls: referenceImageUrls.length ? referenceImageUrls : undefined,
          });
          imageUrls.push(url);
        } catch (e) {
          console.error(`Nano Banana image ${i + 1} failed:`, e);
          imageUrls.push(`https://placehold.co/${dims.w}x${dims.h}/1f2937/8b5cf6?text=Ad+${i + 1}`);
        }
      }
    }

    const creativeSetId = await ctx.runMutation(internal.actions.insertGenerateResult, {
      productId: args.productId,
      adLibraryUrl: args.adLibraryUrl ?? undefined,
      adType: args.adType,
      language: args.language ?? "da",
      variations,
      format,
      customInstructions: args.customInstructions ?? undefined,
      dims,
      audience,
      angle,
      concepts,
      copies,
      imageUrls,
    });
    return { creativeSetId };
  },
});

export const runResearch = action({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }): Promise<{ ok: boolean }> => {
    const product = await ctx.runQuery(internal.actions.getProduct, { productId });
    if (!product) throw new Error("Product not found");

    const keyFeatures = [
      "Portable, compact carry-friendly design for on-the-go use",
      "Targeted care formula designed for daily maintenance and protection",
      "Convenient single-unit packaging for travel and everyday carry",
      "Fast-acting application with minimal preparation or setup required",
      "Multi-surface or multi-use compatibility suited to active lifestyles",
      "Durable, leak-resistant construction for bag and pocket storage",
    ];
    const keyBenefits = [
      "Stay protected and cared-for no matter where the day takes you",
      "Eliminate the need to carry bulky full-size products when traveling or commuting",
      "Maintain your routine consistently without interruption or compromise",
      "Save time with a ready-to-use format that requires no mixing or measuring",
      "Reduce the risk of spills or product waste with secure, travel-safe packaging",
      "Feel confident knowing your care essentials are always within reach",
    ];
    const targetPainPoints = [
      "Full-size care products are too large and impractical to carry daily",
      "Forgetting essential care items when away from home or traveling",
      "Inconsistent routines caused by lack of portable product options",
      "Spills and leaks from poorly designed travel-size containers ruining bags",
      "Overpaying for single-use travel kits that don't last or perform well",
    ];
    const primaryUseCases = [
      "Maintaining a daily care routine while traveling for work or leisure",
      "Keeping essential care products accessible during gym sessions or workouts",
      "Carrying a reliable care solution in a handbag or backpack for all-day use",
      "Refreshing or reapplying care on-the-go between meetings or activities",
      "Packing light for weekend trips without sacrificing personal care standards",
    ];
    const targetScenarios = [
      "When preparing for a business trip or vacation and needing compact care essentials",
      "When commuting daily and wanting care products accessible without extra bulk",
      "When heading to the gym, a sports event, or an outdoor activity",
      "When airport security liquid restrictions make full-size products impractical",
      "When a person's on-the-go lifestyle makes maintaining a care routine difficult",
      "When looking for a thoughtful, practical gift for a frequent traveler or active person",
    ];
    const offers = [
      { title: "1 stk. (Buy 1)", price: "399 kr. (was 599 kr.)", savings: "SPAR 33%", includes: "1 unit · FREE Shipping" },
      { title: "2 stk. Popular", price: "599 kr.", savings: "Spar 25%", includes: "2 stk - SPAR 25% · FREE Shipping" },
      { title: "3 stk. (Buy 3)", savings: "Spar 33%", includes: "3 units · FREE Shipping" },
    ];
    const positioningStatement = `${product.name} is a portable daily care solution designed for active, on-the-go individuals who refuse to compromise their routine — delivering full-size performance in a compact, carry-ready format that fits seamlessly into any bag, pocket, or lifestyle.`;
    const uniqueSellingPoints = [
      "Purpose-built for portability without sacrificing product efficacy or quality",
      "Trusted formulation expertise in a travel-optimized format",
      "Leak-resistant, bag-safe design that eliminates travel care anxiety",
      "Compact form factor that fits in pockets, purses, gym bags, and carry-ons",
      "Bridges the gap between full-size performance and on-the-go convenience",
    ];
    const competitiveAdvantages = [
      "More durable and leak-resistant than standard travel-size alternatives",
      "Backed by established brand quality and care expertise",
      "Designed specifically for daily carry — not just occasional travel use",
      "Eliminates the need to decant or repackage full-size products",
      "More cost-effective than repeatedly purchasing disposable single-use travel kits",
      "Compact enough for everyday carry while still delivering meaningful product volume",
    ];

    await ctx.runMutation(internal.actions.upsertIntelligence, {
      productId,
      keyFeatures: JSON.stringify(keyFeatures),
      keyBenefits: JSON.stringify(keyBenefits),
      targetPainPoints: JSON.stringify(targetPainPoints),
      primaryUseCases: JSON.stringify(primaryUseCases),
      targetScenarios: JSON.stringify(targetScenarios),
      offers: JSON.stringify(offers),
      valueProposition: positioningStatement,
      positioningStatement,
      uniqueSellingPoints: JSON.stringify(uniqueSellingPoints),
      competitiveAdvantages: JSON.stringify(competitiveAdvantages),
      confidence: 90,
    });
    return { ok: true };
  },
});

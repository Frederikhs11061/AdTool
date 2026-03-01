import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getProduct = internalQuery({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    return await ctx.db.get(productId);
  },
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
  handler: async (ctx, args) => {
    return await ctx.db.insert("adActions", {
      productId: args.productId,
      type: "from_ad_library",
      sourceUrl: args.adLibraryUrl,
      status: "completed",
      analyzedAd: args.analyzedAd,
      variations: 9,
      createdAt: Date.now(),
    });
  },
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
    for (let i = 0; i < args.variations; i++) {
      await ctx.db.insert("creatives", {
        creativeSetId,
        imageUrl: `https://placehold.co/${args.dims.w}x${args.dims.h}/1f2937/8b5cf6?text=Ad+${i + 1}`,
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
    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("productIntelligence", doc);
    }
  },
});

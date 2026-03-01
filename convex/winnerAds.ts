import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/** Kortvarig upload-URL til fil-upload (brug i klient: POST fil → få storageId → kald addWithFile) */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

/** Tilføj winner ad med billede uploadet til Convex (fil lagres i DB). Headline valgfri – AI kan analysere bagefter. */
export const addWithFile = mutation({
  args: {
    storageId: v.id("_storage"),
    headline: v.optional(v.string()),
    bodyCopy: v.optional(v.string()),
    angle: v.optional(v.string()),
    concept: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Kunne ikke hente URL for uploadet fil");
    return ctx.db.insert("winnerAds", {
      imageUrl,
      storageId: args.storageId,
      headline: args.headline?.trim() ?? undefined,
      bodyCopy: args.bodyCopy?.trim() ?? undefined,
      angle: args.angle?.trim() ?? undefined,
      concept: args.concept?.trim() ?? undefined,
      sourceUrl: args.sourceUrl?.trim() ?? undefined,
      productId: args.productId ?? undefined,
      createdAt: Date.now(),
    });
  },
});

/** Hent én winner ad (til analyse-action) */
export const getOne = query({
  args: { id: v.id("winnerAds") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    return { ...doc, id: doc._id };
  },
});

/** Liste over alle winner ads (global + evt. filtreret på produkt) */
export const list = query({
  args: {
    productId: v.optional(v.id("products")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { productId, limit = 100 }) => {
    let q = productId
      ? ctx.db.query("winnerAds").withIndex("by_product", (q) => q.eq("productId", productId))
      : ctx.db.query("winnerAds").withIndex("by_created");
    const ads = await q.order("desc").take(limit);
    return ads.map((a) => ({ ...a, id: a._id }));
  },
});

/** Opdater winner ad efter AI-analyse (headline, angle, concept) */
export const updateAnalyzed = mutation({
  args: {
    id: v.id("winnerAds"),
    headline: v.optional(v.string()),
    angle: v.optional(v.string()),
    concept: v.optional(v.string()),
    bodyCopy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const doc = await ctx.db.get(id);
    if (!doc) return;
    await ctx.db.patch(id, {
      ...(updates.headline !== undefined && { headline: updates.headline }),
      ...(updates.angle !== undefined && { angle: updates.angle }),
      ...(updates.concept !== undefined && { concept: updates.concept }),
      ...(updates.bodyCopy !== undefined && { bodyCopy: updates.bodyCopy }),
    });
  },
});

/** Tilføj én winner ad (headline valgfri – AI kan analysere) */
export const add = mutation({
  args: {
    imageUrl: v.string(),
    headline: v.optional(v.string()),
    bodyCopy: v.optional(v.string()),
    angle: v.optional(v.string()),
    concept: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("winnerAds", {
      imageUrl: args.imageUrl,
      headline: args.headline?.trim() ?? undefined,
      bodyCopy: args.bodyCopy ?? undefined,
      angle: args.angle ?? undefined,
      concept: args.concept ?? undefined,
      sourceUrl: args.sourceUrl ?? undefined,
      productId: args.productId ?? undefined,
      createdAt: Date.now(),
    });
  },
});

/** Slet en winner ad (og evt. fil fra storage) */
export const remove = mutation({
  args: { id: v.id("winnerAds") },
  handler: async (ctx, { id }) => {
    const ad = await ctx.db.get(id);
    if (ad?.storageId) await ctx.storage.delete(ad.storageId);
    await ctx.db.delete(id);
  },
});

/** Bulk-tilføj: array af { imageUrl, headline?, ... } – headline valgfri, AI kan analysere */
export const addBulk = mutation({
  args: {
    ads: v.array(
      v.object({
        imageUrl: v.string(),
        headline: v.optional(v.string()),
        bodyCopy: v.optional(v.string()),
        angle: v.optional(v.string()),
        concept: v.optional(v.string()),
        sourceUrl: v.optional(v.string()),
      })
    ),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, { ads, productId }) => {
    const now = Date.now();
    const ids: Id<"winnerAds">[] = [];
    for (const a of ads) {
      const id = await ctx.db.insert("winnerAds", {
        imageUrl: a.imageUrl.trim(),
        headline: a.headline?.trim() ?? undefined,
        bodyCopy: a.bodyCopy?.trim() ?? undefined,
        angle: a.angle?.trim() ?? undefined,
        concept: a.concept?.trim() ?? undefined,
        sourceUrl: a.sourceUrl?.trim() ?? undefined,
        productId: productId ?? undefined,
        createdAt: now,
      });
      ids.push(id);
    }
    return ids;
  },
});

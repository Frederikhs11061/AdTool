import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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

/** Tilføj én winner ad */
export const add = mutation({
  args: {
    imageUrl: v.string(),
    headline: v.string(),
    bodyCopy: v.optional(v.string()),
    angle: v.optional(v.string()),
    concept: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("winnerAds", {
      ...args,
      bodyCopy: args.bodyCopy ?? undefined,
      angle: args.angle ?? undefined,
      concept: args.concept ?? undefined,
      sourceUrl: args.sourceUrl ?? undefined,
      productId: args.productId ?? undefined,
      createdAt: Date.now(),
    });
  },
});

/** Slet en winner ad */
export const remove = mutation({
  args: { id: v.id("winnerAds") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

/** Bulk-tilføj: array af { imageUrl, headline, bodyCopy?, angle?, concept?, sourceUrl? } */
export const addBulk = mutation({
  args: {
    ads: v.array(
      v.object({
        imageUrl: v.string(),
        headline: v.string(),
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
        headline: a.headline.trim(),
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

import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const doc = await ctx.db
      .query("productIntelligence")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .first();
    if (!doc) return null;
    return { ...doc, id: doc._id };
  },
});

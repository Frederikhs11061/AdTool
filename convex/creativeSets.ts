import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const sets = await ctx.db
      .query("creativeSets")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .order("desc")
      .collect();
    return Promise.all(
      sets.map(async (set) => {
        const creatives = await ctx.db
          .query("creatives")
          .withIndex("by_set", (q) => q.eq("creativeSetId", set._id))
          .order("asc")
          .collect();
        return {
          ...set,
          id: set._id,
          creatives: creatives.map((c) => ({ ...c, id: c._id })),
          _count: { creatives: creatives.length },
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("creativeSets") },
  handler: async (ctx, { id }) => {
    const set = await ctx.db.get(id);
    if (!set) return null;
    const creatives = await ctx.db
      .query("creatives")
      .withIndex("by_set", (q) => q.eq("creativeSetId", id))
      .order("asc")
      .collect();
    return {
      ...set,
      id: set._id,
      creatives: creatives.map((c) => ({ ...c, id: c._id })),
    };
  },
});

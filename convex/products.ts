import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_updated")
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (p) => {
        const creativeSets = await ctx.db
          .query("creativeSets")
          .withIndex("by_product", (q) => q.eq("productId", p._id))
          .collect();
        const count = await Promise.all(
          creativeSets.map((s) =>
            ctx.db
              .query("creatives")
              .withIndex("by_set", (q) => q.eq("creativeSetId", s._id))
              .collect()
          )
        );
        const totalCreatives = count.reduce((a, c) => a + c.length, 0);
        return {
          ...p,
          id: p._id,
          _count: { creatives: totalCreatives },
        };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const product = await ctx.db.get(id);
    if (!product) return null;
    return { ...product, id: product._id };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
    url: v.optional(v.string()),
  },
  handler: async (ctx, { name, imageUrl, url }) => {
    const now = Date.now();
    const id = await ctx.db.insert("products", {
      name: name.trim(),
      imageUrl: imageUrl ?? undefined,
      url: url ?? undefined,
      status: "Private",
      updatedAt: now,
    });
    return id;
  },
});

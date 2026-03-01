import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const actions = await ctx.db
      .query("adActions")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .order("desc")
      .collect();
    const result = await Promise.all(
      actions.map(async (action) => {
        const creativeSet = action._id
          ? await ctx.db
              .query("creativeSets")
              .withIndex("by_action", (q) => q.eq("actionId", action._id))
              .first()
          : null;
        let creativesCount = 0;
        let creativesPreview: { id: string; imageUrl: string }[] = [];
        if (creativeSet) {
          const creatives = await ctx.db
            .query("creatives")
            .withIndex("by_set", (q) => q.eq("creativeSetId", creativeSet._id))
            .order("asc")
            .take(3);
          creativesCount = await ctx.db
            .query("creatives")
            .withIndex("by_set", (q) => q.eq("creativeSetId", creativeSet._id))
            .collect()
            .then((c) => c.length);
          creativesPreview = creatives.map((c) => ({ id: c._id, imageUrl: c.imageUrl }));
        }
        return {
          ...action,
          id: action._id,
          creativeSet: creativeSet ? { ...creativeSet, id: creativeSet._id, _count: { creatives: creativesCount }, creatives: creativesPreview } : null,
        };
      })
    );
    return result;
  },
});

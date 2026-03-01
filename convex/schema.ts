import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    imageUrl: v.optional(v.string()),
    url: v.optional(v.string()),
    status: v.string(),
    updatedAt: v.number(),
  }).index("by_updated", ["updatedAt"]),

  productIntelligence: defineTable({
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
    brandGuidelines: v.optional(v.string()),
    confidence: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_product", ["productId"]),

  adActions: defineTable({
    productId: v.id("products"),
    type: v.string(),
    sourceUrl: v.optional(v.string()),
    adType: v.optional(v.string()),
    language: v.optional(v.string()),
    variations: v.number(),
    format: v.optional(v.string()),
    customInstructions: v.optional(v.string()),
    status: v.string(),
    analyzedAd: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_created", ["createdAt"]),

  creativeSets: defineTable({
    productId: v.id("products"),
    actionId: v.optional(v.id("adActions")),
    audience: v.optional(v.string()),
    angle: v.optional(v.string()),
    concepts: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_action", ["actionId"]),

  creatives: defineTable({
    creativeSetId: v.id("creativeSets"),
    imageUrl: v.string(),
    width: v.number(),
    height: v.number(),
    copy: v.optional(v.string()),
    sortOrder: v.number(),
    createdAt: v.number(),
  }).index("by_set", ["creativeSetId"]),

  // Winner ads / ad library: reference-billeder systemet trækker på ved generering
  winnerAds: defineTable({
    imageUrl: v.string(),
    headline: v.string(),
    bodyCopy: v.optional(v.string()),
    angle: v.optional(v.string()),
    concept: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    createdAt: v.number(),
  })
    .index("by_created", ["createdAt"])
    .index("by_product", ["productId"]),
});

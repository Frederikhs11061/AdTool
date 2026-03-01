import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Deep research on product: features, benefits, pain points, use cases, scenarios.
 * Optionally scrape product URL for offers and value proposition.
 * This is a placeholder that seeds intelligence from product name; in production
 * use an LLM + product page scrape.
 */
export async function POST(request: Request) {
  try {
    const { productId } = (await request.json()) as { productId?: string };
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Placeholder: derive from product name / URL. In production: LLM + scrape.
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

    await prisma.productIntelligence.upsert({
      where: { productId },
      create: {
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
      },
      update: {
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
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Research failed" }, { status: 500 });
  }
}

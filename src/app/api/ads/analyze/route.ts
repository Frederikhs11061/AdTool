import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Analyzes a Meta Ads Library URL and returns structured insights (angle, hook, visual).
 * In production you would fetch the ad from Meta's API or scrape (within ToS).
 * We store a placeholder analysis and return it.
 */
export async function POST(request: Request) {
  try {
    const { productId, adLibraryUrl } = (await request.json()) as {
      productId?: string;
      adLibraryUrl?: string;
    };
    if (!productId || !adLibraryUrl?.trim()) {
      return NextResponse.json(
        { error: "productId and adLibraryUrl required" },
        { status: 400 }
      );
    }

    // Placeholder: real implementation would fetch ad creative/copy from Meta Ads Library
    const analyzedAd = {
      angle: "Pain relief / transformation",
      hook: "Wake up without pain",
      visualStructure: "Lifestyle shot with product in scene",
      cta: "Shop now",
    };

    const newAction = await prisma.adAction.create({
      data: {
        productId,
        type: "from_ad_library",
        sourceUrl: adLibraryUrl.trim(),
        status: "completed",
        analyzedAd: JSON.stringify(analyzedAd),
      },
    });

    return NextResponse.json({
      actionId: newAction.id,
      analyzed: analyzedAd,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

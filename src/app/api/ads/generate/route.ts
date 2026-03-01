import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

const FORMAT_DIMENSIONS: Record<string, { w: number; h: number }> = {
  "1080x1080": { w: 1080, h: 1080 },
  "1440x1800": { w: 1440, h: 1800 },
  "1440x2560": { w: 1440, h: 2560 },
};

/**
 * Creates an AdAction, a CreativeSet, and placeholder Creative records.
 * In production you would call Nano Banana Pro (or similar) to generate images and store URLs.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      productId?: string;
      adLibraryUrl?: string;
      adType?: "variations" | "new_ads";
      language?: string;
      variations?: number;
      format?: string;
      customInstructions?: string;
    };

    const {
      productId,
      adType = "variations",
      language = "da",
      variations = 9,
      format = "1080x1080",
      customInstructions,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    const dims = FORMAT_DIMENSIONS[format] ?? FORMAT_DIMENSIONS["1080x1080"];

    const action = await prisma.adAction.create({
      data: {
        productId,
        type: "from_ad_library",
        sourceUrl: body.adLibraryUrl ?? null,
        adType,
        language,
        variations,
        format,
        customInstructions: customInstructions ?? null,
        status: "completed",
      },
    });

    const creativeSet = await prisma.creativeSet.create({
      data: {
        productId,
        actionId: action.id,
        audience: "Older adults, likely retirees, who experience back pain upon waking and desire a better start to their day.",
        angle: "WAKE UP PAIN-FREE!",
        concepts: "Lifestyle",
      },
    });

    // Create N placeholder creatives (in production: call image API and save real imageUrl)
    const count = Math.min(Math.max(1, variations), 12);
    for (let i = 0; i < count; i++) {
      await prisma.creative.create({
        data: {
          creativeSetId: creativeSet.id,
          // Placeholder image: use a placeholder service or static asset
          imageUrl: `https://placehold.co/${dims.w}x${dims.h}/1f2937/8b5cf6?text=Ad+${i + 1}`,
          width: dims.w,
          height: dims.h,
          copy: i % 3 === 0 ? "Eksperternes valg for bedre søvn" : i % 3 === 1 ? "Slip stressen" : "Find roen",
          sortOrder: i,
        },
      });
    }

    return NextResponse.json({
      actionId: action.id,
      creativeSetId: creativeSet.id,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Generate failed" }, { status: 500 });
  }
}

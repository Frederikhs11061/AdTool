import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, imageUrl, url } = (await request.json()) as { name?: string; imageUrl?: string; url?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    const product = await prisma.product.create({
      data: { name: name.trim(), imageUrl: imageUrl || null, url: url || null },
    });
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

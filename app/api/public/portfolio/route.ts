import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getPortfolioContent();
    return NextResponse.json(content, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to load public portfolio content.", error);
    return NextResponse.json(
      { error: "Portfolio content is temporarily unavailable." },
      { status: 503 },
    );
  }
}

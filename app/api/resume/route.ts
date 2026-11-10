import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

const allowedBlobHost = /\\.public\\.blob\\.vercel-storage\\.com$/i;

export async function GET() {
  try {
    const { profile } = await getPortfolioContent();
    if (!profile.resumeUrl) {
      return NextResponse.json({ error: "No resume has been uploaded yet." }, { status: 404 });
    }

    const resumeUrl = new URL(profile.resumeUrl);
    if (resumeUrl.protocol !== "https:" || !allowedBlobHost.test(resumeUrl.hostname)) {
      return NextResponse.json({ error: "The saved resume URL is invalid." }, { status: 400 });
    }

    const fileResponse = await fetch(resumeUrl, { redirect: "manual", cache: "no-store" });
    if (!fileResponse.ok || !fileResponse.body) {
      return NextResponse.json({ error: "The resume could not be retrieved." }, { status: 502 });
    }

    return new Response(fileResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Jose-Berrios-Resume.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to download resume.", error);
    return NextResponse.json({ error: "Resume download is temporarily unavailable." }, { status: 503 });
  }
}

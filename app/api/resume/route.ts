import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-db";

export const dynamic = "force-dynamic";

const allowedBlobHost = /\.blob\.vercel-storage\.com$/i;

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

    // Follow Blob's redirects to the actual file location. Using redirect:"manual"
    // makes a valid redirect look like a failed download and returns JSON instead.
    const fileResponse = await fetch(resumeUrl, { cache: "no-store" });
    if (!fileResponse.ok || !fileResponse.body) {
      console.error("Resume Blob request failed.", {
        status: fileResponse.status,
        statusText: fileResponse.statusText,
      });
      return NextResponse.json({ error: "The resume could not be retrieved." }, { status: 502 });
    }

    const contentType = fileResponse.headers.get("content-type");
    if (contentType && !contentType.toLowerCase().includes("application/pdf")) {
      console.error("Resume Blob returned an unexpected content type.", contentType);
      return NextResponse.json({ error: "The stored resume is not a PDF file." }, { status: 502 });
    }

    const headers = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Jose-Berrios-Resume.pdf"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const contentLength = fileResponse.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(fileResponse.body, { status: 200, headers });
  } catch (error) {
    console.error("Unable to download resume.", error);
    return NextResponse.json({ error: "Resume download is temporarily unavailable." }, { status: 503 });
  }
}

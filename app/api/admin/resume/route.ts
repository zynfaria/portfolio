import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPortfolioContent, saveProfile } from "@/lib/portfolio-db";

const maximumResumeSize = 10 * 1024 * 1024;
const uploadUrlLifetime = 15 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  try {
    // The pathname is generated on the server so the client cannot choose
    // where files are written. OIDC signs a short-lived, single-file PUT URL.
    const pathname = `resumes/${randomUUID()}.pdf`;
    const validUntil = Date.now() + uploadUrlLifetime;
    const signedToken = await issueSignedToken({
      pathname,
      operations: ["put"],
      allowedContentTypes: ["application/pdf"],
      maximumSizeInBytes: maximumResumeSize,
      validUntil,
    });
    const { presignedUrl } = await presignUrl(signedToken, {
      pathname,
      operation: "put",
      access: "public",
      allowedContentTypes: ["application/pdf"],
      maximumSizeInBytes: maximumResumeSize,
      validUntil,
    });

    return NextResponse.json(
      { pathname, presignedUrl },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to create a resume upload URL.", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to prepare resume upload." },
      { status: 503 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.url !== "string" || body.url.length > 2048) {
    return NextResponse.json({ error: "Invalid resume URL." }, { status: 400 });
  }

  let resumeUrl: string;
  try {
    const url = new URL(body.url);
    if (
      url.protocol !== "https:" ||
      !url.hostname.endsWith(".blob.vercel-storage.com")
    ) {
      return NextResponse.json({ error: "Invalid resume URL." }, { status: 400 });
    }
    resumeUrl = url.toString();
  } catch {
    return NextResponse.json({ error: "Invalid resume URL." }, { status: 400 });
  }

  try {
    const content = await getPortfolioContent();
    await saveProfile({ ...content.profile, resumeUrl });
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Unable to save resume PDF URL.", error);
    return NextResponse.json({ error: "Unable to save resume PDF." }, { status: 503 });
  }
}

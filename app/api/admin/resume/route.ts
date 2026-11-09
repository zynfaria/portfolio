import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getPortfolioContent, saveProfile } from "@/lib/portfolio-db";

const maximumResumeSize = 10 * 1024 * 1024;
const resumePathPattern = /^resumes\/[0-9a-f-]+\.pdf$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isAdminRequest(request)) {
          throw new Error("Authentication required.");
        }
        if (!resumePathPattern.test(pathname)) {
          throw new Error("Invalid resume file name.");
        }
        return {
          allowedContentTypes: ["application/pdf"],
          maximumSizeInBytes: maximumResumeSize,
        };
      },
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Unable to authorize resume upload.", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload resume PDF." },
      { status: 400 },
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
    if (url.protocol !== "https:" && url.protocol !== "http:") {
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

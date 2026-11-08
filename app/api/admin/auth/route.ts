import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminCookie,
  isAdminConfigured,
  isAdminRequest,
  setAdminCookie,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 503 },
    );
  }
  return NextResponse.json({ authenticated: isAdminRequest(request) });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin authentication is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const password =
    typeof body === "object" &&
    body !== null &&
    "password" in body &&
    typeof body.password === "string"
      ? body.password
      : "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  setAdminCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  clearAdminCookie(response);
  return response;
}

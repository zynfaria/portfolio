import { NextRequest, NextResponse } from "next/server";
import {
  createContent,
  deleteContent,
  getPortfolioContent,
  isDatabaseConfigured,
  saveProfile,
  updateContent,
} from "@/lib/portfolio-db";
import { isAdminRequest } from "@/lib/admin-auth";
import type { Experience, Profile, Project } from "@/lib/portfolio-types";

export const dynamic = "force-dynamic";

type Kind = "experience" | "project";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function boundedText(value: unknown, maximum: number) {
  return typeof value === "string" && value.trim().length <= maximum
    ? value.trim()
    : null;
}

function validUrl(value: unknown, maximum = 2048) {
  const text = boundedText(value, maximum);
  if (text === null || text === "") {
    return text;
  }
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? text : null;
  } catch {
    return null;
  }
}

function stringList(value: unknown, maxItems = 30) {
  if (!Array.isArray(value) || value.length > maxItems) {
    return null;
  }
  const items = value.map((item) => boundedText(item, 100));
  return items.every((item) => item !== null) ? (items as string[]) : null;
}

function parseProfile(value: unknown): Profile | null {
  if (!isRecord(value)) return null;
  const name = boundedText(value.name, 100);
  const role = boundedText(value.role, 120);
  const headline = boundedText(value.headline, 240);
  const intro = boundedText(value.intro, 1200);
  const about = boundedText(value.about, 3000);
  const email = boundedText(value.email, 254);
  const githubUrl = validUrl(value.githubUrl);
  const resumeUrl = validUrl(value.resumeUrl);
  const resumeSummary = boundedText(value.resumeSummary, 3000);
  const skills = stringList(value.skills);
  if (
    name === null ||
    role === null ||
    headline === null ||
    intro === null ||
    about === null ||
    email === null ||
    (email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    githubUrl === null ||
    resumeUrl === null ||
    resumeSummary === null ||
    skills === null
  ) {
    return null;
  }
  return {
    name,
    role,
    headline,
    intro,
    about,
    email,
    githubUrl,
    resumeUrl,
    resumeSummary,
    skills,
  };
}

function parseExperience(value: unknown): Experience | null {
  if (!isRecord(value)) return null;
  const role = boundedText(value.role, 120);
  const company = boundedText(value.company, 120);
  const location = boundedText(value.location, 120);
  const startDate = boundedText(value.startDate, 40);
  const endDate = boundedText(value.endDate, 40);
  const description = boundedText(value.description, 3000);
  if (
    role === null ||
    company === null ||
    location === null ||
    startDate === null ||
    endDate === null ||
    description === null ||
    !role ||
    !company
  ) {
    return null;
  }
  return { role, company, location, startDate, endDate, description };
}

function parseProject(value: unknown): Project | null {
  if (!isRecord(value)) return null;
  const title = boundedText(value.title, 120);
  const category = boundedText(value.category, 120);
  const description = boundedText(value.description, 3000);
  const tags = stringList(value.tags);
  const imageUrls =
    value.imageUrls === undefined
      ? [validUrl(value.imageUrl)]
      : Array.isArray(value.imageUrls) && value.imageUrls.length <= 10
        ? value.imageUrls.map((url) => validUrl(url))
        : null;
  const projectUrl = validUrl(value.projectUrl);
  const sourceUrl = validUrl(value.sourceUrl);
  if (
    imageUrls === null ||
    imageUrls.some((url) => url === null)
  ) {
    return null;
  }
  const normalizedImageUrls = imageUrls.filter((url): url is string => url !== "");
  if (
    title === null ||
    category === null ||
    description === null ||
    tags === null ||
    projectUrl === null ||
    sourceUrl === null ||
    !title
  ) {
    return null;
  }
  return {
    title,
    category,
    description,
    tags,
    imageUrls: normalizedImageUrls,
    imageUrl: normalizedImageUrls[0] ?? "",
    projectUrl,
    sourceUrl,
  };
}

function parseKind(value: unknown): Kind | null {
  return value === "experience" || value === "project" ? value : null;
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured. Add your Neon connection string to enable content editing." },
      { status: 503 },
    );
  }
  try {
    return NextResponse.json(await getPortfolioContent(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to load admin portfolio content.", error);
    return NextResponse.json({ error: "Unable to load portfolio content." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }
  const kind = parseKind(body.kind);
  const data =
    kind === "experience"
      ? parseExperience(body.data)
      : kind === "project"
        ? parseProject(body.data)
        : null;
  if (!kind || !data) {
    return NextResponse.json({ error: "Please check the content fields." }, { status: 400 });
  }
  try {
    const id = await createContent(kind, data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Unable to create portfolio content.", error);
    return NextResponse.json({ error: "Unable to save portfolio content." }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }
  if (body.kind === "profile") {
    const profile = parseProfile(body.data);
    if (!profile) {
      return NextResponse.json({ error: "Please check the profile fields." }, { status: 400 });
    }
    try {
      await saveProfile(profile);
      return NextResponse.json({ saved: true });
    } catch (error) {
      console.error("Unable to save portfolio profile.", error);
      return NextResponse.json({ error: "Unable to save profile." }, { status: 503 });
    }
  }

  const kind = parseKind(body.kind);
  const id = boundedText(body.id, 100);
  const data =
    kind === "experience"
      ? parseExperience(body.data)
      : kind === "project"
        ? parseProject(body.data)
        : null;
  if (!kind || !id || !data) {
    return NextResponse.json({ error: "Please check the content fields." }, { status: 400 });
  }
  try {
    const saved = await updateContent(kind, id, data);
    return saved
      ? NextResponse.json({ saved: true })
      : NextResponse.json({ error: "Content was not found." }, { status: 404 });
  } catch (error) {
    console.error("Unable to update portfolio content.", error);
    return NextResponse.json({ error: "Unable to save portfolio content." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }
  const kind = parseKind(body.kind);
  const id = boundedText(body.id, 100);
  if (!kind || !id) {
    return NextResponse.json({ error: "Invalid content selection." }, { status: 400 });
  }
  try {
    const deleted = await deleteContent(kind, id);
    return deleted
      ? NextResponse.json({ deleted: true })
      : NextResponse.json({ error: "Content was not found." }, { status: 404 });
  } catch (error) {
    console.error("Unable to delete portfolio content.", error);
    return NextResponse.json({ error: "Unable to delete portfolio content." }, { status: 503 });
  }
}

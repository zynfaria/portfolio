import { neon } from "@neondatabase/serverless";
import {
  defaultProfile,
  defaultProjects,
  type ContentRecord,
  type Experience,
  type PortfolioContent,
  type Profile,
  type Project,
} from "@/lib/portfolio-types";

type ContentKind = "experience" | "project";

interface DatabaseRow {
  id: string;
  kind: string;
  data: unknown;
  position: number;
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(connectionString);
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPreviewContent(): PortfolioContent {
  return {
    profile: defaultProfile,
    experiences: [],
    projects: defaultProjects.map((data, position) => ({
      id: `starter-project-${position + 1}`,
      data,
      position,
    })),
  };
}

async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_content (
      id text PRIMARY KEY,
      kind text NOT NULL CHECK (kind IN ('profile', 'experience', 'project')),
      data jsonb NOT NULL,
      position integer NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS portfolio_content_kind_position_idx
    ON portfolio_content (kind, position)
  `;
  await sql`
    INSERT INTO portfolio_content (id, kind, data, position)
    VALUES ('profile', 'profile', ${JSON.stringify(defaultProfile)}::jsonb, 0)
    ON CONFLICT (id) DO NOTHING
  `;
  for (const [position, project] of defaultProjects.entries()) {
    await sql`
      INSERT INTO portfolio_content (id, kind, data, position)
      VALUES (
        ${`starter-project-${position + 1}`},
        'project',
        ${JSON.stringify(project)}::jsonb,
        ${position}
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  return sql;
}

function readData<T>(value: unknown): T {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Portfolio database contains invalid content.");
  }
  return value as T;
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!isDatabaseConfigured()) {
    return getPreviewContent();
  }

  const sql = await ensureSchema();
  const rows = (await sql`
    SELECT id, kind, data, position
    FROM portfolio_content
    ORDER BY kind, position, id
  `) as DatabaseRow[];

  const profileRow = rows.find((row) => row.kind === "profile");
  if (!profileRow) {
    throw new Error("Portfolio profile is missing from the database.");
  }

  const records = <T>(kind: ContentKind): ContentRecord<T>[] =>
    rows
      .filter((row) => row.kind === kind)
      .map((row) => ({
        id: row.id,
        data: readData<T>(row.data),
        position: row.position,
      }));

  return {
    profile: readData<Profile>(profileRow.data),
    experiences: records<Experience>("experience"),
    projects: records<Project>("project"),
  };
}

export async function saveProfile(profile: Profile) {
  const sql = await ensureSchema();
  await sql`
    INSERT INTO portfolio_content (id, kind, data, position)
    VALUES ('profile', 'profile', ${JSON.stringify(profile)}::jsonb, 0)
    ON CONFLICT (id) DO UPDATE
    SET data = EXCLUDED.data, updated_at = now()
  `;
}

export async function createContent(
  kind: ContentKind,
  data: Experience | Project,
) {
  const sql = await ensureSchema();
  const [positionRow] = (await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS position
    FROM portfolio_content
    WHERE kind = ${kind}
  `) as { position: number }[];
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO portfolio_content (id, kind, data, position)
    VALUES (${id}, ${kind}, ${JSON.stringify(data)}::jsonb, ${positionRow.position})
  `;
  return id;
}

export async function updateContent(
  kind: ContentKind,
  id: string,
  data: Experience | Project,
) {
  const sql = await ensureSchema();
  const rows = await sql`
    UPDATE portfolio_content
    SET data = ${JSON.stringify(data)}::jsonb, updated_at = now()
    WHERE id = ${id} AND kind = ${kind}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function deleteContent(kind: ContentKind, id: string) {
  const sql = await ensureSchema();
  const rows = await sql`
    DELETE FROM portfolio_content
    WHERE id = ${id} AND kind = ${kind}
    RETURNING id
  `;
  return rows.length > 0;
}

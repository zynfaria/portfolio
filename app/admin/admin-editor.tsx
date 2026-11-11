"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type {
  Experience,
  PortfolioContent,
  Profile,
  Project,
} from "@/lib/portfolio-types";
import ProjectImageSlider from "@/components/project-image-slider";

type Section = "profile" | "experience" | "projects";
type EditorState =
  | { kind: "experience"; id: string | null; data: Experience }
  | { kind: "project"; id: string | null; data: Project };

const emptyExperience: Experience = {
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

const emptyProject: Project = {
  title: "",
  category: "",
  description: "",
  tags: [],
  imageUrls: [],
  imageUrl: "",
  projectUrl: "",
  sourceUrl: "",
};

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return body as T;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  const className =
    "mt-2 w-full rounded-xl border border-[#dedfd8] bg-white px-4 py-3 text-sm text-[#171816] outline-none transition focus:border-[#171816]";
  return (
    <label className="block text-sm font-medium text-[#171816]">
      {label}
      {multiline ? (
        <textarea
          className={`${className} min-h-28 resize-y`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          className={className}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </label>
  );
}

function ExperienceForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Experience;
  onSave: (data: Experience) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const update = (key: keyof Experience, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(form);
      }}
    >
      <Field label="Job title" value={form.role} onChange={(v) => update("role", v)} required />
      <Field label="Company" value={form.company} onChange={(v) => update("company", v)} required />
      <Field label="Location" value={form.location} onChange={(v) => update("location", v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date" value={form.startDate} onChange={(v) => update("startDate", v)} placeholder="Jan 2024" />
        <Field label="End date" value={form.endDate} onChange={(v) => update("endDate", v)} placeholder="Present" />
      </div>
      <div className="sm:col-span-2">
        <Field label="Description" value={form.description} onChange={(v) => update("description", v)} multiline />
      </div>
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-[#dedfd8] px-5 py-3 text-sm">Cancel</button>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#171816] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
          <Save size={15} /> {saving ? "Saving…" : "Save experience"}
        </button>
      </div>
    </form>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Project;
  onSave: (data: Project) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    ...initial,
    imageUrlsText: (initial.imageUrls?.length
      ? initial.imageUrls
      : initial.imageUrl
        ? [initial.imageUrl]
        : []
    ).join("\n"),
    tagsText: initial.tags.join(", "),
  });
  const update = (key: keyof Project | "tagsText" | "imageUrlsText", value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const imageUrls = form.imageUrlsText
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSave({
          title: form.title,
          category: form.category,
          description: form.description,
          tags: form.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
          imageUrls,
          imageUrl: imageUrls[0] ?? "",
          projectUrl: form.projectUrl,
          sourceUrl: form.sourceUrl,
        });
      }}
    >
      <Field label="Project name" value={form.title} onChange={(v) => update("title", v)} required />
      <Field label="Category" value={form.category} onChange={(v) => update("category", v)} placeholder="Web app · E-commerce" />
      <div className="sm:col-span-2">
        <Field label="Description" value={form.description} onChange={(v) => update("description", v)} multiline />
      </div>
      <Field label="Tags (comma separated)" value={form.tagsText} onChange={(v) => update("tagsText", v)} placeholder="Next.js, TypeScript" />
      <div className="sm:col-span-2">
        <Field
          label="Image URLs (one per line)"
          value={form.imageUrlsText}
          onChange={(v) => update("imageUrlsText", v)}
          placeholder={"https://example.com/image-1.jpg\nhttps://example.com/image-2.jpg"}
          multiline
        />
        <p className="mt-2 text-xs text-[#70736d]">Add up to 10 image URLs, one per line. Multiple images appear as a slideshow.</p>
        <div className="mt-3 aspect-[4/3] overflow-hidden rounded-xl border border-[#dedfd8]">
          <ProjectImageSlider images={imageUrls} category={form.category} label={`${form.title || "Project"} preview`} />
        </div>
      </div>
      <Field label="Live project URL" value={form.projectUrl} onChange={(v) => update("projectUrl", v)} placeholder="https://…" type="url" />
      <Field label="Source code URL" value={form.sourceUrl} onChange={(v) => update("sourceUrl", v)} placeholder="https://…" type="url" />
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded-full border border-[#dedfd8] px-5 py-3 text-sm">Cancel</button>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-[#171816] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
          <Save size={15} /> {saving ? "Saving…" : "Save project"}
        </button>
      </div>
    </form>
  );
}

export default function AdminEditor() {
  const resumeFileInput = useRef<HTMLInputElement>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [section, setSection] = useState<Section>("profile");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  async function loadContent() {
    const data = await apiRequest<PortfolioContent>("/api/admin/content");
    setContent(data);
  }

  useEffect(() => {
    let active = true;
    apiRequest<{ authenticated: boolean }>("/api/admin/auth")
      .then(async (result) => {
        if (result.authenticated) {
          await loadContent();
          if (active) setAuthenticated(true);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Unable to check admin status.");
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await apiRequest("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      await loadContent();
      setAuthenticated(true);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content) return;
    setSaving(true);
    setError("");
    setNotice("");
    const profile: Profile = {
      ...content.profile,
      skills: skillsText.split("\n").map((item) => item.trim()).filter(Boolean),
    };
    try {
      await apiRequest("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ kind: "profile", data: profile }),
      });
      setContent((current) => (current ? { ...current, profile } : current));
      setNotice("Profile and resume details saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function replaceResume(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") || file.type !== "application/pdf") {
      setError("Choose a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The resume PDF must be 10 MB or smaller.");
      return;
    }
    if ((await file.slice(0, 5).text()) !== "%PDF-") {
      setError("The selected file is not a valid PDF.");
      return;
    }

    setUploadingResume(true);
    setError("");
    setNotice("");
    try {
      const { presignedUrl } = await apiRequest<{ presignedUrl: string }>("/api/admin/resume", {
        method: "POST",
        body: JSON.stringify({}),
      });
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/pdf" },
        body: file,
      });
      if (!uploadResponse.ok) {
        throw new Error(`Blob upload failed (HTTP ${uploadResponse.status}). Please try again.`);
      }

      const blob = (await uploadResponse.json()) as { url?: unknown };
      if (typeof blob.url !== "string") {
        throw new Error("Blob upload completed without returning a file URL.");
      }

      await apiRequest("/api/admin/resume", {
        method: "PATCH",
        body: JSON.stringify({ url: blob.url }),
      });
      setContent((current) =>
        current
          ? {
              ...current,
              profile: { ...current.profile, resumeUrl: blob.url },
            }
          : current,
      );
      setNotice("Resume PDF replaced.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to replace resume PDF.");
    } finally {
      setUploadingResume(false);
    }
  }

  async function saveItem(data: Experience | Project) {
    if (!editor) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/api/admin/content", {
        method: editor.id ? "PUT" : "POST",
        body: JSON.stringify({
          kind: editor.kind,
          ...(editor.id ? { id: editor.id } : {}),
          data,
        }),
      });
      await loadContent();
      setEditor(null);
      setNotice(`${editor.kind === "project" ? "Project" : "Experience"} saved.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save content.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(kind: "experience" | "project", id: string) {
    const label = kind === "project" ? "project" : "experience";
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/api/admin/content", {
        method: "DELETE",
        body: JSON.stringify({ kind, id }),
      });
      await loadContent();
      setNotice(`${kind === "project" ? "Project" : "Experience"} deleted.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete content.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await apiRequest("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setContent(null);
  }

  const [skillsText, setSkillsText] = useState("");
  useEffect(() => {
    if (content) setSkillsText(content.profile.skills.join("\n"));
  }, [content]);

  if (checking) {
    return <main className="grid min-h-screen place-items-center text-sm text-[#70736d]">Loading admin…</main>;
  }

  if (!authenticated || !content) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5 py-12">
        <form onSubmit={signIn} className="w-full max-w-[420px] rounded-3xl border border-[#dedfd8] bg-white p-8 sm:p-10">
          <a href="/" className="text-sm text-[#70736d] hover:text-[#171816]">← Back to portfolio</a>
          <p className="eyebrow muted mb-4 mt-12">PRIVATE AREA</p>
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#70736d]">Sign in to update your profile, resume, experience, and projects.</p>
          <label className="mt-8 block text-sm font-medium">
            Admin password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#dedfd8] px-4 py-3 text-sm outline-none focus:border-[#171816]"
            />
          </label>
          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={saving} className="mt-5 w-full rounded-full bg-[#171816] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
            {saving ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    );
  }

  const tabs: { id: Section; label: string; Icon: typeof FileText }[] = [
    { id: "profile", label: "Profile & resume", Icon: FileText },
    { id: "experience", label: "Experience", Icon: BriefcaseBusiness },
    { id: "projects", label: "Projects", Icon: FolderKanban },
  ];

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171816]">
      <header className="border-b border-[#dedfd8] bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <a href="/" className="text-sm text-[#70736d] hover:text-[#171816]">← View portfolio</a>
            <p className="mt-1 text-lg font-semibold tracking-tight">Portfolio admin</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-[#dedfd8] px-4 py-2 text-sm hover:bg-[#f7f7f4]">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-9">
          <p className="eyebrow muted mb-3">CONTENT MANAGER</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Make it yours.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#70736d]">Changes you save are published to your portfolio right away.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Portfolio content">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => { setSection(id); setError(""); setNotice(""); }}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${section === id ? "bg-[#171816] text-white" : "text-[#70736d] hover:bg-white"}`}
              >
                <Icon size={17} /> {label}
                {id === "experience" && <span className="ml-auto">{content.experiences.length}</span>}
                {id === "projects" && <span className="ml-auto">{content.projects.length}</span>}
              </button>
            ))}
          </nav>

          <section className="min-w-0 rounded-2xl border border-[#dedfd8] bg-white p-5 sm:p-8">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-[#dedfd8] pb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{tabs.find((tab) => tab.id === section)?.label}</h2>
                <p className="mt-1 text-sm text-[#70736d]">
                  {section === "profile" ? "Your intro, contact details, skills, and resume." : section === "experience" ? "Add and maintain your work history." : "Manage the projects shown on your site."}
                </p>
              </div>
              {section !== "profile" && (
                <button
                  onClick={() => setEditor(section === "experience" ? { kind: "experience", id: null, data: emptyExperience } : { kind: "project", id: null, data: emptyProject })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#b9f36b] px-4 py-2.5 text-sm font-semibold text-[#171816] hover:bg-[#a8e65c]"
                >
                  <Plus size={16} /> Add {section === "projects" ? "project" : "experience"}
                </button>
              )}
            </div>

            {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="mb-5 rounded-xl bg-[#eff8e5] px-4 py-3 text-sm text-[#36551b]">{notice}</p>}

            {section === "profile" && (
              <form onSubmit={saveProfile} className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" value={content.profile.name} onChange={(v) => setContent({ ...content, profile: { ...content.profile, name: v } })} required />
                <Field label="Role / title" value={content.profile.role} onChange={(v) => setContent({ ...content, profile: { ...content.profile, role: v } })} required />
                <div className="sm:col-span-2">
                  <Field label="Headline" value={content.profile.headline} onChange={(v) => setContent({ ...content, profile: { ...content.profile, headline: v } })} required />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Short introduction" value={content.profile.intro} onChange={(v) => setContent({ ...content, profile: { ...content.profile, intro: v } })} multiline />
                </div>
                <div className="sm:col-span-2">
                  <Field label="About" value={content.profile.about} onChange={(v) => setContent({ ...content, profile: { ...content.profile, about: v } })} multiline />
                </div>
                <Field label="Contact email" value={content.profile.email} onChange={(v) => setContent({ ...content, profile: { ...content.profile, email: v } })} type="email" />
                <Field label="GitHub URL" value={content.profile.githubUrl} onChange={(v) => setContent({ ...content, profile: { ...content.profile, githubUrl: v } })} type="url" />
                <div className="sm:col-span-2">
                  <div className="text-sm">
                    <span className="font-medium">Resume PDF</span>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {content.profile.resumeUrl ? (
                        <a
                          href={content.profile.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="min-w-0 flex-1 break-all text-[#70736d] underline"
                        >
                          View current resume PDF
                        </a>
                      ) : (
                        <span className="min-w-0 flex-1 text-[#70736d]">No resume PDF uploaded.</span>
                      )}
                      <input
                        ref={resumeFileInput}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={replaceResume}
                        className="sr-only"
                        aria-label="Choose a replacement resume PDF"
                      />
                      <button
                        type="button"
                        disabled={uploadingResume || saving}
                        onClick={() => resumeFileInput.current?.click()}
                        className="inline-flex items-center gap-2 rounded-full border border-[#dedfd8] px-4 py-2 text-sm font-medium hover:bg-[#f5f5f1] disabled:opacity-50"
                      >
                        <Upload size={14} /> {uploadingResume ? "Uploading…" : content.profile.resumeUrl ? "Replace PDF" : "Upload PDF"}
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#70736d]">Upload a PDF up to 10 MB. The public resume link updates when the upload finishes.</p>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Resume summary" value={content.profile.resumeSummary} onChange={(v) => setContent({ ...content, profile: { ...content.profile, resumeSummary: v } })} multiline placeholder="A short overview for the resume section" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Skills (one per line)" value={skillsText} onChange={setSkillsText} multiline placeholder={"Frontend: React · TypeScript\nBackend: APIs · Databases"} />
                </div>
                <div className="flex justify-end sm:col-span-2">
                  <button disabled={saving || uploadingResume} className="inline-flex items-center gap-2 rounded-full bg-[#171816] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                    <Save size={15} /> {saving ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </form>
            )}

            {section === "experience" && (
              content.experiences.length ? (
                <div className="divide-y divide-[#dedfd8]">
                  {content.experiences.map((item) => (
                    <article key={item.id} className="flex flex-col justify-between gap-4 py-5 first:pt-0 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-semibold">{item.data.role}</h3>
                        <p className="mt-1 text-sm text-[#70736d]">{item.data.company}{item.data.location ? ` · ${item.data.location}` : ""}</p>
                        <p className="mt-1 text-xs text-[#70736d]">{item.data.startDate}{item.data.endDate ? ` — ${item.data.endDate}` : ""}</p>
                      </div>
                      <ItemActions onEdit={() => setEditor({ kind: "experience", id: item.id, data: item.data })} onDelete={() => removeItem("experience", item.id)} />
                    </article>
                  ))}
                </div>
              ) : <EmptyState label="No experience added yet." />
            )}

            {section === "projects" && (
              content.projects.length ? (
                <div className="divide-y divide-[#dedfd8]">
                  {content.projects.map((item) => (
                    <article key={item.id} className="flex flex-col justify-between gap-4 py-5 first:pt-0 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="font-semibold">{item.data.title}</h3>
                        <p className="mt-1 text-sm text-[#70736d]">{item.data.category || "Project"}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-[#70736d]">{item.data.description}</p>
                      </div>
                      <ItemActions onEdit={() => setEditor({ kind: "project", id: item.id, data: item.data })} onDelete={() => removeItem("project", item.id)} />
                    </article>
                  ))}
                </div>
              ) : <EmptyState label="No projects added yet." />
            )}
          </section>
        </div>
      </div>

      {editor && (
        <div className="fixed inset-0 z-20 overflow-y-auto bg-[#171816]/50 p-4 sm:grid sm:place-items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setEditor(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="editor-title" className="mx-auto my-6 w-full max-w-2xl rounded-2xl bg-[#f7f7f4] p-5 text-[#171816] sm:my-0 sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="eyebrow muted mb-2">{editor.id ? "EDIT ENTRY" : "NEW ENTRY"}</p>
                <h2 id="editor-title" className="text-2xl font-semibold tracking-tight">{editor.kind === "project" ? `${editor.id ? "Edit" : "Add"} project` : `${editor.id ? "Edit" : "Add"} experience`}</h2>
              </div>
              <button onClick={() => setEditor(null)} aria-label="Close" className="rounded-full p-2 hover:bg-white"><X size={20} /></button>
            </div>
            {editor.kind === "experience" ? (
              <ExperienceForm key={editor.id ?? "new-experience"} initial={editor.data} onSave={saveItem} onCancel={() => setEditor(null)} saving={saving} />
            ) : (
              <ProjectForm key={editor.id ?? "new-project"} initial={editor.data} onSave={saveItem} onCancel={() => setEditor(null)} saving={saving} />
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <button onClick={onEdit} className="rounded-full border border-[#dedfd8] px-4 py-2 text-sm hover:bg-[#f7f7f4]">Edit</button>
      <button onClick={onDelete} aria-label="Delete" className="rounded-full border border-[#dedfd8] p-2 text-[#70736d] hover:border-red-200 hover:text-red-700"><Trash2 size={16} /></button>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#dedfd8] px-5 py-12 text-center">
      <FolderKanban className="mx-auto mb-3 text-[#a2a59c]" size={24} />
      <p className="text-sm text-[#70736d]">{label}</p>
    </div>
  );
}

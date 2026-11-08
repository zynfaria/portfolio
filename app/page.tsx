import {
  ArrowDownRight,
  ArrowUpRight,
  Code2,
  Github,
  MoveUpRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { getPortfolioContent } from "@/lib/portfolio-db";
import { projectCover } from "@/lib/project-cover";

export const dynamic = "force-dynamic";

const services = [
  {
    n: "01",
    title: "Full-stack development",
    desc: "From thoughtful interfaces to reliable APIs and databases, I build complete web products with care.",
    Icon: Code2,
  },
  {
    n: "02",
    title: "E-commerce & Shopify",
    desc: "Storefronts and commerce experiences designed to make shopping simple, fast, and memorable.",
    Icon: ShoppingBag,
  },
  {
    n: "03",
    title: "AI-powered products",
    desc: "Practical AI integrations that bring smarter workflows and useful capabilities into products.",
    Icon: Sparkles,
  },
];

export default async function Home() {
  const { profile, experiences, projects } = await getPortfolioContent();

  return (
    <main>
      <header className="container flex h-[88px] items-center justify-between">
        <a href="#home" className="text-lg font-bold tracking-[-.06em]">
          {profile.name.split(/\s+/).map((part) => part[0]).join("")}
          <span className="text-[#8abf43]">.</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Main navigation">
          <a className="nav-link" href="#work">Work</a>
          {experiences.length > 0 && <a className="nav-link" href="#experience">Experience</a>}
          <a className="nav-link" href="#about">About</a>
          <a className="nav-link" href="#expertise">Expertise</a>
        </nav>
        <a href="#contact" className="rounded-full border border-[#171816] px-5 py-2.5 text-sm transition hover:bg-[#171816] hover:text-white">
          Let’s talk <MoveUpRight className="ml-1 inline" size={14} />
        </a>
      </header>

      <section id="home" className="container hero-surface pb-28 pt-20 md:pb-36 md:pt-28">
        <div className="mb-9 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#91c94b]" />
          <p className="eyebrow muted">{profile.role} · Open to opportunities</p>
        </div>
        <h1 className="display max-w-[1050px]">{profile.headline}</h1>
        <div className="mt-12 flex flex-col justify-between gap-9 md:flex-row md:items-end">
          <p className="max-w-[570px] text-lg leading-relaxed muted">{profile.intro}</p>
          <a href="#work" className="arrow-link w-fit">
            Explore my work <span><ArrowDownRight size={17} /></span>
          </a>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-6 md:grid-cols-4">
          {["Frontend & UI", "Backend & APIs", "Shopify & commerce", "AI integrations"].map((item) => (
            <p key={item} className="text-sm muted">{item}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow muted mb-5">01 / WHAT I DO</p>
              <h2 className="heading">From first idea<br />to finished product.</h2>
            </div>
            <p className="max-w-[330px] text-sm leading-relaxed muted">
              Engineering, product thinking, and practical problem-solving — from the first component to the final deployment.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map(({ n, title, desc, Icon }) => (
              <article key={n} className="rounded-2xl border border-[var(--line)] p-7 md:p-8">
                <div className="mb-14 flex items-center justify-between">
                  <span className="eyebrow muted">{n}</span>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed muted">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {experiences.length > 0 && (
        <section id="experience" className="section">
          <div className="container">
            <div className="mb-14">
              <p className="eyebrow muted mb-5">02 / EXPERIENCE</p>
              <h2 className="heading">Where I’ve<br />made an impact.</h2>
            </div>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {experiences.map(({ id, data }) => (
                <article key={id} className="grid gap-4 py-8 md:grid-cols-[.8fr_1.2fr] md:gap-10">
                  <div>
                    <p className="text-sm muted">{data.startDate}{data.endDate ? ` — ${data.endDate}` : ""}</p>
                    {data.location && <p className="mt-1 text-sm muted">{data.location}</p>}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">{data.role}</h3>
                    <p className="mt-1 text-sm">{data.company}</p>
                    {data.description && <p className="mt-4 max-w-[650px] whitespace-pre-line text-sm leading-relaxed muted">{data.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="work" className="section">
        <div className="container">
          <div className="mb-14 flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow muted mb-5">03 / SELECTED WORK</p>
              <h2 className="heading">Selected work<span className="text-[#8abf43]">.</span></h2>
            </div>
            <span className="hidden text-xs muted md:block">A snapshot of what I build</span>
          </div>
          {projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {projects.map(({ id, data }) => {
                return (
                  <article key={id} className="project-card overflow-hidden rounded-2xl border border-[var(--line)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e5e0f3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={data.imageUrl || projectCover(data.category)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <p className="eyebrow muted mb-4">{data.category || "PROJECT"}</p>
                      <h3 className="mb-2 text-xl font-semibold tracking-tight">{data.title}</h3>
                      <p className="mb-6 text-sm leading-relaxed muted">{data.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs muted">{tag}</span>
                        ))}
                      </div>
                      {(data.projectUrl || data.sourceUrl) && (
                        <div className="mt-6 flex gap-5 text-sm">
                          {data.projectUrl && <a className="arrow-link" href={data.projectUrl} target="_blank" rel="noreferrer">Live project <span><ArrowUpRight size={14} /></span></a>}
                          {data.sourceUrl && <a className="arrow-link" href={data.sourceUrl} target="_blank" rel="noreferrer">Source <span><ArrowUpRight size={14} /></span></a>}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="border-y border-[var(--line)] py-8 text-sm muted">Projects are on the way. Check back soon.</p>
          )}
          <p className="mt-5 text-xs muted">Starter examples are placeholders. Replace them with real projects and outcomes in the admin area.</p>
        </div>
      </section>

      <section id="about" className="section bg-[#eeefe9]">
        <div className="container grid gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow muted mb-5">04 / ABOUT ME</p>
            <h2 className="heading">Engineer by craft.<br /><span className="italic font-normal">Builder by nature.</span></h2>
          </div>
          <div className="max-w-[620px]">
            <p className="text-2xl leading-snug tracking-tight">{profile.intro}</p>
            <p className="mt-7 whitespace-pre-line leading-relaxed muted">{profile.about}</p>
            {profile.resumeSummary && <p className="mt-5 whitespace-pre-line leading-relaxed muted">{profile.resumeSummary}</p>}
            <div className="mt-8 flex flex-wrap gap-6">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="arrow-link">
                  <Github size={16} /> More on GitHub <span><ArrowUpRight size={16} /></span>
                </a>
              )}
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="arrow-link">
                  View resume <span><ArrowUpRight size={16} /></span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="section">
        <div className="container">
          <p className="eyebrow muted mb-5">05 / TOOLS & TECHNOLOGIES</p>
          <div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]">
            <h2 className="heading">The right tools<br />for the job.</h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
              {profile.skills.map((skill) => {
                const separator = skill.indexOf(":");
                const label = separator >= 0 ? skill.slice(0, separator) : "Skill";
                const value = separator >= 0 ? skill.slice(separator + 1).trim() : skill;
                return (
                  <div key={skill} className="border-t border-[var(--line)] pt-4">
                    <p className="mb-2 text-sm font-semibold">{label}</p>
                    <p className="text-sm leading-relaxed muted">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#171816] py-24 text-[#f7f7f4] md:py-32">
        <div className="container">
          <p className="eyebrow mb-6 text-white/50">06 / HAVE A PROJECT IN MIND?</p>
          <h2 className="max-w-[850px] text-[clamp(3.5rem,9vw,7.5rem)] font-semibold leading-[.95] tracking-[-.08em]">
            Let’s make<br /><span className="italic font-normal">something matter.</span>
          </h2>
          <div className="mt-14 flex flex-col justify-between gap-8 border-t border-white/20 pt-7 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm text-white/50">Find me online</p>
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 text-sm hover:text-[#b9f36b]">
                  {profile.email} <ArrowUpRight size={14} />
                </a>
              ) : profile.githubUrl ? (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-[#b9f36b]">
                  <Github size={17} /> GitHub <ArrowUpRight size={14} />
                </a>
              ) : <p className="text-sm text-white/50">Contact details coming soon.</p>}
            </div>
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex w-fit items-center gap-3 rounded-full bg-[#b9f36b] px-6 py-3 text-sm font-semibold text-[#171816] transition hover:bg-white">
                Connect with me <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <div className="mt-20 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/40 sm:flex-row">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <a href="/admin" className="hover:text-white">Admin</a>
            <a href="#home" className="hover:text-white">Back to top ↑</a>
          </div>
        </div>
      </section>
    </main>
  );
}

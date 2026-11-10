import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Github,
  MoveUpRight,
  ShoppingBag,
  Sparkles,
  Workflow,
} from "lucide-react";
import { getPortfolioContent } from "@/lib/portfolio-db";
import ProjectImageSlider from "@/components/project-image-slider";

export const dynamic = "force-dynamic";

const services = [
  {
    n: "01",
    title: "Full-stack products",
    desc: "Interfaces, APIs, databases, and deployment — connected into one thoughtful product.",
    Icon: Code2,
    className: "service-feature",
  },
  {
    n: "02",
    title: "Commerce experiences",
    desc: "Shopify storefronts and eCommerce flows built around the people using them.",
    Icon: ShoppingBag,
    className: "",
  },
  {
    n: "03",
    title: "Intelligent systems",
    desc: "Useful AI integrations that make products and workflows more capable.",
    Icon: Sparkles,
    className: "",
  },
];

export default async function Home() {
  const { profile, experiences, projects } = await getPortfolioContent();

  return (
    <main id="home">
      <header className="site-header container">
        <a href="#home" className="brand-mark" aria-label={profile.name}>
          {profile.name.split(/\s+/).map((part) => part[0]).join("")}<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          {experiences.length > 0 && <a href="#experience">Experience</a>}
          <a href="#about">About</a>
        </nav>
        <a href="#contact" className="header-cta action-button action-button-secondary">Let’s talk <MoveUpRight size={14} /></a>
      </header>

      <section className="hero container">
        <div className="hero-intro">
          <span className="eyebrow"><i /> INDEPENDENT SOFTWARE ENGINEER</span>
          <p className="hero-kicker">Digital craft / Product thinking / Engineering</p>
        </div>
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-manifesto">Building <em>useful things</em> for the digital world.</p>
        <p className="hero-summary">{profile.intro}</p>
        <div className="hero-actions" aria-label="Profile actions">
          {profile.resumeUrl && <a className="action-button action-button-primary" href="/api/resume" download>Download resume <ArrowDown size={15} /></a>}
          {profile.githubUrl && <a className="action-button action-button-secondary" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>}
        </div>
        <a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>

        <div className="hero-board" aria-label="Areas of engineering">
          <article className="board-card board-profile">
            <div className="card-topline"><span>01 / THE CRAFT</span><Code2 size={15} /></div>
            <div className="profile-monogram">{profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}</div>
            <h2>Made with intent.</h2>
            <p>Thoughtful digital products, from the first sketch to production.</p>
            <span className="card-index">DESIGN × ENGINEERING</span>
          </article>

          <article className="board-card board-focus">
            <div className="card-topline"><span>THE FOCUS</span><span className="live-dot">AVAILABLE FOR IDEAS</span></div>
            <h2>{profile.role}</h2>
            <p>{profile.headline}</p>
            <div className="focus-tags"><span>Frontend</span><span>Backend</span><span>Commerce</span><span>AI</span></div>
          </article>

          <article className="board-card board-contact">
            <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
            <h2>Let’s build<br />what’s next.</h2>
            <a href="#contact" className="light-pill">Start a conversation <ArrowUpRight size={14} /></a>
            <span className="card-index">OPEN TO COLLABORATION</span>
          </article>

          <div className="clock-card" aria-hidden="true">
            <div className="clock-face"><i className="clock-hour" /><i className="clock-minute" /><i className="clock-second" /><b /></div>
            <span>TIME WELL SPENT</span>
          </div>

          <article className="board-card board-code">
            <div className="card-topline"><span>02 / SYSTEMS</span><Workflow size={15} /></div>
            <div className="terminal-lines"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <p>Clean foundations.<br /><strong>Room to grow.</strong></p>
          </article>

          <article className="board-card board-commerce">
            <div className="card-topline"><span>03 / COMMERCE</span><ShoppingBag size={15} /></div>
            <div className="commerce-stack"><span>STORE</span><span>PRODUCT</span><span>CHECKOUT</span></div>
            <p>From discovery<br />to checkout.</p>
          </article>
        </div>
      </section>

      <section id="work" className="section showcase-section">
        <div className="container">
          <div className="section-title centered-title">
            <p className="eyebrow">SELECTED PROJECTS / 01</p>
            <h2>VENTURE <em>SHOWCASE</em></h2>
            <p>A selection of products, platforms, and experiments.</p>
          </div>
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map(({ id, data }, index) => (
                <article key={id} className={`project-card project-card-${index % 3}`}>
                  <div className="project-media">
                    <ProjectImageSlider
                      images={data.imageUrls?.length ? data.imageUrls : data.imageUrl ? [data.imageUrl] : []}
                      category={data.category}
                      label={`${data.title} preview`}
                    />
                    <span className="project-number">0{index + 1}</span>
                  </div>
                  <div className="project-copy">
                    <div className="project-meta"><span>{data.category || "PROJECT"}</span><span>{data.tags.slice(0, 2).join(" / ")}</span></div>
                    <h3>{data.title}</h3>
                    <p>{data.description}</p>
                    <div className="project-bottom">
                      <div className="tag-list">{data.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <div className="project-links">
                        {data.projectUrl && <a href={data.projectUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${data.title}`}><ArrowUpRight size={17} /></a>}
                        {data.sourceUrl && <a href={data.sourceUrl} target="_blank" rel="noreferrer" aria-label={`View source for ${data.title}`}><Github size={16} /></a>}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-projects">Projects will appear here as they are added in the portfolio dashboard.</p>
          )}
        </div>
      </section>

      <section id="approach" className="section approach-section">
        <div className="container approach-layout">
          <div className="approach-copy">
            <p className="eyebrow">HOW I THINK / 02</p>
            <h2>Experiment with<br /><em>intelligent systems.</em></h2>
            <p className="section-lead">The best technology is not there to impress. It is there to make an experience clearer, faster, and more useful.</p>
            <div className="service-list">
              {services.map(({ n, title, desc, Icon, className }) => (
                <article className={`service-row ${className}`} key={n}>
                  <span className="service-number">{n}</span>
                  <div><h3>{title}</h3><p>{desc}</p></div>
                  <Icon size={19} strokeWidth={1.5} />
                </article>
              ))}
            </div>
          </div>
          <div className="system-visual" aria-hidden="true">
            <div className="system-window">
              <div className="window-bar"><i /><i /><i /><span>WORKFLOW / STUDIO</span></div>
              <div className="system-prompt"><span>✳</span><div><b>What are we building today?</b><small>Turning an idea into a working product.</small></div></div>
              <div className="system-response"><i /><i /><i /></div>
              <div className="system-input">Describe your next idea <span>↗</span></div>
            </div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <span className="visual-caption">IDEAS INTO INTERFACES</span>
          </div>
        </div>
      </section>

      <section className="section tools-section">
        <div className="container">
          <div className="section-title centered-title skillset-heading">
            <p className="eyebrow">MY SKILLSET</p>
            <h2>The Magic <em>Behind</em></h2>
          </div>
          <div className="skill-cloud">
            {profile.skills.map((skill, index) => {
              const marks: Record<string, string> = {
                React: "✿", "Next.js": "▲", TypeScript: "TS", JavaScript: "JS",
                "Tailwind CSS": "⌁", "Framer Motion": "✧", GSAP: "GS",
                Redux: "◉", "Context API": "Ctx", "Node.js": "⬡", "Express.js": "Ex",
                FastAPI: "ϟ", "Spring Boot": "✣", Python: "Py", "OpenAI API": "✳",
                "Machine Learning": "◉", "Prompt Engineering": "✦", MongoDB: "◈",
                MySQL: "◆", Firebase: "♨", JWT: "▣", OAuth: "↗",
                "Firebase Auth": "⚿", Git: "⑂", GitHub: "◐", Postman: "◉",
                "VS Code": "▤", Vercel: "▲", Netlify: "◒", Render: "◍",
                Railway: "▣", Docker: "◉",
              };
              return (
                <span className="skill-chip" data-tone={index % 7} key={skill}>
                  <i aria-hidden="true">{marks[skill] || skill.slice(0, 2).toUpperCase()}</i>
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {experiences.length > 0 && (
        <section id="experience" className="section experience-section">
          <div className="container">
            <p className="eyebrow">THE JOURNEY / 04</p>
            <h2 className="section-heading">Experience <em>in practice.</em></h2>
            <div className="experience-list">
              {experiences.map(({ id, data }) => (
                <article key={id} className="experience-row">
                  <div><span>{data.startDate}{data.endDate ? ` — ${data.endDate}` : ""}</span>{data.location && <small>{data.location}</small>}</div>
                  <div><h3>{data.role}</h3><p className="experience-company">{data.company}</p>{data.description && <p className="experience-description">{data.description}</p>}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="about" className="section about-section">
        <div className="container about-layout">
          <div><p className="eyebrow">A LITTLE ABOUT ME / 05</p><h2>Building the bridge<br />between <em>ideas & impact.</em></h2></div>
          <div className="about-copy">
            <p className="about-intro">{profile.about || profile.intro}</p>
            {profile.resumeSummary && <p>{profile.resumeSummary}</p>}
            <div className="about-links">
              {profile.resumeUrl && <a className="action-button action-button-primary" href="/api/resume" download>Download resume <ArrowDown size={15} /></a>}
              {profile.githubUrl && <a className="action-button action-button-secondary" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a>}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <p className="eyebrow">HAVE AN IDEA? / 06</p>
          <h2>Let’s create<br /><em>something real.</em></h2>
          <div className="contact-bottom">
            <p>Good work starts with a good conversation.</p>
            {profile.email ? <a className="contact-button action-button action-button-primary" href={`mailto:${profile.email}`}>Get in touch <ArrowUpRight size={16} /></a> : profile.githubUrl ? <a className="contact-button action-button action-button-primary" href={profile.githubUrl} target="_blank" rel="noreferrer">Find me on GitHub <ArrowUpRight size={16} /></a> : <span className="muted-contact">Contact details coming soon.</span>}
          </div>
          <footer className="site-footer">
            <a href="#home" className="footer-brand">{profile.name}<span>.</span></a>
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <a href="/admin">Admin</a>
            <a href="#home">Back to top ↑</a>
          </footer>
        </div>
      </section>
    </main>
  );
}

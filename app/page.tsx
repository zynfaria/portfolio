import { ArrowDown, ArrowUpRight, Braces, Bot, Code2, Github, Layers3, ShoppingBag, Sparkles, Workflow } from "lucide-react";

const disciplines = [
  { number: "01", title: "Product engineering", detail: "End-to-end web applications, from interface architecture to backend services.", icon: Code2, tags: ["React", "Next.js", "TypeScript"] },
  { number: "02", title: "Commerce experiences", detail: "Flexible Shopify storefronts and e-commerce experiences built around the customer journey.", icon: ShoppingBag, tags: ["Shopify", "Storefronts", "Integrations"] },
  { number: "03", title: "Applied AI", detail: "AI features integrated into real products to make workflows more capable and useful.", icon: Bot, tags: ["AI APIs", "Automation", "Product features"] },
];

const principles = [
  ["01", "Understand the problem", "Start with the user, the business goal, and the problem worth solving."],
  ["02", "Build the whole system", "Connect the interface, application logic, data, and integrations into one coherent product."],
  ["03", "Refine the details", "Care about clarity, performance, accessibility, and the small interactions people notice."],
];

const stack = [
  ["Frontend", "React · Next.js · TypeScript"],
  ["Backend", "APIs · Server-side development"],
  ["Commerce", "Shopify · E-commerce"],
  ["AI", "AI APIs · Intelligent workflows"],
  ["Styling", "Tailwind CSS · Responsive UI"],
  ["Workflow", "Git · GitHub · Deployment"],
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="container nav-wrap">
        <a href="#top" className="wordmark" aria-label="Jose Berrios home">JB<span>.</span></a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#expertise">Expertise</a><a href="#approach">Approach</a><a href="#about">About</a>
        </nav>
        <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={14}/></a>
      </header>

      <section id="top" className="hero container">
        <div className="hero-topline"><span className="status-dot"/> INDEPENDENT SOFTWARE ENGINEER <span className="topline-index">PORTFOLIO / 2026</span></div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">DESIGN-MINDED ENGINEERING</p>
            <h1>Building<br/>the <em>next</em><br/>useful thing<span className="accent-dot">.</span></h1>
            <p className="hero-description">I’m Jose Berrios — a full-stack software engineer turning complex ideas into clear, capable digital products.</p>
            <div className="hero-actions"><a className="primary-link" href="#expertise">Explore what I do <ArrowDown size={16}/></a><a className="quiet-link" href="https://github.com/zynfaria" target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ArrowUpRight size={13}/></a></div>
          </div>
          <div className="hero-aside">
            <div className="orbit-art" aria-hidden="true">
              <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit-core"><Braces size={42} strokeWidth={1.1}/></div>
              <span className="orbit-label label-a">FRONTEND</span><span className="orbit-label label-b">BACKEND</span><span className="orbit-label label-c">AI / COMMERCE</span>
            </div>
            <div className="aside-note"><span className="eyebrow">THE THROUGH LINE</span><p>Thoughtful interfaces.<br/>Solid engineering.<br/>Useful technology.</p></div>
          </div>
        </div>
        <div className="hero-bottom"><span>BASED IN THE UNITED STATES</span><span>WEB · COMMERCE · AI</span><a href="#about">SCROLL TO EXPLORE <ArrowDown size={12}/></a></div>
      </section>

      <section id="expertise" className="section container">
        <div className="section-heading"><div><p className="eyebrow">01 / WHAT I BUILD</p><h2>One engineer.<br/><em>End-to-end</em> thinking.</h2></div><p className="section-intro">I work across the layers of a digital product — bringing frontend craft, backend thinking, commerce, and AI together.</p></div>
        <div className="discipline-grid">{disciplines.map(({number,title,detail,icon:Icon,tags})=><article className="discipline-card" key={number}><div className="card-top"><span>{number} / CAPABILITY</span><Icon size={22} strokeWidth={1.4}/></div><h3>{title}</h3><p>{detail}</p><div className="tag-row">{tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div>
      </section>

      <section id="approach" className="approach-band">
        <div className="container approach-inner"><div className="approach-title"><p className="eyebrow">02 / HOW I WORK</p><h2>Good software<br/>is <em>felt</em>, not just seen.</h2><p>I care about the experience on the screen and the engineering that makes it dependable underneath.</p></div><div className="principles">{principles.map(([n,title,detail])=><div className="principle" key={n}><span>{n}</span><div><h3>{title}</h3><p>{detail}</p></div><ArrowUpRight size={17}/></div>)}</div></div>
      </section>

      <section id="about" className="section container">
        <div className="about-grid"><div><p className="eyebrow">03 / A LITTLE ABOUT ME</p><h2>Curious by nature.<br/><em>Engineer</em> by craft.</h2></div><div className="about-copy"><p className="about-lead">I like making technology useful — taking an idea, understanding what it needs to become, and building the pieces that bring it to life.</p><p>My work spans frontend and backend development, Shopify e-commerce, and AI integrations. I enjoy moving between the details of implementation and the bigger picture of how a product should work for the people using it.</p><p>I believe good engineering is more than getting code to run. It is about making considered decisions, solving the right problem, and creating something that can grow.</p><a className="text-link" href="https://github.com/zynfaria" target="_blank" rel="noreferrer">Explore my code <ArrowUpRight size={15}/></a></div></div>
      </section>

      <section className="stack-section"><div className="container stack-grid"><div><p className="eyebrow">04 / TOOLS OF THE TRADE</p><h2>The stack is<br/><em>the starting point.</em></h2></div><div className="stack-list">{stack.map(([name,items])=><div className="stack-item" key={name}><span>{name}</span><p>{items}</p></div>)}</div></div></section>

      <footer id="contact" className="footer"><div className="container"><p className="eyebrow">05 / HAVE SOMETHING IN MIND?</p><div className="footer-main"><h2>Let’s build<br/><em>something useful.</em></h2><a className="contact-button" href="https://github.com/zynfaria" target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight size={18}/></a></div><div className="footer-bottom"><a href="#top" className="wordmark">JB<span>.</span></a><span>© {new Date().getFullYear()} JOSE BERRIOS</span><a href="https://github.com/zynfaria" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12}/></a><span>BUILT WITH INTENTION.</span></div></div></footer>
    </main>
  );
}

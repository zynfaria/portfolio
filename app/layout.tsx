import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Portfolio — Full-Stack Engineer", description: "A portfolio of web development, e-commerce, and product work." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <svg
          className="background-lines"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="meteor-trail" x1="0" y1="0" x2="-210" y2="130" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffef4" />
              <stop offset=".08" stopColor="#d8f6ac" />
              <stop offset="1" stopColor="#b9f36b" stopOpacity="0" />
            </linearGradient>
            <filter id="meteor-glow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <g className="meteor" transform="translate(990 115)">
            <path className="meteor-trail" d="M0 0-210-130" />
            <circle className="meteor-core" r="2" />
          </g>
          <g className="meteor meteor-down-left" transform="translate(510 65)">
            <path className="meteor-trail" d="M0 0 160-100" />
            <circle className="meteor-core" r="1.7" />
          </g>
          <g className="meteor meteor-up-left" transform="translate(1330 360)">
            <path className="meteor-trail" d="M0 0 190 118" />
            <circle className="meteor-core" r="1.8" />
          </g>
          <g className="meteor" transform="translate(780 505)">
            <path className="meteor-trail" d="M0 0-145-90" />
            <circle className="meteor-core" r="1.6" />
          </g>
          <g className="meteor meteor-up-right" transform="translate(260 370)">
            <path className="meteor-trail" d="M0 0-185 115" />
            <circle className="meteor-core" r="1.8" />
          </g>
          <g className="meteor meteor-down-left" transform="translate(1150 740)">
            <path className="meteor-trail" d="M0 0 220-136" />
            <circle className="meteor-core" r="2" />
          </g>
        </svg>
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}

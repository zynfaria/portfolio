import type { Metadata } from "next";
import "./globals.css";
import { getPortfolioContent } from "@/lib/portfolio-db";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioContent();

  return {
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

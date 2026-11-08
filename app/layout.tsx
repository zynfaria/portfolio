import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Jose Berrios — Full-Stack Engineer", description: "Jose Berrios builds thoughtful web experiences, Shopify commerce, and AI-powered products." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

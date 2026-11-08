import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Portfolio — Full-Stack Engineer", description: "A portfolio of web development, e-commerce, and product work." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

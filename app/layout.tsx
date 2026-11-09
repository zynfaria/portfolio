import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jose Berrios — Full-Stack Software Engineer",
  description:
    "Jose Berrios builds full-stack web products, Shopify commerce experiences, and practical AI-powered features.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Economic indicators & the difference principle",
  description:
    "Explore U.S. macro proxies alongside a transparent, defeasible reading related to Rawls’s difference principle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-sm font-medium tracking-tight text-[var(--foreground)]">
              Difference principle · indicators
            </Link>
            <nav className="flex gap-4 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                Dashboard
              </Link>
              <Link href="/methodology" className="hover:text-[var(--accent)] transition-colors">
                Methodology
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}

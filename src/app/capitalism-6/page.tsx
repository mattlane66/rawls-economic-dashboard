import type { Metadata } from "next";
import { INDICATORS } from "@/lib/indicators";

export const metadata: Metadata = {
  title: "Capitalism 6.0",
};

function lensFromChannel(channel: string): string {
  if (channel === "power-concentration") return "Primary lens: non-domination";
  return "Primary lens: floor-raising";
}

export default function Capitalism6Page() {
  return (
    <article className="max-w-none space-y-8 text-[var(--foreground)]">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Capitalism 6.0 lens</h1>
        <p className="text-[var(--muted)] leading-relaxed">
          This page turns the rule “keep what does not dominate and does raise the floor” into explicit dashboard
          design constraints. It does not claim to settle normative debates. It shows which empirical signals are being
          treated as proxies for each lens.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-[var(--card)]/80 p-5">
        <h2 className="text-lg font-medium">Two-lens decision rule</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)] leading-relaxed">
          <li>
            <span className="text-[var(--foreground)]">Non-domination:</span> reject arrangements that increase
            concentrated control over livelihoods, market access, or political leverage.
          </li>
          <li>
            <span className="text-[var(--foreground)]">Floor-raising:</span> prefer arrangements that improve
            baseline security and opportunity for those near the bottom.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Indicator map</h2>
        <ul className="space-y-3">
          {INDICATORS.map((indicator) => (
            <li key={indicator.id} className="rounded-xl border border-white/10 bg-[var(--card)]/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{indicator.label}</p>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-[var(--muted)]">
                  {lensFromChannel(indicator.floorChannel)}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{indicator.description}</p>
              <p className="mt-2 text-xs text-[var(--foreground)]/90 leading-relaxed">
                Mapping: {indicator.c6Mapping}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                FRED series: <span className="font-mono">{indicator.fredSeriesId}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 text-[var(--muted)] leading-relaxed">
        <h2 className="text-lg font-medium text-[var(--foreground)]">How your broader platform fits</h2>
        <p>
          Your proposals on anti-cronyism, anti-monopoly, universal essentials, and financial-system redesign can be
          represented as policy modules evaluated against these same lenses. The dashboard currently tracks only a
          narrow empirical subset, so it should be treated as a diagnostics panel, not a complete institutional score.
        </p>
      </section>
    </article>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
};

export default function MethodologyPage() {
  return (
    <article className="max-w-none space-y-6 text-[var(--foreground)]">
      <h1 className="text-2xl font-semibold tracking-tight">Methodology</h1>

      <section className="space-y-3 text-[var(--muted)] leading-relaxed">
        <h2 className="text-lg font-medium text-[var(--foreground)]">What the difference principle asks</h2>
        <p>
          In Rawls’s theory, the <strong className="text-[var(--foreground)]">difference principle</strong> permits
          social and economic inequalities only if they are arranged so that they are to the greatest benefit of the
          least-advantaged members of society (relative to a carefully specified baseline). That is a normative
          standard about institutions and expectations over time, not a single regression on quarterly data.
        </p>
      </section>

      <section className="space-y-3 text-[var(--muted)] leading-relaxed">
        <h2 className="text-lg font-medium text-[var(--foreground)]">What this app does instead</h2>
        <p>
          The dashboard links a small set of U.S. macro series from{" "}
          <a
            href="https://fred.stlouisfed.org/"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            FRED
          </a>{" "}
          to <strong className="text-[var(--foreground)]">empirical proxies</strong> for how the worst off might be
          doing. Each series has a declared polarity (for example, lower unemployment as better for a narrow labor
          market proxy). The app measures percentage change from the first to the last observation in your chosen
          window and labels the move as supportive, neutral, or in tension with that polarity when the move is large
          enough.
        </p>
        <p>
          The composite label is a simple majority vote across indicators with known trends. It is a conversation
          starter, not a social welfare function.
        </p>
      </section>

      <section className="space-y-3 text-[var(--muted)] leading-relaxed">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Live data</h2>
        <p>
          Add a{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[var(--foreground)]">
            FRED_API_KEY
          </code>{" "}
          to <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm">.env.local</code> (see{" "}
          <a
            href="https://fred.stlouisfed.org/docs/api/api_key.html"
            className="text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            FRED API keys
          </a>
          ). Without a key, the API returns clearly marked synthetic series so the UI still works.
        </p>
      </section>

      <section className="space-y-3 text-[var(--muted)] leading-relaxed">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Limits</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Aggregates hide distribution within the bottom of the distribution.</li>
          <li>Inequality can rise while the worst off gain; Gini alone cannot settle difference-principle questions.</li>
          <li>Philosophical specification of the least-advantaged group is underdetermined by GDP charts.</li>
        </ul>
      </section>
    </article>
  );
}

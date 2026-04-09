"use client";

import { useEffect, useState } from "react";

type Trend = "supportive" | "neutral" | "tension" | "unknown";

interface ApiResult {
  definition: {
    id: string;
    label: string;
    description: string;
    fredSeriesId: string;
    caveat: string;
  };
  changePct: number | null;
  trend: Trend;
  summary: string;
  observations: { date: string; value: number }[];
}

interface ApiPayload {
  synthetic: boolean;
  windowYears: number;
  verdict: string;
  verdictLabel: string;
  results: ApiResult[];
  note: string;
}

function trendStyles(t: Trend): string {
  switch (t) {
    case "supportive":
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    case "tension":
      return "text-red-300 bg-red-400/10 border-red-400/30";
    case "neutral":
      return "text-amber-200 bg-amber-400/10 border-amber-400/30";
    default:
      return "text-[var(--muted)] bg-white/5 border-white/10";
  }
}

export default function Home() {
  const [years, setYears] = useState(10);
  const [data, setData] = useState<ApiPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/indicators?years=${years}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json: ApiPayload) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load indicator data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [years]);

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Do recent U.S. indicators fit a simple difference-principle proxy?
        </h1>
        <p className="text-[var(--muted)] leading-relaxed">
          This app compares a handful of macro series to a deliberately narrow, stated interpretation of how the
          least-advantaged might fare. It does not prove or disprove philosophical claims; it makes the mapping
          explicit so you can argue with it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-[var(--muted)]" htmlFor="years">
            Lookback (years)
          </label>
          <select
            id="years"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="rounded-lg border border-white/15 bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            {[5, 10, 15, 20].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {data?.synthetic && (
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs text-amber-200">
              Synthetic data
            </span>
          )}
        </div>
      </div>

      {loading && <p className="text-[var(--muted)]">Loading…</p>}
      {error && <p className="text-red-300">{error}</p>}

      {data && !loading && (
        <>
          <section
            className="rounded-2xl border border-white/10 bg-[var(--card)] p-6 shadow-lg shadow-black/20"
            aria-live="polite"
          >
            <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Composite (heuristic)</p>
            <p className="mt-2 text-xl font-medium text-[var(--foreground)]">{data.verdictLabel}</p>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{data.note}</p>
          </section>

          <ul className="space-y-4">
            {data.results.map((r) => (
              <li
                key={r.definition.id}
                className="rounded-2xl border border-white/10 bg-[var(--card)]/80 p-5 backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-[var(--foreground)]">{r.definition.label}</h2>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      FRED: <span className="font-mono">{r.definition.fredSeriesId}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${trendStyles(r.trend)}`}
                  >
                    {r.trend}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{r.definition.description}</p>
                {r.changePct !== null && (
                  <p className="mt-2 font-mono text-sm text-[var(--foreground)]">
                    ≈ {r.changePct > 0 ? "+" : ""}
                    {r.changePct.toFixed(2)}% over window
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/90">{r.summary}</p>
                <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed border-t border-white/5 pt-3">
                  Caveat: {r.definition.caveat}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

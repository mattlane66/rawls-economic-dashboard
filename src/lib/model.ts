import type { AlignmentPolarity, IndicatorDefinition } from "./indicators";

export interface Observation {
  date: string;
  value: number;
}

export interface IndicatorResult {
  definition: IndicatorDefinition;
  observations: Observation[];
  changePct: number | null;
  /** Approximate annualized log trend (% per year) when defined */
  annualizedTrendPct: number | null;
  trend: "supportive" | "neutral" | "tension" | "unknown";
  summary: string;
}

function yearsBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

/**
 * Fit a simple OLS line to log(values) over time and return the slope
 * in log-units per calendar year. If values are not strictly positive
 * or there are too few distinct time points, returns null.
 */
function logTrendPerYear(observations: Observation[]): number | null {
  if (observations.length < 2) return null;

  const parsed = observations
    .map((o) => {
      const v = o.value;
      const d = new Date(o.date);
      return Number.isFinite(v) && v > 0 && !Number.isNaN(d.getTime())
        ? { t: d, v }
        : null;
    })
    .filter((x): x is { t: Date; v: number } => x !== null);

  if (parsed.length < 2) return null;

  const t0 = parsed[0]!.t;
  const xs = parsed.map((p) => yearsBetween(t0, p.t));
  const ys = parsed.map((p) => Math.log(p.v));

  const n = xs.length;
  const meanX = xs.reduce((a, x) => a + x, 0) / n;
  const meanY = ys.reduce((a, y) => a + y, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    const dx = xs[i]! - meanX;
    const dy = ys[i]! - meanY;
    num += dx * dy;
    den += dx * dx;
  }

  if (den === 0) return null;
  const slope = num / den; // log-units per year
  return slope;
}

function pctChange(first: number, last: number): number {
  if (first === 0) return 0;
  return ((last - first) / Math.abs(first)) * 100;
}

function classifyTrend(
  changePct: number,
  polarity: AlignmentPolarity,
  threshold = 0.75,
): "supportive" | "neutral" | "tension" {
  const magnitude = Math.abs(changePct);
  if (magnitude < threshold) return "neutral";

  const improved =
    polarity === "higher_supports_proxy" ? changePct > 0 : changePct < 0;

  return improved ? "supportive" : "tension";
}

export function evaluateIndicator(
  definition: IndicatorDefinition,
  observations: Observation[],
): IndicatorResult {
  if (observations.length < 2) {
    return {
      definition,
      observations,
      changePct: null,
      trend: "unknown",
      summary: "Not enough data points in this window.",
    };
  }

  const sorted = [...observations].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0]!.value;
  const last = sorted[sorted.length - 1]!.value;
  const change = pctChange(first, last);
  const slope = logTrendPerYear(sorted);

  const annualizedTrendPct =
    slope === null ? null : (Math.exp(slope) - 1) * 100;

  const trendSource = annualizedTrendPct ?? change;
  const trend = classifyTrend(trendSource, definition.polarity);

  const directionWord =
    annualizedTrendPct !== null
      ? annualizedTrendPct >= 0
        ? "has tended to rise"
        : "has tended to fall"
      : change >= 0
        ? "rose"
        : "fell";

  const polarityPhrase = definition.polarity.replace(/_/g, " ");

  const magnitudeText =
    annualizedTrendPct !== null
      ? `${Math.abs(annualizedTrendPct).toFixed(2)}% per year (log trend)`
      : `${Math.abs(change).toFixed(1)}% over the window`;

  const summary = `Over the selected window, the series ${directionWord} at roughly ${magnitudeText}. Given this indicator’s polarity (${polarityPhrase}), that is read as ${trend} for the simple proxy model.`;

  return {
    definition,
    observations: sorted,
    changePct: change,
    annualizedTrendPct,
    trend,
    summary,
  };
}

export type OverallVerdict = "mostly_supportive" | "mixed" | "mostly_tension" | "insufficient_data";

export function overallVerdict(results: IndicatorResult[]): OverallVerdict {
  const scored = results.filter((r) => r.trend !== "unknown");
  if (scored.length === 0) return "insufficient_data";

  let supportive = 0;
  let tension = 0;
  for (const r of scored) {
    if (r.trend === "supportive") supportive += 1;
    if (r.trend === "tension") tension += 1;
  }

  if (supportive > tension && supportive >= scored.length * 0.5) return "mostly_supportive";
  if (tension > supportive && tension >= scored.length * 0.5) return "mostly_tension";
  return "mixed";
}

export function verdictLabel(v: OverallVerdict): string {
  switch (v) {
    case "mostly_supportive":
      return "Mostly consistent with the proxy reading";
    case "mostly_tension":
      return "Mostly in tension with the proxy reading";
    case "mixed":
      return "Mixed signals across indicators";
    default:
      return "Insufficient data";
  }
}

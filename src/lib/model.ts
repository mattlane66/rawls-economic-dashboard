import type { AlignmentPolarity, IndicatorDefinition } from "./indicators";

export interface Observation {
  date: string;
  value: number;
}

export interface IndicatorResult {
  definition: IndicatorDefinition;
  observations: Observation[];
  changePct: number | null;
  trend: "supportive" | "neutral" | "tension" | "unknown";
  summary: string;
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
  const trend = classifyTrend(change, definition.polarity);

  const directionWord = change >= 0 ? "rose" : "fell";
  const polarityPhrase = definition.polarity.replace(/_/g, " ");
  const summary = `Over the selected window, the series ${directionWord} by about ${Math.abs(change).toFixed(1)}%. Given this indicator’s polarity (${polarityPhrase}), that is read as ${trend} for the simple proxy model.`;

  return {
    definition,
    observations: sorted,
    changePct: change,
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

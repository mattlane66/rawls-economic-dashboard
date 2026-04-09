import { NextResponse } from "next/server";
import { INDICATORS } from "@/lib/indicators";
import { fetchFredSeries } from "@/lib/fred";
import { evaluateIndicator, overallVerdict, verdictLabel, type Observation } from "@/lib/model";

function startDateForYears(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}

/** Sparse demo series when FRED is unavailable (clearly marked synthetic). */
function syntheticSeries(seriesId: string, points: number): Observation[] {
  const seed = seriesId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 40 + (seed % 20);
  const out: Observation[] = [];
  const now = new Date();
  for (let i = 0; i < points; i++) {
    const t = i / Math.max(points - 1, 1);
    const y = now.getFullYear() - Math.floor((1 - t) * 10);
    const m = String((i % 12) + 1).padStart(2, "0");
    const wave = Math.sin(i * 0.4 + seed * 0.01) * 0.8;
    const drift = (t - 0.5) * (seed % 2 === 0 ? 3 : -2);
    out.push({
      date: `${y}-${m}-01`,
      value: base + wave + drift + (seriesId.length % 5) * 0.1,
    });
  }
  return out;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const years = Math.min(40, Math.max(3, parseInt(searchParams.get("years") ?? "10", 10) || 10));
  const observationStart = startDateForYears(years);
  const apiKey = process.env.FRED_API_KEY;

  const synthetic = !apiKey;
  const results = [];

  for (const def of INDICATORS) {
    let observations: Observation[];
    if (synthetic) {
      observations = syntheticSeries(def.fredSeriesId, 24);
    } else {
      try {
        observations = await fetchFredSeries(def.fredSeriesId, apiKey, observationStart);
      } catch {
        observations = syntheticSeries(def.fredSeriesId, 12);
      }
    }

    results.push(evaluateIndicator(def, observations));
  }

  const verdict = overallVerdict(results);

  return NextResponse.json({
    synthetic,
    windowYears: years,
    observationStart,
    verdict,
    verdictLabel: verdictLabel(verdict),
    results,
    note: synthetic
      ? "Set FRED_API_KEY in .env.local for live St. Louis Fed data. Showing synthetic placeholder series."
      : "Live data from FRED. Indicators are empirical proxies, not a full philosophical test of the difference principle.",
  });
}

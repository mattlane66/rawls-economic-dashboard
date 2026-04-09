import type { Observation } from "./model";

interface FredObservation {
  date: string;
  value: string;
}

interface FredResponse {
  observations: FredObservation[];
}

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  observationStart: string,
): Promise<Observation[]> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    observation_start: observationStart,
    sort_order: "asc",
  });

  const url = `${FRED_BASE}?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`FRED error ${res.status} for ${seriesId}`);
  }

  const data = (await res.json()) as FredResponse;
  const out: Observation[] = [];

  for (const row of data.observations ?? []) {
    const v = parseFloat(row.value);
    if (Number.isFinite(v)) {
      out.push({ date: row.date, value: v });
    }
  }

  return out;
}

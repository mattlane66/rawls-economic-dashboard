/**
 * Indicators are empirical proxies for how the least-advantaged might fare,
 * not a complete operationalization of Rawls’s difference principle.
 */

export type TrendDirection = "up" | "down" | "flat";

export type AlignmentPolarity =
  | "higher_supports_proxy"
  | "lower_supports_proxy";

export interface IndicatorDefinition {
  id: string;
  label: string;
  description: string;
  fredSeriesId: string;
  frequency: "m" | "q" | "a";
  polarity: AlignmentPolarity;
  /** Human-readable note on limits of this proxy */
  caveat: string;
}

export const INDICATORS: IndicatorDefinition[] = [
  {
    id: "unrate",
    label: "Unemployment rate",
    description:
      "Share of the labor force without work but seeking work. High unemployment tends to hit marginal workers hardest.",
    fredSeriesId: "UNRATE",
    frequency: "m",
    polarity: "lower_supports_proxy",
    caveat:
      "Unemployment is one slice of disadvantage; it does not capture poverty among non-participants.",
  },
  {
    id: "dspc",
    label: "Real disposable income per capita",
    description:
      "After-tax income available for spending, deflated. A coarse economy-wide welfare proxy.",
    fredSeriesId: "DSPIC96",
    frequency: "m",
    polarity: "higher_supports_proxy",
    caveat:
      "Per-capita aggregates can mask stagnation at the bottom; distribution matters for the difference principle.",
  },
  {
    id: "gini",
    label: "Gini coefficient (World Bank WDI)",
    description:
      "Inequality of income or consumption. Under the difference principle, inequality is permissible only if it improves the worst off.",
    fredSeriesId: "SIPOVGINIUSA",
    frequency: "a",
    polarity: "lower_supports_proxy",
    caveat:
      "Gini alone does not say whether inequalities benefit the least advantaged; it is one diagnostic input.",
  },
  {
    id: "labshare",
    label: "Labor share of income",
    description:
      "Worker compensation as a share of value added. Shifts can relate to bargaining power and rents.",
    fredSeriesId: "LABSHPUSA156NRUG",
    frequency: "a",
    polarity: "higher_supports_proxy",
    caveat:
      "Labor share is an aggregate; the worst off may not move with the average worker.",
  },
];

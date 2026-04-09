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
  /** Which opportunity-floor channel this proxy mainly tracks */
  floorChannel:
    | "work-and-earnings"
    | "income-floor"
    | "anti-poverty"
    | "power-concentration";
  /** How this metric maps to Capitalism 6.0's two-lens test */
  c6Mapping: string;
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
    floorChannel: "work-and-earnings",
    c6Mapping:
      "Lower unemployment generally raises the floor by expanding access to earned income and reducing exclusion from labor markets.",
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
    floorChannel: "income-floor",
    c6Mapping:
      "Rising real disposable income supports floor-raising capacity, but only weakly indicates distribution toward the least advantaged.",
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
    floorChannel: "power-concentration",
    c6Mapping:
      "Lower inequality is treated as a rough non-domination signal by limiting concentration of income power and rents.",
    caveat:
      "Gini alone does not say whether inequalities benefit the least advantaged; it is one diagnostic input.",
  },
  {
    id: "poverty_rate",
    label: "Poverty rate (all ages, Census SAIPE)",
    description:
      "Share of people of all ages in poverty. A direct but coarse proxy for how many are below a basic material floor.",
    fredSeriesId: "PPAAUS00000A156NCEN",
    frequency: "a",
    polarity: "lower_supports_proxy",
    floorChannel: "anti-poverty",
    c6Mapping:
      "Lower poverty is the most direct floor-raising proxy in this set, indicating fewer people below a minimum material threshold.",
    caveat:
      "The official poverty line is a blunt metric and does not fully capture deprivation, wealth, or non-cash support.",
  },
  {
    id: "labshare",
    label: "Labor share of income",
    description:
      "Worker compensation as a share of value added. Shifts can relate to bargaining power and rents.",
    fredSeriesId: "LABSHPUSA156NRUG",
    frequency: "a",
    polarity: "higher_supports_proxy",
    floorChannel: "work-and-earnings",
    c6Mapping:
      "A higher labor share is treated as weaker concentration of market power and a larger claim for workers relative to capital.",
    caveat:
      "Labor share is an aggregate; the worst off may not move with the average worker.",
  },
];

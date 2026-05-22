import { MONTHS, type Development, type Month, type Series, type InputKey, type BegKey } from "./types";

export function getInput(dev: Development, key: InputKey, month: Month, series: Series): number {
  const v = dev.data[key]?.[month]?.[series];
  return v ?? 0;
}

export function getBeg(dev: Development, key: BegKey, series: Series): number {
  const v = dev.data.beg[key]?.[series];
  return v ?? 0;
}

const SUM = (...nums: number[]) => nums.reduce((a, b) => a + b, 0);

export function derive(
  dev: Development,
  derivedKey: string,
  month: Month,
  series: Series
): number {
  const g = (k: InputKey) => getInput(dev, k, month, series);
  const b = (k: BegKey) => getBeg(dev, k, series);

  // Helper for rolling inventory: returns beg balance at the START of `month`.
  // For Jan, uses the seeded beg. For later months, recursively uses prior month's "end".
  const rollingBeg = (begKey: BegKey, endFn: (m: Month) => number, month: Month): number => {
    const idx = MONTHS.indexOf(month);
    if (idx === 0) return b(begKey);
    const prevMonth = MONTHS[idx - 1];
    return endFn(prevMonth);
  };

  switch (derivedKey) {
    case "total_sales":
      return g("sales_sf") + g("sales_th");
    case "total_starts":
      return g("starts_sf") + g("starts_th");
    case "total_closings":
      return g("closings_sf") + g("closings_th");

    case "gross_margin":
      return g("revenue") + g("cogs"); // cogs stored negative
    case "contribution_margin":
      return g("revenue") + g("cogs") + g("soft_costs") + g("mgmt_fees");
    case "total_op_costs":
      return g("warranty") + g("advertising") + g("model_home") + g("prof_services") + g("other_ga");
    case "net_income":
      return derive(dev, "contribution_margin", month, series) + derive(dev, "total_op_costs", month, series);

    case "total_sn_share": {
      const ni = derive(dev, "net_income", month, series);
      const total = dev.profitShares.reduce((acc, s) => acc + s.percent, 0);
      return ni * total;
    }

    case "paper_sf_beg":
      return rollingBeg("paper_sf_beg", (m) => derive(dev, "paper_sf_end", m, series), month);
    case "paper_sf_end":
      return derive(dev, "paper_sf_beg", month, series) + g("paper_sf_land") - g("paper_sf_starts");

    case "paper_th_beg":
      return rollingBeg("paper_th_beg", (m) => derive(dev, "paper_th_end", m, series), month);
    case "paper_th_end":
      return derive(dev, "paper_th_beg", month, series) + g("paper_th_land") - g("paper_th_starts");

    case "dev_sf_beg":
      return rollingBeg("dev_sf_beg", (m) => derive(dev, "dev_sf_end", m, series), month);
    case "dev_sf_end":
      return derive(dev, "dev_sf_beg", month, series) + g("dev_sf_finished") + g("dev_sf_starts_neg");

    case "dev_th_beg":
      return rollingBeg("dev_th_beg", (m) => derive(dev, "dev_th_end", m, series), month);
    case "dev_th_end":
      return derive(dev, "dev_th_beg", month, series) + g("dev_th_finished") + g("dev_th_starts_neg");

    case "spec_sf_beg":
      return rollingBeg("spec_sf_beg", (m) => derive(dev, "spec_sf_end", m, series), month);
    case "spec_sf_end":
      return derive(dev, "spec_sf_beg", month, series) - g("spec_sf_sales") + g("spec_sf_starts");

    case "spec_th_beg":
      return rollingBeg("spec_th_beg", (m) => derive(dev, "spec_th_end", m, series), month);
    case "spec_th_end":
      return derive(dev, "spec_th_beg", month, series) - g("spec_th_sales") + g("spec_th_starts");

    case "equity_beg":
      return rollingBeg("equity_beg", (m) => derive(dev, "equity_end", m, series), month);
    case "equity_ni":
      return derive(dev, "net_income", month, series) - derive(dev, "total_sn_share", month, series);
    case "equity_end":
      return derive(dev, "equity_beg", month, series) + g("equity_dist") + derive(dev, "equity_ni", month, series);

    default:
      return 0;
  }
}

export function rowValue(
  dev: Development,
  row: { kind: string; inputKey?: InputKey; derived?: string },
  month: Month,
  series: Series
): number {
  if (row.kind === "input" && row.inputKey) return getInput(dev, row.inputKey, month, series);
  if (row.kind === "derived" && row.derived) return derive(dev, row.derived, month, series);
  return 0;
}

export function rowYearTotal(
  dev: Development,
  row: { kind: string; inputKey?: InputKey; derived?: string; category?: string },
  series: Series
): number {
  // Inventory "end" rows should show Dec's end balance, not a sum.
  // Inventory "beg" rows should show Jan's beg balance.
  if (row.derived?.endsWith("_end")) return rowValue(dev, row, "dec", series);
  if (row.derived?.endsWith("_beg")) return rowValue(dev, row, "jan", series);
  return SUM(...MONTHS.map((m) => rowValue(dev, row, m, series)));
}

export type RollupRow = {
  label: string;
  rowKey: string;
  unit: "count" | "currency";
};

export function rollupAcrossDevs(
  devs: Development[],
  rowKey: string,
  month: Month,
  series: Series,
  rowsFinder: (key: string) => { kind: string; inputKey?: InputKey; derived?: string } | undefined
): number {
  const row = rowsFinder(rowKey);
  if (!row) return 0;
  return devs.reduce((acc, dev) => acc + rowValue(dev, row, month, series), 0);
}

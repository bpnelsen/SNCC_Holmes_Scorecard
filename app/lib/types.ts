export const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
] as const;
export type Month = (typeof MONTHS)[number];

export const MONTH_LABELS: Record<Month, string> = {
  jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr",
  may: "May", jun: "Jun", jul: "Jul", aug: "Aug",
  sep: "Sep", oct: "Oct", nov: "Nov", dec: "Dec",
};

export type Series = "plan" | "actual";

export type Cell = {
  plan: number | null;
  actual: number | null;
};

export type MonthMap = Record<Month, Cell>;

export type InputKey =
  | "sales_sf" | "sales_th"
  | "starts_sf" | "starts_th"
  | "closings_sf" | "closings_th"
  | "revenue" | "cogs"
  | "soft_costs" | "mgmt_fees"
  | "warranty" | "advertising" | "model_home" | "prof_services" | "other_ga"
  | "paper_sf_land" | "paper_sf_starts"
  | "paper_th_land" | "paper_th_starts"
  | "dev_sf_finished" | "dev_sf_starts_neg"
  | "dev_th_finished" | "dev_th_starts_neg"
  | "spec_sf_sales" | "spec_sf_starts"
  | "spec_th_sales" | "spec_th_starts"
  | "equity_dist";

export type BegKey =
  | "paper_sf_beg" | "paper_th_beg"
  | "dev_sf_beg" | "dev_th_beg"
  | "spec_sf_beg" | "spec_th_beg"
  | "equity_beg";

export type DevelopmentData = {
  [K in InputKey]: MonthMap;
} & {
  beg: { [K in BegKey]: Cell };
};

export type ProfitShare = {
  name: string;
  percent: number;
};

export type Development = {
  id: string;
  name: string;
  title: string;
  profitShares: ProfitShare[];
  data: DevelopmentData;
};

export type AppState = {
  developments: Development[];
};

export const ACTUALS_LOCKED_THROUGH: Month = "apr";

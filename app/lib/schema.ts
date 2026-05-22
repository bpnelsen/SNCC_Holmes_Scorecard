import type { InputKey, BegKey } from "./types";

export type RowKind = "input" | "derived" | "section";

export type RowDef = {
  key: string;
  label: string;
  kind: RowKind;
  category:
    | "sales"
    | "income"
    | "opcosts"
    | "result"
    | "profitshare"
    | "paper_sf"
    | "paper_th"
    | "dev_sf"
    | "dev_th"
    | "spec_sf"
    | "spec_th"
    | "equity";
  inputKey?: InputKey;
  begKey?: BegKey;
  derived?: string; // identifier for the calc.ts function
  indent?: boolean;
  isExpense?: boolean; // expenses entered as positive but stored as negative
  unit?: "count" | "currency";
};

export const SECTIONS = {
  sales: "SALES, STARTS & CLOSINGS",
  income: "INCOME STATEMENT",
  profitshare: "SN PROFIT SHARE",
  inventory: "LOT & SPEC INVENTORY",
  equity: "EQUITY ROLLFORWARD",
};

export const ROWS: RowDef[] = [
  { key: "sec_sales", label: SECTIONS.sales, kind: "section", category: "sales" },
  { key: "sales_sf", label: "Sales — Single Family", kind: "input", category: "sales", inputKey: "sales_sf", unit: "count" },
  { key: "sales_th", label: "Sales — Townhomes", kind: "input", category: "sales", inputKey: "sales_th", unit: "count" },
  { key: "total_sales", label: "Total Sales", kind: "derived", category: "sales", derived: "total_sales", unit: "count" },
  { key: "starts_sf", label: "Starts — Single Family", kind: "input", category: "sales", inputKey: "starts_sf", unit: "count" },
  { key: "starts_th", label: "Starts — Townhomes", kind: "input", category: "sales", inputKey: "starts_th", unit: "count" },
  { key: "total_starts", label: "Total Starts", kind: "derived", category: "sales", derived: "total_starts", unit: "count" },
  { key: "closings_sf", label: "Closings — Single Family", kind: "input", category: "sales", inputKey: "closings_sf", unit: "count" },
  { key: "closings_th", label: "Closings — Townhomes", kind: "input", category: "sales", inputKey: "closings_th", unit: "count" },
  { key: "total_closings", label: "Total Closings", kind: "derived", category: "sales", derived: "total_closings", unit: "count" },

  { key: "sec_income", label: SECTIONS.income, kind: "section", category: "income" },
  { key: "revenue", label: "Revenue", kind: "input", category: "income", inputKey: "revenue", unit: "currency" },
  { key: "cogs", label: "Cost of Goods Sold", kind: "input", category: "income", inputKey: "cogs", isExpense: true, unit: "currency" },
  { key: "gross_margin", label: "Gross Margin", kind: "derived", category: "income", derived: "gross_margin", unit: "currency" },
  { key: "soft_costs", label: "Soft Costs", kind: "input", category: "income", inputKey: "soft_costs", isExpense: true, unit: "currency" },
  { key: "mgmt_fees", label: "Management Fees", kind: "input", category: "income", inputKey: "mgmt_fees", isExpense: true, unit: "currency" },
  { key: "contribution_margin", label: "Contribution Margin", kind: "derived", category: "income", derived: "contribution_margin", unit: "currency" },
  { key: "warranty", label: "Warranty Costs", kind: "input", category: "opcosts", inputKey: "warranty", isExpense: true, unit: "currency" },
  { key: "advertising", label: "Advertising", kind: "input", category: "opcosts", inputKey: "advertising", isExpense: true, unit: "currency" },
  { key: "model_home", label: "Model Home Expense", kind: "input", category: "opcosts", inputKey: "model_home", isExpense: true, unit: "currency" },
  { key: "prof_services", label: "Prof Services / SWPPP", kind: "input", category: "opcosts", inputKey: "prof_services", isExpense: true, unit: "currency" },
  { key: "other_ga", label: "Other G&A", kind: "input", category: "opcosts", inputKey: "other_ga", isExpense: true, unit: "currency" },
  { key: "total_op_costs", label: "Total Entity Op Costs", kind: "derived", category: "opcosts", derived: "total_op_costs", unit: "currency" },
  { key: "net_income", label: "NET INCOME", kind: "derived", category: "result", derived: "net_income", unit: "currency" },

  { key: "sec_profitshare", label: SECTIONS.profitshare, kind: "section", category: "profitshare" },
  { key: "total_sn_share", label: "Total SN Profit Share", kind: "derived", category: "profitshare", derived: "total_sn_share", unit: "currency" },

  { key: "sec_paper_sf", label: "Paper Lots — Single Family", kind: "section", category: "paper_sf" },
  { key: "paper_sf_beg", label: "Beg Paper Lot Inventory", kind: "derived", category: "paper_sf", derived: "paper_sf_beg", unit: "count" },
  { key: "paper_sf_land", label: "Land Purchases", kind: "input", category: "paper_sf", inputKey: "paper_sf_land", unit: "count" },
  { key: "paper_sf_starts", label: "Dev Starts (reductions)", kind: "input", category: "paper_sf", inputKey: "paper_sf_starts", unit: "count" },
  { key: "paper_sf_end", label: "End Paper Lot Inventory", kind: "derived", category: "paper_sf", derived: "paper_sf_end", unit: "count" },

  { key: "sec_paper_th", label: "Paper Lots — Townhomes", kind: "section", category: "paper_th" },
  { key: "paper_th_beg", label: "Beg Paper Lot Inventory", kind: "derived", category: "paper_th", derived: "paper_th_beg", unit: "count" },
  { key: "paper_th_land", label: "Land Purchases", kind: "input", category: "paper_th", inputKey: "paper_th_land", unit: "count" },
  { key: "paper_th_starts", label: "Dev Starts (reductions)", kind: "input", category: "paper_th", inputKey: "paper_th_starts", unit: "count" },
  { key: "paper_th_end", label: "End Paper Lot Inventory", kind: "derived", category: "paper_th", derived: "paper_th_end", unit: "count" },

  { key: "sec_dev_sf", label: "Developed Lots — Single Family", kind: "section", category: "dev_sf" },
  { key: "dev_sf_beg", label: "Beg Dev Lot Inventory", kind: "derived", category: "dev_sf", derived: "dev_sf_beg", unit: "count" },
  { key: "dev_sf_finished", label: "Finished Construction", kind: "input", category: "dev_sf", inputKey: "dev_sf_finished", unit: "count" },
  { key: "dev_sf_starts_neg", label: "Starts (reductions)", kind: "input", category: "dev_sf", inputKey: "dev_sf_starts_neg", unit: "count" },
  { key: "dev_sf_end", label: "End Dev Lot Inventory", kind: "derived", category: "dev_sf", derived: "dev_sf_end", unit: "count" },

  { key: "sec_dev_th", label: "Developed Lots — Townhomes", kind: "section", category: "dev_th" },
  { key: "dev_th_beg", label: "Beg Dev Lot Inventory", kind: "derived", category: "dev_th", derived: "dev_th_beg", unit: "count" },
  { key: "dev_th_finished", label: "Finished Construction", kind: "input", category: "dev_th", inputKey: "dev_th_finished", unit: "count" },
  { key: "dev_th_starts_neg", label: "Starts (reductions)", kind: "input", category: "dev_th", inputKey: "dev_th_starts_neg", unit: "count" },
  { key: "dev_th_end", label: "End Dev Lot Inventory", kind: "derived", category: "dev_th", derived: "dev_th_end", unit: "count" },

  { key: "sec_spec_sf", label: "Spec Inventory — Single Family", kind: "section", category: "spec_sf" },
  { key: "spec_sf_beg", label: "Beg Spec Inventory", kind: "derived", category: "spec_sf", derived: "spec_sf_beg", unit: "count" },
  { key: "spec_sf_sales", label: "Spec Sales", kind: "input", category: "spec_sf", inputKey: "spec_sf_sales", unit: "count" },
  { key: "spec_sf_starts", label: "Spec Starts", kind: "input", category: "spec_sf", inputKey: "spec_sf_starts", unit: "count" },
  { key: "spec_sf_end", label: "End Spec Inventory", kind: "derived", category: "spec_sf", derived: "spec_sf_end", unit: "count" },

  { key: "sec_spec_th", label: "Spec Inventory — Townhomes", kind: "section", category: "spec_th" },
  { key: "spec_th_beg", label: "Beg Spec Inventory", kind: "derived", category: "spec_th", derived: "spec_th_beg", unit: "count" },
  { key: "spec_th_sales", label: "Spec Sales", kind: "input", category: "spec_th", inputKey: "spec_th_sales", unit: "count" },
  { key: "spec_th_starts", label: "Spec Starts", kind: "input", category: "spec_th", inputKey: "spec_th_starts", unit: "count" },
  { key: "spec_th_end", label: "End Spec Inventory", kind: "derived", category: "spec_th", derived: "spec_th_end", unit: "count" },

  { key: "sec_equity", label: SECTIONS.equity, kind: "section", category: "equity" },
  { key: "equity_beg", label: "Beginning Balance", kind: "derived", category: "equity", derived: "equity_beg", unit: "currency" },
  { key: "equity_dist", label: "Distributions", kind: "input", category: "equity", inputKey: "equity_dist", isExpense: true, unit: "currency" },
  { key: "equity_ni", label: "Net Income Allocated", kind: "derived", category: "equity", derived: "equity_ni", unit: "currency" },
  { key: "equity_end", label: "Ending Balance", kind: "derived", category: "equity", derived: "equity_end", unit: "currency" },
];

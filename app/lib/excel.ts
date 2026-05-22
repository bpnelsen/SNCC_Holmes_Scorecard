import * as XLSX from "xlsx";
import { ROWS } from "./schema";
import { MONTHS, MONTH_LABELS, type Development, type Series } from "./types";
import { rowValue, rowYearTotal } from "./calc";

type Cell = { v: number | string | null; t?: string; z?: string };

function num(v: number, isCurrency: boolean): Cell {
  return { v, t: "n", z: isCurrency ? '#,##0;(#,##0);"—"' : "#,##0" };
}

function buildDevSheet(dev: Development): XLSX.WorkSheet {
  const headerRow1: (string | number | null)[] = ["", "FY 2026 SUMMARY", "", ""];
  MONTHS.forEach((m) => {
    headerRow1.push(MONTH_LABELS[m], "");
  });
  const headerRow2: (string | number | null)[] = ["", "Plan", "Actual", "Variance"];
  MONTHS.forEach(() => headerRow2.push("Plan", "Actual"));

  const aoa: (string | number | Cell | null)[][] = [
    [dev.title || dev.name],
    [`${dev.name} — 2026 Income Statement`],
    headerRow1,
    headerRow2,
  ];

  ROWS.forEach((row) => {
    if (row.kind === "section") {
      aoa.push([row.label]);
      return;
    }
    const isCurrency = (row.unit ?? "currency") === "currency";
    const planYTD = rowYearTotal(dev, row, "plan");
    const actYTD = rowYearTotal(dev, row, "actual");
    const variance = actYTD - planYTD;
    const r: (string | Cell | null)[] = [
      row.label,
      num(planYTD, isCurrency),
      num(actYTD, isCurrency),
      num(variance, isCurrency),
    ];
    MONTHS.forEach((m) => {
      const p = rowValue(dev, row, m, "plan");
      const a = rowValue(dev, row, m, "actual");
      r.push(num(p, isCurrency), num(a, isCurrency));
    });
    aoa.push(r);
  });

  // SN Profit share lines (one row per partner)
  aoa.push([]);
  aoa.push(["SN PROFIT SHARE — Detail"]);
  dev.profitShares.forEach((share) => {
    const isCurrency = true;
    const planTotal = MONTHS.reduce(
      (acc, m) => acc + rowValue(dev, ROWS.find((r) => r.key === "net_income")!, m, "plan") * share.percent,
      0
    );
    const actTotal = MONTHS.reduce(
      (acc, m) => acc + rowValue(dev, ROWS.find((r) => r.key === "net_income")!, m, "actual") * share.percent,
      0
    );
    const r: (string | Cell | null)[] = [
      `${share.name} (${(share.percent * 100).toFixed(2)}%)`,
      num(planTotal, isCurrency),
      num(actTotal, isCurrency),
      num(actTotal - planTotal, isCurrency),
    ];
    MONTHS.forEach((m) => {
      const niP = rowValue(dev, ROWS.find((r) => r.key === "net_income")!, m, "plan");
      const niA = rowValue(dev, ROWS.find((r) => r.key === "net_income")!, m, "actual");
      r.push(num(niP * share.percent, isCurrency), num(niA * share.percent, isCurrency));
    });
    aoa.push(r);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  // Column widths
  ws["!cols"] = [
    { wch: 36 },
    { wch: 14 }, { wch: 14 }, { wch: 12 },
    ...MONTHS.flatMap(() => [{ wch: 12 }, { wch: 12 }]),
  ];
  return ws;
}

function buildDashboardSheet(devs: Development[]): XLSX.WorkSheet {
  const KEY = [
    { rowKey: "total_closings", label: "Total Closings", unit: "count" as const },
    { rowKey: "total_sales", label: "Total Sales", unit: "count" as const },
    { rowKey: "total_starts", label: "Total Starts", unit: "count" as const },
    { rowKey: "revenue", label: "Revenue", unit: "currency" as const },
    { rowKey: "cogs", label: "Cost of Goods Sold", unit: "currency" as const },
    { rowKey: "gross_margin", label: "Gross Margin", unit: "currency" as const },
    { rowKey: "contribution_margin", label: "Contribution Margin", unit: "currency" as const },
    { rowKey: "total_op_costs", label: "Total Op Costs", unit: "currency" as const },
    { rowKey: "net_income", label: "Net Income", unit: "currency" as const },
    { rowKey: "total_sn_share", label: "SN Profit Share", unit: "currency" as const },
  ];

  const header1: (string | null)[] = ["Holmes Income Forecast 2026 — All Developments"];
  const header2: (string | null)[] = ["Metric", "Series"];
  MONTHS.forEach((m) => header2.push(MONTH_LABELS[m]));
  header2.push("YTD");

  const aoa: (string | number | Cell | null)[][] = [header1, [], header2];

  KEY.forEach((m) => {
    const row = ROWS.find((r) => r.key === m.rowKey)!;
    const isCurrency = m.unit === "currency";
    ["plan", "actual"].forEach((s) => {
      const series = s as Series;
      const r: (string | Cell | null)[] = [m.label, series === "plan" ? "Plan" : "Actual"];
      let ytd = 0;
      MONTHS.forEach((mo) => {
        const v = devs.reduce((a, d) => a + rowValue(d, row, mo, series), 0);
        ytd += v;
        r.push(num(v, isCurrency));
      });
      r.push(num(ytd, isCurrency));
      aoa.push(r);
    });
  });

  // Per-dev YTD breakdown
  aoa.push([]);
  aoa.push(["By Development — YTD"]);
  aoa.push(["Development", "Closings (Act/Plan)", "Revenue (Act/Plan)", "Net Income (Act/Plan)", "SN Share (Act/Plan)"]);
  devs.forEach((dev) => {
    const niRow = ROWS.find((r) => r.key === "net_income")!;
    const revRow = ROWS.find((r) => r.key === "revenue")!;
    const clRow = ROWS.find((r) => r.key === "total_closings")!;
    const snRow = ROWS.find((r) => r.key === "total_sn_share")!;
    aoa.push([
      dev.name,
      `${rowYearTotal(dev, clRow, "actual")} / ${rowYearTotal(dev, clRow, "plan")}`,
      `${rowYearTotal(dev, revRow, "actual").toFixed(0)} / ${rowYearTotal(dev, revRow, "plan").toFixed(0)}`,
      `${rowYearTotal(dev, niRow, "actual").toFixed(0)} / ${rowYearTotal(dev, niRow, "plan").toFixed(0)}`,
      `${rowYearTotal(dev, snRow, "actual").toFixed(0)} / ${rowYearTotal(dev, snRow, "plan").toFixed(0)}`,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [{ wch: 30 }, { wch: 10 }, ...MONTHS.map(() => ({ wch: 12 })), { wch: 14 }];
  return ws;
}

export function exportWorkbook(devs: Development[]): void {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, buildDashboardSheet(devs), "Dashboard");

  devs.forEach((dev) => {
    const safeName = dev.name.replace(/[/\\?*[\]:]/g, "").slice(0, 31);
    XLSX.utils.book_append_sheet(wb, buildDevSheet(dev), safeName);
  });

  const ts = new Date();
  const stamp =
    ts.getFullYear().toString() +
    String(ts.getMonth() + 1).padStart(2, "0") +
    String(ts.getDate()).padStart(2, "0") +
    "_" +
    String(ts.getHours()).padStart(2, "0") +
    String(ts.getMinutes()).padStart(2, "0");

  XLSX.writeFile(wb, `Holmes_Income_Forecast_2026_${stamp}.xlsx`);
}

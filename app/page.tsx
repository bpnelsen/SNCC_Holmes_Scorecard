"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useForecast } from "./store/useForecast";
import { ROWS } from "./lib/schema";
import { MONTHS, MONTH_LABELS } from "./lib/types";
import { rowYearTotal, rollupMonth, rollupYear } from "./lib/calc";
import { fmtCount, fmtCurrency, fmtPercentCell } from "./lib/format";

const KEY_METRICS = [
  { rowKey: "total_closings", label: "Total Closings", unit: "count" as const },
  { rowKey: "total_sales", label: "Total Sales", unit: "count" as const },
  { rowKey: "revenue", label: "Revenue", unit: "currency" as const },
  { rowKey: "gross_margin", label: "Gross Margin", unit: "currency" as const },
  { rowKey: "gross_margin_pct", label: "Gross Margin %", unit: "percent" as const },
  { rowKey: "contribution_margin", label: "Contribution Margin", unit: "currency" as const },
  { rowKey: "net_income", label: "Net Income", unit: "currency" as const },
  { rowKey: "net_margin_pct", label: "Net Margin %", unit: "percent" as const },
  { rowKey: "total_sn_share", label: "SN Profit Share", unit: "currency" as const },
];

function fmtFor(unit: "count" | "currency" | "percent") {
  return unit === "currency" ? fmtCurrency : unit === "percent" ? fmtPercentCell : fmtCount;
}

export default function DashboardPage() {
  const devs = useForecast((s) => s.developments);

  // KPI card metrics (top of page)
  const KPI = [
    { rowKey: "revenue", label: "Revenue", unit: "currency" as const },
    { rowKey: "net_income", label: "Net Income", unit: "currency" as const },
    { rowKey: "gross_margin_pct", label: "Gross Margin %", unit: "percent" as const },
    { rowKey: "net_margin_pct", label: "Net Margin %", unit: "percent" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">All-development rollup. Plan vs Actual by month.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI.map((m) => {
          const row = ROWS.find((r) => r.key === m.rowKey)!;
          const planYTD = rollupYear(devs, row, "plan");
          const actualYTD = rollupYear(devs, row, "actual");
          const fmt = fmtFor(m.unit);
          return (
            <div key={m.rowKey} className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
              <div className="text-xs uppercase tracking-wide text-slate-500">{m.label}</div>
              <div className="mt-2 flex items-baseline gap-3">
                <div className="text-2xl font-semibold text-slate-900">{fmt(actualYTD)}</div>
                <div className="text-xs text-slate-500">actual YTD</div>
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Plan: <span className="font-medium">{fmt(planYTD)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="grid-table w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 min-w-[200px]">Metric</th>
              <th className="text-left px-2 py-2">Series</th>
              {MONTHS.map((m) => (
                <th key={m} className="px-2 py-2 text-right min-w-[90px]">{MONTH_LABELS[m]}</th>
              ))}
              <th className="px-3 py-2 text-right bg-slate-200">YTD</th>
            </tr>
          </thead>
          <tbody>
            {KEY_METRICS.map((m) => {
              const row = ROWS.find((r) => r.key === m.rowKey)!;
              const fmt = fmtFor(m.unit);
              return (
                <Fragment key={m.rowKey}>
                  <tr className="bg-slate-50/60">
                    <td rowSpan={2} className="px-3 py-2 font-medium align-top">{m.label}</td>
                    <td className="px-2 py-1 text-slate-500 text-xs">Plan</td>
                    {MONTHS.map((mo) => (
                      <td key={mo} className="px-2 py-1 text-right text-slate-700">
                        {fmt(rollupMonth(devs, row, mo, "plan"))}
                      </td>
                    ))}
                    <td className="px-3 py-1 text-right font-semibold bg-slate-100/80">
                      {fmt(rollupYear(devs, row, "plan"))}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-slate-900 text-xs font-medium">Actual</td>
                    {MONTHS.map((mo) => (
                      <td key={mo} className="px-2 py-1 text-right text-slate-900">
                        {fmt(rollupMonth(devs, row, mo, "actual"))}
                      </td>
                    ))}
                    <td className="px-3 py-1 text-right font-semibold bg-slate-100/80">
                      {fmt(rollupYear(devs, row, "actual"))}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">By Development — YTD</h2>
        <p className="text-xs text-slate-500 mb-3">Click a card to drill into the development&rsquo;s full income statement.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {devs.map((dev) => {
            const niRow = ROWS.find((r) => r.key === "net_income")!;
            const gmRow = ROWS.find((r) => r.key === "gross_margin")!;
            const revRow = ROWS.find((r) => r.key === "revenue")!;
            const closingsRow = ROWS.find((r) => r.key === "total_closings")!;
            const gmPctRow = ROWS.find((r) => r.key === "gross_margin_pct")!;
            const nmPctRow = ROWS.find((r) => r.key === "net_margin_pct")!;
            const niPlan = rowYearTotal(dev, niRow, "plan");
            const niAct = rowYearTotal(dev, niRow, "actual");
            const gmPlan = rowYearTotal(dev, gmRow, "plan");
            const gmAct = rowYearTotal(dev, gmRow, "actual");
            const revPlan = rowYearTotal(dev, revRow, "plan");
            const revAct = rowYearTotal(dev, revRow, "actual");
            const closingsPlan = rowYearTotal(dev, closingsRow, "plan");
            const closingsAct = rowYearTotal(dev, closingsRow, "actual");
            const gmPctPlan = rowYearTotal(dev, gmPctRow, "plan");
            const gmPctAct = rowYearTotal(dev, gmPctRow, "actual");
            const nmPctPlan = rowYearTotal(dev, nmPctRow, "plan");
            const nmPctAct = rowYearTotal(dev, nmPctRow, "actual");
            return (
              <Link
                key={dev.id}
                href={`/development/${dev.id}`}
                className="bg-white rounded-lg shadow-sm p-4 border border-slate-200 hover:border-blue-400 hover:shadow transition-all cursor-pointer block"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">{dev.name}</div>
                  <span className="text-blue-600 text-sm" aria-hidden="true">→</span>
                </div>
                <div className="text-xs text-slate-500 mb-3">{dev.title}</div>
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500 text-xs">Closings</dt>
                    <dd>
                      <span className="font-semibold">{fmtCount(closingsAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtCount(closingsPlan)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Revenue</dt>
                    <dd>
                      <span className="font-semibold">{fmtCurrency(revAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtCurrency(revPlan)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Net Income</dt>
                    <dd>
                      <span className="font-semibold">{fmtCurrency(niAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtCurrency(niPlan)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Gross Margin</dt>
                    <dd>
                      <span className="font-semibold">{fmtCurrency(gmAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtCurrency(gmPlan)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Gross Margin %</dt>
                    <dd>
                      <span className="font-semibold">{fmtPercentCell(gmPctAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtPercentCell(gmPctPlan)}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500 text-xs">Net Margin %</dt>
                    <dd>
                      <span className="font-semibold">{fmtPercentCell(nmPctAct)}</span>
                      <span className="text-slate-400 text-xs"> / {fmtPercentCell(nmPctPlan)}</span>
                    </dd>
                  </div>
                </dl>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

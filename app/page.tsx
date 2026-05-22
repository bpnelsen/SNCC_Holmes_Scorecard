"use client";

import { Fragment } from "react";
import { useForecast } from "./store/useForecast";
import { ROWS } from "./lib/schema";
import { MONTHS, MONTH_LABELS } from "./lib/types";
import { rowValue, rowYearTotal } from "./lib/calc";
import { fmtCount, fmtCurrency } from "./lib/format";

const KEY_METRICS = [
  { rowKey: "total_closings", label: "Total Closings", unit: "count" as const },
  { rowKey: "total_sales", label: "Total Sales", unit: "count" as const },
  { rowKey: "revenue", label: "Revenue", unit: "currency" as const },
  { rowKey: "gross_margin", label: "Gross Margin", unit: "currency" as const },
  { rowKey: "contribution_margin", label: "Contribution Margin", unit: "currency" as const },
  { rowKey: "net_income", label: "Net Income", unit: "currency" as const },
  { rowKey: "total_sn_share", label: "SN Profit Share", unit: "currency" as const },
];

export default function DashboardPage() {
  const devs = useForecast((s) => s.developments);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">All-development rollup. Plan vs Actual by month.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KEY_METRICS.slice(0, 4).map((m) => {
          const row = ROWS.find((r) => r.key === m.rowKey)!;
          const planYTD = devs.reduce((a, d) => a + rowYearTotal(d, row, "plan"), 0);
          const actualYTD = devs.reduce((a, d) => a + rowYearTotal(d, row, "actual"), 0);
          const fmt = m.unit === "currency" ? fmtCurrency : fmtCount;
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
              const fmt = m.unit === "currency" ? fmtCurrency : fmtCount;
              return (
                <Fragment key={m.rowKey}>
                  <tr className="bg-slate-50/60">
                    <td rowSpan={2} className="px-3 py-2 font-medium align-top">{m.label}</td>
                    <td className="px-2 py-1 text-slate-500 text-xs">Plan</td>
                    {MONTHS.map((mo) => {
                      const v = devs.reduce((a, d) => a + rowValue(d, row, mo, "plan"), 0);
                      return <td key={mo} className="px-2 py-1 text-right text-slate-700">{fmt(v)}</td>;
                    })}
                    <td className="px-3 py-1 text-right font-semibold bg-slate-100/80">
                      {fmt(devs.reduce((a, d) => a + rowYearTotal(d, row, "plan"), 0))}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1 text-slate-900 text-xs font-medium">Actual</td>
                    {MONTHS.map((mo) => {
                      const v = devs.reduce((a, d) => a + rowValue(d, row, mo, "actual"), 0);
                      return <td key={mo} className="px-2 py-1 text-right text-slate-900">{fmt(v)}</td>;
                    })}
                    <td className="px-3 py-1 text-right font-semibold bg-slate-100/80">
                      {fmt(devs.reduce((a, d) => a + rowYearTotal(d, row, "actual"), 0))}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">By Development — YTD</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {devs.map((dev) => {
            const niRow = ROWS.find((r) => r.key === "net_income")!;
            const revRow = ROWS.find((r) => r.key === "revenue")!;
            const closingsRow = ROWS.find((r) => r.key === "total_closings")!;
            const niPlan = rowYearTotal(dev, niRow, "plan");
            const niAct = rowYearTotal(dev, niRow, "actual");
            const revPlan = rowYearTotal(dev, revRow, "plan");
            const revAct = rowYearTotal(dev, revRow, "actual");
            const closingsPlan = rowYearTotal(dev, closingsRow, "plan");
            const closingsAct = rowYearTotal(dev, closingsRow, "actual");
            return (
              <div key={dev.id} className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
                <div className="font-semibold text-slate-900">{dev.name}</div>
                <div className="text-xs text-slate-500 mb-3">{dev.title}</div>
                <dl className="grid grid-cols-3 gap-2 text-sm">
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
                </dl>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

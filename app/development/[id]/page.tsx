"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useForecast } from "../../store/useForecast";
import { ROWS } from "../../lib/schema";
import { rowYearTotal } from "../../lib/calc";
import { fmtCount, fmtCurrency, fmtPercentCell } from "../../lib/format";
import Breadcrumbs from "../../components/Breadcrumbs";
import MonthGrid from "../../components/MonthGrid";

type SeriesView = "plan" | "actual";

export default function DevelopmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dev = useForecast((s) => s.developments.find((d) => d.id === id));
  const [view, setView] = useState<SeriesView>("actual");

  if (!dev) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Not found" }]} />
        <div className="bg-white rounded-lg shadow-sm p-6 text-slate-600">
          Development not found.{" "}
          <Link href="/" className="text-blue-600 hover:underline">Back to dashboard</Link>.
        </div>
      </div>
    );
  }

  const revRow = ROWS.find((r) => r.key === "revenue")!;
  const niRow = ROWS.find((r) => r.key === "net_income")!;
  const gmRow = ROWS.find((r) => r.key === "gross_margin")!;
  const gmPctRow = ROWS.find((r) => r.key === "gross_margin_pct")!;
  const nmPctRow = ROWS.find((r) => r.key === "net_margin_pct")!;
  const closingsRow = ROWS.find((r) => r.key === "total_closings")!;
  const cmRow = ROWS.find((r) => r.key === "contribution_margin")!;
  const snRow = ROWS.find((r) => r.key === "total_sn_share")!;

  const stat = (
    label: string,
    plan: number,
    actual: number,
    fmt: (n: number) => string,
  ) => (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{fmt(actual)}</div>
      <div className="text-xs text-slate-500">Plan: {fmt(plan)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/" },
          { label: dev.name },
        ]}
      />

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{dev.name}</h1>
          <p className="text-slate-500 text-sm mt-1">{dev.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/forecast"
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Edit Plan
          </Link>
          <Link
            href="/actuals"
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Edit Actuals
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {stat("Closings", rowYearTotal(dev, closingsRow, "plan"), rowYearTotal(dev, closingsRow, "actual"), fmtCount)}
        {stat("Revenue", rowYearTotal(dev, revRow, "plan"), rowYearTotal(dev, revRow, "actual"), fmtCurrency)}
        {stat("Gross Margin", rowYearTotal(dev, gmRow, "plan"), rowYearTotal(dev, gmRow, "actual"), fmtCurrency)}
        {stat("Gross Margin %", rowYearTotal(dev, gmPctRow, "plan"), rowYearTotal(dev, gmPctRow, "actual"), fmtPercentCell)}
        {stat("Contribution", rowYearTotal(dev, cmRow, "plan"), rowYearTotal(dev, cmRow, "actual"), fmtCurrency)}
        {stat("Net Income", rowYearTotal(dev, niRow, "plan"), rowYearTotal(dev, niRow, "actual"), fmtCurrency)}
        {stat("Net Margin %", rowYearTotal(dev, nmPctRow, "plan"), rowYearTotal(dev, nmPctRow, "actual"), fmtPercentCell)}
      </div>

      <div>
        <div className="flex items-center gap-1 border-b border-slate-200 mb-3">
          {(["actual", "plan"] as SeriesView[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setView(s)}
              className={
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors " +
                (view === s
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-600 hover:text-slate-900")
              }
            >
              {s === "actual" ? "Actuals" : "Plan"}
            </button>
          ))}
        </div>
        <MonthGrid devId={dev.id} series={view} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="font-semibold text-slate-900 mb-2">Profit shares</div>
        <ul className="text-sm space-y-1">
          {dev.profitShares.length === 0 && (
            <li className="text-slate-500">No partners configured yet — set them up in <Link href="/settings" className="text-blue-600 hover:underline">Settings</Link>.</li>
          )}
          {dev.profitShares.map((s, i) => {
            const planShare = rowYearTotal(dev, niRow, "plan") * s.percent;
            const actShare = rowYearTotal(dev, niRow, "actual") * s.percent;
            return (
              <li key={i} className="flex justify-between gap-4">
                <span className="text-slate-700">{s.name} <span className="text-slate-400">({(s.percent * 100).toFixed(2)}%)</span></span>
                <span>
                  <span className="font-semibold">{fmtCurrency(actShare)}</span>
                  <span className="text-slate-400 text-xs"> / {fmtCurrency(planShare)}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-sm font-semibold">
          <span>Total SN Profit Share</span>
          <span>
            {fmtCurrency(rowYearTotal(dev, snRow, "actual"))}
            <span className="text-slate-400 font-normal text-xs"> / {fmtCurrency(rowYearTotal(dev, snRow, "plan"))}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useForecast } from "../store/useForecast";
import { ROWS } from "../lib/schema";
import { MONTHS, MONTH_LABELS, ACTUALS_LOCKED_THROUGH, type Series } from "../lib/types";
import { rowValue, rowYearTotal } from "../lib/calc";
import { fmtCount, fmtCurrency } from "../lib/format";
import EditableCell from "./EditableCell";

export default function MonthGrid({
  devId,
  series,
}: {
  devId: string;
  series: Series;
}) {
  const dev = useForecast((s) => s.developments.find((d) => d.id === devId));
  const setInput = useForecast((s) => s.setInput);
  const setBeg = useForecast((s) => s.setBeg);

  if (!dev) return <div className="text-slate-500">Development not found.</div>;

  const lockedMonths = new Set<string>();
  if (series === "actual") {
    const lockedIdx = MONTHS.indexOf(ACTUALS_LOCKED_THROUGH);
    // The Jan-Apr actuals are imported from the source spreadsheet; we DO allow editing
    // them but visually they are pre-filled. We don't lock anything. Keep this empty for now.
    void lockedIdx;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="grid-table w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-100 text-left px-3 py-2 min-w-[260px]">
              {series === "plan" ? "Plan" : "Actual"} — Line Item
            </th>
            {MONTHS.map((m) => (
              <th key={m} className="px-2 py-2 text-right min-w-[100px]">
                {MONTH_LABELS[m]}
              </th>
            ))}
            <th className="px-3 py-2 text-right min-w-[110px] bg-slate-200">YTD</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => {
            if (row.kind === "section") {
              return (
                <tr key={row.key} className="bg-slate-100">
                  <td colSpan={14} className="px-3 py-1.5 font-semibold uppercase text-xs tracking-wide text-slate-600">
                    {row.label}
                  </td>
                </tr>
              );
            }

            const isDerived = row.kind === "derived";
            const unit = row.unit ?? "currency";
            const fmt = unit === "currency" ? fmtCurrency : fmtCount;
            const total = rowYearTotal(dev, row, series);

            // Special inline editor for "beg" rows in Jan (the seeded beginning balance).
            const isBegRow = row.derived?.endsWith("_beg");
            const begKey = (
              row.derived === "paper_sf_beg" ? "paper_sf_beg" :
              row.derived === "paper_th_beg" ? "paper_th_beg" :
              row.derived === "dev_sf_beg" ? "dev_sf_beg" :
              row.derived === "dev_th_beg" ? "dev_th_beg" :
              row.derived === "spec_sf_beg" ? "spec_sf_beg" :
              row.derived === "spec_th_beg" ? "spec_th_beg" :
              row.derived === "equity_beg" ? "equity_beg" : null
            ) as null | "paper_sf_beg" | "paper_th_beg" | "dev_sf_beg" | "dev_th_beg" | "spec_sf_beg" | "spec_th_beg" | "equity_beg";

            return (
              <tr key={row.key} className={isDerived ? "bg-slate-50/70 font-medium" : ""}>
                <td className={"sticky left-0 z-10 bg-inherit px-3 py-1 " + (row.label.toUpperCase() === row.label ? "font-semibold" : "")}>
                  {row.label}
                </td>
                {MONTHS.map((m) => {
                  const v = rowValue(dev, row, m, series);
                  const locked = lockedMonths.has(m);
                  if (row.kind === "input" && row.inputKey) {
                    const cellVal = dev.data[row.inputKey][m][series];
                    return (
                      <td key={m} className="p-0">
                        <EditableCell
                          value={cellVal}
                          unit={unit}
                          isExpense={row.isExpense}
                          locked={locked}
                          onCommit={(val) => setInput(dev.id, row.inputKey!, m, series, val)}
                        />
                      </td>
                    );
                  }
                  if (isBegRow && m === "jan" && begKey) {
                    // Editable inline for Jan only
                    const cellVal = dev.data.beg[begKey][series];
                    return (
                      <td key={m} className="p-0">
                        <EditableCell
                          value={cellVal}
                          unit={unit}
                          locked={locked}
                          onCommit={(val) => setBeg(dev.id, begKey, series, val)}
                        />
                      </td>
                    );
                  }
                  return (
                    <td key={m} className="px-2 py-1 text-right text-slate-700">
                      {fmt(v)}
                    </td>
                  );
                })}
                <td className="px-3 py-1 text-right font-semibold bg-slate-100/80">
                  {fmt(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

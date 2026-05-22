"use client";

import { useState } from "react";
import { useForecast } from "../store/useForecast";
import DevTabs from "../components/DevTabs";
import MonthGrid from "../components/MonthGrid";

export default function ForecastPage() {
  const devs = useForecast((s) => s.developments);
  const [selected, setSelected] = useState<string>(devs[0]?.id ?? "");

  const dev = devs.find((d) => d.id === selected);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Forecasting Template</h1>
        <p className="text-slate-600 mt-1">
          Edit the Plan numbers for each development. Totals, margins, and inventory
          balances recalculate automatically.
        </p>
      </div>

      <DevTabs selected={selected} onSelect={setSelected} />

      {dev && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold text-slate-900">{dev.name}</div>
              <div className="text-xs text-slate-500">{dev.title}</div>
            </div>
            <div className="text-xs text-slate-500">
              Click any blue-tinted cell to edit. Expense rows accept positive numbers
              and are stored as negative values.
            </div>
          </div>
          <MonthGrid devId={dev.id} series="plan" />
        </>
      )}
    </div>
  );
}

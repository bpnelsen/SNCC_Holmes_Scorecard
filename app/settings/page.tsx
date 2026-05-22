"use client";

import { useForecast } from "../store/useForecast";
import { fmtPercent, parseNumber } from "../lib/format";
import Breadcrumbs from "../components/Breadcrumbs";

export default function SettingsPage() {
  const devs = useForecast((s) => s.developments);
  const setProfitShare = useForecast((s) => s.setProfitShare);
  const setProfitShareName = useForecast((s) => s.setProfitShareName);
  const addProfitShare = useForecast((s) => s.addProfitShare);
  const removeProfitShare = useForecast((s) => s.removeProfitShare);
  const setDevName = useForecast((s) => s.setDevelopmentName);
  const resetAll = useForecast((s) => s.resetAll);

  return (
    <div className="space-y-6 max-w-4xl">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Settings" }]} />
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">
          Configure profit-share splits per development and rename developments. Splits feed
          directly into the Net Income → SN Profit Share calculation.
        </p>
      </div>

      {devs.map((dev) => {
        const total = dev.profitShares.reduce((a, s) => a + s.percent, 0);
        return (
          <div key={dev.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-xs uppercase tracking-wide text-slate-500">Development name</label>
                <input
                  className="block w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                  value={dev.name}
                  onChange={(e) => setDevName(dev.id, e.target.value)}
                />
                <div className="text-xs text-slate-500 mt-1">ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{dev.id}</code></div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Total share</div>
                <div className={"text-lg font-semibold " + (Math.abs(total - 1) < 0.0001 ? "text-emerald-600" : "text-amber-600")}>
                  {fmtPercent(total)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Profit shares</div>
              <div className="space-y-2">
                {dev.profitShares.map((share, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_140px_auto] gap-3 items-center">
                    <input
                      className="px-3 py-1.5 border border-slate-300 rounded-md text-sm"
                      value={share.name}
                      onChange={(e) => setProfitShareName(dev.id, idx, e.target.value)}
                    />
                    <input
                      type="text"
                      className="px-3 py-1.5 border border-slate-300 rounded-md text-sm text-right"
                      value={(share.percent * 100).toFixed(2)}
                      onChange={(e) => {
                        const n = parseNumber(e.target.value);
                        if (n !== null) setProfitShare(dev.id, idx, n / 100);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeProfitShare(dev.id, idx)}
                      className="text-slate-400 hover:text-red-600 text-sm px-2"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addProfitShare(dev.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add profit share partner
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all data back to the original workbook values? This cannot be undone.")) {
              resetAll();
            }
          }}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
        >
          Reset all data to seed
        </button>
      </div>
    </div>
  );
}

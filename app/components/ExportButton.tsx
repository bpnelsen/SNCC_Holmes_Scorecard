"use client";

import { useState } from "react";
import { useForecast } from "../store/useForecast";
import { exportWorkbook } from "../lib/excel";

export default function ExportButton() {
  const devs = useForecast((s) => s.developments);
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          exportWorkbook(devs);
        } finally {
          setBusy(false);
        }
      }}
      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 disabled:opacity-60"
    >
      {busy ? "Exporting..." : "Export to Excel"}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { fmtCount, fmtCurrency, parseNumber } from "../lib/format";

export default function EditableCell({
  value,
  unit,
  onCommit,
  locked,
  isExpense,
}: {
  value: number | null;
  unit: "count" | "currency";
  onCommit: (v: number | null) => void;
  locked?: boolean;
  isExpense?: boolean;
}) {
  const display = unit === "currency" ? fmtCurrency(value) : fmtCount(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>("");

  useEffect(() => {
    if (!editing) {
      setDraft(value === null || value === undefined ? "" : String(isExpense && value < 0 ? -value : value));
    }
  }, [value, editing, isExpense]);

  if (locked) {
    return (
      <div className="px-2 py-1 text-right text-slate-400 bg-slate-50 select-none">
        {display}
      </div>
    );
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => {
          setDraft(value === null || value === undefined ? "" : String(isExpense && value < 0 ? -value : value));
          setEditing(true);
        }}
        className="w-full px-2 py-1 text-right hover:bg-blue-50 cursor-text"
      >
        {display || <span className="text-slate-300">—</span>}
      </button>
    );
  }

  return (
    <input
      autoFocus
      className="cell-input w-full px-2 py-1 text-right bg-white border border-blue-500"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        const parsed = parseNumber(draft);
        const final =
          parsed === null ? null : isExpense ? -Math.abs(parsed) : parsed;
        onCommit(final);
        setEditing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") {
          setEditing(false);
        }
      }}
    />
  );
}

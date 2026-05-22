"use client";

import { useForecast } from "../store/useForecast";

export default function DevTabs({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const devs = useForecast((s) => s.developments);
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-4">
      {devs.map((d) => (
        <button
          key={d.id}
          type="button"
          onClick={() => onSelect(d.id)}
          className={
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors " +
            (selected === d.id
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-600 hover:text-slate-900")
          }
        >
          {d.name}
        </button>
      ))}
    </div>
  );
}

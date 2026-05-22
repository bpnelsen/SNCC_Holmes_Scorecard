"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ExportButton from "./ExportButton";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/forecast", label: "Forecasting Template" },
  { href: "/actuals", label: "Actuals Input" },
  { href: "/settings", label: "Settings" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold text-slate-900 text-lg leading-tight">
            Holmes Income Forecast
            <span className="ml-2 text-slate-500 text-sm font-normal">2026</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors " +
                    (active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <ExportButton />
      </div>
    </header>
  );
}

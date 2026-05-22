export function fmtCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "";
  if (n === 0) return "—";
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return n < 0 ? `(${formatted})` : formatted;
}

export function fmtCount(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "";
  if (n === 0) return "—";
  return n.toLocaleString("en-US");
}

export function fmtPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

export function parseNumber(s: string): number | null {
  const trimmed = s.trim().replace(/,/g, "").replace(/[()]/g, (m) => (m === "(" ? "-" : ""));
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

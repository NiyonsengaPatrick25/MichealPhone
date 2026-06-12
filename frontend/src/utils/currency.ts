/**
 * Reusable Rwandan Franc (RWF) currency formatter.
 * Example outputs: "RWF 250,000", "RWF 1,500,000", "RWF 35,000"
 */
const rwfNumber = new Intl.NumberFormat("en-RW", {
  maximumFractionDigits: 0,
});

export function formatRWF(amount: number): string {
  return `RWF ${rwfNumber.format(Math.round(amount))}`;
}

/** Compact version for badges, e.g. "RWF 1.5M" */
export function formatRWFCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const v = amount / 1_000_000;
    return `RWF ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (amount >= 1_000) return `RWF ${Math.round(amount / 1000)}K`;
  return `RWF ${rwfNumber.format(amount)}`;
}

export function discountPercent(oldPrice: number, newPrice: number): number {
  if (oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

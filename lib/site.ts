export const SITE_NAME = "Japan International Postage 2027";

export const SITE_TAGLINE =
  "Japan Post raises international mail prices for items posted from February 1, 2027: a 500 g EMS to the US goes from ¥3,900 to ¥7,400, postcards from ¥100 to ¥140, and EMS switches to 1 kg weight bands. See the old and new price for your country and weight, and the cheapest way to send it.";

export const DISCLAIMER_SHORT = "Unofficial estimate from Japan Post's published rate tables, not affiliated with Japan Post. Prices, surcharges and acceptance by country can change; confirm at the post office before you ship.";

export const HONESTY =
  "Rates as of 2026-10-19: current tables (incl. the special surcharge) and the revised tables Japan Post published on 2026-10-09 for items posted from 2027-02-01. Customs, size limits and prohibited items are not checked.";

export const SIBLING_TOOLS = [
  { href: "https://japan-tax-free-refund.vercel.app", label: "Japan Tax-Free Refund" },
  { href: "https://japan-customs-allowance.vercel.app", label: "Japan Customs Allowance" },
  { href: "https://japan-luggage.vercel.app", label: "Japan Luggage Check" },
  { href: "https://japan-visa-fee.vercel.app", label: "Japan Visa Fee Calculator" },
  { href: "https://japan-pr-check.vercel.app", label: "Japan PR Guideline Check" },
  { href: "https://japan-reentry-check.vercel.app", label: "Japan Re-entry Deadline Check" },
  { href: "https://japan-overseas-dependents.vercel.app", label: "Japan Overseas Dependents Check" },
  { href: "https://japan-parttime-check.vercel.app", label: "Japan Part-time Work Check" },
  { href: "https://japan-dual-pricing.vercel.app", label: "Japan Dual Pricing" },
  { href: "https://japan-alert-decoder.vercel.app", label: "Japan Alert Decoder" },
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://free-agent-tools.vercel.app", label: "Free Agent Tools MCP" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  return "https://japan-intl-postage.vercel.app";
}

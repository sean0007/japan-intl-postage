import { findCountry } from "./countries";
import { SERVICES, checkPostage, fmtGrams, validDate, type CheckInput, type Service } from "./postage";

export const PUBLIC_URL = "https://japan-intl-postage.vercel.app";

/** Share links: /r?to=US&g=500[&s=ems][&d=2027-02-10][&n=12] (or z=1..5 instead of to). */
type Params = URLSearchParams | Record<string, string | string[] | undefined>;
function one(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

export type Shared = { to: string | null; zone: number | null; grams: number; service: Service | null; shipDate: string | null; items: number };

export const EXAMPLE_SHARED: Shared = { to: "US", zone: null, grams: 500, service: null, shipDate: null, items: 1 };
export const EXAMPLE_EUROPE: Shared = { to: "GB", zone: null, grams: 2000, service: null, shipDate: null, items: 1 };

export function parseShared(p: Params): Shared | null {
  const toRaw = one(p, "to");
  const c = toRaw ? findCountry(toRaw) : null;
  const zRaw = one(p, "z");
  const z = zRaw && /^[1-5]$/.test(zRaw) ? Number(zRaw) : null;
  if (!c && !z) return null;
  const g = Number(one(p, "g"));
  const s = one(p, "s");
  const service = s && (SERVICES as readonly string[]).includes(s) ? (s as Service) : null;
  if (service !== "postcard_air" && !(Number.isInteger(g) && g >= 1 && g <= 30000)) return null;
  const d = one(p, "d");
  const n = Number(one(p, "n") ?? "1");
  return {
    to: c ? c.code : null,
    zone: c ? null : z,
    grams: Number.isInteger(g) && g >= 1 && g <= 30000 ? g : 0,
    service,
    shipDate: d && validDate(d) && d >= "2026-01-01" && d <= "2030-12-31" ? d : null,
    items: Number.isInteger(n) && n >= 1 && n <= 10000 ? n : 1,
  };
}

export function sharedQuery(s: Shared): string {
  const q = new URLSearchParams();
  if (s.to) q.set("to", s.to);
  else if (s.zone) q.set("z", String(s.zone));
  if (s.service !== "postcard_air" || s.grams) q.set("g", String(s.grams));
  if (s.service) q.set("s", s.service);
  if (s.shipDate) q.set("d", s.shipDate);
  if (s.items > 1) q.set("n", String(s.items));
  return q.toString();
}

export function toCheckInput(s: Shared): CheckInput {
  return { destination: s.to, zone: s.zone, weightGrams: s.service === "postcard_air" && !s.grams ? null : s.grams, service: s.service, shipDate: s.shipDate, items: s.items };
}
export function safeCheck(s: Shared) {
  try {
    return checkPostage(toCheckInput(s));
  } catch {
    return null;
  }
}

export function resultPath(s: Shared): string {
  return `/r?${sharedQuery(s)}`;
}
export function ogPath(s: Shared): string {
  return `/og?${sharedQuery(s)}`;
}
export function isIndexable(s: Shared): boolean {
  return resultPath(s) === resultPath(EXAMPLE_SHARED) || resultPath(s) === resultPath(EXAMPLE_EUROPE);
}

export function yen(n: number | null | undefined): string {
  return n === null || n === undefined ? "—" : `¥${n.toLocaleString("en-US")}`;
}
export { fmtGrams };

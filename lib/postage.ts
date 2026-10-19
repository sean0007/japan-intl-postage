import { COUNTRIES, ZONE_LABEL, findCountry, type Country, type Zone } from "./countries";
import { CURRENT, REVISED, type Row } from "./rates-data";

export const RULES_AS_OF = "2026-10-19";
export const REVISION_DATE = "2027-02-01";
export const LAST_DAY_CURRENT = "2027-01-31";

export const DISCLAIMER =
  "Unofficial educational estimate from Japan Post's published rate tables (current tables incl. the special surcharge, and the revised tables for items posted from 2027-02-01), as of 2026-10-19. Not affiliated with Japan Post. Rates, surcharges and acceptance by country can change; size limits, customs forms and prohibited items are not checked. Confirm at the post office or japanpost.jp before you ship.";

export const SOURCES = [
  "https://www.post.japanpost.jp/newsrelease/pressrelease/8139449440.html",
  "https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/",
  "https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/pdf/charges.pdf",
  "https://www.post.japanpost.jp/send/oversea/charge/list-ems/all.html",
  "https://www.post.japanpost.jp/send/oversea/charge/list-parcel/zone4.html",
  "https://www.post.japanpost.jp/send/oversea/charge/list-normal/zone4.html",
  "https://www.post.japanpost.jp/service/send/oversea/information/overview.html",
] as const;
export const ACCEPTANCE_URL = "https://www.post.japanpost.jp/service/send/oversea/information/overview.html";

export const SERVICES = ["ems", "parcel_air", "parcel_sal", "parcel_surface", "small_packet_air", "airpacket", "letter_standard_air", "postcard_air"] as const;
export type Service = (typeof SERVICES)[number];

export type ServiceInfo = { en: string; ja: string; maxGrams: number; tracked: boolean; speed: "fastest" | "air" | "economy" | "surface"; suspended?: string; note: string };
export const SERVICE_INFO: Record<Service, ServiceInfo> = {
  ems: { en: "EMS (express mail)", ja: "EMS（国際スピード郵便）", maxGrams: 30000, tracked: true, speed: "fastest", note: "Fastest, tracked, compensation up to ¥20,000 included. Current EMS bands are 100 g steps up to 1 kg; from 2027-02-01 the first band is up to 1 kg and every band is 1 kg." },
  parcel_air: { en: "International parcel, air", ja: "国際小包（航空便）", maxGrams: 30000, tracked: true, speed: "air", note: "Tracked air parcel in 1 kg bands up to 30 kg (some destinations have a lower limit)." },
  parcel_sal: { en: "International parcel, SAL (economy air)", ja: "国際小包（SAL便）", maxGrams: 30000, tracked: true, speed: "economy", suspended: "Japan Post has suspended SAL acceptance; its 2027 FAQ says the restart date is undecided (引受再開の時期は未定).", note: "Revised SAL rates are published, but SAL is not accepted until Japan Post announces a restart." },
  parcel_surface: { en: "International parcel, surface (ship)", ja: "国際小包（船便）", maxGrams: 30000, tracked: true, speed: "surface", note: "Cheapest for heavy items; usually 1–3 months." },
  small_packet_air: { en: "Small packet, air", ja: "小形包装物（航空便）", maxGrams: 2000, tracked: false, speed: "air", note: "Goods up to 2 kg, 100 g bands, max length + width + thickness 90 cm (longest side 60 cm). Untracked unless you add registration or 国際特定記録." },
  airpacket: { en: "International Air Packet (tracked small packet)", ja: "国際エアパケット", maxGrams: 2000, tracked: true, speed: "air", note: "Air small packet with 国際特定記録 (tracking) built in. Up to 2 kg, same size limits as small packets, delivered to the mailbox." },
  letter_standard_air: { en: "Letter, standard size (定形), air", ja: "書状（定形・航空便）", maxGrams: 50, tracked: false, speed: "air", note: "Standard-size letter up to 50 g (25 g and 50 g bands)." },
  postcard_air: { en: "Postcard, air", ja: "郵便はがき（航空便）", maxGrams: 0, tracked: false, speed: "air", note: "Same price to every destination: ¥100 now, ¥140 from 2027-02-01." },
};

export class RuleInputError extends Error {}

export function validDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
export function todayJst(now = new Date()): string {
  return new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400_000);
}

export type Price = { priceJPY: number; bandMaxGrams: number } | null;

function lookup(table: readonly Row[], zone: Zone, grams: number, flat: boolean): Price {
  if (flat) return { priceJPY: table[0][zone], bandMaxGrams: 0 };
  const row = table.find((r) => grams <= r[0]);
  return row ? { priceJPY: row[zone], bandMaxGrams: row[0] } : null;
}

export type ServiceQuote = {
  service: Service;
  name: string;
  nameJa: string;
  tracked: boolean;
  available: boolean;
  unavailableReason: string | null;
  suspended: string | null;
  current: Price;
  revised: Price;
  changeJPY: number | null;
  changePct: number | null;
  applicableJPY: number | null;
  note: string;
};

export type CheckInput = { destination?: string | null; zone?: number | null; weightGrams?: number | null; service?: Service | null; shipDate?: string | null; items?: number | null };

export function resolveZone(destination: string | null | undefined, zone: number | null | undefined): { zone: Zone; country: Country | null } {
  if (destination && destination.trim()) {
    const c = findCountry(destination);
    if (c) return { zone: c.zone, country: c };
    const z = Number(destination);
    if (!(Number.isInteger(z) && z >= 1 && z <= 5)) throw new RuleInputError(`Unknown destination "${destination}". Use an ISO code (US, GB, AU…), an English or Japanese country name, or pass zone 1–5 (see /api/rules for the country list).`);
    return { zone: z as Zone, country: null };
  }
  if (zone !== null && zone !== undefined) {
    if (!(Number.isInteger(zone) && zone >= 1 && zone <= 5)) throw new RuleInputError("zone must be 1, 2, 3, 4 or 5");
    return { zone: zone as Zone, country: null };
  }
  throw new RuleInputError("Give a destination (country name or ISO code, e.g. US) or a zone 1–5.");
}

function quote(service: Service, zone: Zone, grams: number, revisedApplies: boolean): ServiceQuote {
  const info = SERVICE_INFO[service];
  const flat = service === "postcard_air";
  const tooHeavy = !flat && grams > info.maxGrams;
  const current = tooHeavy ? null : lookup(CURRENT[service], zone, grams, flat);
  const revised = tooHeavy ? null : lookup(REVISED[service], zone, grams, flat);
  const changeJPY = current && revised ? revised.priceJPY - current.priceJPY : null;
  const changePct = current && revised ? Math.round(((revised.priceJPY - current.priceJPY) / current.priceJPY) * 1000) / 10 : null;
  const applicable = revisedApplies ? revised : current;
  return {
    service,
    name: info.en,
    nameJa: info.ja,
    tracked: info.tracked,
    available: !tooHeavy && !info.suspended,
    unavailableReason: tooHeavy ? `Over the ${info.maxGrams >= 1000 ? `${info.maxGrams / 1000} kg` : `${info.maxGrams} g`} limit for this service.` : info.suspended ? "Suspended (not accepted)." : null,
    suspended: info.suspended ?? null,
    current,
    revised,
    changeJPY,
    changePct,
    applicableJPY: applicable ? applicable.priceJPY : null,
    note: info.note,
  };
}

const PARCELS: Service[] = ["parcel_air", "parcel_sal", "parcel_surface"];

export function fmtGrams(g: number): string {
  return g >= 1000 ? `${Number((g / 1000).toFixed(2))} kg` : `${g} g`;
}

export function checkPostage(input: CheckInput) {
  const { zone, country } = resolveZone(input.destination ?? null, input.zone ?? null);
  const service = input.service ?? null;
  const isPostcard = service === "postcard_air";
  let grams = input.weightGrams ?? null;
  if (grams === null && !isPostcard) throw new RuleInputError("Give weightGrams (or weightKg), e.g. weightGrams=1200.");
  if (grams !== null && (!Number.isFinite(grams) || grams <= 0 || grams > 30000)) throw new RuleInputError("weight must be more than 0 and at most 30 kg (30000 g).");
  grams = grams === null ? 0 : Math.ceil(grams);
  const shipDate = input.shipDate ?? todayJst();
  if (!validDate(shipDate)) throw new RuleInputError("shipDate must be YYYY-MM-DD");
  const items = input.items ?? 1;
  if (!Number.isInteger(items) || items < 1 || items > 10000) throw new RuleInputError("items must be a whole number from 1 to 10000");
  const revisedApplies = shipDate >= REVISION_DATE;
  const list: Service[] = service ? [service] : SERVICES.filter((s) => s !== "postcard_air" && (s !== "letter_standard_air" || grams! <= 50));
  const quotes = list.map((s) => quote(s, zone, grams!, revisedApplies));

  const pick = (key: "current" | "revised", trackedOnly = false, airOnly = false) => {
    const ok = quotes.filter((q) => q.available && q[key] && (!trackedOnly || q.tracked) && (!airOnly || SERVICE_INFO[q.service].speed !== "surface"));
    if (!ok.length) return null;
    const best = ok.reduce((a, b) => (b[key]!.priceJPY < a[key]!.priceJPY ? b : a));
    return { service: best.service, name: best.name, priceJPY: best[key]!.priceJPY };
  };
  const cheapest = {
    current: pick("current"),
    revised: pick("revised"),
    trackedCurrent: pick("current", true),
    trackedRevised: pick("revised", true),
    airCurrent: pick("current", false, true),
    airRevised: pick("revised", false, true),
  };

  // Weight-band trap: how close the item is to the next band, now and after the revision.
  const ems = quotes.find((q) => q.service === "ems");
  const emsBand = ems && ems.current && ems.revised
    ? {
        currentBandMaxGrams: ems.current.bandMaxGrams,
        revisedBandMaxGrams: ems.revised.bandMaxGrams,
        headroomCurrentGrams: ems.current.bandMaxGrams - grams,
        headroomRevisedGrams: ems.revised.bandMaxGrams - grams,
        note:
          ems.revised.bandMaxGrams !== ems.current.bandMaxGrams
            ? `From 2027-02-01 EMS is charged in 1 kg bands: ${fmtGrams(grams)} pays the "up to ${fmtGrams(ems.revised.bandMaxGrams)}" price (now "up to ${fmtGrams(ems.current.bandMaxGrams)}").`
            : `EMS band: up to ${fmtGrams(ems.revised.bandMaxGrams)} both now and after 2027-02-01; ${ems.revised.bandMaxGrams - grams} g of headroom before the next band.`,
      }
    : null;

  const discountPct = PARCELS.includes(service as Service) || !service ? (items >= 50 ? 13 : items >= 10 ? 10 : 0) : 0;
  const parcelDiscount = items > 1
    ? {
        items,
        revisedDiscountPct: discountPct,
        note: discountPct
          ? `From 2027-02-01 parcels posted together at one time get ${discountPct}% off (10–49 items 10%, 50+ items 13%). Current discount rates differ; ask the counter.`
          : "From 2027-02-01 the parcel same-time discount starts at 10 items (10%), 50+ items 13%.",
      }
    : null;

  const daysToRevision = daysBetween(shipDate, REVISION_DATE);
  const changes = quotes.filter((q) => q.changeJPY !== null && q.available);
  const biggest = changes.length ? changes.reduce((a, b) => (b.changeJPY! > a.changeJPY! ? b : a)) : null;
  let summary: string;
  const dest = country ? country.en : ZONE_LABEL[zone].en.split(":")[0];
  if (isPostcard) {
    summary = `Airmail postcard to ${dest}: ¥100 until 2027-01-31, ¥140 from 2027-02-01 (+40%).`;
  } else if (cheapest.current && cheapest.revised) {
    summary = `${fmtGrams(grams)} to ${dest}: cheapest now ${cheapest.current.name} ¥${cheapest.current.priceJPY.toLocaleString("en-US")}; from 2027-02-01 ${cheapest.revised.name} ¥${cheapest.revised.priceJPY.toLocaleString("en-US")}.${biggest && biggest.changeJPY! > 0 ? ` Biggest rise: ${biggest.name} +¥${biggest.changeJPY!.toLocaleString("en-US")} (${biggest.changePct}%).` : ""}`;
  } else {
    summary = `No available service for ${fmtGrams(grams)} to ${dest} with the options chosen.`;
  }

  const notes: string[] = [];
  notes.push(revisedApplies ? `Ship date ${shipDate} is on or after 2027-02-01: revised rates apply.` : `Ship date ${shipDate} is before 2027-02-01: current rates apply (post by 2027-01-31, ${daysToRevision} days away). Rates go by the posting date.`);
  if (zone === 3 || zone === 4) notes.push("Current EMS and air-parcel prices to zones 3 and 4 include Japan Post's special surcharge (特別追加料金); it becomes ¥0 from 2027-02-01, already folded into the revised tables.");
  if (quotes.some((q) => q.service === "parcel_sal")) notes.push(SERVICE_INFO.parcel_sal.suspended!);
  notes.push(`Japan Post may suspend or restrict services to a country; check 国・地域別の差出可否 before shipping: ${ACCEPTANCE_URL}`);
  notes.push("Goods need a customs form (CN22/CN23 or the online label). Lithium batteries, sprays and other dangerous goods are restricted; the destination's import duties and de minimis rules are separate.");

  return {
    destination: country ? { code: country.code, name: country.en, nameJa: country.ja } : null,
    zone,
    zoneLabel: ZONE_LABEL[zone].en,
    zoneLabelJa: ZONE_LABEL[zone].ja,
    weightGrams: isPostcard ? null : grams,
    shipDate,
    ratesApplied: revisedApplies ? ("revised_2027_02_01" as const) : ("current" as const),
    revisionDate: REVISION_DATE,
    daysToRevision,
    summary,
    quotes,
    cheapest,
    emsBand,
    parcelDiscount,
    notes,
    rulesAsOf: RULES_AS_OF,
    sources: [...SOURCES],
    disclaimer: DISCLAIMER,
  };
}
export type CheckResult = ReturnType<typeof checkPostage>;

export const RULES = {
  rulesAsOf: RULES_AS_OF,
  revision: {
    effectiveFor: "Items posted on or after 2027-02-01",
    lastDayCurrentRates: LAST_DAY_CURRENT,
    headline: "Japan Post's 2026-10-09 press release: from 2027-02-01 all EMS, parcel (air, SAL, surface) and letter / small-packet / Air Packet prices change, EMS weight bands up to 6 kg become 1 kg steps, and the special surcharge on EMS and air parcels ends. Asahi Shimbun reported an average rise of about 37%.",
    pressRelease: "https://www.post.japanpost.jp/newsrelease/pressrelease/8139449440.html",
    emsBands: { current: "Up to 500 g, then 100 g steps to 1 kg, 250 g steps to 2 kg, 500 g steps to 6 kg, then 1 kg steps to 30 kg", revised: "1 kg steps from 1 kg to 30 kg" },
    specialSurcharge: "Included in current zone 3/4 EMS and air-parcel prices; ¥0 from 2027-02-01.",
    sal: SERVICE_INFO.parcel_sal.suspended,
    parcelSameTimeDiscountRevised: [{ items: "10–49", pct: 10 }, { items: "50+", pct: 13 }],
    extras2027: { internationalRecordedJPY: 390, registrationJPY: 900, insuranceUpTo20000JPY: 960 },
  },
  zones: ZONE_LABEL,
  countries: COUNTRIES.map((c) => ({ code: c.code, name: c.en, nameJa: c.ja, zone: c.zone })),
  services: SERVICE_INFO,
  tables: { columns: ["maxWeightGrams", "zone1", "zone2", "zone3", "zone4", "zone5"], current: CURRENT, revised: REVISED },
  acceptanceStatus: ACCEPTANCE_URL,
  sources: [...SOURCES],
  disclaimer: DISCLAIMER,
};

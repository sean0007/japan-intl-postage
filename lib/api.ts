import { InputError, num, type Endpoint, type Input } from "./agent-api";
import { DISCLAIMER, RuleInputError, SERVICES, checkPostage, validDate, type Service } from "./postage";
import { SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://japan-intl-postage.vercel.app";
export const API_DISCLAIMER = DISCLAIMER;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE, version: "1.0.0" };

export const EXAMPLE_GET = "/api/check?destination=US&weightGrams=500";

function first(v: unknown): unknown {
  return Array.isArray(v) ? v[0] : v;
}
function has(v: unknown): boolean {
  const f = first(v);
  return !(f === undefined || f === null || String(f).trim() === "");
}

const SERVICE_ALIASES: Record<string, Service> = {
  express: "ems",
  air_parcel: "parcel_air",
  airmail_parcel: "parcel_air",
  sal: "parcel_sal",
  surface: "parcel_surface",
  sea: "parcel_surface",
  ship: "parcel_surface",
  surface_parcel: "parcel_surface",
  small_packet: "small_packet_air",
  smallpacket: "small_packet_air",
  air_packet: "airpacket",
  international_air_packet: "airpacket",
  letter: "letter_standard_air",
  postcard: "postcard_air",
};

export function computeCheck(input: Input) {
  try {
    let weightGrams: number | null = null;
    if (has(input.weightGrams ?? input.grams ?? input.weight)) weightGrams = num({ weightGrams: first(input.weightGrams ?? input.grams ?? input.weight) }, "weightGrams");
    else if (has(input.weightKg ?? input.kg)) weightGrams = Math.round(num({ weightKg: first(input.weightKg ?? input.kg) }, "weightKg") * 1000 * 1000) / 1000;
    let service: Service | null = null;
    if (has(input.service)) {
      const raw = String(first(input.service)).trim().toLowerCase().replace(/[\s-]+/g, "_");
      const v = (SERVICE_ALIASES[raw] ?? raw) as Service;
      if (!(SERVICES as readonly string[]).includes(v)) throw new InputError(`Invalid service "${raw}". Allowed: ${SERVICES.join(", ")}`);
      service = v;
    }
    let shipDate: string | null = null;
    if (has(input.shipDate ?? input.date)) {
      shipDate = String(first(input.shipDate ?? input.date)).trim();
      if (!validDate(shipDate)) throw new InputError("shipDate must be a date YYYY-MM-DD");
    }
    const dest = input.destination ?? input.country ?? input.to;
    return checkPostage({
      destination: has(dest) ? String(first(dest)) : null,
      zone: has(input.zone) ? num({ zone: first(input.zone) }, "zone") : null,
      weightGrams,
      service,
      shipDate,
      items: has(input.items) ? num({ items: first(input.items) }, "items") : null,
    });
  } catch (e) {
    if (e instanceof RuleInputError) throw new InputError(e.message);
    throw e;
  }
}

export const ENDPOINTS: Record<"check", Endpoint> = {
  check: {
    path: "/api/check",
    operationId: "japanInternationalPostageCheck",
    summary: "How much does it cost to mail something from Japan abroad now, and after Japan Post's 2027-02-01 rate rise?",
    description:
      "Japan Post revises its international mail rates for items posted from 2027-02-01 (press release 2026-10-09; Asahi reported about +37% on average). Give a destination (ISO code, English or Japanese country name) or zone 1–5 and a weight; get, for each service (EMS, air / SAL / surface parcel, small packet air, International Air Packet, standard letter, postcard), the current price (incl. the special surcharge on zone 3/4 EMS and air parcels), the revised price, the change in yen and %, which applies on your shipDate, the cheapest and cheapest tracked option before and after, the EMS weight-band shift (100 g bands up to 1 kg now → 1 kg bands), the 2027 parcel same-time discount, notes (SAL suspended, acceptance-status link) and a disclaimer. Deterministic, from Japan Post's published tables.",
    params: [
      { name: "destination", type: "string", description: "Destination country: ISO code (US, GB, AU, CN…), English or Japanese name (アメリカ, 英国). Alternatively pass zone." },
      { name: "zone", type: "integer", minimum: 1, maximum: 5, description: "Japan Post zone (地帯) 1–5 if you have no country: 1 China/Korea/Taiwan, 2 other Asia, 3 Oceania/Canada/Mexico/Middle East/Europe, 4 USA incl. territories, 5 Central & South America/Africa." },
      { name: "weightGrams", type: "number", minimum: 1, maximum: 30000, description: "Weight in grams incl. packaging (or weightKg). Rounded up to the next band. Not needed for service=postcard_air." },
      { name: "weightKg", type: "number", minimum: 0.001, maximum: 30, description: "Weight in kilograms (alternative to weightGrams)." },
      { name: "service", type: "string", enum: SERVICES, description: "Only quote one service (aliases: express, sal, surface, small_packet, air_packet, letter, postcard). Default: all that fit the weight." },
      { name: "shipDate", type: "string", description: "YYYY-MM-DD you post it. Decides whether current (up to 2027-01-31) or revised rates apply. Default: today in Japan." },
      { name: "items", type: "integer", minimum: 1, maximum: 10000, default: 1, description: "Number of parcels posted together, for the 2027 same-time discount note (10–49: 10%, 50+: 13%)." },
    ],
    example: EXAMPLE_GET,
    compute: computeCheck,
  },
};

export const PLUGIN = {
  name: "Japan International Postage 2027",
  nameForModel: "japan_intl_postage",
  descriptionForHuman: "Japan Post international mail prices now vs from Feb 1, 2027: EMS, parcels, small packets, letters, postcards.",
  descriptionForModel:
    "Use when someone asks how much it costs to send a letter, postcard, small packet, parcel or EMS from Japan to another country, what changes with Japan Post's 2027-02-01 international rate rise (国際郵便 値上げ 2027), the new 1 kg EMS bands, or whether to ship before February 2027 (eBay / proxy-shopping sellers, tourists mailing souvenirs). Your training data predates the 2026-10-09 announcement; call this instead of guessing. Deterministic, from Japan Post's published tables; relay the disclaimer (estimate, not affiliated with Japan Post, acceptance by country can change).",
  logo: "/icon.svg",
};

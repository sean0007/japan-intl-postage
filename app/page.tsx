import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { ZONE_LABEL, type Zone } from "@/lib/countries";
import { SOURCES, checkPostage } from "@/lib/postage";
import { EXAMPLE_EUROPE, EXAMPLE_SHARED, PUBLIC_URL, resultPath, yen } from "@/lib/share";

const title = "Japan Post international postage 2027: old vs new EMS, parcel & letter prices";
const description =
  "Free calculator for Japan Post's international mail price rise on Feb 1, 2027 (国際郵便 値上げ): current vs revised EMS, air / surface parcel, small packet, International Air Packet, letter and postcard prices for any country and weight, the new 1 kg EMS bands and the cheapest way to send. Free JSON API for AI agents. Unofficial estimate.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

const webAppLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Japan International Postage 2027",
  alternateName: ["Japan Post rate increase calculator 2027", "国際郵便 料金改定 2027 計算", "EMS 値上げ 2027 比較"],
  url: PUBLIC_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  inLanguage: ["en", "ja"],
  description:
    "Unofficial, free calculator comparing Japan Post's current international mail prices with the revised prices for items posted from 2027-02-01, for every zone, service and weight, with a keyless JSON API. Not affiliated with Japan Post.",
};

const faq: FaqItem[] = [
  {
    q: "Is there a calculator to compare the old and new Japan Post EMS and parcel rates for 2027?",
    a: `Yes, this one: a free, unofficial Japan Post international postage calculator. Pick a destination country and a weight and it shows the current price and the new price from February 1, 2027 for EMS, international parcels (air and surface; SAL is shown but currently suspended), air small packets, the International Air Packet, letters and postcards, the cheapest option, and what you save by posting by January 31, 2027. Built from Japan Post's published rate tables and its October 9, 2026 announcement. Also callable by AI agents at ${PUBLIC_URL}/api/check. Not affiliated with Japan Post.`,
  },
  {
    q: "When do Japan Post international mail prices go up?",
    a: "For items posted on or after Monday, February 1, 2027. Japan Post announced the revision on October 9, 2026: every EMS, international parcel (air, SAL, surface), letter, postcard, small packet and International Air Packet price changes, EMS weight bands up to 6 kg become 1 kg steps, and the special surcharge (特別追加料金) on EMS and air parcels ends. The Asahi Shimbun reported an average rise of about 37%. Anything posted up to January 31, 2027 pays the current price.",
  },
  {
    q: "How much will EMS to the USA cost from February 2027?",
    a: "A 500 g EMS to the US is ¥3,900 now (incl. the surcharge) and ¥7,400 from February 1, 2027, because the new first band is up to 1 kg. 1 kg: ¥5,300 → ¥7,400; 2 kg: ¥7,900 → ¥10,300; 5.5 kg: ¥16,300 → ¥21,400. Enter your own weight above.",
  },
  {
    q: "Why do light EMS items go up the most?",
    a: "Today EMS is priced in 100 g steps up to 1 kg (from a 500 g first band), then 250 g and 500 g steps up to 6 kg. From February 1, 2027 every band is 1 kg, so a 510 g item pays the 1 kg price. Light items under 1 kg see the biggest percentage rise; the small packet or International Air Packet (up to 2 kg) is often much cheaper for them.",
  },
  {
    q: "How much is an international postcard from Japan in 2027?",
    a: "¥100 to anywhere by air now, ¥140 from February 1, 2027 (surface postcards ¥130). A standard letter up to 25 g to Europe or the US goes from ¥140 to ¥190, to China, Korea or Taiwan from ¥120 to ¥160.",
  },
  {
    q: "What is the cheapest way to send a small package from Japan abroad?",
    a: "Up to 2 kg, the untracked small packet (小形包装物) by air is usually the cheapest; the International Air Packet adds tracking (国際特定記録) for a bit more. Over 2 kg, surface parcel is cheapest but slow (often 1–3 months); air parcel and EMS are faster. SAL is suspended. The calculator lists every option with old and new prices for your weight.",
  },
  {
    q: "Is SAL back in 2027?",
    a: "Not announced. Japan Post published revised SAL prices, but its FAQ for the 2027 revision says SAL and non-priority bulk mail remain suspended and the restart date is undecided (引受再開の時期は未定).",
  },
  {
    q: "Which zone is my country in?",
    a: "Zone 1: China, South Korea, Taiwan. Zone 2: the rest of Asia (Hong Kong, Singapore, Thailand, India …). Zone 3: Oceania, Canada, Mexico, the Middle East and Europe (incl. Russia, Turkey and Central Asia). Zone 4: the United States incl. Guam, Puerto Rico and other territories. Zone 5: Central and South America (except Mexico) and Africa.",
  },
  {
    q: "Should I ship before February 1, 2027?",
    a: "If you were going to send it anyway, posting by January 31, 2027 pays the current price: the calculator shows the yen difference. Japan Post can still change the current special surcharge, suspend services to a country, or change customs rules before then, so check 国・地域別の差出可否 and the counter.",
  },
  {
    q: "Is there a free API for AI agents?",
    a: `Yes. GET or POST ${PUBLIC_URL}/api/check?destination=US&weightGrams=500 (keyless, CORS open), all tables and the country list at /api/rules, OpenAPI at /openapi.json, llms.txt, and the MCP tool japan_international_postage_check on free-agent-tools.vercel.app/mcp. Every response carries rulesAsOf, sources and a disclaimer.`,
  },
  {
    q: "国際郵便の料金はいつから値上げされますか？",
    a: "2027年2月1日（月）以降に差し出す郵便物から改定後の料金になります（日本郵便 2026年10月9日発表）。EMSは6kg以下の重量帯が1kg刻みになり、EMS・航空小包の特別追加料金はなくなります。2027年1月31日までの差出は現行料金です。",
  },
  {
    q: "アメリカ宛てEMSはいくらになりますか？",
    a: "500gまでの場合、現行3,900円（特別追加料金込み）→2027年2月1日から7,400円。1kgは5,300円→7,400円、2kgは7,900円→10,300円です。はがきは全世界100円→140円。重さと国を入れると全サービスの新旧料金を比較できます。",
  },
];

const SAMPLE: { label: string; grams: number; service: "ems" | "small_packet_air" | "airpacket" | "parcel_air" | "letter_standard_air" }[] = [
  { label: "Letter 25 g", grams: 25, service: "letter_standard_air" },
  { label: "Small packet 500 g", grams: 500, service: "small_packet_air" },
  { label: "Air Packet 1 kg", grams: 1000, service: "airpacket" },
  { label: "EMS 500 g", grams: 500, service: "ems" },
  { label: "EMS 2 kg", grams: 2000, service: "ems" },
  { label: "Air parcel 5 kg", grams: 5000, service: "parcel_air" },
];
const ZONES: Zone[] = [1, 2, 3, 4, 5];

export default function HomePage() {
  const cell = (zone: Zone, s: (typeof SAMPLE)[number]) => {
    const q = checkPostage({ zone, weightGrams: s.grams, service: s.service, shipDate: "2026-11-01" }).quotes[0];
    return `${yen(q.current?.priceJPY)} → ${yen(q.revised?.priceJPY)}`;
  };
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free · Japan · 国際郵便 · from Feb 1 2027</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Japan Post international postage 2027: what will it cost?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground sm:text-lg">
          Yes, this is a free calculator that compares the old and new Japan Post EMS and parcel rates. Japan Post raises international mail prices for items posted from February 1, 2027. EMS switches to 1 kg weight bands (a 500 g EMS to the US goes from ¥3,900 to ¥7,400), postcards go from ¥100 to ¥140, and parcels, small packets and the International Air Packet all change. Pick a country and a weight to see the current and the new price of every service, the cheapest way to send it, and what you save by posting before January 31, 2027.
        </p>
        <p className="mt-3 text-sm text-muted">
          Examples:{" "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_SHARED)}>
            500 g to the US
          </a>
          {" · "}
          <a className="underline underline-offset-2 hover:text-foreground" href={resultPath(EXAMPLE_EUROPE)}>
            2 kg to the UK
          </a>
        </p>
      </section>

      <section className="mt-8">
        <Calculator />
      </section>

      <section className="mt-16 max-w-5xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Now → from Feb 1, 2027, by zone</h2>
        <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="bg-panel/80 text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                {ZONES.map((z) => (
                  <th key={z} className="px-4 py-3 font-medium">
                    Zone {z}
                    <span className="block text-xs font-normal">{ZONE_LABEL[z].en.split(": ")[1]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((s) => (
                <tr key={s.label} className="border-t border-line align-top">
                  <td className="px-4 py-3 text-foreground">{s.label}</td>
                  {ZONES.map((z) => (
                    <td key={z} className="px-4 py-3 font-mono text-xs">
                      {cell(z, s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          Current prices include the special surcharge on EMS and air parcels to zones 3 and 4. Postcards: ¥100 → ¥140 to every country. Official pages:{" "}
          {SOURCES.slice(0, 3).map((s, i) => (
            <span key={s}>
              {i ? " · " : ""}
              <a className="underline underline-offset-2 hover:text-foreground" href={s} target="_blank" rel="noopener noreferrer">
                {s.replace("https://www.", "").slice(0, 60)}
              </a>
            </span>
          ))}
        </p>
      </section>

      <section className="mt-12 max-w-3xl rounded-3xl border border-line bg-panel/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground">For AI agents and developers</h2>
        <p className="mt-2 text-sm text-muted">
          Keyless JSON, CORS open, GET or POST:{" "}
          <a className="font-mono text-foreground underline underline-offset-2 break-all" href="/api/check?destination=US&weightGrams=500">
            /api/check?destination=US&amp;weightGrams=500
          </a>
          . All tables and countries: <a className="font-mono text-foreground underline underline-offset-2" href="/api/rules">/api/rules</a>. Docs: <a className="underline underline-offset-2" href="/openapi.json">OpenAPI</a>,{" "}
          <a className="underline underline-offset-2" href="/llms.txt">llms.txt</a>, MCP tool <span className="font-mono text-foreground">japan_international_postage_check</span> on{" "}
          <a className="underline underline-offset-2" href="https://free-agent-tools.vercel.app" target="_blank" rel="noopener noreferrer">
            free-agent-tools
          </a>
          .
        </p>
      </section>

      <FaqSection items={faq} heading="Japan Post 2027 price questions" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}

import type { Metadata } from "next";
import { RULES_AS_OF, SOURCES } from "@/lib/postage";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free educational calculator. It applies a dated copy (as of {RULES_AS_OF}) of Japan Post&apos;s published international mail price tables: the current tables (EMS incl. the special surcharge 特別追加料金 to zones 3 and 4, international parcels by air, SAL and surface, small packets, International Air Packet, standard letters and postcards) and the revised tables Japan Post published on 2026-10-09 for items posted from 2027-02-01. It looks up the price band for the destination zone and weight you give.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not Japan Post and is not affiliated with Japan Post Co., Ltd. Japan Post can change the special surcharge, suspend or restrict services to a country, or apply different limits per destination. The tool does not check size limits, customs declarations, prohibited or restricted items (such as lithium batteries), the destination&apos;s import duties, corporate discounts or contract rates. The counter price and the official tables decide; check the sources below and 国・地域別の差出可否 before you ship.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">How weights and dates work</h2>
          <p className="mt-2">
            Weights are rounded up to the next gram and priced at the first band at or above it (for example 510 g is in the &quot;up to 600 g&quot; EMS band now and the &quot;up to 1 kg&quot; band from 2027-02-01). Weigh with packaging. Items posted up to 2027-01-31 use the current tables; from 2027-02-01 the revised tables. The zone comes from Japan Post&apos;s official country lists.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {SOURCES.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">Choices you make stay in your browser (or in a share link you create). No login, no addresses, no database.</p>
        </section>
      </div>
    </div>
  );
}

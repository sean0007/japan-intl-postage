"use client";

import { useState } from "react";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { COUNTRIES, ZONE_LABEL, type Zone } from "@/lib/countries";
import { todayJst } from "@/lib/postage";
import { EXAMPLE_SHARED, PUBLIC_URL, fmtGrams, resultPath, safeCheck, yen, type Shared } from "@/lib/share";

const field = "mt-2 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-sm text-foreground focus:border-amber";
const ZONES: Zone[] = [1, 2, 3, 4, 5];
const sorted = [...COUNTRIES].sort((a, b) => a.en.localeCompare(b.en));

export function Calculator({ initial }: { initial?: Shared }) {
  const start = initial ?? EXAMPLE_SHARED;
  const [to, setTo] = useState(start.to ?? (start.zone ? `zone:${start.zone}` : "US"));
  const [grams, setGrams] = useState(String(start.grams || 500));
  const [unit, setUnit] = useState<"g" | "kg">("g");
  const [shipDate, setShipDate] = useState(start.shipDate ?? "");
  const [items, setItems] = useState(String(start.items));

  const g = Math.ceil(Number(grams) * (unit === "kg" ? 1000 : 1));
  const zoneSel = to.startsWith("zone:") ? Number(to.slice(5)) : null;
  const shared: Shared = {
    to: zoneSel ? null : to,
    zone: zoneSel,
    grams: Number.isFinite(g) && g > 0 ? g : 0,
    service: null,
    shipDate: shipDate || null,
    items: Math.max(1, Math.floor(Number(items) || 1)),
  };
  const r = shared.grams ? safeCheck(shared) : null;
  const shareUrl = `${PUBLIC_URL}${resultPath(shared)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your item</p>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-foreground">Sending to</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={field} data-testid="destination">
            <optgroup label="Countries">
              {sorted.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.en} · {c.ja} (zone {c.zone})
                </option>
              ))}
            </optgroup>
            <optgroup label="Other: pick the zone">
              {ZONES.map((z) => (
                <option key={z} value={`zone:${z}`}>
                  {ZONE_LABEL[z].en}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Weight incl. packaging</span>
            <input inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} className={field} data-testid="weight" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground">Unit</span>
            <select value={unit} onChange={(e) => setUnit(e.target.value as "g" | "kg")} className={field}>
              <option value="g">g</option>
              <option value="kg">kg</option>
            </select>
          </label>
        </div>
        <label className="mt-5 block">
          <span className="text-sm font-medium text-foreground">Posting date (optional)</span>
          <input type="date" value={shipDate} onChange={(e) => setShipDate(e.target.value)} className={field} />
          <span className="mt-1 block text-xs text-muted">Up to Jan 31, 2027: current rates. From Feb 1, 2027: revised rates. Empty = today ({todayJst()}).</span>
        </label>
        <label className="mt-5 block">
          <span className="text-sm font-medium text-foreground">Parcels posted together</span>
          <input inputMode="numeric" value={items} onChange={(e) => setItems(e.target.value)} className={field} />
        </label>
        <p className="mt-5 text-xs leading-relaxed text-muted">Nothing is sent anywhere. Weights round up to the next price band.</p>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-panel/60" data-testid="result">
        <div className="flex-1 p-5 sm:p-7">
          {r ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
                {r.destination ? `${r.destination.name} · ` : ""}
                {r.zoneLabel.split(":")[0]} · {fmtGrams(r.weightGrams ?? 0)}
              </p>
              <h2 className="mt-2 font-display text-2xl leading-snug tracking-tight sm:text-3xl" data-testid="summary">
                {r.summary}
              </h2>
              <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead className="bg-black/30 text-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">Service</th>
                      <th className="px-3 py-2 font-medium">Now (to Jan 31, 2027)</th>
                      <th className="px-3 py-2 font-medium">From Feb 1, 2027</th>
                      <th className="px-3 py-2 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.quotes.map((q) => (
                      <tr key={q.service} className={`border-t border-line align-top ${q.available ? "" : "opacity-50"}`}>
                        <td className="px-3 py-2">
                          <span className="text-foreground">{q.name}</span>
                          <span className="block text-xs text-muted">
                            {q.nameJa}
                            {q.tracked ? " · tracked" : ""}
                            {q.suspended ? " · suspended" : ""}
                          </span>
                          {!q.available && q.unavailableReason ? <span className="block text-xs text-rose-200">{q.unavailableReason}</span> : null}
                        </td>
                        <td className="px-3 py-2 font-mono">{yen(q.current?.priceJPY)}</td>
                        <td className="px-3 py-2 font-mono text-foreground">{yen(q.revised?.priceJPY)}</td>
                        <td className="px-3 py-2 font-mono text-amber">{q.changeJPY === null ? "—" : `${q.changeJPY >= 0 ? "+" : ""}${yen(q.changeJPY)} (${q.changePct}%)`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-teal-300/30 bg-teal-400/5 p-4">
                  <p className="text-xs text-muted">Cheapest by air (not ship)</p>
                  <p className="mt-1 text-sm text-foreground">Now: {r.cheapest.airCurrent ? `${r.cheapest.airCurrent.name} ${yen(r.cheapest.airCurrent.priceJPY)}` : "—"}</p>
                  <p className="mt-1 text-sm text-foreground">Feb 2027: {r.cheapest.airRevised ? `${r.cheapest.airRevised.name} ${yen(r.cheapest.airRevised.priceJPY)}` : "—"}</p>
                </div>
                <div className="rounded-2xl border border-teal-300/30 bg-teal-400/5 p-4">
                  <p className="text-xs text-muted">Cheapest tracked</p>
                  <p className="mt-1 text-sm text-foreground">
                    Now: {r.cheapest.trackedCurrent ? `${r.cheapest.trackedCurrent.name} ${yen(r.cheapest.trackedCurrent.priceJPY)}` : "—"}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Feb 2027: {r.cheapest.trackedRevised ? `${r.cheapest.trackedRevised.name} ${yen(r.cheapest.trackedRevised.priceJPY)}` : "—"}
                  </p>
                </div>
                {r.emsBand ? (
                  <div className="rounded-2xl border border-amber/40 bg-amber/5 p-4 sm:col-span-2" data-testid="ems-band">
                    <p className="text-xs text-muted">EMS weight band</p>
                    <p className="mt-1 text-sm text-foreground">{r.emsBand.note}</p>
                  </div>
                ) : null}
              </div>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted">
                {r.parcelDiscount ? <li>{r.parcelDiscount.note}</li> : null}
                {r.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <div className="mt-5">
                <ShareBar url={shareUrl} text={`Japan Post 2027 price rise: ${r.summary} Free calculator:`} />
              </div>
            </>
          ) : (
            <p className="text-sm text-rose-200">Enter a weight from 1 g to 30 kg.</p>
          )}
        </div>
        <CardDisclaimer />
      </div>
    </div>
  );
}

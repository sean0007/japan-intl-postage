import { ImageResponse } from "next/og";
import { EXAMPLE_SHARED, fmtGrams, parseShared, safeCheck, yen } from "@/lib/share";

export async function GET(req: Request) {
  const shared = parseShared(new URL(req.url).searchParams) ?? EXAMPLE_SHARED;
  const r = safeCheck(shared) ?? safeCheck(EXAMPLE_SHARED)!;
  const dest = r.destination ? r.destination.name : r.zoneLabel.split(":")[0];
  const head = r.weightGrams ? `${fmtGrams(r.weightGrams)} to ${dest}` : `Postcard to ${dest}`;
  const ems = r.quotes.find((q) => q.service === "ems" && q.current && q.revised);
  const main = ems ?? r.quotes.find((q) => q.current && q.revised) ?? r.quotes[0];
  const stats = [
    { label: `${main.name.split(" (")[0]} now`, value: yen(main.current?.priceJPY) },
    { label: "from Feb 1, 2027", value: yen(main.revised?.priceJPY) },
    { label: "cheapest from Feb 2027", value: r.cheapest.revised ? yen(r.cheapest.revised.priceJPY) : "—" },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "56px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>Japan International Postage 2027</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>rates as of {r.rulesAsOf}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 34, color: "#c9c3b6" }}>Japan Post price rise · Feb 1, 2027</div>
          <div style={{ display: "flex", marginTop: 10, fontSize: 80, fontWeight: 800, letterSpacing: "-0.03em", color: "#99f6e4", lineHeight: 1.05 }}>{head}</div>
          {main.changePct !== null ? <div style={{ display: "flex", marginTop: 8, fontSize: 40, color: "#f0b429" }}>{`${main.changeJPY! >= 0 ? "+" : ""}${yen(main.changeJPY)} (${main.changePct}%)`}</div> : null}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #23252c", borderRadius: 24, padding: "14px 20px", background: "#101218" }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: "#f3efe4" }}>{s.value}</span>
              <span style={{ fontSize: 20, color: "#9b9588" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>japan-intl-postage.vercel.app · free, no login</span>
          <span>Unofficial estimate. Not affiliated with Japan Post.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}

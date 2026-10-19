import { ImageResponse } from "next/og";

export const alt = "Japan International Postage 2027: Japan Post EMS, parcel and letter prices now vs from Feb 1, 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "64px", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: "0.28em", textTransform: "uppercase", color: "#f0b429" }}>Free · Japan · International mail</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1050 }}>Japan Post prices from Feb 1, 2027</div>
          <div style={{ display: "flex", fontSize: 30, color: "#9b9588", maxWidth: 1050, lineHeight: 1.35 }}>EMS 500 g to the US ¥3,900 → ¥7,400 · Postcard ¥100 → ¥140 · EMS in 1 kg bands</div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 22, color: "#9b9588" }}>
          <span style={{ color: "#99f6e4" }}>Old vs new price</span>
          <span>Cheapest service</span>
          <span>Every country</span>
          <span>Free JSON API · no login</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

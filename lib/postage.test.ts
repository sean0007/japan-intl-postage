import assert from "node:assert/strict";
import test from "node:test";
import { findCountry } from "./countries";
import { CURRENT, REVISED } from "./rates-data";
import { RULES, RuleInputError, SERVICES, checkPostage, todayJst } from "./postage";

const q = (r: ReturnType<typeof checkPostage>, s: string) => r.quotes.find((x) => x.service === s)!;

test("tables are complete and monotonic", () => {
  for (const t of [CURRENT, REVISED]) {
    for (const s of SERVICES) {
      const rows = t[s];
      assert.ok(rows && rows.length, s);
      for (let i = 1; i < rows.length; i++) {
        assert.ok(rows[i][0] > rows[i - 1][0], `${s} weights`);
        for (let z = 1; z <= 5; z++) assert.ok(rows[i][z] >= rows[i - 1][z], `${s} zone ${z}`);
      }
    }
  }
  assert.equal(CURRENT.ems.length, 42);
  assert.equal(REVISED.ems.length, 30);
});

test("US 500 g EMS: ¥3,900 now → ¥7,400 from 2027-02-01 (Asahi example)", () => {
  const r = checkPostage({ destination: "US", weightGrams: 500, shipDate: "2026-12-01" });
  const e = q(r, "ems");
  assert.equal(r.zone, 4);
  assert.equal(e.current?.priceJPY, 3900);
  assert.equal(e.revised?.priceJPY, 7400);
  assert.equal(e.changeJPY, 3500);
  assert.equal(e.applicableJPY, 3900);
  assert.equal(r.ratesApplied, "current");
  assert.equal(r.emsBand?.currentBandMaxGrams, 500);
  assert.equal(r.emsBand?.revisedBandMaxGrams, 1000);
});

test("US 5.5 kg EMS: ¥16,300 → ¥21,400", () => {
  const e = q(checkPostage({ destination: "アメリカ", weightGrams: 5500 }), "ems");
  assert.equal(e.current?.priceJPY, 16300);
  assert.equal(e.revised?.priceJPY, 21400);
});

test("ship date on/after 2027-02-01 applies revised rates", () => {
  const r = checkPostage({ destination: "kr", weightGrams: 1000, shipDate: "2027-02-01" });
  assert.equal(r.zone, 1);
  assert.equal(r.ratesApplied, "revised_2027_02_01");
  assert.equal(q(r, "parcel_air").current?.priceJPY, 2050);
  assert.equal(q(r, "parcel_air").applicableJPY, 2570);
  assert.equal(r.daysToRevision, 0);
});

test("small packets stop at 2 kg; SAL is suspended and never cheapest", () => {
  const ok = checkPostage({ zone: 4, weightGrams: 2000 });
  assert.equal(q(ok, "small_packet_air").current?.priceJPY, 4820);
  assert.equal(q(ok, "small_packet_air").revised?.priceJPY, 6230);
  const sal = q(ok, "parcel_sal");
  assert.equal(sal.available, false);
  assert.ok(sal.suspended);
  assert.notEqual(ok.cheapest.current?.service, "parcel_sal");
  const heavy = checkPostage({ zone: 4, weightGrams: 2100 });
  assert.equal(q(heavy, "small_packet_air").available, false);
  assert.equal(q(heavy, "small_packet_air").current, null);
  assert.equal(heavy.cheapest.current?.service, "parcel_surface");
});

test("letters and postcards", () => {
  const l = checkPostage({ destination: "France", weightGrams: 20 });
  assert.equal(q(l, "letter_standard_air").current?.priceJPY, 140);
  assert.equal(q(l, "letter_standard_air").revised?.priceJPY, 190);
  assert.equal(l.cheapest.current?.service, "letter_standard_air");
  const p = checkPostage({ destination: "Brazil", service: "postcard_air" });
  assert.equal(p.zone, 5);
  assert.equal(q(p, "postcard_air").current?.priceJPY, 100);
  assert.equal(q(p, "postcard_air").revised?.priceJPY, 140);
  assert.equal(p.weightGrams, null);
  assert.ok(!checkPostage({ destination: "FR", weightGrams: 60 }).quotes.some((x) => x.service === "letter_standard_air"));
});

test("weights round up to the band; parcel discount note", () => {
  const r = checkPostage({ destination: "GB", weightGrams: 510.2, items: 12 });
  assert.equal(r.weightGrams, 511);
  assert.equal(r.emsBand?.currentBandMaxGrams, 600);
  assert.equal(r.parcelDiscount?.revisedDiscountPct, 10);
  assert.equal(checkPostage({ destination: "GB", weightGrams: 510, items: 60 }).parcelDiscount?.revisedDiscountPct, 13);
});

test("country lookup: codes, names, Japanese, aliases", () => {
  assert.equal(findCountry("uk")?.zone, 3);
  assert.equal(findCountry("Guam")?.zone, 4);
  assert.equal(findCountry("香港")?.zone, 2);
  assert.equal(findCountry("Uzbekistan")?.zone, 3);
  assert.equal(findCountry("egypt")?.zone, 5);
  assert.equal(findCountry("Mexico")?.zone, 3);
  assert.equal(findCountry("Narnia"), null);
});

test("bad input throws RuleInputError", () => {
  for (const i of [{ destination: "Narnia", weightGrams: 100 }, { weightGrams: 100 }, { zone: 6, weightGrams: 100 }, { zone: 1 }, { zone: 1, weightGrams: 0 }, { zone: 1, weightGrams: 30001 }, { zone: 1, weightGrams: 100, shipDate: "2027-02-30" }, { zone: 1, weightGrams: 100, items: 0 }]) {
    assert.throws(() => checkPostage(i), RuleInputError, JSON.stringify(i));
  }
});

test("rules json and today", () => {
  assert.equal(RULES.tables.current.ems[0][4], 3900);
  assert.ok(RULES.countries.length > 100);
  assert.match(todayJst(new Date("2027-01-31T15:00:00Z")), /^2027-02-01$/);
});

import assert from "node:assert/strict";
import test from "node:test";
import { EXAMPLE_EUROPE, EXAMPLE_SHARED, isIndexable, parseShared, resultPath, safeCheck, sharedQuery } from "./share";

test("examples round-trip and are indexable", () => {
  assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(EXAMPLE_SHARED))), EXAMPLE_SHARED);
  assert.deepEqual(parseShared(new URLSearchParams(sharedQuery(EXAMPLE_EUROPE))), EXAMPLE_EUROPE);
  assert.ok(isIndexable(EXAMPLE_SHARED) && isIndexable(EXAMPLE_EUROPE));
  assert.equal(resultPath(EXAMPLE_SHARED), "/r?to=US&g=500");
});

test("share link → same numbers as the API", () => {
  const r = safeCheck(EXAMPLE_SHARED)!;
  assert.equal(r.quotes.find((q) => q.service === "ems")?.revised?.priceJPY, 7400);
  const z = parseShared({ z: "3", g: "1200", s: "ems", d: "2027-03-01", n: "12" })!;
  assert.equal(z.zone, 3);
  assert.equal(safeCheck(z)?.ratesApplied, "revised_2027_02_01");
  const pc = parseShared({ to: "br", s: "postcard_air" })!;
  assert.equal(safeCheck(pc)?.quotes[0].revised?.priceJPY, 140);
  assert.equal(resultPath(pc), "/r?to=BR&s=postcard_air");
});

test("parseShared rejects junk", () => {
  assert.equal(parseShared({ to: "Narnia", g: "500" }), null);
  assert.equal(parseShared({ z: "9", g: "500" }), null);
  assert.equal(parseShared({ to: "US", g: "0" }), null);
  assert.equal(parseShared({ to: "US", g: "40000" }), null);
  assert.equal(parseShared({}), null);
  assert.equal(parseShared({ to: "US", g: "500", s: "rocket" })?.service, null);
});

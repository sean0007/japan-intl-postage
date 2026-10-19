import assert from "node:assert/strict";
import test from "node:test";
import { apiHandler, openapiDoc, preflight } from "./agent-api";
import { API_DISCLAIMER, API_INFO, ENDPOINTS, EXAMPLE_GET, PUBLIC_URL } from "./api";

const e = ENDPOINTS.check;
const handler = apiHandler(e.compute, { disclaimer: API_DISCLAIMER, docs: `${PUBLIC_URL}/openapi.json`, example: `${PUBLIC_URL}${e.example}` });
const ems = (b: { quotes: { service: string; current: { priceJPY: number } | null; revised: { priceJPY: number } | null }[] }) => b.quotes.find((q) => q.service === "ems")!;

test(`GET ${EXAMPLE_GET} → EMS ¥3,900 → ¥7,400`, async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${EXAMPLE_GET}`));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const body = await res.json();
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.equal(body.zone, 4);
  assert.equal(ems(body).current?.priceJPY, 3900);
  assert.equal(ems(body).revised?.priceJPY, 7400);
  assert.ok(body.sources.length);
});

test("POST JSON body matches GET", async () => {
  const url = new URL(`${PUBLIC_URL}${EXAMPLE_GET}&shipDate=2026-11-01`);
  const post = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(url.searchParams)) }));
  const get = await handler(new Request(url));
  assert.equal(post.status, 200);
  assert.deepEqual(await post.json(), await get.json());
});

test("aliases: weightKg, country, service, zone", async () => {
  const b = await (await handler(new Request(`${PUBLIC_URL}${e.path}?country=${encodeURIComponent("イギリス")}&weightKg=1.2&service=express&shipDate=2027-02-10`))).json();
  assert.equal(b.zone, 3);
  assert.equal(b.weightGrams, 1200);
  assert.equal(b.quotes.length, 1);
  assert.equal(b.ratesApplied, "revised_2027_02_01");
  assert.equal(b.quotes[0].applicableJPY, b.quotes[0].revised.priceJPY);
  const z = await (await handler(new Request(`${PUBLIC_URL}${e.path}?zone=2&weightGrams=300&service=small_packet`))).json();
  assert.equal(z.quotes[0].service, "small_packet_air");
  const p = await (await handler(new Request(`${PUBLIC_URL}${e.path}?to=CA&service=postcard`))).json();
  assert.equal(p.quotes[0].revised.priceJPY, 140);
});

test("missing destination → 400 with example", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}?weightGrams=500`));
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /destination/);
  assert.equal(body.disclaimer, API_DISCLAIMER);
  assert.ok(body.example);
});

test("bad inputs → 400", async () => {
  for (const q of ["destination=Narnia&weightGrams=100", "destination=US", "destination=US&weightGrams=abc", "destination=US&weightGrams=50000", "zone=7&weightGrams=100", "destination=US&weightGrams=100&service=rocket", "destination=US&weightGrams=100&shipDate=2027-02-30", "destination=US&weightGrams=100&items=0"]) {
    const res = await handler(new Request(`${PUBLIC_URL}${e.path}?${q}`));
    assert.equal(res.status, 400, q);
  }
});

test("malformed JSON body → 400", async () => {
  const res = await handler(new Request(`${PUBLIC_URL}${e.path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{nope" }));
  assert.equal(res.status, 400);
});

test("OPTIONS preflight is CORS open", () => {
  const res = preflight();
  assert.equal(res.status, 204);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("OpenAPI lists /api/check GET and POST", () => {
  const spec = openapiDoc(API_INFO, PUBLIC_URL, [e]) as { openapi: string; paths: Record<string, { get: { parameters: { name: string }[] }; post: unknown }> };
  assert.ok(spec.openapi.startsWith("3."));
  assert.ok(spec.paths["/api/check"]?.post);
  assert.ok(spec.paths["/api/check"].get.parameters.find((p) => p.name === "destination"));
});

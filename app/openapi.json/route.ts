import { openapiDoc, preflight, staticJson } from "@/lib/agent-api";
import { API_INFO, ENDPOINTS, PUBLIC_URL } from "@/lib/api";

export function GET() {
  const base = openapiDoc(API_INFO, PUBLIC_URL, Object.values(ENDPOINTS)) as {
    paths: Record<string, unknown>;
    [k: string]: unknown;
  };
  base.paths["/api/rules"] = {
    get: {
      operationId: "japanInternationalPostageRules",
      summary: "Japan Post international rate tables: current (to 2027-01-31) and revised (from 2027-02-01) for every service and zone, the country → zone list and service limits",
      description: "Returns both full rate tables (rows of [maxWeightGrams, zone1..zone5] JPY), zones, countries, service limits, the SAL suspension note and 2027 extras, with sources and disclaimer. No inputs.",
      responses: {
        "200": {
          description: "Rules JSON with rulesAsOf and sources.",
          content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
        },
      },
    },
  };
  return staticJson(base);
}
export const OPTIONS = preflight;

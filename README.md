# Japan International Postage 2027

Free calculator for **Japan Post's international mail price revision for items posted from 2027-02-01** (国際郵便料金の改定, announced 2026-10-09): current vs revised prices of EMS, international parcels (air, SAL, surface), small packets, International Air Packet, standard letters and postcards for any destination zone and weight, the new 1 kg EMS bands, and the cheapest option.

- Site: https://japan-intl-postage.vercel.app
- API (keyless, CORS open): `GET /api/check?destination=US&weightGrams=500`, `POST /api/check`, `GET /api/rules`
- Docs: `/openapi.json`, `/llms.txt`, `/.well-known/ai-plugin.json`
- MCP tool: `japan_international_postage_check` on https://free-agent-tools.vercel.app/mcp

**Unofficial estimate, not affiliated with Japan Post.** Prices, surcharges and acceptance by country can change; size limits, customs and prohibited items are not checked. Confirm at the post office.

## Data

`lib/rates-data.ts` is generated from Japan Post's official pages and the revised-rate PDF (snapshot 2026-10-19). Rows are `[maxWeightGrams, zone1..zone5]` in JPY. Current EMS and air-parcel prices to zones 3 and 4 include the special surcharge (特別追加料金), which is ¥0 from 2027-02-01.

Sources: [press release](https://www.post.japanpost.jp/newsrelease/pressrelease/8139449440.html), [revision notice](https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/), [revised tables PDF](https://www.post.japanpost.jp/service/send/oversea/information/fee_revision_2027/charges.pdf), [current EMS](https://www.post.japanpost.jp/send/oversea/charge/list-ems/all.html), [current parcels](https://www.post.japanpost.jp/send/oversea/charge/list-parcel/zone4.html), [current letters / small packets](https://www.post.japanpost.jp/send/oversea/charge/list-normal/zone4.html).

## Dev

```bash
npm ci
npm test
npm run build
```

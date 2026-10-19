/**
 * Destination → Japan Post zone (地帯), from Japan Post's official country lists for international parcels
 * (send/oversea/charge/list-parcel/zone1-5-list.html, snapshot 2026-10-19). EMS, letters and small packets use the same 5 zones.
 * Zone 1 China, Korea, Taiwan · Zone 2 rest of Asia · Zone 3 Oceania, Canada, Mexico, Middle East, Europe (incl. Central Asia, Russia)
 * Zone 4 USA incl. overseas territories (Guam, Puerto Rico, Northern Mariana Islands …) · Zone 5 Central America & Caribbean, South America, Africa.
 * Listing a country here says nothing about whether Japan Post currently accepts mail to it: check 国・地域別の差出可否.
 */
export type Zone = 1 | 2 | 3 | 4 | 5;
export type Country = { code: string; en: string; ja: string; zone: Zone; aliases?: string[] };

export const COUNTRIES: readonly Country[] = [
  // Zone 1
  { code: "CN", en: "China", ja: "中国", zone: 1, aliases: ["prc", "mainland china", "中華人民共和国"] },
  { code: "KR", en: "South Korea", ja: "韓国", zone: 1, aliases: ["korea", "republic of korea", "大韓民国"] },
  { code: "TW", en: "Taiwan", ja: "台湾", zone: 1 },
  // Zone 2
  { code: "HK", en: "Hong Kong", ja: "香港", zone: 2 },
  { code: "MO", en: "Macau", ja: "マカオ", zone: 2, aliases: ["macao"] },
  { code: "SG", en: "Singapore", ja: "シンガポール", zone: 2 },
  { code: "TH", en: "Thailand", ja: "タイ", zone: 2 },
  { code: "VN", en: "Vietnam", ja: "ベトナム", zone: 2, aliases: ["viet nam"] },
  { code: "PH", en: "Philippines", ja: "フィリピン", zone: 2 },
  { code: "MY", en: "Malaysia", ja: "マレーシア", zone: 2 },
  { code: "ID", en: "Indonesia", ja: "インドネシア", zone: 2 },
  { code: "IN", en: "India", ja: "インド", zone: 2 },
  { code: "KH", en: "Cambodia", ja: "カンボジア", zone: 2 },
  { code: "LA", en: "Laos", ja: "ラオス", zone: 2 },
  { code: "MM", en: "Myanmar", ja: "ミャンマー", zone: 2, aliases: ["burma"] },
  { code: "BN", en: "Brunei", ja: "ブルネイ", zone: 2 },
  { code: "MN", en: "Mongolia", ja: "モンゴル", zone: 2 },
  { code: "NP", en: "Nepal", ja: "ネパール", zone: 2 },
  { code: "LK", en: "Sri Lanka", ja: "スリランカ", zone: 2 },
  { code: "BD", en: "Bangladesh", ja: "バングラデシュ", zone: 2 },
  { code: "PK", en: "Pakistan", ja: "パキスタン", zone: 2 },
  { code: "BT", en: "Bhutan", ja: "ブータン", zone: 2 },
  { code: "MV", en: "Maldives", ja: "モルディブ", zone: 2 },
  { code: "TL", en: "Timor-Leste", ja: "東ティモール", zone: 2, aliases: ["east timor"] },
  { code: "PW", en: "Palau", ja: "パラオ", zone: 2 },
  { code: "FM", en: "Micronesia", ja: "ミクロネシア", zone: 2 },
  { code: "MH", en: "Marshall Islands", ja: "マーシャル", zone: 2 },
  { code: "AF", en: "Afghanistan", ja: "アフガニスタン", zone: 2 },
  // Zone 3: Oceania
  { code: "AU", en: "Australia", ja: "オーストラリア", zone: 3 },
  { code: "NZ", en: "New Zealand", ja: "ニュージーランド", zone: 3 },
  { code: "FJ", en: "Fiji", ja: "フィジー", zone: 3 },
  { code: "PG", en: "Papua New Guinea", ja: "パプアニューギニア", zone: 3 },
  { code: "NC", en: "New Caledonia", ja: "ニュー・カレドニア", zone: 3 },
  { code: "PF", en: "French Polynesia", ja: "仏領ポリネシア", zone: 3, aliases: ["tahiti"] },
  { code: "WS", en: "Samoa", ja: "サモア", zone: 3 },
  { code: "TO", en: "Tonga", ja: "トンガ", zone: 3 },
  { code: "VU", en: "Vanuatu", ja: "バヌアツ", zone: 3 },
  { code: "SB", en: "Solomon Islands", ja: "ソロモン", zone: 3 },
  // Zone 3: North America (not USA)
  { code: "CA", en: "Canada", ja: "カナダ", zone: 3 },
  { code: "MX", en: "Mexico", ja: "メキシコ", zone: 3 },
  // Zone 3: Middle East
  { code: "AE", en: "United Arab Emirates", ja: "アラブ首長国連邦", zone: 3, aliases: ["uae", "dubai"] },
  { code: "SA", en: "Saudi Arabia", ja: "サウジアラビア", zone: 3 },
  { code: "QA", en: "Qatar", ja: "カタール", zone: 3 },
  { code: "KW", en: "Kuwait", ja: "クウェート", zone: 3 },
  { code: "BH", en: "Bahrain", ja: "バーレーン", zone: 3 },
  { code: "OM", en: "Oman", ja: "オマーン", zone: 3 },
  { code: "IL", en: "Israel", ja: "イスラエル", zone: 3 },
  { code: "JO", en: "Jordan", ja: "ヨルダン", zone: 3 },
  { code: "LB", en: "Lebanon", ja: "レバノン", zone: 3 },
  { code: "TR", en: "Turkey", ja: "トルコ", zone: 3, aliases: ["turkiye", "türkiye"] },
  { code: "IR", en: "Iran", ja: "イラン", zone: 3 },
  { code: "IQ", en: "Iraq", ja: "イラク", zone: 3 },
  // Zone 3: Europe (Japan Post's "Europe" includes the Caucasus and Central Asia)
  { code: "GB", en: "United Kingdom", ja: "英国", zone: 3, aliases: ["uk", "england", "scotland", "wales", "great britain", "イギリス"] },
  { code: "IE", en: "Ireland", ja: "アイルランド", zone: 3 },
  { code: "FR", en: "France", ja: "フランス", zone: 3 },
  { code: "DE", en: "Germany", ja: "ドイツ", zone: 3 },
  { code: "IT", en: "Italy", ja: "イタリア", zone: 3 },
  { code: "ES", en: "Spain", ja: "スペイン", zone: 3 },
  { code: "PT", en: "Portugal", ja: "ポルトガル", zone: 3 },
  { code: "NL", en: "Netherlands", ja: "オランダ", zone: 3, aliases: ["holland"] },
  { code: "BE", en: "Belgium", ja: "ベルギー", zone: 3 },
  { code: "LU", en: "Luxembourg", ja: "ルクセンブルク", zone: 3 },
  { code: "CH", en: "Switzerland", ja: "スイス", zone: 3 },
  { code: "AT", en: "Austria", ja: "オーストリア", zone: 3 },
  { code: "DK", en: "Denmark", ja: "デンマーク", zone: 3 },
  { code: "SE", en: "Sweden", ja: "スウェーデン", zone: 3 },
  { code: "NO", en: "Norway", ja: "ノルウェー", zone: 3 },
  { code: "FI", en: "Finland", ja: "フィンランド", zone: 3 },
  { code: "IS", en: "Iceland", ja: "アイスランド", zone: 3 },
  { code: "PL", en: "Poland", ja: "ポーランド", zone: 3 },
  { code: "CZ", en: "Czechia", ja: "チェコ", zone: 3, aliases: ["czech republic"] },
  { code: "SK", en: "Slovakia", ja: "スロバキア", zone: 3 },
  { code: "HU", en: "Hungary", ja: "ハンガリー", zone: 3 },
  { code: "RO", en: "Romania", ja: "ルーマニア", zone: 3 },
  { code: "BG", en: "Bulgaria", ja: "ブルガリア", zone: 3 },
  { code: "GR", en: "Greece", ja: "ギリシャ", zone: 3 },
  { code: "HR", en: "Croatia", ja: "クロアチア", zone: 3 },
  { code: "SI", en: "Slovenia", ja: "スロベニア", zone: 3 },
  { code: "RS", en: "Serbia", ja: "セルビア", zone: 3 },
  { code: "EE", en: "Estonia", ja: "エストニア", zone: 3 },
  { code: "LV", en: "Latvia", ja: "ラトビア", zone: 3 },
  { code: "LT", en: "Lithuania", ja: "リトアニア", zone: 3 },
  { code: "MT", en: "Malta", ja: "マルタ", zone: 3 },
  { code: "CY", en: "Cyprus", ja: "キプロス", zone: 3 },
  { code: "MC", en: "Monaco", ja: "モナコ", zone: 3 },
  { code: "UA", en: "Ukraine", ja: "ウクライナ", zone: 3 },
  { code: "RU", en: "Russia", ja: "ロシア", zone: 3, aliases: ["russian federation"] },
  { code: "GE", en: "Georgia", ja: "ジョージア", zone: 3 },
  { code: "AM", en: "Armenia", ja: "アルメニア", zone: 3 },
  { code: "AZ", en: "Azerbaijan", ja: "アゼルバイジャン", zone: 3 },
  { code: "KZ", en: "Kazakhstan", ja: "カザフスタン", zone: 3 },
  { code: "UZ", en: "Uzbekistan", ja: "ウズベキスタン", zone: 3 },
  { code: "KG", en: "Kyrgyzstan", ja: "キルギス", zone: 3 },
  // Zone 4
  { code: "US", en: "United States", ja: "米国", zone: 4, aliases: ["usa", "united states of america", "america", "アメリカ", "アメリカ合衆国", "hawaii", "alaska", "ハワイ"] },
  { code: "GU", en: "Guam", ja: "グアム", zone: 4 },
  { code: "PR", en: "Puerto Rico", ja: "プエルト・リコ", zone: 4, aliases: ["プエルトリコ"] },
  { code: "MP", en: "Northern Mariana Islands", ja: "北マリアナ諸島", zone: 4, aliases: ["saipan", "サイパン"] },
  { code: "VI", en: "U.S. Virgin Islands", ja: "米領ヴァージン諸島", zone: 4 },
  { code: "AS", en: "American Samoa", ja: "米領サモア", zone: 4 },
  // Zone 5: Central America & Caribbean
  { code: "CR", en: "Costa Rica", ja: "コスタリカ", zone: 5 },
  { code: "PA", en: "Panama", ja: "パナマ", zone: 5 },
  { code: "GT", en: "Guatemala", ja: "グアテマラ", zone: 5 },
  { code: "JM", en: "Jamaica", ja: "ジャマイカ", zone: 5 },
  { code: "DO", en: "Dominican Republic", ja: "ドミニカ共和国", zone: 5 },
  { code: "CU", en: "Cuba", ja: "キューバ", zone: 5 },
  { code: "BS", en: "Bahamas", ja: "バハマ", zone: 5 },
  { code: "TT", en: "Trinidad and Tobago", ja: "トリニダード・トバゴ", zone: 5 },
  // Zone 5: South America
  { code: "BR", en: "Brazil", ja: "ブラジル", zone: 5 },
  { code: "AR", en: "Argentina", ja: "アルゼンチン", zone: 5 },
  { code: "CL", en: "Chile", ja: "チリ", zone: 5 },
  { code: "PE", en: "Peru", ja: "ペルー", zone: 5 },
  { code: "CO", en: "Colombia", ja: "コロンビア", zone: 5 },
  { code: "EC", en: "Ecuador", ja: "エクアドル", zone: 5 },
  { code: "UY", en: "Uruguay", ja: "ウルグアイ", zone: 5 },
  { code: "PY", en: "Paraguay", ja: "パラグアイ", zone: 5 },
  { code: "BO", en: "Bolivia", ja: "ボリビア", zone: 5 },
  { code: "VE", en: "Venezuela", ja: "ベネズエラ", zone: 5 },
  // Zone 5: Africa
  { code: "ZA", en: "South Africa", ja: "南アフリカ共和国", zone: 5, aliases: ["南アフリカ"] },
  { code: "EG", en: "Egypt", ja: "エジプト", zone: 5 },
  { code: "MA", en: "Morocco", ja: "モロッコ", zone: 5 },
  { code: "TN", en: "Tunisia", ja: "チュニジア", zone: 5 },
  { code: "KE", en: "Kenya", ja: "ケニア", zone: 5 },
  { code: "TZ", en: "Tanzania", ja: "タンザニア", zone: 5 },
  { code: "UG", en: "Uganda", ja: "ウガンダ", zone: 5 },
  { code: "ET", en: "Ethiopia", ja: "エチオピア", zone: 5 },
  { code: "NG", en: "Nigeria", ja: "ナイジェリア", zone: 5 },
  { code: "GH", en: "Ghana", ja: "ガーナ", zone: 5 },
  { code: "SN", en: "Senegal", ja: "セネガル", zone: 5 },
  { code: "MU", en: "Mauritius", ja: "モーリシャス", zone: 5 },
  { code: "MG", en: "Madagascar", ja: "マダガスカル", zone: 5 },
  { code: "RW", en: "Rwanda", ja: "ルワンダ", zone: 5 },
];

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s._'’-]+/g, " ").replace(/\s+/g, " ");

export function findCountry(q: string): Country | null {
  const n = norm(q);
  if (!n) return null;
  return (
    COUNTRIES.find((c) => c.code.toLowerCase() === n) ??
    COUNTRIES.find((c) => norm(c.en) === n || c.ja === q.trim() || (c.aliases ?? []).some((a) => norm(a) === n || a === q.trim())) ??
    null
  );
}

export const ZONE_LABEL: Record<Zone, { en: string; ja: string }> = {
  1: { en: "Zone 1: China, South Korea, Taiwan", ja: "第1地帯（中国・韓国・台湾）" },
  2: { en: "Zone 2: Asia (except China, South Korea, Taiwan)", ja: "第2地帯（アジア：中国・韓国・台湾を除く）" },
  3: { en: "Zone 3: Oceania, Canada, Mexico, Middle East, Europe", ja: "第3地帯（オセアニア・カナダ・メキシコ・中近東・ヨーロッパ）" },
  4: { en: "Zone 4: United States (incl. Guam and other territories)", ja: "第4地帯（米国（グアム等海外領土を含む））" },
  5: { en: "Zone 5: Central & South America (except Mexico), Africa", ja: "第5地帯（中南米（メキシコを除く）・アフリカ）" },
};

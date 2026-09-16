// Demo data for the presentation. Prices, SKUs and variants are placeholders until the real shop feed is connected.
export const shopProducts = [
  { id: 'spaceloft', name: 'Aerogel-Vlies Spaceloft', category: 'Aerogel-Dämmstoffe', image: 'aerogel', sku: 'AG-1010', price: 1189 },
  { id: 'pureflex', name: 'Pureflex board', category: 'Aerogel-Dämmstoffe', image: 'aerogel', sku: 'AG-2040', price: 142.5 },
  { id: 'aerogel-putz', name: 'Aerogel-Dämmputz', category: 'Aerogel-Dämmstoffe', image: 'system', sku: 'AG-3100', price: 89.9 },
  { id: 'granulat', name: 'Granulate & Einblasdämmstoffe', category: 'Aerogel-Dämmstoffe', image: 'kern', sku: 'AG-4200', price: 64.0 },
  { id: 'vaq-vip-f', name: 'va-Q-vip F', category: 'Vakuumdämmung (VIP)', image: 'vakuum', sku: 'VIP-1020', price: 96.5 },
  { id: 'vaq-shield', name: 'va-Q-shield VIP C', category: 'Vakuumdämmung (VIP)', image: 'vakuum', sku: 'VIP-2030', price: 128.0 },
  { id: 'vakutherm', name: 'Vakutherm-Elemente', category: 'Vakuumdämmung (VIP)', image: 'vakuum', sku: 'VIP-3000', price: 212.0 },
  { id: 'calostat', name: 'CALOSTAT Pure', category: 'Calostat', image: 'aerogel', sku: 'CAL-1000', price: 158.0 },
  { id: 'fkd-max', name: 'Putzträgerplatte FKD-Max C2', category: 'Klassische Dämmstoffe', image: 'system', sku: 'KD-1002', price: 38.4 },
  { id: 'xps-300', name: 'Swisspor XPS 300 GE', category: 'Klassische Dämmstoffe', image: 'vakuum', sku: 'KD-2300', price: 27.9 },
  { id: 'wdvs-kleber', name: 'Grundierung, Kleber, Armierung', category: 'WDVS-Komponenten & Zubehör', image: 'system', sku: 'WD-1000', price: 46.0 },
  { id: 'manschette', name: 'Brandschutzmanschetten', category: 'Brandschutz', image: 'kern', sku: 'BS-3000', price: 54.0 },
  { id: 'bs-beschichtung', name: 'Brandschutzbeschichtungen', category: 'Brandschutz', image: 'system', sku: 'BS-1000', price: 118.0 },
];

export const shopDownloads = [
  { name: 'Datenblatt va-Q-vip F', meta: 'PDF · 240 KB' },
  { name: 'Datenblatt Aerogel-Vlies Spaceloft', meta: 'PDF · 310 KB' },
  { name: 'EPD Pureflex board', meta: 'PDF · 1.2 MB' },
  { name: 'Preisliste 2026', meta: 'PDF · 860 KB' },
  { name: 'Verarbeitungsrichtlinie Aerogel-Dämmputz', meta: 'PDF · 520 KB' },
];

export const popularSearches = ['Aerogel-Vlies', 'VIP', 'Calostat', 'Brandschutz', 'Fensterlaibung'];

export const recentlyViewed = ['vaq-vip-f', 'spaceloft', 'calostat'];

export const cartItems = [
  { productId: 'spaceloft', variant: '10 mm · Rolle 1.45 × 10 m', qty: 1 },
  { productId: 'vaq-vip-f', variant: '20 mm · 600 × 1000 mm', qty: 1 },
];

export const cartRecommendation = { productId: 'aerogel-putz', variant: 'Sack 30 l' };

export const formatChf = (value) =>
  `CHF ${new Intl.NumberFormat('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;

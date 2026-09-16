// focus: point in the image (fractions) that sits under the hotspot
// anchor: hotspot position on screen as [percent of hero, px offset]
// Slides 2-5 reuse existing copy from the wireframe and Figma until the client delivers final texts
export const heroSlides = [
  {
    id: 'aerogel',
    tab: 'Aerogel-Dämmstoffe',
    eyebrow: 'Aerogel · VIP · Hochleistungsdämmung',
    title: ['Maximale Dämmwirkung.', 'Minimale Aufbauhöhe.'],
    text: 'Das Kompetenzzentrum für Aerogel und Dämmstoffe in der Schweiz und Liechtenstein – mit Beratung, Datenblättern und Online-Shop.',
    image: 'window-reveal',
    focus: [0.4864, 0.5706],
    anchor: { x: [50, 44.5], y: [0, 325.5] },
    zoom: 127.84,
    primary: { label: 'Produkte entdecken', href: '#' },
    secondary: { label: 'Anwendungs-Finder', href: '#loesungsfinder' },
  },
  {
    id: 'vip',
    tab: 'Vakuumdämmung VIP',
    eyebrow: 'Vakuumdämmung · VIP',
    title: ['Höchste Dämmwirkung', 'bei minimaler Aufbauhöhe.'],
    text: 'Überall, wo es auf extrem hohe Kälte- oder Wärmedämmung ankommt, hat Vakutherm seine Einsatzmöglichkeiten.',
    image: 'vip-panels',
    focus: [0.62, 0.5],
    anchor: { x: [64, 0], y: [46, 0] },
    primary: { label: 'VIP-Produkte', href: '#' },
    secondary: { label: 'Was ist VIP?', href: '#' },
  },
  {
    id: 'spaceloft',
    tab: 'Spaceloft',
    eyebrow: 'Spaceloft · Aerogel-Anwendungen',
    title: ['Dünne Dämmlösungen,', 'wo wenig Platz zur Verfügung steht.'],
    text: 'Funktionsweise und Eigenschaften des Hochleistungsdämmstoffs.',
    image: 'aerogel-reveal',
    focus: [0.52, 0.45],
    anchor: { x: [57, 0], y: [34, 0] },
    primary: { label: 'Aerogel-Produkte', href: '#' },
    secondary: { label: 'Was ist Aerogel?', href: '#' },
  },
  {
    id: 'pureflex',
    tab: 'Pureflex',
    eyebrow: 'Pureflex board · News 14.04.2026',
    title: ['EPD für', 'Pureflex board'],
    text: 'Alle technischen Unterlagen zentral an einem Ort – als PDF zum Download.',
    image: 'wdvs-board',
    focus: [0.55, 0.42],
    anchor: { x: [62, 0], y: [40, 0] },
    primary: { label: 'Zu den Downloads', href: '#' },
    secondary: { label: 'Alle News', href: '#' },
  },
  {
    id: 'shop',
    tab: 'Online-Shop',
    eyebrow: 'Online-Shop · Offertanfrage',
    title: ['Online-Shop &', 'Offertanfrage'],
    text: 'Unsere Anwendungstechnik unterstützt Sie bei der Wahl der passenden Lösung.',
    image: 'plaster-mesh',
    focus: [0.6, 0.38],
    anchor: { x: [66, 0], y: [30, 0] },
    primary: { label: 'Zum Online-Shop', href: '#' },
    secondary: { label: 'Offerte anfragen', href: '#' },
  },
];

export const usps = [
  { icon: 'layers', label: 'Aerogel-Kompetenzzentrum CH & FL' },
  { icon: 'building', label: 'Teil der AGI-Gruppe – seit 1877' },
  { icon: 'bag', label: 'Online-Shop & Offertanfrage' },
];

export const finder = {
  eyebrow: 'Lösungsfinder',
  title: 'Welche Dämmung passt zu Ihrem Projekt?',
  text: 'Starten Sie bei Ihrer Anwendung oder direkt bei der Produktgruppe – beide Wege führen zu Datenblättern, Referenzen und dem Shop.',
  tabs: [
    { id: 'applications', label: 'Nach Anwendung' },
    { id: 'products', label: 'Nach Produktgruppe' },
  ],
  applications: [
    { title: 'Aerogel-Anwendungen', text: 'Dünne Dämmlösungen, wo wenig Platz zur Verfügung steht.', image: 'aerogel', href: '#' },
    { title: 'Systemlösungen', text: 'Aufeinander abgestimmte Komponenten für den ganzen Aufbau.', image: 'system', href: '#' },
    { title: 'Vakuumlösungen', text: 'Höchste Dämmwirkung bei minimaler Aufbauhöhe.', image: 'vakuum', href: '#' },
    { title: 'Kerndämmungen', text: 'Dämmung für zweischaliges\nMauerwerk.', image: 'kern', href: '#' },
  ],
  cta: 'Lösungen ansehen',
  productsCta: 'Produkte ansehen',
};

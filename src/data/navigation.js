export const contact = {
  phone: '+41 44 316 63 73',
  phoneHref: 'tel:+41443166373',
  email: 'info@agitec.ch',
  company: 'AGITEC AG',
  street: 'Langwiesenstrasse 6',
  city: '8108 Dällikon',
};

export const topbarLinks = [
  { label: 'Downloads & Datenblätter', href: '#' },
  { label: 'Kontakt', href: '#' },
];

export const languages = [
  { code: 'DE', label: 'Deutsch', href: '#', current: true },
  { code: 'FR', label: 'Français', href: '#' },
];

export const groupBrands = [
  { name: 'AGI AG für Isolierungen', domain: 'agi.swiss', note: 'Technische Dämmung & Brandschutz', href: '#', external: true },
  { name: 'AGITEC AG', domain: 'agitec.ch', note: 'Aerogel & Hochleistungsdämmung', href: '#', current: true },
  { name: 'AGITEC GmbH', domain: 'agitec-aerogel.de', note: 'Deutschland & Europa', href: '#', external: true },
  { name: 'Werner Isolierwerk AG Visp', domain: 'Website', href: '#', external: true },
];

export const mainNav = [
  { id: 'products', label: 'Produkte', href: '#' },
  { id: 'applications', label: 'Anwendungen', href: '#' },
  { id: 'technology', label: 'Technologie', href: '#' },
  { id: 'references', label: 'Referenzen', href: '#' },
  { id: 'company', label: 'Unternehmen', href: '#' },
];

export const products = {
  title: 'Produkte',
  meta: '6 Produktgruppen',
  allLabel: 'Alle Produkte ansehen',
  groups: [
    {
      title: 'Aerogel-Dämmstoffe',
      count: 4,
      links: ['Aerogel-Vlies', 'Aerogel-Dämmplatten', 'Granulate & Einblasdämmstoffe', 'Aerogel-Dämmputz'],
    },
    {
      title: 'Vakuumdämmung (VIP)',
      count: 16,
      links: ['va-Q-vip F', 'va-Q-shield VIP C', 'Vakutherm-Elemente', 'Zubehör & Schutzmaterial'],
      more: 'Alle 16 ansehen',
    },
    {
      title: 'Klassische Dämmstoffe',
      count: 2,
      links: ['Putzträgerplatte FKD-Max C2', 'Swisspor XPS 300 GE'],
    },
    { title: 'Calostat', count: 1, links: ['CALOSTAT Pure'] },
    {
      title: 'WDVS-Komponenten & Zubehör',
      count: 3,
      links: ['Grundierung, Kleber, Armierung', 'Unter- und Oberputze, Anstriche', 'Befestigung'],
    },
    {
      title: 'Brandschutz',
      count: 9,
      links: ['Brandschutzbeschichtungen', 'Brandschutzmörtel', 'Brandschutzmanschetten'],
      more: 'Alle 9 ansehen',
    },
  ],
  footer: [
    { label: 'Alle Datenblätter & EPD', icon: 'download', href: '#' },
    { label: 'Preisliste 2026', icon: 'download', href: '#' },
    { label: 'Produkte im Shop', icon: 'cart', href: '#' },
  ],
  aside: {
    kicker: 'Unsicher?',
    title: 'Welches Produkt passt zu meiner Anwendung?',
    text: 'In wenigen Schritten zur passenden Dämmlösung – mit Datenblättern und Referenzen.',
    primary: 'Anwendungs-Finder starten',
    secondary: 'Zum Online-Shop',
    link: 'Offerte anfragen',
  },
};

export const applications = {
  finder: {
    id: 'finder',
    title: 'Anwendungs-Finder',
    sub: 'Produkt nach Anwendung finden',
    text: 'Bauteil wählen, Anforderung angeben, passende Produkte mit Datenblatt erhalten.',
    steps: ['Bauteil', 'Anforderung', 'Produkte'],
    cta: 'Finder starten',
  },
  items: [
    {
      id: 'aerogel',
      title: 'Aerogel-Anwendungen',
      sub: '10 Anwendungen',
      links: [
        'Innenwärmedämmung',
        'Hinterlüftete Fassade',
        'Terrasse',
        'Steildach',
        'Dachausstieg',
        'Fensterlaibung',
        'Rollladenkasten',
        'Schwimmender Estrich',
        'Lüftungskanal',
        'Hochtemperaturbereich',
      ],
    },
    {
      id: 'system',
      title: 'Systemlösungen',
      sub: 'Sanierung, Altbau, Baudenkmal',
      quote: 'Ob Altbau oder Baudenkmal – jedes Sanierungsobjekt ist ein Unikat und bedarf des behutsamen und sachkundigen Herangehens.',
      cta: 'Systemlösungen ansehen',
      image: 'system',
    },
    {
      id: 'vakuum',
      title: 'Vakuumlösungen',
      sub: 'Extrem hohe Dämmwirkung',
      quote: 'Überall, wo es auf extrem hohe Kälte- oder Wärmedämmung ankommt, hat Vakutherm seine Einsatzmöglichkeiten.',
      cta: 'Vakuumlösungen ansehen',
      image: 'vakuum',
    },
    {
      id: 'kern',
      title: 'Kerndämmungen',
      sub: 'Hohlraumdämmung',
      quote: 'Behagliches Wohnen dank innovativer Hohlraumdämmung.',
      cta: 'Kerndämmungen ansehen',
      image: 'kern',
    },
  ],
  allLabel: 'Alle Anwendungen',
  aside: {
    kicker: 'Persönliche Beratung',
    title: 'Welches System passt zu Ihrem Objekt?',
    text: 'Unsere Anwendungstechnik unterstützt Sie bei der Wahl der passenden Lösung.',
    primary: 'Beratung anfragen',
    link: 'Referenzen nach Anwendung',
  },
};

export const technology = {
  title: 'Technologie',
  meta: 'Wissen & Forschung',
  cards: [
    {
      title: 'Aerogel',
      text: 'Funktionsweise und Eigenschaften des Hochleistungsdämmstoffs.',
      image: 'aerogel',
      links: ['Was ist Aerogel?', 'Eigenschaften', 'Aerogel-Produkte'],
    },
    {
      title: 'VIP – Vakuumdämmung',
      text: 'Aufbau und Einsatz von Vakuumisolationspaneelen.',
      image: 'vakuum',
      links: ['Was ist VIP?', 'Vakuumlösungen', 'VIP-Produkte'],
    },
    {
      title: 'Forschung & Entwicklung',
      text: 'Projekte und Partner von AGITEC.',
      icon: 'beaker',
      links: ['Projekte', 'Partner'],
    },
  ],
  aside: {
    kicker: 'Technische Unterlagen',
    title: 'Datenblätter & EPD',
    text: 'Alle technischen Unterlagen zentral an einem Ort – als PDF zum Download.',
    primary: 'Zu den Downloads',
    secondary: 'Fachfrage stellen',
  },
};

export const company = {
  columns: [
    {
      title: 'AGITEC AG',
      links: [
        { label: 'Über uns', href: '#' },
        { label: 'News', href: '#' },
        { label: 'Kontakt & Anfahrt', href: '#' },
      ],
    },
    {
      title: 'AGI-Gruppe',
      links: [
        { label: 'Die Gruppe', href: '#' },
        { label: 'AGI AG für Isolierungen', href: '#', external: true },
        { label: 'AGITEC GmbH (DE)', href: '#', external: true },
        { label: 'Werner Isolierwerk AG Visp', href: '#', external: true },
      ],
    },
  ],
  news: {
    title: 'Top-News',
    items: [
      { date: '14.04.2026', iso: '2026-04-14', title: 'EPD für Pureflex board', href: '#' },
      { date: '06.03.2026', iso: '2026-03-06', title: 'Neue Preisliste 2026', href: '#' },
      { date: '26.01.2026', iso: '2026-01-26', title: 'Lancierung AGITHERM', href: '#' },
    ],
    allLabel: 'Alle News',
  },
  aside: {
    kicker: 'Kontakt',
    primary: 'Kontakt aufnehmen',
    secondary: 'Anfahrt',
  },
};

export const mobileNav = [
  {
    id: 'products',
    label: 'Produkte',
    overview: 'Alle Produkte',
    links: ['Aerogel-Dämmstoffe', 'Vakuumdämmung (VIP)', 'Klassische Dämmstoffe', 'Calostat', 'WDVS-Komponenten & Zubehör', 'Brandschutz'],
    highlight: 'Welches Produkt passt? Finder starten',
  },
  {
    id: 'applications',
    label: 'Anwendungen',
    overview: 'Alle Anwendungen',
    links: ['Aerogel-Anwendungen', 'Systemlösungen', 'Vakuumlösungen', 'Kerndämmungen'],
    highlight: 'Beratung anfragen',
  },
  {
    id: 'technology',
    label: 'Technologie',
    links: ['Aerogel', 'VIP – Vakuumdämmung', 'Forschung & Entwicklung'],
    highlight: 'Datenblätter & EPD',
  },
  { id: 'references', label: 'Referenzen', href: '#' },
  {
    id: 'company',
    label: 'Unternehmen',
    links: ['Über uns', 'News', 'AGI-Gruppe', 'Kontakt & Anfahrt'],
  },
];

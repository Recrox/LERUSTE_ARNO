// Boulot et entraînement : données de démo. Portefeuille et projets : données réelles (voir plus bas).
export const today = new Date(2026, 10, 19);

export const week = [
  { day: 'Lun', date: 16, events: ['muscu'] },
  { day: 'Mar', date: 17, events: ['course'] },
  { day: 'Mer', date: 18, events: ['muscu'] },
  { day: 'Jeu', date: 19, events: ['muscu', 'bourse'] },
  { day: 'Ven', date: 20, events: [] },
  { day: 'Sam', date: 21, events: ['course'] },
  { day: 'Dim', date: 22, events: [] },
];

export const work = {
  sprint: 'Sprint 47',
  done: 18,
  total: 26,
  reviews: 3,
  team: [
    { name: 'Arno', role: 'Dev web', initials: 'AL', online: true },
    { name: 'Sarah', role: 'Lead dev', initials: 'SM', online: true },
    { name: 'Karim', role: 'Back-end', initials: 'KB', online: false },
    { name: 'Julie', role: 'Product', initials: 'JD', online: true },
  ],
};

// Volume soulevé par séance (kg) et km courus sur les 7 derniers jours.
export const training = {
  lifts: [
    { label: 'Lun', kg: 8200 }, { label: 'Mer', kg: 9100 }, { label: 'Jeu', kg: 9650 },
  ],
  runs: [
    { label: 'Mar', km: 6.2 }, { label: 'Sam', km: 10.4 },
  ],
  prs: [
    { lift: 'Développé couché', value: '100 kg', delta: '+2,5' },
    { lift: 'Squat', value: '140 kg', delta: '+5' },
    { lift: 'Soulevé de terre', value: '170 kg', delta: '=' },
  ],
  goal: { label: '10 km sous 50 min', best: '52:40', progress: 0.72 },
};

// Relevé réel Revolut Invest (compte de courtage), recopié depuis l'appli.
// shortcut: instantané figé, Revolut n'a pas d'API publique pour Invest ; mettre à jour à la main ou depuis l'export CSV.
export const portfolio = {
  asOf: '19 novembre 2026 à 21:31',
  value: 21763.84,
  cash: 0.68,
  pnl: -18408.88,
  pnlPct: -45.82,
  holdings: [
    { ticker: 'VUAA', name: 'Vanguard S&P 500 Acc', type: 'ETF', qty: 90.69444788, avg: 101.63, price: 126.77, currency: 'EUR', value: 11497.33, pnl: 2280.06, pnlPct: 24.74, day: 0, share: 52.84 },
    { ticker: 'QBTS', name: 'D-Wave Systems', type: 'Action', qty: 967.73735177, avg: 23.18, price: 7.3, currency: 'USD', value: 6429.44, pnl: -13986.24, pnlPct: -68.51, day: -5.07, share: 29.54 },
    { ticker: 'QUBT', name: 'Quantum Computing Inc', type: 'Action', qty: 851.76727069, avg: 13.56, price: 4.9, currency: 'USD', value: 3798.47, pnl: -6713.24, pnlPct: -63.86, day: -3.92, share: 17.45 },
    { ticker: 'AMZN', name: 'Amazon', type: 'Action', qty: 0.12678807, avg: 174.07, price: 256.96, currency: 'USD', value: 29.64, pnl: 9.56, pnlPct: 47.62, day: -4.03, share: 0.14 },
    { ticker: 'NVDA', name: 'NVIDIA', type: 'Action', qty: 0.06188271, avg: 129.6, price: 147.04, currency: 'USD', value: 8.27, pnl: 0.98, pnlPct: 13.46, day: -2.6, share: 0.04 },
  ],
};

// Projets réels de C:\Users\recro\source\repos, relevés le 19/11/2026 (git log).
// shortcut: liste figée au build ; à régénérer à la main quand un projet bouge.
export const projects = [
  { name: 'LERUSTE_ARNO', desc: 'Ce tableau de bord perso', category: 'Web', stack: ['React', 'Vite', 'Cloudflare'], last: '2026-11-19', commits30: 2, commits: 2, url: 'https://arno-dashboard.recrox.workers.dev' },
  { name: 'DOFUS_RETRO_MANAGER', desc: 'Lit ta banque Dofus Retro via le trafic réseau et liste les recettes fabricables', category: 'Dofus', stack: ['.NET', 'Cloudflare'], last: '2026-11-17', commits30: 180, commits: 180 },
  { name: 'OLIVIA', desc: 'Site et application du restaurant Olivia, Grand-Place de Tournai', category: 'Web', stack: ['Node', 'PWA', 'Cloudflare'], last: '2026-11-17', commits30: 9, commits: 9, url: 'https://olivia-tournai.recrox.workers.dev' },
  { name: 'ANKABOT', desc: 'Installateur Windows d’AnkaBot', category: 'Dofus', stack: ['Windows'], last: '2026-11-16', commits30: 1, commits: 1 },
  { name: 'TESTDOFUS', desc: 'Prototype Dofus Retro : cartes, objets, monstres et consommables', category: 'Dofus', stack: ['Angular'], last: '2026-10-31', commits30: 7, commits: 7 },
  { name: 'Dofus Retro OCR', desc: 'Lecture de l’écran Dofus Retro par OCR', category: 'Dofus', stack: ['.NET', 'PaddleOCR'], last: '2026-06-16', commits30: 0, commits: 6 },
  { name: 'PERCO_TRACKER_FRONTEND', desc: 'Suivi des percepteurs sur toutes les cartes de Dofus Retro', category: 'Dofus', stack: ['Angular', 'Tailwind'], last: '2026-02-27', commits30: 0, commits: 5 },
  { name: 'CREAPRINT_FRONTEND', desc: 'Boutique d’objets créatifs et d’impression 3D', category: 'Web', stack: ['Angular', 'NSwag'], last: '2025-11-01', commits30: 0, commits: 73 },
  { name: 'CREAPRINT_BACKEND', desc: 'API de la boutique CreaPrint', category: 'Web', stack: ['.NET', 'Docker'], last: '2025-11-01', commits30: 0, commits: 59 },
  { name: 'ROUE_DE_LA_FORTUNE', desc: 'Roue de la fortune', category: 'Web', stack: ['Angular'], last: null, commits30: 0, commits: 0 },
  { name: 'DOFUS_RETRO', desc: 'Notes de documentation Dofus Retro', category: 'Dofus', stack: ['Notes'], last: null, commits30: 0, commits: 0 },
  { name: 'Test taille string', desc: 'Test console sur la taille des chaînes JSON', category: 'Outils', stack: ['.NET'], last: null, commits30: 0, commits: 0 },
];

// Commits par jour, tous projets confondus (git log, 20/10 → 19/11/2026). Jours absents = 0.
export const commitsByDay = {
  '2026-10-31': 18, '2026-11-01': 46, '2026-11-02': 5, '2026-11-03': 14, '2026-11-04': 10,
  '2026-11-05': 3, '2026-11-06': 4, '2026-11-07': 20, '2026-11-08': 13, '2026-11-09': 1,
  '2026-11-10': 1, '2026-11-11': 10, '2026-11-12': 7, '2026-11-14': 20, '2026-11-15': 8,
  '2026-11-16': 1, '2026-11-17': 16, '2026-11-19': 2,
};

export const activity = [
  { kind: 'work', title: 'PR #312 mergée sur le portail client BizzDev', time: 'il y a 25 min' },
  { kind: 'money', title: 'D-Wave Systems recule de 5,07 % sur la journée', time: 'aujourd’hui' },
  { kind: 'sport', title: 'Séance pecs/dos terminée : 9 650 kg', time: 'il y a 2 h' },
  { kind: 'money', title: 'Quantum Computing Inc recule de 3,92 % sur la journée', time: 'aujourd’hui' },
  { kind: 'work', title: 'Review demandée par Sarah sur le module de facturation', time: 'hier' },
  { kind: 'sport', title: 'Sortie course : 10,4 km en 54:12', time: 'samedi' },
];

// Données de démo : à brancher plus tard sur de vraies sources (Revolut, Strava, Jira...).
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

export const portfolio = {
  value: 14820.35,
  change: 3.8,
  history: [12.1, 12.4, 12.2, 12.9, 13.3, 13.1, 13.8, 14.0, 13.7, 14.3, 14.6, 14.82],
  holdings: [
    { ticker: 'VUAA', name: 'S&P 500 ETF', value: 7420.1, change: 1.2 },
    { ticker: 'NVDA', name: 'Nvidia', value: 2980.55, change: 6.4 },
    { ticker: 'ASML', name: 'ASML Holding', value: 2115.7, change: -2.1 },
    { ticker: 'MSFT', name: 'Microsoft', value: 2304.0, change: 0.8 },
  ],
};

export const activity = [
  { kind: 'work', title: 'PR #312 mergée sur le portail client BizzDev', time: 'il y a 25 min' },
  { kind: 'sport', title: 'Séance pecs/dos terminée : 9 650 kg', time: 'il y a 2 h' },
  { kind: 'money', title: 'Achat programmé : 150 € de VUAA', time: 'il y a 3 h' },
  { kind: 'work', title: 'Review demandée par Sarah sur le module de facturation', time: 'hier' },
  { kind: 'sport', title: 'Sortie course : 10,4 km en 54:12', time: 'samedi' },
  { kind: 'money', title: 'Dividende Microsoft reçu : 4,12 €', time: 'vendredi' },
];

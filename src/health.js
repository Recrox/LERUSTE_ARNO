// Santé : sommeil, alimentation, corps, forme du jour. Fonctions pures, testées par scripts/check.mjs.
// Repères grand public (OMS, ANSES, AASM) : ce n'est pas un avis médical.

// Valeurs pour 100 g (ou 100 ml) : kcal, protéines, glucides, lipides.
const f = (name, kcal, p, c, fat, unit = 100, unitLabel = '100 g') => ({ name, kcal, p, c, fat, unit, unitLabel });
export const foods = [
  f('Blanc de poulet cuit', 165, 31, 0, 3.6), f('Bœuf haché 5 %', 137, 21, 0, 5), f('Saumon', 208, 20, 0, 13), f('Thon au naturel', 116, 26, 0, 1),
  f('Jambon blanc', 115, 20, 1, 3.5), f('Œuf entier', 143, 12.6, 0.7, 9.5, 60, '1 œuf'), f('Blanc d’œuf', 52, 11, 0.7, 0.2), f('Tofu ferme', 76, 8, 1.9, 4.8),
  f('Skyr nature', 63, 11, 4, 0.2), f('Fromage blanc 0 %', 47, 7.5, 4, 0.2), f('Yaourt grec', 97, 9, 3.6, 5), f('Lait demi-écrémé', 46, 3.3, 4.8, 1.6, 250, '1 verre'),
  f('Whey', 380, 78, 6, 5, 30, '1 dose'), f('Mozzarella', 280, 28, 3, 17), f('Emmental', 380, 28, 0, 30),
  f('Riz cuit', 130, 2.7, 28, 0.3), f('Pâtes cuites', 157, 5.8, 31, 0.9), f('Flocons d’avoine', 372, 13.5, 58.7, 7), f('Pain complet', 247, 13, 41, 3.4, 35, '1 tranche'),
  f('Pomme de terre cuite', 87, 1.9, 20, 0.1), f('Patate douce cuite', 90, 2, 21, 0.1), f('Quinoa cuit', 120, 4.4, 21, 1.9), f('Lentilles cuites', 116, 9, 20, 0.4),
  f('Pois chiches cuits', 164, 8.9, 27, 2.6), f('Banane', 89, 1.1, 23, 0.3, 120, '1 banane'), f('Pomme', 52, 0.3, 14, 0.2, 150, '1 pomme'), f('Myrtilles', 57, 0.7, 14, 0.3),
  f('Brocoli', 34, 2.8, 7, 0.4), f('Épinards', 23, 2.9, 3.6, 0.4), f('Avocat', 160, 2, 9, 15), f('Amandes', 579, 21, 22, 50, 30, '1 poignée'),
  f('Beurre de cacahuète', 588, 25, 20, 50, 15, '1 c. à soupe'), f('Huile d’olive', 884, 0, 0, 100, 10, '1 c. à soupe'), f('Chocolat noir 70 %', 598, 7.8, 46, 43, 20, '2 carrés'),
  f('Frites', 312, 3.4, 41, 15), f('Pizza margherita', 266, 11, 33, 10), f('Bière blonde 5 %', 43, 0.5, 3.6, 0, 250, '1 verre 25 cl'),
];

export const totals = (items) => items.reduce((t, { food, qty }) => {
  const x = foods.find((y) => y.name === food);
  if (!x) return t;
  const k = qty / 100;
  return { kcal: t.kcal + x.kcal * k, p: t.p + x.p * k, c: t.c + x.c * k, fat: t.fat + x.fat * k };
}, { kcal: 0, p: 0, c: 0, fat: 0 });

// ---- Sommeil ----
const toMin = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + m; };
// Durée en minutes, coucher avant ou après minuit.
export const sleepMinutes = (bed, wake) => { const d = toMin(wake) - toMin(bed); return d <= 0 ? d + 1440 : d; };
// Heure de coucher en minutes autour de minuit (23:30 → -30, 01:00 → 60), pour mesurer la régularité.
const bedOffset = (bed) => { const m = toMin(bed); return m > 720 ? m - 1440 : m; };
export const hhmm = (min) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
export const duration = (min) => `${Math.floor(min / 60)} h ${String(Math.round(min % 60)).padStart(2, '0')}`;

export function sleepStats(entries, targetH = 8) {
  const last = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-7);
  if (!last.length) return null;
  const mins = last.map((e) => sleepMinutes(e.bed, e.wake));
  const avg = mins.reduce((a, b) => a + b, 0) / mins.length;
  const debt = mins.reduce((s, m) => s + Math.max(0, targetH * 60 - m), 0);
  const offs = last.map((e) => bedOffset(e.bed));
  const mean = offs.reduce((a, b) => a + b, 0) / offs.length;
  const spread = Math.sqrt(offs.reduce((s, o) => s + (o - mean) ** 2, 0) / offs.length);
  const quality = last.reduce((s, e) => s + Number(e.quality), 0) / last.length;
  return { nights: last.length, avg, debt, spread, quality, meanBed: mean };
}

// Heures de coucher conseillées pour se réveiller en fin de cycle (90 min) après 15 min d'endormissement.
export const bedtimes = (wake) => [6, 5, 4].map((cycles) => ({ cycles, at: hhmm(toMin(wake) - cycles * 90 - 15), sleep: cycles * 90 }));

// ---- Corps ----
export const bmi = (kg, cm) => kg / (cm / 100) ** 2;
export const bmiLabel = (b) => (b < 18.5 ? 'Maigreur' : b < 25 ? 'Corpulence normale' : b < 30 ? 'Surpoids' : 'Obésité');
export const waterTarget = (kg) => Math.round(kg * 35); // ml par jour, hors sport
// Moyenne glissante sur n mesures : lisse les variations d'eau d'un jour à l'autre.
export const rolling = (values, n = 7) => values.map((_, i) => { const w = values.slice(Math.max(0, i - n + 1), i + 1); return w.reduce((a, b) => a + b, 0) / w.length; });

// ---- Forme du jour (sur 100) : sommeil, énergie, stress, courbatures ----
export function readiness({ sleepH, energy, stress, soreness }) {
  const s = Math.min(1, Math.max(0, (sleepH - 5) / 3)); // 5 h → 0, 8 h → 1
  const score = Math.round(100 * (0.35 * s + 0.25 * ((energy - 1) / 4) + 0.2 * ((5 - stress) / 4) + 0.2 * ((5 - soreness) / 4)));
  const advice = score >= 75 ? 'Feu vert : séance lourde ou record possible'
    : score >= 50 ? 'Séance normale, sans aller à l’échec'
      : score >= 30 ? 'Séance légère : technique, mobilité ou footing en aisance'
        : 'Repos ou marche : la récupération est l’entraînement du jour';
  return { score, advice };
}

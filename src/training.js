// Programmes, schémas de mouvement et guide d'entraînement.

// ---- Schéma de mouvement de chaque exercice (sert au pictogramme animé) ----
const patternGroups = {
  bench: ['Développé couché', 'Développé incliné haltères', 'Écarté à la poulie vis-à-vis', 'Barre au front'],
  pushup: ['Pompes déficit', 'Bear crawl'],
  dip: ['Dips lestés'],
  press: ['Landmine press', 'Développé militaire', 'Z-press', 'Arnold press', 'Thruster', 'Clean and press'],
  raise: ['Élévations latérales', 'Dislocations à l’élastique', 'Battle ropes'],
  pull: ['Tractions lestées', 'Tirage poitrine prise serrée', 'Muscle-up', 'Suspension passive'],
  row: ['Rowing Pendlay', 'Meadows row', 'Face pull', 'Rameur 500 m'],
  hinge: ['Soulevé de terre', 'Soulevé de terre roumain', 'Good morning', 'Kettlebell swing', 'Jefferson curl'],
  squat: ['Squat barre haute', 'Front squat', 'Zercher squat', 'Presse à cuisses', 'Sissy squat', 'Abduction à l’élastique', 'Cossack squat'],
  lunge: ['Squat bulgare', 'Pistol squat'],
  bridge: ['Hip thrust'],
  curl: ['Curl incliné', 'Curl marteau', 'Extension triceps poulie haute'],
  core: ['Dragon flag', 'L-sit', 'Hollow body hold', 'Ab wheel', 'Copenhagen plank', 'Turkish get-up'],
  carry: ['Farmer walk', 'Pallof press'],
  calf: ['Mollets debout'],
  jump: ['Burpees', 'Box jump'],
  kneel: ['Nordic curl', 'Couch stretch'],
};
export const patternOf = Object.fromEntries(Object.entries(patternGroups).flatMap(([p, names]) => names.map((n) => [n, p])));

// ---- Programmes : une semaine type, chaque jour est une suite d'exercices dans l'ordre ----
// intensity : % du 1RM ou RPE ; tempo : excentrique-pause basse-concentrique-pause haute (X = explosif).
const it = (name, sets, reps, rest, tempo, intensity) => ({ name, sets, reps, rest, tempo, intensity });

export const splits = [
  {
    id: 'ppl', name: 'Push Pull Legs', freq: '3 ou 6 jours', level: 'Intermédiaire',
    pitch: 'Chaque séance travaille un type de mouvement : pousser, tirer, jambes. En 6 jours, chaque muscle est touché deux fois par semaine.',
    week: 'Push · Pull · Legs · repos · Push · Pull · Legs',
    days: [
      { name: 'Push', items: [
        it('Développé couché', 4, '6-8', 150, '3-1-1-0', '75-80 % 1RM'), it('Développé incliné haltères', 3, '8-10', 120, '3-0-1-0', 'RPE 8'),
        it('Développé militaire', 3, '6-8', 120, '2-0-1-0', '72-77 % 1RM'), it('Élévations latérales', 4, '12-20', 45, '2-0-1-1', 'RPE 9'),
        it('Barre au front', 3, '8-10', 90, '3-0-1-0', 'RPE 8'), it('Extension triceps poulie haute', 3, '12-15', 60, '2-0-1-1', 'RPE 9') ] },
      { name: 'Pull', items: [
        it('Soulevé de terre', 3, '5', 180, '2-0-X-0', '80 % 1RM'), it('Tractions lestées', 4, '6-8', 150, '3-0-1-1', 'RPE 8'),
        it('Rowing Pendlay', 3, '8', 120, '2-0-X-1', 'RPE 8'), it('Face pull', 3, '15-20', 60, '2-0-1-2', 'RPE 8'),
        it('Curl incliné', 3, '10-12', 60, '3-0-1-0', 'RPE 9'), it('Curl marteau', 3, '12', 60, '2-0-1-0', 'RPE 9') ] },
      { name: 'Legs', items: [
        it('Squat barre haute', 4, '6-8', 180, '3-1-1-0', '75 % 1RM'), it('Soulevé de terre roumain', 3, '8', 120, '3-0-1-0', 'RPE 8'),
        it('Squat bulgare', 3, '10 par jambe', 90, '2-0-1-0', 'RPE 8'), it('Nordic curl', 3, '5', 120, '5-0-X-0', 'Max contrôlé'),
        it('Mollets debout', 4, '12-15', 60, '2-2-1-1', 'RPE 9'), it('Ab wheel', 3, '10', 60, '3-0-2-0', 'RPE 8') ] },
    ],
  },
  {
    id: 'ul', name: 'Haut / Bas', freq: '4 jours', level: 'Intermédiaire',
    pitch: 'Deux séances lourdes et deux séances de volume. Très bon compromis entre récupération et progression.',
    week: 'Haut force · Bas force · repos · Haut volume · Bas volume · repos · repos',
    days: [
      { name: 'Haut force', items: [
        it('Développé couché', 5, '3-5', 180, '2-1-X-0', '85 % 1RM'), it('Tractions lestées', 5, '3-5', 180, '2-0-X-1', '85 % 1RM'),
        it('Développé militaire', 3, '5', 150, '2-0-1-0', '80 % 1RM'), it('Rowing Pendlay', 3, '6', 120, '2-0-X-1', 'RPE 8') ] },
      { name: 'Bas force', items: [
        it('Squat barre haute', 5, '3-5', 210, '2-1-X-0', '85 % 1RM'), it('Soulevé de terre', 3, '3', 210, '1-0-X-0', '85 % 1RM'),
        it('Hip thrust', 3, '6-8', 120, '2-1-1-1', 'RPE 8'), it('Dragon flag', 3, '5', 90, '4-0-1-0', 'Max contrôlé') ] },
      { name: 'Haut volume', items: [
        it('Développé incliné haltères', 4, '8-12', 90, '3-0-1-0', '70 % 1RM'), it('Tirage poitrine prise serrée', 4, '10-12', 90, '3-0-1-1', 'RPE 8'),
        it('Arnold press', 3, '10', 90, '2-0-1-0', 'RPE 8'), it('Face pull', 3, '15-20', 60, '2-0-1-2', 'RPE 8'),
        it('Curl incliné', 3, '12', 60, '3-0-1-0', 'RPE 9'), it('Extension triceps poulie haute', 3, '12-15', 60, '2-0-1-1', 'RPE 9') ] },
      { name: 'Bas volume', items: [
        it('Front squat', 4, '8', 150, '3-0-1-0', '70 % 1RM'), it('Soulevé de terre roumain', 4, '10', 120, '3-0-1-0', 'RPE 8'),
        it('Squat bulgare', 3, '12 par jambe', 90, '2-0-1-0', 'RPE 8'), it('Mollets debout', 4, '15', 60, '2-2-1-1', 'RPE 9'),
        it('Copenhagen plank', 3, '20 s par côté', 45, 'Isométrique', '—') ] },
    ],
  },
  {
    id: 'fb', name: 'Full body', freq: '3 jours', level: 'Débutant',
    pitch: 'Tout le corps à chaque séance, deux séances A et B en alternance. Idéal pour apprendre les mouvements et progresser vite.',
    week: 'A · repos · B · repos · A · repos · repos, puis B · A · B la semaine suivante',
    days: [
      { name: 'Séance A', items: [
        it('Squat barre haute', 3, '8', 150, '3-0-1-0', '70 % 1RM'), it('Développé couché', 3, '8', 120, '3-0-1-0', '70 % 1RM'),
        it('Rowing Pendlay', 3, '8', 120, '2-0-1-1', 'RPE 7'), it('Hollow body hold', 3, '30 s', 45, 'Isométrique', '—') ] },
      { name: 'Séance B', items: [
        it('Soulevé de terre roumain', 3, '8', 150, '3-0-1-0', 'RPE 7'), it('Développé militaire', 3, '8', 120, '2-0-1-0', '70 % 1RM'),
        it('Tirage poitrine prise serrée', 3, '10', 90, '3-0-1-1', 'RPE 7'), it('Squat bulgare', 2, '10 par jambe', 90, '2-0-1-0', 'RPE 7'),
        it('Farmer walk', 3, '40 m', 90, '—', 'Lourd') ] },
    ],
  },
  {
    id: '5x5', name: 'Force 5 × 5', freq: '3 jours', level: 'Débutant à intermédiaire',
    pitch: 'Peu d’exercices, des barres lourdes, +2,5 kg dès que les 5 × 5 passent. La méthode la plus simple pour gagner en force.',
    week: 'A · repos · B · repos · A · repos · repos',
    days: [
      { name: 'Séance A', items: [
        it('Squat barre haute', 5, '5', 180, '2-1-X-0', '80 % 1RM'), it('Développé couché', 5, '5', 180, '2-1-X-0', '80 % 1RM'),
        it('Rowing Pendlay', 5, '5', 150, '2-0-X-1', '80 % 1RM') ] },
      { name: 'Séance B', items: [
        it('Squat barre haute', 5, '5', 180, '2-1-X-0', '80 % 1RM'), it('Développé militaire', 5, '5', 180, '2-0-X-0', '80 % 1RM'),
        it('Soulevé de terre', 1, '5', 240, '1-0-X-0', '85 % 1RM') ] },
    ],
  },
  {
    id: 'hybrid', name: 'Hybride muscu + course', freq: '4 jours', level: 'Intermédiaire',
    pitch: 'Pour garder ta force tout en visant le 10 km sous 50 min. Les séances de course sont dans l’onglet Course.',
    week: 'Full body force · fractionné · repos · Full body athlète · tempo · repos · sortie longue',
    days: [
      { name: 'Full body force', items: [
        it('Squat barre haute', 4, '5', 180, '2-1-X-0', '80 % 1RM'), it('Développé couché', 4, '5', 180, '2-1-X-0', '80 % 1RM'),
        it('Tractions lestées', 4, '5', 150, '2-0-X-1', 'RPE 8'), it('Nordic curl', 3, '4', 120, '5-0-X-0', 'Max contrôlé') ] },
      { name: 'Full body athlète', items: [
        it('Clean and press', 5, '3', 150, 'X', '70 % 1RM'), it('Front squat', 3, '6', 150, '2-0-X-0', '72 % 1RM'),
        it('Box jump', 4, '5', 90, 'X', 'Explosif'), it('Farmer walk', 4, '40 m', 90, '—', 'Lourd'),
        it('Copenhagen plank', 3, '20 s par côté', 45, 'Isométrique', '—') ] },
    ],
  },
];

// ---- Guide : repères classiques (NSCA, simplifiés) ----
export const goalsGuide = [
  { id: 'force', name: 'Force', reps: '1-5', pct: [85, 100], sets: '3-6', rest: '3 à 5 min', tempo: '2-1-X-0', note: 'Charges lourdes, peu de reps, récupération complète. Le système nerveux progresse avant le muscle.' },
  { id: 'hyper', name: 'Hypertrophie', reps: '6-12', pct: [67, 85], sets: '3-5', rest: '1 min 30 à 2 min 30', tempo: '3-0-1-0', note: 'Le volume compte : 10 à 20 séries par muscle et par semaine, proches de l’échec (1 à 3 reps en réserve).' },
  { id: 'endu', name: 'Endurance musculaire', reps: '12-20+', pct: [50, 67], sets: '2-4', rest: '30 à 90 s', tempo: '2-0-2-0', note: 'Charges légères, repos courts. Utile en fin de séance ou en circuit.' },
  { id: 'power', name: 'Puissance', reps: '1-5', pct: [30, 70], sets: '3-6', rest: '2 à 3 min', tempo: 'X, vitesse max', note: 'Chaque rep à vitesse maximale. On arrête la série dès que la vitesse chute.' },
];

// Répétitions maximales typiques à chaque % du 1RM.
export const repsAtPct = [[100, 1], [95, 2], [93, 3], [90, 4], [87, 5], [85, 6], [83, 7], [80, 8], [77, 9], [75, 10], [70, 12], [67, 15], [60, 20]];
export const rpeTable = [[10, 0, 'Échec : impossible d’en faire une de plus'], [9, 1, 'Encore 1 rep possible'], [8, 2, 'Encore 2 reps'], [7, 3, 'Encore 3 reps, vitesse correcte'], [6, 4, 'Échauffement lourd']];

// Temps sous tension d'une série : "3-1-1-0" × reps (X compte pour 1 s). NaN si le tempo est illisible.
export function tut(tempo, reps) {
  const parts = String(tempo).split('-').map((p) => (p.trim().toUpperCase() === 'X' ? 1 : Number(p)));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n) || n < 0)) return NaN;
  return parts.reduce((a, b) => a + b, 0) * reps;
}

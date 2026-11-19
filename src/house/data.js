// Plan d'une maison de plain-pied, en centimètres. x vers la droite, y vers le bas, origine au coin nord-ouest.
// Les murs sont décrits par leur axe ; les ouvertures par leur position le long du mur (depuis son point de départ).

export const H = 250; // hauteur sous plafond

export const rooms = [
  { id: 'sejour', name: 'Séjour', x: 0, y: 0, w: 500, h: 550 },
  { id: 'cuisine', name: 'Cuisine ouverte', x: 500, y: 0, w: 300, h: 350, wet: true },
  { id: 'entree', name: 'Entrée', x: 800, y: 0, w: 200, h: 350 },
  { id: 'wc', name: 'WC', x: 1000, y: 0, w: 200, h: 150, wet: true },
  { id: 'cellier', name: 'Cellier', x: 1000, y: 150, w: 200, h: 200, wet: true },
  { id: 'couloir', name: 'Couloir', x: 500, y: 350, w: 700, h: 200 },
  { id: 'ch1', name: 'Chambre parentale', x: 0, y: 550, w: 400, h: 350 },
  { id: 'ch2', name: 'Chambre 2', x: 400, y: 550, w: 350, h: 350 },
  { id: 'sdb', name: 'Salle de bain', x: 750, y: 550, w: 250, h: 350, wet: true },
  { id: 'bureau', name: 'Bureau', x: 1000, y: 550, w: 200, h: 350 },
];

// t = épaisseur ; ext = mur porteur extérieur.
export const walls = [
  { x1: 0, y1: 0, x2: 1200, y2: 0, t: 30, ext: true },
  { x1: 1200, y1: 0, x2: 1200, y2: 900, t: 30, ext: true },
  { x1: 0, y1: 900, x2: 1200, y2: 900, t: 30, ext: true },
  { x1: 0, y1: 0, x2: 0, y2: 900, t: 30, ext: true },
  { x1: 500, y1: 350, x2: 500, y2: 550, t: 10 }, // séjour | couloir
  { x1: 500, y1: 350, x2: 800, y2: 350, t: 10 }, // cuisine | couloir
  { x1: 800, y1: 0, x2: 800, y2: 350, t: 10 }, // cuisine | entrée
  { x1: 800, y1: 350, x2: 1200, y2: 350, t: 10 }, // entrée, cellier | couloir
  { x1: 1000, y1: 0, x2: 1000, y2: 350, t: 10 }, // entrée | wc, cellier
  { x1: 1000, y1: 150, x2: 1200, y2: 150, t: 10 }, // wc | cellier
  { x1: 0, y1: 550, x2: 1200, y2: 550, t: 10 }, // jour | nuit
  { x1: 400, y1: 550, x2: 400, y2: 900, t: 10 },
  { x1: 750, y1: 550, x2: 750, y2: 900, t: 10 },
  { x1: 1000, y1: 550, x2: 1000, y2: 900, t: 10 },
];

// kind : door (porte), entry (porte d'entrée), passage (baie libre), window (fenêtre), bay (baie vitrée).
export const openings = [
  { wall: 0, at: 120, w: 180, kind: 'window' }, // séjour
  { wall: 0, at: 590, w: 120, kind: 'window' }, // cuisine
  { wall: 0, at: 850, w: 100, kind: 'entry' },
  { wall: 0, at: 1080, w: 60, kind: 'window' }, // wc
  { wall: 1, at: 230, w: 60, kind: 'window' }, // cellier
  { wall: 1, at: 640, w: 120, kind: 'window' }, // bureau
  { wall: 2, at: 130, w: 140, kind: 'window' }, // ch1
  { wall: 2, at: 505, w: 140, kind: 'window' }, // ch2
  { wall: 2, at: 835, w: 80, kind: 'window' }, // sdb
  { wall: 3, at: 160, w: 240, kind: 'bay' }, // baie vitrée séjour
  { wall: 3, at: 660, w: 120, kind: 'window' }, // ch1
  { wall: 4, at: 50, w: 90, kind: 'door' },
  { wall: 5, at: 80, w: 140, kind: 'passage' },
  { wall: 6, at: 150, w: 90, kind: 'door' },
  { wall: 7, at: 40, w: 120, kind: 'passage' },
  { wall: 7, at: 270, w: 80, kind: 'door' },
  { wall: 8, at: 30, w: 70, kind: 'door' },
  { wall: 8, at: 220, w: 80, kind: 'door' },
  { wall: 10, at: 260, w: 90, kind: 'door' }, // ch1 depuis le séjour
  { wall: 10, at: 560, w: 90, kind: 'door' }, // ch2
  { wall: 10, at: 820, w: 80, kind: 'door' }, // sdb
  { wall: 10, at: 1060, w: 80, kind: 'door' }, // bureau
];

export const openingSpec = {
  door: { label: 'Porte intérieure', z0: 0, z1: 204 },
  entry: { label: 'Porte d’entrée', z0: 0, z1: 215 },
  passage: { label: 'Passage', z0: 0, z1: 215 },
  window: { label: 'Fenêtre', z0: 95, z1: 215 },
  bay: { label: 'Baie vitrée', z0: 0, z1: 215 },
};

// ---- Plomberie : distribution en pieuvre (une nourrice, un tube par point). ----
export const water = {
  meter: { x: 1180, y: 330, label: 'Arrivée et compteur' },
  heater: { x: 1040, y: 190, label: 'Chauffe-eau 200 L', liters: 200 },
  manifoldCold: { x: 1110, y: 320, label: 'Nourrice eau froide' },
  manifoldHot: { x: 1060, y: 320, label: 'Nourrice eau chaude' },
  sewer: { x: 1200, y: 880, label: 'Sortie eaux usées vers le regard' },
  points: [
    { id: 'evier', name: 'Évier', room: 'cuisine', x: 650, y: 30, cold: true, hot: true, drain: 40, flow: 12 },
    { id: 'lv', name: 'Lave-vaisselle', room: 'cuisine', x: 740, y: 30, cold: true, hot: false, drain: 40, flow: 6 },
    { id: 'wc', name: 'Cuvette WC', room: 'wc', x: 1160, y: 30, cold: true, hot: false, drain: 100, flow: 6 },
    { id: 'lm', name: 'Lave-mains', room: 'wc', x: 1030, y: 30, cold: true, hot: false, drain: 32, flow: 5 },
    { id: 'll', name: 'Lave-linge', room: 'cellier', x: 1160, y: 190, cold: true, hot: false, drain: 40, flow: 6 },
    { id: 'douche', name: 'Douche à l’italienne', room: 'sdb', x: 960, y: 860, cold: true, hot: true, drain: 40, flow: 12 },
    { id: 'vasque1', name: 'Vasque 1', room: 'sdb', x: 790, y: 870, cold: true, hot: true, drain: 32, flow: 6 },
    { id: 'vasque2', name: 'Vasque 2', room: 'sdb', x: 870, y: 870, cold: true, hot: true, drain: 32, flow: 6 },
    { id: 'jardin', name: 'Robinet de jardin', room: 'sejour', x: 15, y: 520, cold: true, hot: false, drain: null, flow: 15 },
  ],
};

// ---- Électricité ----
// Hauteurs de pose (cm) : prise 30, interrupteur 110, point lumineux au plafond.
export const panel = { x: 990, y: 300, label: 'Tableau électrique' };
export const pointHeight = { outlet: 30, switch: 110, light: H, special: 30 };
export const pointLabel = { outlet: 'Prise', switch: 'Interrupteur', light: 'Point lumineux', special: 'Prise spécialisée' };

const P = (x, y, k, label) => ({ x, y, k, label });
export const circuits = [
  { id: 'C1', name: 'Éclairage jour', kind: 'light', section: 1.5, breaker: 16, diff: 'AC', points: [
    P(250, 275, 'light'), P(120, 120, 'light'), P(650, 175, 'light'), P(900, 175, 'light'), P(1100, 75, 'light'), P(650, 450, 'light'), P(1000, 450, 'light'),
    P(30, 330, 'switch'), P(780, 60, 'switch'), P(880, 20, 'switch'), P(990, 40, 'switch'), P(520, 380, 'switch') ] },
  { id: 'C2', name: 'Éclairage nuit', kind: 'light', section: 1.5, breaker: 16, diff: 'AC', points: [
    P(200, 725, 'light'), P(575, 725, 'light'), P(875, 725, 'light'), P(1100, 725, 'light'), P(1100, 250, 'light'),
    P(240, 570, 'switch'), P(540, 570, 'switch'), P(800, 570, 'switch'), P(1040, 570, 'switch'), P(1010, 330, 'switch') ] },
  { id: 'C3', name: 'Prises séjour', kind: 'outlet', section: 2.5, breaker: 20, diff: 'AC', points: [
    P(15, 80, 'outlet'), P(15, 460, 'outlet'), P(150, 15, 'outlet'), P(380, 15, 'outlet'), P(485, 500, 'outlet'), P(300, 535, 'outlet'), P(100, 535, 'outlet'), P(485, 420, 'outlet') ] },
  { id: 'C4', name: 'Prises chambres', kind: 'outlet', section: 2.5, breaker: 20, diff: 'AC', points: [
    P(15, 640, 'outlet'), P(15, 820, 'outlet'), P(385, 700, 'outlet'), P(200, 885, 'outlet'),
    P(415, 640, 'outlet'), P(735, 820, 'outlet'), P(575, 885, 'outlet') ] },
  { id: 'C5', name: 'Prises bureau', kind: 'outlet', section: 2.5, breaker: 20, diff: 'AC', points: [
    P(1185, 600, 'outlet'), P(1185, 660, 'outlet'), P(1185, 780, 'outlet'), P(1100, 885, 'outlet'), P(1015, 820, 'outlet'), P(1015, 640, 'outlet') ] },
  { id: 'C6', name: 'Prises plan de travail', kind: 'kitchen', section: 2.5, breaker: 20, diff: 'A', points: [
    P(560, 15, 'outlet'), P(610, 15, 'outlet'), P(700, 15, 'outlet'), P(785, 120, 'outlet'), P(785, 220, 'outlet'), P(520, 200, 'outlet') ] },
  { id: 'C7', name: 'Plaque de cuisson', kind: 'special', section: 6, breaker: 32, diff: 'A', points: [P(785, 300, 'special', 'Plaque')] },
  { id: 'C8', name: 'Four', kind: 'special', section: 2.5, breaker: 20, diff: 'A', points: [P(760, 335, 'special', 'Four')] },
  { id: 'C9', name: 'Lave-vaisselle', kind: 'special', section: 2.5, breaker: 20, diff: 'A', points: [P(740, 15, 'special', 'Lave-vaisselle')] },
  { id: 'C10', name: 'Lave-linge', kind: 'special', section: 2.5, breaker: 20, diff: 'A', points: [P(1185, 210, 'special', 'Lave-linge')] },
  { id: 'C11', name: 'Chauffe-eau (heures creuses)', kind: 'special', section: 2.5, breaker: 20, diff: 'AC', points: [P(1015, 190, 'special', 'Chauffe-eau')] },
  { id: 'C12', name: 'Salle de bain', kind: 'outlet', section: 2.5, breaker: 20, diff: 'A', points: [P(985, 640, 'outlet'), P(765, 760, 'outlet'), P(985, 760, 'special', 'Sèche-serviettes')] },
  { id: 'C13', name: 'Prises entrée, cellier, couloir', kind: 'outlet', section: 2.5, breaker: 20, diff: 'AC', points: [
    P(815, 300, 'outlet'), P(1185, 280, 'outlet'), P(700, 535, 'outlet'), P(1185, 450, 'outlet') ] },
  { id: 'C14', name: 'VMC hygroréglable', kind: 'special', section: 1.5, breaker: 2, diff: 'AC', points: [P(1100, 170, 'special', 'VMC')] },
];

// Prises minimales par pièce (NF C 15-100, simplifié).
export const minOutlets = { sejour: 5, ch1: 3, ch2: 3, bureau: 3, cuisine: 6, sdb: 1, entree: 1, cellier: 1 };

// ---- Catalogue matériaux, prix indicatifs TTC fournitures seules (2026) ----
export const floors = {
  parquet: { name: 'Parquet chêne contrecollé', price: 48, waste: 0.07, color: '#c49a6c' },
  stratifie: { name: 'Stratifié chêne clair', price: 19, waste: 0.07, color: '#dcc29b' },
  carrelage: { name: 'Grès cérame 60 × 60', price: 36, waste: 0.1, color: '#cfcac1' },
  beton: { name: 'Béton ciré', price: 85, waste: 0.05, color: '#a19f9a' },
  vinyle: { name: 'Vinyle clipsable', price: 27, waste: 0.05, color: '#b9a88e' },
};
export const wallFinishes = {
  peinture: { name: 'Peinture velours', perL: 14, yield: 10, coats: 2 },
  satin: { name: 'Peinture satinée pièces humides', perL: 17, yield: 10, coats: 2 },
  faience: { name: 'Faïence 30 × 60 toute hauteur', price: 42, waste: 0.1 },
};

export const defaultFinishes = {
  sejour: { floor: 'parquet', wall: 'peinture' },
  cuisine: { floor: 'carrelage', wall: 'satin' },
  entree: { floor: 'carrelage', wall: 'peinture' },
  wc: { floor: 'carrelage', wall: 'faience' },
  cellier: { floor: 'carrelage', wall: 'satin' },
  couloir: { floor: 'parquet', wall: 'peinture' },
  ch1: { floor: 'parquet', wall: 'peinture' },
  ch2: { floor: 'parquet', wall: 'peinture' },
  sdb: { floor: 'carrelage', wall: 'faience' },
  bureau: { floor: 'parquet', wall: 'peinture' },
};

export const prices = {
  parpaing: 1.9, mortier: 9, laineMurExt: 11, ba13: 8.5, montant: 3.9, rail: 3.2, laineCloison: 4.5, bandeEnduit: 1.4,
  plafondPeinture: 11, plinthe: 4.5, sousCouche: 3.5, colleCarrelage: 4,
  cable15: 0.55, cable25: 0.85, cable6: 2.6, icta20: 0.35, icta25: 0.45, boite: 0.6,
  prise: 6.5, inter: 7.5, dcl: 4.5, sortieCable: 9, disj2: 9, disj16: 9, disj20: 9.5, disj32: 13, idAC: 48, idA: 79, tableau: 95, contacteur: 28,
  per16: 1.2, pvc32: 2.1, pvc40: 2.6, pvc100: 5.5, nourrice: 38, raccord: 3.6, collier: 0.4, chauffeEau: 459, reducteur: 45,
};

// Couleurs des calques du plan (données, pas de l'interface).
export const layerColors = { cold: '#3b82f6', hot: '#e8553d', drain: '#8a8798', cable: '#d9a500', wallExt: '#3b3550', wallInt: '#6b6880' };

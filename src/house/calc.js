// Géométrie, réseaux, conformité et métré de la maison. Fonctions pures : testées par scripts/check.mjs.
import { H, rooms, walls, openings, openingSpec, water, panel, pointHeight, circuits, minOutlets, floors, wallFinishes, prices } from './data.js';

const m = (cm) => cm / 100;
const m2 = (cm2) => cm2 / 1e4;

// ---------- Géométrie ----------
export function wallDir(w) {
  const dx = w.x2 - w.x1, dy = w.y2 - w.y1, len = Math.hypot(dx, dy);
  return { ux: dx / len, uy: dy / len, len };
}
export const openingsOn = (i) => openings.filter((o) => o.wall === i).sort((a, b) => a.at - b.at);
export const wallPoint = (w, d) => { const { ux, uy } = wallDir(w); return { x: w.x1 + ux * d, y: w.y1 + uy * d }; };
export const openingCenter = (o) => wallPoint(walls[o.wall], o.at + o.w / 2);

// Morceaux pleins d'un mur, le long du mur (a → b) et en hauteur (z0 → z1) : sert à la 3D.
export function wallPieces(i) {
  const { len } = wallDir(walls[i]);
  const out = [];
  let cur = 0;
  for (const o of openingsOn(i)) {
    const s = openingSpec[o.kind];
    if (o.at > cur) out.push({ a: cur, b: o.at, z0: 0, z1: H });
    if (s.z0 > 0) out.push({ a: o.at, b: o.at + o.w, z0: 0, z1: s.z0 });
    if (s.z1 < H) out.push({ a: o.at, b: o.at + o.w, z0: s.z1, z1: H });
    cur = o.at + o.w;
  }
  if (cur < len) out.push({ a: cur, b: len, z0: 0, z1: H });
  return out;
}

export const roomAt = (x, y) => rooms.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);

export function roomOpenings(r) {
  return openings.filter((o) => {
    const { x, y } = openingCenter(o);
    const onV = (Math.abs(x - r.x) < 1 || Math.abs(x - r.x - r.w) < 1) && y >= r.y && y <= r.y + r.h;
    const onH = (Math.abs(y - r.y) < 1 || Math.abs(y - r.y - r.h) < 1) && x >= r.x && x <= r.x + r.w;
    return onV || onH;
  });
}

const openingArea = (o) => m2(o.w * (openingSpec[o.kind].z1 - openingSpec[o.kind].z0));

// ---------- Pièces et finitions ----------
export function roomQty(r, fin) {
  const area = m2(r.w * r.h);
  const perim = m(2 * (r.w + r.h));
  const ops = roomOpenings(r);
  const opArea = ops.reduce((s, o) => s + openingArea(o), 0);
  const doorWidth = ops.filter((o) => openingSpec[o.kind].z0 === 0).reduce((s, o) => s + m(o.w), 0);
  const wallArea = perim * m(H) - opArea;
  const f = floors[fin.floor];
  const wf = wallFinishes[fin.wall];
  const floorQty = area * (1 + f.waste);
  const floorExtra = fin.floor === 'carrelage' ? prices.colleCarrelage : prices.sousCouche;
  const floorCost = floorQty * f.price + area * floorExtra;
  const tiled = Boolean(wf.price);
  const wallQty = tiled ? wallArea * (1 + wf.waste) : (wallArea * wf.coats) / wf.yield;
  const wallCost = wallQty * (tiled ? wf.price : wf.perL);
  const ceilingL = (area * 2) / 10;
  const ceilingCost = ceilingL * prices.plafondPeinture;
  const plinthes = tiled ? 0 : Math.max(0, perim - doorWidth);
  const plintheCost = plinthes * prices.plinthe;
  return {
    area, perim, opArea, wallArea, doorWidth, openings: ops,
    floorQty, floorCost, wallQty, wallUnit: tiled ? 'm²' : 'L', wallCost, ceilingL, ceilingCost, plinthes, plintheCost,
    total: floorCost + wallCost + ceilingCost + plintheCost,
  };
}

export const totalArea = () => rooms.reduce((s, r) => s + m2(r.w * r.h), 0);

// ---------- Réseaux (tracé en équerre, comme les gaines et tubes posés le long des murs) ----------
export const elbow = (a, b) => [a, { x: b.x, y: a.y }, b];
export const manhattan = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// Distribution en pieuvre : un tube par point depuis sa nourrice, +50 cm de remontée par raccordement.
export function waterRuns() {
  const runs = [];
  for (const p of water.points) {
    if (p.cold) runs.push({ point: p, kind: 'cold', path: elbow(water.manifoldCold, p), length: m(manhattan(water.manifoldCold, p)) + 0.5 });
    if (p.hot) runs.push({ point: p, kind: 'hot', path: elbow(water.manifoldHot, p), length: m(manhattan(water.manifoldHot, p)) + 0.5 });
    if (p.drain) runs.push({ point: p, kind: 'drain', path: elbow(p, water.sewer), length: m(manhattan(p, water.sewer)), diameter: p.drain });
  }
  const feeders = [
    { kind: 'cold', label: 'Compteur → nourrice froide', path: elbow(water.meter, water.manifoldCold), length: m(manhattan(water.meter, water.manifoldCold)) + 1 },
    { kind: 'cold', label: 'Nourrice froide → chauffe-eau', path: elbow(water.manifoldCold, water.heater), length: m(manhattan(water.manifoldCold, water.heater)) + 1 },
    { kind: 'hot', label: 'Chauffe-eau → nourrice chaude', path: elbow(water.heater, water.manifoldHot), length: m(manhattan(water.heater, water.manifoldHot)) + 1 },
  ];
  return { runs, feeders };
}

export function waterChecks() {
  const { runs } = waterRuns();
  const out = [];
  for (const r of runs.filter((x) => x.kind === 'drain')) {
    const drop = r.length * 2; // pente de 2 cm/m
    out.push({ ok: drop <= 30, text: `${r.point.name} : évacuation Ø${r.diameter} de ${r.length.toFixed(1)} m, dénivelé ${drop.toFixed(0)} cm à 2 cm/m${drop > 30 ? ' — prévoir une colonne ou un relevage' : ''}` });
  }
  for (const r of runs.filter((x) => x.kind === 'hot')) {
    const wait = r.length * 0.13; // ~0,13 L d'eau froide par mètre de PER 16 (Ø intérieur 11,6 mm)
    out.push({ ok: r.length <= 12, text: `${r.point.name} : ${r.length.toFixed(1)} m d’eau chaude, ${wait.toFixed(1)} L à purger avant qu’elle arrive${r.length > 12 ? ' — envisager un bouclage' : ''}` });
  }
  const flow = water.points.reduce((s, p) => s + p.flow, 0);
  out.push({ ok: true, text: `Débit cumulé de tous les points : ${flow} L/min ; un réducteur de pression à 3 bar protège l’installation` });
  out.push({ ok: water.heater.liters >= 150, text: `Chauffe-eau ${water.heater.liters} L : adapté à un foyer de 3 à 4 personnes` });
  return out;
}

// Circuit électrique : du tableau au point le plus proche, puis de proche en proche, dans le plafond,
// + descente vers chaque point. Marge de 10 %.
export function circuitRun(c) {
  const left = [...c.points];
  const path = [panel];
  let cur = panel, flat = 0;
  while (left.length) {
    let best = 0;
    left.forEach((p, i) => { if (manhattan(cur, p) < manhattan(cur, left[best])) best = i; });
    const next = left.splice(best, 1)[0];
    flat += manhattan(cur, next);
    path.push({ x: next.x, y: cur.y }, next);
    cur = next;
  }
  const drops = c.points.reduce((s, p) => s + (H - pointHeight[p.k]), 0) + (H - 180); // tableau posé à 1,80 m
  return { path, length: m(flat + drops) * 1.1 };
}

export function requiredDifferentials(area) {
  return area <= 35 ? 1 : area <= 100 ? 2 : 3;
}

// Répartition des circuits sous les interrupteurs différentiels 30 mA (max 8 circuits par ID).
export function differentials() {
  const need = requiredDifferentials(totalArea());
  const typeA = circuits.filter((c) => c.diff === 'A');
  const typeAC = circuits.filter((c) => c.diff === 'AC');
  const nA = Math.max(1, Math.ceil(typeA.length / 8));
  const nAC = Math.max(need - nA, Math.ceil(typeAC.length / 8));
  const split = (list, n) => Array.from({ length: n }, (_, i) => list.filter((_, j) => j % n === i));
  return [
    ...split(typeAC, nAC).map((cs) => ({ type: 'AC', circuits: cs.map((c) => c.id) })),
    ...split(typeA, nA).map((cs) => ({ type: 'A', circuits: cs.map((c) => c.id) })),
  ].map((d, i) => ({ id: `ID${i + 1}`, rating: 40, ...d }));
}

const count = (c, k) => c.points.filter((p) => p.k === k).length;

export function elecChecks() {
  const out = [];
  for (const c of circuits) {
    const lights = count(c, 'light'), outlets = count(c, 'outlet');
    if (c.kind === 'light') {
      const ok = c.section === 1.5 && c.breaker <= 16 && lights <= 8;
      out.push({ ok, text: `${c.id} ${c.name} : ${lights} points lumineux sur ${c.section} mm² / ${c.breaker} A (max 8)` });
    } else if (c.kind === 'outlet') {
      const max = c.section >= 2.5 ? 12 : 8;
      const ok = (c.section >= 2.5 ? c.breaker <= 20 : c.breaker <= 16) && outlets <= max;
      out.push({ ok, text: `${c.id} ${c.name} : ${outlets} prises sur ${c.section} mm² / ${c.breaker} A (max ${max})` });
    } else if (c.kind === 'kitchen') {
      out.push({ ok: outlets <= 6 && c.section >= 2.5, text: `${c.id} ${c.name} : ${outlets} prises de plan de travail (max 6 par circuit)` });
    } else {
      const big = c.points[0].label === 'Plaque';
      const ok = c.points.length === 1 && (!big || (c.section >= 6 && c.breaker === 32));
      out.push({ ok, text: `${c.id} ${c.name} : circuit spécialisé, ${c.section} mm² / ${c.breaker} A` });
    }
  }
  const perRoom = {};
  for (const c of circuits) for (const p of c.points) if (p.k === 'outlet') { const r = roomAt(p.x, p.y); if (r) perRoom[r.id] = (perRoom[r.id] ?? 0) + 1; }
  for (const [id, min] of Object.entries(minOutlets)) {
    const r = rooms.find((x) => x.id === id);
    out.push({ ok: (perRoom[id] ?? 0) >= min, text: `${r.name} : ${perRoom[id] ?? 0} prises (minimum ${min})` });
  }
  const ids = differentials();
  const need = requiredDifferentials(totalArea());
  out.push({ ok: ids.length >= need, text: `${ids.length} interrupteurs différentiels 30 mA pour ${totalArea().toFixed(0)} m² (minimum ${need})` });
  out.push({ ok: ids.every((d) => d.circuits.length <= 8), text: 'Pas plus de 8 circuits par interrupteur différentiel' });
  const needA = circuits.filter((c) => ['Plaque', 'Lave-linge'].includes(c.points[0]?.label));
  out.push({ ok: needA.every((c) => c.diff === 'A'), text: 'Plaque de cuisson et lave-linge protégés par un différentiel de type A' });
  return out;
}

// ---------- Métré et budget ----------
const line = (item, qty, unit, unitPrice) => ({ item, qty, unit, unitPrice, total: qty * unitPrice });

export function bill(finishes) {
  const extWalls = walls.map((w, i) => ({ w, i })).filter(({ w }) => w.ext);
  const intWalls = walls.map((w, i) => ({ w, i })).filter(({ w }) => !w.ext);
  const wallArea = (list) => list.reduce((s, { w, i }) => s + m(wallDir(w).len) * m(H) - openingsOn(i).reduce((a, o) => a + openingArea(o), 0), 0);
  const ext = wallArea(extWalls);
  const int = wallArea(intWalls);
  const intLen = intWalls.reduce((s, { w }) => s + m(wallDir(w).len), 0);
  const ceiling = totalArea();
  const plates = (area) => Math.ceil((area * 1.1) / 3);

  const gros = [
    line('Parpaings creux 20 × 20 × 50 (10 au m²)', Math.ceil(ext * 10 * 1.05), 'u', prices.parpaing),
    line('Mortier en sac de 35 kg (1 sac pour 4 m²)', Math.ceil(ext / 4), 'sac', prices.mortier),
    line('Laine de verre 120 mm, murs extérieurs', +ext.toFixed(1), 'm²', prices.laineMurExt),
    line('Plaques BA13 de doublage (1,20 × 2,50)', plates(ext), 'u', prices.ba13),
  ];
  const cloisons = [
    line('Plaques BA13, 2 faces des cloisons', plates(int * 2), 'u', prices.ba13),
    line('Montants 48 mm (entraxe 60 cm)', intWalls.reduce((s, { w }) => s + Math.ceil(wallDir(w).len / 60) + 1, 0), 'u', prices.montant),
    line('Rails 48 mm de 3 m (haut et bas)', Math.ceil((intLen * 2) / 3), 'u', prices.rail),
    line('Laine minérale 45 mm phonique', +int.toFixed(1), 'm²', prices.laineCloison),
    line('Plaques BA13 de plafond', plates(ceiling), 'u', prices.ba13),
    line('Bandes et enduit de joints', +(int * 2 + ext + ceiling).toFixed(1), 'm²', prices.bandeEnduit),
  ];

  const finitions = [];
  for (const r of rooms) {
    const fin = finishes[r.id];
    const q = roomQty(r, fin);
    const f = floors[fin.floor], wf = wallFinishes[fin.wall];
    finitions.push(line(`${r.name} · sol ${f.name.toLowerCase()} (+${Math.round(f.waste * 100)} % de chute)`, +q.floorQty.toFixed(2), 'm²', f.price));
    finitions.push(line(`${r.name} · ${fin.floor === 'carrelage' ? 'colle et joints' : 'sous-couche'}`, +q.area.toFixed(2), 'm²', fin.floor === 'carrelage' ? prices.colleCarrelage : prices.sousCouche));
    finitions.push(line(`${r.name} · murs, ${wf.name.toLowerCase()}`, +q.wallQty.toFixed(2), q.wallUnit, wf.price ?? wf.perL));
    finitions.push(line(`${r.name} · plafond, peinture mate`, +q.ceilingL.toFixed(2), 'L', prices.plafondPeinture));
    if (q.plinthes) finitions.push(line(`${r.name} · plinthes`, +q.plinthes.toFixed(2), 'm', prices.plinthe));
  }

  const cable = { 1.5: 0, 2.5: 0, 6: 0 };
  for (const c of circuits) cable[c.section] += circuitRun(c).length;
  const all = circuits.flatMap((c) => c.points);
  const breakers = (a) => circuits.filter((c) => c.breaker === a).length;
  const ids = differentials();
  const elec = [
    line('Câble H07V-U 1,5 mm² (3 conducteurs, longueur de gaine)', Math.ceil(cable[1.5]), 'm', prices.cable15 * 3),
    line('Câble H07V-U 2,5 mm² (3 conducteurs)', Math.ceil(cable[2.5]), 'm', prices.cable25 * 3),
    line('Câble H07V-U 6 mm² (3 conducteurs)', Math.ceil(cable[6]), 'm', prices.cable6 * 3),
    line('Gaine ICTA Ø20', Math.ceil(cable[1.5] + cable[2.5]), 'm', prices.icta20),
    line('Gaine ICTA Ø25', Math.ceil(cable[6]), 'm', prices.icta25),
    line('Boîtes d’encastrement', all.length, 'u', prices.boite),
    line('Prises 2P+T', all.filter((p) => p.k === 'outlet').length, 'u', prices.prise),
    line('Interrupteurs va-et-vient', all.filter((p) => p.k === 'switch').length, 'u', prices.inter),
    line('Douilles DCL', all.filter((p) => p.k === 'light').length, 'u', prices.dcl),
    line('Sorties de câble spécialisées', all.filter((p) => p.k === 'special').length, 'u', prices.sortieCable),
    line('Disjoncteurs 2 A', breakers(2), 'u', prices.disj2),
    line('Disjoncteurs 16 A', breakers(16), 'u', prices.disj16),
    line('Disjoncteurs 20 A', breakers(20), 'u', prices.disj20),
    line('Disjoncteurs 32 A', breakers(32), 'u', prices.disj32),
    line('Interrupteurs différentiels 40 A 30 mA type AC', ids.filter((d) => d.type === 'AC').length, 'u', prices.idAC),
    line('Interrupteurs différentiels 40 A 30 mA type A', ids.filter((d) => d.type === 'A').length, 'u', prices.idA),
    line('Tableau 4 rangées', 1, 'u', prices.tableau),
    line('Contacteur heures creuses (chauffe-eau)', 1, 'u', prices.contacteur),
  ].filter((l) => l.qty > 0);

  const { runs, feeders } = waterRuns();
  const len = (kind, d) => [...runs, ...feeders].filter((r) => r.kind === kind && (!d || r.diameter === d)).reduce((s, r) => s + r.length, 0);
  const plomberie = [
    line('Tube PER gainé bleu Ø16 (eau froide)', Math.ceil(len('cold') * 1.1), 'm', prices.per16),
    line('Tube PER gainé rouge Ø16 (eau chaude)', Math.ceil(len('hot') * 1.1), 'm', prices.per16),
    line('Évacuation PVC Ø32', Math.ceil(len('drain', 32) * 1.1), 'm', prices.pvc32),
    line('Évacuation PVC Ø40', Math.ceil(len('drain', 40) * 1.1), 'm', prices.pvc40),
    line('Évacuation PVC Ø100', Math.ceil(len('drain', 100) * 1.1), 'm', prices.pvc100),
    line('Nourrices 4 à 6 départs (froide et chaude)', 2, 'u', prices.nourrice),
    line('Raccords à glissement', (runs.filter((r) => r.kind !== 'drain').length + feeders.length) * 2, 'u', prices.raccord),
    line('Colliers de fixation (tous les 50 cm)', Math.ceil((len('cold') + len('hot') + len('drain')) * 2), 'u', prices.collier),
    line(`Chauffe-eau électrique ${water.heater.liters} L`, 1, 'u', prices.chauffeEau),
    line('Réducteur de pression 3 bar', 1, 'u', prices.reducteur),
  ].filter((l) => l.qty > 0);

  const sections = [
    { id: 'gros', title: 'Murs extérieurs et isolation', lines: gros },
    { id: 'cloisons', title: 'Cloisons et plafonds', lines: cloisons },
    { id: 'finitions', title: 'Sols, murs et plafonds par pièce', lines: finitions },
    { id: 'elec', title: 'Électricité', lines: elec },
    { id: 'plomberie', title: 'Plomberie', lines: plomberie },
  ].map((s) => ({ ...s, total: s.lines.reduce((a, l) => a + l.total, 0) }));
  return { sections, total: sections.reduce((a, s) => a + s.total, 0), ext, int, ceiling };
}

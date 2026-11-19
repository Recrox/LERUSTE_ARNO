// Vérifs rapides : `npm run check`.
import assert from 'node:assert/strict';
import { pct, signedEur, ago, daysSince } from '../src/format.js';
import { portfolio, commitsByDay } from '../src/data.js';

const nb = (s) => s.replace(/\s/g, ' ');
assert.equal(nb(pct(-45.82)), '−45,82 %');
assert.equal(nb(pct(0)), '0,00 %');
assert.equal(nb(signedEur(2280.06)), '+2 280,06 €');
assert.equal(daysSince('2026-11-19'), 0);
assert.equal(ago('2026-11-18'), 'hier');
assert.equal(ago('2025-11-01'), 'l’année dernière');
assert.equal(ago('2026-06-16'), 'il y a 5 mois');

// Le relevé recopié doit rester cohérent : lignes + espèces = total, somme des +/- values = total.
const sum = (k) => portfolio.holdings.reduce((s, h) => s + h[k], 0);
assert.ok(Math.abs(sum('value') + portfolio.cash - portfolio.value) < 0.05, 'valeur totale incohérente');
assert.ok(Math.abs(sum('pnl') - portfolio.pnl) < 0.05, 'plus-value totale incohérente');
assert.equal(Object.values(commitsByDay).reduce((a, b) => a + b, 0), 199);
console.log('check ok');

// ---- Sport ----
import { clock, parseClock, riegel, epley, macros, exercises } from '../src/sport.js';
assert.equal(clock(3160), '52:40');
assert.equal(clock(5400), '1:30:00');
assert.equal(parseClock('52:40'), 3160);
assert.ok(Number.isNaN(parseClock('abc')));
assert.equal(Math.round(riegel(3000, 10, 10)), 3000);
assert.ok(riegel(3000, 10, 21.0975) > 2 * 3000, 'le semi doit être plus lent que 2 × 10 km');
assert.equal(epley(100, 1), 100);
assert.ok(Math.abs(epley(90, 5) - 105) < 0.01);
const mac = macros({ weight: 80, height: 180, age: 28, sex: 'h', activity: 1.55, goal: 'maintien' });
assert.equal(mac.bmr, 1790);
assert.equal(new Set(exercises.map((e) => e.name)).size, exercises.length, 'exercices en double');

// ---- Maison ----
import { rooms, openings, walls, circuits, defaultFinishes } from '../src/house/data.js';
import { totalArea, roomAt, wallPieces, wallDir, roomOpenings, elecChecks, waterChecks, bill, differentials } from '../src/house/calc.js';
assert.equal(totalArea(), 108);
// Les pièces ne se chevauchent pas et couvrent toute l'emprise.
for (const a of rooms) for (const b of rooms) if (a !== b) assert.ok(a.x >= b.x + b.w || b.x >= a.x + a.w || a.y >= b.y + b.h || b.y >= a.y + a.h, `${a.id} chevauche ${b.id}`);
// Chaque ouverture tient dans son mur et ne chevauche pas sa voisine.
for (const o of openings) assert.ok(o.at >= 0 && o.at + o.w <= wallDir(walls[o.wall]).len, `ouverture hors mur ${o.wall}`);
for (let i = 0; i < walls.length; i++) for (const p of wallPieces(i)) assert.ok(p.b > p.a && p.z1 > p.z0, `morceau vide sur le mur ${i}`);
// Chaque pièce a au moins une porte ou un passage.
for (const r of rooms) assert.ok(roomOpenings(r).some((o) => ['door', 'entry', 'passage'].includes(o.kind)), `${r.name} sans accès`);
// Chaque point électrique tombe dans une pièce.
for (const c of circuits) for (const p of c.points) assert.ok(roomAt(p.x, p.y), `${c.id} : point hors plan`);
assert.ok(elecChecks().every((c) => c.ok), elecChecks().filter((c) => !c.ok).map((c) => c.text).join(' | '));
assert.ok(waterChecks().every((c) => c.ok), waterChecks().filter((c) => !c.ok).map((c) => c.text).join(' | '));
assert.equal(differentials().length, 3);
const b = bill(defaultFinishes);
assert.ok(b.total > 10000 && b.total < 80000, `budget improbable : ${b.total}`);
console.log(`check maison ok · budget ${Math.round(b.total)} €`);

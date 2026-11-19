// Vérifs Sport (programmes), Santé et Comptabilité. Lancé par `npm run check`.
import assert from 'node:assert/strict';
import { exercises } from '../src/sport.js';
import { patternOf, splits, tut } from '../src/training.js';
import { sleepMinutes, sleepStats, bedtimes, totals, readiness, rolling, bmi } from '../src/health.js';
import { byBrackets, ipp, tob, capitalGainsTax, dividendTax, taxYears } from '../src/money/tax.js';
import { parseRevolutCsv, csvLine, monthSummary, autoCategory, lastMonths } from '../src/money/ledger.js';

// ---- Sport ----
for (const e of exercises) assert.ok(patternOf[e.name], `${e.name} sans pictogramme`);
for (const s of splits) for (const d of s.days) for (const x of d.items) assert.ok(exercises.some((e) => e.name === x.name), `${s.name} / ${d.name} : ${x.name} inconnu`);
assert.equal(tut('3-1-1-0', 8), 40);
assert.equal(tut('2-0-X-0', 5), 15);
assert.ok(Number.isNaN(tut('3-1', 8)));

// ---- Santé ----
assert.equal(sleepMinutes('23:00', '07:00'), 480);
assert.equal(sleepMinutes('01:30', '08:00'), 390);
assert.deepEqual(bedtimes('07:00').map((b) => b.at), ['21:45', '23:15', '00:45']);
const st = sleepStats([{ date: '2026-11-18', bed: '23:00', wake: '07:00', quality: 4 }, { date: '2026-11-19', bed: '01:00', wake: '07:00', quality: 2 }]);
assert.equal(st.avg, 420);
assert.equal(st.debt, 120);
assert.equal(Math.round(st.spread), 60);
assert.equal(Math.round(totals([{ food: 'Riz cuit', qty: 200 }]).kcal), 260);
assert.equal(readiness({ sleepH: 8, energy: 5, stress: 1, soreness: 1 }).score, 100);
assert.equal(readiness({ sleepH: 5, energy: 1, stress: 5, soreness: 5 }).score, 0);
assert.deepEqual(rolling([1, 2, 3], 2), [1, 1.5, 2.5]);
assert.equal(Math.round(bmi(80, 180) * 10) / 10, 24.7);

// ---- Impôts belges ----
const b = taxYears[2025].brackets;
assert.equal(byBrackets(16320, b).total, 4080);
assert.equal(byBrackets(28800, b).total, 4080 + 12480 * 0.4);
const r = ipp({ gross: 45000, year: 2026, communal: 0.07 });
assert.ok(Math.abs(r.onss - 5881.5) < 0.01);
assert.equal(r.costs, 6070); // forfait plafonné
assert.ok(r.total > 7000 && r.total < 13000, `IPP improbable : ${r.total}`);
assert.ok(r.marginal > 0.45 && r.marginal < 0.5);
assert.equal(ipp({ gross: 0 }).total, 0);
assert.equal(tob(1000, 'share'), 3.5);
assert.equal(tob(10_000_000, 'share'), 1600);
assert.deepEqual(capitalGainsTax(15000, 2000), { net: 13000, taxable: 3000, tax: 300 });
assert.equal(capitalGainsTax(5000, 9000).tax, 0);
assert.ok(Math.abs(dividendTax(100).net - 59.5) < 1e-9);

// ---- Comptabilité ----
assert.deepEqual(csvLine('a,"b, c",d'), ['a', 'b, c', 'd']);
assert.deepEqual(csvLine('"il dit ""oui""",2'), ['il dit "oui"', '2']);
const csv = [
  'Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance',
  'CARD_PAYMENT,Current,2026-11-03 12:01:00,2026-11-04 09:00:00,Colruyt Tournai,-54.20,0.00,EUR,COMPLETED,900',
  'TOPUP,Current,2026-11-01 08:00:00,2026-11-01 08:00:00,Salaire BizzDev,2850.00,0.00,EUR,COMPLETED,2900',
  'CARD_PAYMENT,Current,2026-11-05 20:00:00,,Uber Eats,-23.50,0.00,EUR,PENDING,0',
  'TRANSFER,Current,2026-11-06 10:00:00,2026-11-06 10:00:00,To EUR Savings,-500,0,EUR,COMPLETED,0',
  'CARD_PAYMENT,Current,2026-11-07 10:00:00,2026-11-07 10:00:00,"Basic-Fit, Tournai",-29.99,0.50,EUR,COMPLETED,0',
].join('\n');
const parsed = parseRevolutCsv(csv);
assert.equal(parsed.rows.length, 4);
assert.equal(parsed.skipped, 1);
assert.deepEqual(parsed.rows.map((x) => x.category), ['Courses', 'Salaire', 'Transfert interne', 'Sport']);
assert.equal(parsed.rows[3].amount, -30.49);
const sum = monthSummary(parsed.rows, '2026-11');
assert.equal(sum.income, 2850);
assert.equal(Math.round(sum.expense * 100) / 100, 84.69);
assert.equal(autoCategory('TotalEnergies facture', -80), 'Énergie');
assert.equal(autoCategory('Total station Mons', -60), 'Transport');
assert.ok(parseRevolutCsv('foo,bar\n1,2').error);
assert.deepEqual(lastMonths('2026-02', 3), ['2025-12', '2026-01', '2026-02']);
console.log('check sport, santé, compta ok');

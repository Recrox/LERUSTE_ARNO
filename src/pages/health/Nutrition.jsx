import { useState } from 'react';
import { Plus, Minus, Trash2, GlassWater } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { foods, totals, waterTarget } from '../../health.js';
import { macros } from '../../sport.js';
import { isoDate } from '../../format.js';
import { field, chip, btnPrimary, btnGhost } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.'));
const r0 = (n) => Math.round(n).toLocaleString('fr-FR');

function Gauge({ label, value, target, unit }) {
  const p = target > 0 ? value / target : 0;
  return (
    <div>
      <div className="flex justify-between text-sm"><span>{label}</span><span className="tabular-nums"><span className="font-semibold">{r0(value)}</span> / {r0(target)} {unit}</span></div>
      <div className="mt-1 h-2 rounded-full bg-canvas" role="progressbar" aria-label={label} aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${p > 1.1 ? 'bg-down' : 'bg-data'}`} style={{ width: `${Math.min(100, p * 100)}%` }} />
      </div>
    </div>
  );
}

export default function Nutrition({ profile, setProfile, log, setLog, water, setWater }) {
  const [day, setDay] = useState(isoDate());
  const [pick, setPick] = useState({ food: foods[0].name, qty: '150' });
  const items = log[day] ?? [];
  const t = totals(items);
  const ok = num(profile.weight) > 0 && num(profile.height) > 0 && num(profile.age) > 0;
  const target = ok ? macros({ ...profile, weight: num(profile.weight), height: num(profile.height), age: num(profile.age) }) : null;
  const glasses = water[day] ?? 0;
  const waterMl = ok ? waterTarget(num(profile.weight)) : 2000;
  const selected = foods.find((x) => x.name === pick.food);
  const setP = (k) => (e) => setProfile({ ...profile, [k]: e.target.value });

  const add = (e) => {
    e.preventDefault();
    if (!(num(pick.qty) > 0)) return;
    setLog({ ...log, [day]: [...items, { id: Date.now(), food: pick.food, qty: num(pick.qty) }] });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <Card>
          <CardTitle aside={<input type="date" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Jour" className={field} />}>Bilan du jour</CardTitle>
          {target ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Gauge label="Calories" value={t.kcal} target={target.kcal} unit="kcal" />
              <Gauge label="Protéines" value={t.p} target={target.protein} unit="g" />
              <Gauge label="Glucides" value={t.c} target={target.carbs} unit="g" />
              <Gauge label="Lipides" value={t.fat} target={target.fat} unit="g" />
            </div>
          ) : <p className="text-sm text-down">Complète ton profil pour calculer tes objectifs</p>}
        </Card>

        <Card>
          <CardTitle>Ce que j’ai mangé</CardTitle>
          <form onSubmit={add} className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-xs text-muted">Aliment
              <select value={pick.food} onChange={(e) => { const x = foods.find((y) => y.name === e.target.value); setPick({ food: x.name, qty: String(x.unit) }); }} className={`${field} mt-1 block w-60`}>
                {foods.map((x) => <option key={x.name}>{x.name}</option>)}
              </select>
            </label>
            <label className="text-xs text-muted">Quantité (g ou ml)<input inputMode="decimal" value={pick.qty} onChange={(e) => setPick({ ...pick, qty: e.target.value })} className={`${field} mt-1 block w-28`} /></label>
            {selected.unit !== 100 && <button type="button" onClick={() => setPick({ ...pick, qty: String(selected.unit) })} className={btnGhost}>{selected.unitLabel}</button>}
            <button className={btnPrimary}><Plus size={14} aria-hidden="true" />Ajouter</button>
          </form>
          {items.length === 0 ? <p className="text-sm text-muted">Rien de noté pour ce jour</p> : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="pb-2 font-medium">Aliment</th><th className="pb-2 text-right font-medium">Qté</th><th className="pb-2 text-right font-medium">kcal</th><th className="pb-2 text-right font-medium">P</th><th className="pb-2 text-right font-medium">G</th><th className="pb-2 text-right font-medium">L</th><th /></tr></thead>
              <tbody className="divide-y divide-line tabular-nums">
                {items.map((x) => {
                  const m = totals([x]);
                  return (
                    <tr key={x.id}>
                      <td className="py-1.5">{x.food}</td><td className="py-1.5 text-right">{x.qty} g</td><td className="py-1.5 text-right">{r0(m.kcal)}</td>
                      <td className="py-1.5 text-right">{r0(m.p)}</td><td className="py-1.5 text-right">{r0(m.c)}</td><td className="py-1.5 text-right">{r0(m.fat)}</td>
                      <td className="py-1.5 text-right"><button onClick={() => setLog({ ...log, [day]: items.filter((y) => y.id !== x.id) })} aria-label={`Retirer ${x.food}`} className="rounded p-1 text-muted hover:text-ink"><Trash2 size={14} aria-hidden="true" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardTitle aside={<span className="text-xs text-muted tabular-nums">objectif {(waterMl / 1000).toLocaleString('fr-FR')} L</span>}>Hydratation</CardTitle>
          <div className="flex items-center gap-4">
            <button onClick={() => setWater({ ...water, [day]: Math.max(0, glasses - 1) })} aria-label="Retirer un verre" className={btnGhost}><Minus size={16} aria-hidden="true" /></button>
            <p className="flex-1 text-center"><span className="text-3xl font-semibold tabular-nums">{(glasses * 0.25).toLocaleString('fr-FR')} L</span><br /><span className="text-xs text-muted">{glasses} verres de 25 cl</span></p>
            <button onClick={() => setWater({ ...water, [day]: glasses + 1 })} aria-label="Ajouter un verre" className={btnPrimary}><Plus size={16} aria-hidden="true" /></button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
            {Array.from({ length: Math.ceil(waterMl / 250) }, (_, i) => <GlassWater key={i} size={18} className={i < glasses ? 'text-data' : 'text-line'} />)}
          </div>
          <p className="mt-2 text-xs text-muted">35 ml par kg de poids, plus 500 ml par heure de sport</p>
        </Card>

        <Card>
          <CardTitle>Mon profil</CardTitle>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs text-muted">Poids (kg)<input inputMode="decimal" value={profile.weight} onChange={setP('weight')} className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Taille (cm)<input inputMode="numeric" value={profile.height} onChange={setP('height')} className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Âge<input inputMode="numeric" value={profile.age} onChange={setP('age')} className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Sexe<select value={profile.sex} onChange={setP('sex')} className={`${field} mt-1 block w-full`}><option value="h">Homme</option><option value="f">Femme</option></select></label>
            <label className="col-span-2 text-xs text-muted">Activité
              <select value={profile.activity} onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })} className={`${field} mt-1 block w-full`}>
                <option value={1.375}>Légère (1-2 séances)</option><option value={1.55}>Modérée (3-4 séances)</option><option value={1.725}>Élevée (5-6 séances)</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex gap-1" role="group" aria-label="Objectif">
            {[['seche', 'Sèche'], ['maintien', 'Maintien'], ['masse', 'Prise de masse']].map(([id, l]) => <button key={id} aria-pressed={profile.goal === id} onClick={() => setProfile({ ...profile, goal: id })} className={chip(profile.goal === id)}>{l}</button>)}
          </div>
          {target && <p className="mt-3 text-xs text-muted">Métabolisme de base {r0(target.bmr)} kcal · objectif {r0(target.kcal)} kcal, {target.protein} g de protéines (2 g/kg). Repère indicatif, pas un avis médical</p>}
        </Card>
      </div>
    </div>
  );
}

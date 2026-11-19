import { useState } from 'react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { epley, macros } from '../../sport.js';
import { field, chip } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.'));
const kg = (n) => `${(Math.round(n * 2) / 2).toLocaleString('fr-FR')} kg`;

export default function Tools() {
  const [load, setLoad] = useState('90');
  const [reps, setReps] = useState('5');
  const [p, setP] = useState({ weight: '80', height: '180', age: '28', sex: 'h', activity: 1.55, goal: 'maintien' });
  const orm = epley(num(load), num(reps));
  const okOrm = orm > 0 && num(reps) >= 1 && num(reps) <= 12;
  const m = macros({ ...p, weight: num(p.weight), height: num(p.height), age: num(p.age) });
  const okM = num(p.weight) > 0 && num(p.height) > 0 && num(p.age) > 0;
  const setField = (k) => (e) => setP({ ...p, [k]: e.target.value });

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardTitle aside={<span className="text-xs text-muted">Formule d’Epley</span>}>Charge maximale (1RM)</CardTitle>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">Charge (kg)<input inputMode="decimal" value={load} onChange={(e) => setLoad(e.target.value)} className={`${field} mt-1 block w-24`} /></label>
          <label className="text-xs text-muted">Répétitions<input inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} className={`${field} mt-1 block w-20`} /></label>
        </div>
        {okOrm ? (
          <>
            <p className="mt-4 text-3xl font-semibold tabular-nums">{kg(orm)}</p>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">Charges de travail selon le pourcentage du 1RM</caption>
              <thead><tr className="text-left text-xs text-muted"><th className="pb-1 font-medium">% 1RM</th><th className="pb-1 font-medium">Charge</th><th className="pb-1 font-medium">Usage</th></tr></thead>
              <tbody className="divide-y divide-line tabular-nums">
                {[[95, 'Force max, 1-2 reps'], [85, 'Force, 3-5 reps'], [75, 'Hypertrophie, 6-10 reps'], [65, 'Volume, 10-15 reps'], [50, 'Échauffement, technique']].map(([pc, use]) => (
                  <tr key={pc}><td className="py-1.5">{pc} %</td><td className="py-1.5 font-semibold">{kg((orm * pc) / 100)}</td><td className="py-1.5 text-muted">{use}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        ) : <p className="mt-4 text-sm text-down">Entre une charge et 1 à 12 répétitions</p>}
      </Card>

      <Card>
        <CardTitle aside={<span className="text-xs text-muted">Mifflin-St Jeor</span>}>Calories et macros</CardTitle>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">Poids (kg)<input inputMode="decimal" value={p.weight} onChange={setField('weight')} className={`${field} mt-1 block w-20`} /></label>
          <label className="text-xs text-muted">Taille (cm)<input inputMode="numeric" value={p.height} onChange={setField('height')} className={`${field} mt-1 block w-20`} /></label>
          <label className="text-xs text-muted">Âge<input inputMode="numeric" value={p.age} onChange={setField('age')} className={`${field} mt-1 block w-16`} /></label>
          <label className="text-xs text-muted">Sexe
            <select value={p.sex} onChange={setField('sex')} className={`${field} mt-1 block`}><option value="h">Homme</option><option value="f">Femme</option></select>
          </label>
          <label className="text-xs text-muted">Activité
            <select value={p.activity} onChange={(e) => setP({ ...p, activity: Number(e.target.value) })} className={`${field} mt-1 block`}>
              <option value={1.375}>Légère (1-2 séances)</option>
              <option value={1.55}>Modérée (3-4 séances)</option>
              <option value={1.725}>Élevée (5-6 séances)</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex gap-1" role="group" aria-label="Objectif">
          {[['seche', 'Sèche'], ['maintien', 'Maintien'], ['masse', 'Prise de masse']].map(([id, l]) => (
            <button key={id} aria-pressed={p.goal === id} onClick={() => setP({ ...p, goal: id })} className={chip(p.goal === id)}>{l}</button>
          ))}
        </div>
        {okM ? (
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[['Calories', `${m.kcal.toLocaleString('fr-FR')} kcal`], ['Protéines', `${m.protein} g`], ['Glucides', `${m.carbs} g`], ['Lipides', `${m.fat} g`]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">{k}</dt><dd className="text-lg font-semibold tabular-nums">{v}</dd></div>
            ))}
          </dl>
        ) : <p className="mt-4 text-sm text-down">Complète poids, taille et âge</p>}
        <p className="mt-3 text-xs text-muted">Métabolisme de base {m.bmr.toLocaleString('fr-FR')} kcal. Repère indicatif, pas un avis médical</p>
      </Card>
    </div>
  );
}

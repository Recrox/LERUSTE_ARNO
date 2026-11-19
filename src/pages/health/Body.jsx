import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { bmi, bmiLabel, rolling } from '../../health.js';
import { isoDate } from '../../format.js';
import { field, btnPrimary } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.'));
const one = (n) => n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function Chart({ rows }) {
  const w = rows.map((r) => r.weight);
  const avg = rolling(w);
  const min = Math.min(...w) - 1, max = Math.max(...w) + 1;
  const x = (i) => (rows.length === 1 ? 50 : (i / (rows.length - 1)) * 100);
  const y = (v) => 100 - ((v - min) / (max - min)) * 100;
  return (
    <div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-56 w-full" aria-hidden="true">
        <polyline points={avg.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" className="stroke-data" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        {w.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="1.2" className="fill-muted" />)}
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted"><span>{rows[0].date}</span><span>{one(min + 1)} – {one(max - 1)} kg</span><span>{rows.at(-1).date}</span></div>
    </div>
  );
}

export default function Body({ entries, setEntries, profile }) {
  const [form, setForm] = useState({ date: isoDate(), weight: profile.weight, waist: '' });
  const rows = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const last = rows.at(-1);
  const height = num(profile.height);
  const monthAgo = rows.filter((r) => r.date <= isoDate(new Date(Date.now() - 30 * 86400000))).at(-1);
  const b = last && height ? bmi(last.weight, height) : null;
  const whr = last?.waist && height ? last.waist / height : null;

  const add = (e) => {
    e.preventDefault();
    if (!(num(form.weight) > 0)) return;
    setEntries([...entries.filter((x) => x.date !== form.date), { date: form.date, weight: num(form.weight), waist: num(form.waist) || null }]);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['Dernier poids', last ? `${one(last.weight)} kg` : '—'],
            ['Variation 30 jours', last && monthAgo ? `${last.weight - monthAgo.weight > 0 ? '+' : ''}${one(last.weight - monthAgo.weight)} kg` : '—'],
            ['IMC', b ? one(b) : '—', b ? bmiLabel(b) : 'Taille à renseigner dans le profil'],
            ['Tour de taille / taille', whr ? whr.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '—', whr ? (whr < 0.5 ? 'Sous 0,5 : bon repère' : 'Au-dessus de 0,5 : à surveiller') : 'Mesure ton tour de taille'],
          ].map(([k, v, note]) => (
            <Card as="div" key={k}><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd>{note && <dd className="text-xs text-muted">{note}</dd>}</Card>
          ))}
        </dl>
        <Card>
          <CardTitle aside={<span className="text-xs text-muted">courbe = moyenne sur 7 mesures</span>}>Évolution du poids</CardTitle>
          {rows.length ? <Chart rows={rows} /> : <p className="py-8 text-center text-sm text-muted">Ajoute une première pesée pour voir ta courbe</p>}
          <p className="mt-3 text-xs text-muted">L’IMC ne distingue pas muscle et graisse : avec beaucoup de muscle, il surestime. Le tour de taille est un meilleur repère pour un pratiquant de musculation</p>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <CardTitle>Nouvelle mesure</CardTitle>
          <form onSubmit={add} className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs text-muted">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Poids (kg)<input inputMode="decimal" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Tour de taille (cm)<input inputMode="decimal" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
            <button className={`${btnPrimary} col-span-2`}><Plus size={14} aria-hidden="true" />Enregistrer</button>
          </form>
          <p className="mt-2 text-xs text-muted">Pèse-toi le matin à jeun, après être passé aux toilettes, pour comparer ce qui est comparable</p>
        </Card>
        {rows.length > 0 && (
          <Card>
            <CardTitle>Historique</CardTitle>
            <ul className="max-h-64 divide-y divide-line overflow-y-auto text-sm">
              {[...rows].reverse().map((r) => (
                <li key={r.date} className="flex items-center justify-between py-1.5 tabular-nums">
                  <span>{r.date}</span><span>{one(r.weight)} kg{r.waist ? ` · ${r.waist} cm` : ''}</span>
                  <button onClick={() => setEntries(entries.filter((x) => x.date !== r.date))} aria-label={`Supprimer la mesure du ${r.date}`} className="rounded p-1 text-muted hover:text-ink"><Trash2 size={14} aria-hidden="true" /></button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

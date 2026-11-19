import { useState } from 'react';
import { Trash2, Plus, Moon } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { sleepMinutes, sleepStats, bedtimes, duration } from '../../health.js';
import { isoDate } from '../../format.js';
import { field, btnPrimary } from '../../ui.js';

const tips = [
  'Même heure de lever 7 jours sur 7, week-end compris : c’est le réglage le plus puissant de l’horloge interne',
  'Lumière du jour dans l’heure qui suit le réveil, écrans tamisés l’heure avant le coucher',
  'Pas de caféine après 14 h : sa demi-vie est de 5 à 6 heures',
  'Chambre à 17-19 °C, noire et silencieuse',
  'Après une séance de jambes ou un fractionné, vise 30 à 60 min de sommeil en plus',
];

export default function Sleep({ entries, setEntries }) {
  const [form, setForm] = useState({ date: isoDate(), bed: '23:15', wake: '07:00', quality: '3' });
  const [wake, setWake] = useState('07:00');
  const stats = sleepStats(entries);
  const recent = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  const max = 10 * 60;

  const add = (e) => {
    e.preventDefault();
    setEntries([...entries.filter((x) => x.date !== form.date), { ...form, quality: Number(form.quality) }]);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['Moyenne 7 nuits', stats ? duration(stats.avg) : '—', stats && stats.avg < 420 ? 'text-down' : ''],
            ['Dette sur 7 nuits', stats ? duration(stats.debt) : '—', stats && stats.debt > 300 ? 'text-down' : ''],
            ['Régularité du coucher', stats ? `± ${Math.round(stats.spread)} min` : '—', stats && stats.spread > 45 ? 'text-down' : ''],
            ['Qualité ressentie', stats ? `${stats.quality.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} / 5` : '—', ''],
          ].map(([k, v, tone]) => (
            <Card as="div" key={k}><dt className="text-xs text-muted">{k}</dt><dd className={`mt-1 text-2xl font-semibold tabular-nums ${tone}`}>{v}</dd></Card>
          ))}
        </dl>

        <Card>
          <CardTitle aside={<span className="text-xs text-muted">ligne = objectif 8 h</span>}>14 dernières nuits</CardTitle>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted"><Moon size={24} className="mx-auto mb-2" aria-hidden="true" />Note ta première nuit avec le formulaire</p>
          ) : (
            <ol className="relative flex h-48 items-end gap-2 border-b border-line">
              <li aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-lime-ink" style={{ bottom: `${(480 / max) * 100}%` }} />
              {recent.map((e) => {
                const m = sleepMinutes(e.bed, e.wake);
                return (
                  <li key={e.date} className="group relative flex h-full flex-1 flex-col justify-end">
                    <span className={`w-full rounded-t-md ${m >= 420 ? 'bg-data' : 'bg-down/70'}`} style={{ height: `${Math.min(100, (m / max) * 100)}%` }} title={`${e.date} : ${duration(m)}, qualité ${e.quality}/5`} />
                    <span className="mt-1 text-center text-[10px] text-muted tabular-nums">{e.date.slice(8)}/{e.date.slice(5, 7)}</span>
                    <button onClick={() => setEntries(entries.filter((x) => x.date !== e.date))} aria-label={`Supprimer la nuit du ${e.date}`} className="absolute -top-1 left-1/2 hidden -translate-x-1/2 rounded bg-surface p-0.5 text-muted group-hover:block group-focus-within:block"><Trash2 size={12} aria-hidden="true" /></button>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>

        <Card>
          <CardTitle>Bien dormir quand on s’entraîne</CardTitle>
          <ul className="list-disc space-y-1.5 pl-5 text-sm">{tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardTitle>Noter une nuit</CardTitle>
          <form onSubmit={add} className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs text-muted">Nuit du réveil<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Coucher<input type="time" value={form.bed} onChange={(e) => setForm({ ...form, bed: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Lever<input type="time" value={form.wake} onChange={(e) => setForm({ ...form, wake: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="col-span-2 text-xs text-muted">Qualité ressentie
              <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} className={`${field} mt-1 block w-full`}>
                {['1 · très mauvaise', '2 · mauvaise', '3 · correcte', '4 · bonne', '5 · excellente'].map((l, i) => <option key={l} value={i + 1}>{l}</option>)}
              </select>
            </label>
            <p className="col-span-2 text-sm">Durée : <span className="font-semibold tabular-nums">{duration(sleepMinutes(form.bed, form.wake))}</span></p>
            <button className={`${btnPrimary} col-span-2`}><Plus size={14} aria-hidden="true" />Enregistrer</button>
          </form>
        </Card>

        <Card>
          <CardTitle>Quand se coucher</CardTitle>
          <label className="text-xs text-muted">Je me lève à<input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className={`${field} mt-1 block w-32`} /></label>
          <ul className="mt-3 divide-y divide-line text-sm">
            {bedtimes(wake).map((b) => (
              <li key={b.cycles} className="flex justify-between py-2">
                <span className="font-mono text-lg font-semibold">{b.at}</span>
                <span className="text-muted">{b.cycles} cycles · {duration(b.sleep)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Cycles de 90 min et 15 min pour s’endormir : se réveiller en fin de cycle évite l’effet « gueule de bois »</p>
        </Card>
      </div>
    </div>
  );
}

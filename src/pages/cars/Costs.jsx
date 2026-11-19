import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { costCategories, costSummary, consumption } from '../../cars.js';
import { money, isoDate } from '../../format.js';
import { field, btnPrimary } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.').replace(/\s/g, ''));
const month = (key) => new Date(`${key}-01T00:00`).toLocaleDateString('fr-FR', { month: 'short' });

export default function Costs({ car, update }) {
  const [form, setForm] = useState({ date: isoDate(), category: 'Carburant', label: '', amount: '', km: '', liters: '' });
  const s = costSummary(car.costs);
  const conso = consumption(car.costs);
  const maxMonth = Math.max(1, ...s.months.map((m) => m.amount));
  const topCat = s.byCategory[0]?.[1] ?? 1;

  const add = (e) => {
    e.preventDefault();
    const amount = num(form.amount);
    if (!(amount > 0)) return;
    const km = num(form.km) || null;
    update({
      costs: [{ id: `c-${Date.now()}`, date: form.date, category: form.category, label: form.label.trim(), amount, km, liters: form.category === 'Carburant' ? num(form.liters) || null : null }, ...car.costs],
      ...(km && km > (Number(car.km) || 0) ? { km } : {}), // le compteur suit le dernier relevé saisi
    });
    setForm({ ...form, label: '', amount: '', liters: '' });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-4">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['Total dépensé', money(s.total)],
            [`En ${new Date().getFullYear()}`, money(s.thisYear)],
            ['Coût au km', s.perKm ? `${s.perKm.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €` : '—', s.perKm ? `sur ${s.driven.toLocaleString('fr-FR')} km` : 'Note le km sur au moins 2 dépenses'],
            ['Consommation', conso ? `${conso.per100.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} L/100` : '—', conso ? `${money(conso.eurPer100)} aux 100 km` : 'Note litres et km à chaque plein'],
          ].map(([k, v, note]) => <Card as="div" key={k}><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">{v}</dd>{note && <dd className="text-xs text-muted">{note}</dd>}</Card>)}
        </dl>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardTitle>12 derniers mois</CardTitle>
            <ol className="flex h-40 items-end gap-1 border-b border-line">
              {s.months.map((m) => (
                <li key={m.key} className="flex h-full flex-1 flex-col justify-end text-center">
                  <span className="w-full rounded-t-sm bg-data" style={{ height: `${(m.amount / maxMonth) * 100}%` }} title={`${m.key} : ${money(m.amount)}`} />
                  <span className="mt-1 text-[10px] text-muted">{month(m.key).slice(0, 3)}</span>
                </li>
              ))}
            </ol>
          </Card>
          <Card>
            <CardTitle>Par catégorie</CardTitle>
            {s.byCategory.length === 0 ? <p className="text-sm text-muted">Aucune dépense notée</p> : (
              <ul className="space-y-3">
                {s.byCategory.map(([cat, v]) => (
                  <li key={cat}>
                    <div className="flex justify-between text-sm"><span>{cat}</span><span className="tabular-nums">{money(v)}</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-canvas" aria-hidden="true"><div className="h-full rounded-full bg-data" style={{ width: `${(v / topCat) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="overflow-x-auto">
          <CardTitle>Historique</CardTitle>
          {car.costs.length === 0 ? <p className="text-sm text-muted">Ajoute ton premier plein, entretien ou facture avec le formulaire</p> : (
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Catégorie</th><th className="pb-2 font-medium">Détail</th><th className="pb-2 text-right font-medium">Km</th><th className="pb-2 text-right font-medium">Montant</th><th /></tr></thead>
              <tbody className="divide-y divide-line tabular-nums">
                {[...car.costs].sort((a, b) => b.date.localeCompare(a.date)).map((c) => (
                  <tr key={c.id}>
                    <td className="py-1.5 whitespace-nowrap">{c.date}</td>
                    <td className="py-1.5">{c.category}</td>
                    <td className="max-w-48 truncate py-1.5">{c.label}{c.liters ? ` ${c.liters} L` : ''}</td>
                    <td className="py-1.5 text-right">{c.km ? c.km.toLocaleString('fr-FR') : '—'}</td>
                    <td className="py-1.5 text-right font-semibold">{money(c.amount)}</td>
                    <td className="py-1.5 text-right"><button onClick={() => update({ costs: car.costs.filter((x) => x.id !== c.id) })} aria-label={`Supprimer la dépense du ${c.date}`} className="rounded p-1 text-muted hover:text-ink"><Trash2 size={14} aria-hidden="true" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>Ajouter une dépense</CardTitle>
        <form onSubmit={add} className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs text-muted">Catégorie
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${field} mt-1 block w-full`}>
              {costCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted">Montant (€)<input inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Compteur (km)<input inputMode="numeric" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} placeholder={car.km ? String(car.km) : ''} className={`${field} mt-1 block w-full`} /></label>
          {form.category === 'Carburant'
            ? <label className="text-xs text-muted">Litres<input inputMode="decimal" value={form.liters} onChange={(e) => setForm({ ...form, liters: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
            : <span />}
          <label className="col-span-2 text-xs text-muted">Détail<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder={form.category === 'Carburant' ? 'Plein E10, station…' : 'Garage, pièce changée…'} className={`${field} mt-1 block w-full`} /></label>
          <button className={`${btnPrimary} col-span-2`}><Plus size={14} aria-hidden="true" />Ajouter</button>
        </form>
        <p className="mt-3 text-xs text-muted">Pour la consommation : fais le plein complet, note les litres et le compteur à chaque fois</p>
      </Card>
    </div>
  );
}

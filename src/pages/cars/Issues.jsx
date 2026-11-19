import { useState } from 'react';
import { Plus, Trash2, Wrench, CircleCheck } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { severities, statuses } from '../../cars.js';
import { money, isoDate } from '../../format.js';
import { field, chip, btnPrimary } from '../../ui.js';

const sevTone = { low: 'bg-muted', medium: 'bg-lime-ink', high: 'bg-down' };
const blank = () => ({ date: isoDate(), title: '', description: '', severity: 'medium', estimate: '' });

export default function Issues({ car, update }) {
  const [form, setForm] = useState(blank);
  const [show, setShow] = useState('active');
  const list = car.issues
    .filter((i) => (show === 'active' ? i.status !== 'done' : show === 'done' ? i.status === 'done' : true))
    .sort((a, b) => b.date.localeCompare(a.date));

  const add = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const estimate = Number(String(form.estimate).replace(',', '.')) || null;
    update({ issues: [{ id: `i-${Date.now()}`, ...form, title: form.title.trim(), estimate, status: 'open' }, ...car.issues] });
    setForm(blank());
  };
  const patch = (id, fields) => update({ issues: car.issues.map((i) => (i.id === id ? { ...i, ...fields } : i)) });

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-3 flex flex-wrap gap-1" role="group" aria-label="Filtrer les problèmes">
          {[['active', `En cours (${car.issues.filter((i) => i.status !== 'done').length})`], ['done', 'Résolus'], ['all', 'Tous']].map(([k, l]) => (
            <button key={k} aria-pressed={show === k} onClick={() => setShow(k)} className={chip(show === k)}>{l}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <Card className="text-center">
            {show === 'active' ? <CircleCheck size={28} className="mx-auto text-up" aria-hidden="true" /> : <Wrench size={28} className="mx-auto text-muted" aria-hidden="true" />}
            <p className="mt-2 text-sm">{show === 'active' ? 'Aucun problème en cours' : 'Rien à afficher'}</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {list.map((i) => (
              <Card as="li" key={i.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold"><span className={`size-2.5 shrink-0 rounded-full ${sevTone[i.severity]}`} aria-hidden="true" />{i.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{i.date} · gravité {severities[i.severity].toLowerCase()}{i.estimate ? ` · estimé ${money(i.estimate)}` : ''}</p>
                  </div>
                  <button onClick={() => update({ issues: car.issues.filter((x) => x.id !== i.id) })} aria-label={`Supprimer ${i.title}`} className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"><Trash2 size={16} aria-hidden="true" /></button>
                </div>
                {i.description && <p className="mt-3 text-sm whitespace-pre-line">{i.description}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="text-xs text-muted">Statut
                    <select value={i.status} onChange={(e) => patch(i.id, { status: e.target.value, doneDate: e.target.value === 'done' ? isoDate() : null })} className={`${field} ml-2`}>
                      {Object.entries(statuses).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </label>
                  {i.status === 'done' && i.doneDate && <span className="text-xs text-up">résolu le {i.doneDate}</span>}
                </div>
              </Card>
            ))}
          </ul>
        )}
      </div>

      <Card>
        <CardTitle>Décrire un problème</CardTitle>
        <form onSubmit={add} className="grid gap-3">
          <label className="text-xs text-muted">Résumé<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Bruit au freinage à l’avant" className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Depuis quand, dans quelles conditions (à froid, en virage, à quelle vitesse), voyants allumés…" className={`${field} mt-1 block w-full resize-y`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-muted">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Coût estimé (€)<input inputMode="decimal" value={form.estimate} onChange={(e) => setForm({ ...form, estimate: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
          </div>
          <fieldset>
            <legend className="text-xs text-muted">Gravité</legend>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {Object.entries(severities).map(([k, l]) => (
                <button type="button" key={k} aria-pressed={form.severity === k} onClick={() => setForm({ ...form, severity: k })} className={`rounded-lg px-2 py-2 text-sm ${form.severity === k ? 'bg-night text-white' : 'bg-canvas'}`}>{l}</button>
              ))}
            </div>
          </fieldset>
          <button className={btnPrimary}><Plus size={14} aria-hidden="true" />Ajouter le problème</button>
        </form>
        <p className="mt-3 text-xs text-muted">Une fois réparé, passe le problème en « Résolu » et ajoute la facture dans l’onglet Coûts</p>
      </Card>
    </div>
  );
}

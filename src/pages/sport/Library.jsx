import { useState } from 'react';
import { Search, Plus, Check, Timer } from 'lucide-react';
import { Card } from '../../components/Card.jsx';
import { exercises, groups, equipments } from '../../sport.js';
import { field, chip, btnGhost } from '../../ui.js';

const levelDot = { Débutant: 'bg-up', Intermédiaire: 'bg-lime-ink', Avancé: 'bg-down' };

export default function Library({ inSession, onAdd }) {
  const [group, setGroup] = useState('Tous');
  const [equipment, setEquipment] = useState('');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const list = exercises.filter((e) =>
    (group === 'Tous' || e.group === group) &&
    (!equipment || e.equipment === equipment) &&
    `${e.name} ${e.muscles.join(' ')}`.toLowerCase().includes(q));

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-1" role="group" aria-label="Groupe musculaire">
        {['Tous', ...groups].map((g) => <button key={g} aria-pressed={group === g} onClick={() => setGroup(g)} className={chip(group === g)}>{g}</button>)}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted">
          Matériel
          <select value={equipment} onChange={(e) => setEquipment(e.target.value)} className={field}>
            <option value="">Tout</option>
            {equipments.map((e) => <option key={e}>{e}</option>)}
          </select>
        </label>
        <label className={`${field} ml-auto flex items-center gap-2 focus-within:outline-2 focus-within:outline-focus`}>
          <Search size={16} className="text-muted" aria-hidden="true" />
          <span className="sr-only">Rechercher un exercice ou un muscle</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Exercice ou muscle" className="w-44 bg-transparent outline-none" />
        </label>
        <span className="text-sm text-muted tabular-nums" role="status">{list.length} exercices</span>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted">Aucun exercice pour ces filtres</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((e) => {
            const added = inSession.includes(e.name);
            return (
              <Card as="li" key={e.name} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{e.name}</h3>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className={`size-2 rounded-full ${levelDot[e.level]}`} aria-hidden="true" />{e.level}</span>
                </div>
                <p className="mt-1 text-xs text-muted">{e.group} · {e.equipment}</p>
                <p className="mt-3 text-sm">{e.tip}</p>
                <ul className="mt-3 flex flex-wrap gap-1">{e.muscles.map((m) => <li key={m} className="rounded-md bg-canvas px-2 py-0.5 text-xs">{m}</li>)}</ul>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted tabular-nums"><Timer size={14} aria-hidden="true" />{e.sets} · repos {e.rest} s</span>
                  <button onClick={() => onAdd(e.name)} disabled={added} className={`${btnGhost} disabled:opacity-60`}>
                    {added ? <><Check size={14} aria-hidden="true" />Dans la séance</> : <><Plus size={14} aria-hidden="true" />Ajouter</>}
                  </button>
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </>
  );
}

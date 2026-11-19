import { useState } from 'react';
import { Search, ExternalLink, CirclePause } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { projects } from '../data.js';
import { ago, daysSince } from '../format.js';

const filters = ['Tout', 'Dofus', 'Web', 'Outils'];

function status(p) {
  if (!p.last) return { label: 'Hors git', dot: 'bg-line' };
  return daysSince(p.last) <= 30 ? { label: 'Actif', dot: 'bg-up' } : { label: 'En pause', dot: 'bg-muted' };
}

const sorters = {
  recent: (a, b) => (b.last ?? '').localeCompare(a.last ?? ''),
  commits: (a, b) => b.commits30 - a.commits30 || b.commits - a.commits,
  name: (a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }),
};

export default function Projects() {
  const [filter, setFilter] = useState('Tout');
  // `#/projets?q=OLIVIA` (lien depuis la palette Ctrl+K) préremplit la recherche.
  const [query, setQuery] = useState(() => new URLSearchParams(location.hash.split('?')[1]).get('q') ?? '');
  const [sort, setSort] = useState('recent');
  const q = query.trim().toLowerCase();
  const list = projects
    .filter((p) => (filter === 'Tout' || p.category === filter) && `${p.name} ${p.desc}`.toLowerCase().includes(q))
    .sort(sorters[sort]);
  const paused = projects.filter((p) => p.last && daysSince(p.last) > 180);
  const commits = projects.reduce((s, p) => s + p.commits30, 0);
  const max = Math.max(...projects.map((p) => p.commits30));

  return (
    <>
      <PageHeader title="Projets" subtitle={`${projects.length} projets · ${commits} commits sur 30 jours`} />

      {paused.length > 0 && (
        <p className="mb-4 flex items-center gap-3 rounded-xl bg-night px-5 py-3 text-sm text-white">
          <CirclePause size={18} className="shrink-0 text-lime" aria-hidden="true" />
          {paused.length} projets sans commit depuis plus de 6 mois : {paused.map((p) => p.name).join(', ')}
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Filtrer par catégorie" className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${filter === f ? 'bg-night text-white' : 'bg-surface text-muted hover:text-ink'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm text-muted">
          Trier
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-ink">
            <option value="recent">Plus récents</option>
            <option value="commits">Plus de commits</option>
            <option value="name">Nom</option>
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm focus-within:outline-2 focus-within:outline-focus">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <span className="sr-only">Rechercher un projet</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher" className="w-40 bg-transparent outline-none" />
        </label>
      </div>

      {list.length === 0 ? (
        <div role="status" className="rounded-xl bg-surface p-8 text-center text-sm text-muted">
          Aucun projet ne correspond à cette recherche
          <button onClick={() => { setQuery(''); setFilter('Tout'); }} className="mt-3 block w-full font-medium text-ink hover:underline">Tout afficher</button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => {
            const s = status(p);
            return (
              <Card as="li" key={p.name} delay={i * 0.03} className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="truncate text-sm font-semibold">{p.name}</h2>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted"><span className={`size-2 rounded-full ${s.dot}`} aria-hidden="true" />{s.label}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.desc}</p>
                <ul className="mt-3 flex flex-wrap gap-1">
                  {p.stack.map((t) => <li key={t} className="rounded-md bg-canvas px-2 py-0.5 text-xs">{t}</li>)}
                </ul>
                <div className="mt-auto pt-4">
                  <div className="flex justify-between text-xs text-muted">
                    <span>{p.last ? `Dernier commit ${ago(p.last)}` : 'Pas de dépôt git'}</span>
                    <span className="tabular-nums">{p.commits30} sur 30 j · {p.commits} au total</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-canvas" aria-hidden="true">
                    <div className="h-full rounded-full bg-data" style={{ width: `${(p.commits30 / max) * 100}%` }} />
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline">
                      Voir en ligne <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, FolderGit2, Wallet, ExternalLink, CornerDownLeft } from 'lucide-react';
import { navItems } from '../nav.js';
import { projects, portfolio } from '../data.js';
import { exercises } from '../sport.js';
import { rooms } from '../house/data.js';
import { Dumbbell, House } from 'lucide-react';

const entries = [
  ...navItems.map((n) => ({ group: 'Pages', label: n.label, icon: n.icon, href: n.href })),
  ...projects.map((p) => ({ group: 'Projets', label: p.name, hint: p.desc, icon: FolderGit2, href: `#/projets?q=${encodeURIComponent(p.name)}` })),
  ...projects.filter((p) => p.url).map((p) => ({ group: 'En ligne', label: `Ouvrir ${p.name}`, hint: p.url.replace('https://', ''), icon: ExternalLink, url: p.url })),
  ...portfolio.holdings.map((h) => ({ group: 'Portefeuille', label: `${h.ticker} · ${h.name}`, icon: Wallet, href: '#/portefeuille' })),
  ...exercises.map((e) => ({ group: 'Exercices', label: e.name, hint: e.muscles.join(', '), icon: Dumbbell, href: '#/sport' })),
  ...rooms.map((r) => ({ group: 'Maison', label: r.name, hint: `${(r.w * r.h) / 1e4} m²`, icon: House, href: '#/maison' })),
];

// Palette de commandes (Ctrl+K) : pattern combobox WAI-ARIA, input + listbox.
export default function CommandPalette({ open, onClose }) {
  const dialog = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const d = dialog.current;
    if (open && !d.open) { setQuery(''); setActive(0); d.showModal(); }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? entries.filter((e) => `${e.label} ${e.hint ?? ''}`.toLowerCase().includes(q)) : entries.filter((e) => e.group === 'Pages');
  }, [query]);

  const go = (e) => {
    onClose();
    if (e.url) window.open(e.url, '_blank', 'noopener');
    else location.hash = e.href;
  };

  const onKey = (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const step = ev.key === 'ArrowDown' ? 1 : -1;
      setActive((a) => (a + step + results.length) % Math.max(results.length, 1));
    } else if (ev.key === 'Enter' && results[active]) {
      go(results[active]);
    }
  };

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Recherche rapide"
      className="mx-auto mt-[12vh] w-[min(560px,calc(100vw-2rem))] rounded-xl bg-surface p-0 text-ink shadow-xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} className="shrink-0 text-muted" aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onKey}
          placeholder="Aller à une page, un projet, une ligne…"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `palette-${active}` : undefined}
          aria-label="Rechercher"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-muted">Échap</kbd>
      </div>
      <ul id="palette-list" role="listbox" aria-label="Résultats" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Aucun résultat</li>}
        {results.map((e, i) => {
          const Icon = e.icon;
          return (
            <li
              key={`${e.group}-${e.label}`}
              id={`palette-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(e)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${i === active ? 'bg-canvas' : ''}`}
            >
              <Icon size={16} className="shrink-0 text-muted" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{e.label}{e.hint && <span className="ml-2 text-xs text-muted">{e.hint}</span>}</span>
              <span className="shrink-0 text-xs text-muted">{e.group}</span>
              {i === active && <CornerDownLeft size={14} className="shrink-0 text-muted" aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}

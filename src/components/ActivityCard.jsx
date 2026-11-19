import { useRef, useState } from 'react';
import { Briefcase, Dumbbell, Wallet } from 'lucide-react';
import { Card, CardTitle } from './Card.jsx';
import { activity } from '../data.js';

const tabs = [
  { id: 'all', label: 'Tout' },
  { id: 'work', label: 'Boulot' },
  { id: 'sport', label: 'Sport' },
  { id: 'money', label: 'Bourse' },
];
const icons = { work: Briefcase, sport: Dumbbell, money: Wallet };

export default function ActivityCard() {
  const [tab, setTab] = useState('all');
  const refs = useRef([]);
  const items = tab === 'all' ? activity : activity.filter((a) => a.kind === tab);

  // Flèches gauche/droite entre onglets (pattern WAI-ARIA Tabs).
  const onKey = (e, i) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = (i + step + tabs.length) % tabs.length;
    setTab(tabs[next].id);
    refs.current[next].focus();
  };

  return (
    <Card delay={0.25} className="md:col-span-2 xl:col-span-1 xl:row-span-2">
      <CardTitle>Activité</CardTitle>
      <div role="tablist" aria-label="Filtrer l’activité" className="flex gap-1 border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="activity-panel"
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-px border-b-2 px-2 py-1.5 text-xs font-medium ${tab === t.id ? 'border-night text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul id="activity-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-3 space-y-2">
        {items.map((a) => {
          const Icon = icons[a.kind];
          return (
            <li key={a.title} className="flex gap-3 rounded-lg bg-canvas/60 p-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white"><Icon size={15} aria-hidden="true" /></span>
              <div className="min-w-0">
                <p className="text-sm leading-snug">{a.title}</p>
                <p className="text-xs text-muted">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

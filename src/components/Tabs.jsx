import { useRef } from 'react';

// Onglets WAI-ARIA : flèches gauche/droite, Début/Fin. Le panneau est rendu par le parent.
export default function Tabs({ tabs, value, onChange, label, id }) {
  const refs = useRef([]);
  const onKey = (e, i) => {
    const last = tabs.length - 1;
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => { refs.current[i] = el; }}
          role="tab"
          id={`${id}-tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`${id}-panel`}
          tabIndex={value === t.id ? 0 : -1}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
          className={`-mb-px shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${value === t.id ? 'border-data text-ink' : 'border-transparent text-muted hover:text-ink'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ id, value, children }) {
  return <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${value}`}>{children}</div>;
}

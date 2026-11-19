import { portfolio } from '../data.js';

// Une teinte par ligne, du plus gros poids au plus petit ; les lignes < 1 % sont regroupées.
const shades = ['bg-data', 'bg-data/60', 'bg-data/30'];

export default function AllocationBar() {
  const main = portfolio.holdings.filter((h) => h.share >= 1);
  const rest = portfolio.holdings.filter((h) => h.share < 1);
  const parts = [
    ...main.map((h, i) => ({ label: h.ticker, share: h.share, color: shades[i] ?? 'bg-line' })),
    ...(rest.length ? [{ label: rest.map((h) => h.ticker).join(' + '), share: rest.reduce((s, h) => s + h.share, 0), color: 'bg-line' }] : []),
  ];
  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {parts.map((p) => <span key={p.label} className={p.color} style={{ width: `${p.share}%`, minWidth: 4 }} />)}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${p.color}`} aria-hidden="true" />
            {p.label} <span className="tabular-nums">{p.share.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

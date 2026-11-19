import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardTitle } from './Card.jsx';
import { portfolio } from '../data.js';

const eur = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
const pct = (n) => `${n > 0 ? '+' : ''}${n.toLocaleString('fr-FR')} %`;

function Sparkline({ points }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const d = points.map((p, i) => `${(i / (points.length - 1)) * 100},${36 - ((p - min) / (max - min || 1)) * 32}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-4 h-24 w-full" aria-hidden="true">
      <polyline points={d} fill="none" stroke="var(--color-night)" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function PortfolioCard() {
  return (
    <Card delay={0.15}>
      <CardTitle aside={<span className="text-xs text-muted">via Revolut</span>}>Portefeuille</CardTitle>
      <p className="text-3xl font-semibold tabular-nums">{eur(portfolio.value)}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-up"><TrendingUp size={16} aria-hidden="true" /> {pct(portfolio.change)} sur 30 jours</p>
      <Sparkline points={portfolio.history} />
      <ul className="mt-3 divide-y divide-line">
        {portfolio.holdings.map((h) => {
          const Icon = h.change >= 0 ? TrendingUp : TrendingDown;
          return (
            <li key={h.ticker} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span className="min-w-0 truncate"><span className="font-semibold">{h.ticker}</span> <span className="text-xs text-muted">{h.name}</span></span>
              <span className="shrink-0 text-right tabular-nums">
                {eur(h.value)}
                <span className={`ml-2 inline-flex items-center gap-0.5 text-xs ${h.change >= 0 ? 'text-up' : 'text-down'}`}>
                  <Icon size={12} aria-hidden="true" />{pct(h.change)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

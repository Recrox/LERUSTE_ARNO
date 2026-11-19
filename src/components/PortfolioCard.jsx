import { ArrowRight } from 'lucide-react';
import { Card, CardTitle } from './Card.jsx';
import AllocationBar from './AllocationBar.jsx';
import { portfolio } from '../data.js';
import { money, signedEur, pct, tone } from '../format.js';

export default function PortfolioCard() {
  return (
    <Card delay={0.15}>
      <CardTitle aside={<span className="text-xs text-muted">Revolut · {portfolio.asOf}</span>}>Portefeuille</CardTitle>
      <p className="text-3xl font-semibold tabular-nums">{money(portfolio.value)}</p>
      <p className={`mt-1 text-sm tabular-nums ${tone(portfolio.pnl)}`}>
        {signedEur(portfolio.pnl)} ({pct(portfolio.pnlPct)}) depuis l’achat
      </p>
      <div className="mt-4"><AllocationBar /></div>
      <ul className="mt-3 divide-y divide-line">
        {portfolio.holdings.map((h) => (
          <li key={h.ticker} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="min-w-0 truncate"><span className="font-semibold">{h.ticker}</span> <span className="text-xs text-muted">{h.name}</span></span>
            <span className="shrink-0 text-right tabular-nums">
              {money(h.value)}
              <span className={`ml-2 text-xs ${tone(h.pnlPct)}`}>{pct(h.pnlPct)}</span>
            </span>
          </li>
        ))}
      </ul>
      <a href="#/portefeuille" className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline">
        Voir le détail <ArrowRight size={16} aria-hidden="true" />
      </a>
    </Card>
  );
}

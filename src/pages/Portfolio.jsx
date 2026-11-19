import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import AllocationBar from '../components/AllocationBar.jsx';
import { portfolio } from '../data.js';
import { money, signedEur, pct, tone } from '../format.js';

const qty = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 8 });

// key = champ trié ; null = colonne non triable.
const columns = [
  { label: 'Actif', key: 'name', align: 'left' },
  { label: 'Type', key: null, align: 'left' },
  { label: 'Quantité', key: null },
  { label: 'Prix moyen', key: null },
  { label: 'Cours', key: null },
  { label: 'Valeur', key: 'value' },
  { label: 'Plus ou moins-value', key: 'pnl' },
  { label: 'Jour', key: 'day' },
  { label: 'Poids', key: 'share' },
];

export default function Portfolio() {
  const [sort, setSort] = useState({ key: 'value', dir: -1 });
  const rows = [...portfolio.holdings].sort((a, b) =>
    sort.dir * (typeof a[sort.key] === 'string' ? a[sort.key].localeCompare(b[sort.key], 'fr') : a[sort.key] - b[sort.key]));
  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : key === 'name' ? 1 : -1 }));

  return (
    <>
      <PageHeader title="Portefeuille" subtitle={`Compte de courtage Revolut · relevé du ${portfolio.asOf}`} />

      <Card className="mb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Valeur totale</p>
            <p className="text-4xl font-semibold tabular-nums">{money(portfolio.value)}</p>
            <p className={`mt-1 text-sm tabular-nums ${tone(portfolio.pnl)}`}>{signedEur(portfolio.pnl)} ({pct(portfolio.pnlPct)}) depuis l’achat</p>
          </div>
          <p className="text-sm text-muted">Espèces disponibles <span className="font-semibold text-ink tabular-nums">{money(portfolio.cash)}</span></p>
        </div>
        <div className="mt-5"><AllocationBar /></div>
      </Card>

      <Card delay={0.1} className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <caption className="sr-only">Lignes du portefeuille, triables par colonne</caption>
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              {columns.map((c) => {
                const active = sort.key === c.key;
                const Arrow = sort.dir === 1 ? ArrowUp : ArrowDown;
                return (
                  <th key={c.label} scope="col" aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined} className={`pb-2 font-medium ${c.align === 'left' ? 'text-left' : 'text-right'}`}>
                    {c.key ? (
                      <button onClick={() => sortBy(c.key)} className={`inline-flex items-center gap-1 hover:text-ink ${active ? 'text-ink' : ''}`}>
                        {c.label}{active && <Arrow size={12} aria-hidden="true" />}
                      </button>
                    ) : c.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line tabular-nums">
            {rows.map((h) => (
              <tr key={h.ticker} className="transition-colors hover:bg-canvas/60">
                <th scope="row" className="py-3 text-left font-normal"><span className="font-semibold">{h.name}</span> <span className="text-xs text-muted">{h.ticker}</span></th>
                <td className="py-3 text-muted">{h.type}</td>
                <td className="py-3 text-right">{qty(h.qty)}</td>
                <td className="py-3 text-right">{money(h.avg, h.currency)}</td>
                <td className="py-3 text-right">{money(h.price, h.currency)}</td>
                <td className="py-3 text-right font-semibold">{money(h.value)}</td>
                <td className={`py-3 text-right ${tone(h.pnl)}`}>{signedEur(h.pnl)} <span className="text-xs">{pct(h.pnlPct)}</span></td>
                <td className={`py-3 text-right ${tone(h.day)}`}>{pct(h.day)}</td>
                <td className="py-3 text-right">{h.share.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-3 px-1 text-xs text-muted">Valeurs en euros ; prix des actions US en dollars. Données recopiées depuis Revolut, pas de synchronisation automatique</p>
    </>
  );
}

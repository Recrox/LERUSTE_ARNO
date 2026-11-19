import { Card, CardTitle } from '../../components/Card.jsx';
import { monthSummary, lastMonths } from '../../money/ledger.js';
import { money } from '../../format.js';
import { field, btnPrimary } from '../../ui.js';

const label = (m) => new Date(`${m}-01T00:00`).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });

export default function Overview({ txs, month, setMonth, goTransactions }) {
  const s = monthSummary(txs, month);
  const months = lastMonths(month, 6).map((m) => ({ m, ...monthSummary(txs, m) }));
  const max = Math.max(1, ...months.flatMap((x) => [x.income, x.expense]));
  const top = s.byCategory[0]?.[1] ?? 1;

  if (!txs.length) {
    return (
      <Card className="text-center">
        <p className="text-sm font-medium">Aucune opération pour l’instant</p>
        <p className="mt-1 text-sm text-muted">Importe ton relevé Revolut en CSV ou ajoute tes revenus et dépenses à la main</p>
        <button onClick={goTransactions} className={`${btnPrimary} mt-4`}>Ajouter des opérations</button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted" htmlFor="month">Mois</label>
        <input id="month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={field} />
      </div>
      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ['Revenus', money(s.income), 'text-up'], ['Dépenses', money(s.expense), ''],
          ['Solde du mois', money(s.net), s.net < 0 ? 'text-down' : 'text-up'], ['Taux d’épargne', `${Math.round(s.savingsRate * 100)} %`, s.savingsRate < 0.1 ? 'text-down' : ''],
        ].map(([k, v, tone]) => <Card as="div" key={k}><dt className="text-xs text-muted">{k}</dt><dd className={`mt-1 text-2xl font-semibold tabular-nums ${tone}`}>{v}</dd></Card>)}
      </dl>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardTitle aside={<span className="flex gap-3 text-xs text-muted"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-up" />Revenus</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-data" />Dépenses</span></span>}>6 derniers mois</CardTitle>
          <ol className="flex h-56 items-end gap-4 border-b border-line">
            {months.map((x) => (
              <li key={x.m} className="flex h-full flex-1 flex-col justify-end">
                <div className="flex flex-1 items-end gap-1">
                  <span className="flex-1 rounded-t-md bg-up/80" style={{ height: `${(x.income / max) * 100}%` }} title={`Revenus ${money(x.income)}`} />
                  <span className="flex-1 rounded-t-md bg-data" style={{ height: `${(x.expense / max) * 100}%` }} title={`Dépenses ${money(x.expense)}`} />
                </div>
                <span className={`mt-1 text-center text-xs ${x.m === month ? 'font-semibold text-ink' : 'text-muted'}`}>{label(x.m)}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card>
          <CardTitle>Où part l’argent</CardTitle>
          {s.byCategory.length === 0 ? <p className="text-sm text-muted">Aucune dépense ce mois-ci</p> : (
            <ul className="space-y-3">
              {s.byCategory.map(([cat, v]) => (
                <li key={cat}>
                  <div className="flex justify-between text-sm"><span>{cat}</span><span className="tabular-nums">{money(v)} <span className="text-xs text-muted">{Math.round((v / s.expense) * 100)} %</span></span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-canvas" aria-hidden="true"><div className="h-full rounded-full bg-data" style={{ width: `${(v / top) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

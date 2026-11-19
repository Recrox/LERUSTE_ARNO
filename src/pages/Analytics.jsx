import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { commitsByDay, projects, portfolio, today } from '../data.js';
import { money, signedEur, pct, tone, daysSince } from '../format.js';

// 30 derniers jours, aujourd'hui inclus, jours sans commit à 0.
const days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - 29 + i);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { iso, label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), n: commitsByDay[iso] ?? 0 };
});

function BarList({ rows, format }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between text-sm"><span className="truncate">{r.label}</span><span className="tabular-nums text-muted">{format(r.value)}</span></div>
          <div className="mt-1 h-1.5 rounded-full bg-canvas" aria-hidden="true"><div className="h-full rounded-full bg-data" style={{ width: `${(r.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export default function Analytics() {
  const total = days.reduce((s, d) => s + d.n, 0);
  const peak = days.reduce((a, b) => (b.n > a.n ? b : a));
  const active = projects.filter((p) => p.last && daysSince(p.last) <= 30).length;
  const stats = [
    { label: 'Commits, 30 jours', value: total, note: `${(total / 30).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} par jour en moyenne` },
    { label: 'Projets actifs', value: active, note: `sur ${projects.length} projets` },
    { label: 'Portefeuille', value: money(portfolio.value), note: `relevé du ${portfolio.asOf}` },
    { label: 'Plus-value latente', value: signedEur(portfolio.pnl), note: `${pct(portfolio.pnlPct)} depuis l’achat`, tone: tone(portfolio.pnl) },
  ];

  return (
    <>
      <PageHeader title="Analytics" subtitle="Ton activité de dev et ton portefeuille, en chiffres réels" />
      <dl className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Card as="div" key={s.label} delay={i * 0.04}>
            <dt className="text-xs text-muted">{s.label}</dt>
            <dd className={`mt-1 text-2xl font-semibold tabular-nums ${s.tone ?? ''}`}>{s.value}</dd>
            <dd className="mt-1 text-xs text-muted">{s.note}</dd>
          </Card>
        ))}
      </dl>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card delay={0.1}>
          <CardTitle aside={<span className="text-xs text-muted">Pic : {peak.n} commits le {peak.label}</span>}>Commits par jour, tous projets</CardTitle>
          <p className="sr-only">{total} commits sur les 30 derniers jours, avec un pic de {peak.n} le {peak.label}.</p>
          <div className="relative h-56 border-b border-line" aria-hidden="true">
            {[1, 0.5].map((f) => (
              <div key={f} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${f * 100}%` }}>
                <span className="absolute -top-2 right-0 bg-surface pl-1 font-mono text-[11px] text-muted">{Math.round(peak.n * f)}</span>
              </div>
            ))}
            <ol className="absolute inset-0 flex items-end gap-1 pr-8">
              {days.map((d) => (
                <li key={d.iso} title={`${d.label} : ${d.n} commit${d.n > 1 ? 's' : ''}`} className={`flex-1 rounded-t-sm ${d === peak ? 'bg-data' : 'bg-data/35'}`} style={{ height: `${(d.n / peak.n) * 100}%` }} />
              ))}
            </ol>
          </div>
          <div className="mt-2 flex justify-between pr-8 font-mono text-[11px] text-muted" aria-hidden="true">
            <span>{days[0].label}</span><span>{days[15].label}</span><span>{days[29].label}</span>
          </div>
        </Card>

        <Card delay={0.15}>
          <CardTitle>Répartition du portefeuille</CardTitle>
          <BarList rows={portfolio.holdings.map((h) => ({ label: `${h.ticker} · ${h.name}`, value: h.share }))} format={(v) => `${v.toLocaleString('fr-FR')} %`} />
        </Card>

        <Card delay={0.2}>
          <CardTitle>Commits par projet, 30 jours</CardTitle>
          <BarList rows={projects.filter((p) => p.commits30 > 0).sort((a, b) => b.commits30 - a.commits30).map((p) => ({ label: p.name, value: p.commits30 }))} format={(v) => v} />
        </Card>

        <Card delay={0.25}>
          <CardTitle>Plus et moins-values par ligne</CardTitle>
          <ul className="divide-y divide-line">
            {portfolio.holdings.map((h) => (
              <li key={h.ticker} className="flex justify-between py-2 text-sm">
                <span className="font-semibold">{h.ticker}</span>
                <span className={`tabular-nums ${tone(h.pnl)}`}>{signedEur(h.pnl)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

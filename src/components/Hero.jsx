import { Card } from './Card.jsx';
import { training, work, portfolio } from '../data.js';
import { pct } from '../format.js';

export default function Hero() {
  const km = training.runs.reduce((s, r) => s + r.km, 0);
  const stats = [
    { value: training.lifts.length, label: 'séances muscu' },
    { value: `${km.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km`, label: 'courus' },
    { value: `${work.done}/${work.total}`, label: 'tickets du sprint' },
    { value: pct(portfolio.pnlPct), label: 'portefeuille, depuis l’achat' },
  ];
  return (
    <Card dark className="md:col-span-2">
      <p className="text-xs font-medium text-lime">Aujourd’hui, jeudi 19</p>
      <h1 className="mt-1 text-2xl font-medium leading-tight sm:text-3xl">
        Semaine 47 <span className="text-white/50">· 16–22 novembre</span>
      </h1>
      <p className="mt-2 max-w-md text-sm text-white/70">
        Séance jambes prévue ce soir et 3 reviews t’attendent chez BizzDev
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-night-2 px-3 py-2">
            <dt className="text-xs text-white/60">{s.label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

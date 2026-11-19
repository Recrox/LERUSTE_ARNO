import { useState } from 'react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { clock, parseClock, riegel, runSessions } from '../../sport.js';
import { training } from '../../data.js';
import { field } from '../../ui.js';

const races = [['5 km', 5], ['10 km', 10], ['Semi-marathon', 21.0975], ['Marathon', 42.195]];

export default function Running() {
  const [goal, setGoal] = useState('50:00');
  const [dist, setDist] = useState('10');
  const [time, setTime] = useState(training.goal.best);

  const goalSec = parseClock(goal);
  const d = Number(String(dist).replace(',', '.'));
  const t = parseClock(time);
  const valid = Number.isFinite(t) && t > 0 && d > 0;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="xl:col-span-2">
        <CardTitle aside={
          <label className="flex items-center gap-2 text-xs text-muted">Objectif 10 km
            <input value={goal} onChange={(e) => setGoal(e.target.value)} className={`${field} w-24 font-mono`} aria-describedby="goal-hint" />
          </label>
        }>Séances calées sur ton objectif</CardTitle>
        <p id="goal-hint" className="mb-3 text-xs text-muted">
          {Number.isFinite(goalSec) && goalSec > 0 ? `Allure cible ${clock(goalSec / 10)} /km, soit ${(36000 / goalSec).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km/h` : 'Format attendu : mm:ss, par exemple 50:00'}
        </p>
        {Number.isFinite(goalSec) && goalSec > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {runSessions(goalSec / 10).map((s) => (
              <li key={s.name} className="rounded-lg bg-canvas p-4">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="mt-1 text-sm">{s.what}</p>
                <p className="mt-2 font-mono text-sm tabular-nums">{s.pace}</p>
                <p className="mt-1 text-xs text-muted">{s.why}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardTitle>Calculateur d’allure</CardTitle>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">Distance (km)<input inputMode="decimal" value={dist} onChange={(e) => setDist(e.target.value)} className={`${field} mt-1 block w-28`} /></label>
          <label className="text-xs text-muted">Temps (h:mm:ss)<input value={time} onChange={(e) => setTime(e.target.value)} className={`${field} mt-1 block w-32 font-mono`} /></label>
        </div>
        {valid ? (
          <dl className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">Allure</dt><dd className="font-mono text-xl tabular-nums">{clock(t / d)} /km</dd></div>
            <div className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">Vitesse</dt><dd className="font-mono text-xl tabular-nums">{(d / (t / 3600)).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km/h</dd></div>
          </dl>
        ) : <p className="mt-4 text-sm text-down">Saisis une distance et un temps valides</p>}
      </Card>

      <Card>
        <CardTitle aside={<span className="text-xs text-muted">Formule de Riegel</span>}>Prédictions à partir de ce temps</CardTitle>
        {valid ? (
          <ul className="divide-y divide-line">
            {races.map(([name, km]) => {
              const pred = riegel(t, d, km);
              return (
                <li key={name} className="flex justify-between py-2 text-sm">
                  <span>{name}</span>
                  <span className="font-mono tabular-nums">{clock(pred)} <span className="text-xs text-muted">{clock(pred / km)} /km</span></span>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-sm text-muted">En attente d’un temps valide</p>}
      </Card>
    </div>
  );
}

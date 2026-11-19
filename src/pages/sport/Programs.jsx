import { useState } from 'react';
import { Play, CalendarDays } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import ExercisePicto from '../../components/ExercisePicto.jsx';
import { exercises } from '../../sport.js';
import { splits } from '../../training.js';
import { chip, btnPrimary } from '../../ui.js';

const byName = Object.fromEntries(exercises.map((e) => [e.name, e]));

export default function Programs({ onLoad }) {
  const [id, setId] = useState('ppl');
  const split = splits.find((s) => s.id === id);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-1" role="group" aria-label="Programme">
        {splits.map((s) => <button key={s.id} aria-pressed={id === s.id} onClick={() => setId(s.id)} className={chip(id === s.id)}>{s.name}</button>)}
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <h2 className="text-lg font-semibold">{split.name}</h2>
            <p className="mt-1 text-sm">{split.pitch}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><CalendarDays size={14} aria-hidden="true" />{split.week}</p>
          </div>
          <dl className="flex gap-3 text-sm">
            <div className="rounded-lg bg-canvas px-3 py-2"><dt className="text-xs text-muted">Fréquence</dt><dd className="font-semibold">{split.freq}</dd></div>
            <div className="rounded-lg bg-canvas px-3 py-2"><dt className="text-xs text-muted">Niveau</dt><dd className="font-semibold">{split.level}</dd></div>
          </dl>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {split.days.map((d) => (
          <Card key={d.name}>
            <CardTitle aside={<button onClick={() => onLoad(d)} className={btnPrimary}><Play size={14} aria-hidden="true" />Faire cette séance</button>}>
              {d.name} <span className="ml-1 text-xs font-normal text-muted">{d.items.length} exercices · {d.items.reduce((s, x) => s + x.sets, 0)} séries</span>
            </CardTitle>
            <ol className="divide-y divide-line">
              {d.items.map((x, i) => (
                <li key={x.name} className="flex items-center gap-3 py-2">
                  <span className="w-4 text-xs text-muted tabular-nums">{i + 1}</span>
                  <ExercisePicto exercise={byName[x.name]} className="h-16 w-16 shrink-0 rounded-md bg-canvas p-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{x.name}</p>
                    <p className="text-xs text-muted">{x.intensity} · tempo <span className="font-mono">{x.tempo}</span> · repos {x.rest} s</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">{x.sets} × {x.reps}</span>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </>
  );
}

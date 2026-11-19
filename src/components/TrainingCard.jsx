import { motion } from 'framer-motion';
import { Dumbbell, Footprints, Trophy } from 'lucide-react';
import { Card, CardTitle } from './Card.jsx';
import { training } from '../data.js';

const fmt = (n) => n.toLocaleString('fr-FR');

export default function TrainingCard() {
  const max = Math.max(...training.lifts.map((l) => l.kg));
  const { goal } = training;
  return (
    <Card delay={0.1} className="md:col-span-2">
      <CardTitle aside={<span className="flex items-center gap-1 text-xs text-muted"><Trophy size={14} aria-hidden="true" /> Records</span>}>Entraînement</CardTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs text-muted"><Dumbbell size={14} aria-hidden="true" /> Volume par séance</p>
          <ul className="mt-3 flex h-32 items-end gap-3">
            {training.lifts.map((l, i) => (
              <li key={l.label} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] tabular-nums text-muted">{fmt(l.kg)} kg</span>
                <motion.span
                  style={{ height: `${(l.kg / max) * 80}px` }}
                  className={`w-full origin-bottom rounded-md ${i === training.lifts.length - 1 ? 'bg-data' : 'bg-line'}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                />
                <span className="text-xs">{l.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="divide-y divide-line">
          {training.prs.map((p) => (
            <li key={p.lift} className="flex items-center justify-between py-2 text-sm">
              <span>{p.lift}</span>
              <span className="font-semibold tabular-nums">
                {p.value} <span className="text-xs font-normal text-muted">{p.delta === '=' ? 'stable' : `${p.delta} kg`}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 rounded-lg bg-lime/40 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium"><Footprints size={16} aria-hidden="true" /> Objectif : {goal.label}</span>
          <span className="text-xs text-ink/70">record {goal.best}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-surface" role="progressbar" aria-label="Progression vers l’objectif course" aria-valuenow={Math.round(goal.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full origin-left rounded-full bg-ink" style={{ width: `${goal.progress * 100}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        </div>
      </div>
    </Card>
  );
}

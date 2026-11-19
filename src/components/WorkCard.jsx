import { motion } from 'framer-motion';
import { GitPullRequest } from 'lucide-react';
import { Card, CardTitle } from './Card.jsx';
import { work } from '../data.js';

export default function WorkCard() {
  const pct = work.done / work.total;
  return (
    <Card delay={0.05}>
      <CardTitle aside={<span className="rounded-full bg-canvas px-2 py-0.5 text-xs text-muted">{work.sprint}</span>}>BizzDev</CardTitle>
      <ul className="grid grid-cols-4 gap-2">
        {work.team.map((m) => (
          <li key={m.name} className="text-center">
            <span className="relative mx-auto grid size-11 place-items-center rounded-full bg-canvas text-xs font-semibold">
              {m.initials}
              {m.online && <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-up" title="En ligne" />}
            </span>
            <p className="mt-1 text-xs font-medium">{m.name}</p>
            <p className="text-[11px] text-muted">{m.role}</p>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <div className="flex justify-between text-xs text-muted">
          <span>Avancement du sprint</span>
          <span className="tabular-nums">{Math.round(pct * 100)} %</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-canvas" role="progressbar" aria-label="Avancement du sprint" aria-valuenow={Math.round(pct * 100)} aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full origin-left rounded-full bg-night" style={{ width: `${pct * 100}%` }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
      </div>
      <a href="#" className="mt-4 flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-sm font-medium hover:bg-line">
        <GitPullRequest size={16} aria-hidden="true" /> {work.reviews} reviews en attente
      </a>
    </Card>
  );
}

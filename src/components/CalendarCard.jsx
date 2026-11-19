import { Card, CardTitle } from './Card.jsx';
import { week, today } from '../data.js';

const dot = { muscu: 'bg-data', course: 'bg-lime-ink', bourse: 'bg-up' };
const label = { muscu: 'Musculation', course: 'Course', bourse: 'Bourse' };

export default function CalendarCard() {
  return (
    <Card delay={0.2}>
      <CardTitle>Novembre 2026</CardTitle>
      <ol className="grid grid-cols-7 gap-1 text-center">
        {week.map((d) => {
          const isToday = d.date === today.getDate();
          return (
            <li key={d.date} aria-current={isToday ? 'date' : undefined} className={`rounded-lg py-2 ${isToday ? 'bg-night text-white' : ''}`}>
              <span className={`block text-[11px] ${isToday ? 'text-white/70' : 'text-muted'}`}>{d.day}</span>
              <span className="block text-sm font-semibold">{d.date}</span>
              <span className="mt-1 flex h-1.5 justify-center gap-0.5" aria-hidden="true">
                {d.events.map((e) => <span key={e} className={`size-1.5 rounded-full ${dot[e]}`} />)}
              </span>
              <span className="sr-only">{d.events.map((e) => label[e]).join(', ') || 'Repos'}</span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
        {Object.keys(dot).map((k) => (
          <li key={k} className="flex items-center gap-1.5"><span className={`size-2 rounded-full ${dot[k]}`} aria-hidden="true" />{label[k]}</li>
        ))}
      </ul>
    </Card>
  );
}

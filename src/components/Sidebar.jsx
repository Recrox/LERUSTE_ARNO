import { LayoutGrid, Briefcase, Dumbbell, Footprints, Wallet, CalendarDays, Settings } from 'lucide-react';

const items = [
  { icon: LayoutGrid, label: 'Vue d’ensemble', active: true },
  { icon: Briefcase, label: 'BizzDev' },
  { icon: Dumbbell, label: 'Musculation' },
  { icon: Footprints, label: 'Course' },
  { icon: Wallet, label: 'Portefeuille' },
  { icon: CalendarDays, label: 'Agenda' },
];

export default function Sidebar() {
  return (
    <nav aria-label="Navigation principale" className="flex items-center gap-1 rounded-xl bg-night p-2 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:flex-col lg:py-4">
      <span className="mr-2 grid size-10 shrink-0 place-items-center rounded-lg bg-lime text-sm font-bold text-night lg:mr-0 lg:mb-4" aria-hidden="true">AL</span>
      <ul className="flex min-w-0 gap-1 overflow-x-auto lg:flex-col">
        {items.map(({ icon: Icon, label, active }) => (
          <li key={label}>
            <a
              href="#"
              aria-label={label}
              title={label}
              aria-current={active ? 'page' : undefined}
              className={`grid size-10 place-items-center rounded-lg transition-colors ${active ? 'bg-white text-night' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon size={18} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <a href="#" aria-label="Réglages" title="Réglages" className="ml-auto grid size-10 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:mt-auto lg:ml-0">
        <Settings size={18} aria-hidden="true" />
      </a>
    </nav>
  );
}

import { useState } from 'react';
import { Search, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { navItems } from '../nav.js';
import { load, save, isDark, toggleTheme } from '../prefs.js';
import InstallButton from './InstallButton.jsx';

const row = 'flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition-colors';
const idle = 'text-white/65 hover:bg-white/10 hover:text-white';

// Libellé : visible quand le menu est déplié sur grand écran, sinon lu par les lecteurs d'écran
// et affiché en infobulle au survol ou au focus.
function Label({ open, children }) {
  return (
    <>
      <span className={open ? 'sr-only lg:not-sr-only lg:truncate' : 'sr-only'}>{children}</span>
      {!open && (
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-14 z-20 hidden -translate-y-1/2 rounded-md bg-ink px-2 py-1 text-xs whitespace-nowrap text-canvas opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 lg:block">
          {children}
        </span>
      )}
    </>
  );
}

export default function Sidebar({ current, onSearch }) {
  const [open, setOpen] = useState(() => load('sidebar') !== 'closed');
  const [dark, setDark] = useState(isDark);
  const toggleOpen = () => { save('sidebar', open ? 'closed' : 'open'); setOpen(!open); };

  return (
    <nav
      aria-label="Navigation principale"
      className={`hidden items-center gap-1 rounded-xl bg-night p-2 text-white lg:sticky lg:flex lg:top-4 lg:h-[calc(100vh-2rem)] lg:shrink-0 lg:flex-col lg:items-stretch lg:py-4 ${open ? 'lg:w-56' : 'lg:w-14'}`}
    >
      <a href="#/" className="mr-1 flex shrink-0 items-center gap-3 rounded-lg lg:mr-0 lg:mb-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-lime text-sm font-bold text-night" aria-hidden="true">AL</span>
        <span className={open ? 'sr-only lg:not-sr-only lg:text-sm lg:font-semibold' : 'sr-only'}>Arno Leruste</span>
      </a>

      <ul className="flex min-w-0 gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === current;
          return (
            <li key={href} className="group relative">
              <a href={href} aria-current={active ? 'page' : undefined} className={`${row} ${active ? 'bg-white text-night' : idle}`}>
                <Icon size={18} className="shrink-0" aria-hidden="true" />
                <Label open={open}>{label}</Label>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="ml-auto flex gap-1 lg:mt-auto lg:ml-0 lg:flex-col">
        <div className="group relative">
          <InstallButton className={`${row} w-full ${idle}`} labelClass={open ? '' : 'sr-only'} />
        </div>
        <div className="group relative">
          <button onClick={onSearch} className={`${row} w-full ${idle}`} aria-keyshortcuts="Control+K">
            <Search size={18} className="shrink-0" aria-hidden="true" />
            <Label open={open}>Rechercher</Label>
            {open && <kbd className="ml-auto hidden rounded border border-white/20 px-1.5 font-mono text-[11px] text-white/60 lg:inline">Ctrl K</kbd>}
          </button>
        </div>
        <div className="group relative">
          <button onClick={() => setDark(toggleTheme())} className={`${row} w-full ${idle}`}>
            {dark ? <Sun size={18} className="shrink-0" aria-hidden="true" /> : <Moon size={18} className="shrink-0" aria-hidden="true" />}
            <Label open={open}>{dark ? 'Thème clair' : 'Thème sombre'}</Label>
          </button>
        </div>
        <div className="group relative hidden lg:block">
          <button onClick={toggleOpen} aria-expanded={open} className={`${row} w-full ${idle}`}>
            {open ? <PanelLeftClose size={18} className="shrink-0" aria-hidden="true" /> : <PanelLeftOpen size={18} className="shrink-0" aria-hidden="true" />}
            <Label open={open}>{open ? 'Replier le menu' : 'Déplier le menu'}</Label>
          </button>
        </div>
      </div>
    </nav>
  );
}

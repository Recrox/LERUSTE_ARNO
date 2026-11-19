import { useEffect, useRef, useState } from 'react';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { navItems } from '../nav.js';
import { isDark, toggleTheme } from '../prefs.js';
import InstallButton from './InstallButton.jsx';

// Pages les plus utilisées au téléphone, dans la barre du bas ; le reste est dans le menu.
const tabs = ['#/', '#/sport', '#/sante', '#/compta'];

export default function MobileNav({ current, onSearch }) {
  const sheet = useRef(null);
  const [dark, setDark] = useState(isDark);
  const page = navItems.find((n) => n.href === current);

  // Ferme le menu quand on change de page.
  useEffect(() => { sheet.current?.close(); }, [current]);

  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 -mt-4 mb-1 flex items-center gap-3 bg-canvas/90 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur lg:hidden">
        <a href="#/" aria-label="Accueil" className="grid size-9 shrink-0 place-items-center rounded-lg bg-lime text-xs font-bold text-night">AL</a>
        <p className="min-w-0 flex-1 truncate text-base font-semibold">{page?.label}</p>
        <button onClick={onSearch} aria-label="Rechercher" className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface hover:text-ink"><Search size={20} aria-hidden="true" /></button>
      </header>

      <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {tabs.map((href) => {
            const { icon: Icon, label } = navItems.find((n) => n.href === href);
            const active = href === current;
            return (
              <li key={href}>
                <a href={href} aria-current={active ? 'page' : undefined} className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? 'text-data' : 'text-muted'}`}>
                  <Icon size={22} aria-hidden="true" />{label === 'Vue d’ensemble' ? 'Accueil' : label}
                </a>
              </li>
            );
          })}
          <li>
            <button onClick={() => sheet.current.showModal()} aria-haspopup="dialog" className={`flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium ${tabs.includes(current) ? 'text-muted' : 'text-data'}`}>
              <Menu size={22} aria-hidden="true" />Menu
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheet}
        aria-label="Toutes les pages"
        onClick={(e) => e.target === sheet.current && sheet.current.close()}
        className="mt-auto mb-0 w-full max-w-none rounded-t-2xl bg-surface p-0 text-ink"
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <p className="text-base font-semibold">Toutes les pages</p>
          <button onClick={() => sheet.current.close()} aria-label="Fermer le menu" className="grid size-10 place-items-center rounded-lg text-muted hover:bg-canvas"><X size={20} aria-hidden="true" /></button>
        </div>
        <ul className="grid grid-cols-2 gap-2 px-4">
          {navItems.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <a href={href} aria-current={href === current ? 'page' : undefined} className={`flex h-14 items-center gap-3 rounded-xl px-4 text-sm font-medium ${href === current ? 'bg-night text-white' : 'bg-canvas'}`}>
                <Icon size={20} className="shrink-0" aria-hidden="true" /><span className="truncate">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button onClick={() => setDark(toggleTheme())} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-canvas text-sm font-medium">
            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}{dark ? 'Thème clair' : 'Thème sombre'}
          </button>
          <InstallButton className="flex h-12 items-center justify-center gap-2 rounded-xl bg-lime text-sm font-semibold text-night" />
        </div>
      </dialog>
    </>
  );
}

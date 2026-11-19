import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import MobileNav from './components/MobileNav.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Overview from './pages/Overview.jsx';
import Projects from './pages/Projects.jsx';
import Analytics from './pages/Analytics.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Roles from './pages/Roles.jsx';
import Sport from './pages/Sport.jsx';
import House from './pages/House.jsx';
import Goals from './pages/Goals.jsx';
import Health from './pages/Health.jsx';
import Money from './pages/Money.jsx';
import Cars from './pages/Cars.jsx';
import { navItems } from './nav.js';

// Routage par hash : aucun routeur à installer et ça marche tel quel sur un hébergement statique.
const pages = {
  '#/projets': Projects, '#/sport': Sport, '#/sante': Health, '#/maison': House, '#/compta': Money, '#/voitures': Cars, '#/objectifs': Goals,
  '#/analytics': Analytics, '#/portefeuille': Portfolio, '#/roles': Roles,
};

export default function App() {
  const [hash, setHash] = useState(location.hash);
  const [palette, setPalette] = useState(false);
  const route = pages[hash.split('?')[0]] ? hash.split('?')[0] : '#/';
  const Page = pages[route] ?? Overview;

  useEffect(() => {
    const onChange = () => { setHash(location.hash); window.scrollTo(0, 0); };
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
    };
    addEventListener('hashchange', onChange);
    addEventListener('keydown', onKey);
    return () => { removeEventListener('hashchange', onChange); removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.title = `${navItems.find((n) => n.href === route).label} · Arno`;
  }, [route]);

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] lg:flex-row">
      <Sidebar current={route} onSearch={() => setPalette(true)} />
      <MobileNav current={route} onSearch={() => setPalette(true)} />
      <main key={hash} className="w-full max-w-[1600px] min-w-0 flex-1 pb-24 lg:pb-0">
        <Page />
      </main>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}

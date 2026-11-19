import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Library from './sport/Library.jsx';
import Session from './sport/Session.jsx';
import Running from './sport/Running.jsx';
import Tools from './sport/Tools.jsx';
import usePersisted from '../usePersisted.js';
import { exercises } from '../sport.js';

export default function Sport() {
  const [tab, setTab] = useState('library');
  const [session, setSession] = usePersisted('sport-session', []);
  const add = (name) => setSession((s) => [...s, { name, sets: [0, 1, 2].map(() => ({ kg: '', reps: '', done: false })) }]);

  const tabs = [
    { id: 'library', label: `Exercices (${exercises.length})` },
    { id: 'session', label: `Ma séance${session.length ? ` (${session.length})` : ''}` },
    { id: 'running', label: 'Course' },
    { id: 'tools', label: 'Outils' },
  ];

  return (
    <>
      <PageHeader title="Sport" subtitle="Musculation, course et outils. Ta séance est sauvegardée dans ce navigateur" />
      <Tabs id="sport" label="Sections sport" tabs={tabs} value={tab} onChange={setTab} />
      <TabPanel id="sport" value={tab}>
        {tab === 'library' && <Library inSession={session.map((s) => s.name)} onAdd={add} />}
        {tab === 'session' && <Session session={session} setSession={setSession} goLibrary={() => setTab('library')} />}
        {tab === 'running' && <Running />}
        {tab === 'tools' && <Tools />}
      </TabPanel>
    </>
  );
}

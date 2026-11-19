import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Library from './sport/Library.jsx';
import Programs from './sport/Programs.jsx';
import Session from './sport/Session.jsx';
import Guide from './sport/Guide.jsx';
import Running from './sport/Running.jsx';
import usePersisted from '../usePersisted.js';
import { exercises } from '../sport.js';

const blankSets = (n) => Array.from({ length: n }, () => ({ kg: '', reps: '', done: false }));

export default function Sport() {
  const [tab, setTab] = useState('programs');
  const [session, setSession] = usePersisted('sport-session', []);
  const add = (name) => setSession((s) => [...s, { name, sets: blankSets(3) }]);
  const loadDay = (day) => {
    setSession(day.items.map(({ name, ...target }) => ({ name, target, sets: blankSets(target.sets) })));
    setTab('session');
  };

  const tabs = [
    { id: 'programs', label: 'Programmes' },
    { id: 'library', label: `Exercices (${exercises.length})` },
    { id: 'session', label: `Ma séance${session.length ? ` (${session.length})` : ''}` },
    { id: 'guide', label: 'Guide reps, tempo, %1RM' },
    { id: 'running', label: 'Course' },
  ];

  return (
    <>
      <PageHeader title="Sport" subtitle="Programmes, exercices, séance en cours et repères d’entraînement. Ta séance est sauvegardée dans ce navigateur" />
      <Tabs id="sport" label="Sections sport" tabs={tabs} value={tab} onChange={setTab} />
      <TabPanel id="sport" value={tab}>
        {tab === 'programs' && <Programs onLoad={loadDay} />}
        {tab === 'library' && <Library inSession={session.map((s) => s.name)} onAdd={add} />}
        {tab === 'session' && <Session session={session} setSession={setSession} goLibrary={() => setTab('library')} goPrograms={() => setTab('programs')} />}
        {tab === 'guide' && <Guide />}
        {tab === 'running' && <Running />}
      </TabPanel>
    </>
  );
}

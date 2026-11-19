import { useState } from 'react';
import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Sleep from './health/Sleep.jsx';
import Nutrition from './health/Nutrition.jsx';
import Body from './health/Body.jsx';
import usePersisted from '../usePersisted.js';
import { readiness, sleepMinutes } from '../health.js';
import { isoDate } from '../format.js';

const scale = (label, low, high) => ({ label, low, high });
const questions = { energy: scale('Énergie', 'à plat', 'en pleine forme'), stress: scale('Stress', 'zen', 'débordé'), soreness: scale('Courbatures', 'aucune', 'très fortes') };

function Today({ sleep, checkins, setCheckins }) {
  const today = isoDate();
  const night = sleep.find((s) => s.date === today);
  const c = { energy: 3, stress: 3, soreness: 2, sleepH: night ? sleepMinutes(night.bed, night.wake) / 60 : 7, ...checkins[today] };
  const set = (k, v) => setCheckins({ ...checkins, [today]: { ...c, [k]: v } });
  const r = readiness(c);
  const days = Array.from({ length: 7 }, (_, i) => isoDate(new Date(Date.now() - (6 - i) * 86400000)));

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardTitle aside={<span className="text-xs text-muted">{today}</span>}>Comment tu te sens ce matin</CardTitle>
        <label className="block text-sm">Sommeil cette nuit : <span className="font-semibold tabular-nums">{c.sleepH.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} h</span>{night && <span className="text-xs text-muted"> (depuis l’onglet Sommeil)</span>}
          <input type="range" min="3" max="11" step="0.25" value={c.sleepH} onChange={(e) => set('sleepH', Number(e.target.value))} className="mt-2 block w-full accent-[var(--color-data)]" />
        </label>
        {Object.entries(questions).map(([k, q]) => (
          <fieldset key={k} className="mt-4 min-w-0">
            <legend className="text-sm">{q.label}</legend>
            <div className="mt-1 grid max-w-sm grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((v) => (
                <button key={v} aria-pressed={c[k] === v} aria-label={`${q.label} ${v} sur 5`} onClick={() => set(k, v)} className={`h-11 rounded-lg text-sm font-semibold transition-colors ${c[k] === v ? 'bg-night text-white' : 'bg-canvas text-ink hover:bg-line'}`}>{v}</button>
              ))}
            </div>
            <div className="mt-1 flex max-w-sm justify-between text-xs text-muted" aria-hidden="true"><span>1 · {q.low}</span><span>5 · {q.high}</span></div>
          </fieldset>
        ))}
      </Card>
      <Card>
        <CardTitle>Forme du jour</CardTitle>
        <p className={`text-6xl font-semibold tabular-nums ${r.score >= 75 ? 'text-up' : r.score >= 50 ? '' : 'text-down'}`}>{r.score}<span className="text-2xl text-muted"> / 100</span></p>
        <p className="mt-2 text-lg">{r.advice}</p>
        <p className="mt-1 text-xs text-muted">Sommeil 35 %, énergie 25 %, stress 20 %, courbatures 20 %</p>
        <p className="mt-6 text-xs font-medium text-muted">7 derniers jours</p>
        <ol className="mt-2 flex h-24 items-end gap-2">
          {days.map((d) => {
            const s = checkins[d] ? readiness({ sleepH: 7, ...checkins[d] }).score : null;
            return (
              <li key={d} className="flex h-full flex-1 flex-col justify-end text-center">
                {s !== null ? <span className="w-full rounded-t-md bg-data" style={{ height: `${s}%` }} title={`${d} : ${s}/100`} /> : <span className="h-1 w-full rounded bg-line" title={`${d} : pas de saisie`} />}
                <span className="mt-1 text-[10px] text-muted">{d.slice(8)}</span>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}

export default function Health() {
  const [tab, setTab] = useState('today');
  const [profile, setProfile] = usePersisted('health-profile', { weight: '80', height: '180', age: '28', sex: 'h', activity: 1.55, goal: 'maintien' });
  const [sleep, setSleep] = usePersisted('health-sleep', []);
  const [food, setFood] = usePersisted('health-food', {});
  const [water, setWater] = usePersisted('health-water', {});
  const [body, setBody] = usePersisted('health-body', []);
  const [checkins, setCheckins] = usePersisted('health-checkin', {});

  return (
    <>
      <PageHeader title="Santé" subtitle="Forme du jour, sommeil, alimentation et mesures. Tout reste dans ce navigateur, rien n’est envoyé" />
      <Tabs id="health" label="Sections santé" value={tab} onChange={setTab} tabs={[
        { id: 'today', label: 'Forme du jour' }, { id: 'sleep', label: 'Sommeil' }, { id: 'food', label: 'Alimentation' }, { id: 'body', label: 'Corps' },
      ]} />
      <TabPanel id="health" value={tab}>
        {tab === 'today' && <Today sleep={sleep} checkins={checkins} setCheckins={setCheckins} />}
        {tab === 'sleep' && <Sleep entries={sleep} setEntries={setSleep} />}
        {tab === 'food' && <Nutrition profile={profile} setProfile={setProfile} log={food} setLog={setFood} water={water} setWater={setWater} />}
        {tab === 'body' && <Body entries={body} setEntries={setBody} profile={profile} />}
      </TabPanel>
      <p className="mt-6 text-xs text-muted">Repères grand public (OMS, ANSES, AASM), pas un avis médical. En cas de doute, parle-en à ton médecin</p>
    </>
  );
}

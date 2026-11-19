import { useState } from 'react';
import { Plus, Trash2, Flame } from 'lucide-react';
import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import usePersisted from '../usePersisted.js';
import { portfolio, commitsByDay } from '../data.js';
import { clock, parseClock } from '../sport.js';
import { field, btnPrimary, btnGhost } from '../ui.js';

const commits30 = Object.values(commitsByDay).reduce((a, b) => a + b, 0);

// start → target : la progression marche dans les deux sens (un chrono qui baisse, une charge qui monte).
const seedGoals = [
  { id: 1, title: 'Courir 10 km sous 50 min', unit: 'temps', start: 3360, current: 3160, target: 3000 },
  { id: 2, title: 'Développé couché à 110 kg', unit: 'kg', start: 90, current: 100, target: 110 },
  { id: 3, title: 'Portefeuille revenu à l’équilibre', unit: '€', start: portfolio.pnl, current: portfolio.pnl, target: 0 },
  { id: 4, title: 'Commits sur mes projets en 30 jours', unit: 'commits', start: 0, current: commits30, target: 250 },
];
const seedHabits = ['Musculation', 'Course', 'Coder sur un projet perso', 'Lecture 20 min', '8 h de sommeil'].map((name, i) => ({ id: i + 1, name, days: [] }));

export const progress = (g) => (g.target === g.start ? 1 : Math.min(1, Math.max(0, (g.current - g.start) / (g.target - g.start))));
const show = (g, v) => (g.unit === 'temps' ? clock(v) : `${Number(v).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${g.unit}`);
const read = (unit, s) => (unit === 'temps' ? parseClock(s) : Number(String(s).replace(',', '.').replace(/\s/g, '')));

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const WEEKS = 12;
// Grille de 12 semaines alignée sur les lundis, aujourd'hui dans la dernière colonne.
function grid() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7);
  return Array.from({ length: WEEKS * 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
}

export function streak(days, today = new Date()) {
  const set = new Set(days);
  const d = new Date(today);
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1); // la série n'est pas cassée tant que la journée n'est pas finie
  let n = 0;
  while (set.has(iso(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function GoalCard({ g, onChange, onDelete }) {
  const [draft, setDraft] = useState(g.unit === 'temps' ? clock(g.current) : String(g.current));
  const p = progress(g);
  const commit = () => { const v = read(g.unit, draft); if (Number.isFinite(v)) onChange({ ...g, current: v }); else setDraft(g.unit === 'temps' ? clock(g.current) : String(g.current)); };
  return (
    <Card as="li">
      <CardTitle aside={<button onClick={onDelete} aria-label={`Supprimer ${g.title}`} className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"><Trash2 size={16} aria-hidden="true" /></button>}>{g.title}</CardTitle>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tabular-nums">{Math.round(p * 100)} %</p>
        <p className="text-right text-xs text-muted">départ {show(g, g.start)}<br />cible {show(g, g.target)}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-canvas" role="progressbar" aria-label={`Progression : ${g.title}`} aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${p >= 1 ? 'bg-up' : 'bg-data'}`} style={{ width: `${p * 100}%` }} />
      </div>
      <label className="mt-4 flex items-center gap-2 text-xs text-muted">
        Valeur actuelle
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()} className={`${field} w-32 font-mono`} />
        {g.unit !== 'temps' && <span>{g.unit}</span>}
      </label>
    </Card>
  );
}

export default function Goals() {
  const [goals, setGoals] = usePersisted('goals', seedGoals);
  const [habits, setHabits] = usePersisted('habits', seedHabits);
  const [form, setForm] = useState({ title: '', unit: 'kg', start: '', target: '' });
  const [habitName, setHabitName] = useState('');
  const days = grid();
  const todayIso = iso(new Date());

  const addGoal = (e) => {
    e.preventDefault();
    const start = read(form.unit, form.start), target = read(form.unit, form.target);
    if (!form.title.trim() || !Number.isFinite(start) || !Number.isFinite(target)) return;
    setGoals([...goals, { id: Date.now(), title: form.title.trim(), unit: form.unit, start, current: start, target }]);
    setForm({ title: '', unit: 'kg', start: '', target: '' });
  };
  const toggleDay = (h, d) => setHabits(habits.map((x) => (x.id === h.id ? { ...x, days: x.days.includes(d) ? x.days.filter((y) => y !== d) : [...x.days, d] } : x)));

  return (
    <>
      <PageHeader title="Objectifs" subtitle="Tes cibles chiffrées et tes habitudes, sauvegardées dans ce navigateur" />

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {goals.map((g) => (
          <GoalCard key={g.id} g={g} onChange={(ng) => setGoals(goals.map((x) => (x.id === g.id ? ng : x)))} onDelete={() => setGoals(goals.filter((x) => x.id !== g.id))} />
        ))}
      </ul>

      <Card className="mt-4">
        <CardTitle>Nouvel objectif</CardTitle>
        <form onSubmit={addGoal} className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted">Intitulé<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={`${field} mt-1 block w-64`} placeholder="Squat à 160 kg" /></label>
          <label className="text-xs text-muted">Unité
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={`${field} mt-1 block`}>
              {['kg', 'km', 'temps', '€', 'commits', 'séances', 'pages'].map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted">Départ<input value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required className={`${field} mt-1 block w-28 font-mono`} placeholder={form.unit === 'temps' ? '55:00' : '140'} /></label>
          <label className="text-xs text-muted">Cible<input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required className={`${field} mt-1 block w-28 font-mono`} placeholder={form.unit === 'temps' ? '50:00' : '160'} /></label>
          <button className={btnPrimary}><Plus size={14} aria-hidden="true" />Ajouter</button>
        </form>
      </Card>

      <Card className="mt-4 overflow-x-auto">
        <CardTitle aside={<span className="text-xs text-muted">12 dernières semaines · clique une case pour la cocher</span>}>Habitudes</CardTitle>
        <ul className="min-w-[720px] space-y-3">
          {habits.map((h) => {
            const s = streak(h.days);
            const week = days.slice(-7).filter((d) => h.days.includes(iso(d))).length;
            return (
              <li key={h.id} className="flex items-center gap-4">
                <div className="w-48 shrink-0">
                  <p className="truncate text-sm font-medium">{h.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted tabular-nums">
                    <Flame size={12} className={s ? 'text-down' : ''} aria-hidden="true" />{s} j de suite · {week}/7 cette semaine
                  </p>
                </div>
                <div className="grid grid-flow-col grid-rows-7 gap-1" role="group" aria-label={`Jours de ${h.name}`}>
                  {days.map((d) => {
                    const id = iso(d), on = h.days.includes(id), future = id > todayIso;
                    return (
                      <button
                        key={id}
                        disabled={future}
                        aria-pressed={on}
                        aria-label={d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        onClick={() => toggleDay(h, id)}
                        className={`size-4 rounded-[4px] transition-colors disabled:opacity-30 ${on ? 'bg-data' : 'bg-canvas hover:bg-line'} ${id === todayIso ? 'ring-1 ring-lime-ink' : ''}`}
                      />
                    );
                  })}
                </div>
                <button onClick={() => setHabits(habits.filter((x) => x.id !== h.id))} aria-label={`Supprimer l’habitude ${h.name}`} className="ml-auto rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"><Trash2 size={16} aria-hidden="true" /></button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={(e) => { e.preventDefault(); if (habitName.trim()) { setHabits([...habits, { id: Date.now(), name: habitName.trim(), days: [] }]); setHabitName(''); } }} className="mt-4 flex gap-2">
          <label className="sr-only" htmlFor="habit">Nouvelle habitude</label>
          <input id="habit" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="Nouvelle habitude" className={`${field} w-64`} />
          <button className={btnGhost}><Plus size={14} aria-hidden="true" />Ajouter</button>
        </form>
      </Card>
    </>
  );
}

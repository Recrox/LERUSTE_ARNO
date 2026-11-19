import { useEffect, useState } from 'react';
import { Trash2, Plus, TimerReset, X, Dumbbell } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { exercises, clock } from '../../sport.js';
import ExercisePicto from '../../components/ExercisePicto.jsx';
import { field, btnGhost, btnPrimary } from '../../ui.js';

const byName = Object.fromEntries(exercises.map((e) => [e.name, e]));
const newSet = () => ({ kg: '', reps: '', done: false });

// Petit bip de fin de repos (Web Audio, sans fichier son).
function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    navigator.vibrate?.(200);
  } catch { /* audio indisponible */ }
}

function RestTimer({ timer, onStop }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, (timer.endsAt - now) / 1000);
  useEffect(() => { if (left === 0) { beep(); onStop(); } }, [left === 0]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div role="timer" aria-live="off" className="fixed right-4 bottom-24 z-30 lg:bottom-4 flex items-center gap-4 rounded-xl bg-night px-5 py-3 text-white shadow-lg">
      <div>
        <p className="text-xs text-white/60">Repos · {timer.label}</p>
        <p className="font-mono text-2xl tabular-nums">{clock(left)}</p>
      </div>
      <div className="flex h-10 w-1.5 flex-col justify-end overflow-hidden rounded-full bg-white/15" aria-hidden="true">
        <div className="w-full rounded-full bg-lime" style={{ height: `${(left / timer.total) * 100}%` }} />
      </div>
      <button onClick={onStop} aria-label="Arrêter le repos" className="rounded-lg p-1.5 hover:bg-white/10"><X size={18} aria-hidden="true" /></button>
    </div>
  );
}

export default function Session({ session, setSession, goLibrary, goPrograms }) {
  const [timer, setTimer] = useState(null);

  const update = (i, fn) => setSession((s) => s.map((item, j) => (j === i ? fn(item) : item)));
  const setField = (i, k, key, v) => update(i, (it) => ({ ...it, sets: it.sets.map((st, n) => (n === k ? { ...st, [key]: v } : st)) }));
  const toggleDone = (i, k) => {
    const item = session[i];
    const done = !item.sets[k].done;
    setField(i, k, 'done', done);
    if (done) {
      const rest = item.target?.rest ?? byName[item.name]?.rest ?? 90;
      setTimer({ endsAt: Date.now() + rest * 1000, total: rest, label: item.name });
    }
  };

  const volume = session.reduce((s, it) => s + it.sets.reduce((a, st) => a + (st.done ? (Number(st.kg) || 0) * (Number(st.reps) || 0) : 0), 0), 0);
  const doneSets = session.reduce((s, it) => s + it.sets.filter((st) => st.done).length, 0);
  const totalSets = session.reduce((s, it) => s + it.sets.length, 0);

  return (
    <>
      {session.length === 0 ? (
        <Card className="text-center">
          <Dumbbell size={28} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-2 text-sm font-medium">Ta séance est vide</p>
          <p className="mt-1 text-sm text-muted">Charge une journée d’un programme ou ajoute des exercices un par un</p>
          <div className="mt-4 flex justify-center gap-2">
            <button onClick={goPrograms} className={btnPrimary}>Choisir un programme</button>
            <button onClick={goLibrary} className={btnGhost}>Ouvrir la bibliothèque</button>
          </div>
        </Card>
      ) : (
        <>
          <dl className="mb-4 grid grid-cols-3 gap-4">
            {[['Séries faites', `${doneSets}/${totalSets}`], ['Volume soulevé', `${volume.toLocaleString('fr-FR')} kg`], ['Exercices', session.length]].map(([k, v]) => (
              <Card as="div" key={k}><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd></Card>
            ))}
          </dl>
          <ol className="space-y-4">
            {session.map((it, i) => {
              const info = byName[it.name];
              const t = it.target;
              const rest = t?.rest ?? info?.rest;
              return (
                <Card as="li" key={`${it.name}-${i}`}>
                  <CardTitle aside={
                    <button onClick={() => setSession((s) => s.filter((_, j) => j !== i))} aria-label={`Retirer ${it.name}`} className="rounded-lg p-1.5 text-muted hover:bg-canvas hover:text-ink"><Trash2 size={16} aria-hidden="true" /></button>
                  }>
                    {i + 1}. {it.name}
                  </CardTitle>
                  <div className="mb-3 flex items-center gap-4">
                    {info && <ExercisePicto exercise={info} className="h-20 w-20 shrink-0 rounded-lg bg-canvas p-1" />}
                    <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                      <div><dt className="text-muted">Objectif</dt><dd className="font-medium">{t ? `${t.sets} × ${t.reps}` : info?.sets}</dd></div>
                      <div><dt className="text-muted">Intensité</dt><dd className="font-medium">{t?.intensity ?? 'RPE 8'}</dd></div>
                      <div><dt className="text-muted">Tempo</dt><dd className="font-mono font-medium">{t?.tempo ?? '2-0-1-0'}</dd></div>
                      <div><dt className="text-muted">Repos</dt><dd className="font-medium">{rest} s</dd></div>
                    </dl>
                  </div>
                  {info && <p className="mb-3 text-xs text-muted">{info.tip}</p>}
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-xs text-muted"><th className="pb-2 font-medium">Série</th><th className="pb-2 font-medium">Charge (kg)</th><th className="pb-2 font-medium">Reps</th><th className="pb-2 text-right font-medium">Faite</th></tr></thead>
                    <tbody>
                      {it.sets.map((st, k) => (
                        <tr key={k} className={st.done ? 'text-muted' : ''}>
                          <td className="py-1 tabular-nums">{k + 1}</td>
                          <td className="py-1"><input inputMode="decimal" aria-label={`Charge série ${k + 1}`} value={st.kg} onChange={(e) => setField(i, k, 'kg', e.target.value)} className={`${field} w-20`} /></td>
                          <td className="py-1"><input inputMode="numeric" aria-label={`Répétitions série ${k + 1}`} value={st.reps} onChange={(e) => setField(i, k, 'reps', e.target.value)} className={`${field} w-16`} /></td>
                          <td className="py-1 text-right"><input type="checkbox" aria-label={`Série ${k + 1} faite`} checked={st.done} onChange={() => toggleDone(i, k)} className="size-5 accent-[var(--color-data)]" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => update(i, (x) => ({ ...x, sets: [...x.sets, { ...(x.sets.at(-1) ?? newSet()), done: false }] }))} className={btnGhost}><Plus size={14} aria-hidden="true" />Série</button>
                    {rest && <button onClick={() => setTimer({ endsAt: Date.now() + rest * 1000, total: rest, label: it.name })} className={btnGhost}><TimerReset size={14} aria-hidden="true" />Repos {rest} s</button>}
                  </div>
                </Card>
              );
            })}
          </ol>
          <button onClick={() => setSession([])} className={`${btnGhost} mt-4`}><Trash2 size={14} aria-hidden="true" />Vider la séance</button>
        </>
      )}
      {timer && <RestTimer key={timer.endsAt} timer={timer} onStop={() => setTimer(null)} />}
    </>
  );
}

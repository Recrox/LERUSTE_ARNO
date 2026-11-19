import { useState } from 'react';
import { Card, CardTitle } from '../../components/Card.jsx';
import usePersisted from '../../usePersisted.js';
import { epley } from '../../sport.js';
import { goalsGuide, repsAtPct, rpeTable, tut } from '../../training.js';
import { field, chip } from '../../ui.js';

const lifts = [['bench', 'Développé couché'], ['squat', 'Squat'], ['deadlift', 'Soulevé de terre'], ['press', 'Développé militaire']];
const num = (v) => Number(String(v).replace(',', '.'));
const kg = (n) => `${(Math.round(n / 2.5) * 2.5).toLocaleString('fr-FR')} kg`; // arrondi au disque de 1,25 kg par côté
const phases = [['Excentrique', 'la charge descend', 'bg-data'], ['Pause basse', 'en position étirée', 'bg-data/50'], ['Concentrique', 'la charge monte', 'bg-lime-ink'], ['Pause haute', 'en contraction', 'bg-line']];

const principles = [
  ['Surcharge progressive', 'Chaque semaine, ajoute un peu : une rep, 2,5 kg ou une série. Sans progression, le corps n’a aucune raison de s’adapter.'],
  ['Double progression', 'Fourchette de 8-12 reps : tant que tu n’atteins pas 12 reps sur toutes les séries, tu gardes la charge. Ensuite +2,5 kg et tu repars à 8.'],
  ['Volume hebdomadaire', '10 à 20 séries dures par muscle et par semaine. Moins de 10 : progression lente. Plus de 20 : récupération difficile.'],
  ['Proximité de l’échec', 'Les séries efficaces finissent à 1-3 reps de l’échec (RPE 7 à 9). L’échec total, à réserver aux exercices d’isolation.'],
  ['Décharge', 'Toutes les 4 à 8 semaines, une semaine à -40 % de volume. Les articulations et le système nerveux récupèrent, la progression repart.'],
  ['Échauffement', '2 à 4 séries de montée : barre à vide × 10, 50 % × 5, 70 % × 3, 85 % × 1, puis les séries de travail.'],
];

export default function Guide() {
  const [goal, setGoal] = useState('hyper');
  const [orm, setOrm] = usePersisted('sport-1rm', { bench: 100, squat: 140, deadlift: 170, press: 60 });
  const [test, setTest] = useState({ load: '90', reps: '5' });
  const [tempo, setTempo] = useState('3-1-1-0');
  const [tempoReps, setTempoReps] = useState('8');
  const g = goalsGuide.find((x) => x.id === goal);
  const estimate = epley(num(test.load), num(test.reps));
  const tempoParts = tempo.split('-').map((p) => (p.trim().toUpperCase() === 'X' ? 1 : Number(p)));
  const t = tut(tempo, num(tempoReps));

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="xl:col-span-2">
        <CardTitle>Quel objectif pour la séance</CardTitle>
        <div className="mb-4 flex flex-wrap gap-1" role="group" aria-label="Objectif">
          {goalsGuide.map((x) => <button key={x.id} aria-pressed={goal === x.id} onClick={() => setGoal(x.id)} className={chip(goal === x.id)}>{x.name}</button>)}
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[['Répétitions', g.reps], ['Intensité', `${g.pct[0]} à ${g.pct[1]} % du 1RM`], ['Séries', g.sets], ['Repos', g.rest], ['Tempo', g.tempo]].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
          ))}
        </dl>
        <p className="mt-3 text-sm">{g.note}</p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <caption className="mb-2 text-left text-xs text-muted">Tes charges de travail pour cet objectif, à partir de tes 1RM (modifiables)</caption>
            <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="pb-2 font-medium">Exercice</th><th className="pb-2 font-medium">1RM</th><th className="pb-2 text-right font-medium">Charge à {g.pct[0]} %</th><th className="pb-2 text-right font-medium">Charge à {g.pct[1]} %</th></tr></thead>
            <tbody className="divide-y divide-line tabular-nums">
              {lifts.map(([id, name]) => (
                <tr key={id}>
                  <td className="py-2">{name}</td>
                  <td className="py-2"><input inputMode="decimal" aria-label={`1RM ${name}`} value={orm[id]} onChange={(e) => setOrm({ ...orm, [id]: e.target.value })} className={`${field} w-20`} /> kg</td>
                  <td className="py-2 text-right font-semibold">{num(orm[id]) > 0 ? kg((num(orm[id]) * g.pct[0]) / 100) : '—'}</td>
                  <td className="py-2 text-right font-semibold">{num(orm[id]) > 0 ? kg((num(orm[id]) * g.pct[1]) / 100) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle aside={<span className="text-xs text-muted">Formule d’Epley</span>}>Estimer un 1RM sans le tester</CardTitle>
        <p className="mb-3 text-sm text-muted">Fais une série lourde jusqu’à 1-2 reps de l’échec, puis entre la charge et les reps faites</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted">Charge (kg)<input inputMode="decimal" value={test.load} onChange={(e) => setTest({ ...test, load: e.target.value })} className={`${field} mt-1 block w-24`} /></label>
          <label className="text-xs text-muted">Reps<input inputMode="numeric" value={test.reps} onChange={(e) => setTest({ ...test, reps: e.target.value })} className={`${field} mt-1 block w-20`} /></label>
          <p className="text-2xl font-semibold tabular-nums">{estimate > 0 && num(test.reps) <= 12 ? kg(estimate) : '—'}</p>
        </div>
        <p className="mt-2 text-xs text-muted">Fiable jusqu’à environ 10 reps. Au-delà, l’estimation surestime</p>

        <table className="mt-5 w-full text-sm">
          <caption className="mb-2 text-left text-xs text-muted">Répétitions possibles selon le % du 1RM</caption>
          <tbody className="tabular-nums">
            <tr className="text-xs text-muted">{repsAtPct.slice(0, 7).map(([p]) => <td key={p} className="pb-1 text-center">{p} %</td>)}</tr>
            <tr className="font-semibold">{repsAtPct.slice(0, 7).map(([p, r]) => <td key={p} className="rounded bg-canvas py-1.5 text-center">{r}</td>)}</tr>
            <tr className="text-xs text-muted">{repsAtPct.slice(7).map(([p]) => <td key={p} className="pt-3 pb-1 text-center">{p} %</td>)}</tr>
            <tr className="font-semibold">{repsAtPct.slice(7).map(([p, r]) => <td key={p} className="rounded bg-canvas py-1.5 text-center">{r}</td>)}</tr>
          </tbody>
        </table>
      </Card>

      <Card>
        <CardTitle>Lire un tempo</CardTitle>
        <p className="text-sm">Quatre chiffres en secondes : <span className="font-mono">descente – pause en bas – montée – pause en haut</span>. Un X veut dire « le plus vite possible ».</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs text-muted">Tempo<input value={tempo} onChange={(e) => setTempo(e.target.value)} className={`${field} mt-1 block w-28 font-mono`} /></label>
          <label className="text-xs text-muted">Reps<input inputMode="numeric" value={tempoReps} onChange={(e) => setTempoReps(e.target.value)} className={`${field} mt-1 block w-20`} /></label>
          <p className="text-sm">{Number.isFinite(t) ? <>Temps sous tension : <span className="font-semibold tabular-nums">{t} s</span></> : <span className="text-down">Format attendu : 3-1-1-0</span>}</p>
        </div>
        {Number.isFinite(t) && t > 0 && (
          <>
            <div className="mt-4 flex h-8 overflow-hidden rounded-lg" aria-hidden="true">
              {tempoParts.map((s, i) => s > 0 && <div key={i} className={phases[i][2]} style={{ flex: s }} />)}
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {phases.map(([name, what, color], i) => (
                <li key={name} className="flex items-center gap-2"><span className={`size-3 rounded-sm ${color}`} aria-hidden="true" /><span><span className="font-semibold">{name} {tempoParts[i] ?? '?'} s</span> · {what}</span></li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Entre 30 et 60 s de tension par série, c’est la zone classique de l’hypertrophie</p>
          </>
        )}
      </Card>

      <Card>
        <CardTitle>RPE et reps en réserve</CardTitle>
        <p className="mb-3 text-sm">Le RPE mesure la difficulté d’une série sur 10. Plus simple : compte combien de reps il te restait.</p>
        <ul className="divide-y divide-line text-sm">
          {rpeTable.map(([rpe, rir, what]) => (
            <li key={rpe} className="flex items-center gap-3 py-2"><span className="w-14 font-semibold tabular-nums">RPE {rpe}</span><span className="w-20 text-muted tabular-nums">{rir} en réserve</span><span>{what}</span></li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardTitle>Les principes qui font progresser</CardTitle>
        <dl className="space-y-3 text-sm">
          {principles.map(([k, v]) => <div key={k}><dt className="font-semibold">{k}</dt><dd className="text-muted">{v}</dd></div>)}
        </dl>
      </Card>
    </div>
  );
}

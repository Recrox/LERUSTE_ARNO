import { useRef, useState } from 'react';
import { Car, Plus, Trash2, TriangleAlert, Info, Bell } from 'lucide-react';
import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Issues from './cars/Issues.jsx';
import Costs from './cars/Costs.jsx';
import usePersisted from '../usePersisted.js';
import { seedCars, newCar, carName, costSummary, reminders } from '../cars.js';
import { money, isoDate } from '../format.js';
import { field, btnPrimary, btnGhost } from '../ui.js';

const fuels = ['Essence', 'Diesel', 'Hybride', 'Hybride rechargeable', 'Électrique', 'LPG'];
const levelIcon = { high: TriangleAlert, medium: Bell, low: Info };
const levelTone = { high: 'text-down', medium: 'text-lime-ink', low: 'text-muted' };

function Sheet({ car, update, remove }) {
  const set = (k) => (e) => update({ [k]: e.target.value });
  const fields = [
    ['make', 'Marque'], ['model', 'Modèle'], ['year', 'Année'], ['plate', 'Plaque'], ['engine', 'Motorisation'], ['km', 'Kilométrage actuel'],
  ];
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card>
        <CardTitle>Fiche du véhicule</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(([k, l]) => (
            <label key={k} className="text-xs text-muted">{l}<input value={car[k] ?? ''} onChange={set(k)} inputMode={k === 'km' || k === 'year' ? 'numeric' : undefined} className={`${field} mt-1 block w-full`} /></label>
          ))}
          <label className="text-xs text-muted">Carburant
            <select value={car.fuel} onChange={set('fuel')} className={`${field} mt-1 block w-full`}>{fuels.map((f) => <option key={f}>{f}</option>)}</select>
          </label>
          <span className="hidden sm:block" />
          <label className="text-xs text-muted">Prochain contrôle technique<input type="date" value={car.ctDate} onChange={set('ctDate')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Échéance de l’assurance<input type="date" value={car.insuranceDate} onChange={set('insuranceDate')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted sm:col-span-2">Notes (pneus, pièces, garage de confiance…)
            <textarea value={car.notes} onChange={set('notes')} rows={4} className={`${field} mt-1 block w-full resize-y`} />
          </label>
        </div>
      </Card>
      <Card>
        <CardTitle>Supprimer</CardTitle>
        <p className="text-sm text-muted">Supprime la voiture avec ses problèmes et ses coûts. Irréversible</p>
        <button onClick={remove} className={`${btnGhost} mt-3 text-down`}><Trash2 size={14} aria-hidden="true" />Supprimer {carName(car)}</button>
      </Card>
    </div>
  );
}

export default function Cars() {
  const [cars, setCars] = usePersisted('cars', seedCars);
  const [selected, setSelected] = useState(cars[0]?.id ?? null);
  const [tab, setTab] = useState('issues');
  const addDialog = useRef(null);
  const [draft, setDraft] = useState({ make: '', model: '', year: '', fuel: 'Essence' });
  const car = cars.find((c) => c.id === selected) ?? cars[0];
  const today = isoDate();

  const update = (fields) => setCars(cars.map((c) => (c.id === car.id ? { ...c, ...fields } : c)));
  const remove = () => {
    if (!confirm(`Supprimer ${carName(car)} et tout son historique ?`)) return;
    const rest = cars.filter((c) => c.id !== car.id);
    setCars(rest);
    setSelected(rest[0]?.id ?? null);
  };
  const add = (e) => {
    e.preventDefault();
    if (!draft.make.trim() || !draft.model.trim()) return;
    const c = newCar({ ...draft, make: draft.make.trim(), model: draft.model.trim() });
    setCars([...cars, c]);
    setSelected(c.id);
    setTab('sheet');
    setDraft({ make: '', model: '', year: '', fuel: 'Essence' });
    addDialog.current.close();
  };

  return (
    <>
      <PageHeader title="Voitures" subtitle="Problèmes, entretien et coûts de tes véhicules. Sauvegardé dans ce navigateur">
        <button onClick={() => addDialog.current.showModal()} className={btnPrimary}><Plus size={14} aria-hidden="true" />Ajouter une voiture</button>
      </PageHeader>

      <ul className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Mes voitures">
        {cars.map((c) => {
          const s = costSummary(c.costs);
          const open = c.issues.filter((i) => i.status !== 'done').length;
          const alerts = reminders(c, today).filter((r) => r.level !== 'low').length;
          const active = car?.id === c.id;
          return (
            <li key={c.id}>
              <button onClick={() => setSelected(c.id)} aria-pressed={active} className={`w-full rounded-xl p-4 text-left transition-colors ${active ? 'bg-night text-white' : 'bg-surface hover:bg-line/60'}`}>
                <span className="flex items-center gap-3">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? 'bg-lime text-night' : 'bg-canvas'}`}><Car size={20} aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{carName(c)}</span>
                    <span className={`block text-xs ${active ? 'text-white/70' : 'text-muted'}`}>{[c.fuel, c.km && `${Number(c.km).toLocaleString('fr-FR')} km`, c.plate].filter(Boolean).join(' · ')}</span>
                  </span>
                </span>
                <span className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs tabular-nums ${active ? 'text-white/80' : 'text-muted'}`}>
                  <span>{open} problème{open > 1 ? 's' : ''} en cours</span>
                  <span>{money(s.thisYear)} cette année</span>
                  {alerts > 0 && <span className={active ? 'text-lime' : 'text-down'}>{alerts} rappel{alerts > 1 ? 's' : ''}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {!car ? (
        <Card className="text-center">
          <Car size={28} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-2 text-sm">Aucune voiture enregistrée</p>
          <button onClick={() => addDialog.current.showModal()} className={`${btnPrimary} mt-4`}><Plus size={14} aria-hidden="true" />Ajouter une voiture</button>
        </Card>
      ) : (
        <>
          {reminders(car, today).length > 0 && (
            <Card className="mb-4">
              <ul className="space-y-2">
                {reminders(car, today).map((r) => {
                  const Icon = levelIcon[r.level];
                  return <li key={r.text} className="flex gap-2 text-sm"><Icon size={16} className={`mt-0.5 shrink-0 ${levelTone[r.level]}`} aria-hidden="true" />{r.text}</li>;
                })}
              </ul>
            </Card>
          )}
          <Tabs id="car" label={`Détails de ${carName(car)}`} value={tab} onChange={setTab} tabs={[
            { id: 'issues', label: `Problèmes (${car.issues.filter((i) => i.status !== 'done').length})` },
            { id: 'costs', label: `Coûts (${money(costSummary(car.costs).total)})` },
            { id: 'sheet', label: 'Fiche' },
          ]} />
          <TabPanel id="car" value={tab}>
            {tab === 'issues' && <Issues car={car} update={update} />}
            {tab === 'costs' && <Costs car={car} update={update} />}
            {tab === 'sheet' && <Sheet car={car} update={update} remove={remove} />}
          </TabPanel>
        </>
      )}

      <dialog ref={addDialog} aria-labelledby="add-car" onClick={(e) => e.target === addDialog.current && addDialog.current.close()} className="m-auto w-[min(420px,calc(100vw-2rem))] rounded-xl bg-surface p-5 text-ink shadow-xl">
        <h2 id="add-car" className="text-base font-semibold">Nouvelle voiture</h2>
        <form onSubmit={add} className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs text-muted">Marque<input value={draft.make} onChange={(e) => setDraft({ ...draft, make: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Modèle<input value={draft.model} onChange={(e) => setDraft({ ...draft, model: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Année<input inputMode="numeric" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Carburant
            <select value={draft.fuel} onChange={(e) => setDraft({ ...draft, fuel: e.target.value })} className={`${field} mt-1 block w-full`}>{fuels.map((f) => <option key={f}>{f}</option>)}</select>
          </label>
          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => addDialog.current.close()} className={btnGhost}>Annuler</button>
            <button className={btnPrimary}>Ajouter</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

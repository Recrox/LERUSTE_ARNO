import { lazy, Suspense, useMemo, useState } from 'react';
import { CircleCheck, TriangleAlert, Droplets, Zap, Ruler, Layers, RotateCcw } from 'lucide-react';
import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Plan2D from '../house/Plan2D.jsx';
import usePersisted from '../usePersisted.js';
import { H, rooms, water, circuits, floors, wallFinishes, defaultFinishes, openingSpec, pointLabel } from '../house/data.js';
import { roomQty, totalArea, waterRuns, waterChecks, circuitRun, differentials, elecChecks, bill, roomAt } from '../house/calc.js';
import { money } from '../format.js';
import { field, chip, btnGhost } from '../ui.js';

const House3D = lazy(() => import('../house/House3D.jsx'));
const n = (v, d = 1) => v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

function Checks({ list }) {
  return (
    <ul className="space-y-1.5">
      {list.map((c) => (
        <li key={c.text} className="flex gap-2 text-sm">
          {c.ok ? <CircleCheck size={16} className="mt-0.5 shrink-0 text-up" aria-label="Conforme" /> : <TriangleAlert size={16} className="mt-0.5 shrink-0 text-down" aria-label="À corriger" />}
          <span>{c.text}</span>
        </li>
      ))}
    </ul>
  );
}

function RoomPanel({ room, fin, setFin }) {
  const q = roomQty(room, fin);
  const inRoom = (p) => roomAt(p.x, p.y)?.id === room.id;
  const pts = circuits.flatMap((c) => c.points).filter(inRoom);
  const byKind = Object.entries(pointLabel).map(([k, l]) => [l, pts.filter((p) => p.k === k).length]).filter(([, c]) => c);
  const waterPts = water.points.filter((p) => p.room === room.id);
  return (
    <>
      <CardTitle aside={<span className="text-xs text-muted tabular-nums">{n(room.w / 100, 2)} × {n(room.h / 100, 2)} m</span>}>{room.name}</CardTitle>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[['Sol', `${n(q.area, 2)} m²`], ['Murs', `${n(q.wallArea)} m²`], ['Périmètre', `${n(q.perim)} m`]].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-canvas p-2"><dt className="text-xs text-muted">{k}</dt><dd className="text-sm font-semibold tabular-nums">{v}</dd></div>
        ))}
      </dl>
      <div className="mt-4 grid gap-3">
        <label className="text-xs text-muted">Revêtement de sol
          <select value={fin.floor} onChange={(e) => setFin({ ...fin, floor: e.target.value })} className={`${field} mt-1 block w-full`}>
            {Object.entries(floors).map(([id, f]) => <option key={id} value={id}>{f.name} · {f.price} €/m²</option>)}
          </select>
        </label>
        <label className="text-xs text-muted">Finition des murs
          <select value={fin.wall} onChange={(e) => setFin({ ...fin, wall: e.target.value })} className={`${field} mt-1 block w-full`}>
            {Object.entries(wallFinishes).map(([id, f]) => <option key={id} value={id}>{f.name}</option>)}
          </select>
        </label>
      </div>
      <ul className="mt-4 divide-y divide-line text-sm">
        <li className="flex justify-between py-1.5"><span>Sol ({n(q.floorQty, 2)} m² avec chute)</span><span className="tabular-nums">{money(q.floorCost)}</span></li>
        <li className="flex justify-between py-1.5"><span>Murs ({n(q.wallQty)} {q.wallUnit})</span><span className="tabular-nums">{money(q.wallCost)}</span></li>
        <li className="flex justify-between py-1.5"><span>Plafond ({n(q.ceilingL)} L)</span><span className="tabular-nums">{money(q.ceilingCost)}</span></li>
        {q.plinthes > 0 && <li className="flex justify-between py-1.5"><span>Plinthes ({n(q.plinthes)} m)</span><span className="tabular-nums">{money(q.plintheCost)}</span></li>}
        <li className="flex justify-between py-1.5 font-semibold"><span>Finitions de la pièce</span><span className="tabular-nums">{money(q.total)}</span></li>
      </ul>
      <p className="mt-4 text-xs font-medium text-muted">Ouvertures</p>
      <p className="text-sm">{q.openings.length ? q.openings.map((o) => `${openingSpec[o.kind].label} ${o.w} cm`).join(' · ') : 'Aucune'}</p>
      <p className="mt-3 text-xs font-medium text-muted">Électricité</p>
      <p className="text-sm">{byKind.length ? byKind.map(([l, c]) => `${c} × ${l.toLowerCase()}`).join(' · ') : 'Aucun point'}</p>
      <p className="mt-3 text-xs font-medium text-muted">Points d’eau</p>
      <p className="text-sm">{waterPts.length ? waterPts.map((p) => p.name).join(' · ') : 'Aucun'}</p>
    </>
  );
}

export default function House() {
  const [view, setView] = useState(() => (location.hash.includes('vue=3d') ? '3d' : '2d'));
  const [layers, setLayers] = useState({ dims: true, materials: true, water: false, elec: false });
  const [stored, setFinishes] = usePersisted('house-finishes', defaultFinishes);
  const finishes = { ...defaultFinishes, ...stored };
  const [room, setRoom] = useState(null);
  const [circuit, setCircuit] = useState(null);
  const [tab, setTab] = useState('elec');

  const b = useMemo(() => bill(finishes), [JSON.stringify(finishes)]); // eslint-disable-line react-hooks/exhaustive-deps
  const eChecks = useMemo(elecChecks, []);
  const wChecks = useMemo(waterChecks, []);
  const ids = useMemo(differentials, []);
  const { runs } = useMemo(waterRuns, []);
  const okCount = [...eChecks, ...wChecks].filter((c) => c.ok).length;
  const selected = rooms.find((r) => r.id === room);
  const toggle = (k) => setLayers((l) => ({ ...l, [k]: !l[k] }));
  const pickCircuit = (id) => { setCircuit(circuit === id ? null : id); setLayers((l) => ({ ...l, elec: true })); };

  const layerButtons = [['dims', 'Cotes', Ruler], ['materials', 'Matériaux', Layers], ['water', 'Eau', Droplets], ['elec', 'Électricité', Zap]];

  return (
    <>
      <PageHeader title="Maison" subtitle={`Plain-pied · ${n(totalArea(), 0)} m² habitables · ${rooms.length} pièces · ${n(H / 100, 2)} m sous plafond`}>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-1" role="group" aria-label="Vue">
            {[['2d', 'Plan 2D'], ['3d', 'Maquette 3D']].map(([id, l]) => <button key={id} aria-pressed={view === id} onClick={() => setView(id)} className={chip(view === id)}>{l}</button>)}
          </div>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Calques">
            {layerButtons.map(([k, l, Icon]) => (
              <button key={k} aria-pressed={layers[k]} onClick={() => toggle(k)} className={`${chip(layers[k])} inline-flex items-center gap-1.5`}>
                <Icon size={14} aria-hidden="true" />{l}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card className="p-3">
          {view === '2d'
            ? <Plan2D layers={layers} finishes={finishes} selectedRoom={room} onSelectRoom={setRoom} selectedCircuit={circuit} />
            : (
              <Suspense fallback={<p className="grid h-96 place-items-center text-sm text-muted" role="status">Chargement de la maquette 3D…</p>}>
                <House3D layers={layers} finishes={finishes} selectedRoom={room} selectedCircuit={circuit} />
              </Suspense>
            )}
          <p className="mt-2 px-2 text-xs text-muted">
            {view === '2d' ? 'Clique une pièce pour voir son détail et changer ses finitions' : 'Glisser pour tourner, molette pour zoomer, clic droit pour se déplacer'}
          </p>
        </Card>

        <Card>
          {selected ? (
            <RoomPanel room={selected} fin={finishes[selected.id]} setFin={(f) => setFinishes({ ...finishes, [selected.id]: f })} />
          ) : (
            <>
              <CardTitle>Synthèse</CardTitle>
              <p className="text-3xl font-semibold tabular-nums">{money(b.total)}</p>
              <p className="text-xs text-muted">Budget fournitures estimé, hors main-d’œuvre</p>
              <ul className="mt-4 divide-y divide-line text-sm">
                {b.sections.map((s) => <li key={s.id} className="flex justify-between py-1.5"><span>{s.title}</span><span className="tabular-nums">{money(s.total)}</span></li>)}
              </ul>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ['Circuits', circuits.length], ['Points électriques', circuits.reduce((s, c) => s + c.points.length, 0)],
                  ['Points d’eau', water.points.length], ['Contrôles OK', `${okCount}/${eChecks.length + wChecks.length}`],
                ].map(([k, v]) => <div key={k} className="rounded-lg bg-canvas p-2"><dt className="text-xs text-muted">{k}</dt><dd className="font-semibold tabular-nums">{v}</dd></div>)}
              </dl>
              <p className="mt-4 text-xs text-muted">Sélectionne une pièce sur le plan pour modifier son sol et ses murs</p>
            </>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Tabs id="house" label="Détails de la maison" value={tab} onChange={setTab} tabs={[
          { id: 'elec', label: 'Électricité' }, { id: 'water', label: 'Plomberie' }, { id: 'bill', label: 'Matériaux et budget' }, { id: 'rooms', label: 'Pièces' },
        ]} />
        <TabPanel id="house" value={tab}>
          {tab === 'elec' && (
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <Card className="overflow-x-auto">
                <CardTitle aside={<span className="text-xs text-muted">Clique un circuit pour le surligner sur le plan</span>}>Circuits du tableau</CardTitle>
                <table className="w-full min-w-[640px] text-sm">
                  <thead><tr className="border-b border-line text-left text-xs text-muted">
                    <th className="pb-2 font-medium">Circuit</th><th className="pb-2 font-medium">Protection</th><th className="pb-2 font-medium">Section</th><th className="pb-2 font-medium">Différentiel</th><th className="pb-2 text-right font-medium">Points</th><th className="pb-2 text-right font-medium">Câble</th>
                  </tr></thead>
                  <tbody className="divide-y divide-line tabular-nums">
                    {circuits.map((c) => (
                      <tr key={c.id} className={circuit === c.id ? 'bg-canvas' : ''}>
                        <td className="py-2"><button onClick={() => pickCircuit(c.id)} aria-pressed={circuit === c.id} className="text-left hover:underline"><span className="font-semibold">{c.id}</span> {c.name}</button></td>
                        <td className="py-2">{c.breaker} A</td>
                        <td className="py-2">{n(c.section)} mm²</td>
                        <td className="py-2">{ids.find((d) => d.circuits.includes(c.id))?.id} · type {c.diff}</td>
                        <td className="py-2 text-right">{c.points.length}</td>
                        <td className="py-2 text-right">{n(circuitRun(c).length)} m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <div className="space-y-4">
                <Card>
                  <CardTitle>Interrupteurs différentiels</CardTitle>
                  <ul className="space-y-2 text-sm">
                    {ids.map((d) => <li key={d.id} className="rounded-lg bg-canvas p-3"><span className="font-semibold">{d.id}</span> · {d.rating} A 30 mA type {d.type}<p className="text-xs text-muted">{d.circuits.join(', ')}</p></li>)}
                  </ul>
                </Card>
                <Card><CardTitle aside={<span className="text-xs text-muted">NF C 15-100 simplifiée</span>}>Contrôles</CardTitle><Checks list={eChecks} /></Card>
              </div>
            </div>
          )}

          {tab === 'water' && (
            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <Card className="overflow-x-auto">
                <CardTitle aside={<span className="text-xs text-muted">Distribution en pieuvre, PER Ø16</span>}>Points d’eau</CardTitle>
                <table className="w-full min-w-[640px] text-sm">
                  <thead><tr className="border-b border-line text-left text-xs text-muted">
                    <th className="pb-2 font-medium">Point</th><th className="pb-2 font-medium">Pièce</th><th className="pb-2 font-medium">Alimentation</th><th className="pb-2 font-medium">Évacuation</th><th className="pb-2 text-right font-medium">Débit</th><th className="pb-2 text-right font-medium">Tubes</th>
                  </tr></thead>
                  <tbody className="divide-y divide-line tabular-nums">
                    {water.points.map((p) => {
                      const len = runs.filter((r) => r.point === p && r.kind !== 'drain').reduce((s, r) => s + r.length, 0);
                      return (
                        <tr key={p.id}>
                          <td className="py-2 font-semibold">{p.name}</td>
                          <td className="py-2">{rooms.find((r) => r.id === p.room).name}</td>
                          <td className="py-2">{[p.cold && 'froide', p.hot && 'chaude'].filter(Boolean).join(' + ')}</td>
                          <td className="py-2">{p.drain ? `PVC Ø${p.drain}` : '—'}</td>
                          <td className="py-2 text-right">{p.flow} L/min</td>
                          <td className="py-2 text-right">{n(len)} m</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-muted">{water.meter.label}, {water.heater.label.toLowerCase()}, nourrices dans le cellier. Évacuations vers le regard extérieur</p>
              </Card>
              <Card><CardTitle>Contrôles</CardTitle><Checks list={wChecks} /></Card>
            </div>
          )}

          {tab === 'bill' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted">Murs extérieurs {n(b.ext)} m² · cloisons {n(b.int)} m² · plafonds {n(b.ceiling)} m². Prix indicatifs TTC, fournitures seules</p>
                <button onClick={() => setFinishes(defaultFinishes)} className={btnGhost}><RotateCcw size={14} aria-hidden="true" />Finitions par défaut</button>
              </div>
              {b.sections.map((s) => (
                <Card key={s.id} className="overflow-x-auto">
                  <CardTitle aside={<span className="font-semibold tabular-nums">{money(s.total)}</span>}>{s.title}</CardTitle>
                  <table className="w-full min-w-[600px] text-sm">
                    <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="pb-2 font-medium">Poste</th><th className="pb-2 text-right font-medium">Quantité</th><th className="pb-2 text-right font-medium">Prix unitaire</th><th className="pb-2 text-right font-medium">Total</th></tr></thead>
                    <tbody className="divide-y divide-line tabular-nums">
                      {s.lines.map((l) => (
                        <tr key={l.item}><td className="py-1.5">{l.item}</td><td className="py-1.5 text-right">{l.qty.toLocaleString('fr-FR')} {l.unit}</td><td className="py-1.5 text-right">{money(l.unitPrice)}</td><td className="py-1.5 text-right">{money(l.total)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ))}
              <Card className="flex items-center justify-between"><span className="font-semibold">Total fournitures</span><span className="text-2xl font-semibold tabular-nums">{money(b.total)}</span></Card>
            </div>
          )}

          {tab === 'rooms' && (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b border-line text-left text-xs text-muted">
                  <th className="pb-2 font-medium">Pièce</th><th className="pb-2 text-right font-medium">Surface</th><th className="pb-2 text-right font-medium">Murs</th><th className="pb-2 font-medium">Sol</th><th className="pb-2 font-medium">Murs</th><th className="pb-2 text-right font-medium">Finitions</th>
                </tr></thead>
                <tbody className="divide-y divide-line tabular-nums">
                  {rooms.map((r) => {
                    const q = roomQty(r, finishes[r.id]);
                    return (
                      <tr key={r.id} className={room === r.id ? 'bg-canvas' : ''}>
                        <td className="py-2"><button onClick={() => setRoom(r.id)} className="font-semibold hover:underline">{r.name}</button></td>
                        <td className="py-2 text-right">{n(q.area, 2)} m²</td>
                        <td className="py-2 text-right">{n(q.wallArea)} m²</td>
                        <td className="py-2"><span className="mr-1.5 inline-block size-2.5 rounded-sm align-middle" style={{ background: floors[finishes[r.id].floor].color }} aria-hidden="true" />{floors[finishes[r.id].floor].name}</td>
                        <td className="py-2">{wallFinishes[finishes[r.id].wall].name}</td>
                        <td className="py-2 text-right">{money(q.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          )}
        </TabPanel>
      </div>
    </>
  );
}

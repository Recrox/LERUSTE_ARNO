import { H, rooms, walls, water, panel, circuits, floors, layerColors as C, pointLabel } from './data.js';
import { wallDir, wallPoint, openingsOn, waterRuns, circuitRun } from './calc.js';

const pts = (path) => path.map((p) => `${p.x},${p.y}`).join(' ');
const fmt = (cm) => (cm / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 });

function Wall({ w, i }) {
  const { ux, uy, len } = wallDir(w);
  const color = w.ext ? C.wallExt : C.wallInt;
  const segs = [];
  const marks = [];
  let cur = 0;
  for (const o of openingsOn(i)) {
    if (o.at > cur) segs.push([cur, o.at]);
    const a = wallPoint(w, o.at), b = wallPoint(w, o.at + o.w);
    if (o.kind === 'window' || o.kind === 'bay') {
      marks.push(<line key={o.at} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={w.t} strokeOpacity="0.18" />);
      marks.push(<line key={`${o.at}g`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.cold} strokeWidth="3" />);
    } else if (o.kind === 'door' || o.kind === 'entry') {
      // Battant perpendiculaire au mur + arc d'ouverture.
      const nx = -uy, ny = ux;
      const leaf = { x: a.x + nx * o.w, y: a.y + ny * o.w };
      marks.push(<line key={o.at} x1={a.x} y1={a.y} x2={leaf.x} y2={leaf.y} stroke={color} strokeWidth="3" />);
      marks.push(<path key={`${o.at}a`} d={`M ${leaf.x} ${leaf.y} A ${o.w} ${o.w} 0 0 0 ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="6 5" />);
    }
    cur = o.at + o.w;
  }
  if (cur < len) segs.push([cur, len]);
  return (
    <g>
      {segs.map(([s, e]) => {
        const a = wallPoint(w, s), b = wallPoint(w, e);
        return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={w.t} strokeLinecap="square" />;
      })}
      {marks}
    </g>
  );
}

function ElecPoint({ p, dim }) {
  const common = { opacity: dim ? 0.35 : 1 };
  const title = <title>{p.label ?? pointLabel[p.k]}</title>;
  if (p.k === 'light') return <g {...common}>{title}<circle cx={p.x} cy={p.y} r="13" fill="none" stroke={C.cable} strokeWidth="3" /><path d={`M ${p.x - 9} ${p.y - 9} L ${p.x + 9} ${p.y + 9} M ${p.x + 9} ${p.y - 9} L ${p.x - 9} ${p.y + 9}`} stroke={C.cable} strokeWidth="3" /></g>;
  if (p.k === 'switch') return <g {...common}>{title}<rect x={p.x - 8} y={p.y - 8} width="16" height="16" rx="3" fill={C.cable} /></g>;
  if (p.k === 'special') return <g {...common}>{title}<path d={`M ${p.x} ${p.y - 12} L ${p.x + 12} ${p.y} L ${p.x} ${p.y + 12} L ${p.x - 12} ${p.y} Z`} fill={C.cable} /></g>;
  return <g {...common}>{title}<circle cx={p.x} cy={p.y} r="9" fill={C.cable} /><circle cx={p.x} cy={p.y} r="4" className="fill-surface" /></g>;
}

export default function Plan2D({ layers, finishes, selectedRoom, onSelectRoom, selectedCircuit }) {
  const { runs, feeders } = layers.water ? waterRuns() : { runs: [], feeders: [] };

  return (
    <svg viewBox="-90 -90 1380 1080" className="h-auto w-full select-none" role="group" aria-label={`Plan de la maison, ${rooms.length} pièces. Hauteur sous plafond ${fmt(H)} m`}>
      {rooms.map((r) => {
        const sel = r.id === selectedRoom;
        const fill = layers.materials ? floors[finishes[r.id].floor].color : undefined;
        return (
          <g
            key={r.id}
            role="button"
            tabIndex={0}
            aria-pressed={sel}
            aria-label={`${r.name}, ${((r.w * r.h) / 1e4).toLocaleString('fr-FR')} m²`}
            onClick={() => onSelectRoom(sel ? null : r.id)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectRoom(sel ? null : r.id); } }}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-focus"
          >
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={fill} fillOpacity={fill ? 0.55 : 1} className={`${fill ? '' : 'fill-surface'} ${sel ? 'stroke-data' : 'stroke-transparent'} transition-colors hover:fill-canvas`} strokeWidth="8" />
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 6} textAnchor="middle" className="fill-ink text-[26px] font-semibold">{r.name}</text>
            <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 24} textAnchor="middle" className="fill-muted text-[22px]">
              {((r.w * r.h) / 1e4).toLocaleString('fr-FR')} m²{layers.dims ? ` · ${fmt(r.w)} × ${fmt(r.h)}` : ''}
            </text>
          </g>
        );
      })}

      {walls.map((w, i) => <Wall key={i} w={w} i={i} />)}

      {layers.dims && (
        <g className="fill-muted stroke-muted text-[22px]" aria-hidden="true">
          <line x1="0" y1="-55" x2="1200" y2="-55" strokeWidth="2" />
          <line x1="0" y1="-70" x2="0" y2="-40" strokeWidth="2" /><line x1="1200" y1="-70" x2="1200" y2="-40" strokeWidth="2" />
          <text x="600" y="-65" textAnchor="middle" stroke="none">12,00 m</text>
          <line x1="-55" y1="0" x2="-55" y2="900" strokeWidth="2" />
          <line x1="-70" y1="0" x2="-40" y2="0" strokeWidth="2" /><line x1="-70" y1="900" x2="-40" y2="900" strokeWidth="2" />
          <text x="-65" y="450" textAnchor="middle" stroke="none" transform="rotate(-90 -65 450)">9,00 m</text>
        </g>
      )}

      {layers.water && (
        <g aria-label="Réseau d’eau">
          {[...runs, ...feeders].map((r, i) => (
            <polyline key={i} points={pts(r.path)} fill="none" stroke={C[r.kind]} strokeWidth={r.kind === 'drain' ? 7 : 4} strokeOpacity={r.kind === 'drain' ? 0.45 : 0.9} strokeDasharray={r.kind === 'hot' ? '10 6' : undefined} transform={r.kind === 'hot' ? 'translate(6 6)' : undefined} />
          ))}
          {water.points.map((p) => (
            <g key={p.id}><title>{p.name}</title><circle cx={p.x} cy={p.y} r="14" className="fill-surface" stroke={C.cold} strokeWidth="4" /><circle cx={p.x} cy={p.y} r="5" fill={p.hot ? C.hot : C.cold} /></g>
          ))}
          {[water.meter, water.heater, water.manifoldCold, water.manifoldHot, water.sewer].map((s) => (
            <g key={s.label}><title>{s.label}</title><rect x={s.x - 14} y={s.y - 14} width="28" height="28" rx="4" fill={s === water.sewer ? C.drain : s === water.heater || s === water.manifoldHot ? C.hot : C.cold} /></g>
          ))}
        </g>
      )}

      {layers.elec && (
        <g aria-label="Réseau électrique">
          {circuits.map((c) => {
            const dim = selectedCircuit && selectedCircuit !== c.id;
            return (
              <g key={c.id}>
                <polyline points={pts(circuitRun(c).path)} fill="none" stroke={C.cable} strokeWidth={selectedCircuit === c.id ? 5 : 2} strokeOpacity={dim ? 0.12 : 0.7} />
                {c.points.map((p, i) => <ElecPoint key={i} p={p} dim={dim} />)}
              </g>
            );
          })}
          <g><title>{panel.label}</title><rect x={panel.x - 22} y={panel.y - 14} width="44" height="28" rx="4" className="fill-ink" /><text x={panel.x} y={panel.y + 7} textAnchor="middle" className="fill-surface text-[18px] font-bold">TGBT</text></g>
        </g>
      )}
    </svg>
  );
}

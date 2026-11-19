import { motion } from 'framer-motion';
import { patternOf } from '../training.js';

// Silhouette de profil (repère 0-100, sol à y = 90) : position de départ → position d'arrivée, en boucle.
// head, S épaule, E coude, W poignet, H hanche, K genou, F pied ; K2/F2 = seconde jambe.
const N = { head: [50, 14], S: [50, 25], E: [50, 39], W: [50, 52], H: [50, 53], K: [50, 71], F: [50, 90] };
const poses = {
  bench: [
    { head: [22, 55], S: [30, 58], E: [30, 69], W: [32, 50], H: [58, 58], K: [72, 56], F: [76, 88] },
    { head: [22, 55], S: [30, 58], E: [31, 44], W: [32, 32], H: [58, 58], K: [72, 56], F: [76, 88] }],
  pushup: [
    { head: [80, 58], S: [72, 63], E: [72, 75], W: [72, 88], H: [44, 72], K: [28, 80], F: [12, 87] },
    { head: [81, 76], S: [72, 80], E: [62, 78], W: [72, 88], H: [44, 82], K: [28, 85], F: [12, 87] }],
  dip: [
    { head: [50, 12], S: [50, 23], E: [51, 37], W: [50, 50], H: [49, 52], K: [44, 68], F: [34, 74] },
    { head: [55, 28], S: [52, 37], E: [38, 40], W: [50, 50], H: [47, 64], K: [43, 80], F: [33, 85] }],
  press: [
    { ...N, E: [57, 35], W: [55, 24] },
    { ...N, E: [51, 13], W: [50, 3] }],
  raise: [
    { ...N, W: [51, 52] },
    { ...N, E: [63, 27], W: [76, 27] }],
  pull: [
    { head: [56, 21], S: [50, 27], E: [50, 16], W: [50, 6], H: [50, 55], K: [50, 73], F: [48, 90] },
    { head: [56, 6], S: [50, 16], E: [42, 22], W: [50, 6], H: [50, 44], K: [50, 62], F: [48, 79] }],
  row: [
    { head: [77, 37], S: [69, 41], E: [69, 55], W: [69, 68], H: [40, 52], K: [46, 71], F: [44, 90] },
    { head: [77, 37], S: [69, 41], E: [55, 35], W: [61, 50], H: [40, 52], K: [46, 71], F: [44, 90] }],
  hinge: [
    { head: [74, 43], S: [66, 47], E: [63, 61], W: [61, 74], H: [40, 58], K: [50, 72], F: [48, 90] },
    { ...N, F: [48, 90] }],
  squat: [
    { ...N, E: [41, 31], W: [46, 23], K: [52, 71] },
    { head: [55, 32], S: [48, 42], E: [39, 48], W: [44, 40], H: [34, 66], K: [58, 68], F: [50, 90] }],
  lunge: [
    { ...N, K: [62, 70], F: [66, 90], K2: [42, 71], F2: [32, 88] },
    { head: [50, 28], S: [50, 39], E: [50, 53], W: [50, 66], H: [50, 66], K: [66, 67], F: [66, 90], K2: [44, 87], F2: [28, 86] }],
  bridge: [
    { head: [18, 52], S: [27, 57], E: [36, 66], W: [46, 74], H: [46, 82], K: [66, 66], F: [70, 90] },
    { head: [18, 52], S: [27, 57], E: [38, 60], W: [48, 58], H: [50, 60], K: [68, 62], F: [70, 90] }],
  curl: [
    { ...N, W: [51, 53] },
    { ...N, W: [57, 28] }],
  core: [
    { head: [20, 82], S: [28, 84], E: [20, 84], W: [12, 84], H: [55, 86], K: [72, 86], F: [88, 86] },
    { head: [23, 74], S: [30, 79], E: [22, 76], W: [14, 72], H: [55, 86], K: [71, 79], F: [86, 70] }],
  carry: [
    { ...N, W: [52, 54], K: [55, 71], F: [58, 90], K2: [46, 71], F2: [42, 90] },
    { ...N, W: [52, 54], K: [46, 71], F: [42, 90], K2: [55, 71], F2: [58, 90] }],
  calf: [
    N,
    { head: [50, 10], S: [50, 21], E: [50, 35], W: [50, 48], H: [50, 49], K: [50, 67], F: [52, 90] }],
  jump: [
    { head: [56, 34], S: [52, 43], E: [44, 54], W: [36, 58], H: [38, 62], K: [56, 70], F: [50, 90] },
    { head: [50, 6], S: [50, 16], E: [53, 7], W: [55, 2], H: [50, 43], K: [50, 61], F: [50, 78] }],
  kneel: [
    { head: [40, 26], S: [40, 37], E: [46, 48], W: [40, 50], H: [40, 62], K: [40, 88], F: [22, 88] },
    { head: [80, 52], S: [72, 57], E: [80, 66], W: [88, 74], H: [56, 70], K: [40, 88], F: [22, 88] }],
};

const limbs = [['S', 'E'], ['E', 'W'], ['S', 'H'], ['H', 'K'], ['K', 'F'], ['H', 'K2'], ['K2', 'F2']];
const loop = { duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', repeatDelay: 0.3 };

function Seg({ a, b, from, to }) {
  if (!from[a] || !from[b]) return null;
  const tb = to[b] ?? from[b], ta = to[a] ?? from[a];
  return (
    <motion.line
      initial={false}
      animate={{ x1: [from[a][0], ta[0]], y1: [from[a][1], ta[1]], x2: [from[b][0], tb[0]], y2: [from[b][1], tb[1]] }}
      transition={loop}
    />
  );
}

function Gear({ equipment, from, to }) {
  const at = (p) => ({ cx: [from[p][0], to[p][0]], cy: [from[p][1], to[p][1]] });
  if (equipment === 'Barre') return <motion.circle r="7" initial={false} animate={at('W')} transition={loop} className="fill-none stroke-data" strokeWidth="3" />;
  if (equipment === 'Haltères') return <motion.circle r="3.5" initial={false} animate={at('W')} transition={loop} className="fill-data stroke-data" strokeWidth="5" />;
  if (equipment === 'Kettlebell') return <motion.circle r="5" initial={false} animate={{ cx: [from.W[0], to.W[0]], cy: [from.W[1] + 5, to.W[1] + 5] }} transition={loop} className="fill-data" />;
  if (equipment === 'Poulie' || equipment === 'Élastique') {
    return <motion.line x2="96" y2={equipment === 'Poulie' ? 12 : 60} initial={false} animate={{ x1: [from.W[0], to.W[0]], y1: [from.W[1], to.W[1]] }} transition={loop} className="stroke-data" strokeWidth="1.5" strokeDasharray="3 3" />;
  }
  return null;
}

export default function ExercisePicto({ exercise, className = '' }) {
  const pattern = patternOf[exercise.name];
  const [from, to] = poses[pattern] ?? [N, N];
  return (
    <svg viewBox="0 -4 100 100" className={`text-ink ${className}`} aria-hidden="true">
      <line x1="4" y1="91" x2="96" y2="91" className="stroke-line" strokeWidth="2" />
      {(pattern === 'bench' || pattern === 'bridge') && <rect x={pattern === 'bench' ? 16 : 6} y="61" width={pattern === 'bench' ? 50 : 22} height="5" rx="1.5" className="fill-line" />}
      {pattern === 'pull' && <line x1="30" y1="6" x2="70" y2="6" className="stroke-muted" strokeWidth="2.5" />}
      {pattern === 'dip' && <line x1="38" y1="51" x2="62" y2="51" className="stroke-muted" strokeWidth="2.5" />}
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        {limbs.map(([a, b]) => <Seg key={a + b} a={a} b={b} from={from} to={to} />)}
      </g>
      <motion.circle r="6" initial={false} animate={{ cx: [from.head[0], to.head[0]], cy: [from.head[1], to.head[1]] }} transition={loop} fill="currentColor" />
      <Gear equipment={exercise.equipment} from={from} to={to} />
    </svg>
  );
}

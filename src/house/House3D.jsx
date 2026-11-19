import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { H, rooms, walls, openings, openingSpec, water, panel, circuits, pointHeight, floors, layerColors as C } from './data.js';
import { wallDir, wallPieces, wallPoint, waterRuns, circuitRun } from './calc.js';

// Plan (x, y) en cm → monde (x, hauteur, y) en mètres.
const V = (x, z, y) => new THREE.Vector3(x / 100, z / 100, y / 100);

function tube(path, z, radius, color) {
  const curve = new THREE.CurvePath();
  for (let i = 1; i < path.length; i++) curve.add(new THREE.LineCurve3(V(path[i - 1].x, z, path[i - 1].y), V(path[i].x, z, path[i].y)));
  return new THREE.Mesh(new THREE.TubeGeometry(curve, path.length * 12, radius, 6, false), new THREE.MeshStandardMaterial({ color }));
}

export default function House3D({ layers, finishes, selectedRoom, selectedCircuit }) {
  const host = useRef(null);
  const scene = useRef(null);

  useEffect(() => {
    const el = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const s = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.position.set(-4, 14, 20);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(6, 0, 4.5);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2.05;
    s.add(new THREE.HemisphereLight(0xffffff, 0x50506a, 1.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(-6, 14, 8);
    s.add(sun);

    const g = { floors: new THREE.Group(), walls: new THREE.Group(), water: new THREE.Group(), elec: new THREE.Group(), floorMesh: {}, cables: {} };

    for (const r of rooms) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(r.w / 100, 0.04, r.h / 100), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      mesh.position.copy(V(r.x + r.w / 2, -2, r.y + r.h / 2));
      g.floorMesh[r.id] = mesh;
      g.floors.add(mesh);
    }

    walls.forEach((w, i) => {
      const { ux, uy, len } = wallDir(w);
      const mat = new THREE.MeshStandardMaterial({ color: w.ext ? 0xe6e2ee : 0xf6f4fa });
      for (const p of wallPieces(i)) {
        // Prolonge les extrémités d'une demi-épaisseur pour fermer les angles.
        const a = p.a === 0 ? -w.t / 2 : p.a;
        const b = p.b === len ? len + w.t / 2 : p.b;
        const mid = wallPoint(w, (a + b) / 2);
        const box = new THREE.Mesh(new THREE.BoxGeometry((b - a) / 100, (p.z1 - p.z0) / 100, w.t / 100), mat);
        box.position.copy(V(mid.x, (p.z0 + p.z1) / 2, mid.y));
        box.rotation.y = Math.atan2(-uy, ux);
        g.walls.add(box);
      }
    });
    const glass = new THREE.MeshStandardMaterial({ color: 0x8fb7f0, transparent: true, opacity: 0.35 });
    for (const o of openings.filter((x) => x.kind === 'window' || x.kind === 'bay')) {
      const w = walls[o.wall];
      const { ux, uy } = wallDir(w);
      const sp = openingSpec[o.kind];
      const mid = wallPoint(w, o.at + o.w / 2);
      const pane = new THREE.Mesh(new THREE.BoxGeometry(o.w / 100, (sp.z1 - sp.z0) / 100, 0.02), glass);
      pane.position.copy(V(mid.x, (sp.z0 + sp.z1) / 2, mid.y));
      pane.rotation.y = Math.atan2(-uy, ux);
      g.walls.add(pane);
    }

    const { runs, feeders } = waterRuns();
    for (const r of [...runs, ...feeders]) g.water.add(tube(r.path, r.kind === 'drain' ? -6 : r.kind === 'hot' ? 8 : 4, r.kind === 'drain' ? 0.04 : 0.016, C[r.kind]));
    for (const p of water.points) {
      const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 12), new THREE.MeshStandardMaterial({ color: p.hot ? C.hot : C.cold }));
      dot.position.copy(V(p.x, 45, p.y));
      g.water.add(dot);
    }
    const heater = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.5, 24), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    heater.position.copy(V(water.heater.x, 95, water.heater.y));
    g.water.add(heater);

    const cableMat = (id) => new THREE.LineBasicMaterial({ color: C.cable, transparent: true, opacity: 0.8, userData: { id } });
    for (const c of circuits) {
      const { path } = circuitRun(c);
      const seg = [];
      for (let i = 1; i < path.length; i++) seg.push(V(path[i - 1].x, H - 2, path[i - 1].y), V(path[i].x, H - 2, path[i].y));
      for (const p of c.points) seg.push(V(p.x, H - 2, p.y), V(p.x, pointHeight[p.k], p.y));
      const lines = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(seg), cableMat(c.id));
      g.cables[c.id] = lines;
      g.elec.add(lines);
      for (const p of c.points) {
        const mesh = new THREE.Mesh(
          p.k === 'light' ? new THREE.SphereGeometry(0.09, 16, 12) : new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.MeshStandardMaterial({ color: C.cable, emissive: p.k === 'light' ? C.cable : 0x000000, emissiveIntensity: 0.6 }),
        );
        mesh.position.copy(V(p.x, pointHeight[p.k], p.y));
        g.elec.add(mesh);
      }
    }
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.15), new THREE.MeshStandardMaterial({ color: 0x2b2842 }));
    box.position.copy(V(panel.x, 180, panel.y));
    g.elec.add(box);

    s.add(g.floors, g.walls, g.water, g.elec);
    scene.current = g;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();
    let raf;
    const loop = () => { controls.update(); renderer.render(s, camera); raf = requestAnimationFrame(loop); };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      s.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
      renderer.dispose();
      el.removeChild(renderer.domElement);
      scene.current = null;
    };
  }, []);

  useEffect(() => {
    const g = scene.current;
    if (!g) return;
    g.water.visible = layers.water;
    g.elec.visible = layers.elec;
    for (const r of rooms) {
      const mat = g.floorMesh[r.id].material;
      mat.color.set(layers.materials ? floors[finishes[r.id].floor].color : '#f2f0f7');
      mat.emissive.set(r.id === selectedRoom ? 0x4a3fb0 : 0x000000);
      mat.emissiveIntensity = r.id === selectedRoom ? 0.35 : 0;
    }
    for (const [id, line] of Object.entries(g.cables)) line.material.opacity = selectedCircuit && selectedCircuit !== id ? 0.1 : 0.85;
  }, [layers, finishes, selectedRoom, selectedCircuit]);

  return (
    <div ref={host} className="h-[min(70vh,620px)] w-full cursor-grab overflow-hidden rounded-lg bg-canvas active:cursor-grabbing" role="img" aria-label="Maquette 3D de la maison : glisser pour tourner, molette pour zoomer, clic droit pour se déplacer" />
  );
}

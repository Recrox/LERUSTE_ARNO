import { useState } from 'react';
import { Briefcase, FolderGit2, Wallet, Dumbbell, Info } from 'lucide-react';
import { Card, CardTitle } from '../components/Card.jsx';
import PageHeader from '../components/PageHeader.jsx';

const roles = [
  { id: 'owner', name: 'Propriétaire', desc: 'Accès complet, ne peut pas être restreint', people: ['AL'], locked: true },
  { id: 'bizzdev', name: 'Collègues BizzDev', desc: 'Suivent le sprint et les projets', people: ['SM', 'KB', 'JD'] },
  { id: 'coach', name: 'Coach', desc: 'Suit les séances et les records', people: [] },
  { id: 'family', name: 'Proches', desc: 'Voient l’essentiel de la semaine', people: [] },
];

const groups = [
  { id: 'work', name: 'Boulot', icon: Briefcase, perms: [['sprint', 'Voir le sprint BizzDev'], ['team', 'Voir l’équipe']] },
  { id: 'projects', name: 'Projets', icon: FolderGit2, perms: [['list', 'Voir les projets'], ['commits', 'Voir les commits'], ['links', 'Ouvrir les liens en ligne']] },
  { id: 'money', name: 'Portefeuille', icon: Wallet, perms: [['total', 'Voir la valeur totale'], ['lines', 'Voir les lignes'], ['pnl', 'Voir les plus et moins-values']] },
  { id: 'sport', name: 'Entraînement', icon: Dumbbell, perms: [['sessions', 'Voir les séances'], ['records', 'Voir les records']] },
];

const allKeys = groups.flatMap((g) => g.perms.map(([p]) => `${g.id}.${p}`));
const grant = (...keys) => Object.fromEntries(allKeys.map((k) => [k, keys.some((g) => k.startsWith(g))]));
const initial = {
  owner: grant(''),
  bizzdev: grant('work.', 'projects.'),
  coach: grant('sport.'),
  family: grant('sport.sessions'),
};

function Switch({ checked, onChange, label, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-data' : 'bg-muted/50'}`}
    >
      <span className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

export default function Roles() {
  const [perms, setPerms] = useState(initial);
  const [selected, setSelected] = useState('bizzdev');
  const [log, setLog] = useState([]);
  const role = roles.find((r) => r.id === selected);
  const count = (id) => Object.values(perms[id]).filter(Boolean).length;

  const set = (keys, value) => {
    setPerms((p) => ({ ...p, [selected]: { ...p[selected], ...Object.fromEntries(keys.map((k) => [k, value])) } }));
    const what = keys.length === 1 ? `« ${groups.flatMap((g) => g.perms.map(([id, l]) => [`${g.id}.${id}`, l])).find(([k]) => k === keys[0])[1]} »` : `tout le groupe ${groups.find((g) => keys[0].startsWith(g.id)).name}`;
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setLog((l) => [{ id: Date.now(), text: `${value ? 'Accès donné' : 'Accès retiré'} : ${what} pour ${role.name}`, time }, ...l]);
  };

  return (
    <>
      <PageHeader title="Rôles et permissions" subtitle="Décide qui peut voir quelle partie de ton tableau de bord" />
      <p className="mb-4 flex items-start gap-2 rounded-xl bg-lime/40 px-4 py-3 text-sm">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        Aperçu : ces réglages ne sont pas encore reliés à une connexion et ne sont pas sauvegardés. Toute personne qui a le lien voit tout le site
      </p>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ul className="space-y-2" aria-label="Rôles">
          {roles.map((r) => (
            <li key={r.id}>
              <button
                aria-pressed={r.id === selected}
                onClick={() => setSelected(r.id)}
                className={`w-full rounded-xl p-4 text-left transition-colors ${r.id === selected ? 'bg-night text-white' : 'bg-surface hover:bg-line/60'}`}
              >
                <span className="flex justify-between text-sm font-semibold">{r.name}<span className={`text-xs font-normal tabular-nums ${r.id === selected ? 'text-white/60' : 'text-muted'}`}>{count(r.id)} sur {allKeys.length}</span></span>
                <span className={`mt-0.5 block text-xs ${r.id === selected ? 'text-white/70' : 'text-muted'}`}>{r.desc}</span>
                <span className={`mt-2 block text-xs ${r.id === selected ? 'text-white/60' : 'text-muted'}`}>
                  {r.people.length ? `${r.people.join(', ')} · ${r.people.length} personne${r.people.length > 1 ? 's' : ''}` : 'Personne pour l’instant'}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Card key={selected}>
          <CardTitle aside={<span className="text-xs text-muted">{count(selected)} permissions actives</span>}>{role.name}</CardTitle>
          <div className="grid gap-3 md:grid-cols-2">
            {groups.map(({ id, name, icon: Icon, perms: list }) => {
              const keys = list.map(([p]) => `${id}.${p}`);
              const on = keys.filter((k) => perms[selected][k]).length;
              return (
                <section key={id} className="rounded-lg bg-canvas p-4" aria-label={name}>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold"><Icon size={16} aria-hidden="true" />{name} <span className="text-xs font-normal text-muted tabular-nums">{on}/{keys.length}</span></h3>
                    {!role.locked && (
                      <button onClick={() => set(keys, on < keys.length)} className="text-xs font-medium text-muted hover:text-ink">
                        {on < keys.length ? 'Tout autoriser' : 'Tout retirer'}
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {list.map(([p, label]) => {
                      const k = `${id}.${p}`;
                      return (
                        <li key={k} className="flex items-center justify-between gap-3 text-sm">
                          <span>{label}</span>
                          <Switch checked={perms[selected][k]} onChange={() => set([k], !perms[selected][k])} label={label} disabled={role.locked} />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </Card>
      </div>

      <Card delay={0.1} className="mt-4">
        <CardTitle aside={<span className="text-xs text-muted">Plus récent en premier</span>}>Journal des modifications</CardTitle>
        {log.length === 0 ? (
          <p role="status" className="text-sm text-muted">Aucune modification pour l’instant</p>
        ) : (
          <ul className="divide-y divide-line" aria-live="polite">
            {log.map((e) => (
              <li key={e.id} className="flex justify-between gap-3 py-2 text-sm"><span>{e.text}</span><span className="shrink-0 tabular-nums text-muted">{e.time}</span></li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

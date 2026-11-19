import { useRef, useState } from 'react';
import { Plus, Upload, Trash2, Search } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { categories, kindOf, parseRevolutCsv, autoCategory } from '../../money/ledger.js';
import { money, isoDate, tone } from '../../format.js';
import { field, btnPrimary, btnGhost } from '../../ui.js';

const allCats = [...categories.income, ...categories.expense, ...categories.transfer];

export default function Transactions({ txs, setTxs, month }) {
  const [form, setForm] = useState({ date: isoDate(), label: '', amount: '', kind: 'expense', category: 'Courses' });
  const [filter, setFilter] = useState({ month, category: '', q: '' });
  const [report, setReport] = useState(null);
  const fileRef = useRef(null);

  const add = (e) => {
    e.preventDefault();
    const v = Math.abs(Number(String(form.amount).replace(',', '.')));
    if (!form.label.trim() || !(v > 0)) return;
    const amount = form.kind === 'income' ? v : -v;
    setTxs([{ id: `m-${Date.now()}`, date: form.date, label: form.label.trim(), amount, currency: 'EUR', category: form.category }, ...txs]);
    setForm({ ...form, label: '', amount: '' });
  };

  const importCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { rows, skipped, error } = parseRevolutCsv(await file.text());
    e.target.value = '';
    if (error) { setReport({ ok: false, text: error }); return; }
    const known = new Set(txs.map((t) => `${t.date}|${t.label}|${t.amount}`));
    const fresh = rows.filter((r) => !known.has(`${r.date}|${r.label}|${r.amount}`));
    setTxs([...fresh, ...txs]);
    setReport({ ok: true, text: `${fresh.length} opérations importées, ${rows.length - fresh.length} déjà présentes, ${skipped} ignorées (en attente ou annulées)` });
  };

  const q = filter.q.trim().toLowerCase();
  const list = txs
    .filter((t) => (!filter.month || t.date.startsWith(filter.month)) && (!filter.category || t.category === filter.category) && t.label.toLowerCase().includes(q))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
      <Card className="overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input type="month" value={filter.month} onChange={(e) => setFilter({ ...filter, month: e.target.value })} aria-label="Mois" className={field} />
          <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} aria-label="Catégorie" className={field}>
            <option value="">Toutes catégories</option>
            {allCats.map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className={`${field} flex items-center gap-2 focus-within:outline-2 focus-within:outline-focus`}>
            <Search size={14} className="text-muted" aria-hidden="true" /><span className="sr-only">Rechercher</span>
            <input value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} placeholder="Libellé" className="w-36 bg-transparent outline-none" />
          </label>
          <button onClick={() => setFilter({ month: '', category: '', q: '' })} className={btnGhost}>Tout voir</button>
          <span className="ml-auto text-sm text-muted tabular-nums" role="status">{list.length} opérations · {money(list.reduce((s, t) => s + t.amount, 0))}</span>
        </div>
        {list.length === 0 ? <p className="py-8 text-center text-sm text-muted">Aucune opération pour ces filtres</p> : (
          <table className="w-full min-w-[620px] text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="pb-2 font-medium">Date</th><th className="pb-2 font-medium">Libellé</th><th className="pb-2 font-medium">Catégorie</th><th className="pb-2 text-right font-medium">Montant</th><th /></tr></thead>
            <tbody className="divide-y divide-line tabular-nums">
              {list.slice(0, 300).map((t) => (
                <tr key={t.id}>
                  <td className="py-1.5 whitespace-nowrap">{t.date}</td>
                  <td className="max-w-64 truncate py-1.5">{t.label}</td>
                  <td className="py-1.5">
                    <select value={t.category} onChange={(e) => setTxs(txs.map((x) => (x.id === t.id ? { ...x, category: e.target.value } : x)))} aria-label={`Catégorie de ${t.label}`} className="rounded bg-transparent text-sm">
                      {allCats.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className={`py-1.5 text-right ${kindOf(t.category) === 'transfer' ? 'text-muted' : tone(t.amount)}`}>{money(t.amount, t.currency || 'EUR')}</td>
                  <td className="py-1.5 text-right"><button onClick={() => setTxs(txs.filter((x) => x.id !== t.id))} aria-label={`Supprimer ${t.label}`} className="rounded p-1 text-muted hover:text-ink"><Trash2 size={14} aria-hidden="true" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {list.length > 300 && <p className="mt-2 text-xs text-muted">300 premières affichées, affine les filtres pour voir le reste</p>}
      </Card>

      <div className="space-y-4">
        <Card>
          <CardTitle>Importer un relevé Revolut</CardTitle>
          <p className="text-sm text-muted">Dans l’app Revolut : compte, Relevé, format Excel/CSV. Les catégories sont devinées (Colruyt, SNCB, Basic-Fit…) et modifiables</p>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={importCsv} className="sr-only" id="csv" />
          <button onClick={() => fileRef.current.click()} className={`${btnPrimary} mt-3 w-full`}><Upload size={14} aria-hidden="true" />Choisir le fichier CSV</button>
          {report && <p role="status" className={`mt-2 text-xs ${report.ok ? 'text-up' : 'text-down'}`}>{report.text}</p>}
          <p className="mt-2 text-xs text-muted">Le fichier est lu dans ton navigateur, rien n’est envoyé</p>
        </Card>
        <Card>
          <CardTitle>Ajouter à la main</CardTitle>
          <form onSubmit={add} className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex gap-1" role="group" aria-label="Type">
              {[['expense', 'Dépense'], ['income', 'Revenu']].map(([k, l]) => (
                <button type="button" key={k} aria-pressed={form.kind === k} onClick={() => setForm({ ...form, kind: k, category: categories[k][0] })} className={`flex-1 rounded-lg px-3 py-1.5 text-sm ${form.kind === k ? 'bg-night text-white' : 'bg-canvas'}`}>{l}</button>
              ))}
            </div>
            <label className="col-span-2 text-xs text-muted">Libellé<input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value, category: form.label ? form.category : autoCategory(e.target.value, form.kind === 'income' ? 1 : -1) })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Montant (€)<input inputMode="decimal" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required className={`${field} mt-1 block w-full`} /></label>
            <label className="text-xs text-muted">Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
            <label className="col-span-2 text-xs text-muted">Catégorie
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${field} mt-1 block w-full`}>
                {categories[form.kind].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <button className={`${btnPrimary} col-span-2`}><Plus size={14} aria-hidden="true" />Ajouter</button>
          </form>
        </Card>
      </div>
    </div>
  );
}

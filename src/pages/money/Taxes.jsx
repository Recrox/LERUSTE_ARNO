import { Card, CardTitle } from '../../components/Card.jsx';
import { ipp, monthlyNet, taxYears } from '../../money/tax.js';
import { money } from '../../format.js';
import { field, chip } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.')) || 0;
const pc = (r) => `${(r * 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %`;

export default function Taxes({ input, setInput }) {
  const year = Number(input.year);
  const r = ipp({ gross: num(input.gross), year, withheld: num(input.withheld), realCosts: num(input.realCosts), pension: num(input.pension), gifts: num(input.gifts), communal: num(input.communal) / 100 });
  const m = monthlyNet(num(input.gross) / 13.92, year, num(input.communal) / 100);
  const set = (k) => (e) => setInput({ ...input, [k]: e.target.value });
  const steps = [
    ['Salaire brut annuel', r.gross],
    [`Cotisations ONSS (13,07 %)`, -r.onss],
    [`Frais professionnels ${r.costsKind}`, -r.costs],
    ['Revenu net imposable', r.net, true],
    ['Impôt selon le barème', r.base.total],
    [`Quotité exemptée (${money(taxYears[year].exempt)})`, -r.exemptRelief],
    ['Réduction épargne-pension', -r.pensionRelief],
    ['Réduction pour dons', -r.giftRelief],
    ['Impôt fédéral et régional', r.state, true],
    [`Additionnels communaux (${input.communal} %)`, r.municipal],
    ['Impôt total estimé', r.total, true],
    ['Précompte professionnel déjà retenu', -r.withheld],
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardTitle>Ma déclaration IPP</CardTitle>
        <div className="mb-4 flex gap-1" role="group" aria-label="Année de revenus">
          {Object.entries(taxYears).map(([y, p]) => <button key={y} aria-pressed={String(year) === y} onClick={() => setInput({ ...input, year: y })} className={chip(String(year) === y)}>{p.label}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-muted">Brut annuel (fiche 281.10)<input inputMode="decimal" value={input.gross} onChange={set('gross')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Précompte retenu sur l’année<input inputMode="decimal" value={input.withheld} onChange={set('withheld')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Frais réels (0 = forfait)<input inputMode="decimal" value={input.realCosts} onChange={set('realCosts')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Épargne-pension versée<input inputMode="decimal" value={input.pension} onChange={set('pension')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Dons à des associations agréées<input inputMode="decimal" value={input.gifts} onChange={set('gifts')} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Taxe communale (%)<input inputMode="decimal" value={input.communal} onChange={set('communal')} className={`${field} mt-1 block w-full`} /></label>
        </div>
        <table className="mt-5 w-full text-sm">
          <tbody className="divide-y divide-line tabular-nums">
            {steps.map(([k, v, strong]) => <tr key={k} className={strong ? 'font-semibold' : ''}><td className="py-1.5">{k}</td><td className="py-1.5 text-right">{money(v)}</td></tr>)}
          </tbody>
        </table>
        <div className={`mt-4 rounded-lg p-4 ${r.balance >= 0 ? 'bg-up/10' : 'bg-down/10'}`}>
          <p className="text-xs text-muted">{r.balance >= 0 ? 'Remboursement estimé' : 'Supplément à payer estimé'}</p>
          <p className={`text-3xl font-semibold tabular-nums ${r.balance >= 0 ? 'text-up' : 'text-down'}`}>{money(Math.abs(r.balance))}</p>
        </div>
      </Card>

      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-4">
          <Card as="div"><dt className="text-xs text-muted">Taux moyen</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{pc(r.average)}</dd><dd className="text-xs text-muted">impôt / brut</dd></Card>
          <Card as="div"><dt className="text-xs text-muted">Taux marginal</dt><dd className="mt-1 text-2xl font-semibold tabular-nums">{pc(r.marginal)}</dd><dd className="text-xs text-muted">sur 100 € de plus, communes comprises</dd></Card>
        </dl>
        <Card>
          <CardTitle>Ton revenu tranche par tranche</CardTitle>
          <ul className="space-y-2">
            {r.base.parts.map((p) => (
              <li key={p.from}>
                <div className="flex justify-between text-sm"><span>{money(p.from)} à {money(p.to)} · <span className="font-semibold">{pc(p.rate)}</span></span><span className="tabular-nums">{money(p.tax)}</span></div>
                <div className="mt-1 h-2 rounded-full bg-canvas" aria-hidden="true"><div className="h-full rounded-full bg-data" style={{ width: `${(p.rate / 0.5) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle aside={<span className="text-xs text-muted">13,92 mois payés par an</span>}>Fiche de paie mensuelle</CardTitle>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line tabular-nums">
              <tr><td className="py-1.5">Brut mensuel</td><td className="py-1.5 text-right">{money(m.gross)}</td></tr>
              <tr><td className="py-1.5">ONSS</td><td className="py-1.5 text-right">{money(-m.onss)}</td></tr>
              <tr><td className="py-1.5">Précompte professionnel (approché)</td><td className="py-1.5 text-right">{money(-m.withholding)}</td></tr>
              <tr className="font-semibold"><td className="py-1.5">Net mensuel estimé</td><td className="py-1.5 text-right">{money(m.net)}</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted">Brut annuel ÷ 13,92 (12 mois + 13e mois + double pécule). Hors bonus à l’emploi et cotisation spéciale de sécurité sociale : ta fiche de paie fait foi</p>
        </Card>
      </div>
    </div>
  );
}

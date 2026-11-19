import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Card, CardTitle } from '../../components/Card.jsx';
import { tob, tobRates, dividendTax, capitalGainsTax, deadlines } from '../../money/tax.js';
import { portfolio } from '../../data.js';
import { money } from '../../format.js';
import { field } from '../../ui.js';

const num = (v) => Number(String(v).replace(',', '.')) || 0;

export default function Stocks() {
  const [order, setOrder] = useState({ amount: '1000', kind: 'etf' });
  const [div, setDiv] = useState({ gross: '100', foreign: '15' });
  const [gains, setGains] = useState({ gains: '0', losses: '0', exemption: '10000' });
  const d = dividendTax(num(div.gross), num(div.foreign) / 100);
  const g = capitalGainsTax(num(gains.gains), num(gains.losses), num(gains.exemption));
  const unrealized = portfolio.holdings.reduce((s, h) => s + h.pnl, 0);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardTitle>Taxe sur les opérations de bourse (TOB)</CardTitle>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">Montant de l’ordre (€)<input inputMode="decimal" value={order.amount} onChange={(e) => setOrder({ ...order, amount: e.target.value })} className={`${field} mt-1 block w-32`} /></label>
          <label className="w-full min-w-0 text-xs text-muted sm:w-auto">Type de titre
            <select value={order.kind} onChange={(e) => setOrder({ ...order, kind: e.target.value })} className={`${field} mt-1 block w-full max-w-full`}>
              {tobRates.map((r) => <option key={r.id} value={r.id}>{(r.rate * 100).toLocaleString('fr-FR')} % · {r.label}</option>)}
            </select>
          </label>
        </div>
        <p className="mt-4 text-3xl font-semibold tabular-nums">{money(tob(num(order.amount), order.kind))}</p>
        <p className="text-xs text-muted">Due à l’achat et à la vente, plafonnée par opération</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>Revolut est un courtier étranger (Lituanie) : vérifie sur tes relevés si la TOB est retenue. Sinon, c’est à toi de la déclarer</li>
          <li>VUAA est un ETF capitalisant irlandais : son taux dépend de son enregistrement en Belgique, à contrôler sur la fiche de l’ETF</li>
          <li>Actions D-Wave, Quantum Computing, Amazon, NVIDIA : 0,35 %</li>
        </ul>
      </Card>

      <Card>
        <CardTitle aside={<span className="text-xs text-muted">depuis le 1er janvier 2026</span>}>Taxe sur les plus-values (10 %)</CardTitle>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs text-muted">Plus-values réalisées<input inputMode="decimal" value={gains.gains} onChange={(e) => setGains({ ...gains, gains: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Moins-values réalisées<input inputMode="decimal" value={gains.losses} onChange={(e) => setGains({ ...gains, losses: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
          <label className="text-xs text-muted">Exonération annuelle<input inputMode="decimal" value={gains.exemption} onChange={(e) => setGains({ ...gains, exemption: e.target.value })} className={`${field} mt-1 block w-full`} /></label>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">Plus-value nette</dt><dd className="font-semibold tabular-nums">{money(g.net)}</dd></div>
          <div className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">Imposable</dt><dd className="font-semibold tabular-nums">{money(g.taxable)}</dd></div>
          <div className="rounded-lg bg-canvas p-3"><dt className="text-xs text-muted">Taxe</dt><dd className="font-semibold tabular-nums">{money(g.tax)}</dd></div>
        </dl>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>Seules comptent les plus-values réalisées (à la vente) depuis 2026. La valeur de départ est celle du 31 décembre 2025</li>
          <li>Ton portefeuille affiche {money(unrealized)} de résultat latent, mais une bonne partie date d’avant 2026 : vendre à perte aujourd’hui ne crée une moins-value déductible que pour la baisse depuis le 31/12/2025</li>
          <li>Via Revolut, pas de retenue à la source belge : déclaration à faire toi-même</li>
        </ul>
      </Card>

      <Card>
        <CardTitle>Dividendes étrangers</CardTitle>
        <div className="flex flex-wrap gap-3">
          <label className="text-xs text-muted">Dividende brut (€)<input inputMode="decimal" value={div.gross} onChange={(e) => setDiv({ ...div, gross: e.target.value })} className={`${field} mt-1 block w-28`} /></label>
          <label className="text-xs text-muted">Retenue du pays source (%)<input inputMode="decimal" value={div.foreign} onChange={(e) => setDiv({ ...div, foreign: e.target.value })} className={`${field} mt-1 block w-28`} /></label>
        </div>
        <table className="mt-4 w-full text-sm">
          <tbody className="divide-y divide-line tabular-nums">
            <tr><td className="py-1.5">Dividende brut</td><td className="py-1.5 text-right">{money(d.gross)}</td></tr>
            <tr><td className="py-1.5">Retenue à l’étranger (15 % aux États-Unis avec le formulaire W-8BEN)</td><td className="py-1.5 text-right">{money(-d.foreign)}</td></tr>
            <tr><td className="py-1.5">Précompte mobilier belge 30 %</td><td className="py-1.5 text-right">{money(-d.belgian)}</td></tr>
            <tr className="font-semibold"><td className="py-1.5">Net en poche</td><td className="py-1.5 text-right">{money(d.net)}</td></tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted">La retenue étrangère n’est pas récupérable en Belgique. Ton ETF VUAA capitalise : il ne verse pas de dividende</p>
      </Card>

      <Card>
        <CardTitle>Obligations et échéances</CardTitle>
        <ul className="space-y-3">
          {deadlines.map((x) => (
            <li key={x.what} className="flex gap-3 text-sm">
              <CalendarClock size={16} className="mt-0.5 shrink-0 text-muted" aria-hidden="true" />
              <span><span className="font-semibold">{x.when}</span> · {x.what}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

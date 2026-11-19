import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Tabs, { TabPanel } from '../components/Tabs.jsx';
import Overview from './money/Overview.jsx';
import Transactions from './money/Transactions.jsx';
import Taxes from './money/Taxes.jsx';
import Stocks from './money/Stocks.jsx';
import usePersisted from '../usePersisted.js';
import { isoDate } from '../format.js';

export default function Money() {
  const [tab, setTab] = useState('overview');
  const [txs, setTxs] = usePersisted('money-tx', []);
  const [month, setMonth] = useState(isoDate().slice(0, 7));
  const [taxInput, setTaxInput] = usePersisted('money-tax', { year: '2026', gross: '45000', withheld: '9000', realCosts: '0', pension: '1080', gifts: '0', communal: '7' });

  return (
    <>
      <PageHeader title="Comptabilité" subtitle="Revenus, dépenses et impôts belges. Tes opérations restent dans ce navigateur" />
      <Tabs id="money" label="Sections comptabilité" value={tab} onChange={setTab} tabs={[
        { id: 'overview', label: 'Vue du mois' }, { id: 'tx', label: `Opérations${txs.length ? ` (${txs.length})` : ''}` },
        { id: 'tax', label: 'Impôt sur le revenu' }, { id: 'stocks', label: 'Bourse : TOB, plus-values, dividendes' },
      ]} />
      <TabPanel id="money" value={tab}>
        {tab === 'overview' && <Overview txs={txs} month={month} setMonth={setMonth} goTransactions={() => setTab('tx')} />}
        {tab === 'tx' && <Transactions txs={txs} setTxs={setTxs} month={month} />}
        {tab === 'tax' && <Taxes input={taxInput} setInput={setTaxInput} />}
        {tab === 'stocks' && <Stocks />}
      </TabPanel>
      <p className="mt-6 flex items-start gap-2 text-xs text-muted">
        <TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        Estimations pour un salarié isolé, barèmes tirés de sources secondaires et modifiables. Vérifie sur fin.belgium.be ou avec un comptable avant de déclarer
      </p>
    </>
  );
}

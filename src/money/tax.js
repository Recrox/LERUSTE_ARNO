// Fiscalité belge d'un salarié isolé, sans personne à charge. Estimation, pas un calcul officiel :
// les montants viennent de sources secondaires (SPF Finances non consulté directement) et sont modifiables dans l'app.
// shortcut: ni bonus à l'emploi, ni cotisation spéciale de sécurité sociale, ni situation de couple ; à ajouter si besoin.

export const taxYears = {
  2025: { label: 'Revenus 2025 · exercice 2026', brackets: [[16320, 0.25], [28800, 0.4], [49840, 0.45], [Infinity, 0.5]], exempt: 10910, lumpRate: 0.3, lumpCap: 5930, pensionCap: 1050, dividendExempt: 833 },
  2026: { label: 'Revenus 2026 · exercice 2027', brackets: [[16720, 0.25], [29510, 0.4], [51070, 0.45], [Infinity, 0.5]], exempt: 11170, lumpRate: 0.3, lumpCap: 6070, pensionCap: 1080, dividendExempt: 859 }, // épargne-pension et dividendes : indexation estimée, à vérifier
};
export const ONSS = 0.1307;

// Impôt par tranches : renvoie le total et le détail de chaque tranche.
export function byBrackets(income, brackets) {
  let prev = 0, total = 0;
  const parts = [];
  for (const [top, rate] of brackets) {
    const slice = Math.max(0, Math.min(income, top) - prev);
    if (slice > 0) parts.push({ from: prev, to: Math.min(income, top), rate, tax: slice * rate });
    total += slice * rate;
    prev = top;
    if (income <= top) break;
  }
  return { total, parts };
}

// Déclaration IPP simplifiée à partir du brut annuel.
export function ipp({ gross, year = 2026, withheld = 0, realCosts = 0, pension = 0, gifts = 0, communal = 0.07 }) {
  const p = taxYears[year];
  const onss = gross * ONSS;
  const taxable = gross - onss;
  const lump = Math.min(taxable * p.lumpRate, p.lumpCap);
  const costs = realCosts > lump ? realCosts : lump;
  const net = Math.max(0, taxable - costs);
  const base = byBrackets(net, p.brackets);
  const exemptRelief = byBrackets(Math.min(p.exempt, net), p.brackets).total;
  const afterExempt = Math.max(0, base.total - exemptRelief);
  const pensionRelief = 0.3 * Math.min(pension, p.pensionCap);
  const giftRelief = gifts >= 40 ? 0.45 * Math.min(gifts, net * 0.1) : 0;
  const state = Math.max(0, afterExempt - pensionRelief - giftRelief);
  const municipal = state * communal;
  const total = state + municipal;
  const marginal = (p.brackets.find(([top]) => net <= top) ?? p.brackets.at(-1))[1] * (1 + communal);
  return {
    gross, onss, taxable, lump, costs, costsKind: realCosts > lump ? 'réels' : 'forfaitaires', net, base, exemptRelief,
    pensionRelief, giftRelief, state, municipal, total, withheld, balance: withheld - total,
    average: gross ? total / gross : 0, marginal,
  };
}

// Salaire mensuel brut → net, précompte approché par l'impôt annuel / 12 (pas le barème officiel du précompte).
export function monthlyNet(grossMonth, year = 2026, communal = 0.07) {
  const y = ipp({ gross: grossMonth * 12, year, communal });
  const onss = grossMonth * ONSS;
  const withholding = y.total / 12;
  return { gross: grossMonth, onss, withholding, net: grossMonth - onss - withholding };
}

// ---- Bourse ----
export const tobRates = [
  { id: 'share', label: 'Actions, ETF distribuant enregistré en Belgique', rate: 0.0035, cap: 1600 },
  { id: 'etf', label: 'ETF non enregistré en Belgique, obligations', rate: 0.0012, cap: 1300 },
  { id: 'acc', label: 'ETF capitalisant enregistré en Belgique', rate: 0.0132, cap: 4000 },
];
export const tob = (amount, id) => { const r = tobRates.find((x) => x.id === id); return Math.min(amount * r.rate, r.cap); };

// Dividende étranger : retenue à la source du pays, puis précompte mobilier belge de 30 % sur le net reçu.
export function dividendTax(gross, foreignRate = 0.15) {
  const foreign = gross * foreignRate;
  const received = gross - foreign;
  const belgian = received * 0.3;
  return { gross, foreign, received, belgian, net: received - belgian };
}

// Taxe de 10 % sur les plus-values réalisées depuis le 1er janvier 2026, exonération annuelle de 10 000 €.
// Les moins-values réalisées la même année se déduisent des plus-values.
export function capitalGainsTax(gains, losses = 0, exemption = 10000) {
  const net = Math.max(0, gains - losses);
  const taxable = Math.max(0, net - exemption);
  return { net, taxable, tax: taxable * 0.1 };
}

export const deadlines = [
  { when: 'Chaque opération', what: 'TOB : si ton courtier étranger ne la retient pas, déclare-la et paie-la toi-même avant la fin du 2e mois qui suit l’opération (formulaire TOB, SPF Finances)' },
  { when: 'Une seule fois', what: 'Déclarer ton compte Revolut à l’étranger au Point de contact central de la Banque nationale (PCC)' },
  { when: 'Chaque année', what: 'Cocher l’existence de comptes à l’étranger au cadre XIII de la déclaration IPP' },
  { when: 'Mai à juillet', what: 'Déclaration IPP sur MyMinfin (Tax-on-web), souvent préremplie. Vérifie la date limite de l’année sur fin.belgium.be' },
  { when: 'Dès 2027', what: 'Plus-values 2026 réalisées via un courtier étranger : à déclarer toi-même dans ta déclaration IPP' },
  { when: 'Chaque année', what: 'Récupérer le précompte mobilier sur la première tranche de dividendes exonérée (833 € sur les revenus 2025) via la déclaration' },
];

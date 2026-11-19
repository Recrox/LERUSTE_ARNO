// Comptabilité perso : catégories, import du relevé CSV Revolut, synthèses mensuelles.

export const categories = {
  income: ['Salaire', 'Freelance', 'Dividendes', 'Remboursement', 'Autre revenu'],
  expense: ['Logement', 'Énergie', 'Courses', 'Restaurants', 'Transport', 'Sport', 'Santé', 'Abonnements', 'Loisirs', 'Shopping', 'Assurances', 'Impôts et taxes', 'Investissement', 'Autre dépense'],
  transfer: ['Transfert interne'],
};
export const kindOf = (cat) => Object.entries(categories).find(([, list]) => list.includes(cat))?.[0] ?? 'expense';

// Mots-clés → catégorie (enseignes belges courantes). Le premier qui correspond gagne.
const rules = [
  [/bizzdev|salaire|salary|payroll/i, 'Salaire'],
  [/dividend/i, 'Dividendes'],
  [/engie|luminus|totalenergies|eneco|swde|vivaqua|\bores\b|\bresa\b/i, 'Énergie'],
  [/colruyt|delhaize|aldi|lidl|carrefour|\bokay\b|\bspar\b|intermarch/i, 'Courses'],
  [/uber ?eats|deliveroo|takeaway|resto|restaurant|mcdo|quick|burger|friterie|caf[eé]/i, 'Restaurants'],
  [/sncb|nmbs|stib|tec\b|de lijn|total|shell|q8|esso|lukoil|parking|uber(?! ?eats)|bolt/i, 'Transport'],
  [/basic.?fit|jims|decathlon|fitness|gym|myprotein/i, 'Sport'],
  [/pharma|m[eé]decin|dentist|mutualit|solidaris|mutualité/i, 'Santé'],
  [/netflix|spotify|disney|proximus|orange|telenet|voo|scarlet|apple\.com|google|youtube|chatgpt|openai|anthropic|claude/i, 'Abonnements'],
  [/loyer|rent|immo/i, 'Logement'],
  [/ethias|ag insurance|axa|baloise|p&v|belfius assurance/i, 'Assurances'],
  [/spf finances|fod financi|imp[oô]t|taxe/i, 'Impôts et taxes'],
  [/revolut invest|trading|broker|degiro|bolero/i, 'Investissement'],
  [/amazon|zalando|bol\.com|fnac|mediamarkt|coolblue|ikea/i, 'Shopping'],
  [/steam|cin[eé]|kinepolis|ticket|concert/i, 'Loisirs'],
  [/^to |^from |pocket|savings|vault|exchanged to/i, 'Transfert interne'],
];
export const autoCategory = (label, amount) => rules.find(([re]) => re.test(label))?.[1] ?? (amount >= 0 ? 'Autre revenu' : 'Autre dépense');

// Découpe une ligne CSV en respectant les guillemets ("a, b" reste un seul champ).
export function csvLine(line) {
  const out = [];
  let cur = '', quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') quoted = false; else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out;
}

// Relevé de compte Revolut (Type, Product, Started Date, Completed Date, Description, Amount, Fee, Currency, State, Balance).
// Les opérations non terminées (en attente, annulées) sont ignorées. Montant net = montant − frais.
export function parseRevolutCsv(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { rows: [], skipped: 0, error: 'Fichier vide' };
  const head = csvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const col = (name) => head.indexOf(name);
  const need = ['description', 'amount', 'currency'];
  if (need.some((n) => col(n) < 0)) return { rows: [], skipped: 0, error: 'Colonnes Revolut introuvables (Description, Amount, Currency)' };
  const dateCol = col('completed date') >= 0 ? col('completed date') : col('started date');
  const rows = [];
  let skipped = 0;
  for (const line of lines.slice(1)) {
    const c = csvLine(line);
    const state = col('state') >= 0 ? c[col('state')]?.trim().toUpperCase() : 'COMPLETED';
    const amount = Number(c[col('amount')]) - (col('fee') >= 0 ? Number(c[col('fee')]) || 0 : 0);
    const date = (c[dateCol] ?? '').slice(0, 10);
    if (state !== 'COMPLETED' || !Number.isFinite(amount) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) { skipped++; continue; }
    const label = c[col('description')].trim();
    rows.push({ id: `${date}-${label}-${amount}-${rows.length}`, date, label, amount: Math.round(amount * 100) / 100, currency: c[col('currency')].trim(), category: autoCategory(label, amount) });
  }
  return { rows, skipped, error: null };
}

// Synthèse d'un mois (AAAA-MM). Les transferts internes ne comptent ni en revenu ni en dépense.
export function monthSummary(txs, month) {
  const list = txs.filter((t) => t.date.startsWith(month) && kindOf(t.category) !== 'transfer');
  const income = list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expense = -list.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
  const byCat = {};
  for (const t of list.filter((x) => x.amount < 0)) byCat[t.category] = (byCat[t.category] ?? 0) - t.amount;
  return { income, expense, net: income - expense, savingsRate: income ? (income - expense) / income : 0, byCategory: Object.entries(byCat).sort((a, b) => b[1] - a[1]) };
}

// Les n derniers mois jusqu'à `month` inclus, au format AAAA-MM.
export const lastMonths = (month, n) => Array.from({ length: n }, (_, i) => {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 - (n - 1 - i), 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
});

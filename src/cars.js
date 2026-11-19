// Voitures : problèmes, coûts, consommation et rappels. Fonctions pures, testées par scripts/check-more.mjs.

export const costCategories = ['Carburant', 'Entretien', 'Réparation', 'Pneus', 'Assurance', 'Taxe de circulation', 'Contrôle technique', 'Parking et péage', 'Lavage', 'Autre'];
export const severities = { low: 'Faible', medium: 'Moyenne', high: 'Urgente' };
export const statuses = { open: 'À traiter', progress: 'En cours', done: 'Résolu' };

export const newCar = (fields = {}) => ({
  id: `car-${Date.now()}`, make: '', model: '', year: '', plate: '', fuel: 'Essence', engine: '', km: '',
  ctDate: '', insuranceDate: '', notes: '', issues: [], costs: [], ...fields,
});

export const seedCars = [
  newCar({ id: 'opel-karl-2017', make: 'Opel', model: 'Karl', year: 2017, fuel: 'Essence', engine: '1.0 essence 3 cylindres' }),
];

export const carName = (c) => [c.make, c.model, c.year].filter(Boolean).join(' ') || 'Voiture sans nom';

// Synthèse des coûts : total, année en cours, par catégorie, par mois sur 12 mois, coût au km.
export function costSummary(costs, today = new Date()) {
  const year = String(today.getFullYear());
  const total = costs.reduce((s, c) => s + c.amount, 0);
  const thisYear = costs.filter((c) => c.date.startsWith(year)).reduce((s, c) => s + c.amount, 0);
  const byCat = {};
  for (const c of costs) byCat[c.category] = (byCat[c.category] ?? 0) + c.amount;
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return { key, amount: costs.filter((c) => c.date.startsWith(key)).reduce((s, c) => s + c.amount, 0) };
  });
  const kms = costs.map((c) => c.km).filter((k) => k > 0);
  const driven = kms.length >= 2 ? Math.max(...kms) - Math.min(...kms) : 0;
  return {
    total, thisYear, months,
    byCategory: Object.entries(byCat).sort((a, b) => b[1] - a[1]),
    perKm: driven > 0 ? total / driven : null, driven,
  };
}

// Consommation par la méthode des pleins : litres mis après le premier plein ÷ km parcourus entre le premier et le dernier.
export function consumption(costs) {
  const fills = costs.filter((c) => c.category === 'Carburant' && c.liters > 0 && c.km > 0).sort((a, b) => a.km - b.km);
  if (fills.length < 2) return null;
  const km = fills.at(-1).km - fills[0].km;
  const liters = fills.slice(1).reduce((s, c) => s + c.liters, 0);
  if (km <= 0) return null;
  const euros = fills.slice(1).reduce((s, c) => s + c.amount, 0);
  return { per100: (liters / km) * 100, km, liters, eurPer100: (euros / km) * 100 };
}

const daysBetween = (a, b) => Math.round((new Date(`${b}T00:00`) - new Date(`${a}T00:00`)) / 86400000);

// Rappels : contrôle technique, assurance, entretien (1 an ou 15 000 km, à adapter au carnet du constructeur), problèmes urgents.
export function reminders(car, todayIso) {
  const out = [];
  const due = (date, label) => {
    if (!date) return;
    const d = daysBetween(todayIso, date);
    if (d < 0) out.push({ level: 'high', text: `${label} : date passée depuis ${-d} jours (${date})` });
    else if (d <= 30) out.push({ level: 'medium', text: `${label} dans ${d} jours (${date})` });
  };
  due(car.ctDate, 'Contrôle technique');
  due(car.insuranceDate, 'Échéance de l’assurance');
  const services = car.costs.filter((c) => c.category === 'Entretien').sort((a, b) => b.date.localeCompare(a.date));
  const last = services[0];
  if (!last) out.push({ level: 'low', text: 'Aucun entretien noté : ajoute le dernier pour suivre la prochaine vidange' });
  else {
    const days = daysBetween(last.date, todayIso);
    const km = Number(car.km) && last.km ? Number(car.km) - last.km : 0;
    if (days > 365 || km > 15000) out.push({ level: 'medium', text: `Entretien à prévoir : dernier il y a ${days} jours${km ? ` et ${km.toLocaleString('fr-FR')} km` : ''}` });
  }
  const urgent = car.issues.filter((i) => i.status !== 'done' && i.severity === 'high').length;
  if (urgent) out.push({ level: 'high', text: `${urgent} problème${urgent > 1 ? 's' : ''} urgent${urgent > 1 ? 's' : ''} à traiter` });
  return out;
}

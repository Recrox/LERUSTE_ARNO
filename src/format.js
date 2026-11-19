import { today } from './data.js';

const sign = (n) => (n > 0 ? '+' : n < 0 ? '−' : '');

export const money = (n, currency = 'EUR') => n.toLocaleString('fr-FR', { style: 'currency', currency });
export const signedEur = (n) => `${sign(n)}${money(Math.abs(n))}`;
export const pct = (n) => `${sign(n)}${Math.abs(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;

export const daysSince = (iso) => Math.round((today - new Date(`${iso}T00:00`)) / 86400000);

const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
export function ago(iso) {
  const d = daysSince(iso);
  if (d < 30) return rtf.format(-d, 'day');
  if (d < 365) return rtf.format(-Math.round(d / 30), 'month');
  return rtf.format(-Math.round(d / 365), 'year');
}

// Couleur du texte d'une variation : vert si positive, rouge si négative, neutre à zéro.
export const tone = (n) => (n > 0 ? 'text-up' : n < 0 ? 'text-down' : 'text-muted');

// Date locale du jour au format AAAA-MM-JJ (journaux santé, comptabilité).
export const isoDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

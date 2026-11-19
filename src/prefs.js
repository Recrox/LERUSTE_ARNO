// Préférences locales du visiteur (thème, menu replié). localStorage peut être bloqué : on ignore alors.
export const load = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
export const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* navigation privée */ } };

export const isDark = () =>
  (document.documentElement.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

export function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  save('theme', next);
  return next === 'dark';
}

import { useEffect, useReducer } from 'react';

// L'événement beforeinstallprompt arrive tôt, souvent avant que React ait monté : on l'écoute dès le chargement du module.
let deferred = null;
const listeners = new Set();
const notify = () => listeners.forEach((f) => f());

addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; notify(); });
addEventListener('appinstalled', () => { deferred = null; notify(); });

export const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => { /* hors-ligne indisponible, l'app marche quand même */ }));
}

// installed : déjà ouverte comme app ; canPrompt : Chrome / Edge / Android peuvent afficher la fenêtre d'installation.
export function useInstall() {
  const [, rerender] = useReducer((x) => x + 1, 0);
  useEffect(() => { listeners.add(rerender); return () => listeners.delete(rerender); }, []);
  return {
    installed: isStandalone(),
    canPrompt: Boolean(deferred),
    ios: isIOS(),
    async prompt() {
      if (!deferred) return 'unavailable';
      deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      notify();
      return outcome;
    },
  };
}

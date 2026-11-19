import { useRef } from 'react';
import { Download, Share, SquarePlus, X } from 'lucide-react';
import { useInstall } from '../pwa.js';

// Bouton « Installer l'app » : fenêtre native quand le navigateur la propose, sinon la marche à suivre.
export default function InstallButton({ className, labelClass = '' }) {
  const { installed, canPrompt, ios, prompt } = useInstall();
  const help = useRef(null);
  if (installed) return null;

  const onClick = async () => {
    if (canPrompt) await prompt();
    else help.current.showModal();
  };

  return (
    <>
      <button onClick={onClick} className={className}>
        <Download size={18} className="shrink-0" aria-hidden="true" />
        <span className={labelClass}>Installer l’app</span>
      </button>
      <dialog ref={help} aria-labelledby="install-title" onClick={(e) => e.target === help.current && help.current.close()} className="m-auto w-[min(420px,calc(100vw-2rem))] rounded-xl bg-surface p-5 text-ink shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 id="install-title" className="text-base font-semibold">Installer sur l’écran d’accueil</h2>
          <button onClick={() => help.current.close()} aria-label="Fermer" className="rounded-lg p-1 text-muted hover:bg-canvas"><X size={18} aria-hidden="true" /></button>
        </div>
        {ios ? (
          <ol className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3"><Share size={18} className="shrink-0 text-data" aria-hidden="true" />Dans Safari, touche le bouton Partager en bas de l’écran</li>
            <li className="flex gap-3"><SquarePlus size={18} className="shrink-0 text-data" aria-hidden="true" />Choisis « Sur l’écran d’accueil », puis « Ajouter »</li>
          </ol>
        ) : (
          <ol className="mt-3 space-y-2 text-sm">
            <li>Chrome ou Edge sur ordinateur : icône d’installation à droite de la barre d’adresse, ou menu ⋮ puis « Installer l’app »</li>
            <li>Android : menu ⋮ puis « Ajouter à l’écran d’accueil » ou « Installer l’application »</li>
            <li>Firefox ordinateur ne gère pas l’installation : passe par Chrome ou Edge</li>
          </ol>
        )}
        <p className="mt-4 text-xs text-muted">Une fois installée, l’app s’ouvre en plein écran et fonctionne aussi hors ligne avec les dernières données vues</p>
      </dialog>
    </>
  );
}

# LERUSTE_ARNO

Règles obligatoires : lire et appliquer [outils.md](outils.md) avant tout développement.

- Ponytail : décisions de dev (plus petite solution complète).
- Graphify : cartographie/architecture (`/graphify`, sortie dans `graphify-out/`).
- Agent Skills : organisation des phases (spec → plan → implémentation → tests → review).
- Unslop : passe qualité visuelle sur toute UI.

À la fin du projet : lister précisément les outils utilisés et les opérations réellement effectuées.

## Git
- Branche par défaut : `main`.
- Push GitHub avec le compte `Recrox` (configuré localement via `credential.https://github.com.username`).

## Projet : tableau de bord perso
- Stack : Vite + React 19 + Tailwind 4 + framer-motion + lucide-react.
- `npm run dev` (dev), `npm run build`, `npm run preview`.
- Données : `src/data.js` (portefeuille Revolut et projets réels, le reste en démo), `src/sport.js` (exercices + formules), `src/training.js` (programmes, pictogrammes, guide), `src/health.js` (santé), `src/money/` (comptabilité + fiscalité belge), `src/house/` (maison).
- Les données saisies (séance, santé, compta, objectifs, finitions) sont en localStorage via `usePersisted`, rien côté serveur.
- Pages dans `src/pages/` (routage par hash dans `App.jsx`, entrées de menu dans `src/nav.js`) ; cartes dans `src/components/`.
- `npm run check` : tests des formules, du portefeuille et de la cohérence du plan. `npm run deploy` : build + Cloudflare Workers.
- La 3D (three.js) est chargée à la demande dans `src/house/House3D.jsx`.
- Couleurs = tokens `@theme` dans `src/index.css` (pas de hex dans les composants).
- PWA : `public/manifest.webmanifest`, `public/sw.js` (réseau d’abord pour les pages, cache pour /assets), `public/_headers`, icônes dans `public/icons/`. Installation : `src/pwa.js` + `InstallButton`. Changer `CACHE` dans sw.js pour vider le cache des utilisateurs.
- Mobile (< 1024 px) : `MobileNav` (en-tête + barre d’onglets en bas + menu), la `Sidebar` n’apparaît qu’en grand écran.

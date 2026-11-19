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
- Données de démo dans `src/data.js` ; une carte = un fichier dans `src/components/`.
- Couleurs = tokens `@theme` dans `src/index.css` (pas de hex dans les composants).

# Graph Report - src  (2026-11-19)

## Corpus Check
- Corpus is ~1,974 words - fits in a single context window. You may not need a graph.

## Summary
- 41 nodes · 108 edges · 6 communities (5 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Données de démo
- Composition de l'App
- Navigation et activité
- Cartes animées
- Carte portefeuille

## God Nodes (most connected - your core abstractions)
1. `Card()` - 13 edges
2. `CardTitle()` - 11 edges
3. `App()` - 9 edges
4. `PortfolioCard()` - 8 edges
5. `TrainingCard()` - 6 edges
6. `ActivityCard()` - 5 edges
7. `CalendarCard()` - 5 edges
8. `WorkCard()` - 5 edges
9. `Hero()` - 4 edges
10. `Sidebar()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `PortfolioCard()`  [EXTRACTED]
  App.jsx → components/PortfolioCard.jsx
- `App()` --calls--> `TrainingCard()`  [EXTRACTED]
  App.jsx → components/TrainingCard.jsx
- `App()` --calls--> `ActivityCard()`  [EXTRACTED]
  App.jsx → components/ActivityCard.jsx
- `App()` --calls--> `CalendarCard()`  [EXTRACTED]
  App.jsx → components/CalendarCard.jsx
- `App()` --calls--> `Hero()`  [EXTRACTED]
  App.jsx → components/Hero.jsx

## Import Cycles
- None detected.

## Communities (6 total, 1 thin omitted)

### Community 0 - "Données de démo"
Cohesion: 0.31
Nodes (7): dot, label, portfolio, today, training, week, work

### Community 1 - "Composition de l'App"
Cohesion: 0.54
Nodes (7): App(), ActivityCard(), CalendarCard(), Card(), Hero(), Sidebar(), WorkCard()

### Community 2 - "Navigation et activité"
Cohesion: 0.29
Nodes (4): icons, tabs, items, activity

### Community 3 - "Cartes animées"
Cohesion: 0.57
Nodes (3): CardTitle(), fmt(), TrainingCard()

### Community 4 - "Carte portefeuille"
Cohesion: 0.70
Nodes (4): eur(), pct(), PortfolioCard(), Sparkline()

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Card()` connect `Composition de l'App` to `Données de démo`, `Navigation et activité`, `Cartes animées`, `Carte portefeuille`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `CardTitle()` connect `Cartes animées` to `Données de démo`, `Composition de l'App`, `Navigation et activité`, `Carte portefeuille`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `PortfolioCard()` connect `Carte portefeuille` to `Composition de l'App`, `Cartes animées`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
// Bibliothèque d'exercices et formules d'entraînement. Les séries proposées sont des repères, pas une prescription.

export const groups = ['Pectoraux', 'Dos', 'Jambes', 'Fessiers', 'Épaules', 'Bras', 'Abdos', 'Full body', 'Cardio', 'Mobilité'];
export const equipments = ['Barre', 'Haltères', 'Kettlebell', 'Poulie', 'Machine', 'Poids du corps', 'Élastique', 'Barre de traction', 'Box'];

const ex = (name, group, equipment, level, sets, rest, muscles, tip) => ({ name, group, equipment, level, sets, rest, muscles, tip });

export const exercises = [
  // Pectoraux
  ex('Développé couché', 'Pectoraux', 'Barre', 'Intermédiaire', '5 × 5', 180, ['Pectoraux', 'Triceps', 'Deltoïde antérieur'], 'Omoplates serrées et basses, pieds ancrés, la barre touche le bas des pecs'),
  ex('Développé incliné haltères', 'Pectoraux', 'Haltères', 'Débutant', '4 × 8-10', 120, ['Haut des pectoraux', 'Épaules'], 'Banc à 30°, coudes à 45° du buste, descente lente sur 3 secondes'),
  ex('Dips lestés', 'Pectoraux', 'Poids du corps', 'Avancé', '4 × 6-8', 150, ['Bas des pectoraux', 'Triceps'], 'Buste légèrement penché vers l’avant pour cibler les pecs'),
  ex('Écarté à la poulie vis-à-vis', 'Pectoraux', 'Poulie', 'Débutant', '3 × 12-15', 60, ['Pectoraux'], 'Bras légèrement fléchis et figés, serre comme pour enlacer un arbre'),
  ex('Pompes déficit', 'Pectoraux', 'Poids du corps', 'Intermédiaire', '3 × max', 90, ['Pectoraux', 'Triceps', 'Gainage'], 'Mains sur des disques pour descendre plus bas que les mains'),
  ex('Landmine press', 'Pectoraux', 'Barre', 'Intermédiaire', '3 × 10 par bras', 90, ['Haut des pectoraux', 'Épaules', 'Gainage'], 'Une extrémité de barre calée dans un coin, pousse en diagonale'),
  // Dos
  ex('Soulevé de terre', 'Dos', 'Barre', 'Avancé', '5 × 3', 240, ['Chaîne postérieure', 'Lombaires', 'Trapèzes'], 'Barre collée aux tibias, pousse le sol avec les jambes, dos neutre du début à la fin'),
  ex('Tractions lestées', 'Dos', 'Barre de traction', 'Intermédiaire', '5 × 5', 150, ['Grand dorsal', 'Biceps'], 'Tire les coudes vers les poches, menton au-dessus de la barre'),
  ex('Rowing Pendlay', 'Dos', 'Barre', 'Intermédiaire', '4 × 6', 150, ['Grand dorsal', 'Rhomboïdes'], 'Buste parallèle au sol, chaque rep repart du sol'),
  ex('Meadows row', 'Dos', 'Barre', 'Avancé', '3 × 10 par bras', 90, ['Grand dorsal', 'Trapèzes'], 'Prise sur l’épaisseur de la barre landmine, coude vers le plafond'),
  ex('Tirage poitrine prise serrée', 'Dos', 'Poulie', 'Débutant', '4 × 10-12', 90, ['Grand dorsal', 'Biceps'], 'Pas d’élan : buste fixe, poitrine vers la poignée'),
  ex('Face pull', 'Dos', 'Poulie', 'Débutant', '3 × 15-20', 60, ['Deltoïde postérieur', 'Coiffe des rotateurs'], 'Corde à hauteur des yeux, termine en position « double biceps »'),
  ex('Muscle-up', 'Dos', 'Barre de traction', 'Avancé', '5 × 2-3', 180, ['Dos', 'Triceps', 'Explosivité'], 'Traction explosive vers le nombril puis bascule rapide des poignets'),
  // Jambes
  ex('Squat barre haute', 'Jambes', 'Barre', 'Intermédiaire', '5 × 5', 180, ['Quadriceps', 'Fessiers', 'Gainage'], 'Genoux dans l’axe des pieds, casse la parallèle, gainage bloqué'),
  ex('Front squat', 'Jambes', 'Barre', 'Avancé', '4 × 5', 180, ['Quadriceps', 'Haut du dos'], 'Coudes hauts tout le long, la barre repose sur les deltoïdes'),
  ex('Squat bulgare', 'Jambes', 'Haltères', 'Intermédiaire', '3 × 8 par jambe', 90, ['Quadriceps', 'Fessiers'], 'Pied arrière sur le banc, descends à la verticale'),
  ex('Zercher squat', 'Jambes', 'Barre', 'Avancé', '4 × 6', 150, ['Quadriceps', 'Gainage', 'Haut du dos'], 'Barre dans le creux des coudes, buste très droit'),
  ex('Pistol squat', 'Jambes', 'Poids du corps', 'Avancé', '4 × 5 par jambe', 90, ['Quadriceps', 'Équilibre'], 'Commence en descendant sur un banc, bras tendus devant pour l’équilibre'),
  ex('Nordic curl', 'Jambes', 'Poids du corps', 'Avancé', '4 × 4-6', 120, ['Ischio-jambiers'], 'Chevilles bloquées, freine la chute le plus longtemps possible'),
  ex('Sissy squat', 'Jambes', 'Poids du corps', 'Intermédiaire', '3 × 10-12', 60, ['Quadriceps (droit fémoral)'], 'Genoux vers l’avant, hanches tendues, buste en ligne avec les cuisses'),
  ex('Presse à cuisses', 'Jambes', 'Machine', 'Débutant', '4 × 10-12', 120, ['Quadriceps', 'Fessiers'], 'Bas du dos collé au dossier, ne verrouille pas les genoux'),
  ex('Mollets debout', 'Jambes', 'Machine', 'Débutant', '4 × 12-15', 60, ['Mollets'], 'Pause d’une seconde en bas étiré et en haut contracté'),
  // Fessiers
  ex('Hip thrust', 'Fessiers', 'Barre', 'Débutant', '4 × 8-10', 120, ['Grand fessier', 'Ischio-jambiers'], 'Menton rentré, bassin en rétroversion en haut, tibias verticaux'),
  ex('Soulevé de terre roumain', 'Fessiers', 'Barre', 'Intermédiaire', '4 × 8', 120, ['Ischio-jambiers', 'Fessiers'], 'Hanches vers l’arrière, barre le long des cuisses, genoux à peine fléchis'),
  ex('Good morning', 'Fessiers', 'Barre', 'Avancé', '3 × 8', 120, ['Ischio-jambiers', 'Lombaires'], 'Charge légère, dos parfaitement neutre'),
  ex('Abduction à l’élastique', 'Fessiers', 'Élastique', 'Débutant', '3 × 20', 45, ['Moyen fessier'], 'Élastique au-dessus des genoux, en demi-squat'),
  // Épaules
  ex('Développé militaire', 'Épaules', 'Barre', 'Intermédiaire', '5 × 5', 150, ['Deltoïdes', 'Triceps', 'Gainage'], 'Fessiers serrés, la tête passe « à travers la fenêtre » en haut'),
  ex('Z-press', 'Épaules', 'Barre', 'Avancé', '4 × 6', 120, ['Deltoïdes', 'Gainage'], 'Assis au sol jambes tendues : impossible de tricher avec le dos'),
  ex('Arnold press', 'Épaules', 'Haltères', 'Intermédiaire', '3 × 10', 90, ['Deltoïdes antérieur et latéral'], 'Rotation des paumes pendant la montée'),
  ex('Élévations latérales', 'Épaules', 'Haltères', 'Débutant', '4 × 12-20', 45, ['Deltoïde latéral'], 'Mène avec les coudes, pas plus haut que les épaules'),
  // Bras
  ex('Curl incliné', 'Bras', 'Haltères', 'Débutant', '3 × 10-12', 60, ['Biceps (longue portion)'], 'Banc à 45°, bras derrière le buste pour l’étirement'),
  ex('Curl marteau', 'Bras', 'Haltères', 'Débutant', '3 × 12', 60, ['Brachial', 'Avant-bras'], 'Prise neutre, coudes fixes'),
  ex('Barre au front', 'Bras', 'Barre', 'Intermédiaire', '4 × 8-10', 90, ['Triceps'], 'Descends derrière la tête pour étirer la longue portion'),
  ex('Extension triceps poulie haute', 'Bras', 'Poulie', 'Débutant', '3 × 12-15', 60, ['Triceps'], 'Coudes collés au corps, verrouille en bas'),
  // Abdos
  ex('Dragon flag', 'Abdos', 'Poids du corps', 'Avancé', '4 × 5', 90, ['Grand droit', 'Gainage complet'], 'Corps gainé comme une planche, ne plie pas les hanches'),
  ex('L-sit', 'Abdos', 'Poids du corps', 'Intermédiaire', '5 × 15-20 s', 60, ['Abdos', 'Fléchisseurs de hanche', 'Triceps'], 'Épaules basses, pousse fort dans le sol ou les barres'),
  ex('Hollow body hold', 'Abdos', 'Poids du corps', 'Débutant', '4 × 30 s', 45, ['Gainage antérieur'], 'Bas du dos plaqué au sol, bras et jambes tendus'),
  ex('Pallof press', 'Abdos', 'Poulie', 'Débutant', '3 × 12 par côté', 45, ['Obliques', 'Anti-rotation'], 'Résiste à la rotation, bras tendus 2 secondes'),
  ex('Ab wheel', 'Abdos', 'Poids du corps', 'Intermédiaire', '4 × 8-10', 60, ['Grand droit', 'Grand dorsal'], 'Bassin en rétroversion, n’arque jamais le bas du dos'),
  ex('Copenhagen plank', 'Abdos', 'Poids du corps', 'Intermédiaire', '3 × 20 s par côté', 45, ['Adducteurs', 'Obliques'], 'Pied supérieur sur le banc, hanches alignées'),
  // Full body
  ex('Kettlebell swing', 'Full body', 'Kettlebell', 'Débutant', '10 × 15 en EMOM', 45, ['Chaîne postérieure', 'Cardio'], 'Mouvement de hanche, pas de squat : les bras ne font que guider'),
  ex('Turkish get-up', 'Full body', 'Kettlebell', 'Avancé', '3 × 2 par côté', 90, ['Épaules', 'Gainage', 'Mobilité'], 'Regard sur la kettlebell, bras verrouillé du début à la fin'),
  ex('Farmer walk', 'Full body', 'Haltères', 'Débutant', '4 × 40 m', 90, ['Grip', 'Trapèzes', 'Gainage'], 'Charges lourdes, petits pas rapides, épaules basses'),
  ex('Thruster', 'Full body', 'Barre', 'Intermédiaire', '5 × 8', 120, ['Jambes', 'Épaules', 'Cardio'], 'Front squat enchaîné en développé, la poussée des jambes fait monter la barre'),
  ex('Clean and press', 'Full body', 'Barre', 'Avancé', '5 × 3', 150, ['Explosivité', 'Épaules', 'Jambes'], 'Tire avec les jambes, réceptionne en demi-squat'),
  ex('Bear crawl', 'Full body', 'Poids du corps', 'Débutant', '4 × 20 m', 60, ['Gainage', 'Épaules', 'Coordination'], 'Genoux à 3 cm du sol, dos plat comme une table'),
  // Cardio
  ex('Burpees', 'Cardio', 'Poids du corps', 'Débutant', 'Tabata 8 × 20 s / 10 s', 60, ['Cardio', 'Full body'], 'Poitrine au sol, saut avec les mains au-dessus de la tête'),
  ex('Box jump', 'Cardio', 'Box', 'Intermédiaire', '5 × 5', 90, ['Explosivité', 'Jambes'], 'Atterris en silence, redescends en marchant'),
  ex('Battle ropes', 'Cardio', 'Élastique', 'Débutant', '8 × 30 s / 30 s', 30, ['Cardio', 'Épaules'], 'Demi-squat, vagues rapides et amples'),
  ex('Rameur 500 m', 'Cardio', 'Machine', 'Intermédiaire', '5 × 500 m', 120, ['Cardio', 'Dos', 'Jambes'], 'Jambes, buste, bras à la poussée, puis l’inverse au retour'),
  // Mobilité
  ex('Jefferson curl', 'Mobilité', 'Haltères', 'Avancé', '3 × 5 lents', 60, ['Chaîne postérieure', 'Colonne'], 'Charge très légère, enroule vertèbre par vertèbre sur une box'),
  ex('Couch stretch', 'Mobilité', 'Poids du corps', 'Débutant', '2 × 1 min par côté', 30, ['Psoas', 'Quadriceps'], 'Genou contre le mur, serre le fessier de la jambe arrière'),
  ex('Cossack squat', 'Mobilité', 'Poids du corps', 'Intermédiaire', '3 × 8 par côté', 45, ['Adducteurs', 'Hanches', 'Chevilles'], 'Talon au sol, l’autre jambe tendue pointe vers le plafond'),
  ex('Dislocations à l’élastique', 'Mobilité', 'Élastique', 'Débutant', '3 × 15', 30, ['Épaules', 'Pectoraux'], 'Bras tendus, resserre la prise au fil des semaines'),
  ex('Suspension passive', 'Mobilité', 'Barre de traction', 'Débutant', '3 × 45 s', 45, ['Épaules', 'Colonne', 'Grip'], 'Relâche tout, laisse le poids du corps étirer le dos'),
];

// ---- Formules ----

// Temps en secondes → "m:ss" ou "h:mm:ss".
export function clock(s) {
  const t = Math.round(s);
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
  const mm = h ? String(m).padStart(2, '0') : m;
  return `${h ? `${h}:` : ''}${mm}:${String(sec).padStart(2, '0')}`;
}

// "52:40" ou "1:45:00" → secondes ; NaN si illisible.
export function parseClock(str) {
  const parts = String(str).trim().split(':').map(Number);
  if (!parts.length || parts.some((n) => !Number.isFinite(n) || n < 0)) return NaN;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

// Prédiction de Riegel : T2 = T1 × (D2 / D1)^1.06.
export const riegel = (t1, d1, d2) => t1 * (d2 / d1) ** 1.06;

// 1RM estimé (Epley), valable jusqu'à ~10 reps.
export const epley = (kg, reps) => (reps <= 1 ? kg : kg * (1 + reps / 30));

// Besoins caloriques : Mifflin-St Jeor × niveau d'activité, puis objectif.
export function macros({ weight, height, age, sex, activity, goal }) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'h' ? 5 : -161);
  const kcal = Math.round(bmr * activity * (goal === 'masse' ? 1.1 : goal === 'seche' ? 0.8 : 1));
  const protein = Math.round(weight * (goal === 'seche' ? 2.2 : 2));
  const fat = Math.round(weight * 0.9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { bmr: Math.round(bmr), kcal, protein, fat, carbs };
}

// Séances de course calées sur une allure cible au km (en secondes).
export function runSessions(pace10k) {
  const p = (delta) => clock(pace10k + delta);
  return [
    { name: 'Fractionné court', what: '10 × 400 m, récup 1 min 30 trot', pace: `${p(-25)} /km`, why: 'VMA et économie de course' },
    { name: 'Fractionné long', what: '5 × 1 000 m, récup 2 min', pace: `${p(-10)} /km`, why: 'Tenir l’allure 10 km en étant frais' },
    { name: 'Tempo', what: '3 × 10 min, récup 2 min', pace: `${p(5)} /km`, why: 'Seuil lactique : repousser la fatigue' },
    { name: '30/30', what: '2 séries de 10 × 30 s vite / 30 s lent', pace: `${p(-40)} /km sur les 30 s`, why: 'Séance ludique, gros gain de VMA' },
    { name: 'Côtes', what: '8 × 45 s en côte, retour en marchant', pace: 'Effort 9/10', why: 'Puissance, foulée et prévention des blessures' },
    { name: 'Fartlek', what: '40 min en variant l’allure au feeling', pace: `${p(-15)} à ${p(60)} /km`, why: 'Casser la routine, travailler les changements de rythme' },
    { name: 'Sortie longue', what: '1 h à 1 h 15 en aisance respiratoire', pace: `${p(75)} /km`, why: 'Endurance fondamentale, la base de tout' },
  ];
}

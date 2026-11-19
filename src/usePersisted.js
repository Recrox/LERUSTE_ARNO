import { useEffect, useState } from 'react';
import { load, save } from './prefs.js';

// useState sauvegardé dans le navigateur (JSON). Valeur illisible ou absente → valeur initiale.
export default function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(load(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { save(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

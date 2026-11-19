import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MotionGlobalConfig } from 'framer-motion';

// framer-motion anime en JS : la règle CSS reduced-motion ne le coupe pas.
MotionGlobalConfig.skipAnimations = matchMedia('(prefers-reduced-motion: reduce)').matches;

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);

import { LayoutGrid, FolderGit2, Dumbbell, HeartPulse, House, Landmark, Target, ChartColumn, Wallet, ShieldCheck } from 'lucide-react';

export const navItems = [
  { href: '#/', icon: LayoutGrid, label: 'Vue d’ensemble' },
  { href: '#/projets', icon: FolderGit2, label: 'Projets' },
  { href: '#/sport', icon: Dumbbell, label: 'Sport' },
  { href: '#/sante', icon: HeartPulse, label: 'Santé' },
  { href: '#/maison', icon: House, label: 'Maison' },
  { href: '#/compta', icon: Landmark, label: 'Comptabilité' },
  { href: '#/objectifs', icon: Target, label: 'Objectifs' },
  { href: '#/analytics', icon: ChartColumn, label: 'Analytics' },
  { href: '#/portefeuille', icon: Wallet, label: 'Portefeuille' },
  { href: '#/roles', icon: ShieldCheck, label: 'Rôles et permissions' },
];

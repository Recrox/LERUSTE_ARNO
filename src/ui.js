// Classes partagées des contrôles de formulaire et boutons.
export const field = 'rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink';
export const btn = 'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors';
export const btnPrimary = `${btn} bg-night text-white hover:bg-night-2`;
export const btnGhost = `${btn} bg-canvas text-ink hover:bg-line`;
export const chip = (on) => `rounded-lg px-3 py-1.5 text-sm transition-colors ${on ? 'bg-night text-white' : 'bg-surface text-muted hover:text-ink'}`;

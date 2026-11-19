import { motion } from 'framer-motion';

export function Card({ as = 'section', className = '', dark = false, children, delay = 0, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl p-5 ${dark ? 'bg-night text-white' : 'bg-surface'} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children, aside }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold">{children}</h2>
      {aside}
    </div>
  );
}

export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1 pt-2">
      <div>
        <h1 className="text-2xl font-medium">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

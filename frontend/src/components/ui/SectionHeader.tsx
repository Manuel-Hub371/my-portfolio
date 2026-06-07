interface SectionHeaderProps {
  id?: string;
  label: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ id, label, title, subtitle }: SectionHeaderProps) {
  return (
    <div id={id} className="mb-12 scroll-mt-24">
      <p className="font-mono text-sm font-medium uppercase tracking-widest text-accent">
        {label}
      </p>
      <h2 className="section-title mt-2">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

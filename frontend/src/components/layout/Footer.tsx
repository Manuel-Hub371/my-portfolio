interface FooterProps {
  name: string;
}

export function Footer({ name }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 py-8">
      <div className="portfolio-wrap flex flex-col items-center justify-between gap-2 text-center text-sm text-stone-500 sm:flex-row sm:text-left">
        <p>© {year} {name}</p>
        <p className="text-xs">Portfolio · Next.js</p>
      </div>
    </footer>
  );
}

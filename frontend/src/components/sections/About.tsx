import type { AboutContent } from "@/lib/content";

interface AboutProps {
  aboutContent: AboutContent;
}

export function About({ aboutContent }: AboutProps) {
  return (
    <section className="min-h-[calc(100vh-3.5rem)] py-16 sm:py-20">
      <div className="portfolio-narrow">
        <p className="section-label">About</p>
        <h2 className="section-heading mt-1">A bit about me</h2>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-600">
          <p>{aboutContent.intro}</p>
          <p>{aboutContent.specialization}</p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-medium text-stone-900">Focus areas</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {aboutContent.expertise.map((item) => (
              <li key={item} className="tag">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-stone-900">Stack</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {aboutContent.technologies.map((tech) => (
              <li key={tech} className="tag font-mono">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { ExternalLink, FileText } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { researchItems } from "@/data/portfolio";

export function Research() {
  return (
    <section id="research" className="scroll-mt-24 bg-surface/30 py-24">
      <div className="section-container">
        <SectionHeader
          label="Research"
          title="Publications & Experiments"
          subtitle="Technical writing, white papers, and open-source contributions."
        />

        <div className="grid gap-4">
          {researchItems.map((item) => (
            <article key={item.title} className="card card-hover flex gap-4 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <FileText size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 font-mono text-xs text-accent">
                    {item.type}
                  </span>
                  <span className="text-xs text-muted">{item.year}</span>
                </div>
                <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
              <a
                href={item.link}
                className="flex-shrink-0 self-center rounded-lg p-2 text-muted hover:bg-surface-elevated hover:text-accent"
                aria-label={`Read ${item.title}`}
              >
                <ExternalLink size={18} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

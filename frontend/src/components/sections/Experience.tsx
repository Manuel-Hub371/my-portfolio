import { SectionHeader } from "@/components/ui/SectionHeader";
import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <div className="section-container">
        <SectionHeader
          label="Experience"
          title="Professional Journey"
          subtitle="Building products, teams, and automation at scale."
        />

        <div className="relative space-y-8 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border lg:before:left-[11px]">
          {experience.map((job) => (
            <article key={job.company} className="relative pl-10 lg:pl-14">
              <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background lg:h-5 lg:w-5" />
              <div className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{job.position}</h3>
                    <p className="mt-1 font-medium text-accent">{job.company}</p>
                  </div>
                  <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted">
                    {job.duration}
                  </span>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Responsibilities
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted">
                      {job.responsibilities.map((r) => (
                        <li key={r}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Achievements
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted">
                      {job.achievements.map((a) => (
                        <li key={a}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

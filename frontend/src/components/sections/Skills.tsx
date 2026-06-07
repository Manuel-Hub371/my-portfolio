import { SectionHeader } from "@/components/ui/SectionHeader";
import { skillCategories } from "@/data/portfolio";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 bg-surface/30 py-24">
      <div className="section-container">
        <SectionHeader
          label="Skills"
          title="Technical Expertise"
          subtitle="Organized by domain — from languages to cloud infrastructure."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <article key={category.title} className="card card-hover p-6">
              <h3 className="font-semibold text-foreground">{category.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-border/80 bg-background/50 px-2.5 py-1 text-sm text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

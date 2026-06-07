import { Bot, Brain, Car, Cpu, Eye, Factory, Home, Radio } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { aiRoboticsShowcase } from "@/data/portfolio";

const icons = [Brain, Eye, Bot, Car, Radio, Factory];
const extraIcons = [Home, Cpu];

export function AIRobotics() {
  return (
    <section id="ai-robotics" className="scroll-mt-24 bg-surface/30 py-24">
      <div className="section-container">
        <SectionHeader
          label="AI & Robotics"
          title="Intelligent Systems Showcase"
          subtitle="Dedicated work in agents, vision, autonomy, and industrial automation."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiRoboticsShowcase.map((item, i) => {
            const Icon = icons[i] ?? extraIcons[i % extraIcons.length];
            return (
              <article
                key={item.title}
                className="card card-hover group relative overflow-hidden p-6"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
                <Icon className="relative text-accent" size={28} />
                <h3 className="relative mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="relative mt-2 text-sm text-muted">{item.description}</p>
                <div className="relative mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="relative mt-4 font-mono text-xs text-accent/80">
                  Videos · Diagrams · Research notes →
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

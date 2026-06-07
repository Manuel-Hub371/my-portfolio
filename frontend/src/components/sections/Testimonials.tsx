import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { testimonials } from "@/data/portfolio";

export function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-surface/30 py-24">
      <div className="section-container">
        <SectionHeader
          label="Testimonials"
          title="Client & Colleague Feedback"
          subtitle="Trust built through delivered results."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="card card-hover relative p-6">
              <Quote className="text-accent/40" size={32} />
              <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {t.avatar}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-foreground">{t.name}</cite>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

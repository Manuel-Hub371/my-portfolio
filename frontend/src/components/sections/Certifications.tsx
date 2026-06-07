import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { certifications } from "@/data/portfolio";

export function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24 py-24">
      <div className="section-container">
        <SectionHeader
          label="Certifications"
          title="Credentials"
          subtitle="Verified training in ML, cloud, and robotics."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <article key={cert.name} className="card card-hover flex items-start gap-4 p-6">
              <Award className="flex-shrink-0 text-accent" size={24} />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground">{cert.name}</h3>
                <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                <p className="mt-1 font-mono text-xs text-muted">{cert.year}</p>
              </div>
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-lg p-2 text-muted hover:text-accent"
                aria-label="Verify certification"
              >
                <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

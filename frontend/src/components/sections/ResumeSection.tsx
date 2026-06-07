import { Download, FileText } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/portfolio";

export function ResumeSection() {
  return (
    <section id="resume" className="scroll-mt-24 py-24">
      <div className="section-container">
        <SectionHeader
          label="Resume"
          title="Download & Profiles"
          subtitle="PDF resume, CV, and professional links."
        />

        <div className="card mx-auto max-w-2xl p-8 text-center">
          <FileText className="mx-auto text-accent" size={48} />
          <h3 className="mt-4 text-xl font-bold text-foreground">Emmanuel Darko — Resume</h3>
          <p className="mt-2 text-muted">
            Full-stack AI engineer with robotics and automation expertise.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={siteConfig.resumeUrl} className="btn-primary" download>
              <Download size={18} />
              PDF Resume
            </a>
            <a href={siteConfig.resumeUrl} className="btn-secondary">
              <FileText size={18} />
              CV
            </a>
          </div>

          <div className="mt-8 flex justify-center gap-4 border-t border-border pt-8">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              <LinkedInIcon size={16} />
              LinkedIn
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              <GitHubIcon size={16} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

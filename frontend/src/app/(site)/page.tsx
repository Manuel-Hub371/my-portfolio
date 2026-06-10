import Link from "next/link";
import { Download, ArrowRight, MapPin, Clock, Mail } from "lucide-react";
import { getPortfolio, getServices } from "@/lib/content";
import { skillCategories } from "@/data/portfolio";
import type { SiteConfig, AboutContent, Service } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `${siteConfig.name} — Portfolio`,
    description: siteConfig.tagline,
  };
}

/* ─── Icon map for services ─────────────────────────────────────────────────── */
const serviceIcons: Record<string, string> = {
  brain: "🧠",
  globe: "🌐",
  bot: "🤖",
  workflow: "⚙️",
  eye: "👁️",
  code: "💻",
  cpu: "🔲",
  layers: "📚",
  zap: "⚡",
  shield: "🛡️",
};

/* ─── Skill category accent colours ─────────────────────────────────────────── */
const categoryColors = [
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-violet-50 text-violet-700 border-violet-100",
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-100",
  "bg-rose-50 text-rose-700 border-rose-100",
  "bg-cyan-50 text-cyan-700 border-cyan-100",
];

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function Hero({ siteConfig, aboutContent }: { siteConfig: SiteConfig; aboutContent: AboutContent }) {
  const initials = siteConfig.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section className="border-b border-stone-200 py-20 sm:py-28">
      <div className="portfolio-wrap">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-14">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-3xl font-bold text-white shadow-lg sm:h-32 sm:w-32">
              {initials}
            </div>
            {/* Status pill */}
            <div className="mt-3 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available for work
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="section-label">Portfolio</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
              {siteConfig.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-blue-600">{siteConfig.title}</p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
              {siteConfig.tagline}
            </p>

            {/* Meta row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-stone-400" />
                {siteConfig.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-stone-400" />
                {aboutContent.yearsExperience} years experience
              </span>
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                View projects
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
              >
                <Mail size={15} />
                Get in touch
              </Link>
              <a
                href={siteConfig.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                <Download size={15} />
                Resume
              </a>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
              >
                {/* GitHub icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
              >
                {/* LinkedIn icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────────────────── */
function AboutSection({ aboutContent }: { aboutContent: AboutContent }) {
  return (
    <section className="border-b border-stone-200 py-16 sm:py-20">
      <div className="portfolio-wrap">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Left: text */}
          <div className="flex-1">
            <p className="section-label">About me</p>
            <h2 className="section-heading mt-1">Who I am</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-600">
              <p>{aboutContent.intro}</p>
              <p>{aboutContent.specialization}</p>
              <p className="text-stone-500 italic">&ldquo;{aboutContent.goals}&rdquo;</p>
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Full background
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: expertise + stack */}
          <div className="w-full lg:w-80 xl:w-96">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Focus areas
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {aboutContent.expertise.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-stone-100 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <div className="my-5 border-t border-stone-100" />

              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Core stack
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {aboutContent.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-xs font-medium text-blue-700"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────────────────────────────── */
function SkillsSection() {
  return (
    <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
      <div className="portfolio-wrap">
        <p className="section-label">Skills</p>
        <h2 className="section-heading mt-1">Technical expertise</h2>
        <p className="mt-2 max-w-xl text-sm text-stone-500">
          Spanning AI, robotics, full-stack development, and cloud infrastructure.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <div
              key={cat.title}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-sm font-semibold text-stone-900">{cat.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <li
                    key={skill}
                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${categoryColors[i % categoryColors.length]}`}
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────────────────────────── */
function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section className="border-b border-stone-200 py-16 sm:py-20">
      <div className="portfolio-wrap">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Services</p>
            <h2 className="section-heading mt-1">What I can help with</h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            All services
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-stone-100 bg-stone-50 text-xl transition-colors group-hover:border-blue-100 group-hover:bg-blue-50">
                {serviceIcons[service.icon] ?? "🔧"}
              </div>
              <h3 className="font-semibold text-stone-900">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA banner ─────────────────────────────────────────────────────────────── */
function CTASection({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section className="py-16 sm:py-20">
      <div className="portfolio-wrap">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Let&apos;s work together
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base text-stone-500">
            Whether it&apos;s an AI system, a robotics prototype, or a full-stack product — I&apos;d love to hear about it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Mail size={15} />
              Start a conversation
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const [{ siteConfig, aboutContent }, services] = await Promise.all([
    getPortfolio(),
    getServices(),
  ]);

  return (
    <>
      <Hero siteConfig={siteConfig} aboutContent={aboutContent} />
      <AboutSection aboutContent={aboutContent} />
      <SkillsSection />
      <ServicesSection services={services} />
      <CTASection siteConfig={siteConfig} />
    </>
  );
}

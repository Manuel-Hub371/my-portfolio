import Link from "next/link";
import { Download, ArrowRight, ExternalLink, MapPin, Mail } from "lucide-react";
import { getPortfolio } from "@/lib/content";
import { getApiBaseUrl } from "@/lib/api-base";
import {
  experience as fallbackExperience,
  certifications as fallbackCertifications,
  researchItems as fallbackResearchItems,
  testimonials as fallbackTestimonials,
  skillCategories,
} from "@/data/portfolio";
import type { ResearchItem, CertificationItem, ExperienceItem, TestimonialItem } from "@/lib/admin-api";

async function getAboutSections() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/content/portfolio`, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new Error("Unable to retrieve portfolio layout sections from MongoDB.");
    }
    const data = await res.json();
    const a = data?.aboutContent ?? {};
    return {
      experience: (a.experience ?? fallbackExperience) as ExperienceItem[],
      certifications: (a.certifications ?? fallbackCertifications) as CertificationItem[],
      research: (a.research ?? fallbackResearchItems) as ResearchItem[],
      testimonials: (a.testimonials ?? fallbackTestimonials) as TestimonialItem[],
    };
  } catch {
    return {
      experience: fallbackExperience as ExperienceItem[],
      certifications: fallbackCertifications as CertificationItem[],
      research: fallbackResearchItems as ResearchItem[],
      testimonials: fallbackTestimonials as TestimonialItem[],
    };
  }
}


export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `About — ${siteConfig.name}`,
    description: siteConfig.tagline,
  };
}

/* ─── Skill category colours ─────────────────────────────────────────────────── */
const catColors = [
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-violet-50 text-violet-700 border-violet-100",
  "bg-emerald-50 text-emerald-700 border-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-100",
  "bg-rose-50 text-rose-700 border-rose-100",
  "bg-cyan-50 text-cyan-700 border-cyan-100",
];

const catIconBg = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-cyan-100 text-cyan-600",
];

/* ─── Research type badge colours ────────────────────────────────────────────── */
const researchBadge: Record<string, string> = {
  "Technical Article": "bg-blue-50 text-blue-700 border-blue-100",
  "White Paper": "bg-violet-50 text-violet-700 border-violet-100",
  "Open Source": "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default async function AboutPage() {
  const [{ siteConfig, aboutContent }, sections] = await Promise.all([
    getPortfolio(),
    getAboutSections(),
  ]);
  const { experience, certifications, research, testimonials } = sections;

  const initials = siteConfig.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <>
      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:gap-14">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-4xl font-bold text-white shadow-lg">
                {initials}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="section-label">About me</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {siteConfig.name}
              </h1>
              <p className="mt-1 text-base font-medium text-blue-600">{siteConfig.title}</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600">
                {aboutContent.intro}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-stone-400" />
                  {siteConfig.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {aboutContent.yearsExperience} years experience
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Mail size={14} />
                  Get in touch
                </Link>
                <a
                  href={siteConfig.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  <Download size={14} />
                  Download resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-white py-10">
        <div className="portfolio-wrap">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: aboutContent.yearsExperience, label: "Years experience" },
              { value: "15+", label: "Projects delivered" },
              { value: "6+", label: "Domains mastered" },
              { value: "3", label: "Companies worked at" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-stone-900">{stat.value}</p>
                <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bio + focus areas ───────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
            {/* Left */}
            <div className="flex-1">
              <p className="section-label">Background</p>
              <h2 className="section-heading mt-1">My story</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-600">
                <p>{aboutContent.intro}</p>
                <p>{aboutContent.specialization}</p>
                <p className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm italic text-blue-800">
                  &ldquo;{aboutContent.goals}&rdquo;
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="w-full space-y-5 lg:w-80 xl:w-96">
              {/* Focus areas */}
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Focus areas
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {aboutContent.expertise.map((item: string) => (
                    <li
                      key={item}
                      className="rounded-md border border-stone-100 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core stack */}
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Core stack
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {aboutContent.technologies.map((tech: string) => (
                    <li
                      key={tech}
                      className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 font-mono text-xs font-medium text-blue-700"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact card */}
              <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Contact
                </p>
                <div className="mt-3 space-y-2 text-sm text-stone-600">
                  <p>
                    <span className="font-medium text-stone-900">Email: </span>
                    <a href={`mailto:${siteConfig.email}`} className="text-blue-600 hover:underline">
                      {siteConfig.email}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">GitHub: </span>
                    <a
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {siteConfig.github.replace("https://", "")}
                    </a>
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">LinkedIn: </span>
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {siteConfig.linkedin.replace("https://", "")}
                    </a>
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience timeline ──────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Career</p>
          <h2 className="section-heading mt-1">Work experience</h2>
          <p className="mt-2 text-sm text-stone-500">
            Building products and teams across AI, robotics, and software.
          </p>

          <div className="mt-10 space-y-6">
            {experience.map((job, i) => (
              <div key={job.company} className="flex gap-5 sm:gap-8">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div
                    className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${i === 0
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-stone-300 bg-white text-stone-500"
                      }`}
                  >
                    {i + 1}
                  </div>
                  {i < experience.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-stone-200" />
                  )}
                </div>

                {/* Card */}
                <div className="mb-6 flex-1 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">{job.position}</h3>
                      <p className="mt-0.5 text-sm font-semibold text-blue-600">{job.company}</p>
                    </div>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-mono text-xs text-stone-500">
                      {job.duration}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Responsibilities
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {job.responsibilities.map((r) => (
                          <li key={r} className="flex items-start gap-2 text-sm text-stone-600">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-300" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                        Key achievements
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {job.achievements.map((a) => (
                          <li key={a} className="flex items-start gap-2 text-sm text-stone-600">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Skills</p>
          <h2 className="section-heading mt-1">Technical expertise</h2>
          <p className="mt-2 text-sm text-stone-500">
            Spanning AI, robotics, full-stack development, and cloud infrastructure.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat, i) => (
              <div
                key={cat.title}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${catIconBg[i % catIconBg.length]}`}
                  >
                    {cat.title.slice(0, 1)}
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">{cat.title}</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <li
                      key={skill}
                      className={`rounded-md border px-2 py-0.5 text-xs font-medium ${catColors[i % catColors.length]}`}
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

      {/* ── Certifications ──────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Credentials</p>
          <h2 className="section-heading mt-1">Certifications</h2>
          <p className="mt-2 text-sm text-stone-500">
            Verified training in machine learning, cloud, and robotics.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Badge icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl">
                  🏅
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">{cert.name}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{cert.issuer}</p>
                  <span className="mt-2 inline-block rounded-full border border-stone-100 bg-stone-50 px-2 py-0.5 font-mono text-xs text-stone-500">
                    {cert.year}
                  </span>
                </div>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  aria-label="Verify certification"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research & publications ──────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Research</p>
          <h2 className="section-heading mt-1">Publications &amp; experiments</h2>
          <p className="mt-2 text-sm text-stone-500">
            Technical writing, white papers, and open-source contributions.
          </p>

          <div className="mt-10 space-y-4">
            {research.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  📄
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${researchBadge[item.type] ?? "bg-stone-50 text-stone-600 border-stone-200"
                        }`}
                    >
                      {item.type}
                    </span>
                    <span className="font-mono text-xs text-stone-400">{item.year}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{item.description}</p>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 self-center rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  aria-label={`Read ${item.title}`}
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Social proof</p>
          <h2 className="section-heading mt-1">What clients say</h2>
          <p className="mt-2 text-sm text-stone-500">
            Trust built through delivered results.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Quote mark */}
                <div className="text-3xl leading-none text-blue-200">&ldquo;</div>
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                    <p className="text-xs text-stone-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Open to opportunities
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Let&apos;s build something great
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-stone-500">
              Whether it&apos;s a contract, a full-time role, or a collaboration — I&apos;m always open to interesting work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <Mail size={15} />
                Contact me
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                See my work
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

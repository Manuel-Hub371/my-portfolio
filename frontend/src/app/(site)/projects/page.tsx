import Link from "next/link";
import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { getPortfolio, getProjects } from "@/lib/content";
import { aiRoboticsShowcase } from "@/data/portfolio";
import type { Project } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `Projects — ${siteConfig.name}`,
    description:
      "Selected AI, robotics, and full-stack projects — from autonomous robots to enterprise RAG platforms.",
  };
}

/* ─── Tech tag colours ───────────────────────────────────────────────────────── */
const techColors: Record<string, string> = {
  Python: "bg-blue-50 text-blue-700 border-blue-100",
  TypeScript: "bg-indigo-50 text-indigo-700 border-indigo-100",
  React: "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Next.js": "bg-stone-100 text-stone-700 border-stone-200",
  ROS: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "ROS 2": "bg-emerald-50 text-emerald-700 border-emerald-100",
  OpenCV: "bg-violet-50 text-violet-700 border-violet-100",
  YOLO: "bg-rose-50 text-rose-700 border-rose-100",
  "GPT-4": "bg-amber-50 text-amber-700 border-amber-100",
  LangChain: "bg-green-50 text-green-700 border-green-100",
  FastAPI: "bg-teal-50 text-teal-700 border-teal-100",
  PostgreSQL: "bg-sky-50 text-sky-700 border-sky-100",
  Docker: "bg-blue-50 text-blue-700 border-blue-100",
  "Node.js": "bg-lime-50 text-lime-700 border-lime-100",
  MQTT: "bg-orange-50 text-orange-700 border-orange-100",
};

function techClass(tech: string) {
  return techColors[tech] ?? "bg-stone-50 text-stone-600 border-stone-200";
}

/* ─── Project initials banner ────────────────────────────────────────────────── */
const bannerGradients = [
  "from-blue-600 to-indigo-500",
  "from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-600 to-pink-500",
  "from-cyan-600 to-sky-500",
];

function projectInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

/* ─── AI & Robotics showcase icons ──────────────────────────────────────────── */
const showcaseConfig = [
  { emoji: "🤖", bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600" },
  { emoji: "👁️", bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600" },
  { emoji: "🦾", bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600" },
  { emoji: "🚗", bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600" },
  { emoji: "📡", bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600" },
  { emoji: "🏭", bg: "bg-cyan-50", border: "border-cyan-100", text: "text-cyan-600" },
];

/* ─── Project card (compact, 3-per-row) ──────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const gradient = bannerGradients[index % bannerGradients.length];
  const hasImage = !!project.image;
  const slug = (project as Project & { id?: string }).id ?? project.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/projects/${slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* Banner — image if available, else gradient + initials */}
      <div className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${gradient}`}>
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-mono text-3xl font-black tracking-tight text-white/90">
            {projectInitials(project.name)}
          </span>
        )}
        {hasImage && (
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold text-stone-900 transition-colors group-hover:text-blue-600 line-clamp-1">
          {project.name}
        </h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-stone-500 line-clamp-2">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium ${techClass(tech)}`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="rounded-full border border-stone-100 bg-stone-50 px-2 py-0.5 text-[10px] text-stone-400">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Top result */}
        {project.results?.length > 0 && (
          <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-stone-500">
            <CheckCircle size={10} className="mt-0.5 flex-shrink-0 text-emerald-500" />
            <span className="line-clamp-1">{project.results[0]}</span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex items-center gap-2.5">
            {project.github && project.github !== "#" && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                <GitHubIcon size={11} />
                Code
              </a>
            )}
            {project.demo && project.demo !== "#" && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                <ExternalLink size={11} />
                Demo
              </a>
            )}
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
            Case study <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function ProjectsPage() {
  const [projects, { siteConfig }] = await Promise.all([
    getProjects(),
    getPortfolio(),
  ]);


  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Projects</p>
          <h1 className="section-heading mt-1 text-3xl sm:text-4xl">Selected work</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-500">
            A curated set of projects across AI, robotics, and full-stack engineering —
            each built to solve a real problem and shipped to production.
          </p>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8">
            {[
              { value: `${projects.length}+`, label: "Featured projects" },
              { value: "3", label: "Domains" },
              { value: "Production", label: "Grade" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold tracking-tight text-stone-900">{s.value}</p>
                <p className="mt-0.5 text-sm text-stone-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All projects — 3-column grid ────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-14 sm:py-18">
        <div className="portfolio-wrap">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Work</p>
              <h2 className="section-heading mt-1">All projects</h2>
            </div>
            <span className="text-sm text-stone-400">{projects.length} projects</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id ?? project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI & Robotics showcase ───────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-14 sm:py-18">
        <div className="portfolio-wrap">
          <div className="mb-10">
            <p className="section-label">Specialisation</p>
            <h2 className="section-heading mt-1">AI &amp; Robotics systems</h2>
            <p className="mt-2 text-sm text-stone-500">
              Dedicated work in intelligent agents, computer vision, autonomous navigation,
              and industrial automation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aiRoboticsShowcase.map((item, i) => {
              const cfg = showcaseConfig[i % showcaseConfig.length];
              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-50 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-xl border text-2xl ${cfg.bg} ${cfg.border}`}
                  >
                    {cfg.emoji}
                  </div>

                  <h3 className={`relative mt-4 text-base font-bold text-stone-900`}>
                    {item.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-stone-500">
                    {item.description}
                  </p>

                  <div className="relative mt-4 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Open source note ─────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-12">
        <div className="portfolio-wrap">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-xl shadow-sm">
                <GitHubIcon size={20} className="text-stone-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">More on GitHub</p>
                <p className="mt-0.5 text-sm text-stone-500">
                  Open-source tools, experiments, and robotics configs — all public.
                </p>
              </div>
            </div>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              <GitHubIcon size={15} />
              View GitHub profile
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Have a project in mind?
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Let&apos;s build it together
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-stone-500">
              Whether it&apos;s an AI system, a robotics prototype, or a full-stack product —
              I&apos;d love to hear about it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Start a conversation
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

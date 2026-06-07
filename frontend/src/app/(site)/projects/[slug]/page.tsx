import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { getProject, getProjects, getPortfolio } from "@/lib/content";
import type { Project } from "@/lib/content";

interface PageProps {
  params: { slug: string };
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const techColors: Record<string, string> = {
  Python:       "bg-blue-50 text-blue-700 border-blue-100",
  TypeScript:   "bg-indigo-50 text-indigo-700 border-indigo-100",
  React:        "bg-cyan-50 text-cyan-700 border-cyan-100",
  "Next.js":    "bg-stone-100 text-stone-700 border-stone-200",
  ROS:          "bg-emerald-50 text-emerald-700 border-emerald-100",
  "ROS 2":      "bg-emerald-50 text-emerald-700 border-emerald-100",
  OpenCV:       "bg-violet-50 text-violet-700 border-violet-100",
  YOLO:         "bg-rose-50 text-rose-700 border-rose-100",
  "GPT-4":      "bg-amber-50 text-amber-700 border-amber-100",
  LangChain:    "bg-green-50 text-green-700 border-green-100",
  FastAPI:      "bg-teal-50 text-teal-700 border-teal-100",
  PostgreSQL:   "bg-sky-50 text-sky-700 border-sky-100",
  Docker:       "bg-blue-50 text-blue-700 border-blue-100",
  "Node.js":    "bg-lime-50 text-lime-700 border-lime-100",
  MQTT:         "bg-orange-50 text-orange-700 border-orange-100",
};

function techClass(tech: string) {
  return techColors[tech] ?? "bg-stone-50 text-stone-600 border-stone-200";
}

const bannerGradients = [
  "from-blue-600 to-indigo-500",
  "from-violet-600 to-purple-500",
  "from-emerald-600 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-600 to-pink-500",
  "from-cyan-600 to-sky-500",
];

function projectInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/* ─── Metadata ───────────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: PageProps) {
  const project = await getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.name} — Case Study`,
    description: project.description,
  };
}

/* ─── Related project card (mini) ───────────────────────────────────────────── */
function RelatedCard({ project, index }: { project: Project; index: number }) {
  const gradient = bannerGradients[index % bannerGradients.length];
  const slug = (project as Project & { id?: string }).id ?? slugify(project.name);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${gradient}`}>
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-mono text-sm font-black text-white/90">
            {projectInitials(project.name)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-stone-900 transition-colors group-hover:text-blue-600 line-clamp-1">
          {project.name}
        </p>
        <p className="mt-0.5 text-xs text-stone-500 line-clamp-1">{project.description}</p>
      </div>
      <ArrowRight size={14} className="flex-shrink-0 text-stone-300 transition-colors group-hover:text-blue-500" />
    </Link>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const [project, allProjects, { siteConfig }] = await Promise.all([
    getProject(params.slug),
    getProjects(),
    getPortfolio(),
  ]);

  if (!project) notFound();

  const projectIndex = allProjects.findIndex(
    (p) => ((p as Project & { id?: string }).id ?? slugify(p.name)) === params.slug
  );
  const gradient = bannerGradients[Math.max(0, projectIndex) % bannerGradients.length];

  // Related: other projects (exclude current)
  const related = allProjects
    .filter((p) => ((p as Project & { id?: string }).id ?? slugify(p.name)) !== params.slug)
    .slice(0, 2);

  const authorInitials = siteConfig.name.split(" ").map((n: string) => n[0]).join("");

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-12 sm:py-16">
        <div className="portfolio-wrap">
          {/* Back */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>

          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            {/* Project image / banner */}
            <div className="w-full flex-shrink-0 lg:w-96">
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-64 w-full object-cover lg:h-72"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center lg:h-72">
                    <span className="font-mono text-6xl font-black tracking-tight text-white/80">
                      {projectInitials(project.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Links below image */}
              <div className="mt-4 flex gap-3">
                {project.github && project.github !== "#" && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-200 bg-white py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
                  >
                    <GitHubIcon size={15} />
                    View code
                  </a>
                )}
                {project.demo && project.demo !== "#" && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <ExternalLink size={15} />
                    Live demo
                  </a>
                )}
              </div>
            </div>

            {/* Title + meta */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                Case Study
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                {project.name}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-stone-500">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Tech stack
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-full border px-3 py-1 font-mono text-xs font-medium ${techClass(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author row */}
              <div className="mt-8 flex items-center gap-3 border-t border-stone-100 pt-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-xs font-bold text-white">
                  {authorInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{siteConfig.name}</p>
                  <p className="text-xs text-stone-400">{siteConfig.title.split("|")[0].trim()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Case study body ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-18">
        <div className="portfolio-wrap">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">

            {/* Main content */}
            <div className="flex-1 min-w-0">

              {/* Overview */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-stone-900">Project overview</h2>
                <p className="mt-3 text-base leading-relaxed text-stone-600">
                  {project.description}
                </p>
              </div>

              {/* Challenges */}
              {project.challenges?.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900">Challenges</h2>
                  <p className="mt-1 text-sm text-stone-400">
                    Key technical and product problems that had to be solved.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {project.challenges.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-500">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed text-stone-700">{c}</p>
                        </div>
                        <XCircle size={16} className="mt-0.5 flex-shrink-0 text-rose-300" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Results */}
              {project.results?.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-stone-900">Results &amp; outcomes</h2>
                  <p className="mt-1 text-sm text-stone-400">
                    Measurable impact and what was delivered.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {project.results.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm"
                      >
                        <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                        <p className="text-sm leading-relaxed text-stone-700">{r}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech deep-dive */}
              <div className="mb-10">
                <h2 className="text-xl font-bold text-stone-900">Technology used</h2>
                <p className="mt-1 text-sm text-stone-400">
                  The full stack powering this project.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`rounded-lg border px-3 py-1.5 font-mono text-sm font-medium ${techClass(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-72 xl:w-80 space-y-5 flex-shrink-0">

              {/* Quick facts */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Quick facts
                </p>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-xs text-stone-400">Type</dt>
                    <dd className="mt-0.5 text-sm font-medium text-stone-700">Production project</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-stone-400">Stack size</dt>
                    <dd className="mt-0.5 text-sm font-medium text-stone-700">
                      {project.technologies.length} technologies
                    </dd>
                  </div>
                  {project.challenges?.length > 0 && (
                    <div>
                      <dt className="text-xs text-stone-400">Challenges solved</dt>
                      <dd className="mt-0.5 text-sm font-medium text-stone-700">
                        {project.challenges.length}
                      </dd>
                    </div>
                  )}
                  {project.results?.length > 0 && (
                    <div>
                      <dt className="text-xs text-stone-400">Key outcomes</dt>
                      <dd className="mt-0.5 text-sm font-medium text-stone-700">
                        {project.results.length} measurable results
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Links */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Links
                </p>
                <div className="mt-4 space-y-2">
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                    >
                      <GitHubIcon size={15} />
                      Source code
                      <ExternalLink size={11} className="ml-auto text-stone-300" />
                    </a>
                  )}
                  {project.demo && project.demo !== "#" && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <ExternalLink size={15} />
                      Live demo
                      <ExternalLink size={11} className="ml-auto text-blue-300" />
                    </a>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white p-5 shadow-sm">
                <p className="text-sm font-bold text-stone-900">Interested in this?</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  I build similar systems for clients. Let&apos;s talk about your project.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Get in touch
                  <ArrowRight size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related projects ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-stone-200 bg-stone-50/60 py-12 sm:py-16">
          <div className="portfolio-wrap">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">
              More projects
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((p, i) => (
                <RelatedCard
                  key={(p as Project & { id?: string }).id ?? slugify(p.name)}
                  project={p}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom nav ───────────────────────────────────────────────────────── */}
      <div className="border-t border-stone-200 py-8">
        <div className="portfolio-wrap flex items-center justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Hire me
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}

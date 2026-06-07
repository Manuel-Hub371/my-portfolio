import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import type { Project } from "@/lib/content";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section className="section-alt min-h-[calc(100vh-3.5rem)] py-16 sm:py-20">
      <div className="portfolio-wrap">
        <p className="section-label">Projects</p>
        <h2 className="section-heading mt-1">Selected work</h2>
        <p className="mt-2 max-w-lg text-stone-600">
          A few things I&apos;ve built — AI, robotics, and full-stack products.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <article className="portfolio-card group flex h-full flex-col p-5">
                <div className="flex h-36 items-center justify-center rounded-lg bg-stone-100 font-mono text-2xl font-semibold text-stone-400">
                  {project.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 3)}
                </div>

                <h3 className="mt-4 text-lg font-semibold text-stone-900 group-hover:text-blue-600">
                  {project.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-3">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center gap-4 border-t border-stone-200 pt-4 text-sm">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900"
                  >
                    <GitHubIcon size={15} />
                    Code
                  </a>
                  <a
                    href={project.demo}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    View
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Download } from "lucide-react";
import type { AboutContent, SiteConfig } from "@/lib/content";

interface HeroProps {
  siteConfig: SiteConfig;
  aboutContent: AboutContent;
}

export function Hero({ siteConfig, aboutContent }: HeroProps) {
  const initials = siteConfig.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center border-b border-stone-200 py-16 sm:py-20">
      <div className="portfolio-wrap w-full">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-12">
          <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-stone-200 text-3xl font-semibold text-stone-600 sm:h-32 sm:w-32">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="section-label">Portfolio</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              {siteConfig.name}
            </h1>
            <p className="mt-2 text-lg text-stone-600">{siteConfig.title}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
              {siteConfig.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-stone-500">
              <span>{siteConfig.location}</span>
              <span className="hidden text-stone-300 sm:inline">·</span>
              <span>{aboutContent.yearsExperience} years experience</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                View projects
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100"
              >
                About me
              </Link>
              <a
                href={siteConfig.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100"
              >
                <Download size={16} />
                Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

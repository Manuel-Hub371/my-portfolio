import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "contentlayer/generated";

interface BlogPreviewProps {
  posts: Post[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const recent = posts.filter((p) => p.published).slice(0, 3);

  return (
    <section id="blog" className="section-alt scroll-mt-16 py-16 sm:py-20">
      <div className="portfolio-wrap">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-label">Blog</p>
            <h2 className="section-heading mt-1">Writing</h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm text-accent hover:underline sm:inline-flex"
          >
            All posts
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <ul className="mt-8 space-y-0 divide-y divide-border border-y border-border">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link
                href={post.url}
                className="group flex flex-col gap-1 py-5 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted line-clamp-1">{post.description}</p>
                </div>
                <time
                  dateTime={post.date}
                  className="flex-shrink-0 text-sm text-muted sm:pl-6"
                >
                  {format(new Date(post.date), "MMM yyyy")}
                </time>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-1 text-sm text-accent hover:underline sm:hidden"
        >
          All posts
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

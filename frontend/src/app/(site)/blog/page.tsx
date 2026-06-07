import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Tag } from "lucide-react";
import { getBlogPosts, getPortfolio } from "@/lib/content";
import type { BlogPostSummary } from "@/lib/content";

export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `Blog — ${siteConfig.name}`,
    description: "Technical writing on AI, robotics, and software engineering.",
  };
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function readingTime(description: string) {
  // rough estimate from description word count × a multiplier
  const words = description.split(" ").length * 8;
  return `${Math.max(3, Math.round(words / 200))} min read`;
}

const tagColors: Record<string, string> = {
  AI:             "bg-violet-50 text-violet-700 border-violet-100",
  RAG:            "bg-blue-50 text-blue-700 border-blue-100",
  LangChain:      "bg-emerald-50 text-emerald-700 border-emerald-100",
  LLM:            "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Deep Learning":"bg-rose-50 text-rose-700 border-rose-100",
  NLP:            "bg-amber-50 text-amber-700 border-amber-100",
  Transformers:   "bg-cyan-50 text-cyan-700 border-cyan-100",
  ROS:            "bg-orange-50 text-orange-700 border-orange-100",
  Robotics:       "bg-teal-50 text-teal-700 border-teal-100",
};

function tagClass(tag: string) {
  return tagColors[tag] ?? "bg-stone-50 text-stone-600 border-stone-200";
}

/* ─── Featured card (first post) ────────────────────────────────────────────── */
function FeaturedPost({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={post.url}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:flex-row"
    >
      {/* Colour band */}
      <div className="flex w-full flex-shrink-0 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-500 p-10 sm:w-56 sm:p-0">
        <span className="text-5xl opacity-80">✍️</span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          {/* Featured badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Featured post
          </span>

          <h2 className="mt-3 text-xl font-bold tracking-tight text-stone-900 transition-colors group-hover:text-blue-600 sm:text-2xl">
            {post.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-2">
            {post.description}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-400">
            <time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <BookOpen size={11} />
              {readingTime(post.description)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Regular post card ──────────────────────────────────────────────────────── */
function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link
      href={post.url}
      className="group flex flex-col rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
        <h2 className="mt-3 text-base font-bold text-stone-900 transition-colors group-hover:text-blue-600 line-clamp-2">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-3">
          {post.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
        <div className="flex items-center gap-3 text-xs text-stone-400">
          <time dateTime={post.date}>{format(new Date(post.date), "MMM d, yyyy")}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {readingTime(post.description)}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
          Read
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 py-20 text-center">
      <span className="text-4xl">📝</span>
      <p className="mt-4 text-base font-semibold text-stone-700">No posts yet</p>
      <p className="mt-1 text-sm text-stone-400">Check back soon — writing is in progress.</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  // collect all unique tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-14 sm:py-18">
        <div className="portfolio-wrap">
          <p className="section-label">Blog</p>
          <h1 className="section-heading mt-1 text-3xl sm:text-4xl">
            Writing &amp; notes
          </h1>
          <p className="mt-3 max-w-xl text-base text-stone-500">
            Deep dives on AI engineering, robotics, and building production software.
            Updated regularly.
          </p>

          {/* Tag cloud */}
          {allTags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-stone-400">
                <Tag size={12} />
                Topics:
              </span>
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-18">
        <div className="portfolio-wrap">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="mb-10">
                  <FeaturedPost post={featured} />
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-widest">
                      All posts
                      <span className="ml-2 font-normal text-stone-400">({posts.length})</span>
                    </h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

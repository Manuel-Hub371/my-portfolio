import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { allPosts } from "contentlayer/generated";
import { getBlogPost, getBlogPosts, getPortfolio } from "@/lib/content";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

interface PageProps {
  params: { slug: string };
}

/* ─── Metadata ───────────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: PageProps) {
  const post = await getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function readingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

const tagColors: Record<string, string> = {
  AI: "bg-violet-50 text-violet-700 border-violet-100",
  RAG: "bg-blue-50 text-blue-700 border-blue-100",
  LangChain: "bg-emerald-50 text-emerald-700 border-emerald-100",
  LLM: "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Deep Learning": "bg-rose-50 text-rose-700 border-rose-100",
  NLP: "bg-amber-50 text-amber-700 border-amber-100",
  Transformers: "bg-cyan-50 text-cyan-700 border-cyan-100",
  ROS: "bg-orange-50 text-orange-700 border-orange-100",
  Robotics: "bg-teal-50 text-teal-700 border-teal-100",
};

function tagClass(tag: string) {
  return tagColors[tag] ?? "bg-stone-50 text-stone-600 border-stone-200";
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function BlogPostPage({ params }: PageProps) {
  const [post, allPosts, { siteConfig }] = await Promise.all([
    getBlogPost(params.slug),
    getBlogPosts(),
    getPortfolio(),
  ]);

  if (!post) notFound();

  const rt = readingTime(post.body ?? post.description);

  // Related posts: same tags, exclude current
  const related = allPosts
    .filter(
      (p) =>
        p.slug !== params.slug &&
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, 2);

  const authorInitials = siteConfig.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <>
      {/* ── Article header ──────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-12 sm:py-16">
        <div className="portfolio-narrow">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={15} />
            Back to blog
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Tag size={12} className="text-stone-400" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-500">
            {post.description}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-xs font-bold text-white">
                {authorInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">{siteConfig.name}</p>
                <p className="text-xs text-stone-400">Author</p>
              </div>
            </div>

            <div className="h-4 w-px bg-stone-200" />

            <div className="flex items-center gap-1.5 text-sm text-stone-500">
              <Calendar size={13} className="text-stone-400" />
              <time dateTime={post.date}>
                {format(new Date(post.date), "MMMM d, yyyy")}
              </time>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-stone-500">
              <BookOpen size={13} className="text-stone-400" />
              {rt}
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────────────────────────── */}
      <div className="py-12 sm:py-16">
        <div className="portfolio-narrow">
          <article className="prose-blog">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.body}
            </ReactMarkdown>
          </article>

          {/* ── Tags footer ─────────────────────────────────────────────────── */}
          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-stone-200 pt-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Tagged:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagClass(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Author card ──────────────────────────────────────────────────── */}
          <div className="mt-10 flex items-start gap-5 rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-lg font-bold text-white">
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">{siteConfig.name}</p>
              <p className="mt-0.5 text-xs font-medium text-blue-600">{siteConfig.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {siteConfig.tagline}
              </p>
              <div className="mt-3 flex gap-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related posts ───────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-stone-200 bg-stone-50/60 py-12 sm:py-16">
          <div className="portfolio-narrow">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-400">
              Related posts
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={p.url}
                  className="group rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tagClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-stone-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2">{p.description}</p>
                  <p className="mt-3 text-xs text-stone-400">
                    {format(new Date(p.date), "MMM d, yyyy")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom nav ──────────────────────────────────────────────────────── */}
      <div className="border-t border-stone-200 py-8">
        <div className="portfolio-narrow flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={15} />
            All posts
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}

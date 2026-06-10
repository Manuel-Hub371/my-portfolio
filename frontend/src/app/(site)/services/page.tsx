import Link from "next/link";
import { ArrowRight, CheckCircle, Mail, Download } from "lucide-react";
import { getPortfolio, getServices } from "@/lib/content";
import { testimonials } from "@/data/portfolio";
import type { Service } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `Services — ${siteConfig.name}`,
    description:
      "AI development, robotics, web applications, and business automation — freelance and contract work through ManuelTech.",
  };
}

/* ─── Icon + colour map ──────────────────────────────────────────────────────── */
const serviceConfig: Record<
  string,
  { emoji: string; accent: string; bg: string; border: string; tag: string }
> = {
  brain: {
    emoji: "🧠",
    accent: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    tag: "bg-violet-50 text-violet-700 border-violet-100",
  },
  globe: {
    emoji: "🌐",
    accent: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    tag: "bg-blue-50 text-blue-700 border-blue-100",
  },
  bot: {
    emoji: "🤖",
    accent: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    tag: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  workflow: {
    emoji: "⚙️",
    accent: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    tag: "bg-amber-50 text-amber-700 border-amber-100",
  },
  eye: {
    emoji: "👁️",
    accent: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    tag: "bg-rose-50 text-rose-700 border-rose-100",
  },
  code: {
    emoji: "💻",
    accent: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
    tag: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
};

const fallbackConfig = {
  emoji: "🔧",
  accent: "text-stone-600",
  bg: "bg-stone-50",
  border: "border-stone-100",
  tag: "bg-stone-50 text-stone-600 border-stone-200",
};

/* ─── Per-service detail bullets ─────────────────────────────────────────────── */
const serviceDetails: Record<string, { bullets: string[]; stack: string[] }> = {
  "AI Development": {
    bullets: [
      "Custom LLM fine-tuning and prompt engineering",
      "RAG pipelines with hybrid retrieval",
      "Multi-agent orchestration with tool use",
      "MLOps: model serving, monitoring, retraining",
    ],
    stack: ["Python", "PyTorch", "LangChain", "FastAPI", "PostgreSQL"],
  },
  "Web Development": {
    bullets: [
      "React / Next.js frontends with great UX",
      "REST and GraphQL API design",
      "Authentication, payments, and third-party integrations",
      "Performance optimisation and SEO",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"],
  },
  "Robotics Solutions": {
    bullets: [
      "ROS 2 navigation and manipulation stacks",
      "Sensor fusion: LiDAR, camera, IMU",
      "SLAM and autonomous path planning",
      "Hardware-software integration and testing",
    ],
    stack: ["ROS 2", "Python", "C++", "OpenCV", "Nav2"],
  },
  "Business Automation": {
    bullets: [
      "Workflow automation with n8n / custom pipelines",
      "Intelligent document processing (OCR + LLM)",
      "CRM and ERP integrations",
      "Scheduled jobs, alerts, and reporting dashboards",
    ],
    stack: ["Python", "FastAPI", "n8n", "PostgreSQL", "Docker"],
  },
  "Computer Vision Systems": {
    bullets: [
      "Real-time object detection and tracking",
      "Defect inspection for manufacturing",
      "Edge deployment on Jetson / Raspberry Pi",
      "Custom dataset collection and annotation",
    ],
    stack: ["YOLO", "OpenCV", "TensorRT", "Python", "Docker"],
  },
  "Custom Software": {
    bullets: [
      "End-to-end product engineering",
      "Architecture design and technical planning",
      "Code review and legacy system modernisation",
      "Ongoing maintenance and support",
    ],
    stack: ["TypeScript", "Python", "React", "Node.js", "AWS"],
  },
};

/* ─── Process steps ──────────────────────────────────────────────────────────── */
const process = [
  {
    step: "01",
    title: "Discovery call",
    desc: "We talk through your goals, constraints, and timeline. No commitment required.",
  },
  {
    step: "02",
    title: "Proposal & scope",
    desc: "I send a clear written proposal with deliverables, timeline, and fixed or hourly pricing.",
  },
  {
    step: "03",
    title: "Build & iterate",
    desc: "Regular check-ins, demos, and async updates throughout the engagement.",
  },
  {
    step: "04",
    title: "Handoff & support",
    desc: "Full documentation, source code, and a support window after delivery.",
  },
];

/* ─── Engagement models ──────────────────────────────────────────────────────── */
const engagements = [
  {
    title: "Fixed-scope project",
    icon: "📦",
    desc: "Defined deliverables, timeline, and price. Best for well-scoped features or MVPs.",
    features: ["Clear milestones", "Fixed price", "Full handoff"],
    highlight: false,
  },
  {
    title: "Retainer / ongoing",
    icon: "🔄",
    desc: "Dedicated hours per month for continuous development, maintenance, or advisory.",
    features: ["Priority availability", "Monthly billing", "Flexible scope"],
    highlight: true,
  },
  {
    title: "Consulting & review",
    icon: "🎯",
    desc: "Architecture review, code audit, or technical advisory for your existing team.",
    features: ["Written report", "1-on-1 sessions", "Actionable recommendations"],
    highlight: false,
  },
];

/* ─── Service card ───────────────────────────────────────────────────────────── */
function ServiceCard({ service }: { service: Service }) {
  const cfg = serviceConfig[service.icon] ?? fallbackConfig;
  const detail = serviceDetails[service.title];

  return (
    <div className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl ${cfg.bg} ${cfg.border}`}
      >
        {cfg.emoji}
      </div>

      {/* Title + desc */}
      <h3 className={`mt-5 text-lg font-bold text-stone-900`}>{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{service.description}</p>

      {/* Bullets */}
      {detail && (
        <ul className="mt-5 space-y-2">
          {detail.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-stone-600">
              <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${cfg.accent}`} />
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Stack tags */}
      {detail && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {detail.stack.map((tech) => (
            <span
              key={tech}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${cfg.tag}`}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 pt-5 border-t border-stone-100">
        <Link
          href="/contact"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${cfg.accent} transition-opacity hover:opacity-70`}
        >
          Discuss this service
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default async function ServicesPage() {
  const [services, { siteConfig }] = await Promise.all([
    getServices(),
    getPortfolio(),
  ]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Services</p>
          <h1 className="section-heading mt-1 text-3xl sm:text-4xl">
            What I can help with
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-500">
            Freelance and contract work through{" "}
            <span className="font-semibold text-stone-700">ManuelTech</span>. I work with
            startups, scale-ups, and enterprises on AI systems, robotics, web platforms,
            and automation — from prototype to production.
          </p>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { value: "15+", label: "Projects delivered" },
              { value: "6+", label: "Years experience" },
              { value: "100%", label: "Remote-friendly" },
              { value: "Fast", label: "Response time" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl font-bold tracking-tight text-stone-900">
                  {s.value}
                </span>
                <span className="text-sm text-stone-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service cards ────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Offerings</p>
              <h2 className="section-heading mt-1">Core services</h2>
            </div>
            <Link
              href="/contact"
              className="hidden items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 sm:inline-flex"
            >
              Get a quote
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How I work ───────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Process</p>
          <h2 className="section-heading mt-1">How I work</h2>
          <p className="mt-2 text-sm text-stone-500">
            A straightforward engagement process — no surprises.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connector line */}
                {i < process.length - 1 && (
                  <div className="absolute left-full top-5 hidden h-px w-5 bg-stone-200 lg:block" />
                )}
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm h-full">
                  <span className="font-mono text-xs font-bold text-blue-500">
                    {step.step}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-stone-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Engagement models ────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Pricing</p>
          <h2 className="section-heading mt-1">Engagement models</h2>
          <p className="mt-2 text-sm text-stone-500">
            Flexible structures to fit your project and budget.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {engagements.map((eng) => (
              <div
                key={eng.title}
                className={`relative flex flex-col rounded-2xl border p-7 shadow-sm transition-shadow hover:shadow-md ${eng.highlight
                  ? "border-blue-200 bg-gradient-to-b from-blue-50 to-white"
                  : "border-stone-200 bg-white"
                  }`}
              >
                {eng.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-blue-200 bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                    Most popular
                  </span>
                )}

                <div className="text-3xl">{eng.icon}</div>
                <h3 className="mt-4 text-base font-bold text-stone-900">{eng.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{eng.desc}</p>

                <ul className="mt-5 space-y-2">
                  {eng.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle
                        size={14}
                        className={`flex-shrink-0 ${eng.highlight ? "text-blue-500" : "text-emerald-500"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    href="/contact"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${eng.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                  >
                    Get started
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-stone-400">
            All pricing discussed during the discovery call. No hidden fees.
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 bg-stone-50/60 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">Social proof</p>
          <h2 className="section-heading mt-1">What clients say</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
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

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-200 py-16 sm:py-20">
        <div className="portfolio-wrap">
          <p className="section-label">FAQ</p>
          <h2 className="section-heading mt-1">Common questions</h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[
              {
                q: "Do you work remotely?",
                a: "Yes — 100% remote, worldwide. I work async-first and am comfortable with any timezone overlap.",
              },
              {
                q: "How long does a typical project take?",
                a: "MVPs and focused features typically take 2–6 weeks. Larger systems are scoped per project after the discovery call.",
              },
              {
                q: "Do you sign NDAs?",
                a: "Absolutely. I'm happy to sign your NDA before any sensitive information is shared.",
              },
              {
                q: "Can you work with an existing team?",
                a: "Yes. I integrate well with existing engineering teams, follow your conventions, and communicate clearly in code reviews and standups.",
              },
              {
                q: "What if I'm not sure what I need?",
                a: "That's fine — book a free discovery call and we'll figure it out together. No commitment required.",
              },
              {
                q: "Do you provide post-delivery support?",
                a: "Every project includes a support window after handoff. Ongoing support is available as a retainer.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-stone-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="portfolio-wrap">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Ready to start?
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              Let&apos;s build something together
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base text-stone-500">
              Book a free 30-minute discovery call or send a message — I&apos;ll get back to you within 24 hours.
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
                href={siteConfig.resumeUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                <Download size={15} />
                Download resume
              </a>
            </div>
            <p className="mt-5 text-xs text-stone-400">
              {siteConfig.email} · {siteConfig.location}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

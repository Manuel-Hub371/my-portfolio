import Link from "next/link";

const sections = [
  {
    href: "/admin/portfolio",
    icon: "👤",
    label: "Portfolio",
    desc: "Update your name, bio, and contact links",
    color: "blue",
  },
  {
    href: "/admin/services",
    icon: "⚙️",
    label: "Services",
    desc: "Manage the offerings you provide to clients",
    color: "green",
  },
  {
    href: "/admin/projects",
    icon: "🗂️",
    label: "Projects",
    desc: "Showcase your featured work and case studies",
    color: "amber",
  },
  {
    href: "/admin/blog",
    icon: "✍️",
    label: "Blog",
    desc: "Write and publish posts and articles",
    color: "red",
  },
];

export default function AdminDashboardPage() {
  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-desc">
          Welcome back. Manage your portfolio content from here.
        </p>
      </div>

      {/* Quick-action cards */}
      <div className="admin-section-grid">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="admin-section-card">
            <div className="admin-section-card-icon">{s.icon}</div>
            <div>
              <div className="admin-section-card-title">{s.label}</div>
              <div className="admin-section-card-desc">{s.desc}</div>
            </div>
            <div className="admin-section-card-arrow">
              Go to {s.label}
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Info banner */}
      <div
        style={{
          marginTop: 28,
          padding: "16px 20px",
          borderRadius: "var(--radius)",
          background: "var(--accent-glow)",
          border: "1px solid rgba(99,102,241,.2)",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
            Changes go live immediately
          </p>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
            Content updates are reflected on the public site as soon as the API is connected and the cache refreshes (≈ 60 s).
          </p>
        </div>
      </div>
    </>
  );
}

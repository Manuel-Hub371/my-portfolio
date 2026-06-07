"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAdminToken } from "@/lib/admin-auth";
import { verifySession } from "@/lib/admin-api";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-5a1 1 0 00-1 1v3.586L7.707 11.293a1 1 0 001.414 1.414L11 10.828V6a1 1 0 00-1-1z" />
      </svg>
    ),
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/about",
    label: "About sections",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
      </svg>
    ),
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: (
      <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
        <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
      </svg>
    ),
  },
];

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/portfolio": "Portfolio",
  "/admin/about": "About sections",
  "/admin/services": "Services",
  "/admin/projects": "Projects",
  "/admin/blog": "Blog",
};

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    verifySession().then((user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      setEmail(user.email);
      setChecking(false);
    });
  }, [router]);

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="admin-app">
        <div style={{ margin: "auto", padding: "60px 0" }}>
          <div className="admin-loading">
            <div className="admin-spinner" />
            Verifying session…
          </div>
        </div>
      </div>
    );
  }

  const currentTitle = pageTitles[pathname] ?? "Admin";

  return (
    <div className="admin-app">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <Link href="/admin" className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">⚡</div>
          <div className="admin-sidebar-logo-text">
            <span className="admin-sidebar-logo-title">Admin Panel</span>
            <span className="admin-sidebar-logo-sub">Portfolio CMS</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          <span className="admin-sidebar-section">Navigation</span>
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`admin-nav-link${active ? " active" : ""}`}
              >
                {l.icon}
                {l.label}
              </Link>
            );
          })}

          <span className="admin-sidebar-section" style={{ marginTop: 8 }}>Site</span>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-nav-link"
          >
            <svg className="admin-nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16A8 8 0 0010 2zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg>
            View site
            <svg style={{ marginLeft: "auto", width: 11, height: 11, opacity: .5 }} viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </Link>
        </nav>

        {/* User footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {email ? getInitials(email) : "AD"}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-email">{email ?? "admin"}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-faint)",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="admin-main">
        {/* Top header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <div className="admin-breadcrumb">
              <span>Admin</span>
              {currentTitle !== "Dashboard" && (
                <>
                  <span className="admin-breadcrumb-sep">/</span>
                  <span className="admin-breadcrumb-current">{currentTitle}</span>
                </>
              )}
            </div>
          </div>
          <div className="admin-header-right">
            <div className="admin-header-badge">
              <div className="admin-header-badge-dot" />
              Live
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}

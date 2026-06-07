"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

/* ─── Types matching the portfolio data shape ────────────────────────────────── */
interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  resumeUrl: string;
  location: string;
}

interface AboutContent {
  intro: string;
  specialization: string;
  yearsExperience: string;
  goals: string;
  expertise: string[];
  technologies: string[];
}

const emptySite: SiteConfig = {
  name: "", title: "", tagline: "", email: "", phone: "",
  whatsapp: "", linkedin: "", github: "", resumeUrl: "", location: "",
};

const emptyAbout: AboutContent = {
  intro: "", specialization: "", yearsExperience: "", goals: "",
  expertise: [], technologies: [],
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function AlertIcon({ error }: { error: boolean }) {
  return error ? (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

/* ─── Tag list editor (expertise / technologies) ─────────────────────────────── */
function TagListField({ label, hint, items, onChange }: {
  label: string; hint?: string; items: string[]; onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setDraft("");
  }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); add(); }
  }
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 6 }}>{hint}</p>}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input className="admin-input" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey} placeholder="Type and press Enter to add"
          style={{ flex: 1 }} />
        <button type="button" className="admin-btn admin-btn-sm" style={{ marginTop: 0 }} onClick={add}>
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((item, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "3px 10px", borderRadius: 20, fontSize: 12,
              background: "var(--accent-glow)", border: "1px solid rgba(99,102,241,.25)",
              color: "#818cf8",
            }}>
              {item}
              <button type="button" onClick={() => remove(i)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(129,140,248,.6)", fontSize: 14, lineHeight: 1,
                padding: 0, display: "flex", alignItems: "center",
              }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */
export default function AdminPortfolioPage() {
  const [site, setSite] = useState<SiteConfig>(emptySite);
  const [about, setAbout] = useState<AboutContent>(emptyAbout);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"identity" | "links" | "about">("identity");

  useEffect(() => {
    adminApi.getPortfolio()
      .then((data) => {
        const s = data.siteConfig as Record<string, unknown>;
        const a = data.aboutContent as Record<string, unknown>;
        setSite({
          name:      (s.name      as string) ?? "",
          title:     (s.title     as string) ?? "",
          tagline:   (s.tagline   as string) ?? "",
          email:     (s.email     as string) ?? "",
          phone:     (s.phone     as string) ?? "",
          whatsapp:  (s.whatsapp  as string) ?? "",
          linkedin:  (s.linkedin  as string) ?? "",
          github:    (s.github    as string) ?? "",
          resumeUrl: (s.resumeUrl as string) ?? "",
          location:  (s.location  as string) ?? "",
        });
        setAbout({
          intro:           (a.intro           as string)   ?? "",
          specialization:  (a.specialization  as string)   ?? "",
          yearsExperience: (a.yearsExperience as string)   ?? "",
          goals:           (a.goals           as string)   ?? "",
          expertise:       (a.expertise       as string[]) ?? [],
          technologies:    (a.technologies    as string[]) ?? [],
        });
      })
      .catch((e) => { setIsError(true); setMessage(e.message); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(""); setIsError(false); setSaving(true);
    try {
      await adminApi.updatePortfolio({
        siteConfig: site as unknown as Record<string, unknown>,
        aboutContent: about as unknown as Record<string, unknown>,
      });
      setMessage("Portfolio saved successfully.");
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  }

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: 6, fontSize: 12.5, fontWeight: 600,
    cursor: "pointer", border: "none",
    background: activeTab === t ? "var(--accent)" : "transparent",
    color: activeTab === t ? "white" : "var(--text-muted)",
    transition: "background .15s, color .15s",
  });

  if (loading) {
    return (
      <>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Portfolio</h1>
        </div>
        <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Portfolio</h1>
        <p className="admin-page-desc">
          Manage your personal info, social links, and about section.
        </p>
      </div>

      {/* Profile preview strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 12, marginBottom: 20,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: "white",
        }}>
          {(site.name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
            {site.name || "Your name"}
          </p>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {site.title || "Your title"}
          </p>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-faint)", flexShrink: 0 }}>
          {site.location || "Location"}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 20,
          background: "var(--bg-hover)", borderRadius: 8, padding: 4,
        }}>
          {(["identity", "links", "about"] as const).map(t => (
            <button key={t} type="button" style={tabStyle(t)} onClick={() => setActiveTab(t)}>
              {t === "identity" ? "Identity" : t === "links" ? "Links & Contact" : "About me"}
            </button>
          ))}
        </div>

        {/* ── Tab: Identity ── */}
        {activeTab === "identity" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Identity</div>
                <div className="admin-card-subtitle">Your name, professional title, and tagline.</div>
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Full name</label>
              <input className="admin-input" value={site.name}
                placeholder="Emmanuel Darko"
                onChange={e => setSite({ ...site, name: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Professional title</label>
              <input className="admin-input" value={site.title}
                placeholder="AI Engineer | Robotics Developer | Full-Stack Software Engineer"
                onChange={e => setSite({ ...site, title: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Tagline</label>
              <textarea className="admin-textarea prose" rows={2} value={site.tagline}
                placeholder="A short punchy line that appears on your homepage…"
                onChange={e => setSite({ ...site, tagline: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Location</label>
              <input className="admin-input" value={site.location}
                placeholder="Remote · Worldwide"
                onChange={e => setSite({ ...site, location: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Resume URL</label>
              <input className="admin-input" value={site.resumeUrl}
                placeholder="/resume/your-resume.pdf"
                onChange={e => setSite({ ...site, resumeUrl: e.target.value })} />
            </div>
          </div>
        )}

        {/* ── Tab: Links & Contact ── */}
        {activeTab === "links" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">Links &amp; Contact</div>
                <div className="admin-card-subtitle">Email, phone, and social profile URLs.</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <div className="admin-field">
                <label className="admin-label">Email</label>
                <input className="admin-input" type="email" value={site.email}
                  placeholder="you@example.com"
                  onChange={e => setSite({ ...site, email: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Phone</label>
                <input className="admin-input" value={site.phone}
                  placeholder="+1 (555) 123-4567"
                  onChange={e => setSite({ ...site, phone: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">LinkedIn URL</label>
              <input className="admin-input" value={site.linkedin}
                placeholder="https://linkedin.com/in/your-profile"
                onChange={e => setSite({ ...site, linkedin: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">GitHub URL</label>
              <input className="admin-input" value={site.github}
                placeholder="https://github.com/your-username"
                onChange={e => setSite({ ...site, github: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">WhatsApp link</label>
              <input className="admin-input" value={site.whatsapp}
                placeholder="https://wa.me/15551234567"
                onChange={e => setSite({ ...site, whatsapp: e.target.value })} />
            </div>
          </div>
        )}

        {/* ── Tab: About me ── */}
        {activeTab === "about" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <div className="admin-card-title">About me</div>
                <div className="admin-card-subtitle">Bio, specialization, goals, and skills shown on your about page.</div>
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Introduction / Bio</label>
              <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 6 }}>
                Short intro shown in the hero banner at the top of your about page.
              </p>
              <textarea className="admin-textarea prose" rows={3} value={about.intro}
                placeholder="I'm [Name] — an engineer who bridges artificial intelligence, robotics, and production-grade software…"
                onChange={e => setAbout({ ...about, intro: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Background story</label>
              <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 6 }}>
                The longer &ldquo;My story&rdquo; paragraph shown in the background section. Tell your full story here.
              </p>
              <textarea className="admin-textarea prose" rows={5} value={about.specialization}
                placeholder="I started my journey building robotics systems and gradually moved into AI engineering. Over the years I've worked across…"
                onChange={e => setAbout({ ...about, specialization: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Goals</label>
              <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginBottom: 6 }}>
                Shown as a quote on your about page.
              </p>
              <textarea className="admin-textarea prose" rows={2} value={about.goals}
                placeholder="Ship reliable AI products, advance open robotics research…"
                onChange={e => setAbout({ ...about, goals: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Years of experience</label>
              <input className="admin-input" value={about.yearsExperience}
                placeholder="6+" style={{ maxWidth: 120 }}
                onChange={e => setAbout({ ...about, yearsExperience: e.target.value })} />
            </div>
            <div className="admin-divider" />
            <TagListField
              label="Focus areas / Expertise"
              hint="Shown as tags on your about page (e.g. Artificial Intelligence, Robotics, Computer Vision)"
              items={about.expertise}
              onChange={v => setAbout({ ...about, expertise: v })}
            />
            <div className="admin-divider" />
            <TagListField
              label="Core stack / Technologies"
              hint="Your primary tech stack shown as monospace tags (e.g. Python, React, ROS 2)"
              items={about.technologies}
              onChange={v => setAbout({ ...about, technologies: v })}
            />
          </div>
        )}

        {/* Feedback */}
        {message && (
          <div className={`admin-alert ${isError ? "admin-alert-error" : "admin-alert-success"}`}>
            <AlertIcon error={isError} />
            {message}
          </div>
        )}

        <div className="admin-btn-row">
          <button type="submit" className="admin-btn" disabled={saving}>
            {saving ? (
              <><div className="admin-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />
              Saving…</>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
}

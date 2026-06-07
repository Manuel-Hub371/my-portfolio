"use client";

import { useEffect, useState } from "react";
import { adminApi, type ResearchItem, type CertificationItem, type ExperienceItem, type TestimonialItem } from "@/lib/admin-api";

/* ─── Shared helpers ─────────────────────────────────────────────────────────── */
function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
    </svg>
  );
}

function AlertMsg({ msg, error }: { msg: string; error: boolean }) {
  if (!msg) return null;
  return (
    <div className={`admin-alert ${error ? "admin-alert-error" : "admin-alert-success"}`} style={{ marginTop: 12 }}>
      {error ? (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {msg}
    </div>
  );
}

function ArrayStringField({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  function add() { const v = draft.trim(); if (!v) return; onChange([...items, v]); setDraft(""); }
  return (
    <div style={{ marginBottom: 8 }}>
      <label className="admin-label">{label}</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <input className="admin-input" value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add item and press Enter" style={{ flex: 1 }} />
        <button type="button" className="admin-btn admin-btn-sm" style={{ marginTop: 0 }} onClick={add}>Add</button>
      </div>
      {items.length > 0 && (
        <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8,
              background: "var(--bg-hover)", borderRadius: 6, padding: "6px 10px",
              fontSize: 12.5, color: "var(--text-muted)" }}>
              <span style={{ flex: 1, lineHeight: 1.5 }}>{item}</span>
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "var(--text-faint)", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Research section ───────────────────────────────────────────────────────── */
const emptyResearch: ResearchItem = { title: "", type: "Technical Article", year: "", link: "", description: "" };
const researchTypes = ["Technical Article", "White Paper", "Open Source", "Conference Paper", "Blog Post"];

function ResearchSection({ items, onChange }: { items: ResearchItem[]; onChange: (v: ResearchItem[]) => void }) {
  const [form, setForm] = useState(emptyResearch);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  function save() {
    if (!form.title.trim()) return;
    if (editIdx !== null) {
      const updated = [...items]; updated[editIdx] = form;
      onChange(updated); setEditIdx(null);
    } else { onChange([...items, form]); }
    setForm(emptyResearch);
  }
  function edit(i: number) { setForm(items[i]); setEditIdx(i); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Publications &amp; Research</div>
          <div className="admin-card-subtitle">Technical articles, white papers, and open-source contributions.</div>
        </div>
      </div>
      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Title *</label>
          <input className="admin-input" value={form.title} placeholder="Article or paper title"
            onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Type</label>
          <select className="admin-input admin-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {researchTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Year</label>
          <input className="admin-input" value={form.year} placeholder="2024" onChange={e => setForm({ ...form, year: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Link URL</label>
          <input className="admin-input" value={form.link} placeholder="https://…" onChange={e => setForm({ ...form, link: e.target.value })} />
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Description</label>
        <textarea className="admin-textarea prose" rows={2} value={form.description}
          placeholder="Brief description of the work…" onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="admin-btn-row">
        <button type="button" className="admin-btn" onClick={save}>{editIdx !== null ? "Update" : "Add"}</button>
        {editIdx !== null && <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setForm(emptyResearch); setEditIdx(null); }}>Cancel</button>}
      </div>
      {/* List */}
      {items.length > 0 && (
        <ul className="admin-list" style={{ marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} className="admin-list-item">
              <div className="admin-list-item-body">
                <div className="admin-list-item-title">{item.title}</div>
                <div className="admin-list-item-meta">{item.type} · {item.year}</div>
              </div>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(i)}>Edit</button>
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(i)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Certifications section ─────────────────────────────────────────────────── */
const emptyCert: CertificationItem = { name: "", issuer: "", year: "", verifyUrl: "" };

function CertificationsSection({ items, onChange }: { items: CertificationItem[]; onChange: (v: CertificationItem[]) => void }) {
  const [form, setForm] = useState(emptyCert);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  function save() {
    if (!form.name.trim()) return;
    if (editIdx !== null) { const u = [...items]; u[editIdx] = form; onChange(u); setEditIdx(null); }
    else onChange([...items, form]);
    setForm(emptyCert);
  }
  function edit(i: number) { setForm(items[i]); setEditIdx(i); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Certifications</div>
          <div className="admin-card-subtitle">Verified credentials and completed courses.</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Certificate name *</label>
          <input className="admin-input" value={form.name} placeholder="Machine Learning Specialization"
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Issuer</label>
          <input className="admin-input" value={form.issuer} placeholder="Stanford Online / Coursera"
            onChange={e => setForm({ ...form, issuer: e.target.value })} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Year</label>
          <input className="admin-input" value={form.year} placeholder="2024" onChange={e => setForm({ ...form, year: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Verify URL</label>
          <input className="admin-input" value={form.verifyUrl} placeholder="https://…" onChange={e => setForm({ ...form, verifyUrl: e.target.value })} />
        </div>
      </div>
      <div className="admin-btn-row">
        <button type="button" className="admin-btn" onClick={save}>{editIdx !== null ? "Update" : "Add"}</button>
        {editIdx !== null && <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setForm(emptyCert); setEditIdx(null); }}>Cancel</button>}
      </div>
      {items.length > 0 && (
        <ul className="admin-list" style={{ marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} className="admin-list-item">
              <div style={{ fontSize: 20, flexShrink: 0 }}>🏅</div>
              <div className="admin-list-item-body">
                <div className="admin-list-item-title">{item.name}</div>
                <div className="admin-list-item-meta">{item.issuer} · {item.year}</div>
              </div>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(i)}>Edit</button>
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(i)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Experience section ─────────────────────────────────────────────────────── */
const emptyExp: ExperienceItem = { company: "", position: "", duration: "", responsibilities: [], achievements: [] };

function ExperienceSection({ items, onChange }: { items: ExperienceItem[]; onChange: (v: ExperienceItem[]) => void }) {
  const [form, setForm] = useState(emptyExp);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  function save() {
    if (!form.company.trim()) return;
    if (editIdx !== null) { const u = [...items]; u[editIdx] = form; onChange(u); setEditIdx(null); }
    else onChange([...items, form]);
    setForm(emptyExp);
  }
  function edit(i: number) { setForm(items[i]); setEditIdx(i); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Work Experience</div>
          <div className="admin-card-subtitle">Your career history shown on the about page.</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Company *</label>
          <input className="admin-input" value={form.company} placeholder="ManuelTech"
            onChange={e => setForm({ ...form, company: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Position</label>
          <input className="admin-input" value={form.position} placeholder="Founder & Lead Engineer"
            onChange={e => setForm({ ...form, position: e.target.value })} />
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Duration</label>
        <input className="admin-input" value={form.duration} placeholder="2022 — Present" style={{ maxWidth: 200 }}
          onChange={e => setForm({ ...form, duration: e.target.value })} />
      </div>
      <ArrayStringField label="Responsibilities" items={form.responsibilities}
        onChange={v => setForm({ ...form, responsibilities: v })} />
      <ArrayStringField label="Key achievements" items={form.achievements}
        onChange={v => setForm({ ...form, achievements: v })} />
      <div className="admin-btn-row">
        <button type="button" className="admin-btn" onClick={save}>{editIdx !== null ? "Update" : "Add"}</button>
        {editIdx !== null && <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setForm(emptyExp); setEditIdx(null); }}>Cancel</button>}
      </div>
      {items.length > 0 && (
        <ul className="admin-list" style={{ marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} className="admin-list-item">
              <div className="admin-list-item-body">
                <div className="admin-list-item-title">{item.position} — {item.company}</div>
                <div className="admin-list-item-meta">{item.duration}</div>
              </div>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(i)}>Edit</button>
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(i)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Testimonials section ───────────────────────────────────────────────────── */
const emptyTestimonial: TestimonialItem = { name: "", role: "", quote: "", avatar: "" };

function TestimonialsSection({ items, onChange }: { items: TestimonialItem[]; onChange: (v: TestimonialItem[]) => void }) {
  const [form, setForm] = useState(emptyTestimonial);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  function save() {
    if (!form.name.trim()) return;
    const avatar = form.avatar || form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const entry = { ...form, avatar };
    if (editIdx !== null) { const u = [...items]; u[editIdx] = entry; onChange(u); setEditIdx(null); }
    else onChange([...items, entry]);
    setForm(emptyTestimonial);
  }
  function edit(i: number) { setForm(items[i]); setEditIdx(i); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <div className="admin-card-title">Testimonials</div>
          <div className="admin-card-subtitle">Client and colleague feedback shown on the about and services pages.</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <div className="admin-field">
          <label className="admin-label">Name *</label>
          <input className="admin-input" value={form.name} placeholder="Sarah Chen"
            onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Role / Company</label>
          <input className="admin-input" value={form.role} placeholder="CTO, LogiFlow"
            onChange={e => setForm({ ...form, role: e.target.value })} />
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Quote</label>
        <textarea className="admin-textarea prose" rows={3} value={form.quote}
          placeholder="What they said about working with you…"
          onChange={e => setForm({ ...form, quote: e.target.value })} />
      </div>
      <div className="admin-field">
        <label className="admin-label">Avatar initials (optional — auto-generated from name)</label>
        <input className="admin-input" value={form.avatar} placeholder="SC" style={{ maxWidth: 80 }}
          onChange={e => setForm({ ...form, avatar: e.target.value })} />
      </div>
      <div className="admin-btn-row">
        <button type="button" className="admin-btn" onClick={save}>{editIdx !== null ? "Update" : "Add"}</button>
        {editIdx !== null && <button type="button" className="admin-btn admin-btn-ghost" onClick={() => { setForm(emptyTestimonial); setEditIdx(null); }}>Cancel</button>}
      </div>
      {items.length > 0 && (
        <ul className="admin-list" style={{ marginTop: 16 }}>
          {items.map((item, i) => (
            <li key={i} className="admin-list-item">
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "white",
              }}>{item.avatar}</div>
              <div className="admin-list-item-body">
                <div className="admin-list-item-title">{item.name}</div>
                <div className="admin-list-item-meta">{item.role}</div>
              </div>
              <div className="admin-list-item-actions">
                <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => edit(i)}>Edit</button>
                <button type="button" className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => remove(i)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function AdminAboutPage() {
  const [research, setResearch] = useState<ResearchItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState<"research" | "certs" | "experience" | "testimonials">("experience");

  useEffect(() => {
    adminApi.getAboutSections()
      .then(data => {
        setResearch(data.research);
        setCertifications(data.certifications);
        setExperience(data.experience);
        setTestimonials(data.testimonials);
      })
      .catch(e => { setIsError(true); setMessage(e.message); })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true); setMessage(""); setIsError(false);
    try {
      await adminApi.updateAboutSections({ research, certifications, experience, testimonials });
      setMessage("About sections saved successfully.");
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
        <div className="admin-page-header"><h1 className="admin-page-title">About sections</h1></div>
        <div className="admin-loading"><div className="admin-spinner" /> Loading…</div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">About sections</h1>
        <p className="admin-page-desc">
          Manage your experience, certifications, research, and testimonials shown on the about page.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "var(--bg-hover)", borderRadius: 8, padding: 4 }}>
        {(["experience", "certs", "research", "testimonials"] as const).map(t => (
          <button key={t} type="button" style={tabStyle(t)} onClick={() => setActiveTab(t)}>
            {t === "experience" ? "Experience" : t === "certs" ? "Certifications" : t === "research" ? "Research" : "Testimonials"}
          </button>
        ))}
      </div>

      {activeTab === "experience"   && <ExperienceSection    items={experience}     onChange={setExperience} />}
      {activeTab === "certs"        && <CertificationsSection items={certifications} onChange={setCertifications} />}
      {activeTab === "research"     && <ResearchSection       items={research}       onChange={setResearch} />}
      {activeTab === "testimonials" && <TestimonialsSection   items={testimonials}   onChange={setTestimonials} />}

      <AlertMsg msg={message} error={isError} />

      <div className="admin-btn-row">
        <button type="button" className="admin-btn" disabled={saving} onClick={save}>
          {saving ? (
            <><div className="admin-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />Saving…</>
          ) : (
            <><SaveIcon />Save all changes</>
          )}
        </button>
      </div>
    </>
  );
}

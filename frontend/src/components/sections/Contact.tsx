"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import type { SiteConfig } from "@/lib/content";
import { submitContactForm } from "@/lib/api";

interface ContactProps {
  siteConfig: SiteConfig;
}

export function Contact({ siteConfig }: ContactProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitContactForm({
        name: data.get("name") as string,
        email: data.get("email") as string,
        subject: data.get("subject") as string,
        message: data.get("message") as string,
      });
      setStatus("success");
      setFeedback("Thanks — I'll reply soon.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("Couldn't send. Email me directly instead.");
    }
  }

  return (
    <section className="min-h-[calc(100vh-3.5rem)] py-16 sm:py-20">
      <div className="portfolio-wrap">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-2">
            <p className="section-label">Contact</p>
            <h2 className="section-heading mt-1">Let&apos;s talk</h2>
            <p className="mt-3 text-stone-600">
              Open to freelance, collaborations, and full-time roles.
            </p>

            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-8 flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">Email me</p>
                <p className="mt-1 text-sm text-stone-600 break-all">{siteConfig.email}</p>
              </div>
              <Mail size={20} className="flex-shrink-0 text-blue-600" />
            </a>

            <div className="mt-4 flex gap-3">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-stone-200 p-2.5 text-stone-500 hover:text-stone-900"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-stone-200 p-2.5 text-stone-500 hover:text-stone-900"
                aria-label="GitHub"
              >
                <GitHubIcon size={18} />
              </a>
              <a
                href={siteConfig.resumeUrl}
                download
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-500 hover:text-stone-900"
              >
                Resume
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="portfolio-card space-y-4 p-5 lg:col-span-3 lg:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-xs font-medium text-stone-500">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-medium text-stone-500">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="text-xs font-medium text-stone-500">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                required
                className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-xs font-medium text-stone-500">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className="mt-1 w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 py-2.5 text-sm font-medium text-white disabled:opacity-60 sm:w-auto sm:px-6"
            >
              <Send size={16} />
              {status === "loading" ? "Sending…" : "Send message"}
            </button>
            {feedback && (
              <p
                className={`text-sm ${
                  status === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {feedback}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

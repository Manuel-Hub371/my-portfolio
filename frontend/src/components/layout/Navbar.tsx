"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { contactHref, navItems } from "@/data/portfolio";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ siteName = "Emmanuel" }: { siteName?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-stone-200 bg-stone-50/95 backdrop-blur-md"
          : "border-transparent bg-stone-50"
      }`}
    >
      <nav className="portfolio-wrap flex h-14 items-center justify-between gap-4">
        <Link href="/" className="text-sm font-semibold text-stone-900">
          {siteName.split(" ")[0]}
          <span className="text-stone-400">.</span>
        </Link>


        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive(pathname, item.href)
                    ? "font-medium text-stone-900"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={contactHref}
          className={`hidden items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm transition-all md:inline-flex ${
            pathname === contactHref
              ? "border-blue-600 bg-blue-50 text-stone-900"
              : "border-stone-200 bg-white text-stone-900 hover:border-blue-300 hover:shadow"
          }`}
        >
          Contact me
          <ArrowUpRight size={15} className="text-blue-600" />
        </Link>

        <button
          type="button"
          className="rounded-md p-2 text-stone-500 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-200 bg-stone-50 md:hidden">
          <ul className="portfolio-wrap flex flex-col gap-1 py-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2.5 text-sm ${
                    isActive(pathname, item.href)
                      ? "font-medium text-stone-900"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={contactHref}
                className="flex items-center justify-between rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium"
              >
                Contact me
                <ArrowUpRight size={15} className="text-blue-600" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

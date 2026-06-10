import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPortfolio } from "@/lib/content";

export const dynamic = "force-static";

function NavbarFallback() {
  return <header className="h-14 border-b border-stone-200 bg-stone-50" />;
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteConfig } = await getPortfolio();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Suspense fallback={<NavbarFallback />}>
        <Navbar siteName={siteConfig.name} />
      </Suspense>
      <main>{children}</main>
      <Footer name={siteConfig.name} />
    </div>
  );
}


import { Contact } from "@/components/sections/Contact";
import { getPortfolio } from "@/lib/content";

export const dynamic = "force-static";

export async function generateMetadata() {
  const { siteConfig } = await getPortfolio();
  return {
    title: `Contact — ${siteConfig.name}`,
    description: "Get in touch for freelance, collaborations, and opportunities.",
  };
}

export default async function ContactPage() {
  const { siteConfig } = await getPortfolio();
  return <Contact siteConfig={siteConfig} />;
}

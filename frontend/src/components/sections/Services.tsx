import type { Service } from "@/lib/content";

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  return (
    <section className="min-h-[calc(100vh-3.5rem)] py-16 sm:py-20">
      <div className="portfolio-narrow">
        <p className="section-label">Services</p>
        <h2 className="section-heading mt-1">What I can help with</h2>
        <p className="mt-2 text-stone-600">Freelance and contract work through ManuelTech.</p>

        <ul className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
          {services.map((service) => (
            <li key={service.title} className="py-5 first:pt-6 last:pb-6">
              <h3 className="font-medium text-stone-900">{service.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

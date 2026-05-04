import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  aboutIntro,
  experience,
  strengths,
  workPrinciples
} from "@/data/common/about";

export const metadata: Metadata = {
  title: "About",
  description: "About Kamal Singh and the way he builds software."
};

export default function AboutPage() {
  return (
    <article className="space-y-12">
      <PageHeader
        eyebrow="About Kamal"
        title="I like building software that feels calm on the surface and dependable underneath."
      >
        {aboutIntro.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-8 text-zinc-700">
            {paragraph}
          </p>
        ))}
      </PageHeader>

      <section className="grid gap-4 sm:grid-cols-3">
        {strengths.map((item) => (
          <div key={item.title} className="rounded-lg border border-line bg-white p-4">
            <p className="text-sm font-medium text-zinc-500">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-5 border-t border-line pt-8">
        <SectionHeading title="How I Work" />
        <div className="space-y-4">
          {workPrinciples.map((item) => (
            <div key={item.title} className="border-l-2 border-ink pl-4">
              <h3 className="font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-6 border-t border-line pt-8">
        <SectionHeading title="Experience" />

        {experience.map((item) => (
          <div
            key={`${item.role}-${item.period}`}
            className="space-y-3 rounded-lg border border-line bg-zinc-50 p-5"
          >
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.role}</h3>
              <p className="text-sm text-zinc-500">
                {item.company} - {item.type}
              </p>
              <p className="text-sm font-medium text-zinc-600">{item.period}</p>
            </div>
            <ul className="space-y-2 text-sm text-zinc-700">
              {item.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="font-bold text-ink">-</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <ContactSection />
    </article>
  );
}

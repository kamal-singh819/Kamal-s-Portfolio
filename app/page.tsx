import { skills } from "@/data/common/skills";
import Link from "next/link";
import { projects } from "@/data/common/projects";
import { profile } from "@/data/common/profile";
import { ContactSection } from "@/components/ContactSection";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

export default function HomePage() {
  const featuredProjects = projects.slice(0, 3);
  const coreSkills = skills.slice(0, 12);

  return (
    <div className="space-y-14">
      {/* Hero Section */}
      <PageHeader
        eyebrow={profile.role}
        title={`Hi, I'm ${profile.name}.`}
        description={profile.tagline}
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            View projects
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-zinc-50"
          >
            About me
          </Link>
          <Link
            href="/blogs"
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-zinc-50"
          >
            Read blog
          </Link>
        </div>

        <div className="grid gap-3 border-y border-line py-5 sm:grid-cols-3">
          {profile.highlights.map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-ink">{item.value}</p>
              <p className="text-sm text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* Featured Projects */}
      <section className="space-y-5">
        <SectionHeading
          title="Selected Work"
          description="Product-shaped projects across marketplaces, mobile apps, and real-time systems."
          action={
            <Link href="/projects" className="text-sm font-medium text-ink underline">
              All projects
            </Link>
          }
        />

        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} compact />
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-4">
        <SectionHeading
          title="Tools I Reach For"
          description="A practical stack for building, shipping, and maintaining product features."
          action={
            <Link href="/about" className="text-sm font-medium text-ink underline">
              How I work
            </Link>
          }
        />
        <div className="flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <Tag key={skill} variant="pill">
              {skill}
            </Tag>
          ))}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}

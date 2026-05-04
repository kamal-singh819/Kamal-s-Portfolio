import { projects } from "@/data/common/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected web development projects by Kamal Singh."
};

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        description="A closer look at the products, apps, and systems I have worked on across frontend, backend, and mobile."
      />

      <div className="space-y-5">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

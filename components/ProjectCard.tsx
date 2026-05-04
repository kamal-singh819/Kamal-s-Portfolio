import type { Project } from "@/data/common/projects";
import { Tag } from "@/components/ui/Tag";

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  return (
    <article className="border-t border-line pt-5">
      <div className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-ink">{project.title}</h2>
          <p className="text-sm font-medium text-zinc-500">{project.subtitle}</p>
        </div>
        {compact ? null : (
          <p className="leading-7 text-zinc-700">{project.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {(compact ? project.tech.slice(0, 4) : project.tech).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
        {project.links?.length ? (
          <div className="flex gap-4 text-sm font-medium">
            {project.links.map((link) => (
              <a key={link.href} href={link.href} className="text-ink underline">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

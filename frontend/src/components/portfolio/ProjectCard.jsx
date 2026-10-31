import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectThumbnail } from '../common/ProjectThumbnail.jsx';
import { TechBadge } from '../ui/Badge.jsx';

export function ProjectCard({ project }) {
  const technologies = project.technologies ?? [];
  const visibleTechnologies = technologies.slice(0, 4);
  const remaining = technologies.length - visibleTechnologies.length;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/25 hover:bg-white/[0.03] hover:shadow-card">
      <Link
        to={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={`View ${project.title}`}
      >
        <ProjectThumbnail
          project={project}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {project.is_featured ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-300 backdrop-blur">
            Featured
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-zinc-100">
            <Link
              to={`/projects/${project.slug}`}
              className="transition-colors hover:text-accent-300"
            >
              {project.title}
            </Link>
          </h3>
          <Link
            to={`/projects/${project.slug}`}
            className="mt-0.5 text-zinc-600 transition-colors hover:text-accent-300"
            aria-label={`Open ${project.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="line-clamp-2 mt-2 text-sm leading-relaxed text-zinc-500">
          {project.short_description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {visibleTechnologies.map((technology) => (
            <TechBadge key={technology.id ?? technology.name}>{technology.name}</TechBadge>
          ))}
          {remaining > 0 ? <TechBadge>+{remaining}</TechBadge> : null}
        </div>

        <div className="mt-auto flex items-center gap-4 border-t border-white/[0.05] pt-4">
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Source
            </a>
          ) : null}
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live demo
            </a>
          ) : null}
          {!project.github_url && !project.demo_url ? (
            <span className="text-xs text-zinc-700">Case study</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

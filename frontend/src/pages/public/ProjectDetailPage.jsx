import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  FolderGit2,
  Github,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { ProjectThumbnail } from '../../components/common/ProjectThumbnail.jsx';
import { TechBadge } from '../../components/ui/Badge.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDateRange } from '../../utils/format.js';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, loading, error, reload } = useResource(
    () => api.get(`/projects/${encodeURIComponent(slug)}`),
    [slug],
  );

  useEffect(() => {
    document.title = project ? `${project.title} — Projects` : 'Project — Personal Portfolio';
  }, [project]);

  if (loading) {
    return (
      <div className="pt-20">
        <PageLoader label="Loading project" />
      </div>
    );
  }

  if (error) {
    if (error.status === 404) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20 text-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <FolderGit2 className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">404</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-100">Project not found</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
            This project may have been unpublished or removed.
          </p>
          <Button as={Link} to="/projects" variant="secondary" className="mt-6">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All projects
          </Button>
        </div>
      );
    }

    return (
      <div className="pt-20">
        <ErrorState
          title="This project could not be loaded"
          message={error.message}
          onRetry={reload}
        />
      </div>
    );
  }

  if (!project) return null;

  const timeline = formatDateRange(project.start_date, project.end_date, false);
  const paragraphs = (project.description || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="pt-28 sm:pt-32">
      <div className="shell pb-20 sm:pb-28">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All projects
        </Link>

        <div className="mt-8 max-w-3xl animate-fade-up">
          {project.is_featured ? (
            <span className="inline-flex rounded-full border border-accent-400/25 bg-accent-400/[0.07] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent-300">
              Featured project
            </span>
          ) : null}
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            {project.short_description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {(project.technologies ?? []).map((technology) => (
              <TechBadge key={technology.id ?? technology.name}>{technology.name}</TechBadge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-300"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View source
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              </a>
            ) : null}
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                <ExternalLink className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                Live demo
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900 animate-fade-up animation-delay-100">
          <ProjectThumbnail
            project={project}
            className="aspect-[16/9] w-full sm:aspect-[21/9]"
            iconClassName="h-6 w-6"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-400">
              Overview
            </h2>
            {paragraphs.length > 0 ? (
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-zinc-500">
                {project.short_description}
              </p>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 lg:sticky lg:top-24">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              Project details
            </h2>

            {timeline ? (
              <div className="mt-4 flex items-start gap-2.5 border-b border-white/[0.05] pb-4">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
                <div>
                  <p className="text-xs text-zinc-500">Timeline</p>
                  <p className="mt-0.5 text-sm text-zinc-300">{timeline}</p>
                </div>
              </div>
            ) : null}

            {(project.technologies ?? []).length > 0 ? (
              <div className="border-b border-white/[0.05] py-4">
                <p className="text-xs text-zinc-500">Technologies</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.technologies.map((technology) => (
                    <TechBadge key={technology.id ?? technology.name}>
                      {technology.name}
                    </TechBadge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2 pt-4">
              {project.github_url ? (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    GitHub repository
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
              {project.demo_url ? (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-100"
                >
                  <span className="inline-flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    Live application
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

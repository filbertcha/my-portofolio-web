import { useEffect } from 'react';
import { FolderGit2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { ProjectCard } from '../../components/portfolio/ProjectCard.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { pluralize } from '../../utils/format.js';

export function ProjectsPage() {
  const { data, loading, error, reload } = useResource(
    () => api.get('/projects?limit=50'),
    [],
  );

  useEffect(() => {
    document.title = 'Projects — Personal Portfolio';
  }, []);

  const projects = data?.items ?? [];

  return (
    <div className="pt-28 sm:pt-32">
      <div className="shell pb-20 sm:pb-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="eyebrow">All work</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Projects.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">
            A collection of things I have built — full-stack applications, APIs, and experiments.
            Each project is a chance to learn something new.
          </p>
          {!loading && !error ? (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
              {pluralize(projects.length, 'project')} published
            </p>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-white/[0.06]">
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Projects could not be loaded"
            message={error.message}
            onRetry={reload}
          />
        ) : projects.length > 0 ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={Math.min(index * 60, 300)}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-12"
            icon={FolderGit2}
            title="No published projects yet"
            description="Published projects will appear here as soon as they are added in the admin dashboard."
          />
        )}
      </div>
    </div>
  );
}

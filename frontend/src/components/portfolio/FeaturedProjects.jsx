import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2 } from 'lucide-react';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { ProjectCard } from './ProjectCard.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export function FeaturedProjects({ projects }) {
  const featured = projects.filter((project) => project.is_featured);
  const visible = (featured.length > 0 ? featured : projects).slice(0, 3);

  return (
    <section id="projects" className="border-t border-white/[0.05] py-20 sm:py-28">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="02 — Selected work"
            title={featured.length > 0 ? 'Featured projects.' : 'Recent projects.'}
            description="A few things I have designed, built, and shipped — from booking systems to developer tools."
          />
          <Link
            to="/projects"
            className="group inline-flex shrink-0 items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-accent-300"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </Reveal>

        {visible.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, index) => (
              <Reveal key={project.id} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            icon={FolderGit2}
            title="Projects are on the way"
            description="Published projects will appear here as soon as they are added to the dashboard."
          />
        )}
      </div>
    </section>
  );
}

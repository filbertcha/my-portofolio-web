import { Code2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { getInitials, projectGradient, resolveAssetUrl } from '../../utils/format.js';

export function ProjectThumbnail({ project, className, iconClassName }) {
  const src = resolveAssetUrl(project?.image_url);
  const gradient = projectGradient(project?.slug || project?.title || '');

  return (
    <div className={cn('relative overflow-hidden bg-ink-900', className)}>
      {src ? (
        <img
          src={src}
          alt={`${project?.title ?? 'Project'} preview`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
          <div className="absolute inset-0 bg-grid opacity-70" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute inset-0 flex items-center justify-between p-5 sm:p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Project
            </span>
            <Code2 className={cn('h-4 w-4 text-white/30', iconClassName)} aria-hidden="true" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-4xl font-semibold tracking-tight text-white/15 sm:text-5xl">
              {getInitials(project?.title)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

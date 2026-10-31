import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, FolderKanban, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge, TechBadge } from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { ProjectThumbnail } from '../../components/common/ProjectThumbnail.jsx';
import { formatDate, pluralize } from '../../utils/format.js';
import { projectPayload } from '../../utils/payloads.js';

export function ProjectsPage() {
  const { data, loading, error, reload } = useResource(() => api.get('/admin/projects'), []);
  const toast = useToast();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const projects = data?.items ?? [];

  useEffect(() => {
    document.title = 'Projects — Admin';
  }, []);

  const togglePublished = async (project) => {
    setBusyId(project.id);
    try {
      await api.put(
        `/admin/projects/${project.id}`,
        projectPayload(project, { is_published: !project.is_published }),
      );
      toast.success(
        project.is_published
          ? `"${project.title}" is now hidden from the public site.`
          : `"${project.title}" is now published.`,
      );
      reload();
    } catch (publishError) {
      toast.error(publishError.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/projects/${deleteTarget.id}`);
      toast.success(`"${deleteTarget.title}" was deleted.`);
      setDeleteTarget(null);
      reload();
    } catch (deleteError) {
      toast.error(deleteError.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Create, publish, and organize the work shown on your portfolio."
      >
        <Button as={Link} to="/admin/projects/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
        </Button>
      </PageHeader>

      {loading ? (
        <div className="admin-card space-y-3 p-5">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Projects could not be loaded" message={error.message} onRetry={reload} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Add your first project to start building your portfolio."
          action={
            <Button as={Link} to="/admin/projects/new" size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add project
            </Button>
          }
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {pluralize(projects.length, 'project')}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {projects.filter((project) => project.is_published).length} published
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Technologies</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {projects.map((project) => (
                  <tr key={project.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="group flex items-center gap-3"
                      >
                        <ProjectThumbnail
                          project={project}
                          className="h-10 w-14 shrink-0 rounded-lg border border-white/[0.06]"
                          iconClassName="h-3 w-3"
                        />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-medium text-zinc-200 group-hover:text-accent-300">
                            {project.title}
                            {project.is_featured ? (
                              <Star className="h-3 w-3 fill-accent-400 text-accent-400" aria-label="Featured" />
                            ) : null}
                          </p>
                          <p className="truncate font-mono text-[10px] text-zinc-600">
                            /{project.slug}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies ?? []).slice(0, 2).map((technology) => (
                          <TechBadge key={technology.id ?? technology.name}>
                            {technology.name}
                          </TechBadge>
                        ))}
                        {(project.technologies ?? []).length > 2 ? (
                          <TechBadge>+{project.technologies.length - 2}</TechBadge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={project.is_published ? 'success' : 'warning'}>
                        {project.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {project.sort_order}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {formatDate(project.updated_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublished(project)}
                          loading={busyId === project.id}
                          title={project.is_published ? 'Unpublish' : 'Publish'}
                          aria-label={project.is_published ? 'Unpublish project' : 'Publish project'}
                          className="h-8 w-8"
                        >
                          {project.is_published ? (
                            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          as={Link}
                          to={`/admin/projects/${project.id}/edit`}
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          aria-label={`Edit ${project.title}`}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(project)}
                          title="Delete"
                          aria-label={`Delete ${project.title}`}
                          className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed from the public site and the dashboard. This action cannot be undone.`
            : ''
        }
      />
    </div>
  );
}

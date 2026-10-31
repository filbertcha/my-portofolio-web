import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Eye,
  FolderKanban,
  GraduationCap,
  Mail,
  Plus,
  UserRound,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { ProjectThumbnail } from '../../components/common/ProjectThumbnail.jsx';
import { formatDate, pluralize } from '../../utils/format.js';

function StatCard({ label, value, icon: Icon, href, hint }) {
  return (
    <Link
      to={href}
      className="admin-card group p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
          <Icon className="h-4 w-4 text-accent-300" aria-hidden="true" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-zinc-700 transition-colors group-hover:text-zinc-400" aria-hidden="true" />
      </div>
      <p className="mt-4 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
      {hint ? <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-700">{hint}</p> : null}
    </Link>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useResource(
    () => Promise.all([api.get('/admin/stats'), api.get('/admin/projects')]),
    [],
  );

  useEffect(() => {
    document.title = 'Dashboard — Admin';
  }, []);

  const [stats, projects] = data ?? [];
  const items = projects?.items ?? [];
  const recent = [...items]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.username ?? 'admin'}.`}
        description="Here is a quick overview of your portfolio content."
      >
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-accent-300"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
        </Link>
      </PageHeader>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-32 rounded-2xl" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : error ? (
        <ErrorState
          title="Dashboard data could not be loaded"
          message={error.message}
          onRetry={reload}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              label="Total projects"
              value={stats?.total_projects ?? 0}
              icon={FolderKanban}
              href="/admin/projects"
              hint={`${pluralize(stats?.featured_projects ?? 0, 'featured')}`}
            />
            <StatCard
              label="Published projects"
              value={stats?.published_projects ?? 0}
              icon={Eye}
              href="/admin/projects"
              hint={`${Math.max((stats?.total_projects ?? 0) - (stats?.published_projects ?? 0), 0)} drafts`}
            />
            <StatCard
              label="Experiences"
              value={stats?.total_experiences ?? 0}
              icon={BriefcaseBusiness}
              href="/admin/experiences"
              hint="Career timeline"
            />
            <StatCard
              label="Education records"
              value={stats?.total_education ?? 0}
              icon={GraduationCap}
              href="/admin/education"
              hint="Academic background"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
            <section className="admin-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-200">Recently updated</h2>
                  <p className="mt-0.5 text-xs text-zinc-600">Your latest project changes</p>
                </div>
                <Link
                  to="/admin/projects"
                  className="text-xs text-zinc-500 transition-colors hover:text-accent-300"
                >
                  View all
                </Link>
              </div>

              {recent.length > 0 ? (
                <ul className="divide-y divide-white/[0.05]">
                  {recent.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                      >
                        <ProjectThumbnail
                          project={project}
                          className="h-11 w-16 shrink-0 rounded-lg border border-white/[0.06]"
                          iconClassName="h-3 w-3"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-200">
                            {project.title}
                          </p>
                          <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-600">
                            /{project.slug}
                          </p>
                        </div>
                        <div className="hidden shrink-0 text-right sm:block">
                          <p className="text-[11px] text-zinc-600">
                            {formatDate(project.updated_at)}
                          </p>
                        </div>
                        <Badge variant={project.is_published ? 'success' : 'warning'}>
                          {project.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  className="m-5 border-white/[0.06] py-10"
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Create your first project to see it here."
                />
              )}
            </section>

            <section className="admin-card h-fit p-5">
              <h2 className="text-sm font-semibold text-zinc-200">Quick actions</h2>
              <p className="mt-0.5 text-xs text-zinc-600">Keep your content fresh</p>

              <div className="mt-4 space-y-1.5">
                {[
                  { label: 'Add a project', to: '/admin/projects/new', icon: FolderKanban },
                  { label: 'Add experience', to: '/admin/experiences', icon: BriefcaseBusiness },
                  { label: 'Edit profile', to: '/admin/profile', icon: UserRound },
                  { label: 'Update contact', to: '/admin/contact', icon: Mail },
                ].map(({ label, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-xs text-zinc-400 transition-colors hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-zinc-100"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-600 group-hover:text-accent-300" aria-hidden="true" />
                    {label}
                    <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-zinc-700" aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-accent-400/15 bg-accent-400/[0.05] p-3.5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-accent-400">
                  Reminder
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  Only published content appears on the public website. Drafts stay private in
                  the dashboard.
                </p>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

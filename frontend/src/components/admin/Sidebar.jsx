import { NavLink, Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  UserRound,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getInitials } from '../../utils/format.js';

export const adminNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Profile', to: '/admin/profile', icon: UserRound },
  { label: 'Projects', to: '/admin/projects', icon: FolderKanban },
  { label: 'Experience', to: '/admin/experiences', icon: BriefcaseBusiness },
  { label: 'Education', to: '/admin/education', icon: GraduationCap },
  { label: 'Contact', to: '/admin/contact', icon: Mail },
];

function SidebarContent({ onNavigate, onLogout }) {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-3 border-b border-white/[0.06] px-5">
        <Link to="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent-400/25 bg-accent-400/[0.08] font-mono text-[11px] text-accent-300">
            {'</>'}
          </span>
          <span className="font-mono text-sm text-zinc-300">
            ~/<span className="text-accent-400">portfolio</span>
          </span>
        </Link>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {adminNavItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                isActive
                  ? 'border border-accent-400/20 bg-accent-400/[0.08] text-accent-200'
                  : 'border border-transparent text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn('h-4 w-4', isActive ? 'text-accent-400' : 'text-zinc-600 group-hover:text-zinc-400')}
                  aria-hidden="true"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <Link
          to="/"
          className="mb-2 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
        >
          <span className="inline-flex items-center gap-3">
            <ArrowUpRight className="h-4 w-4 text-zinc-600" aria-hidden="true" />
            View website
          </span>
        </Link>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-accent-400/25 to-ink-800 font-mono text-[10px] font-semibold text-accent-300">
            {getInitials(user?.username || user?.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-300">{user?.username}</p>
            <p className="truncate text-[10px] text-zinc-600">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onClose, onLogout }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-ink-900/50 backdrop-blur-xl lg:block">
        <SidebarContent onNavigate={undefined} onLogout={onLogout} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-ink-900 shadow-2xl animate-slide-in-right">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={onClose} onLogout={onLogout} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

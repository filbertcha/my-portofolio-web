import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MonitorSmartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Sidebar } from '../components/admin/Sidebar.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('You have been signed out.');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-950">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-white/[0.06] bg-ink-950/80 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span className="hidden sm:inline">Admin</span>
              <span className="hidden sm:inline text-zinc-700">/</span>
              <span className="capitalize text-zinc-400">
                {location.pathname === '/admin'
                  ? 'Dashboard'
                  : location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:text-zinc-100"
            >
              <MonitorSmartphone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">View website</span>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

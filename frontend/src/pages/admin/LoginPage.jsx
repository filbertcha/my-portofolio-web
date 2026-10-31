import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, Input } from '../../components/ui/Field.jsx';
import { Spinner } from '../../components/ui/Spinner.jsx';

export function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Admin sign in — Personal Portfolio';
  }, []);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('Enter your email or username and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Sign in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-400/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm text-zinc-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] text-accent-300">
            {'</>'}
          </span>
          ~/<span className="text-accent-400">portfolio</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to website
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 pb-20 pt-8">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-400/20 bg-accent-400/[0.07]">
              <LockKeyhole className="h-5 w-5 text-accent-300" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50">Admin sign in</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Sign in to manage your portfolio content.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-white/[0.08] bg-ink-900/70 p-6 shadow-card backdrop-blur"
          >
            {error ? (
              <div
                className="rounded-xl border border-rose-400/20 bg-rose-500/[0.08] px-3.5 py-3 text-xs leading-relaxed text-rose-200"
                role="alert"
              >
                {error}
              </div>
            ) : null}

            <Field label="Email or username" htmlFor="identifier" required>
              <Input
                id="identifier"
                name="identifier"
                autoComplete="username"
                autoFocus
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="admin@example.com"
              />
            </Field>

            <Field label="Password" htmlFor="password" required>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-600 transition-colors hover:text-zinc-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <Button type="submit" className="w-full" loading={submitting}>
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-600">
            This area is restricted to the site administrator.
          </p>
        </div>
      </main>
    </div>
  );
}

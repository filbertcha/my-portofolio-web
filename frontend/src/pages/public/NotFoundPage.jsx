import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-400">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button as={Link} to="/" variant="secondary" className="mt-7">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Button>
    </div>
  );
}

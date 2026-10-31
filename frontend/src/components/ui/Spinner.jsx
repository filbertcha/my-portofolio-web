import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function Spinner({ className }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-accent-400', className)} aria-hidden="true" />;
}

export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Spinner className="h-6 w-6" />
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">{label}</p>
    </div>
  );
}

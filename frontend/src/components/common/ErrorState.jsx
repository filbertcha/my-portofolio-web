import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
        <AlertTriangle className="h-5 w-5 text-rose-300" aria-hidden="true" />
      </div>
      <h2 className="text-base font-medium text-zinc-200">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

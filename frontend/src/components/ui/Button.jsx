import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

const variants = {
  primary:
    'bg-accent-400 text-ink-950 shadow-[0_8px_30px_-12px_rgba(52,211,153,0.55)] hover:bg-accent-300 hover:shadow-[0_10px_36px_-12px_rgba(52,211,153,0.7)]',
  secondary:
    'border border-white/10 bg-white/[0.04] text-zinc-200 hover:border-white/20 hover:bg-white/[0.07]',
  ghost: 'text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100',
  danger:
    'border border-rose-400/20 bg-rose-500/10 text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/20',
  subtle: 'bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
  icon: 'h-9 w-9 p-0',
};

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  loading = false,
  disabled,
  type,
  children,
  ...props
}) {
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
      {...(isNativeButton
        ? { type: type ?? 'button', disabled: disabled || loading }
        : {})}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </Component>
  );
}

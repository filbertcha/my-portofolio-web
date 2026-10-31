import { cn } from '../../utils/cn.js';

const variants = {
  neutral: 'border-white/10 bg-white/[0.04] text-zinc-400',
  accent: 'border-accent-400/25 bg-accent-400/[0.08] text-accent-300',
  success: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300',
  warning: 'border-amber-400/25 bg-amber-400/[0.08] text-amber-300',
  danger: 'border-rose-400/25 bg-rose-400/[0.08] text-rose-300',
  info: 'border-sky-400/25 bg-sky-400/[0.08] text-sky-300',
};

export function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TechBadge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400',
        className,
      )}
    >
      {children}
    </span>
  );
}

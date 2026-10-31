import { cn } from '../../utils/cn.js';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/[0.05]', className)} />;
}

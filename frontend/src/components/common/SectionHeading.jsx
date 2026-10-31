import { cn } from '../../utils/cn.js';

export function SectionHeading({ eyebrow, title, description, className, align = 'left' }) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

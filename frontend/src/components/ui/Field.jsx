import { cn } from '../../utils/cn.js';

export function Field({ label, htmlFor, error, hint, required, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-xs font-medium text-zinc-400">
          {label}
          {required ? <span className="ml-1 text-accent-400">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs text-rose-300" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-zinc-600">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, invalid, ...props }) {
  return (
    <input
      className={cn('field-input', invalid && 'border-rose-400/50', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Textarea({ className, invalid, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn('field-input resize-y leading-relaxed', invalid && 'border-rose-400/50', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({ className, invalid, children, ...props }) {
  return (
    <select
      className={cn(
        'field-input appearance-none bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-9',
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%2371717a' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
        invalid && 'border-rose-400/50',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function Switch({ checked, onChange, label, description, disabled, id }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        {label ? (
          <label htmlFor={id} className="block cursor-pointer text-sm font-medium text-zinc-200">
            {label}
          </label>
        ) : null}
        {description ? <p className="mt-0.5 text-xs text-zinc-500">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 disabled:opacity-50',
          checked
            ? 'border-accent-400/50 bg-accent-400/90'
            : 'border-white/10 bg-white/[0.06] hover:bg-white/[0.1]',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-200',
            checked ? 'left-[1.45rem] bg-ink-950' : 'left-1 bg-zinc-400',
          )}
        />
      </button>
    </div>
  );
}

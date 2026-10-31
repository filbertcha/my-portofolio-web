const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Format a YYYY-MM-DD string as "Feb 2025" without timezone drift. */
export function formatMonthYear(value) {
  if (!value) return null;
  const [year, month] = String(value).split('-');
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex) || !MONTHS_SHORT[monthIndex]) return year || null;
  return `${MONTHS_SHORT[monthIndex]} ${year}`;
}

export function formatDateRange(startDate, endDate, isCurrent = false) {
  const start = formatMonthYear(startDate);
  const end = isCurrent ? 'Present' : formatMonthYear(endDate);
  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} — ${end}`;
}

export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function resolveAssetUrl(path) {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = (import.meta.env.VITE_ASSET_URL || '').replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ME';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function slugify(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}

const GRADIENTS = [
  'from-emerald-500/25 via-teal-600/10 to-ink-950',
  'from-indigo-500/25 via-violet-600/10 to-ink-950',
  'from-amber-500/20 via-orange-600/10 to-ink-950',
  'from-sky-500/25 via-cyan-600/10 to-ink-950',
  'from-rose-500/20 via-pink-600/10 to-ink-950',
];

export function projectGradient(seed = '') {
  // FNV-1a keeps similar slugs from collapsing onto the same color.
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return GRADIENTS[(hash >>> 0) % GRADIENTS.length];
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

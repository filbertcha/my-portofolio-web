import { cn } from '../../utils/cn.js';
import { getInitials, resolveAssetUrl } from '../../utils/format.js';

export function ProfileAvatar({ profile, className, textClassName }) {
  const src = resolveAssetUrl(profile?.profile_image);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-accent-400/20 via-ink-800 to-ink-900',
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={profile?.full_name ? `${profile.full_name} portrait` : 'Profile photo'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={cn('font-mono font-semibold text-accent-300', textClassName)}>
          {getInitials(profile?.full_name)}
        </span>
      )}
    </div>
  );
}

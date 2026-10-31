import { Github, Globe, Linkedin, Mail, Phone } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export function getContactLinks(contact) {
  if (!contact) return [];

  return [
    contact.github_url && {
      key: 'github',
      label: 'GitHub',
      href: contact.github_url,
      icon: Github,
    },
    contact.linkedin_url && {
      key: 'linkedin',
      label: 'LinkedIn',
      href: contact.linkedin_url,
      icon: Linkedin,
    },
    contact.website_url && {
      key: 'website',
      label: 'Website',
      href: contact.website_url,
      icon: Globe,
    },
    contact.email && {
      key: 'email',
      label: 'Email',
      href: `mailto:${contact.email}`,
      icon: Mail,
    },
    contact.phone && {
      key: 'phone',
      label: 'Phone',
      href: `tel:${contact.phone.replace(/\s+/g, '')}`,
      icon: Phone,
    },
  ].filter(Boolean);
}

export function SocialLinks({ contact, variant = 'default', className }) {
  const links = getContactLinks(contact);
  if (links.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {links.map(({ key, label, href, icon: Icon }) => (
        <a
          key={key}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
          aria-label={label}
          title={label}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-xl border text-zinc-500 transition-all duration-200',
            variant === 'default'
              ? 'border-white/[0.08] bg-white/[0.02] hover:border-accent-400/30 hover:text-accent-300'
              : 'border-white/15 bg-white/[0.04] text-zinc-300 hover:border-accent-400/40 hover:text-accent-300',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

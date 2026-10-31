import { Link } from 'react-router-dom';
import { ArrowDownRight, Mail } from 'lucide-react';
import { SocialLinks, getContactLinks } from '../common/SocialLinks.jsx';

export function HeroSection({ profile, contact }) {
  const name = profile?.full_name || 'Your Name';
  const headline = profile?.headline || 'Full-Stack Developer';
  const description =
    profile?.about?.split('\n')[0] ||
    'I design and build reliable web applications, from database schemas to polished interfaces.';
  const hasSocialLinks = getContactLinks(contact).length > 0;

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent-400/[0.08] blur-[140px]" />
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_60%_48%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="shell relative flex flex-col items-center pb-24 pt-12 text-center sm:pb-28 lg:pb-32 lg:pt-16">
        <div className="animate-fade-up">
          <h1 className="break-words text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="text-gradient">{name}</span>
            <span className="text-accent-400">.</span>
          </h1>

          <p className="mt-6 text-lg font-medium text-zinc-300 sm:text-xl lg:text-2xl">
            {headline}
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-sm leading-relaxed text-zinc-500 sm:text-base">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-3 text-sm font-medium text-ink-950 shadow-[0_8px_30px_-12px_rgba(52,211,153,0.6)] transition-all duration-200 hover:bg-accent-300 hover:shadow-[0_10px_36px_-12px_rgba(52,211,153,0.75)]"
            >
              View projects
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
            >
              <Mail className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              Contact me
            </Link>
          </div>
        </div>

        {hasSocialLinks ? (
          <div className="mt-14 flex animate-fade-up animation-delay-200 flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Find me
              </span>
              <span aria-hidden="true" className="h-px w-8 bg-white/10" />
            </div>
            <SocialLinks contact={contact} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

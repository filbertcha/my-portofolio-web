import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "../ui/Reveal.jsx";
import { SocialLinks } from "../common/SocialLinks.jsx";

export function ContactSection({ contact, profile }) {
  const email = contact?.email;

  return (
    <section
      id="contact"
      className="border-t border-white/[0.05] py-20 sm:py-28"
    >
      <div className="shell">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.01] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-56 w-[28rem] -translate-x-1/2 rounded-full bg-accent-400/[0.08] blur-[80px]" />
            <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
          </div>

          <div className="relative mx-auto max-w-xl">
            <p className="eyebrow">05 — Contact</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Let&apos;s build something together.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-base">
              I am always open to a good conversation about software,
              collaboration, or new opportunities. The fastest way to reach me
              is by email.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent-400 px-5 py-3 text-sm font-medium text-ink-950 shadow-[0_8px_30px_-12px_rgba(52,211,153,0.6)] transition-colors hover:bg-accent-300"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {email}
                  <ArrowUpRight
                    className="h-4 w-4 opacity-60"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-500">
                  Contact details are being updated
                </span>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <SocialLinks contact={contact} variant="large" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

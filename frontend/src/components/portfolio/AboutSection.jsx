import { AtSign, MapPin } from "lucide-react";
import { Reveal } from "../ui/Reveal.jsx";
import { SectionHeading } from "../common/SectionHeading.jsx";
import { TechBadge } from "../ui/Badge.jsx";

export function AboutSection({ profile, contact, projects }) {
  const paragraphs = (profile?.about || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const technologies = [
    ...new Map(
      projects
        .flatMap((project) => project.technologies ?? [])
        .map((technology) => [technology.name.toLowerCase(), technology.name]),
    ).values(),
  ].slice(0, 10);

  const facts = [
    profile?.location || contact?.location
      ? {
          icon: MapPin,
          label: "Location",
          value: profile?.location || contact?.location,
        }
      : null,
    contact?.email
      ? {
          icon: AtSign,
          label: "Email",
          value: contact.email,
          href: `mailto:${contact.email}`,
        }
      : null,
  ].filter(Boolean);

  return (
    <section id="about" className="border-t border-white/[0.05] py-20 sm:py-28">
      <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            eyebrow="01 — About"
            title="A developer who enjoys the whole stack."
          />
        </Reveal>

        <Reveal delay={100} className="max-w-2xl">
          {paragraphs.length > 0 ? (
            <div className="space-y-4 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-zinc-500">
              A short introduction will appear here once it is added in the
              admin dashboard.
            </p>
          )}

          {facts.length > 0 ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-400"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="block truncate text-sm text-zinc-300 transition-colors hover:text-accent-300"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="truncate text-sm text-zinc-300">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {technologies.length > 0 ? (
            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Technologies I work with
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {technologies.map((technology) => (
                  <TechBadge key={technology}>{technology}</TechBadge>
                ))}
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

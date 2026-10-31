import { BriefcaseBusiness, MapPin } from 'lucide-react';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { TechBadge } from '../ui/Badge.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { formatDateRange } from '../../utils/format.js';

export function ExperienceSection({ experiences }) {
  return (
    <section id="experience" className="border-t border-white/[0.05] py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="03 — Experience"
            title="Where I have worked."
            description="Roles and projects that shaped how I build software and work with people."
          />
        </Reveal>

        {experiences.length > 0 ? (
          <div className="relative mt-10 max-w-3xl">
            {experiences.map((experience, index) => (
              <Reveal
                key={experience.id}
                delay={index * 60}
                className="relative border-l border-white/[0.08] pb-10 pl-8 last:pb-0 sm:pl-10"
              >
                <span
                  className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-accent-400 ring-4 ring-accent-400/10"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-100">
                      {experience.position}
                    </h3>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {experience.company}
                      {experience.employment_type ? (
                        <span className="text-zinc-600"> · {experience.employment_type}</span>
                      ) : null}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tracking-wide text-zinc-500 sm:pt-1">
                    {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                  </span>
                </div>

                {experience.location ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-600">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {experience.location}
                  </p>
                ) : null}

                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {experience.description}
                </p>

                {(experience.technologies ?? []).length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {experience.technologies.map((technology) => (
                      <TechBadge key={technology}>{technology}</TechBadge>
                    ))}
                  </div>
                ) : null}
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10 max-w-3xl"
            icon={BriefcaseBusiness}
            title="No experience added yet"
            description="Professional experience will appear here once it is published."
          />
        )}
      </div>
    </section>
  );
}

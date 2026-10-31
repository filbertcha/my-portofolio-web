import { GraduationCap } from 'lucide-react';
import { Reveal } from '../ui/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { formatDateRange } from '../../utils/format.js';

export function EducationSection({ education }) {
  return (
    <section id="education" className="border-t border-white/[0.05] py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="04 — Education"
            title="Where I learned the fundamentals."
            description="Formal education and focused programs that built my technical foundation."
          />
        </Reveal>

        {education.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {education.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <article className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/[0.13] hover:bg-white/[0.03]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/[0.07]">
                      <GraduationCap className="h-5 w-5 text-accent-300" aria-hidden="true" />
                    </div>
                    <span className="shrink-0 pt-1 font-mono text-[10px] tracking-wide text-zinc-500">
                      {formatDateRange(item.start_date, item.end_date, item.is_current)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-zinc-100">{item.institution}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {[item.degree, item.major].filter(Boolean).join(' · ')}
                  </p>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">{item.description}</p>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            icon={GraduationCap}
            title="No education added yet"
            description="Education records will appear here once they are published."
          />
        )}
      </div>
    </section>
  );
}

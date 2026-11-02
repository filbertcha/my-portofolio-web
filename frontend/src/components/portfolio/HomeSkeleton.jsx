import { Skeleton } from '../ui/Skeleton.jsx';

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading portfolio content">
      {/* Hero — centered single column, matching HeroSection */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="shell relative flex flex-col items-center pb-24 pt-12 text-center sm:pb-28 lg:pb-32 lg:pt-16">
          <Skeleton className="h-11 w-[80%] max-w-[34rem] sm:h-16 lg:h-20 xl:h-24" />
          <Skeleton className="mt-6 h-6 w-56 sm:h-7 sm:w-64" />
          <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2 h-4 w-4/5 max-w-xl" />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>

          <div className="mt-14 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-white/[0.06]" />
              <Skeleton className="h-2.5 w-16" />
              <span aria-hidden="true" className="h-px w-8 bg-white/[0.06]" />
            </div>
            <Skeleton className="h-9 w-40 rounded-xl" />
          </div>
        </div>
      </section>

      {/* About — heading left, copy + facts + badges right */}
      <section className="border-t border-white/[0.05] py-20 sm:py-28">
        <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-4/5" />
            <Skeleton className="mt-2 h-8 w-3/5" />
          </div>
          <div className="max-w-2xl">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-[4.5rem] rounded-xl" />
              <Skeleton className="h-[4.5rem] rounded-xl" />
            </div>

            <div className="mt-8">
              <Skeleton className="h-2.5 w-40" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects — heading row + 3 cards */}
      <section className="border-t border-white/[0.05] py-20 sm:py-28">
        <div className="shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-3 h-8 w-64" />
              <Skeleton className="mt-3 h-4 w-full max-w-lg" />
            </div>
            <Skeleton className="h-4 w-32 shrink-0" />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"
              >
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="mt-2 h-4 w-full" />
                  <Skeleton className="mt-1.5 h-4 w-4/5" />
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <div className="mt-5 flex items-center gap-4 border-t border-white/[0.05] pt-4">
                    <Skeleton className="h-3.5 w-14" />
                    <Skeleton className="h-3.5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience — timeline items */}
      <section className="border-t border-white/[0.05] py-20 sm:py-28">
        <div className="shell">
          <div className="max-w-2xl">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-8 w-64" />
            <Skeleton className="mt-3 h-4 w-full max-w-lg" />
          </div>

          <div className="relative mt-10 max-w-3xl">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="relative border-l border-white/[0.08] pb-10 pl-8 last:pb-0 sm:pl-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full bg-white/[0.08]"
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="w-full">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="mt-1.5 h-4 w-36" />
                  </div>
                  <Skeleton className="h-3 w-24 shrink-0" />
                </div>
                <Skeleton className="mt-3 h-4 w-full max-w-xl" />
                <Skeleton className="mt-1.5 h-4 w-4/5 max-w-lg" />
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education — 2 cards */}
      <section className="border-t border-white/[0.05] py-20 sm:py-28">
        <div className="shell">
          <div className="max-w-2xl">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-72" />
            <Skeleton className="mt-3 h-4 w-full max-w-lg" />
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="mt-1 h-3 w-20" />
                </div>
                <Skeleton className="mt-5 h-5 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact — bordered gradient card */}
      <section className="border-t border-white/[0.05] py-20 sm:py-28">
        <div className="shell">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.045] to-white/[0.01] px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="mx-auto flex max-w-xl flex-col items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-4 h-9 w-full max-w-md" />
              <Skeleton className="mt-4 h-4 w-full max-w-md" />
              <Skeleton className="mt-2 h-4 w-4/5 max-w-sm" />
              <Skeleton className="mt-8 h-11 w-52 rounded-xl" />
              <Skeleton className="mt-8 h-9 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Skeleton } from '../ui/Skeleton.jsx';

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading portfolio content">
      <section className="shell grid items-center gap-14 pb-20 pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28">
        <div className="space-y-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-5/6 max-w-lg" />
          <div className="flex gap-3 pt-3">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-32 rounded-xl" />
          </div>
        </div>
        <Skeleton className="mx-auto aspect-[4/5] w-full max-w-[21rem] rounded-[1.75rem]" />
      </section>

      <div className="border-t border-white/[0.05] py-20">
        <div className="shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Skeleton className="h-10 w-2/3" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-20">
        <div className="shell">
          <Skeleton className="h-10 w-64" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-white/[0.06]">
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

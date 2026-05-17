'use client';

export default function ScriptSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title card skeleton */}
      <div className="rounded-2xl border border-white/7 bg-[#111115] p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-4 w-2/3 mt-2" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-8 w-24 rounded-lg" />
            <div className="skeleton h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Characters skeleton */}
      <div>
        <div className="skeleton h-3 w-24 mb-4 rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-white/7 bg-[#111115] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="skeleton w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-3/4" />
                  <div className="skeleton h-2.5 w-1/2" />
                </div>
              </div>
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Scenes skeleton */}
      <div>
        <div className="skeleton h-3 w-16 mb-4 rounded-full" />
        <div className="space-y-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-white/7 bg-[#111115] p-4 flex items-center gap-4">
              <div className="skeleton w-7 h-7 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-24 rounded-full" />
                <div className="skeleton h-3.5 w-2/3" />
                <div className="skeleton h-2.5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

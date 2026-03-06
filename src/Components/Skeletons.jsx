import React from "react";

export const BannerSkeleton = () => (
  <div className="h-52 rounded-2xl bg-slate-100 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer" />
  </div>
);

export const ServiceGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-4 gap-3">
    {Array(count)
      .fill(0)
      .map((_, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-3 w-12 rounded bg-slate-200 animate-pulse" />
        </div>
      ))}
  </div>
);

export const WalletCardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 rounded-2xl bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-6 w-28 bg-slate-200 rounded" />
      </div>
    </div>
  </div>
);

export const TransactionCardSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array(count)
      .fill(0)
      .map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-100 p-4 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </div>
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
  </div>
);

export const PlanCardSkeleton = ({ count = 4 }) => (
  <div className="space-y-3">
    {Array(count)
      .fill(0)
      .map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-100 p-4 animate-pulse"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-5 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
  </div>
);

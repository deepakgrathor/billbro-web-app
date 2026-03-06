import React from "react";

const PageFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-200 animate-pulse" />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-slate-300 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PageFallback;

import React from "react";

const PageFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-theme-base">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-theme-card-2 animate-pulse" />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-theme-card-2 animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default PageFallback;

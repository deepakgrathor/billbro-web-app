import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorFallback = ({ error, onReset, level = "page" }) => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  if (level === "section") {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 text-center">
        <p className="text-sm text-red-600 font-medium">
          Something went wrong
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="mt-2 text-xs font-semibold text-red-500 underline"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="text-5xl mb-4">⚠️</div>
      <h1 className="text-xl font-bold text-slate-900">
        {level === "app" ? "App Error" : "Something went wrong"}
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-xs">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl"
          >
            Try Again
          </button>
        )}
        {navigate && (
          <button
            onClick={() => {
              if (onReset) onReset();
              navigate("/");
            }}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;

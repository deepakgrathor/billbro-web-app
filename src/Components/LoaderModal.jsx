import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://ik.imagekit.io/43tomntsa/BillBro_Logo.svg";

// ✅ 3 variants: "mobile" | "dth" | "bbps"
const getCopyByVariant = (variant) => {
  switch (variant) {
    case "mobile":
      return {
        title: "Mobile Recharge Processing",
        subtitle: "Operator ko request bhej rahe hain. Please wait…",
        steps: [
          {
            icon: "✅",
            label: "Payment Received",
            sub: "Payment confirm ho gaya.",
          },
          {
            icon: "⚡",
            label: "Recharge Request Sent",
            sub: "Operator ko recharge request bhej di.",
          },
          {
            icon: "📡",
            label: "Operator Confirmation",
            sub: "Operator response ka wait…",
          },
          {
            icon: "🧾",
            label: "Recharge Status Update",
            sub: "Final status update ho raha hai.",
          },
        ],
        tips: [
          "Mobile recharge aksar 10–30 seconds me ho jata hai.",
          "Operator busy ho to status Pending aa sakta hai.",
          "Internet stable rakho for faster confirmation.",
          "History me status automatically update hota rahega.",
        ],
        badge: "MOBILE",
      };

    case "dth":
      return {
        title: "DTH Recharge Processing",
        subtitle: "Subscriber ID verify karke recharge kar rahe hain…",
        steps: [
          {
            icon: "✅",
            label: "Payment Received",
            sub: "Payment received successfully.",
          },
          {
            icon: "🛰️",
            label: "DTH Request Sent",
            sub: "DTH operator ko request bhej di.",
          },
          {
            icon: "📡",
            label: "Operator Confirmation",
            sub: "Confirmation ka wait…",
          },
          {
            icon: "🎉",
            label: "Recharge Done",
            sub: "Recharge complete hone wala hai.",
          },
        ],
        tips: [
          "DTH recharge me 15–40 seconds lag sakte hain.",
          "Agar delay ho, TV/Set-top box ko refresh karke check karein.",
          "Pending case me auto-update ho jayega.",
          "Kuch operators me late-night processing slow hoti hai.",
        ],
        badge: "DTH",
      };

    case "bbps":
    default:
      return {
        title: "Bill Payment Processing",
        subtitle: "BBPS ke through secure bill payment ho raha hai…",
        steps: [
          {
            icon: "✅",
            label: "Payment Received",
            sub: "Payment received successfully.",
          },
          {
            icon: "🧾",
            label: "Bill Payment Initiated",
            sub: "Biller ke system me request dali.",
          },
          {
            icon: "📡",
            label: "Biller Confirmation",
            sub: "Biller response ka wait…",
          },
          {
            icon: "🔔",
            label: "Receipt Generated",
            sub: "Payment receipt generate ho rahi hai.",
          },
        ],
        tips: [
          "BBPS bill payments me kabhi kabhi 1–2 min lag sakta hai.",
          "Biller side delay ho to status Pending dikh sakta hai.",
          "Receipt successful hone par history me mil jayegi.",
          "Back press mat kijiye, transaction safe rahega.",
        ],
        badge: "BBPS",
      };
  }
};

const LoaderModal = ({ variant = "bbps" }) => {
  const copy = useMemo(() => getCopyByVariant(variant), [variant]);

  const [active, setActive] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActive((p) => (p + 1) % copy.steps.length);
    }, 1800);

    const tipTimer = setInterval(() => {
      setTipIndex((p) => (p + 1) % copy.tips.length);
    }, 2500);

    return () => {
      clearInterval(stepTimer);
      clearInterval(tipTimer);
    };
  }, [copy.steps.length, copy.tips.length]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ y: 18, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/40 bg-white/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,6,23,0.25)] overflow-hidden"
      >
        {/* Accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-2xl bg-slate-900/5 border border-slate-200 flex items-center justify-center overflow-hidden">
              <motion.img
                src={LOGO_URL}
                alt="Logo"
                className="w-8 h-8"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900">{copy.title}</p>
              <p className="text-[11px] font-semibold text-slate-600">
                {copy.subtitle}
              </p>
            </div>

            <span className="ml-auto text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-full">
              {copy.badge}
            </span>
          </div>

          {/* Status */}
          <div className="mt-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-start gap-3"
                >
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-lg">
                    {copy.steps[active].icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900">
                      {copy.steps[active].label}
                    </p>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {copy.steps[active].sub}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500"
                  initial={{ width: "18%" }}
                  animate={{ width: "92%" }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Tips */}
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[11px] font-semibold text-slate-600"
                >
                  💡 {copy.tips[tipIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <p className="mt-3 text-[10px] font-semibold text-slate-500 text-center">
              Don’t close the app — your transaction is safe.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoaderModal;

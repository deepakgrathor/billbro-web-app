// import React from "react";
// import { motion } from "framer-motion";
// const Loader = () => {
//   return (
//     <div>
//       <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
//         <motion.img
//           src="https://ik.imagekit.io/43tomntsa/BillBro_Logo.svg" // apna logo ka path daalna
//           alt="Logo"
//           className="w-16 h-16"
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Loader;
import React from "react";
import { motion } from "framer-motion";

const DEFAULT_LOGO = "https://ik.imagekit.io/43tomntsa/BillBro_Logo.svg";

const Loader = ({
  loading = true,
  title = "Loading...",
  subtitle = "Please wait a moment",
  logo = DEFAULT_LOGO,
}) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="relative w-full max-w-[360px] rounded-3xl border border-white/40 bg-white/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(2,6,23,0.25)] overflow-hidden"
      >
        {/* Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500" />

        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 rounded-3xl bg-slate-900/5 border border-slate-200 flex items-center justify-center">
              <motion.img
                src={logo}
                alt="logo"
                className="h-10 w-10"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="mt-4 text-center">
            <p className="text-base font-black text-slate-900">{title}</p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              {subtitle}
            </p>
          </div>

          {/* Dots */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-slate-900/60"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Bar */}
          <div className="mt-5 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500"
              initial={{ width: "20%" }}
              animate={{ width: "92%" }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="mt-4 text-[10px] font-semibold text-slate-500 text-center">
            Don’t close the app — your request is processing.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Loader;

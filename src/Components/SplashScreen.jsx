// import React from "react";
// import { motion } from "framer-motion";
// import { primaryColor } from "../Utils/Style";
// import { BRAND_NAME } from "../Utils/Constant";
// import { MdLockPerson } from "react-icons/md";
// import { IoShieldCheckmarkSharp } from "react-icons/io5";



// const SplashScreen = () => {
//   return (
//     <div>
//       <div
//         style={{ backgroundColor: primaryColor }}
//         className="fixed inset-0 space-y-3 flex flex-col items-center justify-center text-white"
//       >
//         {/* Logo spin karega */}
//         <motion.img
//           src="https://ik.imagekit.io/43tomntsa/BillBro_White_Logo.svg" // apna logo path daalna
//           alt="Logo"
//           className="w-18 h-18 mb-4"
//           animate={{ rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
//         />

//         {/* Brand name right se aayega */}
//         <motion.h1
//           className="text-4xl font-extrabold tracking-widest"
//           initial={{ x: 200, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           {BRAND_NAME}
//         </motion.h1>
//         <div className="absolute bottom-10 flex justify-evenly w-full">
//           <div className="flex items-center space-x-2">
//             <MdLockPerson size={25} />
//             <div className="">
//               <p className="text-[14px] font-black">100%</p>
//               <p className="text-[8px] text-red-300">Secured</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <IoShieldCheckmarkSharp size={25} />
//             <div className="">
//               <p className="text-[14px] font-black">10k+ Users</p>
//               <p className="text-[8px] text-red-300">Trusted</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SplashScreen;
import React from "react";
import { motion } from "framer-motion";
import { primaryColor } from "../Utils/Style";
import { BRAND_NAME } from "../Utils/Constant";
import { MdLockPerson } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Background */}
      <div
        style={{ backgroundColor: primaryColor }}
        className="absolute inset-0"
      />

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-white/5 to-black/20" />

      {/* Blobs */}
      <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-300/10 blur-3xl" />

      {/* Content */}
      <div className="relative h-full w-full flex flex-col items-center justify-center text-white px-6">
        {/* Logo container (glass) */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 14 }}
          className="rounded-[28px] bg-white/10 border border-white/20 shadow-[0_18px_60px_rgba(0,0,0,0.25)] px-8 py-7 backdrop-blur-xl"
        >
          <div className="flex items-center justify-center">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-3xl bg-white/15 blur-xl" />
              <motion.img
                src="https://ik.imagekit.io/43tomntsa/BillBro_White_Logo.svg"
                alt="Logo"
                className="relative w-16 h-16 sm:w-20 sm:h-20"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Brand */}
          <motion.h1
            className="mt-5 text-3xl sm:text-4xl font-black tracking-widest text-center"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            {BRAND_NAME}
          </motion.h1>

          <motion.p
            className="mt-2 text-[11px] sm:text-xs font-semibold text-white/80 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Fast • Secure • Instant Recharge & Bill Payments
          </motion.p>

          {/* Loading dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-white/80"
                animate={{ opacity: [0.25, 1, 0.25], scale: [0.9, 1.25, 0.9] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom trust badges */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="absolute bottom-8 left-0 right-0 px-5"
        >
          <div className="mx-auto max-w-md grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-3 flex items-center gap-3 shadow-lg">
              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <MdLockPerson size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black leading-tight">100% Secure</p>
                <p className="text-[10px] font-semibold text-white/75">
                  Encrypted payments
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-3 flex items-center gap-3 shadow-lg">
              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <IoShieldCheckmarkSharp size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black leading-tight">Trusted</p>
                <p className="text-[10px] font-semibold text-white/75">
                  10k+ happy users
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;

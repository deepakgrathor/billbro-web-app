// import React from "react";
// import { primaryColor } from "../Utils/Style";

// const ButtonComp = ({ title, handleClick, disabled }) => {
//   return (
//     <div>
//       <button
//         disabled={disabled}
//         onClick={handleClick}
//         style={{ backgroundColor: disabled ? "gray" : primaryColor }}
//         className="w-full max-w-sm mx-auto font-bold tracking-wider text-sm text-white p-4 rounded-full"
//       >
//         {title}
//       </button>
//     </div>
//   );
// };

// export default ButtonComp;
import React from "react";
import { motion } from "framer-motion";
import { primaryColor } from "../Utils/Style";

const ButtonComp = ({ title, handleClick, disabled }) => {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      className={`
        relative w-full max-w-sm mx-auto overflow-hidden
        rounded-2xl px-5 py-4
        text-sm font-black tracking-wider text-white
        transition-all duration-300
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
        }
      `}
      style={{
        background: disabled
          ? undefined
          : `linear-gradient(135deg, ${primaryColor}, #6d28d9)`,
      }}
    >
      {/* Shine overlay */}
      {!disabled && (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Text */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {title}
      </span>
    </motion.button>
  );
};

export default ButtonComp;

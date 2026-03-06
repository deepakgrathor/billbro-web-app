import React from "react";
import { motion } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useThemeContext } from "../Navigation/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
        isDark ? "bg-violet-600" : "bg-slate-200"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-amber-400 text-[10px] pointer-events-none">
        {!isDark && "☀"}
      </span>
      <span className="absolute right-1.5 text-slate-400 text-[10px] pointer-events-none">
        {isDark && "☽"}
      </span>

      {/* Sliding thumb */}
      <motion.div
        className="absolute w-[22px] h-[22px] rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 29 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <MdDarkMode className="text-violet-600" style={{ fontSize: 13 }} />
        ) : (
          <MdLightMode className="text-amber-500" style={{ fontSize: 13 }} />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;

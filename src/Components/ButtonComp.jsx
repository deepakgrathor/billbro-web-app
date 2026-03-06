import React from "react";
import { motion } from "framer-motion";
import { primaryColor } from "../Utils/Style";

const ButtonComp = React.memo(({
  title,
  handleClick,
  disabled,
  variant = "primary",
  size = "default",
  icon,
  className = "",
}) => {
  const sizeClasses = {
    small: "px-3 py-2.5 text-xs",
    default: "px-5 py-4 text-sm",
    large: "px-6 py-5 text-base",
  };

  const getVariantStyles = () => {
    if (disabled) {
      return {
        className: "bg-gray-300 text-gray-500 cursor-not-allowed",
        style: {},
      };
    }

    switch (variant) {
      case "secondary":
        return {
          className: "bg-slate-900 text-white shadow-lg",
          style: {},
        };
      case "outline":
        return {
          className: "border-2 border-slate-900 text-slate-900 bg-transparent",
          style: {},
        };
      case "ghost":
        return {
          className: "bg-transparent text-slate-900",
          style: {},
        };
      case "primary":
      default:
        return {
          className: "shadow-[0_12px_40px_rgba(0,0,0,0.25)] text-white",
          style: {
            background: `linear-gradient(135deg, ${primaryColor}, #6d28d9)`,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      className={`
        relative w-full max-w-sm mx-auto overflow-hidden
        rounded-2xl font-black tracking-wider
        transition-all duration-300
        ${sizeClasses[size]}
        ${variantStyles.className}
        ${className}
      `}
      style={variantStyles.style}
    >
      {/* Shine overlay */}
      {!disabled && variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Text */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && icon}
        {title}
      </span>
    </motion.button>
  );
});

ButtonComp.displayName = "ButtonComp";

export default ButtonComp;

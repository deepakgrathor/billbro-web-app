import React, { memo, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BOTTOM_MENU_DATA } from "../Utils/MockData";

const BottomNavigation = memo(function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = useMemo(() => BOTTOM_MENU_DATA?.slice(0, 5) ?? [], []);

  const isActive = (route) => {
    return location.pathname === route || location.pathname.startsWith(route + "/");
  };

  return (
    <>
      {/* Spacer so content doesn't hide behind bottom bar */}
      <div className="h-[76px] sm:h-[80px]" />

      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70
          border-t border-gray-200
          px-2 sm:px-4
          pb-[env(safe-area-inset-bottom)]
        "
        aria-label="Bottom Navigation"
      >
        <div className="mx-auto max-w-md">
          <div className="grid grid-cols-4 gap-1 py-2">
            {items.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.route);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`
                    group relative flex flex-col items-center justify-center
                    rounded-2xl px-2 py-2
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
                    active:scale-[0.98] transition
                    ${active ? "bg-blue-50" : "hover:bg-gray-50"}
                  `}
                  aria-current={active ? "page" : undefined}
                >
                  {/* Animated active indicator */}
                  {active && (
                    <motion.span
                      layoutId="bottomNavIndicator"
                      className="absolute top-1 h-1 w-6 rounded-full bg-blue-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative">
                    <Icon
                      size={26}
                      className={`
                        transition-colors
                        ${active ? "text-blue-600" : "text-gray-600 group-hover:text-gray-800"}
                      `}
                    />

                    {/* Badge (optional) */}
                    {typeof item.badge !== "undefined" && item.badge !== null && item.badge !== 0 && (
                      <span
                        className="
                          absolute -top-2 -right-2
                          min-w-[18px] h-[18px] px-1
                          rounded-full bg-red-500 text-white
                          text-[10px] leading-[18px] text-center
                          shadow
                        "
                      >
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      mt-1 text-[11px] leading-none
                      ${active ? "text-blue-600 font-medium" : "text-gray-500"}
                    `}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
});

export default BottomNavigation;

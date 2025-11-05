import React, { useState, useEffect, useRef } from "react";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });

      // Auto-scroll to active tab
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollLeft =
          offsetLeft - container.offsetWidth / 2 + offsetWidth / 2;

        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab, tabs]);

  return (
    <div
      className={`sticky top-18 z-30 pb-2 mb-2 transition-shadow duration-200 `}
    >
      <div className="relative bg-gray-100 rounded-full p-1">
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex relative overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {/* Animated indicator */}
          <div
            className="absolute top-0.5 py-3.5 bg-white rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
            style={indicatorStyle}
          />

          {/* Tabs */}
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 relative z-10 whitespace-nowrap ${
                activeTab === tab.id ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;

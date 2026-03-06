import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CommonHeader = React.memo(({ title, handleclick, rightDesign, style }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Main Header */}
      <div className="flex items-center justify-between bg-theme-header backdrop-blur-xl h-16 px-4 relative z-10">
        {/* Left Section - Back Button & Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back Button */}
          <button
            onClick={handleclick}
            className="flex-shrink-0 w-10 h-10 bg-theme-card-2 hover:from-purple-100 hover:to-blue-100 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm hover:shadow-md group"
            aria-label="Go back"
          >
            <MdOutlineArrowBack
              size={22}
              className="text-theme-secondary group-hover:text-purple-600 transition-colors"
            />
          </button>

          {/* Title */}
          <h1
            style={style}
            className="font-bold text-base text-theme-primary tracking-tight truncate"
          >
            {title}
          </h1>
        </div>

        {/* Right Section - Custom Content */}
        {rightDesign && (
          <div className="flex-shrink-0 ml-2">{rightDesign()}</div>
        )}
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px border-theme" style={{ backgroundColor: "var(--border-color)" }}></div>
    </div>
  );
});

CommonHeader.displayName = "CommonHeader";

export default CommonHeader;

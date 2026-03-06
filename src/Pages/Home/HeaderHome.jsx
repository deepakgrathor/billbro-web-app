// import { DummyAvatarForPassbook } from "../../Utils/MockData";
// import { RiDiscountPercentLine } from "react-icons/ri";
// import { MdNotificationsNone, MdAccountBalanceWallet } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { BRAND_NAME } from "../../Utils/Constant";

// const HeaderHome = ({ ProfileData }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
//       {/* Top Section - Welcome & Actions */}
//       <div className="px-4 pt-4 pb-3 flex justify-between items-center">
//         {/* Left - User Info */}
//         <div className="flex items-center space-x-3">
//           {/* Avatar */}
//           <div className="relative">
//             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg">
//               <img
//                 src={DummyAvatarForPassbook}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             </div>
//             {/* Online indicator */}
//             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
//           </div>

//           {/* Welcome Text */}
//           <div>
//             <p className="text-white/80 text-[10px] font-medium tracking-wide">
//               Welcome Back! 👋
//             </p>
//             <p className="text-white font-bold text-base tracking-wide">
//               {ProfileData?.Data?.firstName || "User"}
//             </p>
//           </div>
//         </div>

//         {/* Right - Action Buttons */}
//         <div className="flex items-center space-x-2">
//           {/* Offers Button */}
//           <button
//             onClick={() => navigate("/commission")}
//             className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2.5 rounded-xl transition-all duration-300 border border-white/30 shadow-lg active:scale-95"
//           >
//             <RiDiscountPercentLine size={22} className="text-white" />
//             {/* Badge */}
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"></span>
//           </button>

//           {/* Notification Button */}
//           <button
//             onClick={() => navigate("/notification")}
//             className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2.5 rounded-xl transition-all duration-300 border border-white/30 shadow-lg active:scale-95"
//           >
//             <MdNotificationsNone size={22} className="text-white" />
//             {/* Badge */}
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse"></span>
//           </button>
//         </div>
//       </div>

//       {/* Bottom Section - Wallet Card */}
//     </div>
//   );
// };

// export default HeaderHome;

import React from "react";
import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../../Utils/Constant";

const HeaderHome = ({ ProfileData }) => {
  const navigate = useNavigate();

  const firstName = ProfileData?.Data?.firstName || "User";

  return (
    <div className="sticky top-0 z-50">
      {/* Glass background */}
      <div className="bg-theme-header backdrop-blur-xl border-b border-theme">
        <div className="mx-auto w-full max-w-[520px] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Avatar + Welcome */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/profile")}
                className="relative shrink-0 active:scale-[0.98] transition"
                aria-label="Open Profile"
              >
                <div className="h-12 w-12 rounded-2xl border border-theme bg-gradient-to-br from-slate-50 to-white shadow-sm flex items-center justify-center overflow-hidden">
                  <img
                    src={DummyAvatarForPassbook}
                    alt="Profile"
                    className="h-12 w-12 object-cover"
                  />
                </div>
                {/* online dot */}
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-theme-secondary">
                  Welcome back
                </p>
                <p className="truncate text-base font-black tracking-tight text-theme-primary">
                  Hi, {firstName} 👋
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate("/commission")}
                className="relative h-11 w-11 rounded-2xl border border-theme bg-theme-card shadow-sm hover:bg-theme-card-2 active:scale-[0.98] transition flex items-center justify-center"
                aria-label="Offers"
              >
                <RiDiscountPercentLine size={22} className="text-theme-primary" />
                {/* badge */}
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {/* put count here if you have */}
                </span>
              </button>

              <button
                onClick={() => navigate("/notification")}
                className="relative h-11 w-11 rounded-2xl border border-theme bg-theme-card shadow-sm hover:bg-theme-card-2 active:scale-[0.98] transition flex items-center justify-center"
                aria-label="Notifications"
              >
                <MdNotificationsNone size={24} className="text-theme-primary" />
                {/* badge pulse */}
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* subtle fade into content */}
      {/* <div className="h-3 bg-gradient-to-b from-white to-transparent" /> */}
    </div>
  );
};

export default HeaderHome;

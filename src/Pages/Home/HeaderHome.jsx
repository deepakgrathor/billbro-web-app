// import { DummyAvatarForPassbook } from "../../Utils/MockData";
// import { RiDiscountPercentLine } from "react-icons/ri";
// import { MdNotificationsNone } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// const HeaderHome = ({ ProfileData }) => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <div className="bg-white/90  shadow h-16 p-2 flex justify-between items-center">
//         <div className="">
//           <p className="text-[10px] tracking-wider">Welcome Back!</p>
//           <p className="font-semibold text-sm tracking-wider">
//             {ProfileData?.Data?.firstName}
//           </p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div
//             onClick={() => navigate("/commission")}
//             className="bg-gray-200 p-2 rounded-lg"
//           >
//             <RiDiscountPercentLine size={20} color="red"/>
//           </div>
//           <div
//             onClick={() => navigate("/notification")}
//             className="bg-gray-200 p-2 rounded-lg"
//           >
//             <MdNotificationsNone size={20} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HeaderHome;

import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdNotificationsNone, MdAccountBalanceWallet } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../../Utils/Constant";

const HeaderHome = ({ ProfileData }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
      {/* Top Section - Welcome & Actions */}
      <div className="px-4 pt-4 pb-3 flex justify-between items-center">
        {/* Left - User Info */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg">
              <img
                src={DummyAvatarForPassbook}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>

          {/* Welcome Text */}
          <div>
            <p className="text-white/80 text-[10px] font-medium tracking-wide">
              Welcome Back! 👋
            </p>
            <p className="text-white font-bold text-base tracking-wide">
              {ProfileData?.Data?.firstName || "User"}
            </p>
          </div>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Offers Button */}
          <button
            onClick={() => navigate("/commission")}
            className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2.5 rounded-xl transition-all duration-300 border border-white/30 shadow-lg active:scale-95"
          >
            <RiDiscountPercentLine size={22} className="text-white" />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center"></span>
          </button>

          {/* Notification Button */}
          <button
            onClick={() => navigate("/notification")}
            className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2.5 rounded-xl transition-all duration-300 border border-white/30 shadow-lg active:scale-95"
          >
            <MdNotificationsNone size={22} className="text-white" />
            {/* Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Bottom Section - Wallet Card */}
    </div>
  );
};

export default HeaderHome;

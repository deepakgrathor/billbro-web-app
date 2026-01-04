import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME, COMPANY_LOGO } from "../../Utils/Constant";
import { ProfileArr, SocialArr } from "../../Utils/MockData";
import Loader from "../../Components/Loader";
import { TbLogout } from "react-icons/tb";
import { AuthContext } from "../../Navigation/AuthContext";
import { IoChevronForward, IoShieldCheckmark } from "react-icons/io5";
import { MdVerified, MdStar } from "react-icons/md";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );

  // ✅ FIX: Memoized user data
  const userData = {
    firstName: ProfileData?.Data?.firstName || "User",
    lastName: ProfileData?.Data?.lastName || "",
    phone: ProfileData?.Data?.phone || "XXXXXXXXXX",
    email: ProfileData?.Data?.email || null,
    verified: ProfileData?.Data?.isVerified || false,
  };

  // ✅ OPTIMIZATION: Reduced animation complexity
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Reduced from 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 }, // Reduced from y: 20
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120, // Increased from 100 for snappier feel
        damping: 15,
      },
    },
  };

  // ✅ FIX: Prevent navigation when already navigating
  const handleNavigation = (route, handleclick) => {
    if (handleclick) {
      handleclick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-md border-b border-white/20">
        <CommonHeader title={"My Profile"} handleclick={() => navigate(-1)} />
      </div>

      {/* Main Content */}
      <motion.div
        className="pt-20 pb-8 px-4 max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Profile Header Card */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl overflow-hidden shadow-2xl">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

            <div className="relative p-6">
              <div className="flex items-center gap-4">
                {/* Avatar with Glow Effect */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-white rounded-full p-1.5 shadow-2xl">
                    <img
                      src={COMPANY_LOGO}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                    {userData.verified && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <MdVerified className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {userData.firstName} {userData.lastName}
                    </h2>
                    {userData.verified && (
                      <IoShieldCheckmark className="text-green-400 text-lg" />
                    )}
                  </div>
                  <p className="text-white/90 text-sm font-semibold mb-1">
                    +91 {userData.phone}
                  </p>
                  {/* {userData.email && (
                    <p className="text-white/70 text-xs">
                      {userData.email}
                    </p>
                  )} */}
                </div>
              </div>

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                  <p className="text-2xl font-black text-white mb-1">0</p>
                  <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Recharges</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                  <p className="text-2xl font-black text-white mb-1">₹0</p>
                  <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Spent</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MdStar className="text-yellow-400 text-lg" />
                    <p className="text-2xl font-black text-white">0</p>
                  </div>
                  <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Points</p>
                </div>
              </div> */}
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div className="space-y-2 mb-6" variants={containerVariants}>
          {ProfileArr.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                onClick={() => handleNavigation(item.route, item.handleclick)}
                className="flex items-center bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl flex items-center justify-center group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300 shadow-sm">
                  {item.image ? (
                    <img width={24} src={item.image} alt={item.title} className="group-hover:scale-110 transition-transform" />
                  ) : (
                    <item.icon className="text-2xl text-violet-600 group-hover:text-white transition-colors duration-300" />
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 ml-4">
                  <p className="font-bold text-gray-800 text-sm tracking-wide group-hover:text-gray-900">
                    {item.title}
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-violet-100 flex items-center justify-center transition-all duration-300">
                  <IoChevronForward className="text-gray-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              onClick={() => logout()}
              className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-red-200 group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300 shadow-sm">
                <TbLogout className="text-2xl text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <div className="flex-1 ml-4">
                <p className="font-bold text-red-600 text-sm tracking-wide group-hover:text-red-700">
                  Logout
                </p>
                <p className="text-red-400 text-xs mt-0.5">Sign out of your account</p>
              </div>

              {/* Arrow Icon */}
              <div className="w-8 h-8 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-all duration-300">
                <IoChevronForward className="text-red-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100">
            <p className="text-center text-sm font-bold text-gray-700 mb-5">
              Connect with us 🌐
            </p>
            <div className="flex justify-center gap-4">
              {SocialArr.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl text-gray-600 group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200"
          variants={itemVariants}
        >
          {/* Brand Logo */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative w-16 h-16 p-3 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center shadow-xl">
                <img src={COMPANY_LOGO} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.div>

          {/* Brand Name */}
          <h3 className="text-center text-3xl font-black text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text tracking-tight mb-3">
            {BRAND_NAME}
          </h3>

          {/* Tagline */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <p className="text-center text-gray-600 text-xs font-bold tracking-wider uppercase">
              Made with ❤️ in India
            </p>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
          </div>

          {/* Version */}
          <p className="text-center text-gray-400 text-xs mt-4 font-medium">
            Version 1.0.0
          </p>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <IoShieldCheckmark className="text-green-600 text-lg" />
              </div>
              <p className="text-[9px] text-gray-600 font-semibold">Secure</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <MdVerified className="text-blue-600 text-lg" />
              </div>
              <p className="text-[9px] text-gray-600 font-semibold">Verified</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                <MdStar className="text-purple-600 text-lg" />
              </div>
              <p className="text-[9px] text-gray-600 font-semibold">Trusted</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Loader */}
      {profileLoader && <Loader />}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ProfilePage;
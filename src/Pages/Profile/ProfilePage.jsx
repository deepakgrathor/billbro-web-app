import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME, COMPANY_LOGO } from "../../Utils/Constant";
import { getFilteredProfileArr, SocialArr } from "../../Utils/MockData";
import Loader from "../../Components/Loader";
import { TbLogout } from "react-icons/tb";
import { AuthContext } from "../../Navigation/AuthContext";
import { useThemeContext } from "../../Navigation/ThemeContext";
import { IoChevronForward, IoShieldCheckmark } from "react-icons/io5";
import { MdVerified, MdStar, MdPalette } from "react-icons/md";
import ThemeToggle from "../../Components/ThemeToggle";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { theme } = useThemeContext();
  const { serviceList } = useSelector((state) => state.ServiceSlice.service);
  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );

  const userData = {
    firstName: ProfileData?.Data?.firstName || "User",
    lastName: ProfileData?.Data?.lastName || "",
    phone: ProfileData?.Data?.phone || "XXXXXXXXXX",
    email: ProfileData?.Data?.email || null,
    verified: ProfileData?.Data?.isVerified || false,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
  };

  const handleNavigation = (route, handleclick) => {
    if (handleclick) {
      handleclick();
    } else if (route) {
      navigate(route);
    }
  };

  const ProfileArr = useMemo(
    () => getFilteredProfileArr(serviceList),
    [serviceList]
  );

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-theme-base relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ backgroundColor: isDark ? "rgba(109,40,217,0.12)" : "rgba(196,181,253,0.3)" }}
        />
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
          style={{ backgroundColor: isDark ? "rgba(168,85,247,0.10)" : "rgba(240,171,252,0.3)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
          style={{ backgroundColor: isDark ? "rgba(236,72,153,0.08)" : "rgba(249,168,212,0.3)" }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-theme-header backdrop-blur-xl shadow-sm border-b border-theme">
        <CommonHeader title={"My Profile"} handleclick={() => navigate(-1)} />
      </div>

      {/* Main Content */}
      <motion.div
        className="pt-20 pb-8 px-4 max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* ── Profile Header Card ── */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl overflow-hidden shadow-2xl">
            {/* Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

            <div className="relative p-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full blur-lg opacity-75 animate-pulse" />
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
                  <p className="text-white/90 text-sm font-semibold">
                    +91 {userData.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Menu Items ── */}
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
                className="flex items-center bg-theme-card backdrop-blur-sm rounded-2xl p-4 shadow-theme-card cursor-pointer border border-theme group"
                style={{ transition: "box-shadow 0.3s ease" }}
              >
                {/* Icon Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl flex items-center justify-center group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300 shadow-sm">
                  {item.image ? (
                    <img
                      width={24}
                      src={item.image}
                      alt={item.title}
                      className="group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <item.icon className="text-2xl text-violet-600 group-hover:text-white transition-colors duration-300" />
                  )}
                </div>
                <div className="flex-1 ml-4">
                  <p className="font-bold text-theme-primary text-sm tracking-wide">
                    {item.title}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-theme-card-2 group-hover:bg-violet-100 flex items-center justify-center transition-all duration-300">
                  <IoChevronForward className="text-theme-secondary group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Appearance / Theme Toggle ── */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center bg-theme-card backdrop-blur-sm rounded-2xl p-4 shadow-theme-card border border-theme">
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl flex items-center justify-center shadow-sm">
                <MdPalette className="text-2xl text-violet-600" />
              </div>
              {/* Label */}
              <div className="flex-1 ml-4">
                <p className="font-bold text-theme-primary text-sm tracking-wide">
                  Appearance
                </p>
                <p className="text-theme-muted text-xs mt-0.5">
                  {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </p>
              </div>
              {/* Toggle */}
              <ThemeToggle />
            </div>
          </motion.div>

          {/* ── Logout ── */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              onClick={() => logout()}
              className="flex items-center rounded-2xl p-4 cursor-pointer border border-red-200 group"
              style={{ background: isDark ? "rgba(239,68,68,0.08)" : "linear-gradient(to right,#fef2f2,#fdf2f8)" }}
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300 shadow-sm">
                <TbLogout className="text-2xl text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="flex-1 ml-4">
                <p className="font-bold text-red-500 text-sm tracking-wide">
                  Logout
                </p>
                <p className="text-red-400 text-xs mt-0.5">
                  Sign out of your account
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center transition-all duration-300">
                <IoChevronForward className="text-red-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Social Media ── */}
        {serviceList?.Data?.find((a) => a.name === "SOCIAL_SHOW")?.isShow && (
          <motion.div className="mb-6" variants={itemVariants}>
            <div className="bg-theme-card backdrop-blur-sm rounded-3xl p-6 shadow-theme-card border border-theme">
              <p className="text-center text-sm font-bold text-theme-secondary mb-5">
                Connect with us 🌐
              </p>
              <div className="flex justify-center gap-4">
                {SocialArr.map((item, index) => (
                  <motion.div
                    key={index}
                    className="w-12 h-12 bg-theme-card-2 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-2xl text-theme-secondary group-hover:text-white transition-colors duration-300">
                      {item.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Footer ── */}
        <motion.div
          className="bg-theme-card-2 rounded-3xl p-8 border border-theme"
          variants={itemVariants}
        >
          {/* Brand Logo */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-16 h-16 p-3 bg-theme-card border-2 border-theme rounded-2xl flex items-center justify-center shadow-xl">
                <img src={COMPANY_LOGO} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.div>

          <h3 className="text-center text-3xl font-black text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text tracking-tight mb-3">
            {BRAND_NAME}
          </h3>

          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-theme-secondary to-transparent" />
            <p className="text-center text-theme-secondary text-xs font-bold tracking-wider uppercase">
              Made with ❤️ in India
            </p>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-theme-secondary to-transparent" />
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <IoShieldCheckmark className="text-green-600 text-lg" />
              </div>
              <p className="text-[9px] text-theme-secondary font-semibold">Secure</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <MdVerified className="text-blue-600 text-lg" />
              </div>
              <p className="text-[9px] text-theme-secondary font-semibold">Verified</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                <MdStar className="text-purple-600 text-lg" />
              </div>
              <p className="text-[9px] text-theme-secondary font-semibold">Trusted</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {profileLoader && <Loader />}

      <style>{`
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

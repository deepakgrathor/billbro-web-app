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
import { IoChevronForward } from "react-icons/io5";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <CommonHeader title={"Profile"} handleclick={() => navigate(-1)} />
      </div>

      {/* Main Content */}
      <motion.div
        className="pt-16 pb-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Profile Card */}
        <motion.div className="mx-4 mt-6 mb-6" variants={itemVariants}>
          <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 shadow-2xl overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative flex items-center space-x-4">
              {/* Avatar with gradient border */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full blur-md opacity-75"></div>
                <div className="relative w-12 h-12 bg-white rounded-full p-1 shadow-lg">
                  <img
                    src={COMPANY_LOGO}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {ProfileData?.Data?.firstName} {ProfileData?.Data?.lastName}
                </h2>
                <p className="text-white/80 text-sm mt-1 font-medium">
                  +91 {ProfileData?.Data?.phone}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div className="px-4 space-y-3" variants={containerVariants}>
          {ProfileArr.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.handleclick) {
                    item.handleclick();
                  } else {
                    navigate(item.route);
                  }
                }}
                className="flex items-center bg-white rounded-2xl p-2 shadow hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  {item.image ? (
                    <img width={24} src={item.image} alt={item.title} />
                  ) : (
                    <item.icon className="text-2xl text-gray-600 group-hover:text-white transition-colors duration-300" />
                  )}
                </div>

                {/* Title */}
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-gray-800 tracking-wide group-hover:text-gray-900">
                    {item.title}
                  </p>
                </div>

                {/* Arrow Icon */}
                <IoChevronForward className="text-gray-400 text-xl group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              onClick={() => logout()}
              className="flex items-center bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-2 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-red-100 group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300">
                <TbLogout className="text-2xl text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <div className="flex-1 ml-4">
                <p className="font-semibold text-red-600 tracking-wide group-hover:text-red-700">
                  Logout
                </p>
              </div>

              {/* Arrow Icon */}
              <IoChevronForward className="text-red-400 text-xl group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </motion.div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div className="mt-12 px-4" variants={itemVariants}>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <p className="text-center text-sm text-gray-600 font-semibold mb-4">
              Connect with us on Social Media
            </p>
            <div className="flex justify-center space-x-3">
              {SocialArr.map((item, index) => (
                <motion.div
                  key={index}
                  className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-500 hover:to-purple-500 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
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
          className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-[3rem] pt-12 pb-8 px-6"
          variants={itemVariants}
        >
          {/* Brand Logo/Icon */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 p-2 border border-gray-200 rounded-2xl flex items-center justify-center shadow-xl">
              <img src={COMPANY_LOGO} alt="" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <h3 className="text-center text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text tracking-wider mb-2">
            {BRAND_NAME}
          </h3>

          {/* Tagline */}
          <p className="text-center text-gray-500 text-sm font-semibold tracking-wide">
            MADE WITH ❤️ IN INDIA
          </p>

          {/* Version */}
          <p className="text-center text-gray-400 text-xs mt-4">
            Version 1.0.0
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center mt-6">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Loader */}
      {profileLoader && <Loader />}
    </div>
  );
};

export default ProfilePage;

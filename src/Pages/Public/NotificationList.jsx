import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment/moment";
import { getNotification } from "../../Redux/Slices/PublicSlice/PublicSlice";
import Loader from "../../Components/Loader";
import { COMPANY_LOGO, DummyAddtoWalletAvatar } from "../../Utils/Constant";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline, IoCheckmarkCircle } from "react-icons/io5";
import { MdInbox } from "react-icons/md";

const ModernNotificationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notificationList, notificationLoader } = useSelector(
    (state) => state.PublicSlice.notification
  );

  const getNotify = useCallback(async () => {
    dispatch(getNotification());
  }, [dispatch]);

  useEffect(() => {
    getNotify();
  }, []);

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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const getNotificationIcon = (item) => {
    // You can customize icons based on notification type
    return item.sender
      ? item.sender._id === item.recipient
        ? DummyAddtoWalletAvatar
        : DummyAddtoWalletAvatar
      : COMPANY_LOGO;
  };

  const getNotificationColor = (index) => {
    const colors = [
      { from: "from-blue-500", to: "to-cyan-500", bg: "bg-blue-50" },
      { from: "from-purple-500", to: "to-pink-500", bg: "bg-purple-50" },
      { from: "from-green-500", to: "to-emerald-500", bg: "bg-green-50" },
      { from: "from-orange-500", to: "to-red-500", bg: "bg-orange-50" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <CommonHeader
          title={"Notifications"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-6 min-h-screen">
        {!notificationLoader && notificationList?.Data ? (
          <>
            {notificationList.Data.length > 0 ? (
              <>
                {/* Stats Card */}

                {/* Notifications List */}
                <motion.div
                  className="px-4 mt-4 space-y-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {notificationList.Data.map((item, index) => {
                      const colors = getNotificationColor(index);
                      return (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          layout
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="cursor-pointer"
                        >
                          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                            {/* Gradient accent line */}
                            <div
                              className={`h-1 bg-gradient-to-r ${colors.from} ${colors.to}`}
                            ></div>

                            <div className="p-4 flex items-start gap-4">
                              {/* Avatar with gradient border */}
                              <div className="relative flex-shrink-0">
                                <motion.div
                                  className={`absolute inset-0 bg-gradient-to-r ${colors.from} ${colors.to} rounded-xl blur-md opacity-50`}
                                  animate={{
                                    scale: [1, 1.1, 1],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                                <div className="relative w-12 h-12 bg-white rounded-xl p-1 shadow-md">
                                  <img
                                    src={getNotificationIcon(item)}
                                    alt="icon"
                                    className="w-full h-full rounded-lg object-cover"
                                  />
                                </div>
                                {/* Unread indicator */}
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="text-sm font-bold text-gray-900 capitalize line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                                    {item?.title}
                                  </h4>
                                  {/* Time badge */}
                                  <span className="flex-shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                    {moment(item.createdAt).fromNow()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 capitalize line-clamp-2 leading-relaxed">
                                  {item?.body}
                                </p>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 mt-3">
                                  <motion.button
                                    className={`text-[10px] font-semibold ${colors.bg} text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all duration-300 flex items-center gap-1`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <IoCheckmarkCircle className="text-sm" />
                                    Mark as read
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              // Empty State
              <motion.div
                className="flex flex-col items-center justify-center mt-32 px-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="relative mb-6"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Gradient circle background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl">
                    <MdInbox className="text-6xl text-gray-400" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Notifications
                </h3>
                <p className="text-gray-500 text-center max-w-sm mb-6">
                  You're all caught up! We'll notify you when something new
                  arrives.
                </p>

                {/* Decorative elements */}
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          // Loader
          <div className="flex justify-center items-center mt-40">
            {notificationLoader ? (
              <Loader />
            ) : (
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl mb-4">
                  <MdInbox className="text-6xl text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No notifications found
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {/* <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white z-40"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 10px 30px rgba(59, 130, 246, 0.3)",
            "0 10px 40px rgba(124, 58, 237, 0.4)",
            "0 10px 30px rgba(59, 130, 246, 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </motion.button> */}
    </div>
  );
};

export default ModernNotificationList;

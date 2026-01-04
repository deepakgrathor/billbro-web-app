import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import Loader from "../../Components/Loader";
import { BILL, ImageBaseURL, SERVICE } from "../../Utils/Constant";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
import { IoSparklesSharp, IoFlashSharp } from "react-icons/io5";
import { MdTrendingUp } from "react-icons/md";
import ToastComp from "../../Components/ToastComp";

const BBPSList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );

  useEffect(() => {
    dispatch(fetchServiceList());
  }, [dispatch]);

  const handleServiceClick = (item) => {
    if (!item.status) {
      ToastComp({ message: "Service is currently unavailable", type: "error" });
    } else {
      if (item._id === "661061ecda6832bf278254e1") {
        navigate("/googleplay", { state: item });
        const data = {
          type: SERVICE,
          ids: "661061ecda6832bf278254e1",
          serviceType: BILL,
        };
        dispatch(setPaymentType(data));
      } else {
        navigate("/mainbbps", { state: item });
        const data = {
          type: SERVICE,
          ids: item._id,
          serviceType: BILL,
        };
        dispatch(setPaymentType(data));
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const filteredServices = serviceList.Data?.filter(
    (a) => a.section === "finance" && a.isShow
  );

  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={70}
          height={30}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt=""
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <CommonHeader
          title="Bill Payments"
          handleclick={() => navigate(-1)}
          rightDesign={rightDesign}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-16 pb-20">
        {!serviceLoader && filteredServices ? (
          <>
            {/* Hero Section */}
            <motion.div
              className="mx-4 mt-6 mb-6"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl overflow-hidden">
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, 30, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <IoSparklesSharp className="text-yellow-300 text-xl" />
                      <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                        Quick Pay
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">
                      Pay Bills Instantly
                    </h2>
                    <p className="text-white/80 text-sm font-medium">
                      Fast, secure & rewarding
                    </p>
                  </div>
                  <motion.div
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <IoFlashSharp className="text-4xl text-yellow-300" />
                  </motion.div>
                </div>

                {/* Stats badges */}
                <div className="relative mt-4 flex space-x-3">
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-[10px] font-semibold">
                          Services
                        </p>
                        <p className="text-white text-lg font-black">
                          {filteredServices?.length || 0}+
                        </p>
                      </div>
                      <MdTrendingUp className="text-green-300 text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-[10px] font-semibold">
                          Instant
                        </p>
                        <p className="text-white text-lg font-black">100%</p>
                      </div>
                      <IoSparklesSharp className="text-yellow-300 text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              className="px-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h3
                className="text-lg font-bold text-gray-800 mb-4 flex items-center"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                All Services
              </motion.h3>

              <div className="grid grid-cols-3 gap-4">
                {filteredServices?.map((item, index) => {
                  // Different gradient colors for variety
                  const gradients = [
                    "from-blue-500 to-cyan-500",
                    "from-purple-500 to-pink-500",
                    "from-green-500 to-emerald-500",
                    "from-orange-500 to-red-500",
                    "from-indigo-500 to-blue-500",
                    "from-pink-500 to-rose-500",
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        onClick={() => handleServiceClick(item)}
                        className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                      >
                        {/* Gradient hover effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        ></div>

                        {/* Cashback badge (if available) */}
                        {item.percent >= 1 && (
                          <motion.div
                            className={`absolute top-2 right-2 bg-gradient-to-r ${gradient} text-white text-[8px] font-bold px-2 py-1 rounded-full shadow-lg z-10`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: index * 0.1 + 0.5,
                              type: "spring",
                            }}
                          >
                            ₹{item.percent}{" "}
                            {item._id === "661061ecda6832bf278254e1"
                              ? "% Percent"
                              : "Flat"}
                          </motion.div>
                        )}

                        <div className="relative p-4 flex flex-col items-center">
                          {/* Icon container with gradient border */}
                          <div className="relative mb-3">
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-lg opacity-30`}
                              animate={{
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center p-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                              <img
                                src={`${ImageBaseURL}${item.icon}`}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>

                          {/* Service name */}
                          <p className="text-[11px] font-bold text-gray-800 text-center capitalize leading-tight group-hover:text-blue-600 transition-colors duration-300">
                            {item.name}
                          </p>
                        </div>

                        {/* Bottom accent line */}
                        <motion.div
                          className={`h-1 bg-gradient-to-r ${gradient}`}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          style={{ transformOrigin: "left" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Info card */}
            <motion.div
              className="mx-4 mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                      Quick Tips
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Pay bills on time to earn cashback rewards and never miss
                      a due date!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          // Loader or Empty state
          <div className="flex justify-center items-center mt-32">
            {serviceLoader ? (
              <Loader />
            ) : (
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-semibold">
                  No services available
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Powered by BBPS */}
      {/* <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 text-xs font-medium">
              Powered by
            </span>
          </div>
          <img
            src="https://ik.imagekit.io/isjriggan/images%20(1).png"
            alt="BBPS"
            className="h-5 object-contain"
          />
        </div>
      </motion.div> */}

      {/* Loader */}
      {serviceLoader && (
        <Loader
          loading={serviceLoader}
          title="Getting things ready"
          subtitle="Fetching latest services for you..."
        />
      )}
    </div>
  );
};

export default BBPSList;

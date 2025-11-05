import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBarComp from "../../Components/SearchBarComp";
import CommonHeader from "../../Components/CommonHeader";
import { IoSearchOutline, IoCheckmarkCircle } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";

const SelectBBPSOperator = ({ data, setStep, setData }) => {
  const [search, setSearch] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const handleClick = async ({ item }) => {
    setSelectedOperator(item.operator_id);
    setTimeout(() => {
      setData(item);
      setStep(2);
    }, 300);
  };

  const filteredData = search
    ? data?.filter((a) =>
        a.operator_name?.toLowerCase().includes(search?.toLowerCase())
      )
    : data;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Main Content */}
      <div className="p-4 pb-6">
        {/* Hero Section */}

        {/* Search Bar */}
        <motion.div
          className="mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur"></div>

            {/* Search input container */}
            <div className="relative bg-white rounded-2xl shadow">
              <div className="flex items-center px-4 py-3">
                <IoSearchOutline className="text-gray-400 text-xl mr-3" />
                <input
                  type="text"
                  placeholder="Search your biller..."
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                />
                {search && (
                  <motion.button
                    onClick={() => setSearch(null)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Search hint */}
          {search && (
            <motion.p
              className="text-xs text-gray-500 mt-2 ml-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Found {filteredData?.length || 0} result(s)
            </motion.p>
          )}
        </motion.div>

        {/* Operators List */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const isSelected = selectedOperator === item.operator_id;
                const gradients = [
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-pink-500",
                  "from-green-500 to-emerald-500",
                  "from-orange-500 to-red-500",
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <motion.div
                    key={item.operator_id || index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <div
                      onClick={() => handleClick({ item })}
                      className={`relative bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
                        isSelected
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <motion.div
                          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}

                      <div className="p-2 flex items-center justify-between">
                        {/* Left section - Icon & Name */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          {/* Icon container with gradient */}
                          <div className="relative flex-shrink-0">
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-md opacity-30`}
                              animate={{
                                scale: isSelected ? [1, 1.2, 1] : 1,
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: isSelected ? Infinity : 0,
                              }}
                            />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-1 shadow-md">
                              <img
                                src={item.icon}
                                alt={item.operator_name}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            </div>
                          </div>

                          {/* Operator name */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-gray-800 leading-tight">
                              {item.operator_name}
                            </p>
                            {/* <p className="text-[10px] text-gray-500 mt-0.5">
                              Quick payment available
                            </p> */}
                          </div>
                        </div>

                        {/* Right section - Arrow or Checkmark */}
                        <div className="flex-shrink-0 ml-3">
                          {isSelected ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <IoCheckmarkCircle className="text-white text-xl" />
                              </div>
                            </motion.div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                              <MdKeyboardArrowRight className="text-gray-400 text-xl group-hover:text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              // Empty State
              <motion.div
                className="flex flex-col items-center justify-center py-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-20"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-xl">
                    <IoSearchOutline className="text-4xl text-gray-400" />
                  </div>
                </motion.div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500 text-center text-sm max-w-xs">
                  We couldn't find any operator matching "{search}". Try a
                  different search term.
                </p>

                <motion.button
                  onClick={() => setSearch(null)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Search
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Card */}
        {filteredData && filteredData.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
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
                    Quick Tip
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Select your biller to proceed with bill payment. All
                    payments are secure and instant!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelectBBPSOperator;

// ✅ Modern redesign (fully responsive) — SAME LOGIC
// Drop-in replacement for SelectBBPSOperator.jsx
// - Same props: ({ data, setStep, setData })
// - Same search + filter logic
// - Same click selection + 300ms delay

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline, IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";

const SelectBBPSOperator = ({ data, setStep, setData }) => {
  const [search, setSearch] = useState("");
  const [selectedOperator, setSelectedOperator] = useState(null);

  const handleClick = async ({ item }) => {
    setSelectedOperator(item.operator_id);
    setTimeout(() => {
      setData(item);
      setStep(2);
    }, 300);
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data?.filter((a) =>
      a.operator_name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 140, damping: 16 },
    },
    exit: { y: -8, opacity: 0, transition: { duration: 0.15 } },
  };

  const gradients = [
    "from-sky-500 to-cyan-500",
    "from-violet-500 to-fuchsia-500",
    "from-emerald-500 to-lime-500",
    "from-orange-500 to-rose-500",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white relative">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="px-3 sm:px-4 pt-4 pb-8 max-w-xl mx-auto">
        {/* Header Card */}
        <motion.div
          className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-5 bg-slate-900">
            <p className="text-[11px] font-black text-white/70 uppercase tracking-wider">
              Select biller
            </p>
            <h2 className="text-white font-black text-xl sm:text-2xl mt-1">
              Choose your operator
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              Search and tap to continue
            </p>
          </div>

          {/* Search */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <IoSearchOutline className="text-xl text-slate-500" />
                </div>

                <input
                  type="text"
                  placeholder="Search your biller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-base font-bold text-slate-900 placeholder:text-slate-400 min-w-0"
                />

                {search?.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={() => setSearch("")}
                    className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Clear search"
                  >
                    <IoClose className="text-xl" />
                  </motion.button>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-slate-500">
                {search
                  ? `Found ${filteredData?.length || 0} result(s)`
                  : `Showing ${data?.length || 0} biller(s)`}
              </p>

              {selectedOperator && (
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* List */}
        <motion.div
          className="mt-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredData && filteredData.length > 0 ? (
              <div className="space-y-3">
                {filteredData.map((item, index) => {
                  const isSelected = selectedOperator === item.operator_id;
                  const gradient = gradients[index % gradients.length];

                  return (
                    <motion.div
                      key={item.operator_id || index}
                      variants={itemVariants}
                      layout
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleClick({ item })}
                        className={`w-full text-left rounded-3xl border bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-hidden transition
                          ${
                            isSelected
                              ? "border-slate-900"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        {/* top accent */}
                        <div
                          className={`h-1.5 bg-gradient-to-r ${gradient} ${
                            isSelected ? "opacity-100" : "opacity-60"
                          }`}
                        />

                        <div className="p-4 flex items-center gap-3">
                          {/* icon */}
                          <div className="relative shrink-0">
                            <div
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} blur-md opacity-20`}
                            />
                            <div className="relative h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2">
                              <img
                                src={item.icon}
                                alt={item.operator_name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          {/* text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                              {item.operator_name}
                            </p>
                            {/* <p className="text-[11px] font-semibold text-slate-500 mt-1">
                              Tap to proceed
                            </p> */}
                          </div>

                          {/* action */}
                          <div className="shrink-0">
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 220 }}
                                className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.25)]"
                              >
                                <IoCheckmarkCircle className="text-white text-2xl" />
                              </motion.div>
                            ) : (
                              <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                                <MdKeyboardArrowRight className="text-slate-400 text-2xl" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] p-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <IoSearchOutline className="text-3xl text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">
                    No results found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    We couldn’t find any biller matching{" "}
                    <span className="font-bold text-slate-700">
                      “{search}”
                    </span>
                    .
                  </p>

                  <motion.button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-5 px-5 py-3 rounded-2xl bg-slate-900 text-white font-black shadow-[0_10px_25px_rgba(2,6,23,0.18)]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear search
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tip */}
        {filteredData && filteredData.length > 0 && (
          <motion.div
            className="mt-5 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.04)] p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex gap-3">
              <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <span role="img" aria-label="tip" className="text-lg">
                  💡
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">Quick tip</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500 leading-relaxed">
                  Select your biller to continue. Payments are secure and
                  processed instantly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SelectBBPSOperator;

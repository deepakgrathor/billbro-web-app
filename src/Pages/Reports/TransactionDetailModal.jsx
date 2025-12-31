import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { handleCopy } from "../../Utils/CommonFunc";
import { BsCopy, BsCheck } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const TransactionDetailModal = ({ isOpen, onClose, transaction, type }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState("");

  if (!isOpen || !transaction) return null;

  const handleCopyWithFeedback = (text, field) => {
    handleCopy(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const getStatusConfig = () => {
    const status = transaction.status?.toLowerCase();

    if (
      status === "success" ||
      status === "txn_success" ||
      status === "credited"
    ) {
      return {
        icon: FaCheckCircle,
        iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
        bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
        border: "border-emerald-300",
        glow: "shadow-emerald-200",
        textColor: "text-emerald-700",
        badgeGradient: "from-emerald-500 to-green-500",
        title:
          type === "ledgerBook"
            ? "Amount Credited Successfully"
            : "Transaction Successful",
        showBAssured: type === "billPayments" || type === "recharges",
      };
    } else if (
      status === "failed" ||
      status === "txn_failure" ||
      status === "rejected"
    ) {
      return {
        icon: FaTimesCircle,
        iconBg: "bg-gradient-to-br from-red-400 to-rose-600",
        bg: "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50",
        border: "border-red-300",
        glow: "shadow-red-200",
        textColor: "text-red-700",
        badgeGradient: "from-red-500 to-rose-500",
        title: "Transaction Failed",
        showBAssured: false,
      };
    } else {
      return {
        icon: FaClock,
        iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
        bg:
          type === "ledgerBook"
            ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
            : "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
        border:
          type === "ledgerBook" ? "border-emerald-300" : "border-amber-300",
        glow: type === "ledgerBook" ? "shadow-emerald-200" : "shadow-amber-200",
        textColor:
          type === "ledgerBook" ? "text-emerald-700" : "text-amber-700",
        badgeGradient:
          type === "ledgerBook"
            ? "from-emerald-500 to-green-500"
            : "from-amber-500 to-orange-500",
        title: type === "ledgerBook" ? "Amount Debited" : "Transaction Pending",
        showBAssured: false,
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleRaiseComplaint = () => {
    onClose();
    if (type === "billPayments") {
      navigate("/bbps-complaint-registration", {
        state: {
          activeTab: 1,
          transactionId: transaction?.transactionId || transaction.id,
        },
      });
    } else {
      navigate("/recharge-complain", { state: { transaction } });
    }
  };

  const handleNeedSupport = () => {
    onClose();
    navigate("/contact");
  };

  const isBBPSTransaction = type === "billPayments";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white to-gray-50 rounded-t-[2rem] z-50 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-4 pb-2 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
              <motion.div
                className="w-14 h-1.5 bg-gray-300 rounded-full"
                whileHover={{ width: 60 }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all shadow-md z-20"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>

            <div className="px-6 pb-8 pt-2">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-black text-gray-900 mb-6 tracking-tight"
              >
                Transaction Details
              </motion.h2>

              {/* Status Badge - Premium Design */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className={`${statusConfig.bg} border-2 ${statusConfig.border} px-6 py-5 rounded-3xl mb-6 shadow-lg ${statusConfig.glow} relative overflow-hidden`}
              >
                {/* Decorative gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${statusConfig.badgeGradient} opacity-5`}
                />

                <div className="flex items-center gap-4 relative z-10">
                  {/* B Assured Logo for Success or Regular Icon */}
                  {statusConfig.showBAssured && isBBPSTransaction ? (
                    <motion.div
                      className="relative flex-shrink-0"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        delay: 0.2,
                      }}
                    >
                      <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-60" />
                      <img
                        src="https://ik.imagekit.io/43tomntsa/B%20Assured%20Logo_SVG.svg"
                        alt="B Assured"
                        className="w-24 h-24 object-contain relative z-10"
                      />
                      {/* Pulsating ring effect */}
                      {/* <motion.div
                        className="absolute inset-0 border-4 border-emerald-400 rounded-full"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      /> */}
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`w-14 h-14 rounded-2xl ${statusConfig.iconBg} flex items-center justify-center shadow-xl relative`}
                    >
                      <StatusIcon className="w-7 h-7 text-white" />
                    </motion.div>
                  )}

                  <div className="flex-1">
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`${statusConfig.textColor} text-lg font-black tracking-wide`}
                    >
                      {statusConfig.title}
                    </motion.p>
                    {/* {statusConfig.showBAssured && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xs text-gray-600 mt-0.5 font-medium"
                      >
                        Secured by BBPS (NPCI)
                      </motion.p>
                    )} */}
                  </div>

                  {/* Checkmark badge */}
                  {transaction.status?.toLowerCase() === "success" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className={`bg-gradient-to-br ${statusConfig.badgeGradient} p-2 rounded-full shadow-lg`}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Amount Section - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden"
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                  <p className="text-xs text-white/80 mb-2 font-bold uppercase tracking-widest">
                    Total Amount
                  </p>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <motion.p
                      className="text-4xl font-black text-white drop-shadow-lg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {transaction.amount}
                    </motion.p>
                    {isBBPSTransaction && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm font-semibold text-white/90 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm"
                      >
                        + CCF: ₹0
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Transaction Cards - Premium Design */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-3"
              >
                {/* Transaction Type Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
                >
                  <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-purple-500 rounded-full" />
                    Transaction Info
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900 capitalize">
                        {type === "deposits"
                          ? "Wallet Deposit"
                          : type === "ledger"
                          ? transaction.type
                          : transaction.type || "Bill Payment"}
                      </span>
                    </div>

                    {type !== "deposits" &&
                      type !== "ledgerBook" &&
                      transaction.number && (
                        <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                          <span className="text-sm text-gray-600 font-semibold">
                            Consumer Number
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg">
                              {transaction.number}
                            </span>
                            {isBBPSTransaction &&
                              transaction.status === "success" && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    handleCopyWithFeedback(
                                      transaction.number,
                                      "number"
                                    )
                                  }
                                  className="p-2 hover:bg-purple-50 rounded-xl transition-colors"
                                >
                                  {copied === "number" ? (
                                    <BsCheck className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <BsCopy className="w-5 h-5 text-purple-600" />
                                  )}
                                </motion.button>
                              )}
                          </div>
                        </div>
                      )}
                  </div>
                </motion.div>

                {/* B-Connect ID Card - Ultra Premium */}
                {isBBPSTransaction && transaction.OPR_REF && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-5 shadow-2xl relative overflow-hidden"
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white uppercase tracking-widest drop-shadow-lg">
                            B-Connect Txn ID
                          </span>
                          <span className="px-2.5 py-1 bg-white text-blue-600 text-[10px] rounded-full font-black shadow-lg">
                            BBPS
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-base font-mono font-black text-white break-all drop-shadow-md">
                          {transaction.OPR_REF}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            handleCopyWithFeedback(
                              transaction.OPR_REF,
                              "bharatConnect"
                            )
                          }
                          className="flex-shrink-0 p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all shadow-lg"
                        >
                          {copied === "bharatConnect" ? (
                            <BsCheck className="w-5 h-5 text-white" />
                          ) : (
                            <BsCopy className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Transaction ID Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-indigo-500 rounded-full" />
                      Transaction ID
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-mono font-bold text-gray-900 break-all bg-gray-50 px-3 py-2 rounded-lg">
                      {transaction.transactionId || transaction.id}
                    </span>
                    {transaction.status === "success" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleCopyWithFeedback(
                            transaction.transactionId || transaction.id,
                            "txnId"
                          )
                        }
                        className="flex-shrink-0 p-2 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                        {copied === "txnId" ? (
                          <BsCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <BsCopy className="w-5 h-5 text-indigo-600" />
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Date & Time Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
                >
                  <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-pink-500 rounded-full" />
                    Date & Time
                  </p>
                  <p className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                    {transaction.date}
                  </p>
                </motion.div>

                {/* Operator Reference */}
                {transaction.OP_REF && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-md hover:shadow-lg transition-all"
                  >
                    <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-4 bg-orange-500 rounded-full" />
                      Operator Reference
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-mono font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                        {transaction.OP_REF}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleCopyWithFeedback(transaction.OP_REF, "opRef")
                        }
                        className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        {copied === "opRef" ? (
                          <BsCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <BsCopy className="w-5 h-5 text-orange-600" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Action Buttons - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-8 space-y-3"
              >
                {(type === "recharges" || type === "billPayments") && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRaiseComplaint}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-xl">🎫</span>
                    Raise a Complaint
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNeedSupport}
                    className="py-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    💬 Support
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="py-4 bg-gradient-to-br from-gray-600 to-gray-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    ✕ Close
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailModal;

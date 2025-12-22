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
        iconBg: "bg-gradient-to-br from-green-400 to-emerald-600",
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        textColor: "text-green-700",
        title:
          type === "ledgerBook"
            ? "Amount Credited Successfully"
            : "Transaction Successful",
        showBAssured: type === "billPayments" || type === "recharges", // Show B Assured for BBPS
      };
    } else if (
      status === "failed" ||
      status === "txn_failure" ||
      status === "rejected"
    ) {
      return {
        icon: FaTimesCircle,
        iconBg: "bg-gradient-to-br from-red-400 to-rose-600",
        bg: "bg-gradient-to-r from-red-50 to-rose-50",
        border: "border-red-200",
        textColor: "text-red-700",
        title: "Transaction Failed",
        showBAssured: false,
      };
    } else {
      return {
        icon: FaClock,
        iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
        bg:
          type === "ledgerBook"
            ? "bg-gradient-to-r from-green-50 to-emerald-50"
            : "bg-gradient-to-r from-yellow-50 to-amber-50",
        border:
          type === "ledgerBook" ? "border-green-200" : "border-yellow-200",
        textColor: type === "ledgerBook" ? "text-green-700" : "text-yellow-700",
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

  // Check if BBPS transaction
  const isBBPSTransaction = type === "billPayments";
  console.log(transaction, "transaction");
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Bharat Connect Logo - Top Right (if BBPS transaction) */}
            {/* {isBBPSTransaction && (
              <div className="absolute top-4 right-14 z-10">
                <img 
                  src="/assets/bharat-connect/bharat-connect-logo.png" 
                  alt="Bharat Connect"
                  className="h-6 w-auto opacity-90"
                />
              </div>
            )} */}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="px-6 pb-6 pt-2">
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-bold text-gray-900 mb-6"
              >
                Transaction Details
              </motion.h2>

              {/* Status Badge with B Assured Logo for Success */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`${statusConfig.bg} border-2 ${statusConfig.border} px-4 py-4 rounded-2xl mb-6`}
              >
                <div className="flex items-center gap-3">
                  {/* Show B Assured Logo for Successful BBPS Transactions */}
                  {statusConfig.showBAssured && isBBPSTransaction ? (
                    <div className="relative">
                      <img
                        src="https://ik.imagekit.io/43tomntsa/B%20Assured%20Logo_SVG.svg"
                        alt="B Assured"
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full ${statusConfig.iconBg} flex items-center justify-center shadow-lg`}
                    >
                      <StatusIcon className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="flex-1">
                    <p
                      className={`${statusConfig.textColor} text-sm font-bold mb-0.5`}
                    >
                      {statusConfig.title}
                    </p>
                    {/* {statusConfig.showBAssured && (
                      <p className="text-xs text-gray-600">
                        Powered by Bharat Connect (NPCI)
                      </p>
                    )} */}
                  </div>
                </div>
              </motion.div>

              {/* Amount Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6 border border-indigo-200"
              >
                <p className="text-xs text-gray-600 mb-1 font-medium uppercase tracking-wide">
                  Transaction Amount
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-gray-900">
                    {transaction.amount}
                  </p>
                  {/* {transaction.commission && transaction.commission !== "₹0" && (
                    <span className="text-base font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      +{transaction.commission}
                    </span>
                  )} */}
                </div>
              </motion.div>

              {/* Transaction Details Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                {/* Transaction Type & Number */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                    Transaction Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 capitalize">
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
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-600">
                            Consumer Number
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-semibold text-gray-900">
                              {transaction.number}
                            </span>
                            {type === "billPayments" &&
                              transaction.status === "success" && (
                                <button
                                  onClick={() =>
                                    handleCopyWithFeedback(
                                      transaction.number,
                                      "number"
                                    )
                                  }
                                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  {copied === "number" ? (
                                    <BsCheck className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <BsCopy className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                              )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* B-Connect Transaction ID (for BBPS) */}
                {isBBPSTransaction && transaction.OPR_REF && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                          B-Connect Txn ID
                        </span>
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full font-semibold">
                          BBPS
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-bold text-gray-900 break-all">
                        {transaction.OPR_REF}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyWithFeedback(
                            transaction.OPR_REF,
                            "bharatConnect"
                          )
                        }
                        className="ml-2 p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copied === "bharatConnect" ? (
                          <BsCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <BsCopy className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Transaction ID */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Transaction ID
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold text-gray-900 break-all">
                      {transaction.transactionId || transaction.id}
                    </span>
                    {transaction.status === "success" && (
                      <button
                        onClick={() =>
                          handleCopyWithFeedback(
                            transaction.transactionId || transaction.id,
                            "txnId"
                          )
                        }
                        className="ml-2 p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copied === "txnId" ? (
                          <BsCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <BsCopy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                    Date & Time
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {transaction.date}
                  </p>
                </div>

                {/* Payment Method */}
                {(type === "deposits" || type === "ledger") && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                      Payment Method
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {transaction.paymentMethod || "Wallet"}
                    </p>
                  </div>
                )}

                {/* Operator Reference (if available) */}
                {transaction.OP_REF && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                      Operator Reference
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono font-semibold text-gray-900">
                        {transaction.OP_REF}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyWithFeedback(transaction.OP_REF, "opRef")
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copied === "opRef" ? (
                          <BsCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <BsCopy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 space-y-3"
              >
                {/* Raise Complaint Button (for BBPS transactions) */}
                {(type === "recharges" || type === "billPayments") && (
                  <button
                    onClick={handleRaiseComplaint}
                    className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    🎫 Raise a Complaint
                  </button>
                )}

                {/* Bottom Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleNeedSupport}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 font-semibold rounded-xl hover:from-yellow-200 hover:to-amber-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    💬 Need Support?
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 font-semibold rounded-xl hover:from-pink-200 hover:to-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ✕ Close
                  </button>
                </div>
              </motion.div>

              {/* BBPS Footer Note */}
              {/* {isBBPSTransaction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-xs text-gray-500">
                    {transaction.status === "success"
                      ? "✅ This is a valid BBPS transaction"
                      : transaction.status === "pending"
                      ? "⏳ Transaction is being processed"
                      : "For support, use B-Connect Txn ID"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Powered by Bharat Connect (NPCI)
                  </p>
                </motion.div>
              )} */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailModal;

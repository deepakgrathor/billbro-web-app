import React, { useEffect, useRef, useState } from "react";
import { BsCheck, BsClock, BsCopy, BsXCircle } from "react-icons/bs";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CommonHeader from "../../Components/CommonHeader";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";
import { handleCopy } from "../../Utils/CommonFunc";

const BBPSStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const data = location.state;

  const responseData = {
    MobileNumber: data.MobileNumber,
    Operator_Code: data.Operator_Code,
    amount: data.amount,
    transactionId: data.transactionId,
    status: data.status?.toLowerCase(),
    type: data.type,
    OP_REF: data.OP_REF,
    timestamp: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  const getStatusConfig = (status) => {
    const configs = {
      success: {
        icon: FaCheckCircle,
        color: "text-green-600",
        iconBg: "bg-green-500",
        gradient: "from-green-50 to-emerald-100",
        message: "Payment Successful!",
        subMessage: "Your bill payment has been processed successfully",
      },
      pending: {
        icon: BsClock,
        color: "text-yellow-600",
        iconBg: "bg-yellow-500",
        gradient: "from-yellow-50 to-amber-100",
        message: "Payment Pending",
        subMessage:
          "Your payment is being processed. You'll be notified once confirmed.",
      },
      failed: {
        icon: BsXCircle,
        color: "text-red-600",
        iconBg: "bg-red-500",
        gradient: "from-red-50 to-rose-100",
        message: "Payment Failed",
        subMessage:
          "Your payment could not be processed. Amount refunded to wallet.",
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(responseData.status);
  const StatusIcon = statusConfig.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (
      data.status === "SUCCESS" ||
      data.status === "success" ||
      data.status === "Success"
    ) {
      const timer = setTimeout(() => {
        setContent(PlayStoreRating);
        setOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data?.status]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <CommonHeader
          title="Transaction Details"
          handleclick={() => navigate("/")}
        />
      </div>

      <div
        ref={receiptRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            layout
            className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden"
          >
            {/* Animated Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`bg-gradient-to-br ${statusConfig.gradient} px-6 py-10 text-center`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className={`${statusConfig.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg`}
              >
                <StatusIcon className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className={`text-xl font-bold mt-4 ${statusConfig.color}`}>
                {statusConfig.message}
              </h1>
              <p className="text-gray-600 text-xs mt-1">
                {statusConfig.subMessage}
              </p>
            </motion.div>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-50 py-5 text-center"
            >
              <p className="text-gray-600 text-sm">Amount Paid</p>
              <h2 className="text-4xl font-bold text-gray-800 mt-1">
                ₹{responseData.amount}
              </h2>
            </motion.div>

            {/* Transaction Details */}
            <div className="p-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {data.type === "BBPS" ? "Transaction ID" : "Redeem Code"}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 break-all">
                    {data.type === "BBPS"
                      ? responseData.transactionId
                      : responseData.OP_REF}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      data.type === "BBPS"
                        ? responseData.transactionId
                        : responseData.OP_REF
                    )
                  }
                  className="ml-3 p-2 hover:bg-gray-200 rounded-lg"
                >
                  {copied ? (
                    <BsCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <BsCopy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </motion.div>

              <div className="space-y-3">
                {data.type !== "BBPS" && (
                  <DetailRow
                    label="Transaction ID"
                    value={responseData.transactionId}
                  />
                )}
                <DetailRow
                  label="Consumer Number"
                  value={responseData.MobileNumber}
                />
                <DetailRow
                  label="Operator"
                  value={responseData.Operator_Code}
                />
                <DetailRow
                  label="Operator Reference"
                  value={responseData.OP_REF}
                />
                <DetailRow label="Date & Time" value={responseData.timestamp} />
              </div>

              <div className="border-t border-dashed border-gray-300 my-6"></div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <FaHome className="w-5 h-5" />
                Back to Home
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-purple-50 text-center py-4 border-t border-gray-200"
            >
              <p className="text-xs text-gray-600">
                {responseData.status === "success"
                  ? "✅ This is a computer generated receipt"
                  : responseData.status === "pending"
                  ? "⏳ You will receive a confirmation once payment is processed"
                  : "❌ For any issues, please contact support"}
              </p>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-gray-600 mt-4"
          >
            Need help?{" "}
            <span
              onClick={() => navigate("/contact")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Contact Support
            </span>
          </motion.p>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <BottomSheet
            content={content}
            isOpen={open}
            setIsOpen={setOpen}
            bottomButton={false}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-none"
  >
    <span className="text-[10px] text-gray-600">{label}</span>
    <span className="text-[10px] font-semibold text-gray-800 text-right uppercase">
      {value}
    </span>
  </motion.div>
);

export default BBPSStatus;

import React, { useEffect, useRef, useState } from "react";
import {
  BsCheck,
  BsCheckCircle,
  BsClock,
  BsCopy,
  BsDownload,
  BsXCircle,
} from "react-icons/bs";
import { FaCheck, FaCheckCircle, FaHome } from "react-icons/fa";
import { TbShare2 } from "react-icons/tb";
import CommonHeader from "../../Components/CommonHeader";
import ToastComp from "../../Components/ToastComp";
import { useLocation, useNavigate } from "react-router-dom";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";

const BBPSStatus = () => {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const location = useLocation();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const data = location.state;
  const [copied, setCopied] = useState(false);
  // Sample data - Replace with actual props/navigation state
  const responseData = {
    MobileNumber: data.MobileNumber,
    Operator_Code: data.Operator_Code,
    amount: data.amount,
    transactionId: data.transactionId,
    status: data.status?.toLowerCase(), // success, pending, failed
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
        // bgGradient: "bg-gradient-to-br from-green-50 to-emerald-100",
        iconBg: "bg-green-500",
        message: "Payment Successful!",
        subMessage: "Your bill payment has been processed successfully",
      },
      pending: {
        icon: BsClock,
        color: "text-yellow-600",
        // bgGradient: "bg-gradient-to-br from-yellow-50 to-amber-100",
        iconBg: "bg-yellow-500",
        message: "Payment Pending",
        subMessage:
          "Your payment is being processed. You'll be notified once confirmed.",
      },
      failed: {
        icon: BsXCircle,
        color: "text-red-600",
        // bgGradient: "bg-gradient-to-br from-red-50 to-rose-100",
        iconBg: "bg-red-500",
        message: "Payment Failed",
        subMessage:
          "Your payment could not be processed. Amount refunded to wallet.",
      },
    };
    return configs[status.toLowerCase()] || configs.pending;
  };

  const statusConfig = getStatusConfig(responseData.status);
  const StatusIcon = statusConfig.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    ToastComp({ message: "Copied to clipboard!", type: "success" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert("Download receipt functionality");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Payment Receipt",
        text: `Transaction ID: ${responseData.transactionId}\nAmount: ₹${responseData.amount}\nStatus: ${responseData.status}`,
      });
    } else {
      alert("Share functionality");
    }
  };

  // const handleDownloadImage = async () => {
  //   const element = receiptRef.current;
  //   console.log(element, "element");
  //   const canvas = await html2canvas(element, {
  //     onclone: (doc) => {
  //       // remove gradients before rendering
  //       doc.querySelectorAll('[class*="bg-gradient"]').forEach((el) => {
  //         el.style.background = "#ffffff";
  //       });
  //     },
  //   });
  //   console.log(canvas, "canvas");
  //   const link = document.createElement("a");
  //   link.download = `receipt_${Date.now()}.png`;
  //   link.href = canvas.toDataURL("image/png");
  //   link.click();
  // };

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

      // Cleanup - component unmount hone par timer cancel ho jaye
      return () => clearTimeout(timer);
    }
  }, [data?.status]);

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CommonHeader
          style={{ fontSize: 13 }}
          title={"Transaction Details"}
          handleclick={() => navigate("/")}
          // rightDesign={rightDesign}
        />
      </div>
      <div
        ref={receiptRef}
        className="min-h-screen  p-4 flex items-center justify-center"
      >
        <div className="w-full mt-16 max-w-md">
          {/* Receipt Card */}
          <div className="bg-white rounded-3xl  overflow-hidden border border-gray-100">
            {/* Status Header */}
            <div
              className={`${statusConfig.bgGradient} px-6 py-8 text-center relative overflow-hidden`}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

              <div className="relative z-10">
                {/* Status Icon */}
                <div
                  className={`${statusConfig.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <StatusIcon
                    className="w-12 h-12 text-white"
                    strokeWidth={2.5}
                  />
                </div>

                {/* Status Message */}
                <h1 className={`text-xl font-bold ${statusConfig.color} mb-2`}>
                  {statusConfig.message}
                </h1>
                <p className="text-gray-600 text-xs px-4">
                  {statusConfig.subMessage}
                </p>
              </div>
            </div>

            {/* Amount Section */}
            <div className="bg-gradient-to-r bg-purple-50 px-6 py-4 text-center">
              <p className="text-gray-700 text-sm mb-1">Amount Paid</p>
              <h2 className="text-4xl font-bold text-gray-700">
                ₹{responseData.amount}
              </h2>
            </div>

            {/* Transaction Details */}
            <div className="p-6 space-y-4">
              {/* Transaction ID with Copy */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
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
                      copyToClipboard(
                        data.type === "BBPS"
                          ? responseData.transactionId
                          : responseData.OP_REF
                      )
                    }
                    className="ml-3 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <BsCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <BsCopy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Details Grid */}
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
                {/* <DetailRow label="Payment Type" value={responseData.type} /> */}
                <DetailRow
                  label="Operator Reference"
                  value={responseData.OP_REF}
                />
                <DetailRow label="Date & Time" value={responseData.timestamp} />
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-300 my-6"></div>

              {/* Action Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <BsDownload className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <TbShare2 className="w-5 h-5" />
                  Share
                </button>
              </div> */}

              {/* Back to Home Button */}
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors mt-3"
              >
                <FaHome className="w-5 h-5" />
                Back to Home
              </button>
            </div>

            {/* Footer Note */}
            <div className="bg-gradient-to-r bg-purple-50 px-6 py-4 text-center border-t border-gray-200">
              <p className="text-xs text-gray-600">
                {responseData.status === "success"
                  ? "✅ This is a computer generated receipt"
                  : responseData.status === "pending"
                  ? "⏳ You will receive a confirmation once payment is processed"
                  : "❌ For any issues, please contact support"}
              </p>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Need help?{" "}
            <span
              onClick={() => navigate("/contact")}
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Contact Support
            </span>
          </p>
        </div>
      </div>
      <BottomSheet
        content={content}
        isOpen={open}
        setIsOpen={setOpen}
        bottomButton={false}
      />
    </>
  );
};

// Detail Row Component
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-xs text-gray-600">{label}</span>
    <span className="text-xs uppercase font-semibold text-gray-800 text-right">
      {value}
    </span>
  </div>
);

export default BBPSStatus;

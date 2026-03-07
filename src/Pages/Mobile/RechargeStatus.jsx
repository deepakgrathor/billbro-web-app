// import React, { useEffect, useState } from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useLocation, useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";
// import SuccessLottie from "../../assets/Lotties/success.json";
// import PendingLottie from "../../assets/Lotties/pending.json";
// import { BRAND_NAME } from "../../Utils/Constant";
// import dayjs from "dayjs";
// import BottomSheet from "../../Components/BottomSheet";
// import PlayStoreRating from "../../Components/PlayStoreRating";
// import { FaHome } from "react-icons/fa";

// const RechargeStatus = (route) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [content, setContent] = useState();
//   const [open, setOpen] = useState(false);
//   const data = location.state;
//   useEffect(() => {
//     if (data.status === "SUCCESS") {
//       const timer = setTimeout(() => {
//         setContent(PlayStoreRating);
//         setOpen(true);
//       }, 1000);

//       // Cleanup - component unmount hone par timer cancel ho jaye
//       return () => clearTimeout(timer);
//     }
//   }, [data?.status]); // dependency array mein data.status add kiya
//   return (
//     <>
//       <div className="bg-white min-h-screen flex flex-col">
//         <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
//           <CommonHeader
//             title={"Transaction Details"}
//             handleclick={() => navigate("/")}
//           />
//         </div>
//         <div className="flex-1 mt-14 overflow-y-auto">
//           <div className="px-4 my-6">
//             <div className="flex flex-col items-center justify-center">
//               <Lottie
//                 style={{ width: 100 }}
//                 animationData={
//                   data.status === "SUCCESS" ? SuccessLottie : PendingLottie
//                 }
//                 loop={true}
//               />
//               <p className="font-semibold uppercase">Recharge {data.status}</p>
//               <p className="text-xs text-gray-500 mt-1">
//                 Your request has been successfully done.
//               </p>
//               <p className="text-xs text-gray-500 mt-2">
//                 {dayjs().format("DD MMM YYYY, hh:mm A")}
//               </p>
//             </div>
//             <div className=" my-8 border-t border-gray-200 pt-6">
//               <div className="bg-gray-100/50 border-gray-100 border p-3 px-4  rounded-t-xl rounded-b-xl">
//                 <div className="">
//                   <h2 className="text-sm font-normal">Amount</h2>
//                   <p className="text-2xl font-bold mt-1">₹{data.amount}</p>
//                 </div>
//                 <div className="border my-4 border-gray-200 border-dashed"></div>
//                 <div className="">
//                   <h2 className="text-xs font-normal">Operator Ref. No.</h2>
//                   <p className="text-sm font-bold mt-1">{data.OP_REF}</p>
//                 </div>
//                 <div className="border my-4 border-gray-200 border-dashed"></div>
//                 <div className="">
//                   <h2 className="text-xs font-normal">Transaction ID</h2>
//                   <p className="text-sm font-bold mt-1">{data.transactionId}</p>
//                 </div>
//                 <div className="border my-4 border-gray-200 border-dashed"></div>
//                 <div className="">
//                   <h2 className="text-xs font-normal">Number</h2>
//                   <p className="text-sm font-bold mt-1">{data.MobileNumber}</p>
//                 </div>
//                 <div className="border my-4 border-gray-200 border-dashed"></div>
//                 <div className="">
//                   <h2 className="text-xs font-normal">Payment Method</h2>
//                   <p className="text-sm font-bold mt-1">UPI</p>
//                 </div>
//                 <div className="border my-4 border-gray-200 border-dashed"></div>
//                 <div className="">
//                   <h2 className="text-xs font-normal">Paid To</h2>
//                   <p className="text-sm font-bold mt-1">{BRAND_NAME}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="fixed bottom-4 space-y-2 left-0 w-full px-4">
//             <button
//               onClick={() => navigate("/")}
//               className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors mt-3"
//             >
//               <FaHome className="w-5 h-5" />
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>

//     </>
//   );
// };

// export default RechargeStatus;
import React, { useEffect, useState, useCallback, useMemo } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SuccessLottie from "../../assets/Lotties/success.json";
import PendingLottie from "../../assets/Lotties/pending.json";
import { BRAND_NAME } from "../../Utils/Constant";
import dayjs from "dayjs";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";
import {
  FaHome,
  FaCheckCircle,
  FaClock,
  FaReceipt,
  FaDownload,
  FaShare,
} from "react-icons/fa";
import { MdContentCopy, MdCheck, MdInfo } from "react-icons/md";
import { handleCopy } from "../../Utils/CommonFunc";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { useDispatch } from "react-redux";

const RechargeStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const data = location.state;

  // ✅ OPTIMIZATION: Memoized status check
  const isSuccess = useMemo(
    () => data?.status?.toUpperCase() === "SUCCESS",
    [data?.status],
  );

  // ✅ OPTIMIZATION: Memoized status config
  const statusConfig = useMemo(() => {
    if (isSuccess) {
      return {
        lottie: SuccessLottie,
        icon: FaCheckCircle,
        color: "from-green-500 to-emerald-600",
        bg: "from-green-50 to-emerald-50",
        textColor: "text-green-700",
        title: "Recharge Successful!",
        subtitle: "Your recharge has been completed successfully",
      };
    }

    return {
      lottie: PendingLottie,
      icon: FaClock,
      color: "from-amber-500 to-orange-600",
      bg: "from-amber-50 to-orange-50",
      textColor: "text-amber-700",
      title: "Recharge Pending",
      subtitle: "Your recharge is being processed",
    };
  }, [isSuccess]);

  // ✅ OPTIMIZATION: Memoized copy handler
  const handleCopyText = useCallback((text, field) => {
    if (!text) return;
    handleCopy(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  }, []);

  // ✅ OPTIMIZATION: Memoized transaction details
  const transactionDetails = useMemo(
    () => [
      {
        label: "Amount",
        value: `₹${data?.amount || 0}`,
        icon: "💰",
        highlight: true,
        copyable: false,
      },
      {
        label: "Operator Ref. No.",
        value: data?.OP_REF || "N/A",
        icon: "🔖",
        copyable: true,
        field: "opRef",
      },
      {
        label: "Transaction ID",
        value: data?.transactionId || "N/A",
        icon: "📝",
        copyable: true,
        field: "txnId",
      },
      {
        label: "Mobile Number",
        value: data?.MobileNumber || "N/A",
        icon: "📱",
        copyable: true,
        field: "mobile",
      },
      {
        label: "Payment Method",
        value: "WALLET",
        icon: "💳",
        copyable: false,
      },
    ],
    [data],
  );

  // Show rating after success
  useEffect(() => {
    if (!isSuccess) return;

    const timer = setTimeout(() => {
      setOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isSuccess]);

  // ✅ FIX: Redirect if no data
  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) return null;

  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20">
        <CommonHeader
          title={"Transaction Details"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 px-4 max-w-2xl mx-auto">
        {/* Status Card */}
        <div className="mb-6 animate-slideUp">
          <div
            className={`bg-gradient-to-br ${statusConfig.bg} rounded-3xl p-6 border-2 ${
              isSuccess ? "border-green-200" : "border-amber-200"
            } shadow-2xl relative overflow-hidden`}
          >
            {/* Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>

            <div className="relative flex flex-col items-center text-center">
              {/* Lottie Animation */}
              <div className="mb-4">
                <Lottie
                  style={{ width: 120, height: 120 }}
                  animationData={statusConfig.lottie}
                  loop={true}
                />
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 bg-gradient-to-r ${statusConfig.color} px-5 py-2 rounded-full shadow-lg mb-3`}
              >
                <StatusIcon className="text-white text-lg" />
                <span className="text-white font-black text-sm uppercase">
                  {data.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2
                className={`text-2xl font-black ${statusConfig.textColor} mb-2`}
              >
                {statusConfig.title}
              </h2>
              <p className="text-sm text-gray-600 font-medium mb-3">
                {statusConfig.subtitle}
              </p>

              {/* Timestamp */}
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl">
                <span className="text-xs text-gray-600 font-semibold">
                  {dayjs().format("DD MMM YYYY, hh:mm A")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details Card */}
        <div className="mb-6 animate-slideUp animation-delay-200">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <div className="flex items-center gap-2">
                <FaReceipt className="text-white text-lg" />
                <h3 className="text-white font-black text-base">
                  Transaction Details
                </h3>
              </div>
            </div>

            {/* Details List */}
            <div className="p-5 space-y-3">
              {transactionDetails.map((detail, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    detail.highlight
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        detail.highlight ? "bg-purple-100" : "bg-gray-200"
                      }`}
                    >
                      {detail.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 font-semibold mb-1">
                        {detail.label}
                      </p>
                      <p
                        className={`font-bold break-all ${
                          detail.highlight
                            ? "text-2xl text-purple-700"
                            : "text-sm text-gray-900"
                        }`}
                      >
                        {detail.value}
                      </p>
                    </div>
                  </div>

                  {detail.copyable && detail.value !== "N/A" && (
                    <button
                      onClick={() => handleCopyText(detail.value, detail.field)}
                      className="flex-shrink-0 p-2 hover:bg-purple-100 rounded-xl transition-colors ml-2"
                    >
                      {copied === detail.field ? (
                        <MdCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <MdContentCopy className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        {!isSuccess && (
          <div className="mb-6 animate-slideUp animation-delay-400">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdInfo className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 mb-1">
                    Processing Your Request
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Your recharge is being processed. This usually takes a few
                    moments. You'll receive a confirmation once it's complete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 z-40 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* Share & Download Buttons */}
          {/* <div className="grid grid-cols-2 gap-3">
            <button
            
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
            >
              <FaShare className="w-4 h-4" />
              Share
            </button>
            <button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
            >
              <FaDownload className="w-4 h-4" />
              Download
            </button>
          </div> */}

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white py-3.5 rounded-xl font-black transition-all active:scale-95 shadow-lg"
          >
            <FaHome className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Bottom Sheet for Rating */}
      {open && (
        <BottomSheet open={open} setOpen={setOpen}>
          <PlayStoreRating />
        </BottomSheet>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RechargeStatus;

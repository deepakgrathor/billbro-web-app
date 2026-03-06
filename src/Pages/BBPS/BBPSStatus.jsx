// import React, { useEffect, useRef, useState } from "react";
// import { BsCheck, BsClock, BsCopy, BsXCircle } from "react-icons/bs";
// import { FaCheckCircle, FaHome } from "react-icons/fa";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import CommonHeader from "../../Components/CommonHeader";
// import BottomSheet from "../../Components/BottomSheet";
// import PlayStoreRating from "../../Components/PlayStoreRating";
// import { handleCopy } from "../../Utils/CommonFunc";

// const BBPSStatus = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const receiptRef = useRef(null);
//   const [copied, setCopied] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [content, setContent] = useState();
//   const data = location.state;

//   const responseData = {
//     MobileNumber: data.MobileNumber,
//     Operator_Code: data.Operator_Code,
//     amount: data.amount,
//     transactionId: data.transactionId,
//     status: data.status?.toLowerCase(),
//     type: data.type,
//     OP_REF: data.OP_REF,
//     timestamp: new Date().toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }),
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       success: {
//         icon: FaCheckCircle,
//         color: "text-green-600",
//         iconBg: "bg-green-500",
//         gradient: "from-green-50 to-emerald-100",
//         message: "Payment Successful!",
//         subMessage: "Your bill payment has been processed successfully",
//       },
//       pending: {
//         icon: BsClock,
//         color: "text-yellow-600",
//         iconBg: "bg-yellow-500",
//         gradient: "from-yellow-50 to-amber-100",
//         message: "Payment Pending",
//         subMessage:
//           "Your payment is being processed. You'll be notified once confirmed.",
//       },
//       failed: {
//         icon: BsXCircle,
//         color: "text-red-600",
//         iconBg: "bg-red-500",
//         gradient: "from-red-50 to-rose-100",
//         message: "Payment Failed",
//         subMessage:
//           "Your payment could not be processed. Amount refunded to wallet.",
//       },
//     };
//     return configs[status] || configs.pending;
//   };

//   const statusConfig = getStatusConfig(responseData.status);
//   const StatusIcon = statusConfig.icon;

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   useEffect(() => {
//     if (
//       data.status === "SUCCESS" ||
//       data.status === "success" ||
//       data.status === "Success"
//     ) {
//       const timer = setTimeout(() => {
//         setContent(PlayStoreRating);
//         setOpen(true);
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [data?.status]);

//   return (
//     <>
//       <div className="fixed top-0 left-0 right-0 z-50">
//         <CommonHeader
//           title="Transaction Details"
//           handleclick={() => navigate("/")}
//         />
//       </div>

//       <div
//         ref={receiptRef}
//         className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 pt-16"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full max-w-md"
//         >
//           <motion.div
//             layout
//             className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden"
//           >
//             {/* Animated Header */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2 }}
//               className={`bg-gradient-to-br ${statusConfig.gradient} px-6 py-10 text-center`}
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 120 }}
//                 className={`${statusConfig.iconBg} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg`}
//               >
//                 <StatusIcon className="w-10 h-10 text-white" />
//               </motion.div>

//               <h1 className={`text-xl font-bold mt-4 ${statusConfig.color}`}>
//                 {statusConfig.message}
//               </h1>
//               <p className="text-gray-600 text-xs mt-1">
//                 {statusConfig.subMessage}
//               </p>
//             </motion.div>

//             {/* Amount */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-purple-50 py-5 text-center"
//             >
//               <p className="text-gray-600 text-sm">Amount Paid</p>
//               <h2 className="text-4xl font-bold text-gray-800 mt-1">
//                 ₹{responseData.amount}
//               </h2>
//             </motion.div>

//             {/* Transaction Details */}
//             <div className="p-6 space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between"
//               >
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">
//                     {data.type === "BBPS" ? "Transaction ID" : "Redeem Code"}
//                   </p>
//                   <p className="text-sm font-semibold text-gray-800 break-all">
//                     {data.type === "BBPS"
//                       ? responseData.transactionId
//                       : responseData.OP_REF}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() =>
//                     handleCopy(
//                       data.type === "BBPS"
//                         ? responseData.transactionId
//                         : responseData.OP_REF
//                     )
//                   }
//                   className="ml-3 p-2 hover:bg-gray-200 rounded-lg"
//                 >
//                   {copied ? (
//                     <BsCheck className="w-5 h-5 text-green-600" />
//                   ) : (
//                     <BsCopy className="w-5 h-5 text-gray-600" />
//                   )}
//                 </button>
//               </motion.div>

//               <div className="space-y-3">
//                 {data.type !== "BBPS" && (
//                   <DetailRow
//                     label="Transaction ID"
//                     value={responseData.transactionId}
//                   />
//                 )}
//                 <DetailRow
//                   label="Consumer Number"
//                   value={responseData.MobileNumber}
//                 />
//                 <DetailRow
//                   label="Operator"
//                   value={responseData.Operator_Code}
//                 />
//                 <DetailRow
//                   label="Operator Reference"
//                   value={responseData.OP_REF}
//                 />
//                 <DetailRow label="Date & Time" value={responseData.timestamp} />
//               </div>

//               <div className="border-t border-dashed border-gray-300 my-6"></div>

//               <motion.button
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => navigate("/")}
//                 className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
//               >
//                 <FaHome className="w-5 h-5" />
//                 Back to Home
//               </motion.button>
//             </div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="bg-purple-50 text-center py-4 border-t border-gray-200"
//             >
//               <p className="text-xs text-gray-600">
//                 {responseData.status === "success"
//                   ? "✅ This is a computer generated receipt"
//                   : responseData.status === "pending"
//                   ? "⏳ You will receive a confirmation once payment is processed"
//                   : "❌ For any issues, please contact support"}
//               </p>
//             </motion.div>
//           </motion.div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center text-sm text-gray-600 mt-4"
//           >
//             Need help?{" "}
//             <span
//               onClick={() => navigate("/contact")}
//               className="text-indigo-600 font-semibold cursor-pointer hover:underline"
//             >
//               Contact Support
//             </span>
//           </motion.p>
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {open && (
//           <BottomSheet
//             content={content}
//             isOpen={open}
//             setIsOpen={setOpen}
//             bottomButton={false}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// const DetailRow = ({ label, value }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 8 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.2 }}
//     className="flex justify-between items-center py-2 border-b border-gray-100 last:border-none"
//   >
//     <span className="text-[10px] text-gray-600">{label}</span>
//     <span className="text-[10px] font-semibold text-gray-800 text-right uppercase">
//       {value}
//     </span>
//   </motion.div>
// );

// export default BBPSStatus;
import React, { useEffect, useRef, useState } from "react";
import {
  BsCheck,
  BsClock,
  BsCopy,
  BsXCircle,
  BsDownload,
} from "react-icons/bs";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CommonHeader from "../../Components/CommonHeader";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";
import { handleCopy } from "../../Utils/CommonFunc";
import html2canvas from "html2canvas";

const BBPSStatus = () => {
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [soundWaveActive, setSoundWaveActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef(null);
  const [copied, setCopied] = useState("");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const data = location.state;

  const responseData = {
    MobileNumber: data.MobileNumber,
    Operator_Code: data.Operator_Code,
    amount: data.amount,
    transactionId: data.transactionId,
    bharatConnectTxnId: data.bharatConnectTxnId || `BC${Date.now()}`,
    consumerConvenienceFee: data.ccf || 0,
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
        color: "text-emerald-600",
        iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
        gradient: "from-emerald-500 via-green-500 to-teal-600",
        bgPattern: "from-emerald-50 via-green-50 to-teal-50",
        message: "PAYMENT SUCCESSFUL",
        subMessage: "Your payment has been processed successfully",
        showBAssured: true,
      },
      pending: {
        icon: BsClock,
        color: "text-amber-600",
        iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
        gradient: "from-amber-500 via-yellow-500 to-orange-600",
        bgPattern: "from-amber-50 via-yellow-50 to-orange-50",
        message: "PAYMENT PENDING",
        subMessage: "Processing your payment, please wait...",
        showBAssured: false,
      },
      failed: {
        icon: BsXCircle,
        color: "text-red-600",
        iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
        gradient: "from-red-500 via-rose-500 to-pink-600",
        bgPattern: "from-red-50 via-rose-50 to-pink-50",
        message: "PAYMENT FAILED",
        subMessage: "Amount refunded to your wallet",
        showBAssured: false,
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(responseData.status);
  const StatusIcon = statusConfig.icon;

  const handleCopyWithFeedback = (text, field) => {
    handleCopy(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `receipt-${responseData.bharatConnectTxnId}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  useEffect(() => {
    if (responseData.status === "success") {
      const timer = setTimeout(() => {
        setContent(PlayStoreRating);
        setOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [responseData.status]);

  // ============================================
  // 🔊 SONIC BRANDING AUDIO (NPCI GUIDELINE)
  // Plays SIMULTANEOUSLY with B Assured logo display
  // ============================================
  useEffect(() => {
    if (responseData.status === "success") {
      try {
        audioRef.current = new Audio();

        // Set source - TRY MULTIPLE PATHS
        const audioPath = "/src/assets/sonic-brand.mp3";
        audioRef.current.src = audioPath;

        audioRef.current.volume = 1;
        audioRef.current.preload = "auto";

        audioRef.current.addEventListener("play", () => {
          setSoundWaveActive(true);
        });

        audioRef.current.addEventListener("ended", () => {
          setSoundWaveActive(false);
        });

        audioRef.current.addEventListener("error", (e) => {
          console.error("❌ Audio error:", e.target.error.code);
        });
      } catch (error) {
        console.error("❌ Audio init failed:", error);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  // Play audio after B Assured logo animates in
  useEffect(() => {
    if (responseData.status === "success" && !audioPlayed && audioRef.current) {
      const playTimer = setTimeout(() => {
        playAudio();
      }, 800); // Sync with logo animation
      return () => clearTimeout(playTimer);
    }
  }, [responseData.status, audioPlayed]);

  const playAudio = async () => {
    if (!audioRef.current || audioPlayed) return;

    try {
      await audioRef.current.play();
      setAudioPlayed(true);
      setShowPlayButton(false);
    } catch (error) {
      console.warn("⚠️ Autoplay blocked:", error.name);
      if (error.name === "NotAllowedError") {
        setShowPlayButton(true);
        setTimeout(() => setShowPlayButton(false), 10000);
      }
    }
  };

  const rightDesign = () => (
    <img
      width={70}
      height={30}
      src="https://ik.imagekit.io/43tomntsa/images__1_-removebg-preview.png"
      alt="Bharat Connect"
      // className="h-8 w-auto"
    />
  );

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
        <CommonHeader
          title="Payment Successful"
          handleclick={() => navigate("/")}
          // rightDesign={rightDesign}
        />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-3 sm:p-4 md:p-6 pt-20 sm:pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="w-full max-w-lg mx-auto"
        >
          {/* Receipt Card */}
          <motion.div
            ref={receiptRef}
            layout
            className="bg-white shadow-2xl rounded-3xl sm:rounded-[2rem] border-2 border-gray-200 overflow-hidden"
          >
            {/* Status Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`relative bg-gradient-to-br ${statusConfig.bgPattern} px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-14 text-center overflow-hidden`}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.05, 0.2],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"
                />
              </div>

              {/* Success: B Assured Logo + Sonic Branding */}
              {statusConfig.showBAssured ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                  }}
                  className="relative z-10"
                >
                  {/* B Assured Logo Container */}
                  <div className="w-40 h-40 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-1 relative">
                    <img
                      src="https://ik.imagekit.io/43tomntsa/B%20Assured%20Logo_SVG.svg"
                      alt="B Assured"
                      className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                    />
                    {/* Pulsating Rings */}
                    {/* {[0.5].map((delay) => (
                      <motion.div
                        key={delay}
                        animate={{
                          scale: [1.4],
                          opacity: [0.6, 0, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay,
                        }}
                        className="absolute inset-0 rounded-full border-4 border-emerald-400"
                      />
                    ))} */}
                  </div>

                  {/* Sound Wave Indicator (when audio plays) */}
                  {soundWaveActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center gap-1 mb-3"
                    >
                      {[0, 0.1, 0.2, 0.3].map((delay) => (
                        <motion.div
                          key={delay}
                          animate={{
                            height: ["12px", "24px", "12px"],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay,
                          }}
                          className="w-1 bg-emerald-600 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}

                  {/* Manual Play Button (if autoplay blocked) */}
                  <AnimatePresence>
                    {showPlayButton && (
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={playAudio}
                        className="mb-4 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-2 mx-auto"
                      >
                        <span className="text-lg">🔊</span>
                        <span className="text-sm font-semibold text-gray-700">
                          Tap to Play Sound
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Success Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="inline-block"
                  >
                    <div className="bg-white/95 backdrop-blur-md px-6 py-3 sm:px-8 sm:py-3.5 rounded-full shadow-2xl mb-2">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent tracking-tight">
                        {statusConfig.message}
                      </h1>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm font-semibold mt-3 px-4">
                      {statusConfig.subMessage}
                    </p>
                    {/* <p className="text-gray-500 text-[10px] sm:text-xs mt-1.5">
                      Secured by BBPS (NPCI)
                    </p> */}
                  </motion.div>
                </motion.div>
              ) : (
                // Pending/Failed Icon
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                  className="relative z-10"
                >
                  <div
                    className={`${statusConfig.iconBg} w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl`}
                  >
                    <StatusIcon className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  </div>
                  <h1
                    className={`text-2xl sm:text-3xl font-black mt-5 ${statusConfig.color} tracking-tight`}
                  >
                    {statusConfig.message}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm font-medium mt-2 px-4">
                    {statusConfig.subMessage}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Amount Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`relative bg-gradient-to-r ${statusConfig.gradient} py-5 sm:py-6 text-center overflow-hidden`}
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-wider relative z-10">
                Total Amount Paid
              </p>
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-white mt-1 tracking-tighter drop-shadow-lg relative z-10"
              >
                ₹{responseData.amount}
              </motion.h2>
            </motion.div>

            {/* Transaction Details */}
            <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              {/* B-Connect ID - Highlighted */}
              {/* <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">
                      B-Connect Txn ID
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base font-mono font-black text-white break-all">
                      {responseData.OP_REF}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        handleCopyWithFeedback(responseData.OP_REF, "bconnect")
                      }
                      className="flex-shrink-0 p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl"
                    >
                      {copied === "bconnect" ? (
                        <BsCheck className="w-5 h-5 text-white" />
                      ) : (
                        <BsCopy className="w-5 h-5 text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div> */}

              {/* Transaction ID */}
              {/* <DetailCard delay={0.7}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] sm:text-xs text-gray-900 font-bold uppercase tracking-wider mb-1">
                      B-Connect Txn ID
                    </p>
                    <p className="text-xs sm:text-sm font-mono font-bold text-gray-900 break-all">
                      {responseData.OP_REF}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      handleCopyWithFeedback(responseData.OP_REF, "bconnect")
                    }
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-xl"
                  >
                    {copied === "bconnect" ? (
                      <BsCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <BsCopy className="w-5 h-5 text-gray-600" />
                    )}
                  </motion.button>
                </div>
              </DetailCard> */}

              {/* Info Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm"
              >
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <h3 className="text-[12px] sm:text-xs font-black text-gray-900 uppercase tracking-widest">
                    Transaction Details
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  <InfoRow
                    label="B-Connect Txn ID"
                    value={responseData.OP_REF}
                    handleCopyWithFeedback={() =>
                      handleCopyWithFeedback(responseData.OP_REF, "bconnect")
                    }
                    copied={copied}
                    copyField="bconnect"
                  />
                  <InfoRow
                    label="CCF (Customer Convenience Fee)"
                    value={`₹0`}
                  />
                  <InfoRow
                    label="Transaction ID"
                    value={responseData.transactionId}
                  />

                  <InfoRow
                    label="Consumer Number"
                    value={responseData.MobileNumber}
                  />
                  <InfoRow
                    label="Biller Name"
                    value={responseData.Operator_Code}
                  />
                  <InfoRow
                    label="Operator Ref"
                    value={responseData.OP_REF || "N/A"}
                  />
                  <InfoRow
                    label="Bill Amount"
                    value={`₹${
                      responseData.amount - responseData.consumerConvenienceFee
                    }`}
                  />
                  {/* <InfoRow label="CCF" value={`₹${responseData.consumerConvenienceFee}`} highlight /> */}
                  <InfoRow label="Payment Mode" value="Wallet" />
                  <InfoRow label="Date & Time" value={responseData.timestamp} />
                  <InfoRow
                    label="Status"
                    value={responseData.status.toUpperCase()}
                    status={responseData.status}
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-2 gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={downloadReceipt}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <BsDownload className="w-4 h-4" />
                  <span className="hidden xs:inline">Download</span>
                  <span className="xs:hidden">Save</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-200 text-sm sm:text-base"
                >
                  <FaHome className="w-4 h-4" />
                  Home
                </motion.button>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-gradient-to-r from-slate-50 to-gray-50 text-center py-4 border-t-2 border-gray-100"
            >
              <p className="text-[10px] sm:text-xs text-gray-600 px-4 leading-relaxed">
                {responseData.status === "success"
                  ? "✅ Computer generated receipt. No signature required."
                  : responseData.status === "pending"
                  ? "⏳ Confirmation will be sent once processed"
                  : "❌ Contact support with B-Connect Txn ID"}
              </p>
            </motion.div>
          </motion.div>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-5 sm:mt-6 text-center px-4"
          >
            <p className="text-xs sm:text-sm text-gray-600">
              Need help?{" "}
              <span
                onClick={() => navigate("/contact")}
                className="text-indigo-600 font-bold cursor-pointer hover:underline"
              >
                Contact Support
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Rating Sheet */}
      {/* <AnimatePresence>
        {open && (
          <BottomSheet
            content={content}
            isOpen={open}
            setIsOpen={setOpen}
            bottomButton={false}
          />
        )}
      </AnimatePresence> */}
    </>
  );
};

// Detail Card Component
const DetailCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow"
  >
    {children}
  </motion.div>
);

// Info Row Component
const InfoRow = ({
  label,
  value,
  highlight,
  status,
  handleCopyWithFeedback,
  copied,
  copyField, // 👈 Add this prop
}) => {
  const getStatusBadge = (status) => {
    const badges = {
      success: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      failed: "bg-red-100 text-red-700 border-red-200",
    };
    return badges[status] || "";
  };

  return (
    <div
      className={`flex w-full items-center justify-between gap-3 px-3 sm:px-4 py-2.5 sm:py-3 ${
        highlight ? "bg-blue-50/50" : ""
      }`}
    >
      <span className="text-[12px] sm:text-xs text-gray-900 font-bold flex-shrink-0">
        {label}
      </span>
      <div className="flex items-center gap-2 min-w-0 justify-end">
        <span
          className={`text-[11px] sm:text-xs font-bold text-right break-all ${
            status
              ? `px-2 sm:px-3 py-1 rounded-lg border-2 ${getStatusBadge(
                  status
                )}`
              : highlight
              ? "text-blue-700"
              : "text-gray-500"
          }`}
        >
          {value}
        </span>
        {handleCopyWithFeedback && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyWithFeedback}
            className="flex-shrink-0 hover:bg-gray-100 rounded-xl"
          >
            {copied === copyField ? ( // 👈 Dynamic check
              <BsCheck className="w-4 h-4 text-green-600" />
            ) : (
              <BsCopy className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default BBPSStatus;

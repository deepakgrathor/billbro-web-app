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

// 🎵 Sonic Branding Component (NPCI Guideline - Page 22)
// const SonicBranding = () => {
//   useEffect(() => {
//     const audio = new Audio("/src/assets/sonic-brand.mp3");
//     console.log(audio, "audio")
//     audio.play().catch((err) => console.log("Audio playback prevented:", err));

//     return () => {
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, []);

//   return null;
// };

const BBPSStatus = () => {
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [showReceipt, setShowReceipt] = useState(false);
  const data = location.state;

  const responseData = {
    MobileNumber: data.MobileNumber,
    Operator_Code: data.Operator_Code,
    amount: data.amount,
    transactionId: data.transactionId,
    bharatConnectTxnId: data.bharatConnectTxnId || `BC${Date.now()}`, // B-Connect Txn ID (MANDATORY)
    consumerConvenienceFee: data.ccf || 0, // CCF (MANDATORY)
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
        iconBg: "bg-gradient-to-br from-green-400 to-emerald-600",
        gradient: "from-green-50 via-emerald-50 to-teal-50",
        message: "Payment Successful!",
        subMessage: "Your bill payment has been processed successfully",
        showBAssured: true, // Show B Assured logo for success
      },
      pending: {
        icon: BsClock,
        color: "text-amber-600",
        iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
        gradient: "from-yellow-50 via-amber-50 to-orange-50",
        message: "Payment Pending",
        subMessage:
          "Your payment is being processed. You'll be notified once confirmed.",
        showBAssured: false,
      },
      failed: {
        icon: BsXCircle,
        color: "text-red-600",
        iconBg: "bg-gradient-to-br from-red-400 to-rose-600",
        gradient: "from-red-50 via-rose-50 to-pink-50",
        message: "Payment Failed",
        subMessage:
          "Your payment could not be processed. Amount refunded to wallet.",
        showBAssured: false,
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(responseData.status);
  const StatusIcon = statusConfig.icon;

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `receipt-${responseData.bharatConnectTxnId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
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
      }, 3000); // Increased delay for sonic branding
      return () => clearTimeout(timer);
    }
  }, [data?.status]);

  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={60}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt=""
        />
      </div>
    );
  };
  // ============================================
  // 🔊 FIXED AUDIO IMPLEMENTATION
  // ============================================

  // Initialize audio ONCE on mount
  useEffect(() => {
    // Only initialize if success status
    if (responseData.status === "success") {
      try {
        // Create audio element
        audioRef.current = new Audio();

        // Set source - TRY MULTIPLE PATHS
        const audioPath = "/src/assets/sonic-brand.mp3";
        audioRef.current.src = audioPath;

        // Audio properties
        audioRef.current.volume = 0.7;
        audioRef.current.preload = "auto";

        // Event listeners
        audioRef.current.addEventListener("loadeddata", () => {
          console.log("✅ Audio file loaded successfully");
        });

        audioRef.current.addEventListener("canplay", () => {
          console.log("✅ Audio ready to play");
        });

        audioRef.current.addEventListener("play", () => {
          setIsPlaying(true);
          console.log("▶️ Audio playing");
        });

        audioRef.current.addEventListener("ended", () => {
          setIsPlaying(false);
          console.log("⏹️ Audio ended");
        });

        audioRef.current.addEventListener("error", (e) => {
          console.error("❌ Audio error:", {
            code: e.target.error.code,
            message: e.target.error.message,
            path: audioPath,
          });

          // Error codes:
          // 1 = MEDIA_ERR_ABORTED
          // 2 = MEDIA_ERR_NETWORK
          // 3 = MEDIA_ERR_DECODE
          // 4 = MEDIA_ERR_SRC_NOT_SUPPORTED

          if (e.target.error.code === 4) {
            console.error("💡 File not found or format not supported");
            console.error(
              "💡 Check: public/assets/bharat-connect/sonic-brand.mp3"
            );
          }
        });

        console.log("🔊 Audio initialized:", audioPath);
      } catch (error) {
        console.error("❌ Audio initialization failed:", error);
      }
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        // Remove all event listeners
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load(); // This stops any ongoing loading
        audioRef.current = null;
      }
    };
  }, []); // Run ONCE on mount

  // Play audio after component is stable
  useEffect(() => {
    if (responseData.status === "success" && !audioPlayed && audioRef.current) {
      // Wait for component to fully render
      const playTimer = setTimeout(() => {
        playAudio();
      }, 1000); // 1 second delay

      return () => clearTimeout(playTimer);
    }
  }, [responseData.status, audioPlayed]);

  const playAudio = async () => {
    if (!audioRef.current || audioPlayed) {
      console.log("⏭️ Audio already played or not initialized");
      return;
    }

    try {
      // Check if audio is ready
      if (audioRef.current.readyState < 2) {
        console.log("⏳ Audio not ready yet, waiting...");

        // Wait for audio to be ready
        await new Promise((resolve) => {
          audioRef.current.addEventListener("canplay", resolve, { once: true });
          // Timeout after 3 seconds
          setTimeout(resolve, 3000);
        });
      }

      // Attempt to play
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        await playPromise;
        setAudioPlayed(true);
        setShowPlayButton(false);
        console.log("✅ Audio played successfully");
      }
    } catch (error) {
      console.warn("⚠️ Audio play prevented:", error.name, error.message);

      if (error.name === "NotAllowedError") {
        // Browser blocked autoplay
        console.log("💡 Autoplay blocked - showing manual play button");
        setShowPlayButton(true);

        // Auto-hide button after 8 seconds
        setTimeout(() => {
          setShowPlayButton(false);
        }, 8000);
      } else if (error.name === "NotSupportedError") {
        console.error("💡 Audio file not found or unsupported format");
        console.error(
          "💡 Expected path: public/assets/bharat-connect/sonic-brand.mp3"
        );
      } else if (error.name === "AbortError") {
        // Play interrupted - ignore this error
        console.log("⚠️ Play interrupted (harmless)");
      }
    }
  };

  // ============================================
  // END AUDIO IMPLEMENTATION
  // ============================================

  return (
    <>
      {/* Play Sonic Branding on Success (NPCI Guideline) */}
      {/* {statusConfig.showBAssured && <SonicBranding />} */}

      <div className="fixed top-0 left-0 right-0 z-50">
        <CommonHeader
          title="Transaction Details"
          handleclick={() => navigate("/")}
          rightDesign={rightDesign}
        />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          <motion.div
            ref={receiptRef}
            layout
            className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden relative"
          >
            {/* Bharat Connect Logo - Top Right (NPCI Guideline - Stage 2) */}
            {/* <div className="absolute top-4 right-4 z-10">
              <img
                src="/assets/bharat-connect/bharat-connect-logo.png"
                alt="Bharat Connect"
                className="h-8 w-auto opacity-90"
              />
            </div> */}

            {/* Status Header with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`relative bg-gradient-to-br ${statusConfig.gradient} px-6 py-12 text-center overflow-hidden`}
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>

              {/* Success: B Assured Logo (NPCI Guideline - Stage 3, Page 19-20) */}
              {statusConfig.showBAssured ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 120,
                    damping: 15,
                  }}
                  className="relative z-10"
                >
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <img
                      src="https://ik.imagekit.io/43tomntsa/B%20Assured%20Logo_SVG.svg"
                      alt="B Assured"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                    {/* Pulsating Ring Effect */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full border-4 border-green-400"
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="inline-block px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg mb-2">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        PAYMENT SUCCESSFUL
                      </h1>
                    </div>
                    <p className="text-gray-700 text-sm font-medium mt-2 px-4">
                      {statusConfig.subMessage}
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                // Pending/Failed: Standard Icon
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="relative z-10"
                >
                  <div
                    className={`${statusConfig.iconBg} w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl`}
                  >
                    <StatusIcon className="w-12 h-12 text-white" />
                  </div>

                  <h1
                    className={`text-2xl font-bold mt-4 ${statusConfig.color}`}
                  >
                    {statusConfig.message}
                  </h1>
                  <p className="text-gray-600 text-sm mt-2 px-4">
                    {statusConfig.subMessage}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Amount Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-6 text-center"
            >
              <p className="text-white/80 text-sm font-medium">
                Total Amount Paid
              </p>
              <h2 className="text-5xl font-black text-white mt-1 tracking-tight">
                ₹{responseData.amount}
              </h2>
            </motion.div>

            {/* Transaction Details Card */}
            <div className="p-6 space-y-4">
              {/* B-Connect Transaction ID - Highlighted (MANDATORY - Page 23) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        B-Connect Txn ID
                      </span>
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full font-semibold">
                        BBPS
                      </span>
                    </div>
                    <p className="text-sm font-mono font-bold text-gray-800 break-all">
                      {responseData.OP_REF}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(responseData.bharatConnectTxnId)}
                    className="ml-3 p-2.5 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    {copied ? (
                      <BsCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <BsCopy className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Transaction ID / Redeem Code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">
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
                    className="ml-3 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <BsCopy className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </motion.div>

              {/* Detailed Information */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Transaction Details
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {data.type !== "BBPS" && (
                    <DetailRow
                      label="Transaction ID"
                      value={responseData.transactionId}
                    />
                  )}
                  <DetailRow
                    label="Consumer Number"
                    value={responseData.MobileNumber}
                    highlight
                  />
                  <DetailRow
                    label="Biller Name"
                    value={responseData.Operator_Code}
                  />
                  <DetailRow
                    label="Operator Reference"
                    value={responseData.OP_REF || "N/A"}
                  />
                  <DetailRow
                    label="Bill Amount"
                    value={`₹${
                      responseData.amount - responseData.consumerConvenienceFee
                    }`}
                  />
                  {/* Consumer Convenience Fee (MANDATORY - Page 23) */}
                  {responseData.consumerConvenienceFee > 0 && (
                    <DetailRow
                      label="Consumer Convenience Fee"
                      value={`₹${responseData.consumerConvenienceFee}`}
                      highlight
                    />
                  )}
                  <DetailRow label="Payment Mode" value="Wallet" />
                  <DetailRow
                    label="Date & Time"
                    value={responseData.timestamp}
                  />
                  <DetailRow
                    label="Status"
                    value={responseData.status.toUpperCase()}
                    status={responseData.status}
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-3 pt-2"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadReceipt}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <BsDownload className="w-4 h-4" />
                  Download
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  <FaHome className="w-4 h-4" />
                  Home
                </motion.button>
              </motion.div>
            </div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-slate-50 to-gray-50 text-center py-4 border-t border-gray-200"
            >
              <p className="text-xs text-gray-600 px-4">
                {responseData.status === "success"
                  ? "✅ This is a computer generated receipt. No signature required."
                  : responseData.status === "pending"
                  ? "⏳ You will receive a confirmation once payment is processed"
                  : "❌ For any issues, please contact support with B-Connect Txn ID"}
              </p>
            </motion.div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <span
                onClick={() => navigate("/contact")}
                className="text-indigo-600 font-semibold cursor-pointer hover:underline"
              >
                Contact Support
              </span>
            </p>
            {/* <p className="text-xs text-gray-500 mt-2">
              Powered by{" "}
              <span className="font-semibold text-gray-700">
                Bharat Connect
              </span>{" "}
              (NPCI)
            </p> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Rating Bottom Sheet */}
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

// Enhanced Detail Row Component
const DetailRow = ({ label, value, highlight, status }) => {
  const getStatusStyle = (status) => {
    const styles = {
      success: "text-green-600 bg-green-50 px-2 py-1 rounded-md font-bold",
      pending: "text-amber-600 bg-amber-50 px-2 py-1 rounded-md font-bold",
      failed: "text-red-600 bg-red-50 px-2 py-1 rounded-md font-bold",
    };
    return styles[status] || "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-between items-center px-4 py-3 ${
        highlight ? "bg-blue-50/50" : ""
      }`}
    >
      <span className="text-xs text-gray-600 font-medium">{label}</span>
      <span
        className={`text-xs font-semibold text-right ${
          status ? getStatusStyle(status) : "text-gray-800"
        } ${highlight ? "text-blue-700" : ""} max-w-[60%] break-all`}
      >
        {value}
      </span>
    </motion.div>
  );
};

export default BBPSStatus;

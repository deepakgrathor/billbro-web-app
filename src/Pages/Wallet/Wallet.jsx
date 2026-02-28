// import React, { useEffect, useRef, useState } from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import ToastComp from "../../Components/ToastComp";
// import {
//   MdAccountBalanceWallet,
//   MdAdd,
//   MdSecurity,
//   MdSpeed,
//   MdVerifiedUser,
//   MdCheckCircle,
//   MdTrendingUp,
//   MdInfo,
// } from "react-icons/md";
// import API from "../../Redux/API";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

// const Wallet = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [amount, setAmount] = useState("");
//   const [orderId, setOrderId] = useState(null);
//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
//   const [loading, setLoading] = useState(false);
//   const [loadingStage, setLoadingStage] = useState("");
//   const [selectedAmount, setSelectedAmount] = useState(null);

//   const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
//   const mountRef = useRef(null);
//   const paymentTimeoutRef = useRef(null); // ✅ FIX: Cleanup timeout

//   const handleChange = (e) => {
//     const value = e.target.value;
//     if (!/^\d*$/.test(value)) return;
//     setSelectedAmount(null);
//     setAmount(value);

//     if (Number(value) > 10000) {
//       ToastComp({
//         message: "Amount cannot be more than ₹10,000",
//         type: "error",
//       });
//     }
//   };
//   useEffect(() => {
//     dispatch(getUserProfile());
//   }, []);
//   const handleQuickAmount = (value) => {
//     setSelectedAmount(value);
//     setAmount(value.toString());
//   };

//   // ✅ FIX: Memoized cleanup function
//   const cleanupPayment = () => {
//     setLoading(false);
//     setLoadingStage("");
//     if (paymentTimeoutRef.current) {
//       clearTimeout(paymentTimeoutRef.current);
//       paymentTimeoutRef.current = null;
//     }
//   };

//   // ✅ Handle payment completion
//   const handlePaymentCompletion = async (completedOrderId) => {
//     setLoadingStage("verifying");

//     try {
//       const response = await API.post(`payment/upiintent/verify-order`, {
//         orderId: completedOrderId,
//       });

//       if (response.data?.status) {
//         const status = response.data.status;

//         if (status === "SUCCESS") {
//           setLoadingStage("success");

//           paymentTimeoutRef.current = setTimeout(() => {
//             navigate("/payment-success", {
//               state: {
//                 amount: response.data.amount || amount,
//                 orderId: completedOrderId,
//                 transactionId: response.data.transactionId || "N/A",
//                 date: new Date().toISOString(),
//               },
//             });

//             setAmount("");
//             setSelectedAmount(null);
//             setOrderId(null);
//             cleanupPayment();
//           }, 1500);
//         } else if (status === "PENDING") {
//           ToastComp({
//             message: "Payment is being processed...",
//             type: "info",
//           });

//           paymentTimeoutRef.current = setTimeout(
//             () => handlePaymentCompletion(completedOrderId),
//             3000
//           );
//         } else {
//           cleanupPayment();
//           ToastComp({
//             message: "Payment Failed. Please try again.",
//             type: "error",
//           });
//         }
//       } else {
//         cleanupPayment();
//         ToastComp({
//           message: response.data?.message || "Error verifying payment",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error checking payment status:", error);
//       cleanupPayment();
//       ToastComp({
//         message: "Error verifying payment status",
//         type: "error",
//       });
//     }
//   };

//   // ✅ Listen for payment completion from React Native
//   useEffect(() => {
//     const handleMessage = (event) => {
//       try {
//         const message =
//           typeof event.data === "string" ? JSON.parse(event.data) : event.data;

//         if (message.type === "PAYMENT_COMPLETED") {
//           handlePaymentCompletion(message.data.orderId);
//         } else if (message.type === "UPI_APP_NOT_FOUND") {
//           cleanupPayment();
//           ToastComp({
//             message: "Please install a UPI app to complete payment",
//             type: "error",
//           });
//         }
//       } catch (error) {
//         console.error("Message parsing error:", error);
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     document.addEventListener("message", handleMessage);

//     return () => {
//       window.removeEventListener("message", handleMessage);
//       document.removeEventListener("message", handleMessage);
//       cleanupPayment(); // ✅ FIX: Cleanup on unmount
//     };
//   }, []);

//   // ✅ Handle payment initiation
//   const handlePayment = async () => {
//     if (!amount || Number(amount) <= 0 || Number(amount) > 10000) {
//       ToastComp({
//         message: "Please enter amount between ₹1 and ₹10,000",
//         type: "error",
//       });
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       ToastComp({ message: "Please login to continue", type: "error" });
//       navigate("/login");
//       return;
//     }

//     setLoading(true);
//     setLoadingStage("creating");

//     try {
//       const response = await API.post(`payment/upiintent/create-order`, {
//         amount: parseFloat(amount),
//       });

//       if (response.data?.status) {
//         const { orderId, upiLink, zwitch_transaction_id } = response.data;
//         setOrderId(orderId);
//         setLoadingStage("opening");

//         if (window.ReactNativeWebView) {
//           window.ReactNativeWebView.postMessage(
//             JSON.stringify({
//               action: "OPEN_UPI_APP",
//               upiIntentUrl: upiLink,
//               orderId: orderId,
//               zwitch_transaction_id: zwitch_transaction_id,
//               amount: parseFloat(amount),
//             })
//           );

//           paymentTimeoutRef.current = setTimeout(() => {
//             setLoadingStage("waiting");
//           }, 2000);
//         } else {
//           console.warn("⚠️ Not running in React Native WebView");
//           cleanupPayment();
//         }
//       } else {
//         cleanupPayment();
//         ToastComp({
//           message: response.data?.message || "Failed to create order",
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//       cleanupPayment();
//       ToastComp({ message: "Payment initiation failed", type: "error" });
//     }
//   };

//   return (
//     <div
//       ref={mountRef}
//       className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden"
//     >
//       {/* Animated Background Blobs */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Fixed Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
//         <CommonHeader
//           title={"Add Money to Wallet"}
//           handleclick={() => navigate('/')}
//         />
//       </div>

//       {/* Content */}
//       <div className="flex-1 pt-20 pb-32 overflow-y-auto">
//         {/* Balance Card */}
//         <div className="px-4">
//           <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl shadow-2xl">
//             {/* Decorative Elements */}
//             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
//             <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
//             <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

//             {/* Pattern Overlay */}
//             <div
//               className="absolute inset-0 opacity-10"
//               style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//               }}
//             ></div>

//             <div className="relative p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                     <p className="text-white/90 text-xs font-semibold uppercase tracking-wider">
//                       Available Balance
//                     </p>
//                   </div>
//                   <div className="flex items-baseline gap-2">
//                     <p className="text-white font-black text-4xl tracking-tight">
//                       ₹
//                       {walletBalance.toLocaleString("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       })}
//                     </p>
//                     {walletBalance <= 10 && (
//                       <span className="text-[9px] font-bold bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
//                         Low Balance
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
//                   <MdAccountBalanceWallet size={32} className="text-white" />
//                 </div>
//               </div>

//               {/* Quick Stats */}
//               {/* <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
//                   <div className="flex items-center gap-2 mb-1">
//                     <MdTrendingUp className="text-green-400" size={16} />
//                     <p className="text-white/70 text-[10px] font-medium">This Month</p>
//                   </div>
//                   <p className="text-white font-bold text-lg">₹0.00</p>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
//                   <div className="flex items-center gap-2 mb-1">
//                     <MdCheckCircle className="text-blue-400" size={16} />
//                     <p className="text-white/70 text-[10px] font-medium">Total Added</p>
//                   </div>
//                   <p className="text-white font-bold text-lg">₹0.00</p>
//                 </div>
//               </div> */}
//             </div>
//           </div>
//         </div>

//         {/* Amount Input Section */}
//         <div className="px-4 mt-6">
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full"></div>
//               <h3 className="text-base font-black text-gray-900">
//                 Enter Amount
//               </h3>
//             </div>

//             <div className="relative group">
//               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition duration-500"></div>
//               <div className="relative flex items-center bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 group-hover:border-purple-400 focus-within:border-purple-500 focus-within:shadow-xl rounded-3xl px-6 py-6 transition-all duration-300">
//                 <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mr-3">
//                   ₹
//                 </span>
//                 <input
//                   value={amount}
//                   onChange={handleChange}
//                   className="text-4xl font-black outline-none w-full bg-transparent text-gray-900 placeholder-gray-300"
//                   maxLength={5}
//                   placeholder="0"
//                   type="text"
//                   disabled={loading}
//                 />
//                 {amount && Number(amount) > 0 && Number(amount) <= 10000 && (
//                   <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-scaleIn">
//                     <MdCheckCircle className="text-green-600" size={20} />
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between px-2">
//               <p className="text-xs font-semibold text-gray-500">Min: ₹1</p>
//               <p className="text-xs font-semibold text-gray-500">
//                 Max: ₹10,000
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Amount Selection */}
//         <div className="px-4 mt-6">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
//             <h3 className="text-base font-black text-gray-900">Quick Select</h3>
//           </div>

//           <div className="grid grid-cols-3 gap-3">
//             {[500, 1000, 2000, 5000, 7000, 10000].map((item, idx) => {
//               const isSelected = selectedAmount === item;
//               const gradients = [
//                 "from-orange-500 to-red-500",
//                 "from-purple-500 to-pink-500",
//                 "from-blue-500 to-cyan-500",
//                 "from-green-500 to-emerald-500",
//                 "from-indigo-500 to-purple-500",
//                 "from-pink-500 to-rose-500",
//               ];

//               return (
//                 <button
//                   key={idx}
//                   type="button"
//                   onClick={() => handleQuickAmount(item)}
//                   disabled={loading}
//                   className={`
//                     relative overflow-hidden py-2 rounded-xl font-bold transition-all duration-300 shadow-lg
//                     ${
//                       isSelected
//                         ? `bg-gradient-to-br ${gradients[idx]} text-white scale-105 shadow-lg`
//                         : "bg-white text-gray-900 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg active:scale-95"
//                     }
//                     ${loading ? "opacity-50 cursor-not-allowed" : ""}
//                   `}
//                 >
//                   {isSelected && (
//                     <div className="absolute inset-0 bg-white/20"></div>
//                   )}
//                   <div className="relative flex flex-col items-center justify-center">
//                     {/* <p className={`text-xs font-semibold mb-1 ${isSelected ? "text-white/80" : "text-gray-500"}`}>
//                       Add
//                     </p> */}
//                     <p className="text-lg font-semibold">
//                       ₹{item.toLocaleString()}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Features Section */}
//         <div className="px-4 mt-6">
//           <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-5 border border-white/20">
//             <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
//               <MdInfo className="text-purple-600" size={20} />
//               Why Add Money?
//             </h3>

//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//                   <MdSpeed size={24} className="text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-bold text-gray-900 mb-1">
//                     Lightning Fast
//                   </p>
//                   <p className="text-xs text-gray-600 leading-relaxed">
//                     Instant recharges & bill payments without any delay
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
//                   <MdSecurity size={24} className="text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-bold text-gray-900 mb-1">
//                     100% Secure
//                   </p>
//                   <p className="text-xs text-gray-600 leading-relaxed">
//                     Bank-grade encryption protects all your transactions
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                   <MdVerifiedUser size={24} className="text-white" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-bold text-gray-900 mb-1">
//                     Fully Verified
//                   </p>
//                   <p className="text-xs text-gray-600 leading-relaxed">
//                     Every payment is authenticated & verified instantly
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Info Card */}
//         <div className="px-4 mt-6">
//           <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-4">
//             <div className="flex items-start gap-3">
//               <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
//                 <span className="text-white text-lg">💳</span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm font-bold text-gray-900 mb-1">
//                   Accepted Payment Methods
//                 </p>
//                 <p className="text-xs text-gray-700 leading-relaxed">
//                   UPI payments via GPay, PhonePe, Paytm, BHIM & all major UPI
//                   apps
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Trust Badges */}
//         <div className="px-4 mt-8 mb-4">
//           <div className="flex items-center justify-center gap-8">
//             <div className="flex flex-col items-center">
//               <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
//                 <svg
//                   className="w-7 h-7 text-white"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <p className="text-xs font-bold text-gray-700">Secure</p>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
//                 <svg
//                   className="w-7 h-7 text-white"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <p className="text-xs font-bold text-gray-700">Instant</p>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
//                 <svg
//                   className="w-7 h-7 text-white"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//               <p className="text-xs font-bold text-gray-700">Verified</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Button */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-gray-200 p-4 shadow-2xl z-40">
//         <button
//           onClick={handlePayment}
//           disabled={
//             !amount || Number(amount) <= 0 || Number(amount) > 10000 || loading
//           }
//           className={`
//             w-full font-black py-4 px-6 rounded-2xl shadow-2xl transform transition-all duration-300
//             flex items-center justify-center gap-3 group relative overflow-hidden
//             ${
//               amount &&
//               Number(amount) > 0 &&
//               Number(amount) <= 10000 &&
//               !loading
//                 ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white hover:scale-105 active:scale-95 shadow-green-200"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }
//           `}
//         >
//           {amount &&
//             Number(amount) > 0 &&
//             Number(amount) <= 10000 &&
//             !loading && (
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
//             )}

//           {loading ? (
//             <>
//               <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
//               <span className="text-base">Processing...</span>
//             </>
//           ) : (
//             <>
//               <MdAdd
//                 size={26}
//                 className="group-hover:rotate-90 transition-transform duration-300"
//               />
//               <span className="text-base">Add ₹{amount || "0"} to Wallet</span>
//               {amount && Number(amount) > 0 && Number(amount) <= 10000 && (
//                 <svg
//                   className="w-5 h-5 group-hover:translate-x-1 transition-transform"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={3}
//                     d="M13 7l5 5m0 0l-5 5m5-5H6"
//                   />
//                 </svg>
//               )}
//             </>
//           )}
//         </button>

//         {/* Balance Preview */}
//         {amount && Number(amount) > 0 && !loading && (
//           <div className="mt-3 flex items-center justify-center gap-4 text-xs animate-fadeIn">
//             <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
//               <span className="text-gray-600">Current:</span>
//               <span className="font-bold text-gray-900">
//                 ₹{walletBalance.toFixed(2)}
//               </span>
//             </div>
//             <div className="w-5 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
//             <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 rounded-full">
//               <span className="text-green-700">New:</span>
//               <span className="font-bold text-green-700">
//                 ₹{(walletBalance + Number(amount)).toFixed(2)}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Full Screen Loader Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scaleIn">
//             {loadingStage === "creating" && (
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
//                 </div>
//                 <h3 className="text-2xl font-black text-gray-900 mb-2">
//                   Creating Order
//                 </h3>
//                 <p className="text-sm text-gray-600">Please wait a moment...</p>
//               </div>
//             )}

//             {loadingStage === "opening" && (
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <div className="animate-bounce text-5xl">📱</div>
//                 </div>
//                 <h3 className="text-2xl font-black text-gray-900 mb-2">
//                   Opening UPI App
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   Redirecting to payment...
//                 </p>
//               </div>
//             )}

//             {loadingStage === "waiting" && (
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
//                   <div className="text-5xl">⏳</div>
//                 </div>
//                 <h3 className="text-2xl font-black text-gray-900 mb-2">
//                   Complete Payment
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   Finish payment in your UPI app
//                 </p>
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce"></div>
//                   <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
//                   <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
//                 </div>
//               </div>
//             )}

//             {loadingStage === "verifying" && (
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
//                 </div>
//                 <h3 className="text-2xl font-black text-gray-900 mb-2">
//                   Verifying Payment
//                 </h3>
//                 <p className="text-sm text-gray-600">Almost there...</p>
//               </div>
//             )}

//             {loadingStage === "success" && (
//               <div className="text-center">
//                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <MdCheckCircle className="w-16 h-16 text-green-600 animate-bounce" />
//                 </div>
//                 <h3 className="text-2xl font-black text-green-600 mb-2">
//                   Payment Successful!
//                 </h3>
//                 <p className="text-sm text-gray-600">Redirecting you now...</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* CSS Animations */}
//       <style jsx>{`
//         @keyframes scaleIn {
//           from {
//             transform: scale(0.9);
//             opacity: 0;
//           }
//           to {
//             transform: scale(1);
//             opacity: 1;
//           }
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes blob {
//           0%,
//           100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//         .animate-scaleIn {
//           animation: scaleIn 0.3s ease-out;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-out;
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .delay-100 {
//           animation-delay: 0.1s;
//         }
//         .delay-200 {
//           animation-delay: 0.2s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Wallet;
import React, { useEffect, useRef, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ToastComp from "../../Components/ToastComp";
import {
  MdAccountBalanceWallet,
  MdAdd,
  MdSecurity,
  MdSpeed,
  MdVerifiedUser,
  MdCheckCircle,
  MdInfo,
} from "react-icons/md";
import API from "../../Redux/API";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

const Wallet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState(null);
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);

  const walletBalance = ProfileData?.Data?.wallet?.balance || 0;

  const mountRef = useRef(null);
  const paymentTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    setSelectedAmount(null);
    setAmount(value);

    if (Number(value) > 10000) {
      ToastComp({
        message: "Amount cannot be more than ₹10,000",
        type: "error",
      });
    }
  };

  const handleQuickAmount = (value) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const cleanupPayment = () => {
    setLoading(false);
    setLoadingStage("");
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
      paymentTimeoutRef.current = null;
    }
  };

  // Cashfree flow with payment session ID
  const handlePayment = async () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > 10000) {
      ToastComp({
        message: "Please enter amount between ₹1 and ₹10,000",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setLoadingStage("creating");

    try {
      // 1. Create order from backend
      const response = await API.post(`payment/cashfree/create-order`, {
        amount: parseFloat(amount),
      });

      const data = response.data;

      if (!data?.payment_session_id || !data?.order_id) {
        cleanupPayment();
        ToastComp({ message: "Failed to create order", type: "error" });
        return;
      }

      setOrderId(data.order_id);
      setLoadingStage("opening");

      // 2. Send to React Native to trigger Cashfree SDK
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            action: "CASHFREE_UPI_INTENT",
            orderId: data.order_id,
            sessionId: data.payment_session_id,
          }),
        );

        paymentTimeoutRef.current = setTimeout(() => {
          setLoadingStage("waiting");
        }, 2000);
      } else {
        console.warn("Not running in React Native WebView");
        cleanupPayment();
        ToastComp({
          message: "UPI payments only work in the app",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      cleanupPayment();
      ToastComp({ message: "Payment initiation failed", type: "error" });
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const message =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (message.type === "PAYMENT_SUCCESS") {
          setLoadingStage("success");
          dispatch(getUserProfile());

          paymentTimeoutRef.current = setTimeout(() => {
            navigate("/payment-success", {
              state: {
                amount: message.data.amount || amount,
                orderId: message.data.orderId,
                transactionId: message.data.transactionId || "N/A",
                date: new Date().toISOString(),
              },
            });
            setAmount("");
            setSelectedAmount(null);
            setOrderId(null);
            cleanupPayment();
          }, 1500);
        } else if (message.type === "PAYMENT_FAILED") {
          cleanupPayment();
          ToastComp({
            message:
              message.data?.message || "Payment Failed. Please try again.",
            type: "error",
          });
        } else if (message.type === "NO_UPI_APP") {
          cleanupPayment();
          ToastComp({
            message: "No UPI app installed on your device",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Message parsing error:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
      cleanupPayment();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const canPay =
    amount && Number(amount) > 0 && Number(amount) <= 10000 && !loading;

  return (
    <div
      ref={mountRef}
      className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white"
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <CommonHeader title={"Add Money"} handleclick={() => navigate("/")} />
      </div>

      {/* Content */}
      <div className="pt-20 pb-[150px] px-3 sm:px-4 max-w-xl mx-auto">
        {/* Balance Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
                  Available Balance
                </p>
                <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 truncate">
                    ₹
                    {walletBalance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {walletBalance <= 10 && (
                    <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-1 rounded-full">
                      Low balance
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Add money to pay faster for Mobile & DTH Recharge.
                </p>
              </div>

              <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <MdAccountBalanceWallet size={26} />
              </div>
            </div>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="px-4 sm:px-5 py-3 bg-slate-50 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-600">
              Limits: ₹1 – ₹10,000
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-700">
                UPI Intent
              </span>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-slate-900" />
              <h3 className="text-base font-black text-slate-900">
                Enter amount
              </h3>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹
              </span>
              <input
                value={amount}
                onChange={handleChange}
                className="min-w-0 flex-1 bg-transparent outline-none text-2xl sm:text-3xl font-black text-slate-900 placeholder-slate-400"
                maxLength={5}
                placeholder="0"
                type="text"
                disabled={loading}
                inputMode="numeric"
              />

              {amount && Number(amount) > 0 && Number(amount) <= 10000 && (
                <div className="shrink-0 h-9 w-9 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <MdCheckCircle className="text-emerald-600" size={20} />
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Min: ₹1</span>
              <span className="font-semibold">Max: ₹10,000</span>
            </div>
          </div>

          {/* Quick chips (responsive for fold) */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
              Quick select
            </p>

            <div className="mt-3 -mx-1 px-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[500, 1000, 2000, 5000, 7000, 10000].map((item) => {
                const active = selectedAmount === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickAmount(item)}
                    disabled={loading}
                    className={[
                      "shrink-0 rounded-full border transition font-extrabold tracking-wide",
                      "px-3 py-2 text-[11px] sm:px-4 sm:text-xs",
                      active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                      loading ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    ₹{item.toLocaleString("en-IN")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Why add money */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <MdInfo className="text-slate-900" size={18} />
              <h3 className="text-base font-black text-slate-900">
                Why add money?
              </h3>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <MdSpeed size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    Instant Recharge
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Pay DTH & recharge faster using wallet balance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <divc className="shrink-0 h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <MdSecurity size={20} />
                </divc>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">Secure</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Bank-grade encryption for all transactions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <MdVerifiedUser size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">Verified</p>
                  <p className="mt-1 text-xs text-slate-600">
                    Every payment is verified & authenticated.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black text-slate-900">
                Payment methods
              </p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                We accept UPI payments via GPay, PhonePe, Paytm, BHIM & more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA (safe-area responsive) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/92 backdrop-blur-xl border-t border-slate-200">
        <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
          <button
            onClick={handlePayment}
            disabled={!canPay}
            className={[
              "w-full rounded-2xl py-4 px-5 font-black flex items-center justify-center gap-2 transition",
              canPay
                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? (
              <>
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MdAdd size={22} />
                Add ₹{amount || "0"} to Wallet
              </>
            )}
          </button>

          {amount && Number(amount) > 0 && !loading && (
            <div className="mt-2 text-[11px] text-center text-slate-600 font-semibold">
              Current: ₹{walletBalance.toFixed(2)}{" "}
              <span className="text-slate-400">→</span>{" "}
              <span className="text-emerald-700">
                New: ₹{(walletBalance + Number(amount)).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Full screen loader overlay (same logic, cleaner UI) */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-6">
            {loadingStage === "creating" && (
              <Stage
                title="Creating order"
                desc="Please wait..."
                icon="spinner"
              />
            )}
            {loadingStage === "opening" && (
              <Stage
                title="Opening UPI app"
                desc="Redirecting..."
                icon="phone"
              />
            )}
            {loadingStage === "waiting" && (
              <Stage
                title="Complete payment"
                desc="Please complete payment in UPI app"
                icon="hourglass"
              />
            )}
            {loadingStage === "verifying" && (
              <Stage
                title="Verifying payment"
                desc="Almost done..."
                icon="spinner"
              />
            )}
            {loadingStage === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <MdCheckCircle className="text-emerald-600" size={34} />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Payment successful
                </h3>
                <p className="mt-1 text-sm text-slate-600">Redirecting...</p>
              </div>
            )}

            {/* Optional orderId info */}
            {orderId ? (
              <p className="mt-5 text-[11px] text-center text-slate-500 font-semibold break-all">
                Order ID: {orderId}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

const Stage = ({ title, desc, icon }) => {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        {icon === "spinner" ? (
          <span className="h-7 w-7 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        ) : icon === "phone" ? (
          <span className="text-3xl">📱</span>
        ) : (
          <span className="text-3xl">⏳</span>
        )}
      </div>
      <h3 className="text-xl font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
};

export default Wallet;

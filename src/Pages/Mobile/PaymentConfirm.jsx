// import React, { useEffect, useRef, useState } from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useLocation, useNavigate } from "react-router-dom";
// import { COMPANY_LOGO, MOBILE_RECHARGE } from "../../Utils/Constant";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   RechargeRequest,
//   resetRechargeData,
// } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
// import ToastComp from "../../Components/ToastComp";
// import Loader from "../../Components/Loader";
// import ButtonComp from "../../Components/ButtonComp";
// import {
//   MdOutlineAddCircleOutline,
//   MdCheckCircle,
//   MdEdit,
//   MdAccountBalanceWallet,
//   MdCreditCard,
// } from "react-icons/md";
// import { primaryColor } from "../../Utils/Style";
// import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import API from "../../Redux/API";
// import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import { useUPIPayment } from "../../hooks/useUPIPayment";

// const PaymentConfirm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const [load, setLoad] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [orderId, setOrderId] = useState(null);
//   const [loadingStage, setLoadingStage] = useState("");
//   const [amount, setAmount] = useState("");

//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   const { Totalprice } = useSelector((state) => state.PaymentSlice.PaymentType);
//   const { serviceList, serviceLoader } = useSelector(
//     (state) => state.ServiceSlice.service
//   );
//   const mountRef = useRef(null);
//   const paymentTimeoutRef = useRef(null);

//   const FindDirectPay = serviceList.Data?.find((a) => a.name == "DIRECT_UPI");

//   const rechargeData = location.state;
//   // Check if wallet balance is sufficient
//   const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
//   const isWalletSufficient = walletBalance >= Number(Totalprice?.amount || 0);

//   // Code Likhna Yha se Start ho rha hai

//   const { isLoading, initiatePayment, getLoadingMessage } = useUPIPayment(
//     MobileRecharge,
//     (error) => console.error(error)
//   );

//   // Code Likhna Yha tak ho rha hai

//   const MobileRecharge = async () => {
//     // Input validation
//     if (
//       !rechargeData?.mobileNumber ||
//       !rechargeData?.operator?.OperatorCode ||
//       !Totalprice?.amount
//     ) {
//       ToastComp({
//         message: "❌ Missing required recharge details",
//         type: "error",
//       });
//       return;
//     }

//     // Wallet validation
//     if (walletSelect && !isWalletSufficient) {
//       ToastComp({
//         message: "Insufficient wallet balance. Please add money.",
//         type: "error",
//       });
//       return;
//     }

//     setLoad(true);

//     try {
//       const payload = {
//         MobileNumber: rechargeData.mobileNumber,
//         Operator_Code: rechargeData.operator.OperatorCode,
//         Circle_Code: rechargeData.circle?.circlecode || null,
//         amount: Number(Totalprice.amount),
//         isPrepaid: true,
//       };

//       const res = await dispatch(RechargeRequest(payload));

//       // Response validation
//       if (!res?.payload) {
//         throw new Error("No response received from server");
//       }

//       const { ResponseStatus, Data, Remarks } = res.payload;

//       if (ResponseStatus !== 1) {
//         throw new Error(Remarks || "Invalid response status");
//       }

//       const status = Data?.status?.toLowerCase();

//       // Handle Success and Pending cases
//       if (status === "success" || status === "pending") {
//         const navigationData = {
//           MobileNumber: payload.MobileNumber,
//           Operator_Code: payload.Operator_Code,
//           amount: payload.amount,
//           transactionId: res.payload.Data.transactionId,
//           status: status.toUpperCase(),
//           type: "MOBILE",
//           ...(status === "success" && {
//             OP_REF: Data?.opRefNo || Data?.operator_ref_id,
//           }),
//         };

//         navigate("/rechargestatus", { state: navigationData });
//       } else {
//         throw new Error(Data?.message || "Recharge status unknown");
//       }
//     } catch (error) {
//       console.error("Mobile Recharge Error:", error);

//       const errorMessage =
//         error?.response?.data?.Remarks ||
//         error?.payload?.Remarks ||
//         error?.message ||
//         "Recharge Failed. Please try again.";

//       ToastComp({
//         message: errorMessage,
//         type: "error",
//       });
//     } finally {
//       setLoad(false);
//     }
//   };

//   const handlePayment = () => {
//     if (walletSelect) {
//       MobileRecharge();
//     } else {
//       initiatePayment();
//     }
//   };

//   const cleanupPayment = () => {
//     setLoading(false);
//     setLoadingStage("");
//     if (paymentTimeoutRef.current) {
//       clearTimeout(paymentTimeoutRef.current);
//       paymentTimeoutRef.current = null;
//     }
//   };

//   const handleUPIPayment = async () => {
//     setLoading(true);
//     setLoadingStage("creating");

//     try {
//       const response = await API.post(`payment/upiintent/create-order`, {
//         amount: parseFloat(Totalprice.amount),
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
//               orderId,
//               zwitch_transaction_id,
//               amount: parseFloat(Totalprice.amount),
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
//             MobileRecharge();
//             setAmount("");
//             setOrderId(null);
//             cleanupPayment();
//           }, 1500);
//         } else if (status === "PENDING") {
//           ToastComp({ message: "Payment is being processed...", type: "info" });
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
//       ToastComp({ message: "Error verifying payment status", type: "error" });
//     }
//   };

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
//       cleanupPayment();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     dispatch(getUserProfile());
//     dispatch(fetchServiceList());
//   }, [dispatch]);

//   // Redirect if no recharge data
//   useEffect(() => {
//     if (!rechargeData) {
//       navigate("/mobile");
//     }
//   }, [rechargeData, navigate]);

//   if (!rechargeData) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
//       {/* Fixed Header */}
//       <div className="fixed top-0 w-full z-50 bg-white shadow-sm">
//         <CommonHeader
//           title={"Confirm & Pay"}
//           handleclick={() => {
//             dispatch(resetRechargeData());
//             navigate("/mobile");
//           }}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="pt-20 pb-32 px-4 max-w-2xl mx-auto">
//         {/* Plan Details Card */}
//         <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6 animate-slide-in">
//           {/* Gradient Header */}
//           <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-md">
//                   <img
//                     src={rechargeData.operator.img}
//                     alt="operator"
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//                 <div>
//                   <p className="text-white font-bold text-base">
//                     {rechargeData.mobileNumber}
//                   </p>
//                   <p className="text-white/80 text-xs">
//                     {rechargeData.operator.OperatorName}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => navigate("/plans")}
//                 className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1"
//               >
//                 <MdEdit size={14} />
//                 Change
//               </button>
//             </div>
//           </div>

//           {/* Plan Info */}
//           <div className="p-5">
//             {/* Amount, Data, Validity */}
//             <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
//               <div className="text-center flex-1">
//                 <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
//                   Amount
//                 </p>
//                 <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                   ₹{rechargeData.plans.amount}
//                 </p>
//               </div>

//               <div className="w-px h-12 bg-gray-200"></div>

//               <div className="text-center flex-1">
//                 <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
//                   Data
//                 </p>
//                 <p className="text-lg font-bold text-gray-800">
//                   {rechargeData.plans.data || "N/A"}
//                 </p>
//               </div>

//               <div className="w-px h-12 bg-gray-200"></div>

//               <div className="text-center flex-1">
//                 <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
//                   Validity
//                 </p>
//                 <p className="text-lg font-bold text-gray-800">
//                   {rechargeData.plans.validity}
//                 </p>
//               </div>
//             </div>

//             {/* Description */}
//             {rechargeData.plans.desc && (
//               <div className="mb-4">
//                 <p className="text-xs font-semibold text-gray-700 mb-2">
//                   Plan Details:
//                 </p>
//                 <p className="text-xs text-gray-600 leading-relaxed">
//                   {rechargeData.plans.desc}
//                 </p>
//               </div>
//             )}

//             {/* Benefits */}
//             {rechargeData.plans.planBenefitItemList &&
//               rechargeData.plans.planBenefitItemList.length > 0 && (
//                 <div>
//                   <p className="text-xs font-semibold text-gray-700 mb-3">
//                     Benefits:
//                   </p>
//                   <div className="flex items-center -space-x-2">
//                     {rechargeData.plans.planBenefitItemList
//                       .slice(0, 5)
//                       .map((item, index) => (
//                         <div
//                           key={index}
//                           className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 p-2 shadow-sm"
//                           style={{ zIndex: 5 - index }}
//                         >
//                           <img
//                             src={item.logoUrl || COMPANY_LOGO}
//                             alt="benefit"
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                       ))}
//                     {rechargeData.plans.planBenefitItemList.length > 5 && (
//                       <div
//                         className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700"
//                         style={{ zIndex: 0 }}
//                       >
//                         +{rechargeData.plans.planBenefitItemList.length - 5}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//           </div>
//         </div>

//         {/* Payment Methods */}
//         <div className="mb-6">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
//             Select Payment Method
//           </h3>

//           {/* Wallet Option */}
//           <div
//             onClick={() => dispatch(setWalletSelect(true))}
//             className={`
//               bg-white rounded-2xl shadow-md mb-3 overflow-hidden cursor-pointer
//               transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//               ${
//                 walletSelect
//                   ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200"
//                   : "border border-gray-200"
//               }
//             `}
//           >
//             <div className="p-4 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`
//                   w-12 h-12 rounded-xl flex items-center justify-center
//                   ${
//                     walletSelect
//                       ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                       : "bg-gray-100"
//                   }
//                 `}
//                 >
//                   <MdAccountBalanceWallet
//                     size={24}
//                     className={walletSelect ? "text-white" : "text-gray-600"}
//                   />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium mb-1">
//                     Wallet Balance
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <p className="text-lg font-black text-gray-800">
//                       ₹
//                       {new Intl.NumberFormat("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       }).format(walletBalance)}
//                     </p>
//                     {!isWalletSufficient && (
//                       <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
//                         Low Balance
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Add Money Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigate("/wallet");
//                 }}
//                 className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
//               >
//                 <MdOutlineAddCircleOutline size={18} />
//                 <span className="text-xs font-bold">Add Money</span>
//               </button>
//             </div>

//             {walletSelect && (
//               <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
//                 <div className="flex items-center gap-2">
//                   <MdCheckCircle className="text-purple-600" size={16} />
//                   <p className="text-xs text-purple-700 font-medium">
//                     Selected Payment Method
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* UPI Option */}

//           {FindDirectPay?.status && (
//             <div
//               onClick={() => dispatch(setWalletSelect(false))}
//               className={`
//               bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer
//               transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//               ${
//                 !walletSelect
//                   ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200"
//                   : "border border-gray-200"
//               }
//             `}
//             >
//               <div className="p-4 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`
//                   w-12 h-12 rounded-xl flex items-center justify-center
//                   ${
//                     !walletSelect
//                       ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                       : "bg-gray-100"
//                   }
//                 `}
//                   >
//                     <MdCreditCard
//                       size={24}
//                       className={!walletSelect ? "text-white" : "text-gray-600"}
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 font-medium mb-1">
//                       Pay with UPI
//                     </p>
//                     <p className="text-lg font-black text-gray-800">
//                       UPI Payment
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {!walletSelect && (
//                 <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
//                   <div className="flex items-center gap-2">
//                     <MdCheckCircle className="text-purple-600" size={16} />
//                     <p className="text-xs text-purple-700 font-medium">
//                       Selected Payment Method
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Payment Summary */}
//         <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
//           <div className="flex items-center justify-between">
//             <p className="text-sm font-semibold text-gray-700">
//               Total Payable Amount
//             </p>
//             <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//               ₹{Totalprice?.amount || 0}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Fixed Bottom Button */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-2xl z-40">
//         <div className="max-w-2xl mx-auto">
//           <ButtonComp
//             disabled={walletSelect && !isWalletSufficient}
//             title={
//               walletSelect && !isWalletSufficient
//                 ? "💰 Insufficient Wallet Balance"
//                 : "Proceed to Pay"
//             }
//             handleClick={handlePayment}
//           />
//         </div>
//       </div>

//       {/* Loader */}
//       {load && <Loader />}

//       {/* Animations */}
//       <style jsx>{`
//         @keyframes slide-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-slide-in {
//           animation: slide-in 0.4s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PaymentConfirm;
import React, { useEffect, useCallback, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { COMPANY_LOGO } from "../../Utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  RechargeRequest,
  resetRechargeData,
} from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import Loader from "../../Components/Loader";
import ButtonComp from "../../Components/ButtonComp";
import { MdEdit } from "react-icons/md";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import { usePaymentService } from "../../hooks/usePaymentService";
import { useUPIPayment } from "../../hooks/useUPIPayment";
import PaymentMethodSelector from "../../Components/PaymentMethodSelector";
import LoaderModal from "../../Components/LoaderModal";

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const rechargeData = location.state;

  // Redux selectors
  const { Totalprice } = useSelector((state) => state.PaymentSlice.PaymentType);
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  // Payment Service Hook
  const { walletBalance, isWalletSufficient, formatAmount, showError } =
    usePaymentService();

  const payableAmount = Number(Totalprice?.amount || 0);

  // Wallet Recharge Function
  const performWalletRecharge = useCallback(async () => {
    // Validation
    if (!rechargeData?.mobileNumber || !rechargeData?.operator?.OperatorCode) {
      showError("❌ Invalid recharge data");
      return;
    }

    if (!isWalletSufficient(payableAmount)) {
      showError("❌ Insufficient wallet balance. Please add money.");
      return;
    }
    setIsWalletLoading(true);

    try {
      const payload = {
        MobileNumber: rechargeData.mobileNumber,
        Operator_Code: rechargeData.operator.OperatorCode,
        Circle_Code: rechargeData.circle?.circlecode || null,
        amount: payableAmount,
        isPrepaid: true,
      };

      const res = await dispatch(RechargeRequest(payload));

      if (!res?.payload) {
        throw new Error("No response received from server");
      }

      const { ResponseStatus, Data, Remarks } = res.payload;

      if (ResponseStatus !== 1) {
        throw new Error(Remarks || "Invalid response status");
      }

      const status = Data?.status?.toLowerCase();

      if (status === "success" || status === "pending") {
        navigate("/rechargestatus", {
          state: {
            MobileNumber: payload.MobileNumber,
            Operator_Code: payload.Operator_Code,
            amount: payload.amount,
            transactionId: Data.transactionId,
            status: status.toUpperCase(),
            type: "MOBILE",
            paymentMethod: "WALLET",
            ...(status === "success" && {
              OP_REF: Data?.opRefNo || Data?.operator_ref_id,
            }),
          },
        });
      } else {
        throw new Error(Data?.message || "Recharge status unknown");
      }
    } catch (error) {
      console.error("Mobile Recharge Error:", error);
      showError(
        error?.response?.data?.Remarks ||
          error?.payload?.Remarks ||
          error?.message ||
          "Recharge Failed. Please try again.",
      );
    } finally {
      setIsWalletLoading(false);
    }
  }, [
    rechargeData,
    payableAmount,
    isWalletSufficient,
    dispatch,
    navigate,
    showError,
  ]);

  // Recharge After UPI Payment Success
  const performRechargeAfterUPI = useCallback(
    async (upiOrderId) => {
      try {
        const payload = {
          MobileNumber: rechargeData.mobileNumber,
          Operator_Code: rechargeData.operator.OperatorCode,
          Circle_Code: rechargeData.circle?.circlecode || null,
          amount: payableAmount,
          isPrepaid: true,
        };

        const res = await dispatch(RechargeRequest(payload));

        if (!res?.payload) {
          throw new Error("No response from recharge service");
        }

        const { ResponseStatus, Data, Remarks } = res.payload;

        if (ResponseStatus !== 1) {
          throw new Error(Remarks || "Recharge failed after payment");
        }

        const status = Data?.status?.toLowerCase();

        if (status === "success" || status === "pending") {
          navigate("/rechargestatus", {
            state: {
              MobileNumber: payload.MobileNumber,
              Operator_Code: payload.Operator_Code,
              amount: payload.amount,
              transactionId: Data.transactionId,
              status: status.toUpperCase(),
              type: "MOBILE",
              paymentMethod: "UPI",
              upiOrderId,
              ...(status === "success" && {
                OP_REF: Data?.opRefNo || Data?.operator_ref_id,
              }),
            },
          });
        } else {
          throw new Error(Data?.message || "Recharge status unknown");
        }
      } catch (error) {
        console.error("❌ Post-UPI Recharge Error:", error);
        showError(
          `Payment successful but recharge failed. Contact support with Order ID: ${upiOrderId}`,
        );
      }
    },
    [rechargeData, payableAmount, dispatch, navigate, showError],
  );

  // UPI Payment Hook
  const {
    isLoading: isUPILoading,
    initiatePayment,
    getLoadingMessage,
  } = useUPIPayment(
    performRechargeAfterUPI, // onSuccess
    (error) => console.error("UPI Payment Error:", error), // onError
  );

  // Main Payment Handler
  const handlePayment = useCallback(() => {
    if (walletSelect) {
      performWalletRecharge();
    } else {
      initiatePayment(payableAmount);
    }
  }, [walletSelect, performWalletRecharge, initiatePayment, payableAmount]);

  const isLoading = isWalletLoading || isUPILoading;

  // Initialize
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(fetchServiceList());
  }, [dispatch]);

  // Redirect if no data
  useEffect(() => {
    if (!rechargeData) {
      navigate("/mobile", { replace: true });
    }
  }, [rechargeData, navigate]);

  if (!rechargeData) return null;

  // Button states
  const isButtonDisabled =
    isLoading || (walletSelect && !isWalletSufficient(payableAmount));

  const buttonTitle = isLoading
    ? getLoadingMessage()
    : walletSelect && !isWalletSufficient(payableAmount)
      ? "💰 Insufficient Wallet Balance"
      : "Proceed to Pay";
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50 bg-white shadow-sm">
        <CommonHeader
          title="Confirm & Pay"
          handleclick={() => {
            if (!isLoading) {
              dispatch(resetRechargeData());
              navigate("/mobile");
            }
          }}
        />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32 px-4 max-w-2xl mx-auto">
        {/* Plan Details Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6 animate-slide-in">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl p-2 shadow-md">
                  <img
                    src={rechargeData.operator.img}
                    alt="operator"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-base">
                    {rechargeData.mobileNumber}
                  </p>
                  <p className="text-white/80 text-xs">
                    {rechargeData.operator.OperatorName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isLoading && navigate("/plans")}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdEdit size={14} />
                Change
              </button>
            </div>
          </div>

          {/* Plan Info */}
          <div className="p-5">
            {/* Amount, Data, Validity */}
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-100">
              <div className="text-center flex-1">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Amount
                </p>
                <p className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ₹{rechargeData.plans.amount}
                </p>
              </div>

              <div className="w-px h-12 bg-gray-200"></div>

              <div className="text-center flex-1">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Data
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {rechargeData.plans.data || "N/A"}
                </p>
              </div>

              <div className="w-px h-12 bg-gray-200"></div>

              <div className="text-center flex-1">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Validity
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {rechargeData.plans.validity}
                </p>
              </div>
            </div>

            {/* Description */}
            {rechargeData.plans.desc && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Plan Details:
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {rechargeData.plans.desc}
                </p>
              </div>
            )}

            {/* Benefits */}
            {rechargeData.plans.planBenefitItemList &&
              rechargeData.plans.planBenefitItemList.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-3">
                    Benefits:
                  </p>
                  <div className="flex items-center -space-x-2">
                    {rechargeData.plans.planBenefitItemList
                      .slice(0, 5)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 p-2 shadow-sm"
                          style={{ zIndex: 5 - index }}
                        >
                          <img
                            src={item.logoUrl || COMPANY_LOGO}
                            alt="benefit"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    {rechargeData.plans.planBenefitItemList.length > 5 && (
                      <div
                        className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-700"
                        style={{ zIndex: 0 }}
                      >
                        +{rechargeData.plans.planBenefitItemList.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Payment Method Selector - COMMON COMPONENT */}
        <div className="mt-5">
          <PaymentMethodSelector
            walletBalance={walletBalance}
            payableAmount={payableAmount}
            isLoading={isLoading}
          />
        </div>

        {/* Payment Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              Total Payable Amount
            </p>
            <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ₹{formatAmount(payableAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-2xl z-40">
        <div className="max-w-2xl mx-auto">
          <ButtonComp
            disabled={isButtonDisabled}
            title={buttonTitle}
            handleClick={handlePayment}
          />
        </div>
      </div>

      {/* Loader */}
      {isLoading && <LoaderModal variant="mobile" />}

      {/* Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentConfirm;

// import React, { useEffect, useCallback, useState } from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useLocation, useNavigate } from "react-router-dom";
// import { COMPANY_LOGO } from "../../Utils/Constant";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   RechargeRequest,
//   resetRechargeData,
// } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
// import Loader from "../../Components/Loader";
// import ButtonComp from "../../Components/ButtonComp";
// import { MdEdit } from "react-icons/md";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import { usePaymentService } from "../../hooks/usePaymentService";
// import { useUPIPayment } from "../../hooks/useUPIPayment";
// import PaymentMethodSelector from "../../Components/PaymentMethodSelector";
// import LoaderModal from "../../Components/LoaderModal";

// const PaymentConfirm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const rechargeData = location.state;

//   // Redux selectors
//   const { Totalprice } = useSelector((state) => state.PaymentSlice.PaymentType);
//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   const [isWalletLoading, setIsWalletLoading] = useState(false);

//   // Payment Service Hook
//   const { walletBalance, isWalletSufficient, formatAmount, showError } =
//     usePaymentService();

//   const payableAmount = Number(Totalprice?.amount || 0);

//   // Wallet Recharge Function
//   const performWalletRecharge = useCallback(async () => {
//     // Validation
//     if (!rechargeData?.mobileNumber || !rechargeData?.operator?.OperatorCode) {
//       showError("❌ Invalid recharge data");
//       return;
//     }

//     if (!isWalletSufficient(payableAmount)) {
//       showError("❌ Insufficient wallet balance. Please add money.");
//       return;
//     }
//     setIsWalletLoading(true);

//     try {
//       const payload = {
//         MobileNumber: rechargeData.mobileNumber,
//         Operator_Code: rechargeData.operator.OperatorCode,
//         Circle_Code: rechargeData.circle?.circlecode || null,
//         amount: payableAmount,
//         isPrepaid: true,
//       };

//       const res = await dispatch(RechargeRequest(payload));

//       if (!res?.payload) {
//         throw new Error("No response received from server");
//       }

//       const { ResponseStatus, Data, Remarks } = res.payload;

//       if (ResponseStatus !== 1) {
//         throw new Error(Remarks || "Invalid response status");
//       }

//       const status = Data?.status?.toLowerCase();

//       if (status === "success" || status === "pending") {
//         navigate("/rechargestatus", {
//           state: {
//             MobileNumber: payload.MobileNumber,
//             Operator_Code: payload.Operator_Code,
//             amount: payload.amount,
//             transactionId: Data.transactionId,
//             status: status.toUpperCase(),
//             type: "MOBILE",
//             paymentMethod: "WALLET",
//             ...(status === "success" && {
//               OP_REF: Data?.opRefNo || Data?.operator_ref_id,
//             }),
//           },
//         });
//       } else {
//         throw new Error(Data?.message || "Recharge status unknown");
//       }
//     } catch (error) {
//       console.error("Mobile Recharge Error:", error);
//       showError(
//         error?.response?.data?.Remarks ||
//           error?.payload?.Remarks ||
//           error?.message ||
//           "Recharge Failed. Please try again.",
//       );
//     } finally {
//       setIsWalletLoading(false);
//     }
//   }, [
//     rechargeData,
//     payableAmount,
//     isWalletSufficient,
//     dispatch,
//     navigate,
//     showError,
//   ]);

//   // Recharge After UPI Payment Success
//   const performRechargeAfterUPI = useCallback(
//     async (upiOrderId) => {
//       try {
//         const payload = {
//           MobileNumber: rechargeData.mobileNumber,
//           Operator_Code: rechargeData.operator.OperatorCode,
//           Circle_Code: rechargeData.circle?.circlecode || null,
//           amount: payableAmount,
//           isPrepaid: true,
//         };

//         const res = await dispatch(RechargeRequest(payload));

//         if (!res?.payload) {
//           throw new Error("No response from recharge service");
//         }

//         const { ResponseStatus, Data, Remarks } = res.payload;

//         if (ResponseStatus !== 1) {
//           throw new Error(Remarks || "Recharge failed after payment");
//         }

//         const status = Data?.status?.toLowerCase();

//         if (status === "success" || status === "pending") {
//           navigate("/rechargestatus", {
//             state: {
//               MobileNumber: payload.MobileNumber,
//               Operator_Code: payload.Operator_Code,
//               amount: payload.amount,
//               transactionId: Data.transactionId,
//               status: status.toUpperCase(),
//               type: "MOBILE",
//               paymentMethod: "UPI",
//               upiOrderId,
//               ...(status === "success" && {
//                 OP_REF: Data?.opRefNo || Data?.operator_ref_id,
//               }),
//             },
//           });
//         } else {
//           throw new Error(Data?.message || "Recharge status unknown");
//         }
//       } catch (error) {
//         console.error("❌ Post-UPI Recharge Error:", error);
//         showError(
//           `Payment successful but recharge failed. Contact support with Order ID: ${upiOrderId}`,
//         );
//       }
//     },
//     [rechargeData, payableAmount, dispatch, navigate, showError],
//   );

//   // UPI Payment Hook
//   const {
//     isLoading: isUPILoading,
//     initiatePayment,
//     getLoadingMessage,
//   } = useUPIPayment(
//     performRechargeAfterUPI, // onSuccess
//     (error) => console.error("UPI Payment Error:", error), // onError
//   );

//   // Main Payment Handler
//   const handlePayment = useCallback(() => {
//     if (walletSelect) {
//       performWalletRecharge();
//     } else {
//       initiatePayment(payableAmount);
//     }
//   }, [walletSelect, performWalletRecharge, initiatePayment, payableAmount]);

//   const isLoading = isWalletLoading || isUPILoading;

//   // Initialize
//   useEffect(() => {
//     dispatch(getUserProfile());
//     dispatch(fetchServiceList());
//   }, [dispatch]);

//   // Redirect if no data
//   useEffect(() => {
//     if (!rechargeData) {
//       navigate("/mobile", { replace: true });
//     }
//   }, [rechargeData, navigate]);

//   if (!rechargeData) return null;

//   // Button states
//   const isButtonDisabled =
//     isLoading || (walletSelect && !isWalletSufficient(payableAmount));

//   const buttonTitle = isLoading
//     ? getLoadingMessage()
//     : walletSelect && !isWalletSufficient(payableAmount)
//       ? "💰 Insufficient Wallet Balance"
//       : "Proceed to Pay";
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
//       {/* Fixed Header */}
//       <div className="fixed top-0 w-full z-50 bg-white shadow-sm">
//         <CommonHeader
//           title="Confirm & Pay"
//           handleclick={() => {
//             if (!isLoading) {
//               dispatch(resetRechargeData());
//               navigate("/mobile");
//             }
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
//                 onClick={() => !isLoading && navigate("/plans")}
//                 disabled={isLoading}
//                 className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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

//         {/* Payment Method Selector - COMMON COMPONENT */}
//         <div className="mt-5">
//           <PaymentMethodSelector
//             walletBalance={walletBalance}
//             payableAmount={payableAmount}
//             isLoading={isLoading}
//           />
//         </div>

//         {/* Payment Summary */}
//         <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
//           <div className="flex items-center justify-between">
//             <p className="text-sm font-semibold text-gray-700">
//               Total Payable Amount
//             </p>
//             <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//               ₹{formatAmount(payableAmount)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Fixed Bottom Button */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 shadow-2xl z-40">
//         <div className="max-w-2xl mx-auto">
//           <ButtonComp
//             disabled={isButtonDisabled}
//             title={buttonTitle}
//             handleClick={handlePayment}
//           />
//         </div>
//       </div>

//       {/* Loader */}
//       {isLoading && <LoaderModal variant="mobile" />}

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
import React, { useEffect, useCallback, useState, useRef } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { COMPANY_LOGO } from "../../Utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import {
  RechargeRequest,
  resetRechargeData,
} from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import ToastComp from "../../Components/ToastComp";
import Loader from "../../Components/Loader";
import ButtonComp from "../../Components/ButtonComp";
import {
  MdEdit,
  MdAccountBalanceWallet,
  MdCreditCard,
  MdOutlineAddCircleOutline,
  MdCheckCircle,
} from "react-icons/md";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import API from "../../Redux/API";

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const rechargeData = location.state;

  // Redux
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { Totalprice } = useSelector((state) => state.PaymentSlice.PaymentType);
  const { serviceList } = useSelector((state) => state.ServiceSlice.service);

  // Local state
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [upiLoading, setUpiLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [orderId, setOrderId] = useState(null);

  const paymentTimeoutRef = useRef(null);
  const pollingRef = useRef(null);

  // Derived
  const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
  const payableAmount = Number(Totalprice?.amount || 0);
  const isWalletSufficient = walletBalance >= payableAmount;
  const FindDirectPay = serviceList?.Data?.find((a) => a.name === "DIRECT_UPI");
  const isLoading = isWalletLoading || upiLoading;

  // ─────────────────────────────────────────
  //  Init
  // ─────────────────────────────────────────
  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(fetchServiceList());
  }, [dispatch]);

  useEffect(() => {
    if (!rechargeData) {
      navigate("/mobile", { replace: true });
    }
  }, [rechargeData, navigate]);

  // ─────────────────────────────────────────
  //  Cleanup
  // ─────────────────────────────────────────
  const cleanupPayment = useCallback(() => {
    setUpiLoading(false);
    setLoadingStage("");
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
      paymentTimeoutRef.current = null;
    }
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // ─────────────────────────────────────────
  //  Recharge API call (common for both wallet & UPI)
  // ─────────────────────────────────────────
  const performRecharge = useCallback(
    async (paymentMethod = "WALLET", upiOrderId = null) => {
      if (
        !rechargeData?.mobileNumber ||
        !rechargeData?.operator?.OperatorCode
      ) {
        ToastComp({ message: "Invalid recharge data", type: "error" });
        return;
      }

      try {
        const payload = {
          MobileNumber: rechargeData.mobileNumber,
          Operator_Code: rechargeData.operator.OperatorCode,
          Circle_Code: rechargeData.circle?.circlecode || null,
          amount: payableAmount,
          isPrepaid: true,
        };

        const res = await dispatch(RechargeRequest(payload));

        if (!res?.payload) throw new Error("No response from server");

        const { ResponseStatus, Data, Remarks } = res.payload;
        if (ResponseStatus !== 1) throw new Error(Remarks || "Recharge failed");

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
              paymentMethod,
              ...(upiOrderId && { upiOrderId }),
              ...(status === "success" && {
                OP_REF: Data?.opRefNo || Data?.operator_ref_id,
              }),
            },
          });
        } else {
          throw new Error(Data?.message || "Recharge status unknown");
        }
      } catch (error) {
        console.error("Recharge Error:", error);
        const msg =
          error?.response?.data?.Remarks ||
          error?.payload?.Remarks ||
          error?.message ||
          "Recharge Failed. Please try again.";

        if (upiOrderId) {
          // Payment was successful but recharge failed
          ToastComp({
            message: `Payment done but recharge failed. Contact support. Order: ${upiOrderId}`,
            type: "error",
          });
        } else {
          ToastComp({ message: msg, type: "error" });
        }
      }
    },
    [rechargeData, payableAmount, dispatch, navigate],
  );

  // ─────────────────────────────────────────
  //  Wallet Payment
  // ─────────────────────────────────────────
  const handleWalletPayment = useCallback(async () => {
    if (!isWalletSufficient) {
      ToastComp({
        message: "Insufficient wallet balance. Add money first.",
        type: "error",
      });
      return;
    }
    setIsWalletLoading(true);
    try {
      await performRecharge("WALLET");
    } finally {
      setIsWalletLoading(false);
    }
  }, [isWalletSufficient, performRecharge]);

  // ─────────────────────────────────────────
  //  Cashfree UPI Payment Verification (polling)
  // ─────────────────────────────────────────
  const verifyAndRecharge = useCallback(
    async (completedOrderId, attempt = 0) => {
      const MAX_ATTEMPTS = 8;
      setUpiLoading(true);
      setLoadingStage("verifying");

      try {
        const res = await API.post("payment/cashfree/verify-order", {
          orderId: completedOrderId,
        });

        const payments = res.data;

        if (Array.isArray(payments) && payments.length > 0) {
          const p = payments[0];

          if (p.payment_status === "SUCCESS") {
            // ✅ Payment SUCCESS → Now do the recharge
            setLoadingStage("recharging");

            // Small delay for UX
            paymentTimeoutRef.current = setTimeout(async () => {
              await performRecharge("UPI", completedOrderId);
              cleanupPayment();
            }, 1000);
            return;
          }

          if (
            (p.payment_status === "PENDING" ||
              p.payment_status === "NOT_ATTEMPTED") &&
            attempt < MAX_ATTEMPTS
          ) {
            pollingRef.current = setTimeout(
              () => verifyAndRecharge(completedOrderId, attempt + 1),
              3000,
            );
            return;
          }

          // Failed
          cleanupPayment();
          ToastComp({
            message:
              p.payment_status === "PENDING"
                ? "Payment pending. Try again later."
                : "Payment failed. Please try again.",
            type: "error",
          });
        } else if (attempt < MAX_ATTEMPTS) {
          pollingRef.current = setTimeout(
            () => verifyAndRecharge(completedOrderId, attempt + 1),
            3000,
          );
        } else {
          cleanupPayment();
          ToastComp({
            message: "Could not verify payment. Try again.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Verify error:", error);
        if (attempt < MAX_ATTEMPTS) {
          pollingRef.current = setTimeout(
            () => verifyAndRecharge(completedOrderId, attempt + 1),
            3000,
          );
        } else {
          cleanupPayment();
          ToastComp({ message: "Error verifying payment", type: "error" });
        }
      }
    },
    [performRecharge, cleanupPayment],
  );

  // ─────────────────────────────────────────
  //  Cashfree UPI Payment Initiation
  //  (Same pattern as working Wallet component)
  // ─────────────────────────────────────────
  const handleUPIPayment = useCallback(async () => {
    setUpiLoading(true);
    setLoadingStage("creating");

    try {
      // 1. Create Cashfree order
      const response = await API.post("payment/cashfree/create-order", {
        amount: payableAmount,
      });

      const data = response.data;

      if (!data?.payment_session_id || !data?.order_id) {
        cleanupPayment();
        ToastComp({ message: "Failed to create order", type: "error" });
        return;
      }

      setOrderId(data.order_id);
      setLoadingStage("opening");

      // 2. Send to React Native — same action as Wallet
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
  }, [payableAmount, cleanupPayment]);

  // ─────────────────────────────────────────
  //  Listen for messages from React Native
  //  (Same pattern as working Wallet component)
  // ─────────────────────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const message =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // ✅ Payment success from React Native
        if (message.type === "PAYMENT_SUCCESS") {
          const oid = message.data?.orderId || orderId;
          if (oid) {
            // Verify payment and then do recharge
            verifyAndRecharge(oid);
          }
        }

        // ❌ Payment failed
        if (message.type === "PAYMENT_FAILED") {
          cleanupPayment();
          ToastComp({
            message:
              message.data?.message || "Payment failed. Please try again.",
            type: "error",
          });
        }

        // 📱 No UPI app
        if (message.type === "NO_UPI_APP") {
          cleanupPayment();
          ToastComp({
            message: "No UPI app installed on your device",
            type: "error",
          });
        }

        // ✅ Payment completed (user returned from UPI app)
        if (message.type === "PAYMENT_COMPLETED") {
          const oid = message.data?.orderId || orderId;
          if (oid) verifyAndRecharge(oid);
        }
      } catch (error) {
        // Not JSON — ignore
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
  }, [orderId]);

  // ─────────────────────────────────────────
  //  Main Payment Handler
  // ─────────────────────────────────────────
  const handlePayment = useCallback(() => {
    if (walletSelect) {
      handleWalletPayment();
    } else {
      handleUPIPayment();
    }
  }, [walletSelect, handleWalletPayment, handleUPIPayment]);

  // ─────────────────────────────────────────
  //  Render guards
  // ─────────────────────────────────────────
  if (!rechargeData) return null;

  // Button state
  const isButtonDisabled = isLoading || (walletSelect && !isWalletSufficient);
  const buttonTitle = isLoading
    ? "Processing..."
    : walletSelect && !isWalletSufficient
      ? "💰 Insufficient Wallet Balance"
      : `Pay ₹${payableAmount}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
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
      <div className="pt-20 pb-32 px-3 sm:px-4 max-w-2xl mx-auto">
        {/* ── Plan Details Card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
          {/* Header */}
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
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 flex items-center gap-1 disabled:opacity-50"
              >
                <MdEdit size={14} />
                Change
              </button>
            </div>
          </div>

          {/* Plan Info */}
          <div className="p-5">
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
              <div className="text-center flex-1">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Amount
                </p>
                <p className="text-3xl font-black text-slate-900">
                  ₹{rechargeData.plans.amount}
                </p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center flex-1">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Data
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {rechargeData.plans.data || "N/A"}
                </p>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="text-center flex-1">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mb-1">
                  Validity
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {rechargeData.plans.validity}
                </p>
              </div>
            </div>

            {/* Description */}
            {rechargeData.plans.desc && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Plan Details:
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rechargeData.plans.desc}
                </p>
              </div>
            )}

            {/* Benefits */}
            {rechargeData.plans.planBenefitItemList?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-3">
                  Benefits:
                </p>
                <div className="flex items-center -space-x-2">
                  {rechargeData.plans.planBenefitItemList
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 p-2 shadow-sm"
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

        {/* ── Payment Methods ── */}
        <div className="mt-5">
          <h3 className="text-base font-black text-slate-900 mb-3 px-1">
            Payment Method
          </h3>

          {/* Wallet Option */}
          <div
            onClick={() => !isLoading && dispatch(setWalletSelect(true))}
            className={[
              "bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all mb-3",
              walletSelect ? "border-slate-900 shadow-lg" : "border-slate-200",
              isLoading ? "opacity-60 pointer-events-none" : "",
            ].join(" ")}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    walletSelect ? "bg-slate-900" : "bg-slate-100",
                  ].join(" ")}
                >
                  <MdAccountBalanceWallet
                    size={22}
                    className={walletSelect ? "text-white" : "text-slate-600"}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Wallet Balance
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-slate-900">
                      ₹
                      {walletBalance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    {!isWalletSufficient && (
                      <span className="text-[9px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                        Low
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/wallet");
                }}
                className="bg-slate-900 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 text-xs font-bold"
              >
                <MdOutlineAddCircleOutline size={16} />
                Add
              </button>
            </div>

            {walletSelect && (
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-emerald-600" size={14} />
                  <p className="text-[11px] text-slate-700 font-semibold">
                    Selected
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* UPI Option */}
          {FindDirectPay?.status && (
            <div
              onClick={() => !isLoading && dispatch(setWalletSelect(false))}
              className={[
                "bg-white rounded-2xl border-2 overflow-hidden cursor-pointer transition-all",
                !walletSelect
                  ? "border-slate-900 shadow-lg"
                  : "border-slate-200",
                isLoading ? "opacity-60 pointer-events-none" : "",
              ].join(" ")}
            >
              <div className="p-4 flex items-center gap-3">
                <div
                  className={[
                    "w-11 h-11 rounded-xl flex items-center justify-center",
                    !walletSelect ? "bg-slate-900" : "bg-slate-100",
                  ].join(" ")}
                >
                  <MdCreditCard
                    size={22}
                    className={!walletSelect ? "text-white" : "text-slate-600"}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Pay with UPI
                  </p>
                  <p className="text-lg font-black text-slate-900">
                    UPI Payment
                  </p>
                </div>
              </div>

              {!walletSelect && (
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <MdCheckCircle className="text-emerald-600" size={14} />
                    <p className="text-[11px] text-slate-700 font-semibold">
                      Selected
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Payment Summary ── */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Total Payable
            </p>
            <p className="text-2xl font-black text-slate-900">
              ₹{payableAmount}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Button ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/92 backdrop-blur-xl border-t border-slate-200 z-40">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
          <button
            onClick={handlePayment}
            disabled={isButtonDisabled}
            className={[
              "w-full rounded-2xl py-4 px-5 font-black flex items-center justify-center gap-2 transition text-base",
              !isButtonDisabled
                ? "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed",
            ].join(" ")}
          >
            {isLoading ? (
              <>
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Processing...
              </>
            ) : (
              buttonTitle
            )}
          </button>
        </div>
      </div>

      {/* ── Loader / Wallet recharge ── */}
      {isWalletLoading && <Loader />}

      {/* ── UPI Loading Overlay (same as Wallet component) ── */}
      {upiLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-6">
            {loadingStage === "creating" && (
              <UPIStage
                title="Creating order"
                desc="Please wait..."
                icon="spinner"
              />
            )}
            {loadingStage === "opening" && (
              <UPIStage
                title="Opening UPI app"
                desc="Redirecting..."
                icon="phone"
              />
            )}
            {loadingStage === "waiting" && (
              <UPIStage
                title="Complete payment"
                desc="Please complete payment in UPI app"
                icon="hourglass"
              />
            )}
            {loadingStage === "verifying" && (
              <UPIStage
                title="Verifying payment"
                desc="Almost done..."
                icon="spinner"
              />
            )}
            {loadingStage === "recharging" && (
              <UPIStage
                title="Processing recharge"
                desc="Payment done! Recharging now..."
                icon="spinner"
              />
            )}

            {orderId && (
              <p className="mt-5 text-[11px] text-center text-slate-500 font-semibold break-all">
                Order: {orderId}
              </p>
            )}

            {/* Manual trigger button during waiting */}
            {loadingStage === "waiting" && (
              <button
                onClick={() => {
                  if (orderId) verifyAndRecharge(orderId);
                }}
                className="mt-4 w-full py-3 rounded-2xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                I've completed the payment
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
//  UPI Stage loading indicator
// ─────────────────────────────────────────────
const UPIStage = ({ title, desc, icon }) => (
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

export default PaymentConfirm;

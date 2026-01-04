// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CommonHeader from "../../Components/CommonHeader";
// import BottomSheet from "../../Components/BottomSheet";
// import { IoIosArrowForward } from "react-icons/io";
// import { useDispatch, useSelector } from "react-redux";
// import { GOOGLE_PLAY_PAYMENT } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import ToastComp from "../../Components/ToastComp";
// import ButtonComp from "../../Components/ButtonComp";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import { primaryColor } from "../../Utils/Style";
// import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
// import { MdOutlineAddCircleOutline } from "react-icons/md";
// import Loader from "../../Components/Loader";
// import LoaderModal from "../../Components/LoaderModal";

// const GooglePlay = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
//   const [amount, setAmount] = useState(100);
//   const [load, setLoad] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);
//   const [content, setContent] = useState();
//   const [title, setTitle] = useState();

//   const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
//   const isLowBalance = useMemo(
//     () => Number(amount) > Number(walletBalance),
//     [amount, walletBalance]
//   );

//   const HowtoRedeem = () => (
//     <div>
//       <p className="mb-4 text-sm text-slate-600">
//         Follow the steps to redeem your code.
//       </p>
//       <div className="text-slate-700 space-y-2">
//         <p className="text-sm">1. Visit Google PlayStore or play.google.com</p>
//         <p className="text-sm">
//           2. Tap your profile → Payments &amp; subscriptions
//         </p>
//         <p className="text-sm">
//           3. Redeem code → Enter gift card / code and confirm
//         </p>
//       </div>
//     </div>
//   );

//   const ThingNoted = () => (
//     <div className="text-sm text-slate-700 space-y-3">
//       <p className="text-slate-600">Google Play Terms &amp; Conditions:</p>
//       <ul className="list-disc pl-5 space-y-2">
//         <li>Recharge code purchases are non-refundable.</li>
//         <li>Usable on Google Play Store for eligible digital content only.</li>
//         <li>Indian residents aged 18+. (13–17 requires guardian consent.)</li>
//         <li>Issued by Google Payment Singapore Pte. Ltd.</li>
//         <li>Requires Google Payments account &amp; internet to redeem.</li>
//         <li>Other limits may apply. No fees or expiration.</li>
//         <li>
//           Not redeemable for cash, not reloadable/refundable; user responsible
//           for loss.
//         </li>
//       </ul>
//     </div>
//   );

//   // ---------------- LOGIC SAME (Payment flow) ----------------
//   const handlePayNow = async () => {
//     try {
//       setLoad(true);

//       if (Number(amount) < 50) {
//         ToastComp({ message: "Minimum Recharge amount is ₹50", type: "error" });
//         return;
//       }

//       const valData = {
//         number: ProfileData?.Data?.phone,
//         amount: Number(amount),
//         serviceId: ids,
//       };

//       const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));
//       handlePaymentResponse(res?.payload);
//     } catch (error) {
//       handlePaymentError(error);
//     } finally {
//       setLoad(false);
//     }
//   };

//   const handlePaymentResponse = (payload) => {
//     if (!payload) throw new Error("No response received from server");

//     if (payload.ResponseStatus === 0) {
//       throw new Error(
//         payload.Remarks ||
//           payload.message ||
//           "Transaction failed. Please try again."
//       );
//     }

//     if (payload.ResponseStatus === 1) {
//       const data = payload.Data || {};
//       const { status, transactionId, opRefNo, operator_ref_id } = data;

//       if (["Success", "success", "Pending", "pending"].includes(status)) {
//         const responseData = {
//           MobileNumber: ProfileData?.Data?.phone,
//           Operator_Code: "GOOGLE PLAY",
//           amount,
//           transactionId,
//           status,
//           type: "GOOGLEPLAY",
//           OP_REF: opRefNo || operator_ref_id,
//         };
//         navigate("/bbpsstatus", { state: responseData });
//         return;
//       }

//       throw new Error(data.message || "Transaction failed");
//     }

//     throw new Error(
//       payload.Remarks ||
//         payload.message ||
//         "Transaction failed. Please try again."
//     );
//   };

//   const handlePaymentError = (error) => {
//     const errorMessages = {
//       "Network Error": "Network error. Please check your internet connection.",
//       timeout: "Request timeout. Please try again.",
//       insufficient: "Insufficient balance. Please recharge your wallet.",
//       invalid: "Invalid details provided. Please check and try again.",
//     };

//     let message = error?.message || "Something went wrong. Please try again.";
//     const errorKey = Object.keys(errorMessages).find((key) =>
//       message.toLowerCase().includes(key.toLowerCase())
//     );
//     if (errorKey) message = errorMessages[errorKey];

//     ToastComp({ message, type: "error" });
//   };
//   // ----------------------------------------------------------

//   useEffect(() => {
//     dispatch(getUserProfile());
//   }, [dispatch]);

//   const formatINR = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(Number(value || 0));

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
//         {/* Header */}
//         <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200">
//           <CommonHeader
//             title={"Google Play"}
//             handleclick={() => navigate(-1)}
//             rightDesign={() => (
//               <img
//                 width={44}
//                 height={22}
//                 alt="Google Play"
//                 className="object-contain"
//                 src="https://production-api.billbro.info/uploads/services/1745668990300-APD_icon_GPRC._CB594689751_.png"
//               />
//             )}
//           />
//         </div>

//         {/* Content */}
//         <div className="pt-20 pb-[132px] px-3 sm:px-4">
//           {/* Amount Card */}
//           <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
//             <div className="p-4 sm:p-5">
//               <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
//                 Enter amount
//               </p>

//               <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-3">
//                 <span className="text-lg font-black text-slate-900">₹</span>
//                 <input
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   type="number"
//                   placeholder="Enter Amount"
//                   className="min-w-0 flex-1 bg-transparent outline-none placeholder-slate-400 text-slate-900 font-black text-lg"
//                   onInput={(e) => {
//                     e.target.value = e.target.value.replace(/[^0-9]/g, "");
//                   }}
//                 />
//                 <span className="text-[10px] sm:text-xs font-bold text-slate-500">
//                   INR
//                 </span>
//               </div>

//               {/* Quick chips */}
//               <div className="mt-4 -mx-1 px-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//                 {PriceArr.map((item, idx) => {
//                   const active = Number(amount) === item;
//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => setAmount(item)}
//                       className={[
//                         "shrink-0 rounded-full border transition font-extrabold tracking-wide",
//                         "px-3 py-2 text-[11px] sm:px-4 sm:text-xs",
//                         active
//                           ? "bg-slate-900 text-white border-slate-900"
//                           : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
//                       ].join(" ")}
//                     >
//                       ₹{item}
//                     </button>
//                   );
//                 })}
//               </div>

//               <div className="mt-4 flex items-center justify-between gap-2 text-xs">
//                 <span className="text-slate-500 font-semibold">
//                   Minimum: ₹50
//                 </span>
//                 {Number(amount) > 0 && (
//                   <span className="text-slate-600 font-bold truncate">
//                     You’ll pay: ₹{Number(amount).toLocaleString("en-IN")}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="h-px bg-slate-200" />

//             {/* Payment Method */}
//             <div className="p-4 sm:p-5">
//               <div className="flex items-center justify-between">
//                 <p className="text-sm font-black text-slate-900">
//                   Select payment method
//                 </p>
//                 <span className="text-[11px] font-bold text-slate-500">
//                   Secure
//                 </span>
//               </div>

//               {/* Wallet option */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(setWalletSelect(true))}
//                 className={[
//                   "mt-3 w-full rounded-2xl border p-4 text-left transition",
//                   walletSelect
//                     ? "border-[var(--pc)] bg-[rgba(20,71,230,0.06)]"
//                     : "border-slate-200 bg-white hover:bg-slate-50",
//                 ].join(" ")}
//                 style={{ "--pc": primaryColor }}
//               >
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   {/* Left */}
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div className="h-11 w-11 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
//                       <img
//                         width={24}
//                         alt="Wallet"
//                         src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
//                       />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
//                         Wallet balance
//                       </p>

//                       <div className="mt-1 flex items-center gap-2 flex-wrap">
//                         <p className="text-base font-black text-slate-900">
//                           ₹{formatINR(walletBalance)}
//                         </p>

//                         {walletSelect && isLowBalance && (
//                           <span className="text-[10px] font-black bg-rose-500 text-white rounded-full px-2 py-1">
//                             Low balance
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right - responsive */}
//                   <div className="flex items-center justify-end">
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate("/wallet");
//                       }}
//                       className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 text-white px-3 py-2 w-full sm:w-auto"
//                     >
//                       <MdOutlineAddCircleOutline size={18} />
//                       <span className="text-[11px] font-bold tracking-wide">
//                         Add money
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               </button>

//               {/* UPI option */}
//               <button
//                 type="button"
//                 onClick={() => dispatch(setWalletSelect(false))}
//                 className={[
//                   "mt-3 w-full rounded-2xl border p-4 text-left transition flex items-start sm:items-center justify-between gap-3",
//                   !walletSelect
//                     ? "border-[var(--pc)] bg-[rgba(20,71,230,0.06)]"
//                     : "border-slate-200 bg-white hover:bg-slate-50",
//                 ].join(" ")}
//                 style={{ "--pc": primaryColor }}
//               >
//                 <div className="flex items-center gap-3 min-w-0">
//                   <div className="h-11 w-11 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
//                     <img
//                       width={26}
//                       alt="UPI"
//                       src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
//                     />
//                   </div>

//                   <div className="min-w-0">
//                     <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
//                       UPI
//                     </p>
//                     <p className="mt-1 text-sm font-black text-slate-900">
//                       Pay via any UPI app
//                     </p>
//                   </div>
//                 </div>

//                 <span className="shrink-0 text-[10px] sm:text-xs font-black text-slate-600 rounded-full bg-slate-100 px-2 py-1">
//                   Recommended
//                 </span>
//               </button>
//             </div>
//           </div>

//           {/* Info links */}
//           <div className="mt-5 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] overflow-hidden">
//             <button
//               onClick={() => {
//                 setIsOpen(true);
//                 setContent(HowtoRedeem);
//                 setTitle("How to Redeem");
//               }}
//               className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 transition"
//             >
//               <div className="text-left min-w-0">
//                 <p className="text-sm font-black text-slate-900">
//                   How to Redeem
//                 </p>
//                 <p className="mt-0.5 text-xs text-slate-500 truncate">
//                   Steps to redeem your Google Play code
//                 </p>
//               </div>
//               <IoIosArrowForward className="text-slate-400 shrink-0" />
//             </button>

//             <div className="h-px bg-slate-200" />

//             <button
//               onClick={() => {
//                 setIsOpen(true);
//                 setContent(ThingNoted);
//                 setTitle("Things to be Noted");
//               }}
//               className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 transition"
//             >
//               <div className="text-left min-w-0">
//                 <p className="text-sm font-black text-slate-900">
//                   Things to be Noted
//                 </p>
//                 <p className="mt-0.5 text-xs text-slate-500 truncate">
//                   Terms &amp; conditions and important notes
//                 </p>
//               </div>
//               <IoIosArrowForward className="text-slate-400 shrink-0" />
//             </button>
//           </div>

//           {walletSelect && isLowBalance && (
//             <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
//               <p className="text-xs font-semibold text-rose-700">
//                 Wallet balance is low. Add money or choose UPI to continue.
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Sticky Bottom CTA */}
//         <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/92 backdrop-blur-xl border-t border-slate-200">
//           <div className="px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
//             <ButtonComp
//               disabled={walletSelect && isLowBalance}
//               title={
//                 walletSelect && isLowBalance
//                   ? "Wallet Balance is Low!"
//                   : "Proceed to pay"
//               }
//               handleClick={handlePayNow}
//             />
//             <p className="mt-2 text-[11px] text-center text-slate-500 font-semibold">
//               By continuing, you agree to the terms shown above.
//             </p>
//           </div>
//         </div>

//         <BottomSheet
//           setIsOpen={setIsOpen}
//           isOpen={isOpen}
//           content={content}
//           title={title}
//         />
//       </div>

//       {load && <LoaderModal variant="bbps" />}
//     </>
//   );
// };

// const PriceArr = [50, 100, 200, 500, 1000, 5000];

// export default GooglePlay;
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import BottomSheet from "../../Components/BottomSheet";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { GOOGLE_PLAY_PAYMENT } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import LoaderModal from "../../Components/LoaderModal";

// ✅ Same hooks/components used in BillPreview flow
import { useUPIPayment } from "../../hooks/useUPIPayment";
import { usePaymentService } from "../../hooks/usePaymentService";
import PaymentMethodSelector from "../../Components/PaymentMethodSelector";

const PriceArr = [50, 100, 200, 500, 1000, 5000];

const GooglePlay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);

  const [amount, setAmount] = useState("100");
  const [selectedQuick, setSelectedQuick] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState();
  const [title, setTitle] = useState();

  // ✅ Payment Service Hook (centralized wallet, sufficiency, toast handlers)
  const { walletBalance, isWalletSufficient, showError, showSuccess } =
    usePaymentService();

  const numericAmount = Number(amount || 0);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const isMinInvalid = useMemo(
    () => numericAmount > 0 && numericAmount < 50,
    [numericAmount]
  );

  const HowtoRedeem = () => (
    <div>
      <p className="mb-4 text-sm text-slate-600">
        Follow the steps to redeem your code.
      </p>
      <div className="text-slate-700 space-y-2">
        <p className="text-sm">1. Visit Google PlayStore or play.google.com</p>
        <p className="text-sm">
          2. Tap your profile → Payments &amp; subscriptions
        </p>
        <p className="text-sm">
          3. Redeem code → Enter gift card / code and confirm
        </p>
      </div>
    </div>
  );

  const ThingNoted = () => (
    <div className="text-sm text-slate-700 space-y-3">
      <p className="text-slate-600">Google Play Terms &amp; Conditions:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Recharge code purchases are non-refundable.</li>
        <li>Usable on Google Play Store for eligible digital content only.</li>
        <li>Indian residents aged 18+. (13–17 requires guardian consent.)</li>
        <li>Issued by Google Payment Singapore Pte. Ltd.</li>
        <li>Requires Google Payments account &amp; internet to redeem.</li>
        <li>Other limits may apply. No fees or expiration.</li>
        <li>
          Not redeemable for cash, not reloadable/refundable; user responsible
          for loss.
        </li>
      </ul>
    </div>
  );

  // --- Helpers (same style as BillPreview) ---
  const preparePaymentData = useCallback(
    (upiOrderId) => {
      const phone = ProfileData?.Data?.phone;
      return {
        number: phone,
        amount: numericAmount,
        serviceId: ids,
        // If backend wants UPI reference, uncomment:
        // upiOrderId,
      };
    },
    [ProfileData?.Data?.phone, numericAmount, ids]
  );

  const handlePaymentResponse = useCallback(
    (payload, paymentMethod, upiOrderId) => {
      if (!payload) throw new Error("No response received from server");

      if (payload.ResponseStatus === 0) {
        throw new Error(
          payload.Remarks ||
            payload.message ||
            "Transaction failed. Please try again."
        );
      }

      if (payload.ResponseStatus === 1) {
        const data = payload.Data || {};
        const { status, transactionId, opRefNo, operator_ref_id } = data;

        if (["Success", "success", "Pending", "pending"].includes(status)) {
          const responseData = {
            MobileNumber: ProfileData?.Data?.phone,
            Operator_Code: "GOOGLE PLAY",
            amount: numericAmount,
            transactionId,
            status,
            type: "GOOGLEPLAY",
            paymentMethod, // ✅ WALLET / UPI
            upiOrderId, // ✅ only for UPI
            OP_REF: opRefNo || operator_ref_id,
          };
          navigate("/bbpsstatus", { state: responseData });
          return;
        }

        throw new Error(data.message || "Transaction failed");
      }

      throw new Error(
        payload.Remarks ||
          payload.message ||
          "Transaction failed. Please try again."
      );
    },
    [ProfileData?.Data?.phone, navigate, numericAmount]
  );

  const handlePaymentError = useCallback(
    (error) => {
      const errorMessages = {
        "Network Error":
          "Network error. Please check your internet connection.",
        timeout: "Request timeout. Please try again.",
        insufficient: "Insufficient balance. Please recharge your wallet.",
        invalid: "Invalid details provided. Please check and try again.",
      };

      let message = error?.message || "Something went wrong. Please try again.";
      const errorKey = Object.keys(errorMessages).find((key) =>
        message.toLowerCase().includes(key.toLowerCase())
      );
      if (errorKey) message = errorMessages[errorKey];

      showError(message);
    },
    [showError]
  );

  // --- WALLET payment ---
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const performWalletPayment = useCallback(async () => {
    if (!numericAmount || numericAmount <= 0) {
      showError("Please enter a valid amount");
      return;
    }
    if (numericAmount < 50) {
      showError("Minimum Recharge amount is ₹50");
      return;
    }
    if (!isWalletSufficient(numericAmount)) {
      showError("❌ Insufficient wallet balance. Please add money.");
      return;
    }

    setIsWalletLoading(true);
    try {
      const valData = preparePaymentData();
      const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));
      handlePaymentResponse(res?.payload, "WALLET");
    } catch (e) {
      handlePaymentError(e);
    } finally {
      setIsWalletLoading(false);
    }
  }, [
    numericAmount,
    isWalletSufficient,
    dispatch,
    preparePaymentData,
    handlePaymentResponse,
    handlePaymentError,
    showError,
  ]);

  // --- UPI payment -> after success call GOOGLE_PLAY_PAYMENT ---
  const performPaymentAfterUPI = useCallback(
    async (upiOrderId) => {
      try {
        const valData = preparePaymentData(upiOrderId);
        const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));

        if (!res?.payload) throw new Error("No response from payment service");

        const { ResponseStatus, Data, Remarks } = res.payload;
        if (ResponseStatus !== 1 || !Data) {
          throw new Error(Remarks || "Payment failed after UPI");
        }

        handlePaymentResponse(res.payload, "UPI", upiOrderId);
      } catch (error) {
        console.error("❌ Post-UPI Google Play Error:", error);
        showError(
          `Payment successful but service failed. Contact support with Order ID: ${upiOrderId}`
        );
      }
    },
    [dispatch, preparePaymentData, handlePaymentResponse, showError]
  );

  const {
    isLoading: isUPILoading,
    initiatePayment,
    getLoadingMessage,
  } = useUPIPayment(performPaymentAfterUPI, (error) =>
    console.error("UPI Payment Error:", error)
  );

  const isLoading = isWalletLoading || isUPILoading;

  // --- Main CTA ---
  const handleProceed = useCallback(() => {
    if (!numericAmount || numericAmount <= 0) {
      showError("Please enter a valid amount");
      return;
    }
    if (numericAmount < 50) {
      showError("Minimum Recharge amount is ₹50");
      return;
    }

    if (walletSelect) {
      performWalletPayment();
    } else {
      initiatePayment(numericAmount);
    }
  }, [
    numericAmount,
    walletSelect,
    performWalletPayment,
    initiatePayment,
    showError,
  ]);

  const isButtonDisabled =
    isLoading ||
    !numericAmount ||
    numericAmount <= 0 ||
    (walletSelect && !isWalletSufficient(numericAmount));

  const buttonTitle = isLoading
    ? walletSelect
      ? "Processing..."
      : getLoadingMessage()
    : walletSelect && !isWalletSufficient(numericAmount)
    ? "💰 Insufficient Wallet Balance"
    : `Pay ₹${numericAmount}`;

  const onAmountChange = (e) => {
    const v = String(e.target.value || "").replace(/[^0-9]/g, "");
    setAmount(v);
    setSelectedQuick(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200">
          <CommonHeader
            title={"Google Play"}
            handleclick={() => !isLoading && navigate(-1)}
            rightDesign={() => (
              <img
                width={44}
                height={22}
                alt="Google Play"
                className="object-contain"
                src="https://production-api.billbro.info/uploads/services/1745668990300-APD_icon_GPRC._CB594689751_.png"
              />
            )}
          />
        </div>

        {/* Content */}
        <div className="pt-20 pb-[132px] px-3 sm:px-4">
          {/* Amount Card */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Enter amount
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 py-3">
                <span className="text-lg font-black text-slate-900">₹</span>
                <input
                  value={amount}
                  onChange={onAmountChange}
                  inputMode="numeric"
                  placeholder="Enter Amount"
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder-slate-400 text-slate-900 font-black text-lg disabled:opacity-60"
                />
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">
                  INR
                </span>
              </div>

              {/* Quick chips */}
              <div className="mt-4 -mx-1 px-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PriceArr.map((item, idx) => {
                  const active =
                    Number(amount) === item || selectedQuick === item;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setSelectedQuick(item);
                        setAmount(String(item));
                      }}
                      className={[
                        "shrink-0 rounded-full border transition font-extrabold tracking-wide disabled:opacity-60 disabled:cursor-not-allowed",
                        "px-3 py-2 text-[11px] sm:px-4 sm:text-xs",
                        active
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      ₹{item}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 font-semibold">
                  Minimum: ₹50
                </span>
                {numericAmount > 0 && (
                  <span className="text-slate-600 font-bold truncate">
                    You’ll pay: ₹{numericAmount.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {isMinInvalid && (
                <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-xs font-semibold text-rose-700">
                    Minimum Recharge amount is ₹50.
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-200" />

            {/* ✅ Payment Method Selector (BillPreview style) */}
            <div className="p-4">
              <div className="">
                <PaymentMethodSelector
                  walletBalance={walletBalance}
                  payableAmount={numericAmount}
                  isLoading={isLoading}
                />
              </div>

              {walletSelect &&
                numericAmount > 0 &&
                isWalletSufficient(numericAmount) && (
                  <p className="mt-2 text-center text-[11px] text-slate-500 font-semibold">
                    Paying from wallet • Balance after pay:{" "}
                    <span className="font-black text-slate-700">
                      ₹{(walletBalance - numericAmount).toFixed(2)}
                    </span>
                  </p>
                )}
            </div>
          </div>

          {/* Info links */}
          <div className="mt-5 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setContent(HowtoRedeem);
                setTitle("How to Redeem");
              }}
              className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 transition"
            >
              <div className="text-left min-w-0">
                <p className="text-sm font-black text-slate-900">
                  How to Redeem
                </p>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  Steps to redeem your Google Play code
                </p>
              </div>
              <IoIosArrowForward className="text-slate-400 shrink-0" />
            </button>

            <div className="h-px bg-slate-200" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setContent(ThingNoted);
                setTitle("Things to be Noted");
              }}
              className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 hover:bg-slate-50 transition"
            >
              <div className="text-left min-w-0">
                <p className="text-sm font-black text-slate-900">
                  Things to be Noted
                </p>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  Terms &amp; conditions and important notes
                </p>
              </div>
              <IoIosArrowForward className="text-slate-400 shrink-0" />
            </button>
          </div>

          {walletSelect &&
            numericAmount > 0 &&
            !isWalletSufficient(numericAmount) && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <p className="text-xs font-semibold text-rose-700">
                  Wallet balance is low. Add money or choose UPI to continue.
                </p>
              </div>
            )}
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/92 backdrop-blur-xl border-t border-slate-200">
          <div className="px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] max-w-xl mx-auto">
            <button
              type="button"
              onClick={handleProceed}
              disabled={isButtonDisabled}
              className={[
                "w-full rounded-2xl px-4 py-4 font-black text-base flex items-center justify-center gap-2 transition active:scale-[0.99]",
                isButtonDisabled
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 text-white shadow-[0_18px_55px_rgba(2,6,23,0.18)]",
              ].join(" ")}
            >
              {buttonTitle}
            </button>

            <p className="mt-2 text-[11px] text-center text-slate-500 font-semibold">
              By continuing, you agree to the terms shown above.
            </p>
          </div>
        </div>

        <BottomSheet
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          content={content}
          title={title}
        />
      </div>

      {isLoading && <LoaderModal variant="bbps" />}
    </>
  );
};

export default GooglePlay;

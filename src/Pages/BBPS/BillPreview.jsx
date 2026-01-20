// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import { DummyAvatarForPassbook } from "../../Utils/MockData";
// import { useDispatch, useSelector } from "react-redux";
// import ToastComp from "../../Components/ToastComp";
// import CommonHeader from "../../Components/CommonHeader";
// import { useNavigate } from "react-router-dom";
// import Loader from "../../Components/Loader";
// import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
// import {
//   MdOutlineAddCircleOutline,
//   MdAccountBalanceWallet,
//   MdCalendarToday,
//   MdInfo,
//   MdCheckCircle,
// } from "react-icons/md";
// import { IoFlashSharp } from "react-icons/io5";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import { BBPS_PAY_BILL } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import LoaderModal from "../../Components/LoaderModal";

// const QUICK_ADD = [100, 200, 500, 1000, 5000, 10000];

// const BillPreview = ({ data, operatorData, number, ButtonName }) => {
//   const [load, setLoad] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
//   const { serviceList, serviceLoader } = useSelector(
//     (state) => state.ServiceSlice.service
//   );
//   const FindDirectPay = serviceList.Data?.find((a) => a.name == "DIRECT_UPI");
//   const [amount, setAmount] = useState("");
//   const [selectedQuick, setSelectedQuick] = useState(null);

//   const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
//   const numericAmount = Number(amount || 0);
//   const isLowBalance = walletBalance < numericAmount;

//   useEffect(() => {
//     dispatch(getUserProfile());
//   }, [dispatch]);

//   useEffect(() => {
//     if (data?.billAmount !== undefined && data?.billAmount !== null) {
//       setAmount(String(data.billAmount));
//     }
//   }, [data?.billAmount]);

//   const title = useMemo(() => {
//     const name = operatorData?.operator_name || "Bill Preview";
//     return name.length > 28 ? `${name.slice(0, 28)}…` : name;
//   }, [operatorData?.operator_name]);

//   const rightDesign = () => (
//     <div className="flex items-center">
//       <img
//         width={92}
//         height={34}
//         src="https://ik.imagekit.io/isjriggan/images%20(1).png"
//         alt="BBPS"
//         className="object-contain"
//       />
//     </div>
//   );

//   const handleQuickAdd = (value) => {
//     if (!data?.acceptPartPay) return;
//     setSelectedQuick(value);
//     const next = (Number(amount || 0) + value).toString();
//     setAmount(next);
//   };

//   // Helper function to prepare payment data (logic same)
//   const preparePaymentData = () => {
//     const baseData = {
//       operator: {
//         name: operatorData.operator_name,
//         category: operatorData.categoryId,
//         operator_id: operatorData.op_id,
//       },
//       amount: Number(amount),
//       serviceId: ids,
//     };

//     // FASTag service
//     if (ids === "64c9e66d1efc768da459ef09") {
//       return {
//         ...baseData,
//         number: number,
//         ad1: operatorData.ad || "",
//       };
//     }

//     // Other services
//     const { cn, ...restFields } = number;
//     const adFields = Object.values(restFields).reduce((acc, val, index) => {
//       acc[`ad${index + 1}`] = val;
//       return acc;
//     }, {});

//     return {
//       ...baseData,
//       number: cn,
//       ...adFields,
//     };
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
//       const dataRes = payload.Data || {};
//       const { status, transactionId, opRefNo, operator_ref_id } = dataRes;

//       if (["Success", "success", "Pending", "pending"].includes(status)) {
//         const responseData = {
//           MobileNumber: number?.cn || number,
//           Operator_Code: operatorData.operator_name,
//           amount: Number(amount),
//           transactionId,
//           status,
//           type: "BBPS",
//           OP_REF: opRefNo || operator_ref_id,
//         };
//         navigate("/bbpsstatus", { state: responseData });
//         return;
//       }

//       throw new Error(dataRes.message || "Transaction failed");
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

//   const handlePayment = async () => {
//     try {
//       setLoad(true);

//       // Validation: Check minimum amount for FASTag
//       if (ids === "64c9e66d1efc768da459ef09" && Number(amount) < 10) {
//         ToastComp({
//           message: "Minimum FASTag recharge amount is ₹10",
//           type: "error",
//         });
//         return;
//       }

//       const valData = preparePaymentData();
//       const res = await dispatch(BBPS_PAY_BILL({ valData }));
//       handlePaymentResponse(res?.payload);
//     } catch (e) {
//       handlePaymentError(e);
//     } finally {
//       setLoad(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
//       {/* Header */}
//       <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
//         <CommonHeader
//           style={{ fontSize: 13 }}
//           title={title}
//           handleclick={() => navigate(-1)}
//           rightDesign={rightDesign}
//         />
//       </div>

//       {/* Content */}
//       <motion.div
//         className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto"
//         initial={{ opacity: 0, y: 6 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.25 }}
//       >
//         {/* Top Summary Card */}
//         <div className="mt-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)]">
//           {/* Header strip */}
//           <div className="p-5 bg-slate-900 text-white">
//             <div className="flex items-center gap-3">
//               <div className="relative shrink-0">
//                 <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 overflow-hidden">
//                   <img
//                     src={DummyAvatarForPassbook}
//                     className="h-full w-full object-cover"
//                     alt="User"
//                     loading="lazy"
//                   />
//                 </div>
//                 <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-black truncate">
//                   {data?.userName || "Customer"}
//                 </p>
//                 <p className="text-xs text-white/75 font-semibold truncate">
//                   {data?.cellNumber ? `📱 ${data.cellNumber}` : "—"}
//                 </p>
//               </div>

//               <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
//                 <MdCheckCircle className="text-2xl" />
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="p-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <InfoPill
//                 icon={<MdCalendarToday className="text-slate-700" />}
//                 label="Bill Date"
//                 value={data?.billdate || "N/A"}
//               />
//               <InfoPill
//                 danger
//                 icon={<MdCalendarToday className="text-rose-700" />}
//                 label="Due Date"
//                 value={data?.dueDate || "N/A"}
//               />
//             </div>

//             {/* Amount input */}
//             <div className="mt-4">
//               <div className="flex items-center justify-between mb-2">
//                 <p className="text-[11px] font-black text-slate-700 tracking-wide uppercase">
//                   Amount
//                 </p>
//                 {data?.acceptPartPay ? (
//                   <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
//                     Part Pay Enabled
//                   </span>
//                 ) : (
//                   <span className="text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full">
//                     Fixed Amount
//                   </span>
//                 )}
//               </div>

//               <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
//                 <div className="flex items-center gap-3">
//                   <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
//                     <span className="text-xl font-black text-slate-900">₹</span>
//                   </div>

//                   <input
//                     disabled={!data?.acceptPartPay}
//                     value={amount}
//                     onChange={(e) => {
//                       const v = e.target.value.replace(/[^0-9]/g, "");
//                       setAmount(v);
//                       setSelectedQuick(null);
//                     }}
//                     inputMode="numeric"
//                     placeholder="Enter Amount"
//                     className="w-full bg-transparent outline-none text-3xl font-black text-slate-900 placeholder:text-slate-300"
//                   />
//                 </div>

//                 {/* Quick add */}
//                 {data?.acceptPartPay && (
//                   <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
//                     {QUICK_ADD.map((v) => {
//                       const active = selectedQuick === v;
//                       return (
//                         <button
//                           key={v}
//                           type="button"
//                           onClick={() => handleQuickAdd(v)}
//                           className={`shrink-0 px-3 py-2 rounded-2xl border text-xs font-black active:scale-95 transition
//                             ${
//                               active
//                                 ? "bg-slate-900 text-white border-slate-900"
//                                 : "bg-white text-slate-800 border-slate-200"
//                             }`}
//                         >
//                           +₹{v}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Payment method */}
//             <div className="mt-5">
//               <p className="text-[11px] font-black text-slate-700 tracking-wide uppercase mb-2">
//                 Payment Method
//               </p>

//               <div className="space-y-3">
//                 {/* Wallet Option */}
//                 <div
//                   onClick={() => dispatch(setWalletSelect(true))}
//                   className={`
//         bg-white/90 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden cursor-pointer
//         transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//         ${
//           walletSelect
//             ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200 border border-transparent"
//             : "border border-slate-200"
//         }
//       `}
//                 >
//                   <div className="p-4 flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-4 min-w-0">
//                       <div
//                         className={`
//               w-12 h-12 rounded-xl flex items-center justify-center shrink-0
//               ${
//                 walletSelect
//                   ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                   : "bg-slate-100"
//               }
//             `}
//                       >
//                         <MdAccountBalanceWallet
//                           size={24}
//                           className={
//                             walletSelect ? "text-white" : "text-slate-700"
//                           }
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="text-xs text-slate-500 font-medium mb-1">
//                           Wallet Balance
//                         </p>

//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="text-lg font-black text-slate-900">
//                             ₹
//                             {new Intl.NumberFormat("en-IN", {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             }).format(walletBalance)}
//                           </p>

//                           {isLowBalance && (
//                             <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
//                               Low Balance
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Add Money Button */}
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate("/wallet");
//                       }}
//                       className="shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
//                     >
//                       <MdOutlineAddCircleOutline size={18} />
//                       <span className="text-xs font-bold">Add Money</span>
//                     </button>
//                   </div>

//                   {walletSelect && (
//                     <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
//                       <div className="flex items-center gap-2">
//                         <MdCheckCircle className="text-purple-600" size={16} />
//                         <p className="text-xs text-purple-700 font-medium">
//                           Selected Payment Method
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* UPI Option */}
//                 {FindDirectPay?.status && (
//                   <div
//                     onClick={() => dispatch(setWalletSelect(false))}
//                     className={`
//         bg-white/90 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden cursor-pointer
//         transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//         ${
//           !walletSelect
//             ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200 border border-transparent"
//             : "border border-slate-200"
//         }
//       `}
//                   >
//                     <div className="p-4 flex items-center justify-between">
//                       <div className="flex items-center gap-4 min-w-0">
//                         <div
//                           className={`
//               w-12 h-12 rounded-xl flex items-center justify-center shrink-0
//               ${
//                 !walletSelect
//                   ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                   : "bg-slate-100"
//               }
//             `}
//                         >
//                           <img
//                             className="w-7 h-7 object-contain"
//                             src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
//                             alt="UPI"
//                           />
//                         </div>

//                         <div className="min-w-0">
//                           <p className="text-xs text-slate-500 font-medium mb-1">
//                             Pay with UPI
//                           </p>
//                           <p className="text-lg font-black text-slate-900">
//                             UPI Payment
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {!walletSelect && (
//                       <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
//                         <div className="flex items-center gap-2">
//                           <MdCheckCircle
//                             className="text-purple-600"
//                             size={16}
//                           />
//                           <p className="text-xs text-purple-700 font-medium">
//                             Selected Payment Method
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Note */}
//             <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex gap-3">
//                 <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
//                   <MdInfo className="text-xl text-slate-700" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-black text-slate-900">
//                     Important note
//                   </p>
//                   <p className="mt-1 text-xs text-slate-600 leading-relaxed">
//                     The service provider may occasionally take up to 72 hours to
//                     process your bill payment. You will be notified once the
//                     payment is confirmed.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Bottom bar */}
//       <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 sm:p-4 safe-area-bottom">
//         <div className="max-w-xl mx-auto">
//           <button
//             onClick={handlePayment}
//             disabled={(walletSelect && isLowBalance) || load || !numericAmount}
//             className={`w-full rounded-2xl px-4 py-4 font-black text-base flex items-center justify-center gap-2 transition active:scale-[0.99]
//               ${
//                 (walletSelect && isLowBalance) || load || !numericAmount
//                   ? "bg-slate-200 text-slate-500 cursor-not-allowed"
//                   : "bg-slate-900 text-white shadow-[0_18px_55px_rgba(2,6,23,0.18)]"
//               }`}
//           >
//             {walletSelect && isLowBalance
//               ? "Wallet Balance is Low!"
//               : `Pay ₹${numericAmount || 0}`}
//             {!((walletSelect && isLowBalance) || load || !numericAmount) && (
//               <IoFlashSharp className="text-xl" />
//             )}
//           </button>

//           {/* tiny helper */}
//           {walletSelect && !isLowBalance && numericAmount > 0 && (
//             <p className="mt-2 text-center text-[11px] text-slate-500 font-semibold">
//               Paying from wallet • Balance after pay:{" "}
//               <span className="font-black text-slate-700">
//                 ₹{(walletBalance - numericAmount).toFixed(2)}
//               </span>
//             </p>
//           )}
//         </div>
//       </div>

//       {load && <LoaderModal variant="bbps" />}
//     </div>
//   );
// };

// const InfoPill = ({ icon, label, value, danger }) => {
//   return (
//     <div
//       className={`rounded-3xl border p-4 flex items-center justify-between gap-3
//         ${
//           danger ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"
//         }`}
//     >
//       <div className="flex items-center gap-3 min-w-0">
//         <div
//           className={`h-10 w-10 rounded-2xl border flex items-center justify-center shrink-0
//             ${
//               danger ? "bg-white border-rose-200" : "bg-white border-slate-200"
//             }`}
//         >
//           {icon}
//         </div>
//         <div className="min-w-0">
//           <p className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
//             {label}
//           </p>
//           <p
//             className={`text-sm font-black truncate ${
//               danger ? "text-rose-700" : "text-slate-900"
//             }`}
//           >
//             {value}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillPreview;
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { useDispatch, useSelector } from "react-redux";
import ToastComp from "../../Components/ToastComp";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineAddCircleOutline,
  MdAccountBalanceWallet,
  MdCalendarToday,
  MdInfo,
  MdCheckCircle,
} from "react-icons/md";
import { IoFlashSharp } from "react-icons/io5";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { BBPS_PAY_BILL } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import LoaderModal from "../../Components/LoaderModal";
import { useUPIPayment } from "../../hooks/useUPIPayment";
import { usePaymentService } from "../../hooks/usePaymentService";
import PaymentMethodSelector from "../../Components/PaymentMethodSelector";

const QUICK_ADD = [100, 200, 500, 1000, 5000, 10000];

const BillPreview = ({ data, operatorData, number, ButtonName }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);

  // Payment Service Hook
  const { walletBalance, isWalletSufficient, showError, showSuccess } =
    usePaymentService();

  const numericAmount = Number(amount || 0);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data?.billAmount !== undefined && data?.billAmount !== null) {
      setAmount(String(data.billAmount));
    }
  }, [data?.billAmount]);

  const title = useMemo(() => {
    const name = operatorData?.operator_name || "Bill Preview";
    return name.length > 28 ? `${name.slice(0, 28)}…` : name;
  }, [operatorData?.operator_name]);

  const rightDesign = () => (
    <div className="flex items-center">
      <img
        width={92}
        height={34}
        src="https://ik.imagekit.io/isjriggan/images%20(1).png"
        alt="BBPS"
        className="object-contain"
      />
    </div>
  );

  const handleQuickAdd = (value) => {
    if (!data?.acceptPartPay) return;
    setSelectedQuick(value);
    const next = (Number(amount || 0) + value).toString();
    setAmount(next);
  };

  // Helper function to prepare payment data
  const preparePaymentData = () => {
    const baseData = {
      operator: {
        name: operatorData.operator_name,
        category: operatorData.categoryId,
        operator_id: operatorData.op_id,
      },
      amount: Number(amount),
      serviceId: ids,
    };

    // FASTag service
    if (ids === "64c9e66d1efc768da459ef09") {
      return {
        ...baseData,
        number: number,
        ad1: operatorData.ad || "",
      };
    }

    // Other services
    const { cn, ...restFields } = number;
    const adFields = Object.values(restFields).reduce((acc, val, index) => {
      acc[`ad${index + 1}`] = val;
      return acc;
    }, {});

    return {
      ...baseData,
      number: cn,
      ...adFields,
    };
  };

  const handlePaymentResponse = (payload) => {
    if (!payload) throw new Error("No response received from server");

    if (payload.ResponseStatus === 0) {
      throw new Error(
        payload.Remarks ||
          payload.message ||
          "Transaction failed. Please try again."
      );
    }

    if (payload.ResponseStatus === 1) {
      const dataRes = payload.Data || {};
      const { status, transactionId, opRefNo, operator_ref_id } = dataRes;

      if (["Success", "success", "Pending", "pending"].includes(status)) {
        const responseData = {
          MobileNumber: number?.cn || number,
          Operator_Code: operatorData.operator_name,
          amount: Number(amount),
          transactionId,
          status,
          type: "BBPS",
          paymentMethod: "WALLET",
          OP_REF: opRefNo || operator_ref_id,
        };
        navigate("/bbpsstatus", { state: responseData });
        return;
      }

      throw new Error(dataRes.message || "Transaction failed");
    }

    throw new Error(
      payload.Remarks ||
        payload.message ||
        "Transaction failed. Please try again."
    );
  };

  const handlePaymentError = (error) => {
    const errorMessages = {
      "Network Error": "Network error. Please check your internet connection.",
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
  };

  // Wallet Bill Payment
  const performWalletBillPayment = useCallback(async () => {
    // Validation for FASTag
    if (ids === "64c9e66d1efc768da459ef09" && Number(amount) < 10) {
      showError("Minimum FASTag recharge amount is ₹10");
      return;
    }

    if (!isWalletSufficient(Number(amount))) {
      showError("❌ Insufficient wallet balance. Please add money.");
      return;
    }

    setIsWalletLoading(true);

    try {
      const valData = preparePaymentData();
      const res = await dispatch(BBPS_PAY_BILL({ valData }));
      handlePaymentResponse(res?.payload);
    } catch (e) {
      handlePaymentError(e);
    } finally {
      setIsWalletLoading(false);
    }
  }, [amount, ids, isWalletSufficient, dispatch, showError]);

  // Bill Payment After UPI
  const performBillPaymentAfterUPI = useCallback(
    async (upiOrderId) => {
      try {
        const valData = preparePaymentData();
        const res = await dispatch(BBPS_PAY_BILL({ valData }));

        if (!res?.payload) {
          throw new Error("No response from payment service");
        }

        const { ResponseStatus, Data, Remarks } = res.payload;

        if (ResponseStatus !== 1 || !Data) {
          throw new Error(Remarks || "Payment failed after UPI");
        }

        const { status, transactionId, opRefNo, operator_ref_id } = Data;

        if (["Success", "success", "Pending", "pending"].includes(status)) {
          const responseData = {
            MobileNumber: number?.cn || number,
            Operator_Code: operatorData.operator_name,
            amount: Number(amount),
            transactionId,
            status,
            type: "BBPS",
            paymentMethod: "UPI",
            upiOrderId,
            OP_REF: opRefNo || operator_ref_id,
          };
          navigate("/bbpsstatus", { state: responseData });
        } else {
          throw new Error(Data.message || "Payment failed");
        }
      } catch (error) {
        console.error("❌ Post-UPI Bill Payment Error:", error);
        showError(
          `Payment successful but bill payment failed. Contact support with Order ID: ${upiOrderId}`
        );
      }
    },
    [amount, number, operatorData, dispatch, navigate, showError]
  );

  // UPI Payment Hook
  const {
    isLoading: isUPILoading,
    initiatePayment,
    getLoadingMessage,
  } = useUPIPayment(performBillPaymentAfterUPI, (error) =>
    console.error("UPI Payment Error:", error)
  );

  // Main Payment Handler
  const handlePayment = useCallback(() => {
    // Validation for FASTag
    if (ids === "64c9e66d1efc768da459ef09" && Number(amount) < 10) {
      showError("Minimum FASTag recharge amount is ₹10");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      showError("Please enter a valid amount");
      return;
    }

    if (walletSelect) {
      performWalletBillPayment();
    } else {
      initiatePayment(Number(amount));
    }
  }, [
    amount,
    ids,
    walletSelect,
    performWalletBillPayment,
    initiatePayment,
    showError,
  ]);

  const isLoading = isWalletLoading || isUPILoading;
  const isButtonDisabled =
    isLoading ||
    (walletSelect && !isWalletSufficient(numericAmount)) ||
    !numericAmount;

  const buttonTitle = isLoading
    ? walletSelect
      ? "Processing Bill Payment..."
      : getLoadingMessage()
    : walletSelect && !isWalletSufficient(numericAmount)
    ? "💰 Insufficient Wallet Balance"
    : `Pay ₹${numericAmount || 0}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <CommonHeader
          style={{ fontSize: 13 }}
          title={title}
          handleclick={() => !isLoading && navigate(-1)}
          // rightDesign={rightDesign}
        />
      </div>

      {/* Content */}
      <motion.div
        className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Top Summary Card */}
        <div className="mt-4 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)]">
          {/* Header strip */}
          <div className="p-5 bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 overflow-hidden">
                  <img
                    src={DummyAvatarForPassbook}
                    className="h-full w-full object-cover"
                    alt="User"
                    loading="lazy"
                  />
                </div>
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-black truncate">
                  {data?.userName || "Customer"}
                </p>
                <p className="text-xs text-white/75 font-semibold truncate">
                  {data?.cellNumber ? `📱 ${data.cellNumber}` : "—"}
                </p>
              </div>

              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <MdCheckCircle className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoPill
                icon={<MdCalendarToday className="text-slate-700" />}
                label="Bill Date"
                value={data?.billdate || "N/A"}
              />
              <InfoPill
                danger
                icon={<MdCalendarToday className="text-rose-700" />}
                label="Due Date"
                value={data?.dueDate || "N/A"}
              />
            </div>

            {/* Amount input */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-black text-slate-700 tracking-wide uppercase">
                  Amount
                </p>
                {data?.acceptPartPay ? (
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
                    Part Pay Enabled
                  </span>
                ) : (
                  <span className="text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full">
                    Fixed Amount
                  </span>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-xl font-black text-slate-900">₹</span>
                  </div>

                  <input
                    disabled={!data?.acceptPartPay || isLoading}
                    value={amount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9]/g, "");
                      setAmount(v);
                      setSelectedQuick(null);
                    }}
                    inputMode="numeric"
                    placeholder="Enter Amount"
                    className="w-full bg-transparent outline-none text-3xl font-black text-slate-900 placeholder:text-slate-300 disabled:opacity-50"
                  />
                </div>

                {/* Quick add */}
                {data?.acceptPartPay && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {QUICK_ADD.map((v) => {
                      const active = selectedQuick === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => !isLoading && handleQuickAdd(v)}
                          disabled={isLoading}
                          className={`shrink-0 px-3 py-2 rounded-2xl border text-xs font-black active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                              active
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-800 border-slate-200"
                            }`}
                        >
                          +₹{v}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selector - REUSABLE COMPONENT */}
            <div className="mt-5">
              <PaymentMethodSelector
                walletBalance={walletBalance}
                payableAmount={numericAmount}
                isLoading={isLoading}
              />
            </div>

            {/* Note */}
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <MdInfo className="text-xl text-slate-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    Important note
                  </p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    The service provider may occasionally take up to 72 hours to
                    process your bill payment. You will be notified once the
                    payment is confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 sm:p-4 safe-area-bottom">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handlePayment}
            disabled={isButtonDisabled}
            className={`w-full rounded-2xl px-4 py-4 font-black text-base flex items-center justify-center gap-2 transition active:scale-[0.99]
              ${
                isButtonDisabled
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-slate-900 text-white shadow-[0_18px_55px_rgba(2,6,23,0.18)]"
              }`}
          >
            {buttonTitle}
            {!isButtonDisabled && <IoFlashSharp className="text-xl" />}
          </button>

          {/* Balance helper */}
          {walletSelect &&
            isWalletSufficient(numericAmount) &&
            numericAmount > 0 && (
              <p className="mt-2 text-center text-[11px] text-slate-500 font-semibold">
                Paying from wallet • Balance after pay:{" "}
                <span className="font-black text-slate-700">
                  ₹{(walletBalance - numericAmount).toFixed(2)}
                </span>
              </p>
            )}
        </div>
      </div>

      {isLoading && <LoaderModal variant="bbps" />}
    </div>
  );
};

const InfoPill = ({ icon, label, value, danger }) => {
  return (
    <div
      className={`rounded-3xl border p-4 flex items-center justify-between gap-3
        ${
          danger ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"
        }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`h-10 w-10 rounded-2xl border flex items-center justify-center shrink-0
            ${
              danger ? "bg-white border-rose-200" : "bg-white border-slate-200"
            }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
            {label}
          </p>
          <p
            className={`text-sm font-black truncate ${
              danger ? "text-rose-700" : "text-slate-900"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;

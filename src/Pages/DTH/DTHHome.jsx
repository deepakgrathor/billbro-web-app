// import React, { use, useEffect, useRef, useState } from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useNavigate } from "react-router-dom";
// import { DTH_OPERATOR_ARR } from "../../Utils/MockData";
// import SelectDTHOperator from "./SelectDTHOperator";
// import ButtonComp from "../../Components/ButtonComp";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import BottomSheet from "../../Components/BottomSheet";
// import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { primaryColor } from "../../Utils/Style";
// import {
//   MdAccountBalanceWallet,
//   MdCheckCircle,
//   MdCreditCard,
//   MdOutlineAddCircleOutline,
// } from "react-icons/md";
// import ToastComp from "../../Components/ToastComp";
// import { generateUniqueTrxnRefId } from "../../Utils/CommonFunc";
// import { DTHRechargeRequest } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
// import Loader from "../../Components/Loader";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import LoaderModal from "../../Components/LoaderModal";

// const DTHHome = () => {
//   const dispatch = useDispatch();
//   const inputRef = useRef(null);
//   const navigate = useNavigate();
//   const [load, setLoad] = useState(false);
//   const [step, setStep] = useState(1);
//   const [number, setNumber] = useState(null);
//   const [amount, setAmount] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [data, setData] = useState();
//   const [content, setContent] = useState();
//   const [title, setTitle] = useState();
//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   const { profileLoader, ProfileData } = useSelector(
//     (state) => state.LoginSlice.profile
//   );
//   const { serviceList, serviceLoader } = useSelector(
//     (state) => state.ServiceSlice.service
//   );
//   const FindDirectPay = serviceList.Data?.find((a) => a.name == "DIRECT_UPI");
//   const FindContentDesign = () => {
//     return (
//       <>
//         <p className="text-xs text-gray-500">{data.findContent}</p>
//       </>
//     );
//   };

//   const minAmountMap = {
//     tata_sky: 200,
//     airtel_tv: 100,
//     dish_tv: 150,
//     sun_tv: 150,
//     videocon: 150,
//   };

//   const DTHRecharge = async () => {
//     const minAmount = minAmountMap[data.id];

//     // Input validation
//     if (!number || !amount || isNaN(amount) || amount <= 0 || !data?.id) {
//       ToastComp({
//         message: "❌ Missing or invalid DTH number/amount/operator",
//         type: "error",
//       });
//       return;
//     }
//     if (Number(amount) < minAmount) {
//       ToastComp({
//         message: `Minimum amount for ${data.title} is ₹${minAmount}`,
//         type: "error",
//       });
//       return;
//     }

//     setLoad(true);

//     try {
//       const payload = {
//         MobileNumber: number.trim(),
//         Operator_Code: data.id,
//         amount: Number(amount),
//       };

//       const res = await dispatch(DTHRechargeRequest(payload));

//       // Response validation
//       if (!res?.payload) {
//         throw new Error("No response received from server");
//       }

//       const { ResponseStatus, Data, Remarks } = res.payload;

//       if (ResponseStatus !== 1 || !Data) {
//         throw new Error(Remarks || "Invalid response");
//       }

//       const status = Data.status?.toLowerCase();

//       if (status === "success" || status === "pending") {
//         const navigateData = {
//           MobileNumber: payload.MobileNumber,
//           Operator_Code: payload.Operator_Code,
//           amount: payload.amount,
//           transactionId: res.payload.Data.transactionId,
//           status: status.toUpperCase(),
//           type: "DTH",
//           ...(status === "success" && {
//             OP_REF: Data.opRefNo || Data.operator_ref_id,
//           }),
//         };
//         navigate("/rechargestatus", {
//           state: navigateData,
//         });
//       } else {
//         throw new Error(Data.message || "Recharge failed");
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.Remarks ||
//         error.payload?.Remarks ||
//         error.message ||
//         "Recharge Failed. Please try again.";

//       ToastComp({
//         message: errorMessage,
//         type: "error",
//       });
//     } finally {
//       setLoad(false);
//     }
//   };

//   useEffect(() => {
//     dispatch(getUserProfile());
//   }, []);
//   return (
//     <>
//       <div className="">
//         {step === 1 && (
//           <div className="">
//             <div className="fixed top-0 w-full">
//               <CommonHeader
//                 title={"Select Operator"}
//                 handleclick={() => navigate(-1)}
//               />
//             </div>
//             <div className="mt-16">
//               <SelectDTHOperator
//                 data={DTH_OPERATOR_ARR}
//                 setStep={setStep}
//                 setData={setData}
//               />
//             </div>
//           </div>
//         )}
//         {step === 2 && (
//           <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
//             {/* Soft blobs */}
//             <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//               <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
//               <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl" />
//             </div>

//             {/* Header */}
//             <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
//               <CommonHeader
//                 style={{ fontSize: 12 }}
//                 title={`${data?.title}`}
//                 handleclick={() => setStep(1)}
//               />
//             </div>

//             {/* Content */}
//             <div className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto">
//               {/* Hero */}
//               <div className="mt-4 rounded-3xl bg-slate-900 text-white p-5 shadow-[0_18px_55px_rgba(2,6,23,0.16)] overflow-hidden relative">
//                 <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10" />
//                 <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-white/10" />
//                 <div className="relative">
//                   <p className="text-[11px] font-black uppercase tracking-wider text-white/70">
//                     Step 2
//                   </p>
//                   <h2 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
//                     Enter {data?.placeholder}
//                   </h2>
//                   <p className="mt-1 text-xs sm:text-sm text-white/70">
//                     Please double-check the details before continuing.
//                   </p>
//                 </div>
//               </div>

//               {/* Input Card */}
//               <div className="mt-4">
//                 <div className="relative">
//                   {/* glow border on focus */}
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl opacity-0 focus-within:opacity-20 blur transition-opacity" />

//                   <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_12px_35px_rgba(2,6,23,0.10)] p-4 sm:p-5">
//                     <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
//                       {data?.placeholder}
//                     </label>

//                     <div className="mt-3 flex items-center gap-3">
//                       <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
//                         <span className="text-lg">🔢</span>
//                       </div>

//                       <input
//                         ref={inputRef}
//                         autoFocus
//                         autoComplete="off"
//                         type="text" // type number mat rakho
//                         value={number}
//                         onChange={(e) => setNumber(e.target.value)}
//                         placeholder={`Enter ${data?.placeholder}`}
//                         className="flex-1 bg-transparent outline-none text-base sm:text-lg font-black tracking-wider text-slate-900 placeholder:text-slate-400 min-w-0"
//                       />
//                     </div>

//                     {/* helper row */}
//                     <div className="mt-3 flex items-center justify-between gap-3">
//                       <p className="text-[11px] font-semibold text-slate-500">
//                         Make sure it matches your bill / account details
//                       </p>

//                       {!!number?.length && (
//                         <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
//                           Looks good
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* How to find */}
//               <button
//                 type="button"
//                 onClick={() => {
//                   setOpen(true);
//                   setContent(FindContentDesign);
//                   setTitle(`How to find ${data.placeholder}`);
//                 }}
//                 className="mt-4 w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_12px_35px_rgba(2,6,23,0.06)] p-4 flex items-center justify-between hover:shadow-[0_16px_45px_rgba(2,6,23,0.10)] transition"
//               >
//                 <div className="flex items-center gap-3 min-w-0">
//                   <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
//                     <AiOutlineInfoCircle className="text-indigo-600 text-xl" />
//                   </div>
//                   <div className="min-w-0 text-left">
//                     <p className="text-sm font-black text-slate-900 truncate">
//                       How to find {data.placeholder}
//                     </p>
//                     <p className="text-[11px] font-semibold text-slate-500 truncate">
//                       Tap to view step-by-step guide
//                     </p>
//                   </div>
//                 </div>

//                 <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
//                   <span className="text-slate-400 text-xl">›</span>
//                 </div>
//               </button>
//             </div>

//             {/* Bottom CTA */}
//             <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_30px_rgba(2,6,23,0.08)] p-3 sm:p-4">
//               <div className="max-w-xl mx-auto">
//                 <ButtonComp handleClick={() => setStep(3)} title={"Continue"} />
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
//             {/* Soft blobs */}
//             <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
//               <div className="absolute -top-24 right-[-90px] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl" />
//               <div className="absolute bottom-[-140px] left-[-90px] h-96 w-96 rounded-full bg-fuchsia-400/15 blur-3xl" />
//             </div>

//             {/* Header */}
//             <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
//               <CommonHeader
//                 title={"Review & Confirm"}
//                 handleclick={() => setStep(2)}
//               />
//             </div>

//             {/* Content */}
//             <div className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto">
//               {/* Summary Card */}
//               <div className="mt-4 rounded-3xl bg-slate-900 text-white p-5 shadow-[0_18px_55px_rgba(2,6,23,0.16)] overflow-hidden relative">
//                 <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10" />
//                 <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-white/10" />
//                 <div className="relative">
//                   <p className="text-[11px] font-black uppercase tracking-wider text-white/70">
//                     Step 3
//                   </p>
//                   <h2 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
//                     Review your recharge
//                   </h2>

//                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//                       <p className="text-[11px] font-bold text-white/70">
//                         DTH Operator
//                       </p>
//                       <p className="mt-1 text-sm font-black line-clamp-1">
//                         {data?.title}
//                       </p>
//                     </div>

//                     <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
//                       <p className="text-[11px] font-bold text-white/70">
//                         Subscriber / VC No.
//                       </p>
//                       <p className="mt-1 text-sm font-black tracking-wide line-clamp-1">
//                         {number}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Amount Card */}
//               <div className="mt-4">
//                 <div className="relative">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl opacity-0 focus-within:opacity-20 blur transition-opacity" />
//                   <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_12px_35px_rgba(2,6,23,0.10)] p-4 sm:p-5">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">
//                           Amount
//                         </p>
//                         <p className="text-xs text-slate-500 mt-0.5">
//                           Enter recharge amount
//                         </p>
//                       </div>

//                       {!!amount && (
//                         <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
//                           ₹{amount}
//                         </span>
//                       )}
//                     </div>

//                     <div className="mt-4 flex items-center gap-3">
//                       <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
//                         <span className="text-xl font-black text-slate-900">
//                           ₹
//                         </span>
//                       </div>

//                       <input
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="Enter Amount"
//                         inputMode="numeric"
//                         type="text"
//                         onInput={(e) => {
//                           e.target.value = e.target.value.replace(
//                             /[^0-9]/g,
//                             ""
//                           );
//                         }}
//                         className="flex-1 bg-transparent outline-none text-lg sm:text-xl font-black tracking-wide text-slate-900 placeholder:text-slate-400 min-w-0"
//                       />
//                     </div>

//                     {/* Quick picks */}
//                     <div className="mt-4">
//                       <p className="text-[11px] font-bold text-slate-600 mb-2">
//                         Quick Add
//                       </p>
//                       <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//                         {PriceArr.map((item, idx) => (
//                           <button
//                             key={idx}
//                             type="button"
//                             onClick={() => setAmount(item)}
//                             className={`px-4 py-2 rounded-full border text-xs font-black tracking-wider whitespace-nowrap transition active:scale-95
//                       ${
//                         String(amount) === String(item)
//                           ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white border-transparent shadow-md"
//                           : "bg-white text-slate-700 border-slate-200 hover:border-indigo-200"
//                       }`}
//                           >
//                             +{item}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method */}
//               {/* <div className="mt-5">
//                 <p className="text-sm font-black text-slate-900 mb-3">
//                   Select Payment Method
//                 </p>

//                 <div
//                   onClick={() => dispatch(setWalletSelect(true))}
//                   className={`relative rounded-3xl bg-white/90 backdrop-blur-xl border shadow-[0_12px_35px_rgba(2,6,23,0.08)] p-4 sm:p-5 cursor-pointer transition
//             ${
//               walletSelect
//                 ? "border-indigo-300"
//                 : "border-slate-200 hover:border-slate-300"
//             }`}
//                 >
//                   {walletSelect && (
//                     <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
//                   )}

//                   <div className="flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
//                         <img
//                           width={26}
//                           src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
//                           alt="Wallet"
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">
//                           Wallet Balance
//                         </p>

//                         <div className="mt-1 flex items-center gap-2 flex-wrap">
//                           <p className="text-base sm:text-lg font-black text-slate-900">
//                             ₹
//                             {new Intl.NumberFormat("en-IN", {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             }).format(ProfileData?.Data?.wallet?.balance || 0)}
//                           </p>

//                           {ProfileData?.Data?.wallet?.balance <
//                             Number(amount || 0) && (
//                             <span className="text-[10px] font-black bg-red-500 text-white rounded-full px-2 py-1">
//                               Low Balance
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate("/wallet");
//                       }}
//                       className="shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white px-4 py-2 text-[11px] font-black shadow-md hover:shadow-lg transition active:scale-95"
//                     >
//                       Add Money
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                   onClick={() => dispatch(setWalletSelect(false))}
//                   className={`relative mt-3 rounded-3xl bg-white/90 backdrop-blur-xl border shadow-[0_12px_35px_rgba(2,6,23,0.08)] p-4 sm:p-5 cursor-pointer transition
//             ${
//               !walletSelect
//                 ? "border-orange-300"
//                 : "border-slate-200 hover:border-slate-300"
//             }`}
//                 >
//                   {!walletSelect && (
//                     <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-orange-500 to-red-500" />
//                   )}

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
//                         <img
//                           width={26}
//                           src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
//                           alt="UPI"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-base font-black text-slate-900">
//                           UPI
//                         </p>
//                         <p className="text-[11px] font-semibold text-slate-500">
//                           Fast & secure payments
//                         </p>
//                       </div>
//                     </div>

//                     <div
//                       className={`h-9 w-9 rounded-2xl border flex items-center justify-center
//                 ${
//                   !walletSelect
//                     ? "bg-orange-50 border-orange-200 text-orange-600"
//                     : "bg-slate-50 border-slate-200 text-slate-400"
//                 }`}
//                     >
//                       <span className="text-xl">›</span>
//                     </div>
//                   </div>
//                 </div>
//               </div> */}
//               {/* Payment Method (Replace ONLY this section) */}
//               <div className="mt-5">
//                 <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
//                   Select Payment Method
//                 </h3>

//                 {/* Wallet Option */}
//                 <div
//                   onClick={() => dispatch(setWalletSelect(true))}
//                   className={`
//       bg-white/90 backdrop-blur-xl rounded-2xl shadow-md mb-3 overflow-hidden cursor-pointer
//       transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//       ${
//         walletSelect
//           ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200 border border-transparent"
//           : "border border-gray-200"
//       }
//     `}
//                 >
//                   <div className="p-4 flex items-center justify-between gap-3">
//                     <div className="flex items-center gap-4 min-w-0">
//                       <div
//                         className={`
//             w-12 h-12 rounded-xl flex items-center justify-center shrink-0
//             ${
//               walletSelect
//                 ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                 : "bg-gray-100"
//             }
//           `}
//                       >
//                         {/* aap chahe to MdAccountBalanceWallet icon rakho ya apni wallet image */}
//                         <MdAccountBalanceWallet
//                           size={24}
//                           className={
//                             walletSelect ? "text-white" : "text-gray-600"
//                           }
//                         />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="text-xs text-gray-500 font-medium mb-1">
//                           Wallet Balance
//                         </p>

//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="text-lg font-black text-gray-800">
//                             ₹
//                             {new Intl.NumberFormat("en-IN", {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             }).format(ProfileData?.Data?.wallet?.balance || 0)}
//                           </p>

//                           {/* same condition as your current code (low balance) */}
//                           {ProfileData?.Data?.wallet?.balance <
//                             Number(amount || 0) && (
//                             <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
//                               Low Balance
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Add Money Button */}
//                     <button
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
//       bg-white/90 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden cursor-pointer
//       transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
//       ${
//         !walletSelect
//           ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200 border border-transparent"
//           : "border border-gray-200"
//       }
//     `}
//                   >
//                     <div className="p-4 flex items-center justify-between">
//                       <div className="flex items-center gap-4 min-w-0">
//                         <div
//                           className={`
//             w-12 h-12 rounded-xl flex items-center justify-center shrink-0
//             ${
//               !walletSelect
//                 ? "bg-gradient-to-br from-purple-500 to-blue-600"
//                 : "bg-gray-100"
//             }
//           `}
//                         >
//                           {/* Option A: icon */}
//                           <MdCreditCard
//                             size={24}
//                             className={
//                               !walletSelect ? "text-white" : "text-gray-600"
//                             }
//                           />

//                           {/* Option B: if you prefer your UPI image, use this instead & remove MdCreditCard */}
//                           {/*
//           <img
//             width={24}
//             src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
//             alt="UPI"
//             className="w-6 h-6 object-contain"
//           />
//           */}
//                         </div>

//                         <div className="min-w-0">
//                           <p className="text-xs text-gray-500 font-medium mb-1">
//                             Pay with UPI
//                           </p>
//                           <p className="text-lg font-black text-gray-800">
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

//             {/* Bottom CTA */}
//             <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_30px_rgba(2,6,23,0.08)] p-3 sm:p-4">
//               <div className="max-w-xl mx-auto">
//                 <ButtonComp
//                   disabled={
//                     Number(amount) > ProfileData?.Data?.wallet?.balance &&
//                     walletSelect
//                   }
//                   title={
//                     Number(amount) > ProfileData?.Data?.wallet?.balance &&
//                     walletSelect
//                       ? "Wallet Balance is Low!"
//                       : "Proceed"
//                   }
//                   handleClick={DTHRecharge}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <BottomSheet
//         content={content}
//         title={title}
//         isOpen={open}
//         setIsOpen={setOpen}
//       />
//       {load && <LoaderModal variant="dth" />}
//     </>
//   );
// };

// const PriceArr = [100, 200, 500, 1000, 5000];

// export default DTHHome;
import React, { useEffect, useRef, useState, useCallback } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { DTH_OPERATOR_ARR } from "../../Utils/MockData";
import SelectDTHOperator from "./SelectDTHOperator";
import ButtonComp from "../../Components/ButtonComp";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BottomSheet from "../../Components/BottomSheet";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  MdAccountBalanceWallet,
  MdCheckCircle,
  MdCreditCard,
  MdOutlineAddCircleOutline,
} from "react-icons/md";
import { DTHRechargeRequest } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import LoaderModal from "../../Components/LoaderModal";
import { useUPIPayment } from "../../hooks/useUPIPayment";
import { usePaymentService } from "../../hooks/usePaymentService";
import ToastComp from "../../Components/ToastComp";
import PaymentMethodSelector from "../../Components/PaymentMethodSelector";

const DTHHome = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [number, setNumber] = useState(null);
  const [amount, setAmount] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [content, setContent] = useState();
  const [title, setTitle] = useState();

  // ✅ ADD: Wallet loading state
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const { serviceList } = useSelector((state) => state.ServiceSlice.service);

  // Payment Service Hook
  const { walletBalance, isWalletSufficient, formatAmount, showError } =
    usePaymentService();

  const FindDirectPay = serviceList.Data?.find((a) => a.name === "DIRECT_UPI");

  const minAmountMap = {
    tata_sky: 200,
    airtel_tv: 100,
    dish_tv: 150,
    sun_tv: 150,
    videocon: 150,
  };

  const FindContentDesign = () => {
    return <p className="text-xs text-gray-500">{data.findContent}</p>;
  };

  // Wallet DTH Recharge
  const performWalletDTHRecharge = useCallback(async () => {
    const minAmount = minAmountMap[data.id];

    // Input validation
    if (!number || !amount || isNaN(amount) || amount <= 0 || !data?.id) {
      showError("❌ Missing or invalid DTH number/amount/operator");
      return;
    }

    if (Number(amount) < minAmount) {
      showError(`Minimum amount for ${data.title} is ₹${minAmount}`);
      return;
    }

    if (!isWalletSufficient(Number(amount))) {
      showError("❌ Insufficient wallet balance. Please add money.");
      return;
    }

    // ✅ START LOADING
    setIsWalletLoading(true);

    try {
      const payload = {
        MobileNumber: number.trim(),
        Operator_Code: data.id,
        amount: Number(amount),
      };

      const res = await dispatch(DTHRechargeRequest(payload));

      if (!res?.payload) {
        throw new Error("No response received from server");
      }

      const { ResponseStatus, Data, Remarks } = res.payload;

      if (ResponseStatus !== 1 || !Data) {
        throw new Error(Remarks || "Invalid response");
      }

      const status = Data.status?.toLowerCase();

      if (status === "success" || status === "pending") {
        navigate("/rechargestatus", {
          state: {
            MobileNumber: payload.MobileNumber,
            Operator_Code: payload.Operator_Code,
            amount: payload.amount,
            transactionId: Data.transactionId,
            status: status.toUpperCase(),
            type: "DTH",
            paymentMethod: "WALLET",
            ...(status === "success" && {
              OP_REF: Data.opRefNo || Data.operator_ref_id,
            }),
          },
        });
      } else {
        throw new Error(Data.message || "Recharge failed");
      }
    } catch (error) {
      console.error("❌ Wallet DTH Recharge Error:", error);
      showError(
        error.response?.data?.Remarks ||
          error.payload?.Remarks ||
          error.message ||
          "Recharge Failed. Please try again."
      );
    } finally {
      // ✅ STOP LOADING
      setIsWalletLoading(false);
    }
  }, [number, amount, data, isWalletSufficient, dispatch, navigate, showError]);

  // DTH Recharge After UPI Payment
  const performDTHRechargeAfterUPI = useCallback(
    async (upiOrderId) => {
      try {
        const payload = {
          MobileNumber: number.trim(),
          Operator_Code: data.id,
          amount: Number(amount),
        };

        const res = await dispatch(DTHRechargeRequest(payload));

        if (!res?.payload) {
          throw new Error("No response from recharge service");
        }

        const { ResponseStatus, Data, Remarks } = res.payload;

        if (ResponseStatus !== 1 || !Data) {
          throw new Error(Remarks || "Recharge failed after payment");
        }

        const status = Data.status?.toLowerCase();

        if (status === "success" || status === "pending") {
          navigate("/rechargestatus", {
            state: {
              MobileNumber: payload.MobileNumber,
              Operator_Code: payload.Operator_Code,
              amount: payload.amount,
              transactionId: Data.transactionId,
              status: status.toUpperCase(),
              type: "DTH",
              paymentMethod: "UPI",
              upiOrderId,
              ...(status === "success" && {
                OP_REF: Data.opRefNo || Data.operator_ref_id,
              }),
            },
          });
        } else {
          throw new Error(Data.message || "Recharge failed");
        }
      } catch (error) {
        console.error("❌ Post-UPI DTH Recharge Error:", error);
        showError(
          `Payment successful but recharge failed. Contact support with Order ID: ${upiOrderId}`
        );
      }
    },
    [number, amount, data, dispatch, navigate, showError]
  );

  // UPI Payment Hook
  const {
    isLoading: isUPILoading,
    initiatePayment,
    getLoadingMessage,
  } = useUPIPayment(performDTHRechargeAfterUPI, (error) =>
    console.error("UPI Payment Error:", error)
  );

  // Main Payment Handler
  const handleDTHRecharge = useCallback(() => {
    const minAmount = minAmountMap[data.id];

    // Validation
    if (!number || !amount || isNaN(amount) || amount <= 0 || !data?.id) {
      showError("❌ Missing or invalid DTH number/amount/operator");
      return;
    }

    if (Number(amount) < minAmount) {
      showError(`Minimum amount for ${data.title} is ₹${minAmount}`);
      return;
    }

    if (walletSelect) {
      performWalletDTHRecharge();
    } else {
      initiatePayment(Number(amount));
    }
  }, [
    number,
    amount,
    data,
    walletSelect,
    performWalletDTHRecharge,
    initiatePayment,
    showError,
  ]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const payableAmount = Number(amount || 0);

  // ✅ COMBINED LOADING STATE
  const isLoading = isWalletLoading || isUPILoading;

  const isButtonDisabled =
    isLoading || (walletSelect && !isWalletSufficient(payableAmount));

  // ✅ DYNAMIC BUTTON TITLE
  const buttonTitle = isLoading
    ? walletSelect
      ? "Processing Wallet Recharge..."
      : getLoadingMessage()
    : walletSelect && !isWalletSufficient(payableAmount)
    ? "💰 Insufficient Wallet Balance"
    : "Proceed";

  return (
    <>
      <div className="">
        {step === 1 && (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                title={"Select Operator"}
                handleclick={() => navigate(-1)}
              />
            </div>
            <div className="mt-16">
              <SelectDTHOperator
                data={DTH_OPERATOR_ARR}
                setStep={setStep}
                setData={setData}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
              <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl" />
            </div>

            <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
              <CommonHeader
                style={{ fontSize: 12 }}
                title={`${data?.title}`}
                handleclick={() => setStep(1)}
              />
            </div>

            <div className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto">
              <div className="mt-4 rounded-3xl bg-slate-900 text-white p-5 shadow-[0_18px_55px_rgba(2,6,23,0.16)] overflow-hidden relative">
                <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-white/10" />
                <div className="relative">
                  <p className="text-[11px] font-black uppercase tracking-wider text-white/70">
                    Step 2
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
                    Enter {data?.placeholder}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-white/70">
                    Please double-check the details before continuing.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl opacity-0 focus-within:opacity-20 blur transition-opacity" />

                  <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_12px_35px_rgba(2,6,23,0.10)] p-4 sm:p-5">
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      {data?.placeholder}
                    </label>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <span className="text-lg">🔢</span>
                      </div>

                      <input
                        ref={inputRef}
                        autoFocus
                        autoComplete="off"
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder={`Enter ${data?.placeholder}`}
                        className="flex-1 bg-transparent outline-none text-base sm:text-lg font-black tracking-wider text-slate-900 placeholder:text-slate-400 min-w-0"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Make sure it matches your bill / account details
                      </p>

                      {!!number?.length && (
                        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                          Looks good
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setContent(FindContentDesign);
                  setTitle(`How to find ${data.placeholder}`);
                }}
                className="mt-4 w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_12px_35px_rgba(2,6,23,0.06)] p-4 flex items-center justify-between hover:shadow-[0_16px_45px_rgba(2,6,23,0.10)] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                    <AiOutlineInfoCircle className="text-indigo-600 text-xl" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-black text-slate-900 truncate">
                      How to find {data.placeholder}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">
                      Tap to view step-by-step guide
                    </p>
                  </div>
                </div>

                <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-slate-400 text-xl">›</span>
                </div>
              </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_30px_rgba(2,6,23,0.08)] p-3 sm:p-4">
              <div className="max-w-xl mx-auto">
                <ButtonComp handleClick={() => setStep(3)} title={"Continue"} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-24 right-[-90px] h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl" />
              <div className="absolute bottom-[-140px] left-[-90px] h-96 w-96 rounded-full bg-fuchsia-400/15 blur-3xl" />
            </div>

            <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
              <CommonHeader
                title={"Review & Confirm"}
                handleclick={() => !isLoading && setStep(2)}
              />
            </div>

            <div className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto">
              <div className="mt-4 rounded-3xl bg-slate-900 text-white p-5 shadow-[0_18px_55px_rgba(2,6,23,0.16)] overflow-hidden relative">
                <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-white/10" />
                <div className="relative">
                  <p className="text-[11px] font-black uppercase tracking-wider text-white/70">
                    Step 3
                  </p>
                  <h2 className="mt-1 text-xl sm:text-2xl font-black leading-tight">
                    Review your recharge
                  </h2>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                      <p className="text-[11px] font-bold text-white/70">
                        DTH Operator
                      </p>
                      <p className="mt-1 text-sm font-black line-clamp-1">
                        {data?.title}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                      <p className="text-[11px] font-bold text-white/70">
                        Subscriber / VC No.
                      </p>
                      <p className="mt-1 text-sm font-black tracking-wide line-clamp-1">
                        {number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl opacity-0 focus-within:opacity-20 blur transition-opacity" />
                  <div className="relative rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_12px_35px_rgba(2,6,23,0.10)] p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                          Amount
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enter recharge amount
                        </p>
                      </div>

                      {!!amount && (
                        <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                          ₹{amount}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <span className="text-xl font-black text-slate-900">
                          ₹
                        </span>
                      </div>

                      <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Amount"
                        inputMode="numeric"
                        type="text"
                        disabled={isLoading}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                        className="flex-1 bg-transparent outline-none text-lg sm:text-xl font-black tracking-wide text-slate-900 placeholder:text-slate-400 min-w-0 disabled:opacity-50"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-[11px] font-bold text-slate-600 mb-2">
                        Quick Add
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {PriceArr.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => !isLoading && setAmount(item)}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-full border text-xs font-black tracking-wider whitespace-nowrap transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                              ${
                                String(amount) === String(item)
                                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white border-transparent shadow-md"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-indigo-200"
                              }`}
                          >
                            +{item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <PaymentMethodSelector
                walletBalance={walletBalance}
                payableAmount={payableAmount}
                isLoading={isLoading}
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-white/40 shadow-[0_-10px_30px_rgba(2,6,23,0.08)] p-3 sm:p-4">
              <div className="max-w-xl mx-auto">
                <ButtonComp
                  disabled={isButtonDisabled}
                  title={buttonTitle}
                  handleClick={handleDTHRecharge}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomSheet
        content={content}
        title={title}
        isOpen={open}
        setIsOpen={setOpen}
      />

      {/* ✅ SHOW LOADER FOR BOTH WALLET AND UPI */}
      {isLoading && <LoaderModal variant="dth" />}
    </>
  );
};

const PriceArr = [100, 200, 500, 1000, 5000];

export default DTHHome;

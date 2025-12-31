// import React, { useEffect, useState } from "react";
// import { DummyAvatarForPassbook } from "../../Utils/MockData";
// import { primaryColor } from "../../Utils/Style";
// import { useDispatch, useSelector } from "react-redux";
// import ToastComp from "../../Components/ToastComp";
// import CommonHeader from "../../Components/CommonHeader";
// import { useNavigate } from "react-router-dom";
// import ButtonComp from "../../Components/ButtonComp";
// import API from "../../Redux/API";
// import { BBPS_PAY_BILL } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import Loader from "../../Components/Loader";
// import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
// import { MdOutlineAddCircleOutline } from "react-icons/md";
// import BottomSheet from "../../Components/BottomSheet";
// import PlayStoreRating from "../../Components/PlayStoreRating";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

// const BillPreview = ({ data, operatorData, number, ButtonName }) => {
//   const [load, setLoad] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { ProfileData, profileLoader } = useSelector(
//     (state) => state.LoginSlice.profile
//   );
//   const [orderId, setOrderId] = useState();
//   const { walletSelect } = useSelector((state) => state.PaymentSlice);
//   //   const { billPaymentLoader } = useSelector(
//   //     (state) => state.ServiceSlice.billPayment
//   //   );
//   const { ids, serviceType } = useSelector(
//     (state) => state.PaymentSlice.PaymentType
//   );
//   const [amount, setAmount] = useState();

//   const handlePayment = async () => {
//     try {
//       setLoad(true);

//       // Validation: Check minimum amount for FASTag
//       if (ids === "64c9e66d1efc768da459ef09" && amount < 10) {
//         ToastComp({
//           message: "Minimum FASTag recharge amount is ₹10",
//           type: "error",
//         });
//         return;
//       }

//       // Prepare payment data
//       const valData = preparePaymentData();

//       // Make API call
//       const res = await dispatch(BBPS_PAY_BILL({ valData }));

//       // Handle response
//       handlePaymentResponse(res?.payload);
//     } catch (error) {
//       handlePaymentError(error);
//     } finally {
//       setLoad(false);
//     }
//   };

//   // Helper function to prepare payment data
//   const preparePaymentData = () => {
//     const baseData = {
//       operator: {
//         name: operatorData.operator_name,
//         category: operatorData.categoryId,
//         operator_id: operatorData.op_id,
//       },
//       amount,
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

//   // Helper function to handle API response
//   const handlePaymentResponse = (payload) => {
//     if (!payload) {
//       throw new Error("No response received from server");
//     }
//     // Response status check
//     if (payload.ResponseStatus === 0) {
//       const errorMsg =
//         payload.Remarks ||
//         payload.message ||
//         "Transaction failed. Please try again.";
//       throw new Error(errorMsg);
//     }

//     if (payload.ResponseStatus === 1) {
//       const data = payload.Data || {};
//       const { status, transactionId, opRefNo, operator_ref_id } = data;

//       // Success or Pending status
//       if (["Success", "success", "Pending", "pending"].includes(status)) {
//         const responseData = {
//           MobileNumber: number.cn || number,
//           Operator_Code: operatorData.operator_name,
//           amount,
//           transactionId,
//           status,
//           type: "BBPS",
//           OP_REF: opRefNo || operator_ref_id,
//         };

//         navigate("/bbpsstatus", { state: responseData });
//         return;
//       }

//       // Failed transaction
//       throw new Error(data.message || "Transaction failed");
//     }

//     // Unexpected response status
//     throw new Error(
//       payload.Remarks ||
//         payload.message ||
//         "Transaction failed. Please try again."
//     );
//   };

//   // Helper function to handle errors
//   const handlePaymentError = (error) => {
//     const errorMessages = {
//       "Network Error": "Network error. Please check your internet connection.",
//       timeout: "Request timeout. Please try again.",
//       insufficient: "Insufficient balance. Please recharge your wallet.",
//       invalid: "Invalid details provided. Please check and try again.",
//     };

//     let message = error?.message || "Something went wrong. Please try again.";

//     // Check for specific error patterns
//     const errorKey = Object.keys(errorMessages).find((key) =>
//       message.toLowerCase().includes(key.toLowerCase())
//     );

//     if (errorKey) {
//       message = errorMessages[errorKey];
//     }

//     ToastComp({
//       message,
//       type: "error",
//     });
//   };

//   useEffect(() => {
//     setAmount(data.billAmount);
//   }, [data.billAmount]);
//   const rightDesign = () => {
//     return (
//       <div className="">
//         <img
//           width={60}
//           src="https://ik.imagekit.io/isjriggan/images%20(1).png"
//           alt=""
//         />
//       </div>
//     );
//   };

//   useEffect(() => {
//     dispatch(getUserProfile());
//   }, []);

//   return (
//     <div>
//       <div className="bg-white min-h-screen flex flex-col">
//         {/* Header */}
//         <div className="fixed top-0 left-0 right-0 z-10">
//           <CommonHeader
//             style={{ fontSize: 13 }}
//             title={`${operatorData?.operator_name?.slice(0, 25)}...`}
//             handleclick={() => navigate(-1)}
//             rightDesign={rightDesign}
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-1 mt-16 overflow-y-auto p-4">
//           <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
//             {/* User Info */}
//             <div className="flex items-center space-x-3 border-b border-gray-300 pb-3">
//               <img src={DummyAvatarForPassbook} className="w-12 rounded-full" />
//               <div className="space-y-1">
//                 <p className="text-black text-sm font-medium">
//                   {data.userName}
//                 </p>
//                 <p className="text-gray-400 text-xs">
//                   Number: {data.cellNumber}
//                 </p>
//               </div>
//             </div>

//             {/* Bill Details */}
//             <p className="text-black text-sm font-medium mt-3">Bill Details</p>
//             <div className="border-b border-gray-300 my-2" />
//             <div className="space-y-2">
//               <div className="flex justify-between text-xs">
//                 <p className="text-gray-600">Bill Date</p>
//                 <p className="text-black">{data.billdate || "N/A"}</p>
//               </div>
//               <div className="flex justify-between text-xs">
//                 <p className="text-red-600">Due Date</p>
//                 <p className="text-red-600">{data.dueDate || "N/A"}</p>
//               </div>
//             </div>
//           </div>

//           {/* Amount Input */}
//           <div className="bg-gray-100 border border-gray-300 flex items-center space-x-2 p-3 rounded-lg mb-3">
//             <p className="text-2xl font-black">₹</p>
//             <input
//               disabled={!data.acceptPartPay}
//               placeholder="Enter Amount"
//               value={amount?.toString()}
//               onChange={(e) => setAmount(e.target.value)}
//               className="flex-1 font-black text-xl outline-none placeholder:font-light"
//             />
//           </div>
//           {data.acceptPartPay && (
//             <div className="my-4">
//               <div className="flex space-x-3 overflow-x-auto items-center">
//                 {PriceArr.map((item, idx) => (
//                   <p
//                     key={idx}
//                     onClick={() => setAmount(item)}
//                     className="text-[12px] text-gray-700 tracking-wider rounded-full border border-gray-300 p-1.5 px-4"
//                   >
//                     +{item}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className=" mt-8 mb-4 ">
//             <p className="m-1 font-bold mb-3 text-sm">Select Payment Method</p>
//             <div
//               onClick={() => dispatch(setWalletSelect(true))}
//               style={{
//                 borderColor: walletSelect ? primaryColor : "",
//                 borderWidth: walletSelect ? 1 : 0,
//               }}
//               className={`flex items-center justify-between py-2 pl-2  bg-gray-100   border-blue-700 border-r-4 rounded-xl`}
//             >
//               <div className="flex items-center space-x-4">
//                 <img
//                   width={25}
//                   src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
//                   alt=""
//                 />
//                 {/* <MdOutlineAccountBalanceWallet size={35} /> */}
//                 <div className="">
//                   <p className="text-[10px] tracking-wider">Wallet Balance</p>
//                   <div className="flex items-center space-x-2">
//                     <p className="font-black text-base">
//                       ₹
//                       {new Intl.NumberFormat("en-IN", {
//                         minimumFractionDigits: 2,
//                         maximumFractionDigits: 2,
//                       }).format(ProfileData?.Data?.wallet?.balance || 0)}
//                     </p>
//                     {ProfileData?.Data?.wallet?.balance < amount && (
//                       <p className="text-[8px] tracking-wider bg-red-500 text-white rounded-full px-2 py-0.5">
//                         Low Balance
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div
//                 onClick={() => navigate("/wallet")}
//                 className="flex  bg-[#1447e6] text-white pl-2 pr-1 py-2 rounded-l-full items-center space-x-2"
//               >
//                 <MdOutlineAddCircleOutline size={20} />
//                 <p className="text-[10px] tracking-wide">Add Money</p>
//               </div>
//             </div>
//             <div
//               onClick={() => dispatch(setWalletSelect(false))}
//               style={{
//                 borderColor: !walletSelect ? primaryColor : "",
//                 borderWidth: !walletSelect ? 1 : 0,
//               }}
//               className={`flex items-center justify-between py-3.5 pl-2 bg-gray-100 mt-2  rounded-xl`}
//             >
//               <div className="flex items-center space-x-4">
//                 <img
//                   width={25}
//                   src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
//                   alt=""
//                 />
//                 {/* <MdOutlineAccountBalanceWallet size={35} /> */}
//                 <div className="">
//                   <div className="flex items-center space-x-2">
//                     <p className="font-black text-base">UPI</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Note */}
//           <p className="text-gray-500 text-[8px] bg-blue-100 p-2 rounded-md mb-10">
//             Note: The service provider may occasionally take up to 72 hours to
//             process your bill.
//           </p>
//         </div>

//         {/* Bottom Button */}
//         <div className="sticky text-center bottom-0 left-0 right-0 bg-white p-4 shadow">
//           <ButtonComp
//             disabled={
//               Number(amount) > ProfileData?.Data?.wallet?.balance &&
//               walletSelect
//             }
//             title={
//               Number(amount) > ProfileData?.Data?.wallet?.balance &&
//               walletSelect
//                 ? "Wallet Balance is Low!"
//                 : "Proceed to pay"
//             }
//             handleClick={handlePayment}
//           />
//         </div>
//       </div>
//       {load && <Loader />}
//     </div>
//   );
// };
// const PriceArr = [100, 200, 500, 1000, 5000, 10000];

// export default BillPreview;

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { useDispatch, useSelector } from "react-redux";
import ToastComp from "../../Components/ToastComp";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import ButtonComp from "../../Components/ButtonComp";
import API from "../../Redux/API";
import { BBPS_PAY_BILL } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import Loader from "../../Components/Loader";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import {
  MdOutlineAddCircleOutline,
  MdAccountBalanceWallet,
  MdCalendarToday,
  MdInfo,
  MdCheckCircle,
} from "react-icons/md";
import { IoFlashSharp, IoWalletSharp } from "react-icons/io5";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

const PriceArr = [100, 200, 500, 1000, 5000, 10000];

const BillPreview = ({ data, operatorData, number, ButtonName }) => {
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const [orderId, setOrderId] = useState();
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { ids, serviceType } = useSelector(
    (state) => state.PaymentSlice.PaymentType
  );
  const [amount, setAmount] = useState();
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);

  const handlePayment = async () => {
    try {
      setLoad(true);

      // Validation: Check minimum amount for FASTag
      if (ids === "64c9e66d1efc768da459ef09" && amount < 10) {
        ToastComp({
          message: "Minimum FASTag recharge amount is ₹10",
          type: "error",
        });
        return;
      }

      // Prepare payment data
      const valData = preparePaymentData();

      // Make API call
      const res = await dispatch(BBPS_PAY_BILL({ valData }));

      // Handle response
      handlePaymentResponse(res?.payload);
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setLoad(false);
    }
  };

  // Helper function to prepare payment data
  const preparePaymentData = () => {
    const baseData = {
      operator: {
        name: operatorData.operator_name,
        category: operatorData.categoryId,
        operator_id: operatorData.op_id,
      },
      amount,
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

  // Helper function to handle API response
  const handlePaymentResponse = (payload) => {
    if (!payload) {
      throw new Error("No response received from server");
    }

    if (payload.ResponseStatus === 0) {
      const errorMsg =
        payload.Remarks ||
        payload.message ||
        "Transaction failed. Please try again.";
      throw new Error(errorMsg);
    }

    if (payload.ResponseStatus === 1) {
      const data = payload.Data || {};
      const { status, transactionId, opRefNo, operator_ref_id } = data;

      if (["Success", "success", "Pending", "pending"].includes(status)) {
        const responseData = {
          MobileNumber: number.cn || number,
          Operator_Code: operatorData.operator_name,
          amount,
          transactionId,
          status,
          type: "BBPS",
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
  };

  // Helper function to handle errors
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

    if (errorKey) {
      message = errorMessages[errorKey];
    }

    ToastComp({
      message,
      type: "error",
    });
  };

  useEffect(() => {
    setAmount(data.billAmount);
  }, [data.billAmount]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={100}
          height={40}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt="BBPS"
        />
      </div>
    );
  };

  const handleQuickAmountSelect = (value) => {
    setSelectedQuickAmount(value);
    setAmount(Number(amount) + value);
  };

  const walletBalance = ProfileData?.Data?.wallet?.balance || 0;
  const isLowBalance = walletBalance < amount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <CommonHeader
          style={{ fontSize: 13 }}
          title={`${operatorData?.operator_name?.slice(0, 25)}${
            operatorData?.operator_name?.length > 25 ? "..." : ""
          }`}
          handleclick={() => navigate(-1)}
          rightDesign={rightDesign}
        />
      </div>

      {/* Content */}
      <motion.div
        className="pt-16 pb-32 px-3 sm:px-4 md:px-6 lg:px-8 max-w-2xl mx-auto overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bill Info Card */}
        <motion.div
          className="mt-4 sm:mt-6 mb-3 sm:mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow overflow-hidden border border-gray-100">
            {/* User Section */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-5">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <motion.div
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-md"></div>
                  <img
                    src={DummyAvatarForPassbook}
                    className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 border-white/50 shadow-lg"
                    alt="User"
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg truncate">
                    {data.userName}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm truncate">
                    📱 {data.cellNumber}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <MdCheckCircle className="text-white text-xl sm:text-2xl" />
                </div>
              </div>
            </div>

            {/* Bill Details */}
            <div className="p-2 sm:p-5">
              {/* <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="text-gray-800 font-bold text-sm sm:text-base flex items-center">
                  <MdInfo className="mr-1 sm:mr-2 text-blue-500 text-base sm:text-lg" />
                  Bill Details
                </h4>
              </div> */}

              <div className="space-y-1 sm:space-y-3">
                <motion.div
                  className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MdCalendarToday className="text-white text-xs sm:text-sm" />
                    </div>
                    <span className="text-gray-600 text-xs sm:text-sm font-medium">
                      Bill Date
                    </span>
                  </div>
                  <span className="text-gray-800 font-bold text-xs sm:text-sm">
                    {data.billdate || "N/A"}
                  </span>
                </motion.div>

                <motion.div
                  className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MdCalendarToday className="text-white text-xs sm:text-sm" />
                    </div>
                    <span className="text-red-600 text-xs sm:text-sm font-medium">
                      Due Date
                    </span>
                  </div>
                  <span className="text-red-600 font-bold text-xs sm:text-sm">
                    {data.dueDate || "N/A"}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Amount Section */}
        <motion.div
          className="mb-3 mt-5 sm:mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-gray-500 font-semibold text-xs sm:text-base mb-2 sm:mb-3 flex items-center">
            <IoWalletSharp className="mr-1 sm:mr-2 text-purple-500 text-base sm:text-lg" />
            Enter Amount
          </h4>

          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur"></div>
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow border-1 border-gray-100 p-1 sm:p-5">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white sm:text-2xl font-black">₹</span>
                </div>
                <input
                  disabled={!data.acceptPartPay}
                  placeholder="Enter Amount"
                  value={amount?.toString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(value);
                    setSelectedQuickAmount(null);
                  }}
                  className="flex-1 font-black sm:text-2xl outline-none text-gray-800 placeholder:font-light placeholder:text-gray-400 bg-transparent min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          {data.acceptPartPay && (
            <motion.div
              className="mt-3 sm:mt-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-[10px] sm:text-xs text-gray-600 mb-2 ml-1">
                Quick Add
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {PriceArr.map((item, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleQuickAmountSelect(item)}
                    className={`text-xs sm:text-sm font-bold tracking-wide rounded-lg sm:rounded-xl border-2 px-3 sm:px-5 py-2 sm:py-2.5 whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                      selectedQuickAmount === item
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +₹{item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Payment Method Section */}
        <motion.div
          className="mb-3 mt-5 sm:mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-gray-500 font-semibold text-xs sm:text-base mb-2 sm:mb-3 flex items-center">
            <MdAccountBalanceWallet className="mr-1 sm:mr-2 text-green-500 text-base sm:text-lg" />
            Select Payment Method
          </h4>

          <div className="space-y-2 sm:space-y-3">
            {/* Wallet Option */}
            <motion.div
              onClick={() => dispatch(setWalletSelect(true))}
              className={`relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
                walletSelect ? "border-blue-500" : "border-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {walletSelect && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}

              <div className="p-2 sm:p-4 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      className="w-6 sm:w-7"
                      src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
                      alt="Wallet"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-00 font-medium">
                      Wallet Balance
                    </p>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 mt-0.5 sm:mt-1">
                      <p className="font-black text-base sm:text-lg text-gray-800 truncate">
                        ₹
                        {new Intl.NumberFormat("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(walletBalance)}
                      </p>
                      {isLowBalance && (
                        <span className="text-[8px] sm:text-[9px] font-bold bg-red-500 text-white rounded-full px-1.5 sm:px-2 py-0.5 animate-pulse flex-shrink-0">
                          Low Balance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/wallet");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:pl-3  sm:pr-2 py-2 sm:py-2.5 rounded-full flex items-center space-x-1 sm:space-x-2 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdOutlineAddCircleOutline
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                  <span className="text-[10px] sm:text-xs font-bold">Add</span>
                </motion.button>
              </div>
            </motion.div>

            {/* UPI Option */}
            <motion.div
              onClick={() => dispatch(setWalletSelect(false))}
              className={`relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
                !walletSelect ? "border-orange-500" : "border-gray-100"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {!walletSelect && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              )}

              <div className="p-2 sm:p-4 flex items-center space-x-2 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    className="w-6 sm:w-7"
                    src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
                    alt="UPI"
                  />
                </div>
                <div>
                  <p className="font-black text-sm sm:text-base text-gray-800">
                    UPI
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Fast & Secure
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Note */}
        <motion.div
          className="mb-3 sm:mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdInfo className="text-white text-base sm:text-lg" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                  Important Note
                </h5>
                <p className="text-[9px] sm:text-xs text-gray-600 leading-relaxed">
                  The service provider may occasionally take up to 72 hours to
                  process your bill payment. You will be notified once the
                  payment is confirmed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4 z-40 shadow-2xl safe-area-bottom">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.button
            onClick={handlePayment}
            disabled={isLowBalance && walletSelect}
            className={`w-full font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
              isLowBalance && walletSelect
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-2xl"
            }`}
            whileHover={isLowBalance && walletSelect ? {} : { scale: 1.02 }}
            whileTap={isLowBalance && walletSelect ? {} : { scale: 0.98 }}
          >
            <span>
              {isLowBalance && walletSelect
                ? "Wallet Balance is Low!"
                : `Pay ₹${amount || 0}`}
            </span>
            {!(isLowBalance && walletSelect) && (
              <IoFlashSharp className="text-lg sm:text-xl" />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Loader */}
      {load && <Loader />}
    </div>
  );
};

export default BillPreview;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Fetch_BPPS_BILL,
  Fetch_BPPS_Operator_List,
} from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import ToastComp from "../../Components/ToastComp";
import SelectBBPSOperator from "./SelectBBPSOperator";
import { primaryColor } from "../../Utils/Style";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import ButtonComp from "../../Components/ButtonComp";
import BillPreview from "./BillPreview";
import Loader from "../../Components/Loader";
import { IoFlashSharp, IoCheckmarkCircle } from "react-icons/io5";
import { MdElectricBolt, MdInfo } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const MainBBPS = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [data, setData] = useState();
  const [number, setNumber] = useState(null);
  const [isFastag, setIsFastag] = useState(false);
  const { bbpsOperatorList, universalLoader, fetchBBPSBill } = useSelector(
    (state) => state.ServiceSlice
  );

  const handlFetchBill = async () => {
    const { cn, ...restFields } = formData;
    const adFields = {};
    Object.values(restFields).forEach((val, index) => {
      adFields[`ad${index + 1}`] = val;
    });
    const payload = {
      operator: data.op_id,
      number: cn,
      ...adFields,
    };

    const res = await dispatch(Fetch_BPPS_BILL({ payload }));
    if (res.payload.ResponseStatus === 1) {
      if (res.payload.Data.status == "success") {
        setStep(3);
      } else {
        ToastComp({ message: res.payload.Data.message, type: "failed" });
      }
    } else {
      ToastComp({ message: res.payload.Remarks, type: "error" });
    }
  };

  const handlFetchFastagBill = async () => {
    const payload = {
      operator: data.op_id,
      number: number,
      ad1: data.ad,
    };

    const res = await dispatch(Fetch_BPPS_BILL({ payload }));
    if (res.payload.ResponseStatus === 1) {
      if (res.payload.Data.status == "success") {
        setStep(3);
      } else {
        ToastComp({ message: res.payload.Data.message, type: "failed" });
      }
    } else {
      ToastComp({ message: res.payload.Remarks, type: "error" });
    }
  };

  useEffect(() => {
    const serviceId = state._id;
    dispatch(Fetch_BPPS_Operator_List({ serviceId }));
    setIsFastag(serviceId === "64c9e66d1efc768da459ef09");
  }, []);
  const handleInputChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const rightDesign = () => {
    return (
      <div className="">
        <img
        width={100}
          height={40}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt=""
        />
      </div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const getFieldIcon = (fieldName) => {
    const name = fieldName?.toLowerCase() || "";
    if (name.includes("mobile") || name.includes("phone")) return "📱";
    if (name.includes("email")) return "📧";
    if (name.includes("account") || name.includes("number")) return "🔢";
    if (name.includes("name")) return "👤";
    return "📝";
  };

  const isFieldValid = (field) => {
    return formData[field.id] && formData[field.id].length > 0;
  };

  return (
    <div>
      {step === 1 && (
        <div className="">
          <div className="fixed top-0 w-full">
            <CommonHeader
              title={"Select Biller"}
              handleclick={() => navigate(-1)}
              rightDesign={rightDesign}
            />
          </div>
          <div className="mt-16">
            <SelectBBPSOperator
              data={bbpsOperatorList.Data}
              setStep={setStep}
              setData={setData}
            />
          </div>
        </div>
      )}
      {step === 2 && (
        // (!isFastag ? (
        //   <div className="">
        //     <div className="fixed top-0 w-full">
        //       <CommonHeader
        //         style={{ fontSize: 12 }}
        //         title={`${data?.operator_name?.slice(0, 30)}...`}
        //         handleclick={() => setStep(1)}
        //         rightDesign={rightDesign}
        //       />
        //     </div>
        //     <div className="relative mt-16 flex-1 p-2">
        //       {data.fieldSchema?.map((item, index) => {
        //         return (
        //           <div
        //             key={index}
        //             className="bg-gray-100 p-4 mb-3 rounded-lg"
        //           >
        //             <div className="">
        //               <input
        //                 className="outline-none text-xs placeholder:font-semibold font-semibold tracking-wider w-full p-1"
        //                 value={formData[item.id] || ""}
        //                 onChange={(e) => {
        //                   const value = e.target.value;

        //                   // Sirf allowed characters check karo
        //                   if (!/^[0-9N]*$/.test(value)) return; // N ya digits allow

        //                   handleInputChange(item.id, value);
        //                 }}
        //                 placeholder={
        //                   `Enter ${item.displayname}` || "Enter Number"
        //                 }
        //                 type={"text"} // type=number na rakho, taaki maxLength & regex work kare
        //               />
        //             </div>
        //           </div>
        //         );
        //       })}

        //       <div className="fixed bottom-4 text-center space-y-2 left-0 w-full px-2">
        //         <ButtonComp title={"Fetch Bill"} handleClick={handlFetchBill} />
        //       </div>
        //     </div>
        //   </div>
        // ) : (
        //   <div className="">
        //     <div className="fixed top-0 w-full">
        //       <CommonHeader
        //         style={{ fontSize: 13 }}
        //         title={`${data?.operator_name?.slice(0, 30)}...`}
        //         handleclick={() => setStep(1)}
        //         rightDesign={rightDesign}
        //       />
        //     </div>
        //     <div className="relative mt-16 flex-1 p-2">
        //       <div className="bg-gray-100 border-gray-400 border p-3 mb-3 rounded-lg">
        //         <div>
        //           <input
        //             className="outline-none placeholder:font-semibold font-semibold tracking-wider w-full p-1"
        //             value={number}
        //             onChange={(e) => {
        //               setNumber(e.target.value);
        //             }}
        //             placeholder={`Enter ${data.displayname}` || "Enter Number"}
        //             type={"text"} // type=number na rakho, taaki maxLength & regex work kare
        //           />
        //         </div>
        //       </div>
        //       <div className="fixed text-center bottom-4 space-y-2 left-0 w-full px-2">
        //         <ButtonComp
        //           title={"Confirm"}
        //           handleClick={handlFetchFastagBill}
        //         />
        //       </div>
        //     </div>
        //   </div>
        // ))
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <CommonHeader
              style={{ fontSize: 12 }}
              title={`${data?.operator_name?.slice(0, 30)}${
                data?.operator_name?.length > 30 ? "..." : ""
              }`}
              handleclick={() => setStep(1)}
              rightDesign={rightDesign}
            />
          </div>

          {/* Main Content */}
          <div className="pt-16 pb-24 px-4">
            {!isFastag ? (
              // Multiple Fields Form
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Operator Info Card */}
                <motion.div className="mt-6 mb-6" variants={itemVariants}>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 shadow-xl overflow-hidden relative">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <IoFlashSharp className="text-yellow-300 text-lg" />
                          </div>
                          <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                            Quick Payment
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-1">
                          {data?.operator_name}
                        </h2>
                        <p className="text-white/80 text-xs">
                          Fill details to fetch your bill
                        </p>
                      </div>
                      {data.icon && (
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3">
                          <img
                            src={data.icon}
                            alt={data.operator_name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Form Fields */}
                <AnimatePresence>
                  {data.fieldSchema?.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      variants={itemVariants}
                      layout
                    >
                      <div className="relative">
                        {/* Field Label */}
                        <motion.label
                          className="block text-xs font-bold text-gray-700 mb-2 ml-1"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="mr-1">
                            {getFieldIcon(item.displayname)}
                          </span>
                          {item.displayname}
                          {item.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </motion.label>

                        {/* Input Field */}
                        <div className="relative group">
                          {/* Gradient border effect on focus */}
                          <div
                            className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300`}
                          ></div>

                          <div
                            className={`relative bg-white rounded-2xl shadow-md group-focus-within:shadow-xl transition-all duration-300 border-2 ${
                              isFieldValid(item)
                                ? "border-green-200"
                                : "border-gray-100 group-focus-within:border-blue-200"
                            }`}
                          >
                            <div className="flex items-center px-4 py-4">
                              {/* Icon Container */}
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mr-3 transition-all duration-300 ${
                                  isFieldValid(item)
                                    ? "bg-gradient-to-br from-green-500 to-emerald-500"
                                    : "bg-gradient-to-br from-gray-100 to-gray-200 group-focus-within:from-blue-100 group-focus-within:to-purple-100"
                                }`}
                              >
                                {isFieldValid(item) ? (
                                  <IoCheckmarkCircle className="text-white text-xl" />
                                ) : (
                                  <span className="text-lg">
                                    {getFieldIcon(item.displayname)}
                                  </span>
                                )}
                              </div>

                              {/* Input */}
                              <input
                                className="flex-1 outline-none text-sm font-semibold text-gray-800 placeholder-gray-400 bg-transparent"
                                value={formData[item.id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Validation based on field type
                                  if (item.datatype === "NUMERIC") {
                                    if (!/^[0-9]*$/.test(value)) return;
                                  } else if (item.datatype === "ALPHANUMERIC") {
                                    if (!/^[0-9A-Za-z]*$/.test(value)) return;
                                  }
                                  handleInputChange(item.id, value);
                                }}
                                placeholder={`Enter ${item.displayname}`}
                                type="text"
                                maxLength={item.maxlength || undefined}
                              />

                              {/* Character count */}
                              {item.maxlength && formData[item.id] && (
                                <span className="text-[10px] font-semibold text-gray-400 ml-2">
                                  {formData[item.id].length}/{item.maxlength}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Helper text */}
                        {item.helpText && (
                          <motion.p
                            className="text-[10px] text-gray-500 mt-2 ml-4 flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <MdInfo className="mr-1" />
                            {item.helpText}
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Info Card */}
                <motion.div variants={itemVariants}>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100 mt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800 mb-1">
                          Important Note
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Please ensure all details are correct. We'll fetch
                          your bill details instantly!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Single Field Form (Fastag)
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Fastag Info Card */}
                <div className="mt-6 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <MdElectricBolt className="text-yellow-300 text-lg" />
                          </div>
                          <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                            Fastag Payment
                          </span>
                        </div>
                        <h2 className="text-xl font-black text-white mb-1">
                          {data?.operator_name}
                        </h2>
                        <p className="text-white/80 text-xs">
                          Enter your vehicle/tag details
                        </p>
                      </div>
                      {data.icon && (
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-3">
                          <img
                            src={data.icon}
                            alt={data.operator_name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Input Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">
                    <span className="mr-1">🚗</span>
                    {data.displayname || "Vehicle Number"}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300"></div>

                    <div className="relative bg-white rounded-2xl shadow-md group-focus-within:shadow-xl transition-all duration-300 border-2 border-gray-100 group-focus-within:border-orange-200">
                      <div className="flex items-center px-4 py-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 group-focus-within:from-orange-100 group-focus-within:to-red-100 rounded-xl flex items-center justify-center flex-shrink-0 mr-3 transition-all duration-300">
                          <span className="text-lg">🚗</span>
                        </div>

                        <input
                          className="flex-1 outline-none text-sm placeholder:text-[10px] font-semibold text-gray-800 placeholder-gray-400 bg-transparent uppercase"
                          value={number}
                          onChange={(e) => {
                            setNumber(e.target.value.toUpperCase());
                          }}
                          placeholder={`Enter ${data.displayname || "Details"}`}
                          type="text"
                        />

                        {number && number.length > 0 && (
                          <IoCheckmarkCircle className="text-green-500 text-xl" />
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 mt-2 ml-4 flex items-center">
                    <MdInfo className="mr-1" />
                    Enter complete vehicle or tag details
                  </p>
                </motion.div>

                {/* Security Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-800 mb-0.5">
                          Secure & Fast
                        </h4>
                        <p className="text-xs text-gray-600">
                          Your payment is 100% secure with instant processing
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bottom Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-40">
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.button
                onClick={isFastag ? handlFetchFastagBill : handlFetchBill}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isFastag ? "Confirm" : "Fetch Bill"}</span>
                <IoFlashSharp className="text-xl" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      )}
      {step === 3 && (
        <BillPreview
          data={fetchBBPSBill?.Data?.data}
          operatorData={data}
          number={!isFastag ? formData : number}
          ButtonName={"PAY BILL"}
        />
      )}
      {universalLoader && <Loader />}
    </div>
  );
};

export default MainBBPS;

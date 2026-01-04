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
          width={70}
          height={30}
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
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white relative">
          {/* subtle background */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute bottom-[-120px] left-[-80px] h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl" />
          </div>

          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <CommonHeader
              style={{ fontSize: 12 }}
              title={`${data?.operator_name?.slice(0, 30)}${
                data?.operator_name?.length > 30 ? "..." : ""
              }`}
              handleclick={() => setStep(1)}
              rightDesign={rightDesign}
            />
          </div>

          {/* Content */}
          <motion.div
            className="pt-16 pb-28 px-3 sm:px-4 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Hero / Operator card */}
            <motion.div
              className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div
                className={`p-5 ${isFastag ? "bg-slate-900" : "bg-slate-900"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    {isFastag ? (
                      <MdElectricBolt className="text-yellow-300 text-2xl" />
                    ) : (
                      <IoFlashSharp className="text-yellow-300 text-2xl" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-black text-white/70 uppercase tracking-wider">
                      {isFastag ? "FASTAG PAYMENT" : "BBPS QUICK PAYMENT"}
                    </p>
                    <h2 className="text-white font-black text-lg sm:text-xl leading-tight mt-1 truncate">
                      {data?.operator_name}
                    </h2>
                    <p className="text-white/70 text-xs sm:text-sm mt-1">
                      {isFastag
                        ? "Enter your vehicle / tag details to fetch bill."
                        : "Fill details below to fetch your bill instantly."}
                    </p>
                  </div>

                  {data?.icon && (
                    <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/15 p-2 shrink-0">
                      <img
                        src={data.icon}
                        alt={data.operator_name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* trust row */}
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat
                    title="Secure"
                    subtitle="Encrypted"
                    icon={
                      <span className="text-sm" role="img" aria-label="lock">
                        🔒
                      </span>
                    }
                  />
                  <MiniStat
                    title="Instant"
                    subtitle="Bill fetch"
                    icon={
                      <span className="text-sm" role="img" aria-label="bolt">
                        ⚡
                      </span>
                    }
                  />
                  <MiniStat
                    title="24/7"
                    subtitle="Available"
                    icon={
                      <span className="text-sm" role="img" aria-label="clock">
                        🕒
                      </span>
                    }
                  />
                </div>
              </div>
            </motion.div>

            {/* Form card */}
            <motion.div
              className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.06)] overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900">
                    Enter details
                  </p>
                  <p className="text-xs text-slate-500 font-semibold">
                    Fields marked * are required
                  </p>
                </div>

                <span className="text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full">
                  Step 2/3
                </span>
              </div>

              <div className="p-4 sm:p-5">
                {!isFastag ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    <AnimatePresence>
                      {data?.fieldSchema?.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          variants={itemVariants}
                          layout
                        >
                          <FieldInput
                            item={item}
                            index={index}
                            value={formData[item.id] || ""}
                            onChange={(val) => handleInputChange(item.id, val)}
                            isValid={isFieldValid(item)}
                            getIcon={getFieldIcon}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* note */}
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <MdInfo className="text-xl text-slate-700" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900">
                            Double-check details
                          </p>
                          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                            Please ensure the entered details match your biller
                            records. We’ll fetch your bill instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wide">
                      🚗 {data?.displayname || "Vehicle / Tag Details"}{" "}
                      <span className="text-rose-600">*</span>
                    </label>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <span className="text-lg">🚗</span>
                        </div>

                        <input
                          className="flex-1 bg-transparent outline-none text-base sm:text-lg font-black text-slate-900 placeholder:text-slate-300 uppercase min-w-0"
                          value={number || ""}
                          onChange={(e) =>
                            setNumber(e.target.value.toUpperCase())
                          }
                          placeholder={`Enter ${
                            data?.displayname || "details"
                          }`}
                          type="text"
                        />

                        {number && number.length > 0 && (
                          <IoCheckmarkCircle className="text-emerald-600 text-xl shrink-0" />
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-2">
                      <MdInfo />
                      Enter complete details (vehicle number / tag).
                    </p>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm font-black text-emerald-900">
                        Secure & fast
                      </p>
                      <p className="text-xs text-emerald-800 mt-1">
                        Your request is encrypted and processed instantly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom button */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-3 sm:p-4 safe-area-bottom">
            <div className="max-w-xl mx-auto">
              <motion.button
                onClick={isFastag ? handlFetchFastagBill : handlFetchBill}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-[0_18px_55px_rgba(2,6,23,0.18)] active:scale-[0.99] transition flex items-center justify-center gap-2"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isFastag ? "Confirm & Fetch" : "Fetch Bill"}</span>
                <IoFlashSharp className="text-xl" />
              </motion.button>

              <p className="mt-2 text-center text-[11px] text-slate-500 font-semibold">
                By continuing you agree to fetch bill details from the biller.
              </p>
            </div>
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

const MiniStat = ({ title, subtitle, icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black text-slate-900 leading-none">
          {title}
        </p>
        <p className="text-[10px] font-semibold text-slate-500 mt-1 leading-none">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

const FieldInput = ({ item, value, onChange, isValid, getIcon }) => {
  return (
    <div>
      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wide mb-2">
        <span className="mr-1">{getIcon(item.displayname)}</span>
        {item.displayname}
        {item.required && <span className="text-rose-600 ml-1">*</span>}
      </label>

      <div
        className={`rounded-3xl border p-3 transition bg-slate-50
          ${
            isValid
              ? "border-emerald-200"
              : "border-slate-200 focus-within:border-slate-400"
          }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0
              ${
                isValid
                  ? "bg-emerald-600 border-emerald-600"
                  : "bg-white border-slate-200"
              }`}
          >
            {isValid ? (
              <IoCheckmarkCircle className="text-white text-xl" />
            ) : (
              <span className="text-lg">{getIcon(item.displayname)}</span>
            )}
          </div>

          <input
            className="flex-1 bg-transparent outline-none text-base sm:text-lg font-black text-slate-900 placeholder:text-slate-300 min-w-0"
            value={value}
            onChange={(e) => {
              const next = e.target.value;

              // SAME validation rules
              if (item.datatype === "NUMERIC") {
                if (!/^[0-9]*$/.test(next)) return;
              } else if (item.datatype === "ALPHANUMERIC") {
                if (!/^[0-9A-Za-z]*$/.test(next)) return;
              }

              onChange(next);
            }}
            placeholder={`Enter ${item.displayname}`}
            type="text"
            maxLength={item.maxlength || undefined}
          />

          {item.maxlength && value?.length > 0 && (
            <span className="text-[10px] font-black text-slate-400 shrink-0">
              {value.length}/{item.maxlength}
            </span>
          )}
        </div>
      </div>

      {item.helpText && (
        <p className="mt-2 text-[11px] text-slate-500 font-semibold flex items-center gap-2">
          <MdInfo />
          {item.helpText}
        </p>
      )}
    </div>
  );
};

export default MainBBPS;

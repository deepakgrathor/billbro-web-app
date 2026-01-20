import React, { useEffect, useState } from "react";
import CommonHeader from "../../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { registerComplaint, trackComplaintById } from "./ComplainAPI";
import ToastComp from "../../../Components/ToastComp";
import Loader from "../../../Components/Loader";
import { 
  BsCheckCircle, 
  BsClock, 
  BsXCircle, 
  BsInfoCircle,
  BsShieldCheck,
  BsSearch,
  BsFileText
} from "react-icons/bs";

const BBPSComplain = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const location = useLocation();
  
  // Complaint Register states
  const [complaintMethod, setComplaintMethod] = useState("transaction");
  const [transactionId, setTransactionId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [complaintDetails, setComplaintDetails] = useState("");

  // Complaint Tracking states
  const [complaintId, setComplaintId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const rightDesign = () => (
    <img
      width={70}
      height={30}
      src="https://ik.imagekit.io/isjriggan/images%20(1).png"
      alt="Bharat Connect"
      // className="h-8 w-auto"
    />
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleComplaintRegister = async () => {
    // Validation
    if (complaintMethod === "transaction") {
      if (!transactionId.trim()) {
        ToastComp({ message: "Please enter Transaction ID", type: "error" });
        return;
      }
      if (transactionId.length < 5) {
        ToastComp({ message: "Please enter a valid Transaction ID", type: "error" });
        return;
      }
    } else {
      if (!mobileNumber.trim() || !transactionDate) {
        ToastComp({ message: "Please enter Mobile Number and Transaction Date", type: "error" });
        return;
      }
      if (mobileNumber.length !== 10) {
        ToastComp({ message: "Please enter valid 10 digit mobile number", type: "error" });
        return;
      }
    }

    if (!complaintDetails.trim()) {
      ToastComp({ message: "Please enter complaint details", type: "error" });
      return;
    }

    if (complaintDetails.length < 10) {
      ToastComp({ message: "Please enter at least 10 characters in complaint details", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const complaintData = {
        registrationMethod: complaintMethod,
        transactionId: complaintMethod === "transaction" ? transactionId : null,
        mobileNumber: complaintMethod === "mobile" ? mobileNumber : null,
        transactionDate: complaintMethod === "mobile" ? transactionDate : null,
        complaintDetails: complaintDetails,
      };

      const result = await registerComplaint(complaintData);

      if (result.success) {
        const successData = {
          complaintId: result.data.complaintId,
          status: result.data.status,
          registeredDate: result.data.registeredDate,
          expectedResolution: result.data.expectedResolution,
          registrationMethod: complaintMethod,
          transactionId: complaintMethod === "transaction" ? transactionId : null,
          mobileNumber: complaintMethod === "mobile" ? mobileNumber : null,
          transactionDate: complaintMethod === "mobile" ? transactionDate : null,
          complaintDetails: complaintDetails,
        };

        setTransactionId("");
        setMobileNumber("");
        setTransactionDate("");
        setComplaintDetails("");
        setComplaintMethod("transaction");
        setLoading(false);

        navigate("/bbps-complaint-success", {
          state: { complaintData: successData },
        });
      } else {
        setLoading(false);
        ToastComp({ message: result.message || "Failed to register complaint", type: "error" });
      }
    } catch (error) {
      setLoading(false);
      ToastComp({ message: error.message || "Failed to register complaint. Please try again.", type: "error" });
    }
  };

  const handleComplaintTracking = async () => {
    if (!complaintId.trim()) {
      ToastComp({ message: "Please enter Complaint ID", type: "error" });
      return;
    }

    if (!complaintId.startsWith("CMP")) {
      ToastComp({ message: "Invalid Complaint ID format. Complaint ID should start with 'CMP'", type: "error" });
      return;
    }

    setLoading(true);
    setTrackingResult(null);

    try {
      const result = await trackComplaintById(complaintId);

      if (result.success) {
        setTrackingResult({
          complaintId: result.data.complaintId,
          status: result.data.status,
          registeredDate: formatDate(result.data.registeredDate),
          lastUpdated: formatDate(result.data.lastUpdated),
          expectedResolution: formatDateOnly(result.data.expectedResolution),
          remarks: result.data.remarks,
          resolution: result.data.resolution,
          method: result.data.registrationMethod,
          transactionId: result.data.transactionId,
          mobileNumber: result.data.mobileNumber,
          transactionDate: result.data.transactionDate ? formatDateOnly(result.data.transactionDate) : null,
        });
      } else {
        ToastComp({ message: result.message || "Complaint not found", type: "error" });
      }
    } catch (error) {
      ToastComp({ message: error.message || "Failed to track complaint. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.activeTab) {
      setStep(location.state.activeTab);
    }
    if (location.state?.complaintId) {
      setComplaintId(location.state.complaintId);
    }
    if (location.state?.transactionId) {
      setTransactionId(location.state.transactionId);
    }
  }, [location.state]);

  const getStatusConfig = (status) => {
    const configs = {
      "Resolved": {
        icon: BsCheckCircle,
        gradient: "from-emerald-500 to-green-600",
        bg: "from-emerald-50 to-green-50",
        text: "text-emerald-700",
        border: "border-emerald-200"
      },
      "In Progress": {
        icon: BsClock,
        gradient: "from-blue-500 to-indigo-600",
        bg: "from-blue-50 to-indigo-50",
        text: "text-blue-700",
        border: "border-blue-200"
      },
      "Closed": {
        icon: BsXCircle,
        gradient: "from-gray-500 to-slate-600",
        bg: "from-gray-50 to-slate-50",
        text: "text-gray-700",
        border: "border-gray-200"
      },
      "Pending": {
        icon: BsClock,
        gradient: "from-amber-500 to-orange-600",
        bg: "from-amber-50 to-orange-50",
        text: "text-amber-700",
        border: "border-amber-200"
      }
    };
    return configs[status] || configs["Pending"];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <CommonHeader
          title="Register Complaint"
          handleclick={() => navigate("/")}
          // rightDesign={rightDesign}
        />
      </div>

      <div className="pt-20 pb-8 px-3 sm:px-4 md:px-6 max-w-4xl mx-auto">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 1, label: "Register", icon: BsFileText },
                { id: 2, label: "Track", icon: BsSearch }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep(tab.id);
                    if (tab.id === 2) setTrackingResult(null);
                  }}
                  className={`relative flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
                    step === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  {step === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Register Tab */}
          {step === 1 && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Method Selection Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <BsShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Register Complaint By
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      value: "transaction",
                      title: "Transaction Reference ID",
                      desc: "Use your transaction ID to register complaint"
                    },
                    {
                      value: "mobile",
                      title: "Mobile Number + Date",
                      desc: "Use mobile number and transaction date"
                    }
                  ].map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        complaintMethod === option.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      <input
                        type="radio"
                        name="complaintMethod"
                        value={option.value}
                        checked={complaintMethod === option.value}
                        onChange={(e) => setComplaintMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{option.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Input Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-gray-100 space-y-4"
              >
                {complaintMethod === "transaction" ? (
                  <InputField
                    label="Transaction ID"
                    placeholder="Enter Transaction ID (e.g., TXN123456789)"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    disabled={loading}
                    required
                  />
                ) : (
                  <>
                    <InputField
                      label="Mobile Number"
                      placeholder="Enter 10-digit Mobile Number"
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setMobileNumber(value);
                      }}
                      disabled={loading}
                      required
                    />
                    <InputField
                      label="Transaction Date"
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      disabled={loading}
                      required
                    />
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1">
                    Complaint Details <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 rounded-xl p-3 sm:p-4 transition-all ${
                    complaintDetails.length >= 10 ? "border-green-300 bg-green-50/30" : "border-gray-300 bg-white"
                  } focus-within:border-blue-500 focus-within:shadow-md`}>
                    <textarea
                      className="outline-none text-sm w-full bg-transparent placeholder-gray-400 resize-none"
                      placeholder="Describe your complaint in detail (minimum 10 characters)"
                      rows="5"
                      value={complaintDetails}
                      onChange={(e) => setComplaintDetails(e.target.value)}
                      disabled={loading}
                    />
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Minimum 10 characters</span>
                      <span className={`text-xs font-bold ${
                        complaintDetails.length < 10 ? "text-red-500" : "text-green-600"
                      }`}>
                        {complaintDetails.length} / 10
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info Alert */}
              <InfoAlert
                icon={BsInfoCircle}
                title="Important Information"
                message="Please provide complete and accurate details for faster resolution. You will receive a unique Complaint ID which should be saved for tracking purposes."
              />

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleComplaintRegister}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Complaint"}
              </motion.button>
            </motion.div>
          )}

          {/* Track Tab */}
          {step === 2 && (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-5"
            >
              {/* Search Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <BsSearch className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900">
                    Track Your Complaint
                  </h3>
                </div>

                <InputField
                  label="Complaint ID"
                  placeholder="Enter Complaint ID (e.g., CMP_1234567890123)"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                  disabled={loading}
                  required
                  className="uppercase font-mono"
                />

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleComplaintTracking}
                  disabled={loading}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {loading ? "Tracking..." : "Track Complaint"}
                </motion.button>
              </motion.div>

              {/* Tracking Result */}
              <AnimatePresence>
                {trackingResult && (
                  <TrackingResultCard result={trackingResult} statusConfig={getStatusConfig(trackingResult.status)} />
                )}
              </AnimatePresence>

              {/* Help Alert */}
              <InfoAlert
                icon={BsInfoCircle}
                title="Need Help?"
                message="If you don't have your Complaint ID, you can register a new complaint from the 'Register' tab. Make sure to save the Complaint ID for future reference."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading && <Loader />}
    </div>
  );
};

// Input Field Component
const InputField = ({ label, required, className = "", ...props }) => (
  <div className="space-y-2">
    <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none text-sm transition-all focus:border-blue-500 focus:shadow-md bg-white placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  </div>
);

// Info Alert Component
const InfoAlert = ({ icon: Icon, title, message }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 shadow-md"
  >
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-bold text-amber-900 mb-1">{title}</p>
        <p className="text-xs text-amber-800 leading-relaxed">{message}</p>
      </div>
    </div>
  </motion.div>
);

// Tracking Result Card
const TrackingResultCard = ({ result, statusConfig }) => {
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100"
    >
      {/* Status Header */}
      <div className={`bg-gradient-to-r ${statusConfig.gradient} text-white p-5 sm:p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium opacity-90 mb-1">Complaint Status</p>
            <p className="text-2xl sm:text-3xl font-black">{result.status}</p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <StatusIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-6 space-y-4">
        <DetailRow label="Complaint ID" value={result.complaintId} mono />
        <DetailRow label="Registered On" value={result.registeredDate} />
        <DetailRow label="Last Updated" value={result.lastUpdated} />
        <DetailRow label="Expected Resolution" value={result.expectedResolution} highlight />

        {/* Remarks */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-600 mb-2">Remarks</p>
          <div className="bg-gray-50 border-2 border-gray-200 p-4 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">{result.remarks}</p>
          </div>
        </div>

        {/* Resolution */}
        {result.resolution && (
          <div className="pt-2">
            <p className="text-xs font-bold text-gray-600 mb-2">Resolution</p>
            <div className="bg-green-50 border-2 border-green-200 p-4 rounded-xl">
              <p className="text-sm text-green-800 leading-relaxed">{result.resolution}</p>
            </div>
          </div>
        )}

        {/* Transaction Details */}
        {result.method && (
          <div className={`bg-gradient-to-r ${statusConfig.bg} border-2 ${statusConfig.border} p-4 rounded-xl`}>
            <p className="text-xs font-bold text-gray-700 mb-2">Complaint Details</p>
            <div className="space-y-1 text-xs text-gray-600">
              {result.transactionId && (
                <p>Transaction ID: <span className="font-mono font-bold">{result.transactionId}</span></p>
              )}
              {result.mobileNumber && <p>Mobile: <span className="font-bold">{result.mobileNumber}</span></p>}
              {result.transactionDate && <p>Date: <span className="font-bold">{result.transactionDate}</span></p>}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Detail Row Component
const DetailRow = ({ label, value, mono, highlight }) => (
  <div className="flex items-center justify-between py-2 border-b-2 border-gray-100">
    <span className="text-xs sm:text-sm font-medium text-gray-600">{label}</span>
    <span className={`text-xs sm:text-sm font-bold text-right max-w-[60%] break-all ${
      mono ? "font-mono" : ""
    } ${highlight ? "text-blue-600" : "text-gray-900"}`}>
      {value}
    </span>
  </div>
);

export default BBPSComplain;
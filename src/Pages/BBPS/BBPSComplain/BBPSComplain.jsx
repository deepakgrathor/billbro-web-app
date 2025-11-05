import React, { useEffect, useState } from "react";
import CommonHeader from "../../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComp from "../../../Components/ButtonComp";
import { registerComplaint, trackComplaintById } from "./ComplainAPI";
import ToastComp from "../../../Components/ToastComp";
import Loader from "../../../Components/Loader";

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

  // Get userId from localStorage or context (adjust as per your auth system)
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id || user.id || "guest_user";
  };

  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={60}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt="Bharat Connect"
        />
      </div>
    );
  };

  // Format date for display
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

  // Handle Complaint Registration
  const handleComplaintRegister = async () => {

    // Validation
    if (complaintMethod === "transaction") {
      if (!transactionId.trim()) {
        ToastComp({ message: "Please enter Transaction ID", type: "error" });
        return;
      }
      if (transactionId.length < 5) {
        ToastComp({
          message: "Please enter a valid Transaction ID",
          type: "error",
        });
        return;
      }
    } else {
      if (!mobileNumber.trim() || !transactionDate) {
        ToastComp({
          message: "Please enter Mobile Number and Transaction Date",
          type: "error",
        });
        return;
      }
      if (mobileNumber.length !== 10) {
        ToastComp({
          message: "Please enter valid 10 digit mobile number",
          type: "error",
        });
        return;
      }
    }

    if (!complaintDetails.trim()) {
      ToastComp({ message: "Please enter complaint details", type: "error" });
      return;
    }

    if (complaintDetails.length < 10) {
      ToastComp({
        message: "Please enter at least 10 characters in complaint details",
        type: "error",
      });
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
        // Store data for success screen
        const successData = {
          complaintId: result.data.complaintId,
          status: result.data.status,
          registeredDate: result.data.registeredDate,
          expectedResolution: result.data.expectedResolution,
          registrationMethod: complaintMethod,
          transactionId:
            complaintMethod === "transaction" ? transactionId : null,
          mobileNumber: complaintMethod === "mobile" ? mobileNumber : null,
          transactionDate:
            complaintMethod === "mobile" ? transactionDate : null,
          complaintDetails: complaintDetails,
        };


        // Reset form BEFORE navigation
        setTransactionId("");
        setMobileNumber("");
        setTransactionDate("");
        setComplaintDetails("");
        setComplaintMethod("transaction");
        setLoading(false);

        // Navigate after small delay to ensure state is updated

        navigate("/bbps-complaint-success", {
          state: {
            complaintData: successData,
          },
        });
      } else {
        setLoading(false);
        ToastComp({
          message: result.message || "Failed to register complaint",
          type: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      ToastComp({
        message:
          error.message || "Failed to register complaint. Please try again.",
        type: "error",
      });
    }
  };
  // Handle Complaint Tracking
  const handleComplaintTracking = async () => {
    if (!complaintId.trim()) {
      ToastComp({
        message: "Please enter Complaint ID",
        type: "error",
      });
    }

    if (!complaintId.startsWith("CMP")) {
      ToastComp({
        message:
          "Invalid Complaint ID format. Complaint ID should start with 'CMP'",
        type: "error",
      });

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
          transactionDate: result.data.transactionDate
            ? formatDateOnly(result.data.transactionDate)
            : null,
        });
      } else {
        ToastComp({
          message: result.message || "Complaint not found",
          type: "error",
        });
      }
    } catch (error) {
      ToastComp({
        message:
          error.message || "Failed to track complaint. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Check if we're coming from success screen with tracking request
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 w-full z-10 bg-white shadow-sm">
        <CommonHeader
          title="BBPS Complaint"
          handleclick={() => navigate('/')}
          rightDesign={rightDesign}
        />
      </div>

      <div className="pt-16 pb-6">
        {/* Tabs */}
        <div className="px-4 mt-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setStep(1);
                setTrackingResult(null);
              }}
              className={`flex-1 border tracking-wider text-sm font-medium ${
                step === 1
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-600"
              } rounded-lg p-3 text-center transition-all duration-200 shadow-sm`}
            >
              Complaint Register
            </button>
            <button
              onClick={() => setStep(2)}
              className={`flex-1 border tracking-wider text-sm font-medium ${
                step === 2
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-600"
              } rounded-lg p-3 text-center transition-all duration-200 shadow-sm`}
            >
              Complaint Tracking
            </button>
          </div>
        </div>

        {/* Complaint Register Tab */}
        {step === 1 && (
          <div className="p-4">
            <div className="space-y-4">
              {/* Registration Method Selection */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Register Complaint By:
                </p>
                <div className="space-y-3">
                  {/* Transaction ID Option */}
                  <label className="flex items-center space-x-3 cursor-pointer bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="complaintMethod"
                      value="transaction"
                      checked={complaintMethod === "transaction"}
                      onChange={(e) => setComplaintMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">
                        Transaction Reference ID
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Use your transaction ID to register complaint
                      </p>
                    </div>
                  </label>

                  {/* Mobile + Date Option */}
                  <label className="flex items-center space-x-3 cursor-pointer bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors">
                    <input
                      type="radio"
                      name="complaintMethod"
                      value="mobile"
                      checked={complaintMethod === "mobile"}
                      onChange={(e) => setComplaintMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">
                        Mobile Number + Date
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Use mobile number and transaction date
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Input Fields */}
              {complaintMethod === "transaction" ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700 ml-1">
                    Transaction ID *
                  </label>
                  <div className="border-2 border-gray-300 focus-within:border-blue-500 rounded-xl p-3 bg-white transition-colors shadow-sm">
                    <input
                      className="outline-none text-sm w-full bg-transparent placeholder-gray-400"
                      placeholder="Enter Transaction ID (e.g., TXN123456789)"
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 ml-1">
                      Mobile Number *
                    </label>
                    <div className="border-2 border-gray-300 focus-within:border-blue-500 rounded-xl p-3 bg-white transition-colors shadow-sm">
                      <input
                        className="outline-none text-sm w-full bg-transparent placeholder-gray-400"
                        placeholder="Enter 10-digit Mobile Number"
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setMobileNumber(value);
                        }}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 ml-1">
                      Transaction Date *
                    </label>
                    <div className="border-2 border-gray-300 focus-within:border-blue-500 rounded-xl p-3 bg-white transition-colors shadow-sm">
                      <input
                        className="outline-none text-sm w-full bg-transparent"
                        type="date"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Complaint Details */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 ml-1">
                  Complaint Details *
                </label>
                <div className="border-2 border-gray-300 focus-within:border-blue-500 rounded-xl p-3 bg-white transition-colors shadow-sm">
                  <textarea
                    className="outline-none text-sm w-full bg-transparent placeholder-gray-400 resize-none"
                    placeholder="Describe your complaint in detail (minimum 10 characters)"
                    rows="5"
                    value={complaintDetails}
                    onChange={(e) => setComplaintDetails(e.target.value)}
                    disabled={loading}
                  />
                  <div className="text-right mt-1">
                    <span
                      className={`text-xs ${
                        complaintDetails.length < 10
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {complaintDetails.length} / 10 min
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-amber-900 mb-1">
                      Important Information
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Please provide complete and accurate details for faster
                      resolution. You will receive a unique Complaint ID which
                      should be saved for tracking purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <ButtonComp
                  title={loading ? "Submitting..." : "Submit Complaint"}
                  handleClick={handleComplaintRegister}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Complaint Tracking Tab */}
        {step === 2 && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 ml-1">
                  Complaint ID *
                </label>
                <div className="border-2 border-gray-300 focus-within:border-blue-500 rounded-xl p-3 bg-white transition-colors shadow-sm">
                  <input
                    className="outline-none text-sm w-full bg-transparent placeholder-gray-400 uppercase"
                    placeholder="Enter Complaint ID (e.g., CMP_1234567890123)"
                    type="text"
                    value={complaintId}
                    onChange={(e) =>
                      setComplaintId(e.target.value.toUpperCase())
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="pt-2">
                <ButtonComp
                  title={loading ? "Tracking..." : "Track Complaint"}
                  handleClick={handleComplaintTracking}
                  disabled={loading}
                />
              </div>

              {/* Tracking Result */}
              {trackingResult && (
                <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-fadeIn">
                  <div
                    className={`${
                      trackingResult.status === "Resolved"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : trackingResult.status === "In Progress"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : trackingResult.status === "Closed"
                        ? "bg-gradient-to-r from-gray-500 to-gray-600"
                        : "bg-gradient-to-r from-orange-500 to-orange-600"
                    } text-white p-5`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium opacity-90">
                          Complaint Status
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {trackingResult.status}
                        </p>
                      </div>
                      <svg
                        className="w-12 h-12 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <span className="text-xs font-medium text-gray-500">
                        Complaint ID
                      </span>
                      <span className="text-sm font-semibold text-gray-900 font-mono">
                        {trackingResult.complaintId}
                      </span>
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <span className="text-xs font-medium text-gray-500">
                        Registered On
                      </span>
                      <span className="text-sm text-gray-700">
                        {trackingResult.registeredDate}
                      </span>
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <span className="text-xs font-medium text-gray-500">
                        Last Updated
                      </span>
                      <span className="text-sm text-gray-700">
                        {trackingResult.lastUpdated}
                      </span>
                    </div>

                    <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                      <span className="text-xs font-medium text-gray-500">
                        Expected Resolution
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {trackingResult.expectedResolution}
                      </span>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Remarks
                      </p>
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {trackingResult.remarks}
                        </p>
                      </div>
                    </div>

                    {trackingResult.resolution && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Resolution
                        </p>
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <p className="text-sm text-green-800 leading-relaxed">
                            {trackingResult.resolution}
                          </p>
                        </div>
                      </div>
                    )}

                    {trackingResult.method && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4">
                        <p className="text-xs font-medium text-blue-900 mb-2">
                          Complaint Details
                        </p>
                        <div className="space-y-1 text-xs text-blue-800">
                          {trackingResult.transactionId && (
                            <p>
                              Transaction ID:{" "}
                              <span className="font-mono">
                                {trackingResult.transactionId}
                              </span>
                            </p>
                          )}
                          {trackingResult.mobileNumber && (
                            <p>Mobile: {trackingResult.mobileNumber}</p>
                          )}
                          {trackingResult.transactionDate && (
                            <p>
                              Transaction Date: {trackingResult.transactionDate}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">
                      Need Help?
                    </p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      If you don't have your Complaint ID, you can register a
                      new complaint from the "Complaint Register" tab. Make sure
                      to save the Complaint ID for future reference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      {loading && <Loader />}
    </div>
  );
};

export default BBPSComplain;

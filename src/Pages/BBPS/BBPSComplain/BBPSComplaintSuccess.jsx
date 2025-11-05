import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ToastComp from "../../../Components/ToastComp";
import CommonHeader from "../../../Components/CommonHeader";

const BBPSComplaintSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [complaintData, setComplaintData] = useState(null);

  useEffect(() => {
  

    // Get complaint data from navigation state
    if (location.state?.complaintData) {
      setComplaintData(location.state.complaintData);
    } 
    
    // else {
    //   console.log("No complaint data, redirecting...");
    //   // If no data, redirect back
    //   navigate("/bbps-complaint", { replace: true });
    // }
  }, [location, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopyComplaintId = () => {
    if (complaintData?.complaintId) {
      navigator.clipboard.writeText(complaintData.complaintId);
      ToastComp({
        message: "Complaint ID copied to clipboard!",
        type: "success",
      });
    }
  };

  const handleTrackComplaint = () => {
    navigate("/bbps-complaint-registration", {
      state: {
        activeTab: 2,
        complaintId: complaintData?.complaintId,
      },
    });
  };

  // const handleDone = () => {
  //   navigate("/", { replace: true }); // Navigate to home or wherever you want
  // };

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

  if (!complaintData) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-0 w-full z-10 bg-white shadow-sm">
          <CommonHeader
            title="Complaint Registered"
            handleclick={() => {
              navigate("/", { replace: true });
            }}
            rightDesign={rightDesign}
          />
        </div>

        <div className="pt-16 pb-6 px-4">
          {/* Success Animation */}
          <div className="flex justify-center items-center py-8">
            <div className="relative">
              {/* Animated checkmark circle */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scaleIn shadow-lg">
                <svg
                  className="w-14 h-14 text-white animate-checkmark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Complaint Registered Successfully!
            </h2>
            <p className="text-sm text-gray-600">
              Your complaint has been submitted and forwarded to BBPS support
              team
            </p>
          </div>

          {/* Complaint ID Card - Highlighted */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-4 shadow-lg">
            <div className="text-center">
              <p className="text-white text-xs font-medium mb-2 opacity-90">
                Your Complaint ID
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-white text-2xl font-bold font-mono tracking-wider break-all">
                  {complaintData.complaintId}
                </p>
              </div>
              <button
                onClick={handleCopyComplaintId}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center mx-auto space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Copy Complaint ID</span>
              </button>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Important - Save This ID!
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Please save or screenshot this Complaint ID. You will need it
                  to track your complaint status.
                </p>
              </div>
            </div>
          </div>

          {/* Complaint Details Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">
                Complaint Details
              </h3>
            </div>

            <div className="p-4 space-y-3">
              {/* Status */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Status
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {complaintData.status || "Registered"}
                </span>
              </div>

              {/* Registered Date */}
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Registered On
                </span>
                <span className="text-sm text-gray-700 text-right">
                  {formatDateTime(complaintData.registeredDate)}
                </span>
              </div>

              {/* Expected Resolution */}
              <div className="flex justify-between items-start pb-3 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-500">
                  Expected Resolution
                </span>
                <span className="text-sm font-medium text-blue-600 text-right">
                  {formatDate(complaintData.expectedResolution)}
                </span>
              </div>

              {/* Registration Method */}
              {complaintData.registrationMethod && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Registration Method
                  </p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm text-blue-900 font-medium mb-1 capitalize">
                      {complaintData.registrationMethod === "transaction"
                        ? "Transaction Reference ID"
                        : "Mobile Number + Date"}
                    </p>
                    {complaintData.transactionId && (
                      <p className="text-xs text-blue-700">
                        Transaction ID:{" "}
                        <span className="font-mono">
                          {complaintData.transactionId}
                        </span>
                      </p>
                    )}
                    {complaintData.mobileNumber && (
                      <div className="text-xs text-blue-700 space-y-0.5">
                        <p>Mobile: {complaintData.mobileNumber}</p>
                        {complaintData.transactionDate && (
                          <p>
                            Date: {formatDate(complaintData.transactionDate)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Complaint Details */}
              {complaintData.complaintDetails && (
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Your Complaint
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {complaintData.complaintDetails}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              What Happens Next?
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p className="flex-1 pt-0.5">
                  Your complaint has been registered with BBPS support team
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p className="flex-1 pt-0.5">
                  You will receive updates on your registered mobile number
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p className="flex-1 pt-0.5">
                  Track your complaint anytime using the Complaint ID
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p className="flex-1 pt-0.5">
                  Expected resolution within 5 working days
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTrackComplaint}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span>Track This Complaint</span>
            </button>

            <button
              // onClick={handleDone}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes checkmark {
            0% {
              stroke-dashoffset: 50;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .animate-checkmark {
            stroke-dasharray: 50;
            animation: checkmark 0.5s ease-in-out 0.3s forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default BBPSComplaintSuccess;

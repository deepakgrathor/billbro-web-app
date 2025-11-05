import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../Redux/API";
import ToastComp from "../../Components/ToastComp";

const RaiseComplaintPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state?.transaction;

  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Recharge was not successful",
    "Operator was not correct",
    "Recharged with a wrong number",
    "Others",
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      ToastComp({ message: "Please select a reason", type: "error" });
      return;
    }

    setLoading(true);

    try {
      // Prepare message
      const message =
        selectedReason === "Others" ? description : selectedReason;

      // API call
      const response = await API.get(
        `/cyrus/recharge-complain-billhub?order_id=${
          transaction.id
        }&message=${encodeURIComponent(message)}`
      );

      setLoading(false);

      if (response.data?.Data?.message) {
        ToastComp({ message: response.data.Data.message, type: "success" });
      } else {
        ToastComp({
          message: "Complaint submitted successfully!",
          type: "success",
        });
      }

      navigate("/");
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.Remarks || "Failed to submit complaint");
    }
  };
  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No transaction data found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Raise a complaint</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4">
        {/* Transaction Info */}
        <div className="bg-white rounded-2xl p-4 mb-4 space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="text-base font-semibold text-gray-900">
              {transaction.id}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Date & Time</p>
            <p className="text-base font-semibold text-gray-900">
              {transaction.date}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Transaction Amount</p>
            <p className="text-base font-semibold text-gray-900">
              {transaction.amount}
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div className="bg-white rounded-2xl p-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select a reason
          </h3>

          <div className="space-y-3">
            {reasons.map((reason, index) => (
              <label
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                  selectedReason === reason
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-base text-gray-900">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description (Optional) */}
        {selectedReason === "Others" && (
          <div className="bg-white rounded-2xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Describe your issue
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details..."
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              selectedReason && !loading
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaintPage;

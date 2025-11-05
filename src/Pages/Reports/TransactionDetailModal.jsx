import React from "react";
import { useNavigate } from "react-router-dom";
import { handleCopy } from "../../Utils/CommonFunc";

const TransactionDetailModal = ({ isOpen, onClose, transaction, type }) => {
  const navigate = useNavigate();

  if (!isOpen || !transaction) return null;

  const getStatusBadge = () => {
    const status = transaction.status?.toLowerCase();

    if (
      status === "success" ||
      status === "txn_success" ||
      status === "credited"
    ) {
      return (
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-green-700 text-sm capitalize font-medium">
            {type === "ledgerBook"
              ? "The amount was credited"
              : "This transaction was successful"}
          </p>
        </div>
      );
    } else if (
      status === "failed" ||
      status === "txn_failure" ||
      status === "rejected"
    ) {
      return (
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-red-700 capitalize font-medium">
            This transaction failed
          </p>
        </div>
      );
    } else {
      return (
        <div
          className={`flex items-center gap-2 ${
            type === "ledgerBook" ? "bg-green-50" : "bg-yellow-50"
          }  px-4 py-2 rounded-xl`}
        >
          <div className="w-10 h-10 rounded-full  flex items-center justify-center">
            {type !== "ledgerBook" && (
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <p className="text-yellow-700 capitalize font-medium">
            {type === "ledgerBook"
              ? "The amount was debited"
              : "Transaction is pending"}
          </p>
        </div>
      );
    }
  };

  const handleRaiseComplaint = () => {
    onClose();
    if (type === "billPayments") {
      navigate("/bbps-complaint-registration", {
        state: {
          activeTab: 1,
          transactionId: transaction?.transactionId || transaction.id,
        },
      });
    } else {
      navigate("/recharge-complain", { state: { transaction } });
      a;
    }
  };

  const handleNeedSupport = () => {
    onClose();
    navigate("/contact");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  backdrop-brightness-50 bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 animate-slide-up max-h-[80vh] overflow-y-auto">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 pb-6 pt-2">
          {/* Header */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">More Details</h2>

          {/* Amount Section */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-gray-900">
                {transaction.amount}
              </p>
              {/* {transaction.commission && transaction.commission !== "₹0" && (
                <span className="text-lg font-semibold text-green-600">
                  {transaction.commission}
                </span>
              )} */}
            </div>
          </div>

          {/* Status Badge */}
          {getStatusBadge()}

          {/* Transaction Details */}
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Transaction Details</p>
              <div className="flex border-b pb-3 border-gray-100 items-center space-x-1">
                <p
                  className={`${
                    type === "ledger" ? "text-xs" : "text-sm"
                  } font-semibold capitalize text-gray-600`}
                >
                  {type === "deposits"
                    ? "Wallet Deposits"
                    : type === "ledger"
                    ? transaction.type
                    : transaction.type}
                </p>
                <div className="flex items-center space-x-2">
                  {type !== "deposits" && type !== "ledgerBook" && (
                    <p className="font-semibold text-sm text-gray-600">
                      | {transaction.number}{" "}
                    </p>
                  )}
                  {type === "billPayments" &&
                    transaction.status === "success" && (
                      <span
                        onClick={() => handleCopy(transaction.number)}
                        className="text-[8px] border border-gray-200 text-gray-500 p-1 px-2 bg-gray-100 rounded-full"
                      >
                        Tap to Copy
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="border-b pb-3 border-gray-100 ">
              <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.transactionId || transaction.id}
                </p>
                {transaction.status === "success" && (
                  <span
                    onClick={() =>
                      handleCopy(transaction.transactionId || transaction.id)
                    }
                    className="text-[8px] border border-gray-200 text-gray-500 p-1 px-2 bg-gray-100 rounded-full"
                  >
                    Tap to Copy
                  </span>
                )}
              </div>
            </div>

            <div className="border-b pb-3 border-gray-100 ">
              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {transaction.date}
              </p>
            </div>

            {(type === "deposits" || type === "ledger") && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="text-base font-semibold text-gray-900">
                  {transaction.paymentMethod || "Wallet"}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {(type === "recharges" || type === "billPayments") && (
              <button
                onClick={handleRaiseComplaint}
                className="w-full py-2 border-2 border-red-300 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors"
              >
                Raise a complaint
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleNeedSupport}
                className="flex-1 py-2 bg-yellow-100 text-yellow-700 text-sm rounded-xl hover:bg-yellow-200 transition-colors"
              >
                Need Support?
              </button>
              <button
                onClick={onClose}
                className="flex-1 text-sm py-2 bg-pink-100 text-pink-600  rounded-xl hover:bg-pink-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionDetailModal;

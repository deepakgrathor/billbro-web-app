import React from "react";

const LedgerCard = ({ transaction, onClick }) => {
  return (
    <div
      onClick={() => onClick(transaction)}
      className="bg-white rounded-2xl border border-gray-200 p-4  cursor-pointer transition-shadow"
    >
      <div className="">
        <div className="">
          <div className="flex items-center border-b pb-3 border-gray-100 justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                  transaction.status === "Credited"
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                {transaction.logo}
              </div>
              <div className="">
                <p
                  className={`font-bold text-lg ${
                    transaction.amount.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.amount}
                </p>
                <p className="text-xs text-gray-400">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-semibold${
                  transaction.status === "Credited"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.status}
              </p>
            </div>
          </div>
          <p className=" text-gray-900 mt-3 capitalize text-[12px]">
            {transaction.type}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <p className="text-xs text-gray-500">Opening Balance :</p>
            <p className="text-xs text-gray-900">
              ₹{transaction.openingBalance}
            </p>
          </div>
          <div className="text-right flex items-center">
            <p className="text-xs text-gray-500">Closing Balance :</p>
            <p className="text-xs text-gray-900">
              ₹{transaction.closingBalance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionCard = ({ transaction, onClick }) => {
  const getStatusColor = (status) => {
    if (
      status === "Success" ||
      status === "Credit" ||
      status === "TXN_SUCCESS"
    ) {
      return "text-green-500";
    } else if (
      status === "Failed" ||
      status === "Debit" ||
      status === "TXN_FAILURE"
    ) {
      return "text-red-500";
    }
    return "text-yellow-500";
  };

  const getStatusText = (status) => {
    if (status === "TXN_SUCCESS") return "Success";
    if (status === "TXN_FAILURE") return "Failed";
    return status;
  };

  const getAmountColor = (amount) => {
    if (amount.startsWith("+")) return "text-green-600";
    if (amount.startsWith("-")) return "text-red-600";
    return "text-gray-900";
  };
  return (
    <div
      onClick={() => onClick(transaction)}
      className="bg-white rounded-2xl border border-gray-200 p-4 transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          <img width={35} src={transaction.logo} alt="" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base">
            {transaction.type}
          </h3>
          <p className="text-gray-600 uppercase text-sm truncate">
            {transaction.number}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{transaction.date}</p>
        </div>

        {/* Amount & Status */}
        <div className="text-right flex-shrink-0">
          <p
            className={`font-bold text-lg ${getAmountColor(
              transaction.amount
            )}`}
          >
            {transaction.amount}
          </p>
          {/* {transaction.commission && (
            <p className="font-semibold text-sm text-green-500">
              {transaction.commission}
            </p>
          )} */}
          <p
            className={`text-sm capitalize font-semibold mt-1 ${getStatusColor(
              transaction.status
            )}`}
          >
            {getStatusText(transaction.status)}
          </p>
        </div>
      </div>
    </div>
  );
};

export { LedgerCard };
export default TransactionCard;

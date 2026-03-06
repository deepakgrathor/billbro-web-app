import React, { useMemo, memo, useCallback } from "react";
import { MdCheckCircle, MdCancel, MdPending } from "react-icons/md";

// const LedgerCard = ({ transaction, onClick }) => {
//   return (
//     <div
//       onClick={() => onClick(transaction)}
//       className="bg-white rounded-2xl border border-gray-200 p-4  cursor-pointer transition-shadow"
//     >
//       <div className="">
//         <div className="">
//           <div className="flex items-center border-b pb-3 border-gray-100 justify-between">
//             <div className="flex items-center space-x-3">
//               <div
//                 className={`w-6 h-6 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
//                   transaction.status === "Credited"
//                     ? "bg-green-50"
//                     : "bg-red-50"
//                 }`}
//               >
//                 {transaction.logo}
//               </div>
//               <div className="">
//                 <p
//                   className={`font-bold text-lg ${
//                     transaction.amount.startsWith("+")
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {transaction.amount}
//                 </p>
//                 <p className="text-xs text-gray-400">{transaction.date}</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p
//                 className={`text-xs font-semibold${
//                   transaction.status === "Credited"
//                     ? "text-green-500"
//                     : "text-red-500"
//                 }`}
//               >
//                 {transaction.status}
//               </p>
//             </div>
//           </div>
//           <p className=" text-gray-900 mt-3 capitalize text-[12px]">
//             {transaction.type}
//           </p>
//         </div>
//         <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
//           <div className="flex items-center">
//             <p className="text-xs text-gray-500">Opening Balance :</p>
//             <p className="text-xs text-gray-900">
//               ₹{transaction.openingBalance}
//             </p>
//           </div>
//           <div className="text-right flex items-center">
//             <p className="text-xs text-gray-500">Closing Balance :</p>
//             <p className="text-xs text-gray-900">
//               ₹{transaction.closingBalance}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TransactionCard = ({ transaction, onClick }) => {
//   const getStatusColor = (status) => {
//     if (
//       status === "Success" ||
//       status === "Credit" ||
//       status === "TXN_SUCCESS"
//     ) {
//       return "text-green-500";
//     } else if (
//       status === "Failed" ||
//       status === "Debit" ||
//       status === "TXN_FAILURE"
//     ) {
//       return "text-red-500";
//     }
//     return "text-yellow-500";
//   };

//   const getStatusText = (status) => {
//     if (status === "TXN_SUCCESS") return "Success";
//     if (status === "TXN_FAILURE") return "Failed";
//     return status;
//   };

//   const getAmountColor = (amount) => {
//     if (amount.startsWith("+")) return "text-green-600";
//     if (amount.startsWith("-")) return "text-red-600";
//     return "text-gray-900";
//   };
//   return (
//     <div
//       onClick={() => onClick(transaction)}
//       className="bg-white rounded-2xl border border-gray-200 p-4 transition-shadow cursor-pointer"
//     >
//       <div className="flex items-center gap-4">
//         {/* Logo */}
//         <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
//           <img width={35} src={transaction.logo} alt="" />
//         </div>

//         {/* Details */}
//         <div className="flex-1 min-w-0">
//           <h3 className="font-semibold text-gray-900 text-base">
//             {transaction.type}
//           </h3>
//           <p className="text-gray-600 uppercase text-sm truncate">
//             {transaction.number}
//           </p>
//           <p className="text-xs text-gray-400 mt-0.5">{transaction.date}</p>
//         </div>

//         {/* Amount & Status */}
//         <div className="text-right flex-shrink-0">
//           <p
//             className={`font-bold text-lg ${getAmountColor(
//               transaction.amount
//             )}`}
//           >
//             {transaction.amount}
//           </p>
//           {/* {transaction.commission && (
//             <p className="font-semibold text-sm text-green-500">
//               {transaction.commission}
//             </p>
//           )} */}
//           <p
//             className={`text-sm capitalize font-semibold mt-1 ${getStatusColor(
//               transaction.status
//             )}`}
//           >
//             {getStatusText(transaction.status)}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

const TransactionCard = ({ transaction, onClick }) => {
  // ✅ OPTIMIZATION: Memoized status calculations
  const statusConfig = useMemo(() => {
    const status = transaction.status;
    if (
      status === "Success" ||
      status === "Credit" ||
      status === "TXN_SUCCESS" ||
      status === "success"
    ) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <MdCheckCircle className="text-green-600" size={20} />,
        text: "Success",
      };
    } else if (
      status === "Failed" ||
      status === "Debit" ||
      status === "TXN_FAILURE" ||
      status === "failed"
    ) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <MdCancel className="text-red-600" size={20} />,
        text: "Failed",
      };
    }

    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: <MdPending className="text-yellow-600" size={20} />,
      text: status || "Pending",
    };
  }, [transaction.status]);

  // ✅ OPTIMIZATION: Memoized amount styling
  const amountConfig = useMemo(() => {
    const amount = transaction.amount || "";

    if (amount.startsWith("+")) {
      return {
        color: "text-green-600",
        symbol: "+",
        value: amount.slice(1),
      };
    } else if (amount.startsWith("-")) {
      return {
        color: "text-red-600",
        symbol: "-",
        value: amount.slice(1),
      };
    }

    return {
      color: "text-theme-primary",
      symbol: "",
      value: amount,
    };
  }, [transaction.amount]);

  return (
    <div
      onClick={() => onClick(transaction)}
      className="backdrop-blur-sm rounded-2xl border-gray-200 hover:border-purple-300 p-4 transition-all duration-300 cursor-pointer hover:shadow-xl active:scale-[0.99] group border border-theme bg-theme-card shadow-theme-card"
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center flex-shrink-0 border border-purple-100 group-hover:scale-110 transition-transform duration-300">
          {transaction.logo ? (
            <img
              width={36}
              height={36}
              src={transaction.logo}
              alt={transaction.type}
              className="object-contain"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {transaction.type?.charAt(0) || "T"}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-theme-primary text-base mb-1 truncate">
            {transaction.type}
          </h3>
          <p className="text-theme-secondary text-sm truncate mb-1 font-medium">
            {transaction.number}
          </p>
          <p className="text-xs text-gray-400 font-semibold">
            {transaction.date}
          </p>
        </div>

        {/* Amount & Status */}
        <div className="text-right flex-shrink-0 space-y-2">
          {/* Amount */}
          <div className="flex items-center justify-end gap-1">
            {amountConfig.symbol && (
              <span className={`text-sm font-bold ${amountConfig.color}`}>
                {amountConfig.symbol}
              </span>
            )}
            <p className={`font-black text-lg ${amountConfig.color}`}>
              {amountConfig.value}
            </p>
          </div>

          {/* Commission (if exists) */}
          {/* {transaction.commission && (
            <div className="flex items-center justify-end gap-1 bg-green-50 px-2 py-0.5 rounded-full">
              <span className="text-[10px] text-green-600 font-bold">
                Commission:
              </span>
              <span className="text-xs font-black text-green-600">
                {transaction.commission}
              </span>
            </div>
          )} */}

          {/* Status Badge */}
          <div
            className={`
            flex items-center justify-end gap-1.5 px-3 py-1.5 rounded-xl 
            ${statusConfig.bgColor} ${statusConfig.borderColor} border
          `}
          >
            {statusConfig.icon}
            <span
              className={`text-xs font-bold ${statusConfig.color} capitalize`}
            >
              {statusConfig.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LedgerCard = ({ transaction, onClick }) => {
  const isCredit = transaction.status === "Credited";

  const handleClick = useCallback(() => {
    onClick?.(transaction);
  }, [onClick, transaction]);

  const amountColor = useMemo(
    () => (isCredit ? "text-green-600" : "text-red-600"),
    [isCredit],
  );

  return (
    <div
      onClick={handleClick}
      className="
        group relative rounded-2xl border-gray-200
        p-4 cursor-pointer
        transition-all duration-200
        hover:shadow-md active:scale-[0.99] border border-theme bg-theme-card shadow-theme-card
      "
    >
      {/* Left Accent Bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${
          isCredit ? "bg-green-500" : "bg-red-500"
        }`}
      />

      {/* Top Section */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 pl-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-base flex-shrink-0
              ${
                isCredit
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }
            `}
          >
            {transaction.logo}
          </div>

          {/* Amount & Date */}
          <div className="min-w-0">
            <p className={`text-lg font-extrabold ${amountColor}`}>
              {transaction.amount}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {transaction.date}
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full
            ${
              isCredit ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
            }
          `}
        >
          {transaction.status}
        </span>
      </div>

      {/* Type */}
      <p className="mt-3 pl-3 text-[12px] font-medium text-theme-primary capitalize truncate">
        {transaction.type}
      </p>

      {/* Balance Section */}
      <div className="mt-3 pt-3 pl-3 border-t border-gray-100 flex justify-between text-xs">
        <div className="flex gap-1">
          <span className="text-gray-500">Opening:</span>
          <span className="font-semibold text-theme-secondary">
            ₹{transaction.openingBalance}
          </span>
        </div>
        <div className="flex gap-1">
          <span className="text-gray-500">Closing:</span>
          <span className="font-semibold text-theme-secondary">
            ₹{transaction.closingBalance}
          </span>
        </div>
      </div>
    </div>
  );
};

export { LedgerCard };
export default TransactionCard;

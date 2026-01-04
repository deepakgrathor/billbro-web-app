// Components/PaymentMethodSelector.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setWalletSelect } from "../Redux/Slices/PaymentSlice";
import {
  MdOutlineAddCircleOutline,
  MdCheckCircle,
  MdAccountBalanceWallet,
  MdCreditCard,
} from "react-icons/md";
import { usePaymentService } from "../hooks/usePaymentService";

const PaymentMethodSelector = ({
  walletBalance,
  payableAmount,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const PaymentService = usePaymentService();
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { serviceList } = useSelector((state) => state.ServiceSlice.service);

  const isWalletSufficient = walletBalance >= payableAmount;
  const isUPIEnabled = PaymentService.isUPIEnabled;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">
        Select Payment Method
      </h3>

      {/* Wallet Option */}
      <div
        onClick={() => !isLoading && dispatch(setWalletSelect(true))}
        className={`
          bg-white rounded-2xl shadow-md mb-3 overflow-hidden cursor-pointer
          transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
          ${
            walletSelect
              ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200"
              : "border border-gray-200"
          }
          ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${
                  walletSelect
                    ? "bg-gradient-to-br from-purple-500 to-blue-600"
                    : "bg-gray-100"
                }
              `}
            >
              <MdAccountBalanceWallet
                size={24}
                className={walletSelect ? "text-white" : "text-gray-600"}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                Wallet Balance
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-gray-800">
                  ₹{PaymentService.formatAmount(walletBalance)}
                </p>
                {!isWalletSufficient && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    Low Balance
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) navigate("/wallet");
            }}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineAddCircleOutline size={18} />
            <span className="text-xs font-bold">Add Money</span>
          </button>
        </div>

        {walletSelect && (
          <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="text-purple-600" size={16} />
              <p className="text-xs text-purple-700 font-medium">
                Selected Payment Method
              </p>
            </div>
          </div>
        )}
      </div>

      {/* UPI Option */}
      {isUPIEnabled && (
        <div
          onClick={() => !isLoading && dispatch(setWalletSelect(false))}
          className={`
            bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer
            transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
            ${
              !walletSelect
                ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200"
                : "border border-gray-200"
            }
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${
                    !walletSelect
                      ? "bg-gradient-to-br from-purple-500 to-blue-600"
                      : "bg-gray-100"
                  }
                `}
              >
                <MdCreditCard
                  size={24}
                  className={!walletSelect ? "text-white" : "text-gray-600"}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Pay with UPI
                </p>
                <p className="text-lg font-black text-gray-800">UPI Payment</p>
              </div>
            </div>
          </div>

          {!walletSelect && (
            <div className="bg-purple-50 px-4 py-2 border-t border-purple-100">
              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-purple-600" size={16} />
                <p className="text-xs text-purple-700 font-medium">
                  Selected Payment Method
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;

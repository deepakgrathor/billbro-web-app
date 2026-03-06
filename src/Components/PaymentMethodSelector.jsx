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
    <div className="mb-4">
      <h3 className="text-sm font-bold text-theme-primary mb-3 px-1">
        Select Payment Method
      </h3>

      {/* Wallet Option */}
      <div
        onClick={() => !isLoading && dispatch(setWalletSelect(true))}
        className={`
          bg-theme-card rounded-2xl mb-3 overflow-hidden cursor-pointer
          transition-all duration-300 active:scale-[0.99]
          ${
            walletSelect
              ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200/30 border border-transparent"
              : "border border-theme"
          }
          ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                ${
                  walletSelect
                    ? "bg-gradient-to-br from-purple-500 to-blue-600"
                    : "bg-theme-card-2"
                }
              `}
            >
              <MdAccountBalanceWallet
                size={20}
                className={walletSelect ? "text-white" : "text-theme-secondary"}
              />
            </div>
            <div>
              <p className="text-xs text-theme-muted font-medium mb-0.5">
                Wallet Balance
              </p>
              <div className="flex items-center gap-2">
                <p className="text-base font-black text-theme-primary">
                  ₹{PaymentService.formatAmount(walletBalance)}
                </p>
                {!isWalletSufficient && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    Low
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
            className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdOutlineAddCircleOutline size={16} />
            <span className="text-xs font-bold">Add</span>
          </button>
        </div>

        {walletSelect && (
          <div className="bg-purple-50 px-4 py-1.5 border-t border-purple-100">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="text-purple-600" size={14} />
              <p className="text-xs text-purple-700 font-medium">
                Selected
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
            bg-theme-card rounded-2xl overflow-hidden cursor-pointer
            transition-all duration-300 active:scale-[0.99]
            ${
              !walletSelect
                ? "ring-2 ring-purple-500 shadow-lg shadow-purple-200/30 border border-transparent"
                : "border border-theme"
            }
            ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          <div className="p-3.5 flex items-center gap-3">
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                ${
                  !walletSelect
                    ? "bg-gradient-to-br from-purple-500 to-blue-600"
                    : "bg-theme-card-2"
                }
              `}
            >
              <MdCreditCard
                size={20}
                className={!walletSelect ? "text-white" : "text-theme-secondary"}
              />
            </div>
            <div>
              <p className="text-xs text-theme-muted font-medium mb-0.5">
                Pay with UPI
              </p>
              <p className="text-base font-black text-theme-primary">UPI Payment</p>
            </div>
          </div>

          {!walletSelect && (
            <div className="bg-purple-50 px-4 py-1.5 border-t border-purple-100">
              <div className="flex items-center gap-2">
                <MdCheckCircle className="text-purple-600" size={14} />
                <p className="text-xs text-purple-700 font-medium">
                  Selected
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

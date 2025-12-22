import React, { useEffect, useRef, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ButtonComp from "../../Components/ButtonComp";
import ToastComp from "../../Components/ToastComp";
import {
  MdAccountBalanceWallet,
  MdAdd,
  MdSecurity,
  MdSpeed,
  MdVerifiedUser,
} from "react-icons/md";

const Wallet = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const walletBalance = ProfileData?.Data?.wallet?.balance || 0;

  const handleChange = (e) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Clear selected amount when typing
    setSelectedAmount(null);

    // Set value
    setAmount(value);

    // Validation check
    if (Number(value) > 50000) {
      ToastComp({
        message: "Amount cannot be more than ₹50,000",
        type: "error",
      });
    }
  };

  const handleQuickAmount = (value) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const mountRef = useRef(null);
  const upiAppRef = useRef(null);

  const handlePayment = () => {
    if (!amount || Number(amount) <= 0) {
      ToastComp({
        message: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (Number(amount) > 50000) {
      ToastComp({
        message: "Amount cannot exceed ₹50,000",
        type: "error",
      });
      return;
    }

    // Add your payment logic here
    const cashfree = window.Cashfree({ mode: "sandbox" });

    upiAppRef.current = cashfree.create("upiApp", {
      values: { upiApp: "gpay", buttonText: "GPAY", buttonIcon: true },
    });

    upiAppRef.current.on("loaderror", (data) => console.log(data.error));
    upiAppRef.current.on("ready", (d) => console.log(d.value));

    upiAppRef.current.mount(mountRef.current);
  };

  return (
    <div
      ref={mountRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col"
    >
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <CommonHeader title={"Add Money"} handleclick={() => navigate(-1)} />
      </div>

      {/* Content */}
      <div className="flex-1 pt-20 pb-32 overflow-y-auto">
        {/* Balance Card */}
        <div className="px-4 pt-4">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-xs font-medium mb-1">
                    Current Balance
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-black text-3xl tracking-wide">
                      ₹
                      {walletBalance.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    {walletBalance <= 10 && (
                      <span className="text-[9px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        Low
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MdAccountBalanceWallet size={28} className="text-white" />
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                  <p className="text-white text-xs font-bold">Today</p>
                  <p className="text-white/80 text-[10px] mt-0.5">₹0</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                  <p className="text-white text-xs font-bold">This Month</p>
                  <p className="text-white/80 text-[10px] mt-0.5">₹0</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                  <p className="text-white text-xs font-bold">Total</p>
                  <p className="text-white/80 text-[10px] mt-0.5">
                    ₹{walletBalance.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input Section */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
              <span>Enter Amount</span>
            </h3>

            {/* Amount Input */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative flex items-center bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 group-hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-6 transition-all duration-300">
                <span className="text-4xl font-black text-gray-900 mr-3">
                  ₹
                </span>
                <input
                  value={amount}
                  onChange={handleChange}
                  className="text-4xl font-black outline-none w-full bg-transparent text-gray-900 placeholder-gray-400"
                  maxLength={5}
                  placeholder="0"
                  type="text"
                />
                {amount && Number(amount) > 0 && (
                  <svg
                    className="w-6 h-6 text-green-500 animate-scaleIn"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Limit Info */}
            <div className="mt-3 flex items-center justify-between px-2">
              <p className="text-xs text-gray-500">Minimum: ₹10</p>
              <p className="text-xs text-gray-500">Maximum: ₹50,000</p>
            </div>
          </div>
        </div>

        {/* Quick Amount Selection */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center space-x-2">
            <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
            <span>Quick Select</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {PriceArr.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAmount(item)}
                className={`py-4 rounded-2xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-xl active:scale-95 ${
                  selectedAmount === item
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105"
                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-400"
                }`}
              >
                <p className="text-xs font-medium opacity-80 mb-1">Add</p>
                <p className="text-lg font-black">₹{item.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Why Add Money?
            </h3>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MdSpeed size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Instant Transactions
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Pay bills & recharge instantly from wallet
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <MdSecurity size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  100% Secure
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Bank-grade encryption for all transactions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MdVerifiedUser size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Verified Payment
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  All payments are verified & authenticated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-900 mb-1">
                  💳 Payment Methods
                </p>
                <p className="text-xs text-blue-800 leading-relaxed">
                  We accept Only UPI for secure payments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-gray-700">Secure</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-gray-700">Instant</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-medium text-gray-700">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-2xl z-40">
        <button
          onClick={handlePayment}
          disabled={
            !amount || Number(amount) <= 0 || Number(amount) > 50000 || loading
          }
          className={`w-full font-bold py-4 px-6 rounded-2xl shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 group ${
            amount && Number(amount) > 0 && Number(amount) <= 50000 && !loading
              ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white hover:scale-105 active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <MdAdd size={24} />
          <span className="text-base">
            {loading ? "Processing..." : `Add ₹${amount || "0"} to Wallet`}
          </span>
          {amount &&
            Number(amount) > 0 &&
            Number(amount) <= 50000 &&
            !loading && (
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            )}
        </button>

        {/* Amount Summary */}
        {amount && Number(amount) > 0 && (
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-600 animate-fadeIn">
            <div className="flex items-center space-x-1">
              <span>Current:</span>
              <span className="font-bold">₹{walletBalance.toFixed(2)}</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center space-x-1">
              <span>New Balance:</span>
              <span className="font-bold text-green-600">
                ₹{(walletBalance + Number(amount)).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const PriceArr = [500, 1000, 2000];

export default Wallet;

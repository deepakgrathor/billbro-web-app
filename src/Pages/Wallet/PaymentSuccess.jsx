import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdCheckCircle, MdContentCopy, MdHome } from "react-icons/md";
import ToastComp from "../../Components/ToastComp";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Get payment details from navigation state
  const {
    amount = "0",
    orderId = "N/A",
    transactionId = "N/A",
    date = new Date().toISOString(),
  } = location.state || {};

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    ToastComp({
      message: "Order ID copied!",
      type: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Confetti Effect */}
        {showConfetti && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      "#10b981",
                      "#14b8a6",
                      "#06b6d4",
                      "#f59e0b",
                      "#f97316",
                    ][Math.floor(Math.random() * 5)],
                  }}
                ></div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-center">
              {/* Animated Checkmark */}
              <div className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>

                  {/* Main Icon */}
                  <div className="relative bg-white rounded-full p-4 shadow-xl animate-bounce-in">
                    <MdCheckCircle className="w-16 h-16 text-emerald-500" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-black text-white mb-2 animate-slide-up">
                Payment Successful!
              </h1>
              <p className="text-white/90 text-sm font-medium animate-slide-up-delayed">
                Your wallet has been credited
              </p>
            </div>

            {/* Amount Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center border-b border-emerald-100">
              <p className="text-sm font-semibold text-emerald-700 mb-2 tracking-wide uppercase">
                Amount Added
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-5xl font-black text-emerald-600 animate-number-pop">
                  ₹{parseFloat(amount).toLocaleString("en-IN")}
                </span>
                <div className="flex flex-col items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mt-1"></div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-4">
              {/* Order ID */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </p>
                  <button
                    onClick={handleCopyOrderId}
                    className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <MdContentCopy className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-sm font-mono font-bold text-gray-900 break-all">
                  {orderId}
                </p>
              </div>

              {/* Transaction ID */}
              {transactionId !== "N/A" && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Transaction ID
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-900 break-all">
                    {transactionId}
                  </p>
                </div>
              )}

              {/* Date & Time */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Date & Time
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {formatDate(date)}
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  Payment Method
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-lg">💳</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-900">
                    UPI Payment
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <p className="text-sm font-black text-white uppercase tracking-wider">
                    ✓ Verified & Credited
                  </p>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={() => navigate("/wallet")}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>View Wallet</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MdHome className="w-5 h-5" />
                <span>Go to Home</span>
              </button>
            </div>

            {/* Footer Note */}
            <div className="bg-emerald-50 p-4 text-center border-t border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium">
                🔒 Your payment is secure and encrypted
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a
                href="/support"
                className="text-emerald-600 font-semibold hover:text-emerald-700 underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-40px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-up-delayed {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes number-pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-slide-up-delayed {
          animation: slide-up-delayed 0.6s ease-out 0.4s both;
        }

        .animate-number-pop {
          animation: number-pop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s
            both;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdCheckCircle, MdContentCopy, MdHome } from "react-icons/md";
import ToastComp from "../../Components/ToastComp";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // LOGIC SAME (state se values)
  const {
    amount = "0",
    orderId = "N/A",
    transactionId = "N/A",
    date = new Date().toISOString(),
  } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const confettiParticles = useMemo(() => {
    return [...Array(22)].map((_, i) => {
      const colors = ["#10b981", "#14b8a6", "#06b6d4", "#f59e0b", "#a78bfa"];
      return {
        id: i,
        left: Math.random() * 100,
        top: -(Math.random() * 18),
        delay: Math.random() * 0.7,
        duration: 2.6 + Math.random() * 1.6,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotate: Math.random() * 360,
      };
    });
  }, []);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      ToastComp({ message: "Order ID copied!", type: "success" });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      ToastComp({
        message: "Copy failed. Please copy manually.",
        type: "error",
      });
    }
  };

  const amountNumber = Number(amount || 0);
  const formattedAmount = Number.isFinite(amountNumber)
    ? amountNumber.toLocaleString("en-IN")
    : "0";

  const DetailRow = ({ label, value, mono = false, action = null }) => (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
          {label}
        </p>
        <p
          className={[
            "mt-1 text-sm font-semibold text-slate-900 break-all",
            mono ? "font-mono" : "",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
      {action}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/60">
      {/* Soft background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 -left-24 w-[32rem] h-[32rem] rounded-full blur-3xl bg-emerald-200/45" />
        <div className="absolute -bottom-32 -right-24 w-[36rem] h-[36rem] rounded-full blur-3xl bg-cyan-200/40" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#0f172a_1px,transparent_0)] bg-[size:26px_26px]" />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((p) => (
            <span
              key={p.id}
              className="absolute animate-confetti"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                transform: `rotate(${p.rotate}deg)`,
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  background: p.color,
                }}
              />
            </span>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl border border-slate-200/70 shadow-[0_20px_60px_rgba(2,6,23,0.10)] overflow-hidden">
            {/* Top strip */}
            <div className="relative px-6 pt-7 pb-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl blur-xl bg-emerald-500/15" />
                    <div className="relative rounded-2xl p-3 bg-emerald-50 border border-emerald-200">
                      <MdCheckCircle className="w-9 h-9 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-extrabold text-slate-900">
                    Payment Successful
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Wallet credited successfully
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[12px] font-bold text-emerald-700">
                      Verified & Credited
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount block */}
            <div className="px-6 pb-6">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50/60 p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
                      Amount Added
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900">
                        ₹{formattedAmount}
                      </span>
                      <span className="text-sm font-semibold text-emerald-700">
                        INR
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
                      Date & Time
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {formatDate(date)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-px bg-slate-200" />

                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">
                      Payment Method
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      UPI Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details list */}
            <div className="px-6 pb-2">
              <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="px-4">
                  <DetailRow
                    label="Order ID"
                    value={orderId}
                    mono
                    action={
                      <button
                        onClick={handleCopyOrderId}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
                      >
                        <MdContentCopy className="w-4 h-4" />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    }
                  />
                </div>

                <div className="h-px bg-slate-200" />

                {transactionId !== "N/A" ? (
                  <>
                    <div className="px-4">
                      <DetailRow
                        label="Transaction ID"
                        value={transactionId}
                        mono
                      />
                    </div>
                    <div className="h-px bg-slate-200" />
                  </>
                ) : null}

                <div className="px-4">
                  <DetailRow
                    label="Status"
                    value="Completed • Credited to wallet"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="px-6 pb-6 pt-5 space-y-3">
              <button
                onClick={() => navigate("/wallet")}
                className="w-full rounded-2xl bg-slate-900 text-white font-extrabold py-4 shadow-lg hover:bg-slate-800 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                View Wallet
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
                className="w-full rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold py-4 shadow-sm hover:bg-slate-50 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <MdHome className="w-5 h-5" />
                Go to Home
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/60">
              <p className="text-xs text-slate-600 text-center font-medium">
                🔒 Your payment is secure and encrypted •{" "}
                <a
                  href="/contact"
                  className="text-emerald-700 font-bold underline underline-offset-4 hover:text-emerald-800"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti linear forwards; }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;

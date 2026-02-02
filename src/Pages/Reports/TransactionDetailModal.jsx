import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { handleCopy } from "../../Utils/CommonFunc";
import { BsCopy, BsCheck } from "react-icons/bs";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const TransactionDetailModal = ({ isOpen, onClose, transaction, type }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState("");

  if (!isOpen || !transaction) return null;

  // LOGIC SAME
  const handleCopyWithFeedback = (text, field) => {
    handleCopy(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const isBBPSTransaction = type === "billPayments";

  const getStatusConfig = () => {
    const status = transaction.status?.toLowerCase();

    if (
      status === "success" ||
      status === "txn_success" ||
      status === "credited"
    ) {
      return {
        icon: FaCheckCircle,
        pillBg: "bg-emerald-50",
        pillBorder: "border-emerald-200",
        pillText: "text-emerald-700",
        iconWrap: "bg-emerald-600",
        title:
          type === "ledgerBook"
            ? "Amount Credited Successfully"
            : "Transaction Successful",
        subtitle: "Your payment was processed successfully",
        showBAssured: type === "billPayments" || type === "recharges",
      };
    } else if (
      status === "failed" ||
      status === "txn_failure" ||
      status === "rejected"
    ) {
      return {
        icon: FaTimesCircle,
        pillBg: "bg-rose-50",
        pillBorder: "border-rose-200",
        pillText: "text-rose-700",
        iconWrap: "bg-rose-600",
        title: "Transaction Failed",
        subtitle: "The payment could not be completed",
        showBAssured: false,
      };
    } else {
      return {
        icon: FaClock,
        pillBg: type === "ledgerBook" ? "bg-emerald-50" : "bg-amber-50",
        pillBorder:
          type === "ledgerBook" ? "border-emerald-200" : "border-amber-200",
        pillText: type === "ledgerBook" ? "text-emerald-700" : "text-amber-700",
        iconWrap: type === "ledgerBook" ? "bg-emerald-600" : "bg-amber-500",
        title: type === "ledgerBook" ? "Amount Debited" : "Transaction Pending",
        subtitle:
          type === "ledgerBook"
            ? "This entry is recorded in your ledger"
            : "We’re confirming the status",
        showBAssured: false,
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // LOGIC SAME
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
    }
  };

  const handleNeedSupport = () => {
    onClose();
    navigate("/contact");
  };

  const txnTypeLabel =
    type === "deposits"
      ? "Wallet Deposit"
      : type === "ledger"
      ? transaction.type
      : transaction.type || "Bill Payment";

  const txnId = transaction.transactionId || transaction.id;

  const CopyButton = ({ field, onClick, colorClass = "text-slate-700" }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
      aria-label="Copy"
    >
      {copied === field ? (
        <BsCheck className="w-4.5 h-4.5 text-emerald-600" />
      ) : (
        <BsCopy className={`w-4.5 h-4.5 ${colorClass}`} />
      )}
    </motion.button>
  );

  const InfoRow = ({ label, value, mono, right }) => (
    <div className="flex items-start justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[12px] font-bold tracking-wider text-gray-900 uppercase">
          {label}
        </p>
        <p
          className={[
            "mt-1 text-sm font-semibold text-slate-500 break-all",
            mono ? "font-mono" : "",
          ].join(" ")}
        >
          {value}
        </p>
      </div>
      {right}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Center Modal (Modern) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6"
          >
            <div className="w-full max-w-lg">
              <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.18)] overflow-hidden">
                {/* Top gradient hairline */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                {/* Header */}
                <div className="px-5 sm:px-6 pt-5 sm:pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Payment Receipt
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        Review status & references
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.06, rotate: 90 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={onClose}
                      className="h-10 w-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
                      aria-label="Close"
                    >
                      <svg
                        className="w-5 h-5 text-slate-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={[
                      "mt-5 rounded-3xl border p-4 sm:p-5",
                      statusConfig.pillBg,
                      statusConfig.pillBorder,
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon / B Assured */}

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            "text-lg sm:text-lg font-black",
                            statusConfig.pillText,
                          ].join(" ")}
                        >
                          {statusConfig.title}
                        </p>
                        {/* <p className="mt-1 text-sm text-slate-600">
                          {statusConfig.subtitle}
                        </p> */}
                      </div>

                      {statusConfig.showBAssured && isBBPSTransaction ? (
                        <div className="shrink-0">
                          <div className="h-22 w-22 rounded-2xl  flex items-center justify-center overflow-hidden">
                            <img
                              src="https://ik.imagekit.io/43tomntsa/B%20Assured%20Logo_SVG.svg"
                              alt="B Assured"
                              className="h-22 w-22 object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={[
                            "shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm",
                            statusConfig.iconWrap,
                          ].join(" ")}
                        >
                          <StatusIcon className="w-7 h-7 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount Card */}
                  <div className="mt-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative">
                      <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                        Total Amount
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-3 flex-wrap">
                        <p className="text-3xl sm:text-4xl font-black">
                          {transaction.amount}
                        </p>

                        {/* {isBBPSTransaction && (
                          <span className="text-xs font-bold bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
                            + CCF: ₹0
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 sm:px-6 pt-5 pb-5">
                  <div className="rounded-3xl border border-slate-200 bg-white">
                    <div className="px-4">
                      <InfoRow label="Transaction Type" value={txnTypeLabel} />
                    </div>
                    {isBBPSTransaction && transaction.OPR_REF && (
                      <>
                        <div className="h-px bg-slate-200" />
                        <div className="px-4">
                          <InfoRow
                            label="B-Connect Txn ID"
                            value={transaction.OPR_REF}
                            mono
                            right={
                              <CopyButton
                                field="bharatConnect"
                                onClick={() =>
                                  handleCopyWithFeedback(
                                    transaction.OPR_REF,
                                    "bharatConnect"
                                  )
                                }
                                colorClass="text-blue-600"
                              />
                            }
                          />
                        </div>
                      </>
                    )}
                    {isBBPSTransaction && transaction.OPR_REF && (
                      <>
                        <div className="h-px bg-slate-200" />
                        <div className="px-4">
                          <InfoRow
                            label="CCF (Customer Convenience Fee)"
                            value={`₹0`}
                            mono
                          />
                        </div>
                      </>
                    )}
                    <div className="h-px bg-slate-200" />

                    <div className="px-4">
                      <InfoRow
                        label="Transaction ID"
                        value={txnId}
                        mono
                        right={
                          transaction.status === "success" ? (
                            <CopyButton
                              field="txnId"
                              onClick={() =>
                                handleCopyWithFeedback(txnId, "txnId")
                              }
                              colorClass="text-indigo-600"
                            />
                          ) : null
                        }
                      />
                    </div>

                    {type !== "deposits" &&
                      type !== "ledgerBook" &&
                      transaction.number && (
                        <>
                          <div className="h-px bg-slate-200" />
                          <div className="px-4">
                            <InfoRow
                              label="Consumer Number"
                              value={transaction.number}
                              mono
                              right={
                                isBBPSTransaction &&
                                transaction.status === "success" ? (
                                  <CopyButton
                                    field="number"
                                    onClick={() =>
                                      handleCopyWithFeedback(
                                        transaction.number,
                                        "number"
                                      )
                                    }
                                    colorClass="text-purple-600"
                                  />
                                ) : null
                              }
                            />
                          </div>
                        </>
                      )}

                    {transaction.OP_REF && (
                      <>
                        <div className="h-px bg-slate-200" />
                        <div className="px-4">
                          <InfoRow
                            label="Operator Reference"
                            value={transaction.OP_REF}
                            mono
                            right={
                              <CopyButton
                                field="opRef"
                                onClick={() =>
                                  handleCopyWithFeedback(
                                    transaction.OP_REF,
                                    "opRef"
                                  )
                                }
                                colorClass="text-orange-600"
                              />
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="h-px bg-slate-200" />
                    <div className="px-4">
                      <InfoRow label="Date & Time" value={transaction.date} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5">
                    <div className="flex gap-2">
                      {(type === "recharges" || type === "billPayments") && (
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleRaiseComplaint}
                          className="flex-[1.4] min-w-0 text-xs py-4 px-3 rounded-2xl bg-black hover:bg-rose-700 text-white font-black shadow-lg shadow-rose-200/40 transition text-center"
                        >
                          Raise Complaint
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNeedSupport}
                        className="flex-1 min-w-0 py-4 px-3 rounded-2xl text-xs bg-black hover:bg-amber-600 text-white font-black shadow-lg shadow-amber-200/40 transition"
                      >
                        💭 Support
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="flex-1 min-w-0 py-4 px-3 rounded-2xl text-xs bg-black hover:bg-slate-800 text-white font-black shadow-lg transition"
                      >
                        ❌ Close
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Mobile safe spacing */}
                <div className="h-2" />
              </div>

              {/* Hint (optional) */}
              <div className="mt-3 text-center text-xs text-white/80 hidden sm:block">
                Click outside the card to close
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionDetailModal;

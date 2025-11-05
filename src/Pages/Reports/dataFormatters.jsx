import { FaMinus, FaPlus } from "react-icons/fa";
import {
  getBillLogo,
  getDTHOperatorName,
  getOperatorLogo,
  getOperatorName,
} from "./icons";

export const formatRechargeData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.transactionId,
    type: getOperatorName(item.operator) || "Mobile Recharge",
    number: item.number,
    date: formatDateDisplay(item.createdAt),
    amount: `₹${item.amount}`,
    commission: `₹${item.rawResponse?.margin || 0}`,
    status: item.status,
    logo: getOperatorLogo(item.operator),
  }));
};

export const formatDTHData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.transactionId,
    type: getDTHOperatorName(item.operator) || "DTH Recharge",
    number: item.number,
    date: formatDateDisplay(item.createdAt),
    amount: `₹${item.amount}`,
    commission: `₹${item.rawResponse?.margin || 0}`,
    status: item.status,
    logo: "https://production-api.billbro.info/uploads/services/1745668699408-icon_set_Pratima_DTH._CB616315948_.png",
  }));
};

export const formatBBPSData = (data, serviceName) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.transactionId,
    type: serviceName + " Bill",
    number:
      item.serviceId === "661061ecda6832bf278254e1"
        ? item.operatorRef
        : item.number,
    date: formatDateDisplay(item.createdAt),
    amount: `₹${item.amount}`,
    commission: `₹${item.rawResponse?.margin || 0}`,
    status: item.status,
    logo: getBillLogo(serviceName),
  }));
};

export const formatDepositData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.transactionId,
    type: "Wallet Deposit",
    number: item.gatewayName || item.txnDesc || "Online Payment",
    date: formatDateDisplay(item.createdAt),
    amount: `₹${item.txnAmount}`,
    commission: "₹0",
    status: item.txnStatus,
    logo: "💰",
  }));
};

export const formatReferralData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.transactionId,
    type: "Referral Bonus",
    number: item.txnDesc || "Referral Reward",
    date: formatDateDisplay(item.createdAt),
    amount: `₹${item.txnAmount}`,
    commission: `₹${item.txnAmount}`,
    status: item.txnStatus,
    logo: "🎁",
  }));
};

export const formatLedgerData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.orderId,
    type: item.description || "Transaction",
    number: item.userName || "-",
    date: formatDateDisplay(item.date),
    amount: item.credit > 0 ? `+₹${item.credit}` : `-₹${item.debit}`,
    commission: "",
    status: item.credit > 0 ? "Credited" : "Debited",
    logo: item.credit > 0 ? <FaPlus size={15} /> : <FaMinus size={15} />,
    openingBalance: item.openingBalance,
    closingBalance: item.closingBalance,
  }));
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${date.getDate()} ${
    months[date.getMonth()]
  }, ${date.getFullYear()} ${date.toLocaleTimeString()}`;
};

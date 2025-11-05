import API from "../../Redux/API";
import { decryptFunc } from "../../Utils/CommonFunc";
import {
  formatBBPSData,
  formatDepositData,
  formatDTHData,
  formatLedgerData,
  formatRechargeData,
  formatReferralData,
} from "./dataFormatters";

export const fetchTransactionData = async ({
  activeTab,
  currentPage,
  dateRange,
  selectedService,
  phone,
}) => {
  const page = currentPage;
  const limit = 10;

  const dateParams =
    dateRange.start && dateRange.end
      ? {
          startDate: formatDateForAPI(dateRange.start),
          endDate: formatDateForAPI(dateRange.end),
        }
      : {};
  let transactions = [];
  let totalPages = 1;

  try {
    switch (activeTab) {
      case "recharges": {
        // Fetch both Mobile Recharge and DTH together
        const [mobileResponse, dthResponse] = await Promise.all([
          API.get(`/cyrus/recharge_history`, {
            params: { page, limit, ...dateParams },
          }),
          API.get(`/cyrus/dth_history`, {
            params: { page, limit, ...dateParams },
          }),
        ]);

        const mobileData = formatRechargeData(
          decryptFunc(mobileResponse.data.Data) || []
        );
        const dthData = formatDTHData(dthResponse.data.Data || []);

        // Merge and sort by date (newest first)
        const allRecharges = [...mobileData, ...dthData].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        // Paginate manually
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        transactions = allRecharges.slice(startIndex, endIndex);

        // Calculate total pages based on combined data
        totalPages = Math.ceil(allRecharges.length / limit);
        break;
      }

      case "billPayments": {
        // Only show selected BBPS service data (no DTH mixing)
        const bbpsResponse = await API.get(`/cyrus/bbps/bill-history`, {
          params: {
            serviceId: selectedService.serviceId,
            page,
            limit,
            ...dateParams,
          },
        });

        transactions = formatBBPSData(
          decryptFunc(bbpsResponse.data.Data) || [],
          selectedService.name
        );
        totalPages = bbpsResponse.data.totalPages || 1;
        break;
      }

      case "deposits": {
        const response = await API.get(`/txn/list`, {
          params: { txnResource: "Online", page, limit, ...dateParams },
        });
        transactions = formatDepositData(decryptFunc(response.data.Data));
        totalPages = response.data.totalPages || 1;
        break;
      }

      case "referrals": {
        const response = await API.get(`/txn/list`, {
          params: { page, limit, ...dateParams },
        });
        const allTxns = decryptFunc(response.data.Data) || [];
        const referralTxns = allTxns.filter(
          (txn) =>
            txn.txnId?.includes("refer") || txn.orderId?.includes("refer")
        );
        transactions = formatReferralData(referralTxns);
        totalPages = response.data.totalPages || 1;
        break;
      }

      case "ledgerBook": {
        if (!phone) {
          transactions = [];
          break;
        }
        const response = await API.get(`/txn/ledger`, {
          params: { phone, isExport: false, page, limit, ...dateParams },
        });
        transactions = formatLedgerData(response.data.Data);
        totalPages = response.data.totalPages || 1;
        break;
      }

      default:
        transactions = [];
    }

    return { transactions, totalPages };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Format date for API - ISO format without timezone
 * 
 * @param {Date} date - JavaScript Date object
 * @returns {string} - ISO formatted date (e.g., "2025-10-31T00:00:00")
 */
const formatDateForAPI = (date) => {
  if (!date) return "";

  // Extract date components using local timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Return ISO format (no spaces, no timezone)
  // Format: YYYY-MM-DDTHH:MM:SS
  // T separates date and time (standard ISO format)
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import Loader from "../../Components/Loader";
import DateRangePicker from "./DateRangePicker";
import TabNavigation from "./TabNavigation";
import ServiceDropdown from "./ServiceDropdown";
import { AllBBPSServiceList } from "../../Utils/MockData";
import TransactionCard, { LedgerCard } from "./TransactionCard";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { fetchTransactionData } from "./ReportsAPI";
import TransactionDetailModal from "./TransactionDetailModal";

const Reports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const [activeTab, setActiveTab] = useState("recharges");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedService, setSelectedService] = useState(AllBBPSServiceList[0]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW: Search mode state for bill payments
  const [searchMode, setSearchMode] = useState("date"); // "date" or "txnId"
  const [searchMobile, setSearchMobile] = useState("");
  const [searchTxnId, setSearchTxnId] = useState("");

  const tabs = [
    { id: "recharges", label: "Recharges" },
    { id: "dth", label: "DTH" },
    { id: "billPayments", label: "Bill Payments" },
    { id: "deposits", label: "Deposits" },
    { id: "referrals", label: "Referrals" },
    { id: "ledgerBook", label: "Ledger Book" },
  ];

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, selectedService]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchTransactionData({
        activeTab,
        currentPage,
        dateRange: searchMode === "date" ? dateRange : null,
        selectedService,
        phone:
          searchMode === "date"
            ? searchMobile || ProfileData?.Data?.phone
            : null,
        txnId: searchMode === "txnId" ? searchTxnId : null,
      });
      setTransactions(result.transactions);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setDateRange({ start: null, end: null });
    setSearchMode("date");
    setSearchMobile("");
    setSearchTxnId("");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setCurrentPage(1);
  };

  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={100}
          height={40}
          src="https://ik.imagekit.io/43tomntsa/images__1_-removebg-preview.png"
          alt=""
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-theme-base">
      {/* Header */}
      <div className="fixed top-0 w-full z-10">
        <CommonHeader
          title={"Reports"}
          handleclick={() => navigate(-1)}
          // rightDesign={rightDesign}
        />
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto p-4 mt-16 bg-theme-base min-h-screen">
        {/* NEW: Search Mode Toggle for Bill Payments */}
        {activeTab === "billPayments" && (
          <div className="mb-4 p-4 bg-theme-card-2 rounded-lg border border-theme">
            <label className="block text-sm font-medium text-theme-secondary mb-3">
              Search Transactions By:
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="date"
                  checked={searchMode === "date"}
                  onChange={(e) => setSearchMode(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-theme-secondary">
                  Mobile Number + Date
                </span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="txnId"
                  checked={searchMode === "txnId"}
                  onChange={(e) => setSearchMode(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-theme-secondary">
                  Transaction Reference ID
                </span>
              </label>
            </div>

            {/* Conditional Input Fields */}
            {searchMode === "date" ? (
              <div className="space-y-3">
                <input
                  type="tel"
                  placeholder="Enter Mobile Number (Optional)"
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary placeholder:text-theme-muted focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <DateRangePicker
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  onSearch={handleSearch}
                />
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter Transaction ID (e.g., BC20251226123456)"
                  value={searchTxnId}
                  onChange={(e) => setSearchTxnId(e.target.value)}
                  className="w-full px-4 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary placeholder:text-theme-muted focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Search by Transaction ID
                </button>
              </div>
            )}
          </div>
        )}

        {/* Original Date Picker for other tabs */}
        {activeTab !== "billPayments" && (
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            onSearch={handleSearch}
          />
        )}

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === "billPayments" && (
          <ServiceDropdown
            selectedService={selectedService}
            onServiceChange={handleServiceChange}
            services={AllBBPSServiceList}
          />
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((item) =>
                  activeTab === "ledgerBook" ? (
                    <LedgerCard
                      key={item.id}
                      transaction={item}
                      onClick={handleCardClick}
                    />
                  ) : (
                    <TransactionCard
                      key={item.id}
                      transaction={item}
                      onClick={handleCardClick}
                    />
                  )
                )
              ) : (
                <EmptyState />
              )}
            </div>

            {transactions.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          transaction={selectedTransaction}
          type={activeTab}
        />
      </div>
    </div>
  );
};

export default Reports;

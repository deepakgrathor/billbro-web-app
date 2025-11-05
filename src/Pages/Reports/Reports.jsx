import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
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
        dateRange,
        selectedService,
        phone: ProfileData?.Data?.phone,
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full z-10">
        <CommonHeader title={"Reports"} handleclick={() => navigate(-1)} />
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto p-4 mt-16 bg-white min-h-screen">
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          onSearch={handleSearch}
        />

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

// hooks/usePaymentService.js
import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import ToastComp from "../Components/ToastComp";

/**
 * Custom hook for payment service operations
 * Provides all payment-related utilities
 */
export const usePaymentService = () => {
  // Selectors
  const walletBalance = useSelector(
    (state) => state.LoginSlice.profile.ProfileData?.Data?.wallet?.balance || 0
  );
  const walletSelect = useSelector((state) => state.PaymentSlice.walletSelect);
  const serviceList = useSelector(
    (state) => state.ServiceSlice.service.serviceList.Data || []
  );

  // Check if wallet has sufficient balance
  const isWalletSufficient = useCallback(
    (amount) => {
      return walletBalance >= parseFloat(amount);
    },
    [walletBalance]
  );

  // Get current wallet balance
  const getWalletBalance = useCallback(() => {
    return walletBalance;
  }, [walletBalance]);

  // Check if UPI payment is enabled
  const isUPIEnabled = useMemo(() => {
    const directUPI = serviceList.find((a) => a.name === "DIRECT_UPI");
    return directUPI?.status === true;
  }, [serviceList]);

  // Get selected payment method
  const getPaymentMethod = useCallback(() => {
    return walletSelect ? "wallet" : "upi";
  }, [walletSelect]);

  // Validate payment data
  const validatePayment = useCallback(
    (data) => {
      const { amount, paymentMethod } = data;

      if (!amount || amount <= 0) {
        return {
          isValid: false,
          error: "Invalid payment amount",
        };
      }

      if (paymentMethod === "wallet" && !isWalletSufficient(amount)) {
        return {
          isValid: false,
          error: "Insufficient wallet balance",
        };
      }

      if (paymentMethod === "upi" && !isUPIEnabled) {
        return {
          isValid: false,
          error: "UPI payment is not available",
        };
      }

      return { isValid: true, error: null };
    },
    [isWalletSufficient, isUPIEnabled]
  );

  // Show payment error toast
  const showError = useCallback((message) => {
    ToastComp({
      message: message || "Payment failed. Please try again.",
      type: "error",
    });
  }, []);

  // Show payment success toast
  const showSuccess = useCallback((message) => {
    ToastComp({
      message: message || "Payment successful!",
      type: "success",
    });
  }, []);

  // Format amount for display
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get payment button text
  const getPayButtonText = useCallback(
    ({ isLoading, paymentMethod, amount }) => {
      if (isLoading) {
        return "Processing...";
      }

      if (paymentMethod === "wallet" && walletBalance < amount) {
        return "💰 Insufficient Wallet Balance";
      }

      return "Proceed to Pay";
    },
    [walletBalance]
  );

  // Should disable pay button
  const shouldDisablePayButton = useCallback(
    ({ isLoading, paymentMethod, amount }) => {
      if (isLoading) return true;
      if (paymentMethod === "wallet" && walletBalance < amount) return true;
      return false;
    },
    [walletBalance]
  );

  return {
    // State
    walletBalance,
    isUPIEnabled,
    currentPaymentMethod: getPaymentMethod(),

    // Methods
    isWalletSufficient,
    getWalletBalance,
    getPaymentMethod,
    validatePayment,
    showError,
    showSuccess,
    formatAmount,
    getPayButtonText,
    shouldDisablePayButton,
  };
};

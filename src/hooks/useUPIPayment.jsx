// hooks/useUPIPayment.js - FIXED VERSION
import { useState, useRef, useCallback, useEffect } from "react";
import API from "../Redux/API";
import ToastComp from "../Components/ToastComp";

const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

const LOADING_STAGES = {
  IDLE: "",
  CREATING_ORDER: "creating",
  OPENING_UPI: "opening",
  WAITING_PAYMENT: "waiting",
  VERIFYING: "verifying",
  SUCCESS: "success",
};

const MAX_VERIFICATION_RETRIES = 10;
const VERIFICATION_RETRY_DELAY = 3000;
const UPI_APP_OPEN_DELAY = 2000;

const debugAlert = (message) => {
  if (window.ENABLE_DEBUG_ALERTS) {
    alert(message);
  }
};

export const useUPIPayment = (onSuccess, onError) => {
//   debugAlert("🔵 Hook initialized");
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(LOADING_STAGES.IDLE);
  const [orderId, setOrderId] = useState(null);
  const [verificationRetryCount, setVerificationRetryCount] = useState(0);

  const paymentTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const isProcessingRef = useRef(false);
  const processedOrdersRef = useRef(new Set()); // ✅ NEW: Track processed orders

  const clearPaymentTimeout = useCallback(() => {
    if (paymentTimeoutRef.current) {
      clearTimeout(paymentTimeoutRef.current);
      paymentTimeoutRef.current = null;
    }
  }, []);

  const resetPaymentState = useCallback(() => {
    // debugAlert("🔄 Resetting state");
    
    if (!isMountedRef.current) return;
    
    setIsLoading(false);
    setLoadingStage(LOADING_STAGES.IDLE);
    setOrderId(null);
    setVerificationRetryCount(0);
    isProcessingRef.current = false;
    clearPaymentTimeout();
    
    // debugAlert("✅ State reset complete");
  }, [clearPaymentTimeout]);

  const verifyUPIPayment = useCallback(
    async (completedOrderId, retryCount = 0) => {
    //   debugAlert(`🔍 Verifying payment\nOrderID: ${completedOrderId}\nRetry: ${retryCount}`);

      // ✅ FIXED: Check if already processed
      if (processedOrdersRef.current.has(completedOrderId)) {
        // debugAlert(`⚠️ Order ${completedOrderId} already processed, skipping`);
        return;
      }

      if (!isMountedRef.current) {
        // debugAlert("⚠️ Component unmounted");
        return;
      }

      if (retryCount >= MAX_VERIFICATION_RETRIES) {
        // debugAlert("❌ Max retries reached");
        ToastComp({
          message: "Payment verification timeout",
          type: "error",
        });
        resetPaymentState();
        if (onError) onError(new Error("Verification timeout"));
        return;
      }

      setLoadingStage(LOADING_STAGES.VERIFYING);
      setVerificationRetryCount(retryCount);

      try {
        // debugAlert("🌐 Calling verify API...");
        const response = await API.post(`payment/upiintent/verify-order`, {
          orderId: completedOrderId,
        });

        // debugAlert(`✅ API Response\nStatus: ${response.data?.status}`);

        if (!isMountedRef.current) return;

        if (!response.data?.status) {
          throw new Error("Invalid response");
        }

        const paymentStatus = response.data.status;

        switch (paymentStatus) {
          case PAYMENT_STATUS.SUCCESS:
            // debugAlert("✅ Payment SUCCESS!\nCalling onSuccess...");
            
            // ✅ Mark as processed immediately
            processedOrdersRef.current.add(completedOrderId);
            
            setLoadingStage(LOADING_STAGES.SUCCESS);

            // ✅ FIXED: Don't set isProcessingRef here
            // Let the success flow complete first
            
            // debugAlert(`🎉 Executing onSuccess\nType: ${typeof onSuccess}`);
            
            if (onSuccess) {
              try {
                // debugAlert(`🚀 Calling onSuccess(${completedOrderId})`);
                
                // ✅ Call onSuccess immediately without timeout
                await onSuccess(completedOrderId);
                
                // debugAlert("✅ onSuccess completed");
                
                // ✅ Reset state after success
                setTimeout(() => {
                  resetPaymentState();
                }, 1000);
                
              } catch (error) {
                // debugAlert(`❌ Error in onSuccess:\n${error.message}`);
                console.error("Error in onSuccess:", error);
                resetPaymentState();
              }
            } else {
            //   debugAlert("⚠️ onSuccess is null!");
              resetPaymentState();
            }
            break;

          case PAYMENT_STATUS.PENDING:
            // debugAlert(`⏳ Payment PENDING\nRetrying in 3s...`);
            
            paymentTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                verifyUPIPayment(completedOrderId, retryCount + 1);
              }
            }, VERIFICATION_RETRY_DELAY);
            break;

          default:
            // debugAlert(`❌ Payment FAILED\nStatus: ${paymentStatus}`);
            throw new Error("Payment failed");
        }
      } catch (error) {
        // debugAlert(`❌ Verification Error:\n${error.message}`);

        if (isMountedRef.current) {
          ToastComp({
            message: error.message || "Verification failed",
            type: "error",
          });
          resetPaymentState();
          if (onError) onError(error);
        }
      }
    },
    [resetPaymentState, onSuccess, onError]
  );

  const initiatePayment = useCallback(
    async (amount) => {
    //   debugAlert(`🚀 Starting UPI Payment\nAmount: ₹${amount}`);

      if (isProcessingRef.current) {
        // debugAlert("⚠️ Payment in progress");
        return;
      }

      if (!amount || amount <= 0) {
        // debugAlert("❌ Invalid amount");
        ToastComp({ message: "Invalid amount", type: "error" });
        return;
      }

      isProcessingRef.current = true;
      setIsLoading(true);
      setLoadingStage(LOADING_STAGES.CREATING_ORDER);

      try {
        // debugAlert("🌐 Creating order...");
        const response = await API.post(`payment/upiintent/create-order`, {
          amount: parseFloat(amount),
        });

        // debugAlert(`✅ Order created\nOrderID: ${response.data?.orderId}`);

        if (!isMountedRef.current) return;

        if (!response.data?.status) {
          throw new Error("Failed to create order");
        }

        const {
          orderId: newOrderId,
          upiLink,
          zwitch_transaction_id,
        } = response.data;

        if (!newOrderId || !upiLink) {
          throw new Error("Invalid order response");
        }

        setOrderId(newOrderId);
        setLoadingStage(LOADING_STAGES.OPENING_UPI);
        
        // ✅ FIXED: Reset isProcessingRef here so messages can be received
        isProcessingRef.current = false;

        if (window.ReactNativeWebView) {
        //   debugAlert("📱 Sending to native app...");
          
          const message = {
            action: "OPEN_UPI_APP",
            upiIntentUrl: upiLink,
            orderId: newOrderId,
            zwitch_transaction_id,
            amount: parseFloat(amount),
          };
          
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
          
        //   debugAlert("✅ Message sent!");

          paymentTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setLoadingStage(LOADING_STAGES.WAITING_PAYMENT);
            }
          }, UPI_APP_OPEN_DELAY);
        } else {
        //   debugAlert("❌ ReactNativeWebView not found!");
          throw new Error("UPI only available in mobile app");
        }
      } catch (error) {
        // debugAlert(`❌ Initiation Error:\n${error.message}`);

        if (isMountedRef.current) {
          ToastComp({
            message: error.message || "Failed to initiate",
            type: "error",
          });
          resetPaymentState();
          if (onError) onError(error);
        }
      }
    },
    [resetPaymentState, onError]
  );

  useEffect(() => {
    const handleNativeMessage = (event) => {
    //   debugAlert(`📥 Message received\nType: ${typeof event.data}`);

      // ✅ FIXED: Only check isMountedRef, not isProcessingRef
      if (!isMountedRef.current) {
        // debugAlert("⚠️ Component unmounted, skipping");
        return;
      }

      try {
        const message =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // debugAlert(`📊 Parsed message\nType: ${message?.type}`);

        if (!message || typeof message !== "object") {
        //   debugAlert("⚠️ Invalid message");
          return;
        }

        switch (message.type) {
          case "PAYMENT_COMPLETED":
            // debugAlert(`✅ PAYMENT_COMPLETED\nOrderID: ${message.data?.orderId}`);
            
            if (message.data?.orderId) {
              // ✅ Check if already processed
              if (processedOrdersRef.current.has(message.data.orderId)) {
                // debugAlert(`⚠️ Already processed ${message.data.orderId}`);
                return;
              }
              
              clearPaymentTimeout();
            //   debugAlert("🔍 Starting verification...");
              verifyUPIPayment(message.data.orderId, 0);
            } else {
            //   debugAlert("⚠️ No orderId in message");
            }
            break;

          case "UPI_APP_NOT_FOUND":
            // debugAlert("❌ UPI app not found");
            ToastComp({
              message: "Install UPI app",
              type: "error",
            });
            resetPaymentState();
            if (onError) onError(new Error("UPI app not found"));
            break;

          case "PAYMENT_CANCELLED":
            // debugAlert("❌ Payment cancelled");
            ToastComp({
              message: "Payment cancelled",
              type: "info",
            });
            resetPaymentState();
            if (onError) onError(new Error("Payment cancelled"));
            break;

          default:
            // debugAlert(`⚠️ Unknown type:\n${message.type}`);
        }
      } catch (error) {
        // debugAlert(`❌ Message parse error:\n${error.message}`);
      }
    };

    window.addEventListener("message", handleNativeMessage);
    document.addEventListener("message", handleNativeMessage);

    return () => {
      window.removeEventListener("message", handleNativeMessage);
      document.removeEventListener("message", handleNativeMessage);
    };
  }, [verifyUPIPayment, resetPaymentState, clearPaymentTimeout, onError]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearPaymentTimeout();
    };
  }, [clearPaymentTimeout]);

  const getLoadingMessage = useCallback(() => {
    const messages = {
      [LOADING_STAGES.CREATING_ORDER]: "Creating payment order...",
      [LOADING_STAGES.OPENING_UPI]: "Opening UPI app...",
      [LOADING_STAGES.WAITING_PAYMENT]: `Waiting (${verificationRetryCount}/${MAX_VERIFICATION_RETRIES})`,
      [LOADING_STAGES.VERIFYING]: "Verifying payment...",
      [LOADING_STAGES.SUCCESS]: "Payment successful! ✓",
    };
    
    return messages[loadingStage] || "Processing...";
  }, [loadingStage, verificationRetryCount]);

  return {
    isLoading,
    loadingStage,
    orderId,
    verificationRetryCount,
    initiatePayment,
    resetPaymentState,
    getLoadingMessage,
    LOADING_STAGES,
  };
};
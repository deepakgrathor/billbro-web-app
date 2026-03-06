import React, { Suspense, useEffect, useRef } from "react";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import PublicRoute from "./PublicRoute";
import FallbackRoute from "./FallbackRoute";
import PageFallback from "../Components/PageFallback";
import ErrorBoundary from "../Components/ErrorBoundary";

// Critical path - keep static (always needed on first load)
import HomeContent from "../Pages/Home/HomeContent";
import AuthScreen from "../Pages/Auth/AuthScreen";

// Lazy load all other routes for ~60-70% initial bundle reduction
const ProfilePage = React.lazy(() => import("../Pages/Profile/ProfilePage"));
const Wallet = React.lazy(() => import("../Pages/Wallet/Wallet"));
const PaymentSuccess = React.lazy(() => import("../Pages/Wallet/PaymentSuccess"));
const Reports = React.lazy(() => import("../Pages/Reports/Reports"));
const CommissionList = React.lazy(() => import("../Pages/Public/CommissionList"));
const NotificationList = React.lazy(() => import("../Pages/Public/NotificationList"));
const BBPSLIst = React.lazy(() => import("../Pages/BBPS/BBPSLIst"));
const MainBBPS = React.lazy(() => import("../Pages/BBPS/MainBBPS"));
const GooglePlay = React.lazy(() => import("../Pages/BBPS/GooglePlay"));
const MobileHome = React.lazy(() => import("../Pages/Mobile/MobileHome"));
const PaymentConfirm = React.lazy(() => import("../Pages/Mobile/PaymentConfirm"));
const BrowsePlans = React.lazy(() => import("../Pages/Mobile/BrowsePlans"));
const OperatorAndCircle = React.lazy(() => import("../Pages/Mobile/OperatorAndCircle"));
const DTHHome = React.lazy(() => import("../Pages/DTH/DTHHome"));
const BBPSStatus = React.lazy(() => import("../Pages/BBPS/BBPSStatus"));
const BBPSComplain = React.lazy(() => import("../Pages/BBPS/BBPSComplain/BBPSComplain"));
const BBPSComplaintSuccess = React.lazy(() => import("../Pages/BBPS/BBPSComplain/BBPSComplaintSuccess"));
const ReferScreen = React.lazy(() => import("../Pages/Public/ReferScreen"));
const ReferList = React.lazy(() => import("../Pages/Public/ReferList"));
const RechargeStatus = React.lazy(() => import("../Pages/Mobile/RechargeStatus"));
const Contact = React.lazy(() => import("../Pages/Public/Contact"));
const PrivacyPolicy = React.lazy(() => import("../Pages/Public/PrivacyPolicy"));
const TermsConditions = React.lazy(() => import("../Pages/Public/TermsConditions"));
const RefundPolicy = React.lazy(() => import("../Pages/Public/RefundPolicy"));
const RaiseComplaintPage = React.lazy(() => import("../Pages/Reports/RaiseComplaintPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip scroll for modal-like routes (status/success pages)
    const isModalRoute =
      pathname.includes("status") || pathname.includes("success");

    if (prevPathname.current !== pathname && !isModalRoute) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}

const AppNavigate = () => {
  return (
    <div className="">
      <ErrorBoundary level="app">
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <ErrorBoundary level="page">
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<AuthScreen />} />
                  </Route>
                  {/* Private Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomeContent />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/commission" element={<CommissionList />} />
                    <Route path="/notification" element={<NotificationList />} />
                    <Route path="/bbpslist" element={<BBPSLIst />} />
                    <Route path="/mainbbps" element={<MainBBPS />} />
                    <Route path="/googleplay" element={<GooglePlay />} />
                    <Route path="/mobile" element={<MobileHome />} />
                    <Route path="/paymentconfirm" element={<PaymentConfirm />} />
                    <Route path="/plans" element={<BrowsePlans />} />
                    <Route
                      path="/OperatorAndCircle"
                      element={<OperatorAndCircle />}
                    />
                    <Route path="/dth" element={<DTHHome />} />
                    <Route path="/bbpsstatus" element={<BBPSStatus />} />
                    <Route
                      path="/bbps-complaint-registration"
                      element={<BBPSComplain />}
                    />
                    <Route
                      path="/bbps-complaint-success"
                      element={<BBPSComplaintSuccess />}
                    />
                    <Route path="/refer" element={<ReferScreen />} />
                    <Route path="/referlist" element={<ReferList />} />
                    <Route path="/rechargestatus" element={<RechargeStatus />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route
                      path="/recharge-complain"
                      element={<RaiseComplaintPage />}
                    />

                    {/* Add more private routes here */}
                  </Route>
                  <Route path="*" element={<FallbackRoute />} />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
};

export default AppNavigate;

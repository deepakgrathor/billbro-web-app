import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
  useResolvedPath,
} from "react-router-dom";
import HomeContent from "../Pages/Home/HomeContent";
import ProfilePage from "../Pages/Profile/ProfilePage";
import Wallet from "../Pages/Wallet/Wallet";
import Reports from "../Pages/Reports/Reports";
import AuthScreen from "../Pages/Auth/AuthScreen";
import PublicRoute from "./PublicRoute";
import FallbackRoute from "./FallbackRoute";
import CommissionList from "../Pages/Public/CommissionList";
import NotificationList from "../Pages/Public/NotificationList";
import BBPSLIst from "../Pages/BBPS/BBPSLIst";
import MainBBPS from "../Pages/BBPS/MainBBPS";
import MobileHome from "../Pages/Mobile/MobileHome";
import DTHHome from "../Pages/DTH/DTHHome";
import BBPSStatus from "../Pages/BBPS/BBPSStatus";
import BrowsePlans from "../Pages/Mobile/BrowsePlans";
import OperatorAndCircle from "../Pages/Mobile/OperatorAndCircle";
import PaymentConfirm from "../Pages/Mobile/PaymentConfirm";
import ReferScreen from "../Pages/Public/ReferScreen";
import ReferList from "../Pages/Public/ReferList";
import BBPSComplain from "../Pages/BBPS/BBPSComplain/BBPSComplain";
import GooglePlay from "../Pages/BBPS/GooglePlay";
import RechargeStatus from "../Pages/Mobile/RechargeStatus";
import Contact from "../Pages/Public/Contact";
import PrivacyPolicy from "../Pages/Public/PrivacyPolicy";
import TermsConditions from "../Pages/Public/TermsConditions";
import RefundPolicy from "../Pages/Public/RefundPolicy";
import RaiseComplaintPage from "../Pages/Reports/RaiseComplaintPage";
import BBPSComplaintSuccess from "../Pages/BBPS/BBPSComplain/BBPSComplaintSuccess";
import PaymentSuccess from "../Pages/Wallet/PaymentSuccess";
// import { RechargeProvider } from "../Context/RechargeContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position
    window.scrollTo(0, 0);

    // Also reset document body scroll (for some browsers)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

const AppNavigate = () => {
  return (
    <div className="">
      <AuthProvider>
        {/* <RechargeProvider> */}
        <BrowserRouter>
          <ScrollToTop />
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
        </BrowserRouter>
        {/* </RechargeProvider> */}
      </AuthProvider>
    </div>
  );
};

export default AppNavigate;

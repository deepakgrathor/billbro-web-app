import { configureStore } from "@reduxjs/toolkit";
import ServiceSlice from "./Slices/ServiceSlice/ServiceSlice";
import LoginSlice from "./Slices/AuthSlice/LoginSlice";
import PublicSlice from "./Slices/PublicSlice/PublicSlice";
import BannerSlice from "./Slices/PublicSlice/BannerSlice";
import PaymentSlice from "./Slices/PaymentSlice";
import RechargeSlice from "./Slices/ServiceSlice/RechargeSlice";
export const Store = configureStore({
  reducer: {
    ServiceSlice: ServiceSlice,
    LoginSlice: LoginSlice,
    PublicSlice: PublicSlice,
    PaymentSlice: PaymentSlice,
    RechargeSlice: RechargeSlice,
    BannerSlice: BannerSlice,
  },
});

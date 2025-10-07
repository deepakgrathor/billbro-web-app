import { createSlice } from "@reduxjs/toolkit";

const PaymentSlice = createSlice({
  name: "PaymentSlice",
  initialState: {
    PaymentType: {
      type: "",
      Totalprice: "",
      detail: "",
      ids: "",
      serviceType: "",
      SHOW_PREPAID: "",
    },
  },
  reducers: {
    setPaymentType: (state, action) => {
      state.PaymentType.Totalprice = action.payload.amount;
      state.PaymentType.type = action.payload.type;
      state.PaymentType.detail = action.payload.detail;
      state.PaymentType.ids = action.payload.ids;
      state.PaymentType.serviceType = action.payload.serviceType;
      state.PaymentType.SHOW_PREPAID = action.payload.SHOW_PREPAID;
    },
    setWalletSelect: (state, action) => {
      state.walletSelect = action.payload;
    },
  },
});

export const { setPaymentType, setWalletSelect } = PaymentSlice.actions;
export default PaymentSlice.reducer;

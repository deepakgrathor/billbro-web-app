import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { decryptFunc } from "../../../Utils/CommonFunc";
import API from "../../API";

export const fetchServiceList = createAsyncThunk(
  "fetchServiceList",
  async () => {
    try {
      const res = await API.get(`/service/list`);
      return {
        ...res.data,
        Data: decryptFunc(res.data.Data),
      };
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
);
export const Fetch_BPPS_Operator_List = createAsyncThunk(
  "Fetch_BPPS_Operator_List",
  async ({ serviceId }) => {
    try {
      const res = await API.get(
        `cyrus/bbps/operator-list?serviceId=${serviceId}`
      );
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
);
export const Fetch_BPPS_BILL = createAsyncThunk(
  "Fetch_BPPS_BILL",
  async ({ payload }) => {
    try {
      const res = await API.post(`cyrus/bbps/new-bill-fetch`, payload);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
);
export const BBPS_PAY_BILL = createAsyncThunk(
  "BBPS_PAY_BILL",
  async ({ valData }, thunkAPI) => {
    try {
      const res = await API.post(`cyrus/bbps/new-bill-payment`, valData);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Dispatch a custom action or handle the 400 error here
        // You can access the error response using `error.response.data`
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
);
export const GOOGLE_PLAY_PAYMENT = createAsyncThunk(
  "GOOGLE_PLAY_PAYMENT",
  async ({ valData }, thunkAPI) => {
    try {
      const res = await API.post(`cyrus/bbps/googleplay-payment`, valData);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
);

const ServiceSlice = createSlice({
  name: "ServiceSlice",
  initialState: {
    service: {
      serviceList: "",
      serviceLoader: false,
    },
    bbpsOperatorList: "",
    fetchBBPSBill: "",
    universalLoader: false,
    googlePaymentLoader: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchServiceList.pending, (state) => {
      state.service.serviceLoader = true;
    });
    builder.addCase(fetchServiceList.fulfilled, (state, action) => {
      state.service.serviceList = action.payload;
      state.service.serviceLoader = false;
    });
    builder.addCase(fetchServiceList.rejected, (state) => {
      state.service.serviceLoader = false;
    });
    builder.addCase(Fetch_BPPS_Operator_List.pending, (state, action) => {
      state.universalLoader = true;
    });
    builder.addCase(Fetch_BPPS_Operator_List.fulfilled, (state, action) => {
      state.bbpsOperatorList = action.payload;
      state.universalLoader = false;
    });
    builder.addCase(Fetch_BPPS_Operator_List.rejected, (state, action) => {
      state.universalLoader = false;
    });
    builder.addCase(Fetch_BPPS_BILL.pending, (state, action) => {
      state.universalLoader = true;
    });
    builder.addCase(Fetch_BPPS_BILL.fulfilled, (state, action) => {
      state.fetchBBPSBill = action.payload;
      state.universalLoader = false;
    });
    builder.addCase(Fetch_BPPS_BILL.rejected, (state, action) => {
      state.universalLoader = false;
    });
    builder.addCase(GOOGLE_PLAY_PAYMENT.pending, (state, action) => {
      state.googlePaymentLoader = true;
    });
    builder.addCase(GOOGLE_PLAY_PAYMENT.fulfilled, (state, action) => {
      state.googlePaymentLoader = false;
    });
    builder.addCase(GOOGLE_PLAY_PAYMENT.rejected, (state, action) => {
      state.googlePaymentLoader = false;
    });
  },
});

export default ServiceSlice.reducer;

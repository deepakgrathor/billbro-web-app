import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";
import { decryptFunc } from "../../../Utils/CommonFunc";

export const getMobileRechargePlan = createAsyncThunk(
  "getMobileRechargePlan",
  async ({ Circle_Code, Operator_Code, MobileNumber }, thunkAPI) => {
    try {
      const res = await API.get(
        `cyrus/plan_fetch?Operator_Code=${Operator_Code}&Circle_Code=${Circle_Code}&MobileNumber=${MobileNumber}`
      );

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
export const RechargeRequest = createAsyncThunk(
  "RechargeRequest",
  async ({
    MobileNumber,
    Operator_Code,
    Circle_Code,
    amount,

    isPrepaid,
  }) => {
    try {
      const res = await API.get(
        `cyrus/recharge_request?number=${MobileNumber}&operator=${Operator_Code}&circle=${Circle_Code}&amount=${amount}&isPrepaid=${isPrepaid}`
      );
      return {
        ...res.data,
        Data: decryptFunc(res.data.Data),
      };
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
export const DTHRechargeRequest = createAsyncThunk(
  "DTHRechargeRequest",
  async ({ MobileNumber, Operator_Code, amount }) => {
    try {
      const res = await API.get(
        `cyrus/dth_request?number=${MobileNumber}&operator=${Operator_Code}&amount=${amount}`
      );
      return {
        ...res.data,
        Data: decryptFunc(res.data.Data),
      };
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
export const getRechargeHistory = createAsyncThunk(
  "getRechargeHistory",
  async () => {
    try {
      const res = await API.get(`cyrus/recharge_history`);
      return {
        ...res.data,
        Data: decryptFunc(res.data.Data),
      };
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
export const getOperatorandCirclebyPhone = createAsyncThunk(
  "getOperatorandCirclebyPhone",
  async ({ phone }) => {
    try {
      const res = await API.get(`cyrus/operator_by_phone?phone=${phone}`);
      return {
        ...res.data,
        Data: res.data.Data,
      };
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

const RechargeSlice = createSlice({
  name: "RechargeSlice",
  initialState: {
    getPlans: {
      loader: false,
      plans: "",
    },
    rechargeData: {
      mobileNumber: "",
      operator: "",
      circle: "",
      plans: "",
      isPrepaid: true,
    },

    mobileRechargeRequest: {
      mobileRechargeData: "",
      mobileRechargeLoader: false,
    },
    dthRechargeRequest: {
      dthRechargeData: "",
      dthRechargeLoader: false,
    },
    rechargeHistory: {
      rechargeHistoryData: "",
      rechargeHistoryLoader: false,
    },
    rechargeRefund: {
      rechargeRefundLoader: false,
      rechargeRefundData: "",
    },
    operatorandCircle: "",
    loaderUniversal: false,
  },
  reducers: {
    setRechargeData: (state, action) => {
      state.rechargeData = { ...state.rechargeData, ...action.payload };
    },
    resetRechargeData: (state) => {
      state.rechargeData = {
        mobileNumber: "",
        operator: "",
        circle: "",
        plans: "",
        isPrepaid: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMobileRechargePlan.pending, (state, action) => {
      state.getPlans.loader = true;
    });
    builder.addCase(getMobileRechargePlan.fulfilled, (state, action) => {
      state.getPlans.plans = action.payload;
      state.getPlans.loader = false;
    });
    builder.addCase(getMobileRechargePlan.rejected, (state, action) => {
      state.getPlans.loader = false;
    });
    builder.addCase(RechargeRequest.pending, (state, action) => {
      state.mobileRechargeRequest.mobileRechargeLoader = true;
    });
    builder.addCase(RechargeRequest.fulfilled, (state, action) => {
      state.mobileRechargeRequest.mobileRechargeData = action.payload;
      state.mobileRechargeRequest.mobileRechargeLoader = false;
    });
    builder.addCase(RechargeRequest.rejected, (state, action) => {
      state.mobileRechargeRequest.mobileRechargeLoader = false;
    });
    builder.addCase(DTHRechargeRequest.pending, (state, action) => {
      state.dthRechargeRequest.dthRechargeLoader = true;
    });
    builder.addCase(DTHRechargeRequest.fulfilled, (state, action) => {
      state.dthRechargeRequest.dthRechargeData = action.payload;
      state.dthRechargeRequest.dthRechargeLoader = false;
    });
    builder.addCase(DTHRechargeRequest.rejected, (state, action) => {
      state.dthRechargeRequest.dthRechargeLoader = false;
    });
    builder.addCase(getRechargeHistory.pending, (state, action) => {
      state.rechargeHistory.rechargeHistoryLoader = true;
    });
    builder.addCase(getRechargeHistory.fulfilled, (state, action) => {
      state.rechargeHistory.rechargeHistoryData = action.payload;
      state.rechargeHistory.rechargeHistoryLoader = false;
    });
    builder.addCase(getRechargeHistory.rejected, (state, action) => {
      state.rechargeHistory.rechargeHistoryLoader = false;
    });
    builder.addCase(getOperatorandCirclebyPhone.pending, (state, action) => {
      state.loaderUniversal = true;
    });
    builder.addCase(getOperatorandCirclebyPhone.fulfilled, (state, action) => {
      state.operatorandCircle = action.payload;
      state.loaderUniversal = false;
    });
    builder.addCase(getOperatorandCirclebyPhone.rejected, (state, action) => {
      state.loaderUniversal = false;
    });
  },
});
export const { setRechargeData, resetRechargeData } = RechargeSlice.actions;
export default RechargeSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";
import { decryptFunc } from "../../../Utils/CommonFunc";

export const getServiceBannerList = createAsyncThunk(
  "getServiceBannerList",
  async () => {
    try {
      const res = await API.get(`/banner/list`);
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

const BannerSlice = createSlice({
  name: "BannerSlice",
  initialState: {
    ServiceBanner: {
      ServiceBannerList: "",
      ServiceBannerLoader: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceBannerList.pending, (state, action) => {
      state.ServiceBanner.ServiceBannerLoader = true;
    });
    builder.addCase(getServiceBannerList.fulfilled, (state, action) => {
      state.ServiceBanner.ServiceBannerList = action.payload;
      state.ServiceBanner.ServiceBannerLoader = false;
    });
    builder.addCase(getServiceBannerList.rejected, (state, action) => {
      state.ServiceBanner.ServiceBannerLoader = false;
    });
  },
});

export default BannerSlice.reducer;

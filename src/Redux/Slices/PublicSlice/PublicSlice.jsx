import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { decryptFunc } from "../../../Utils/CommonFunc";
import API from "../../API";

export const getNotification = createAsyncThunk("getNotification", async () => {
  try {
    const res = await API.get(`/notification/list`);
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
});

export const getBannerList = createAsyncThunk(
  "getBannerList",
  async ({ type }, thunkAPI) => {
    try {
      const res = await API.get(`/banner/list?section=${type}`);
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

const PublicSlice = createSlice({
  name: "PublicSlice",
  initialState: {
    notification: {
      notificationList: "",
      notificationLoader: false,
    },
    bannerList: {
      bannerData: "",
      bannerLoader: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotification.pending, (state, action) => {
      state.notification.notificationLoader = true;
    });
    builder.addCase(getNotification.fulfilled, (state, action) => {
      state.notification.notificationList = action.payload;
      state.notification.notificationLoader = false;
    });
    builder.addCase(getNotification.rejected, (state, action) => {
      state.notification.notificationLoader = false;
    });
    // builder.addCase(getEarnPoint.pending, (state, action) => {
    //   state.earnPoint.earnPointLoader = true;
    // });
    // builder.addCase(getEarnPoint.fulfilled, (state, action) => {
    //   state.earnPoint.earnPointData = action.payload;
    //   state.earnPoint.earnPointLoader = false;
    // });
    // builder.addCase(getEarnPoint.rejected, (state, action) => {
    //   state.earnPoint.earnPointLoader = false;
    // });
    builder.addCase(getBannerList.pending, (state, action) => {
      state.bannerList.bannerLoader = true;
    });
    builder.addCase(getBannerList.fulfilled, (state, action) => {
      state.bannerList.bannerData = action.payload;
      state.bannerList.bannerLoader = false;
    });
    builder.addCase(getBannerList.rejected, (state, action) => {
      state.bannerList.bannerLoader = false;
    });
  },
});

export default PublicSlice.reducer;

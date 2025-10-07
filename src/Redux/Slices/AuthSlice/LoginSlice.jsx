import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";
import ToastComp from "../../../Components/ToastComp";
import { decryptFunc } from "../../../Utils/CommonFunc";

export const newUserRegister = createAsyncThunk(
  "newUserRegister",
  async ({ formVal, phone, otp, ResponseStatus, devToken }, thunkAPI) => {
    const data = {
      firstName: formVal ? formVal.firstName : "",
      lastName: formVal ? formVal.lastName : "",
      phone: phone ? phone : "",
      email: formVal ? formVal.email : "",
      referalId: formVal ? formVal.referalId : "",
      otp: otp ? otp : "",
      deviceToken: devToken ? devToken : "",
      ResponseStatus: ResponseStatus ? ResponseStatus : "",
    };
    try {
      const res = await API.post(`auth/user-register`, data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Dispatch a custom action or handle the 400 error here
        // You can access the error response using `error.response.data`
        ToastComp({ message: error.response.data.Remarks, type: "error" });
        return error.response.data;
      } else {
        ToastComp({ message: error, type: "error" });
        throw error;
      }
    }
  }
);
export const getUserProfile = createAsyncThunk("getUserProfile", async () => {
  try {
    const res = await API.get(`/user/profile`);
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

const LoginSlice = createSlice({
  name: "LoginSlice",
  initialState: {
    setOtp: {
      OtpVal: "",
    },
    profile: {
      ProfileData: "",
      profileLoader: false,
      profileError: "",
    },
    newRegister: {
      newRegisterLoader: false,
      newRegisterData: "",
    },
  },
  reducers: {
    setOTPVerification: (state, action) => {
      state.setOtp.OtpVal = action.payload;
    },
    removeOTPField: (state, action) => {
      state.setOtp.OtpVal = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(newUserRegister.pending, (state, action) => {
      state.newRegister.newRegisterLoader = true;
    });
    builder.addCase(newUserRegister.fulfilled, (state, action) => {
      state.newRegister.newRegisterData = action.payload;
      state.newRegister.newRegisterLoader = false;
    });
    builder.addCase(newUserRegister.rejected, (state, action) => {
      state.newRegister.newRegisterLoader = false;
    });
    builder.addCase(getUserProfile.pending, (state, action) => {
      state.profile.profileLoader = true;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.profile.ProfileData = action.payload;
      state.profile.profileLoader = false;
      state.profile.profileError = null;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.profile.profileLoader = false;
      state.profile.profileError = action.error;
      state.profile.ProfileData = null;
    });
  },
});

export const { setOTPVerification, removeOTPField } = LoginSlice.actions;
export default LoginSlice.reducer;

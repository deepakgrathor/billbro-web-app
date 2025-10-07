import React, { useContext, useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "../../Utils/Constant";
import ButtonComp from "../../Components/ButtonComp";
import CommonHeader from "../../Components/CommonHeader";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  newUserRegister,
  removeOTPField,
} from "../../Redux/Slices/AuthSlice/LoginSlice";
import ToastComp from "../../Components/ToastComp";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import { FaUser, FaEnvelope, FaLink } from "react-icons/fa";
import { AuthContext } from "../../Navigation/AuthContext";
const AuthScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(2);
  const inputRef = useRef(null);
  const [tokenLoad, setTokenLoad] = useState(false);
  const [otp, setOtp] = useState("");
  const [devToken, setDevToken] = useState();
  const [phone, setPhone] = useState("");
  const [formVal, setFormVal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    referalId: "",
  });
  const [ResponseStatus, setResponseStatus] = useState();
  const { isAuthenticated, login, logout, loading, setIsAuthenticated } =
    useContext(AuthContext);

  const { newRegisterLoader, newRegisterData } = useSelector(
    (state) => state.LoginSlice.newRegister
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormVal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    // Mobile number validation: 10 digits, starts with 6–9
    const isValidPhone = /^[6-9]\d{9}$/.test(phone);

    if (!isValidPhone) {
      //  ToastComp({
      //   message: "Please Enter a Valid Phone Number",
      //   type: "error",
      // });
    }

    try {
      const res = await dispatch(newUserRegister({ phone }));

      if (res.payload.ResponseStatus === 3) {
        // ToastComp({
        //   message:  "OTP Sent",
        //   type: "success",
        // });

        setStep(4);
        // navigation.navigate("OTPVERIFY", phone);
      } else {
        // ToastComp({
        //   message: "Something went wrong",
        //   type: "error",
        // });
      }
    } catch (error) {
      // ToastComp({
      //   message: "Network error, please try again",
      //   type: "error",
      // });
    }
  };
  const handleOTPVerify = async () => {
    const res = await dispatch(newUserRegister({ phone, otp }));

    const status = res.payload?.ResponseStatus;

    if (status === 2) {
      localStorage.setItem("token", res.payload?.AccessToken);
      setIsAuthenticated(true);
      navigate("/");
      dispatch(removeOTPField());
    } else if (status === 1) {
      setResponseStatus(1);
      const serviceRes = await dispatch(fetchServiceList());
      if (serviceRes.payload?.ResponseStatus === 1) {
        const ResObj = serviceRes.payload?.Data.find(
          (a) => a.name === "SIGNUP"
        );
        if (ResObj?.status) {
          setStep(5);
        } else {
          ToastComp({
            message: "Registration Currently Closed",
            type: "info", // <-- better than success
          });
        }
      } else {
        ToastComp({ message: "Something Went Wrong", type: "error" });
      }
    } else if (status === 0) {
      ToastComp({
        message: "Invalid OTP",
        type: "error",
      });
    } else {
      ToastComp({ message: "Unexpected Response", type: "error" });
    }
  };

  const handleSubmit = async () => {
    // Remove spaces from the first name and validate (allowing letters and numbers)
    formVal.firstName = formVal.firstName.replace(/\s+/g, "");
    const firstNameRegex = /^[a-zA-Z0-9]+$/;

    if (!formVal.firstName || !firstNameRegex.test(formVal.firstName)) {
      // ToastComp("First Name is invalid. Special characters are not allowed.");
      // return;
    }

    // Remove spaces from the last name and validate (allowing letters and numbers)
    formVal.lastName = formVal.lastName.replace(/\s+/g, "");
    const lastNameRegex = /^[a-zA-Z0-9]+$/;

    if (!formVal.lastName || !lastNameRegex.test(formVal.lastName)) {
      // ToastComp("Last Name is invalid. Special characters are not allowed.");
      // return;
    }

    // Remove extra spaces from the email and validate
    formVal.email = formVal.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formVal.email || !emailRegex.test(formVal.email)) {
      // ToastComp("Email address is invalid.");
      // return;
    }

    const referralCodeRegex = /^[a-zA-Z0-9]{6}$/;
    if (formVal.referralCode && !referralCodeRegex.test(formVal.referralCode)) {
      // ToastComp(
      //   "Referral Code is invalid. It should be exactly 6 characters long and alphanumeric."
      // );
      // return;
    }

    // Validate email address
    const res = await dispatch(
      newUserRegister({ formVal, phone, otp, ResponseStatus })
    );
    if (res.payload.ResponseStatus === 1) {
      localStorage.setItem("token", res.payload?.AccessToken);
      setIsAuthenticated(true);
      // navigation.navigate('Home');
      navigate("/");
    } else {
      // ToastComp(res.payload.Remarks);
    }
  };

  useEffect(() => {
    if (phone.length === 10) {
      handleLogin();
    }
  }, [phone]);
  useEffect(() => {
    if (otp.length === 6) {
      handleOTPVerify();
    }
  }, [otp]);
  return (
    <div>
      {step === 2 && (
        <div className="flex flex-col min-h-screen">
          {/* Intro Section */}
          <div className="p-4 mt-4 space-y-2">
            <p className="text-center text-sm font-normal tracking-wider">
              Introducing
            </p>
            <p className="uppercase font-black tracking-widest text-2xl sm:text-3xl md:text-4xl text-center">
              {BRAND_NAME}
            </p>
          </div>

          {/* Banner Image */}
          <div className="w-full">
            <img
              className="w-full h-auto"
              src="https://ik.imagekit.io/43tomntsa/Generated%20Image%20September%2018,%202025%20-%2011_50PM.png"
              alt=""
            />
          </div>

          {/* Tagline */}
          <div className="mt-5 px-4 space-y-4">
            <p className="text-center tracking-wider text-sm">
              Pay Smarter, Save Bigger, Earn Rewards
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex bg-gray-100/60 border justify-center border-gray-200 rounded-lg p-4 flex-col items-center space-y-3">
                <img
                  className="w-7 h-7"
                  src="https://ik.imagekit.io/43tomntsa/svgexport-9(1).svg"
                  alt=""
                />
                <p className="text-[12px]">Mobile</p>
              </div>
              <div className="flex bg-gray-100/60 border border-gray-200 rounded-lg p-4 flex-col items-center justify-center space-y-3">
                <img
                  className="w-7 h-7"
                  src="https://ik.imagekit.io/43tomntsa/svgexport-12(1).svg"
                  alt=""
                />
                <p className="text-[12px]">DTH</p>
              </div>
              <div className="flex bg-gray-100/60 border border-gray-200 rounded-lg p-4 flex-col items-center justify-center space-y-3">
                <img
                  className="w-7 h-7"
                  src="https://ik.imagekit.io/43tomntsa/svgexport-8(1).svg"
                  alt=""
                />
                <p className="text-[12px]">BBPS</p>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="mt-auto px-4 py-4 space-y-2">
            <ButtonComp
              handleClick={() => setStep(3)}
              title={"Click to Start"}
            />
            <p className="text-[9px] tracking-wide text-center">
              By Continuing, I accept the term of service and privacy policy.
            </p>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="">
          <div className="fixed top-0 w-full ">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(2)} />
          </div>
          <div className="px-4 pt-4 mt-16 space-y-1.5">
            <h3 className="text-2xl tracking-wider font-black">
              Almost There!
            </h3>
            <p className="tracking-wide">
              Login or Create an account to start using
            </p>
            <h3 className="text-lg uppercase font-semibold">{BRAND_NAME}</h3>
          </div>
          <div className="px-4 my-6">
            <div className="flex  items-center border border-gray-400 rounded-xl px-3 py-4 ">
              <span className="text-lg font-bold text-black mr-2">+91</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                maxLength={10}
                pattern="^[6-9]\d{9}$"
                placeholder="Enter Phone Number"
                className="flex-1 outline-none placeholder-gray-500 text-lg font-black"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Non-numeric hata dega
                }}
              />
            </div>
          </div>
          <div className="fixed bottom-4 space-y-2 left-0 w-full px-2">
            <ButtonComp handleClick={handleLogin} title={"Get OTP"} />
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="">
          <div className="fixed top-0 w-full ">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>
          <div className="px-4 pt-4 mt-16 space-y-1.5">
            <h3 className="text-2xl tracking-wider font-black">
              OTP Verification
            </h3>
            <p className="tracking-wide">
              Login or Create an account to start using
            </p>
            <h3 className="text-lg uppercase font-semibold">{BRAND_NAME}</h3>
          </div>
          <div className="mt-5  px-4 ">
            <div className="flex justify-center items-center  py-4 ">
              <OtpInput
                containerStyle={{
                  display: "flex",
                  justifyContent: "space-between",
                  justifyItems: "center",
                }}
                inputStyle={{
                  border: "1px solid gray",
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  margin: 2,
                }}
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <p className="text-right text-sm font-semibold tracking-wider">
              Resend
            </p>
          </div>
          <div className="fixed bottom-4 space-y-2 left-0 w-full px-2">
            <ButtonComp handleClick={handleOTPVerify} title={"Verify"} />
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="">
          <div className="fixed top-0 w-full ">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>
          <div className="px-4 pt-4 mt-16 space-y-1.5">
            <h3 className="text-2xl tracking-wider font-black">
              Personal Details
            </h3>
            <p className="tracking-wide">
              Login or Create an account to start using
            </p>
            <h3 className="text-lg uppercase font-semibold">{BRAND_NAME}</h3>
          </div>
          <div className="mt-5 space-y-3 px-4 ">
            <div className="flex items-center border-gray-400 border rounded-lg px-3 py-4">
              <FaUser className="text-gray-500 mr-2" />
              <input
                value={formVal.firstName}
                name="firstName"
                onChange={handleChange}
                type="text"
                placeholder="First Name"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Last Name */}
            <div className="flex items-center border-gray-400 border rounded-lg px-3 py-4">
              <FaUser className="text-gray-500 mr-2" />
              <input
                value={formVal.lastName}
                name="lastName"
                onChange={handleChange}
                type="text"
                placeholder="Last Name"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border-gray-400 border rounded-lg px-3 py-4">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                value={formVal.email}
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="flex-1 outline-none text-gray-700"
              />
            </div>

            {/* Referral Code */}
            <div className="flex items-center border-gray-400 border rounded-lg px-3 py-4">
              <FaLink className="text-gray-500 mr-2" />
              <input
                value={formVal.referalId}
                name="referalId"
                onChange={handleChange}
                type="text"
                placeholder="Referral Code (Optional)"
                className="flex-1 outline-none text-gray-700"
              />
            </div>
          </div>
          <div className="fixed bottom-4 space-y-2 left-0 w-full px-2">
            <ButtonComp handleClick={handleSubmit} title={"Proceed"} />
          </div>
        </div>
      )}
      {newRegisterLoader && <Loader />}
    </div>
  );
};

export default AuthScreen;

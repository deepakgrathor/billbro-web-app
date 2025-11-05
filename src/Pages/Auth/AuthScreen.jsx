import React, { useContext, useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "../../Utils/Constant";
import ButtonComp from "../../Components/ButtonComp";
import CommonHeader from "../../Components/CommonHeader";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  newUserRegister,
  removeOTPField,
  setOTPVerification,
} from "../../Redux/Slices/AuthSlice/LoginSlice";
import ToastComp from "../../Components/ToastComp";
import Loader from "../../Components/Loader";
import { useNavigate } from "react-router-dom";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import { FaUser, FaEnvelope, FaLink } from "react-icons/fa";
import { AuthContext } from "../../Navigation/AuthContext";
import { openExternalURL } from "../../Utils/CommonFunc";
const AuthScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(2);
  const inputRef = useRef(null);
  const [tokenLoad, setTokenLoad] = useState(false);
  const [otp, setOtp] = useState("");
  const [devToken, setDevToken] = useState();
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
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
  useEffect(() => {
    // Reset timer when step changes to 4 (OTP screen)
    if (step === 4) {
      setTimer(30);
      setCanResend(false);
    }
  }, [step]);
  useEffect(() => {
    if (step === 4 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, timer]);
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
  const handleResendOTP = async () => {
    if (timer === 0) {
      const res = await dispatch(newUserRegister({ phone: phone }));
      if (res.payload.ResponseStatus === 3) {
        ToastComp({
          message: "OTP Send on your Mobile Number",
          type: "success",
        });

        setTimer(60);
        dispatch(setOTPVerification(""));
      }
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
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Intro Section - Compact */}
          <div className="p-4 pt-8 space-y-2 animate-fadeIn flex-shrink-0">
            <p className="text-center text-xs font-medium tracking-wider text-gray-600 animate-slideDown">
              Introducing
            </p>
            <div className="relative">
              <h1 className="uppercase font-black tracking-widest text-3xl text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-slideUp">
                {BRAND_NAME}
              </h1>
              <div className="h-1 w-24 mx-auto mt-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-expandWidth"></div>
            </div>
          </div>

          {/* Banner Image - Compact */}
          <div className="w-full px-6 py-3 animate-float flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-2xl rounded-2xl"></div>
              <img
                className="w-full h-auto rounded-2xl shadow-xl relative z-10 transform hover:scale-105 transition-transform duration-500"
                src="https://ik.imagekit.io/43tomntsa/Generated%20Image%20September%2018,%202025%20-%2011_50PM.png"
                alt="Banner"
              />
            </div>
          </div>

          {/* Tagline - Compact */}
          <div className="px-6 space-y-3 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md border border-gray-100">
              <p className="text-center tracking-wide text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Pay Smarter, Save Bigger, Earn Rewards 💰
              </p>
            </div>

            {/* Features Grid - Compact */}
            <div className="grid grid-cols-3 gap-3">
              {/* Mobile Card */}
              <div className="group relative bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <img
                      className="w-6 h-6 filter brightness-0 invert"
                      src="https://ik.imagekit.io/43tomntsa/svgexport-9(1).svg"
                      alt="Mobile"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">Mobile</p>
                </div>
              </div>

              {/* DTH Card */}
              <div className="group relative bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <img
                      className="w-6 h-6 filter brightness-0 invert"
                      src="https://ik.imagekit.io/43tomntsa/svgexport-12(1).svg"
                      alt="DTH"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">DTH</p>
                </div>
              </div>

              {/* BBPS Card */}
              <div className="group relative bg-white rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <img
                      className="w-6 h-6 filter brightness-0 invert"
                      src="https://ik.imagekit.io/43tomntsa/svgexport-8(1).svg"
                      alt="BBPS"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">BBPS</p>
                </div>
              </div>
            </div>

            {/* Key Benefits Pills - Compact */}
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center space-x-1">
                <span>✓</span>
                <span>Instant Recharge</span>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center space-x-1">
                <span>✓</span>
                <span>Cashback Rewards</span>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] font-semibold rounded-full shadow-sm flex items-center space-x-1">
                <span>✓</span>
                <span>100% Secure</span>
              </div>
            </div>
          </div>

          {/* Spacer - Pushes button to bottom */}
          <div className="flex-grow"></div>

          {/* Bottom Button Section - Fixed at bottom */}
          <div className="px-6 pb-6 space-y-2 flex-shrink-0">
            {/* Get Started Button */}
            <button
              onClick={() => setStep(3)}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span className="text-base">Get Started</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Terms & Conditions - Compact */}
            <p className="text-[9px] tracking-wide text-center text-gray-500 leading-relaxed">
              By continuing, I accept the{" "}
              <span
                onClick={() =>
                  openExternalURL("http://billbro.in/terms-conditions")
                }
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                onClick={() =>
                  openExternalURL("http://billbro.in/privacy-policy")
                }
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Privacy Policy
              </span>
            </p>

            {/* Trust Indicators - Compact */}
            <div className="flex items-center justify-center space-x-3 text-[10px] text-gray-600">
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg
                  className="w-3 h-3 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Trusted</span>
              </div>
            </div>
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideDown {
              from {
                transform: translateY(-20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            @keyframes expandWidth {
              from {
                width: 0;
              }
              to {
                width: 6rem;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.8s ease-out;
            }
            .animate-slideDown {
              animation: slideDown 0.6s ease-out;
            }
            .animate-slideUp {
              animation: slideUp 0.6s ease-out 0.2s both;
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            .animate-expandWidth {
              animation: expandWidth 0.8s ease-out 0.4s both;
            }
          `}</style>
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md shadow-sm">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(2)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-20 pb-32">
            {/* Welcome Section with Animation */}
            <div className="space-y-3 animate-fadeIn">
              {/* Icon/Logo Circle */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl tracking-wide font-black text-center bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent animate-slideUp">
                Almost There!
              </h3>

              {/* Subtitle */}
              <p className="text-center text-sm text-gray-600 leading-relaxed px-4 animate-slideUp animation-delay-100">
                Login or Create an account to start using
              </p>

              {/* Brand Name Badge */}
              <div className="flex justify-center animate-slideUp animation-delay-200">
                <div className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <h3 className="text-base uppercase font-bold text-white tracking-wider">
                    {BRAND_NAME}
                  </h3>
                </div>
              </div>
            </div>

            {/* Phone Input Section */}
            <div className="mt-8 space-y-4 animate-slideUp animation-delay-300">
              {/* Input Label */}
              <div className="px-2">
                {/* <p className="text-xs font-semibold text-gray-700 mb-2">
                  📱 Mobile Number
                </p> */}
              </div>

              {/* Phone Input Card */}
              <div className="relative group">
                {/* Gradient Border Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>

                {/* Input Container */}
                <div className="relative bg-white border-2 border-gray-300 group-hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-5 shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    {/* Country Code */}
                    <div className="flex items-center space-x-2 pr-3 border-r-2 border-gray-300">
                      {/* <span className="text-2xl">IN</span> */}
                      <span className="text-xl font-bold text-gray-800">
                        +91
                      </span>
                    </div>

                    {/* Phone Input */}
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      maxLength={10}
                      pattern="^[6-9]\d{9}$"
                      placeholder="Enter Phone Number"
                      className="flex-1 outline-none placeholder-gray-400 text-lg font-semibold text-gray-900"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                    />

                    {/* Check Icon (when 10 digits entered) */}
                    {phone.length === 10 && (
                      <svg
                        className="w-6 h-6 text-green-500 animate-scaleIn"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Helper Text */}
              <div className="px-2">
                <p className="text-xs text-gray-500 flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>We'll send you a verification code</span>
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-gray-600 animate-fadeIn animation-delay-400">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Secure</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Instant</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Trusted</span>
              </div>
            </div>
          </div>

          {/* Bottom Button Section */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 space-y-3 shadow-lg z-10">
            {/* Get OTP Button */}
            <button
              onClick={handleLogin}
              disabled={phone.length !== 10}
              className={`w-full font-bold py-4 px-6 rounded-xl shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 group ${
                phone.length === 10
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="text-base">Get OTP</span>
              {phone.length === 10 && (
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
            .animate-slideUp {
              animation: slideUp 0.6s ease-out;
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s ease-out;
            }
            .animation-delay-100 {
              animation-delay: 0.1s;
              animation-fill-mode: both;
            }
            .animation-delay-200 {
              animation-delay: 0.2s;
              animation-fill-mode: both;
            }
            .animation-delay-300 {
              animation-delay: 0.3s;
              animation-fill-mode: both;
            }
            .animation-delay-400 {
              animation-delay: 0.4s;
              animation-fill-mode: both;
            }
          `}</style>
        </div>
      )}
      {step === 4 && (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md shadow-sm">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-20 pb-32">
            {/* Icon Section */}
            <div className="flex justify-center mb-6 animate-fadeIn">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="space-y-3 mb-8 animate-slideUp">
              <h3 className="text-3xl tracking-wide font-black text-center bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                OTP Verification
              </h3>

              <p className="text-center text-sm text-gray-600 leading-relaxed px-4">
                We've sent a verification code to
              </p>

              {/* Phone Number Display */}
              <div className="flex justify-center">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-md">
                  <p className="text-white font-bold text-sm">+91 {phone}</p>
                </div>
              </div>
            </div>

            {/* OTP Input Section */}
            <div className="space-y-6 animate-slideUp animation-delay-200">
              {/* OTP Input */}
              <div className="flex justify-center">
                <OtpInput
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                  inputStyle={{
                    width: "48px",
                    height: "56px",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  focusStyle={{
                    border: "2px solid #3b82f6",
                    outline: "none",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  }}
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>

              {/* Timer & Resend Section */}
              <div className="flex items-center justify-between px-4">
                {/* Timer (Optional - add state for this) */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{formatTimer(timer)}</span>
                </div>

                {/* Resend Button */}
                <button
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className={`text-sm font-bold flex items-center space-x-1 group transition-all duration-300 ${
                    canResend
                      ? "text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>
                    {canResend ? "Resend OTP" : "Resend in " + timer + "s"}
                  </span>
                  {canResend && (
                    <svg
                      className="w-4 h-4 text-blue-600 group-hover:rotate-180 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Helper Text */}
              {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mx-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-blue-900 font-medium">
                      Didn't receive the code?
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Check your messages or request a new code after the timer
                      ends
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Progress Indicator */}
              {otp.length > 0 && (
                <div className="px-4 animate-scaleIn">
                  <div className="flex items-center justify-center space-x-2 text-xs font-medium text-gray-600">
                    <span>{otp.length}/6 digits entered</span>
                    {otp.length === 6 && (
                      <svg
                        className="w-4 h-4 text-green-500 animate-bounce"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-gray-600 animate-fadeIn animation-delay-300">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Encrypted</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">SMS Secure</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Instant</span>
              </div>
            </div>
          </div>

          {/* Bottom Button Section */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 space-y-3 shadow-lg z-10">
            {/* Verify Button */}
            <button
              onClick={handleOTPVerify}
              disabled={otp.length !== 6}
              className={`w-full font-bold py-4 px-6 rounded-xl shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 group ${
                otp.length === 6
                  ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="text-base">Verify & Continue</span>
              {otp.length === 6 && (
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>

            {/* Change Number Option */}
            <button
              onClick={() => setStep(3)}
              className="w-full text-sm font-semibold text-gray-600 hover:text-gray-900 py-2 transition-colors duration-200"
            >
              Wrong number? Change it
            </button>
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
            .animate-slideUp {
              animation: slideUp 0.6s ease-out;
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s ease-out;
            }
            .animation-delay-200 {
              animation-delay: 0.2s;
              animation-fill-mode: both;
            }
            .animation-delay-300 {
              animation-delay: 0.3s;
              animation-fill-mode: both;
            }
          `}</style>
        </div>
      )}
      {step === 5 && (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-10"></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-10 bg-white/80 backdrop-blur-md shadow-sm">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto pt-20 pb-32 px-6">
            {/* Welcome Section */}
            <div className="mb-6 animate-fadeIn">
              {/* Profile Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl tracking-wide font-black text-center bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent animate-slideUp">
                Personal Details
              </h3>

              {/* Subtitle */}
              <p className="text-center text-sm text-gray-600 leading-relaxed px-4 mt-2 animate-slideUp animation-delay-100">
                Complete your profile to start using
              </p>

              {/* Brand Badge */}
              <div className="flex justify-center mt-3 animate-slideUp animation-delay-200">
                <div className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <h3 className="text-sm uppercase font-bold text-white tracking-wider">
                    {BRAND_NAME}
                  </h3>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="space-y-4 animate-slideUp animation-delay-300">
              {/* First Name */}
              <div className="space-y-2">
                {/* <label className="text-xs font-semibold text-gray-700 ml-1">
                  First Name *
                </label> */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative flex items-center bg-white border-2 border-gray-300 group-hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-4 shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl mr-3">
                      <FaUser className="text-blue-600 text-lg" />
                    </div>
                    <input
                      value={formVal.firstName}
                      name="firstName"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter First Name"
                      className="flex-1 outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                    {formVal.firstName && (
                      <svg
                        className="w-5 h-5 text-green-500 animate-scaleIn"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative flex items-center bg-white border-2 border-gray-300 group-hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-4 shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl mr-3">
                      <FaUser className="text-purple-600 text-lg" />
                    </div>
                    <input
                      value={formVal.lastName}
                      name="lastName"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter Last Name"
                      className="flex-1 outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                    {formVal.lastName && (
                      <svg
                        className="w-5 h-5 text-green-500 animate-scaleIn"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative flex items-center bg-white border-2 border-gray-300 group-hover:border-blue-400 focus-within:border-blue-500 rounded-2xl px-5 py-4 shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl mr-3">
                      <FaEnvelope className="text-green-600 text-lg" />
                    </div>
                    <input
                      value={formVal.email}
                      name="email"
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter Email Address"
                      className="flex-1 outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                    {formVal.email && (
                      <svg
                        className="w-5 h-5 text-green-500 animate-scaleIn"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                  <div className="relative flex items-center bg-white border-2 border-gray-300 group-hover:border-amber-400 focus-within:border-amber-500 rounded-2xl px-5 py-4 shadow-md transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-xl mr-3">
                      <FaLink className="text-amber-600 text-lg" />
                    </div>
                    <input
                      value={formVal.referalId}
                      name="referalId"
                      onChange={handleChange}
                      type="text"
                      placeholder="Have a referral code?"
                      className="flex-1 outline-none text-gray-900 font-medium placeholder-gray-400"
                    />
                    {formVal.referalId && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          Applied
                        </span>
                        <svg
                          className="w-5 h-5 text-green-500 animate-scaleIn"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {formVal.referalId && (
                  <div className="ml-1 flex items-center space-x-1 text-xs text-green-600 animate-fadeIn">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>You'll earn ₹15 rewards on first recharge!</span>
                  </div>
                )}
              </div>

              {/* Info Card */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Why do we need this?
                    </p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Your details help us provide better service and send
                      transaction receipts to your email.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-600">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Secure</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Private</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-medium">Verified</span>
              </div>
            </div>
          </div>

          {/* Bottom Button Section */}
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 space-y-3 shadow-lg z-10">
            {/* Proceed Button */}
            <button
              onClick={handleSubmit}
              disabled={
                !formVal.firstName || !formVal.lastName || !formVal.email
              }
              className={`w-full font-bold py-4 px-6 rounded-xl shadow-xl transform transition-all duration-300 flex items-center justify-center space-x-2 group ${
                formVal.firstName && formVal.lastName && formVal.email
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <span className="text-base">Complete Profile</span>
              {formVal.firstName && formVal.lastName && formVal.email && (
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </button>

            {/* Terms Text */}
            {/* <p className="text-[10px] text-center text-gray-500 leading-relaxed px-4">
              By proceeding, you agree to our{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p> */}
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes scaleIn {
              from {
                transform: scale(0);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out;
            }
            .animate-slideUp {
              animation: slideUp 0.6s ease-out;
            }
            .animate-scaleIn {
              animation: scaleIn 0.3s ease-out;
            }
            .animation-delay-100 {
              animation-delay: 0.1s;
              animation-fill-mode: both;
            }
            .animation-delay-200 {
              animation-delay: 0.2s;
              animation-fill-mode: both;
            }
            .animation-delay-300 {
              animation-delay: 0.3s;
              animation-fill-mode: both;
            }
          `}</style>
        </div>
      )}
      {newRegisterLoader && <Loader />}
    </div>
  );
};

export default AuthScreen;

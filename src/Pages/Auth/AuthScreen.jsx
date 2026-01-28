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
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogin = async () => {
    const isValidPhone = /^[6-9]\d{9}$/.test(phone);
    if (!isValidPhone) return;

    try {
      const res = await dispatch(newUserRegister({ phone }));
      if (res.payload.ResponseStatus === 3) {
        setStep(4);
      }
    } catch (error) {
      console.error(error);
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
        const ResObj = serviceRes.payload?.Data.find((a) => a.name === "SIGNUP");
        if (ResObj?.status) {
          setStep(5);
        } else {
          ToastComp({ message: "Registration Currently Closed", type: "info" });
        }
      } else {
        ToastComp({ message: "Something Went Wrong", type: "error" });
      }
    } else if (status === 0) {
      ToastComp({ message: "Invalid OTP", type: "error" });
    } else {
      ToastComp({ message: "Unexpected Response", type: "error" });
    }
  };

  const handleSubmit = async () => {
    formVal.firstName = formVal.firstName.replace(/\s+/g, "");
    formVal.lastName = formVal.lastName.replace(/\s+/g, "");
    formVal.email = formVal.email.trim();

    const res = await dispatch(
      newUserRegister({ formVal, phone, otp, ResponseStatus })
    );
    if (res.payload.ResponseStatus === 1) {
      localStorage.setItem("token", res.payload?.AccessToken);
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  const handleResendOTP = async () => {
    if (timer === 0) {
      const res = await dispatch(newUserRegister({ phone: phone }));
      if (res.payload.ResponseStatus === 3) {
        ToastComp({ message: "OTP Send on your Mobile Number", type: "success" });
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

  // Common Styles
  const commonStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes expandWidth {
      from { width: 0; opacity: 0; }
      to { width: 6rem; opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes gradient-x {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-slideDown {
      animation: slideDown 0.6s ease-out;
    }
    .animate-slideUp {
      animation: slideUp 0.7s ease-out forwards;
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    .animate-expandWidth {
      animation: expandWidth 0.8s ease-out 0.5s both;
    }
    .animate-scaleIn {
      animation: scaleIn 0.3s ease-out forwards;
    }
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 3s ease infinite;
    }
    .animation-delay-100 { animation-delay: 0.1s; animation-fill-mode: both; }
    .animation-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
    .animation-delay-300 { animation-delay: 0.3s; animation-fill-mode: both; }
    .animation-delay-400 { animation-delay: 0.4s; animation-fill-mode: both; }
  `;

  return (
    <div>
      {/* ========== STEP 2 - Welcome Screen ========== */}
      {step === 2 && (
        <div className="flex flex-col min-h-screen bg-slate-950 relative overflow-x-hidden">
          {/* Animated Gradient Orbs */}
          <div className="fixed top-[-10%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-violet-600/40 via-fuchsia-500/30 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="fixed bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
          <div className="fixed top-[40%] left-[30%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>
          
          {/* Grid Pattern Overlay */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          {/* Scrollable Content */}
          <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 overflow-y-auto">
            
            {/* Header Section */}
            <div className="pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-4 sm:pb-6 text-center animate-fadeIn flex-shrink-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.3em] text-violet-300/80 uppercase mb-2 sm:mb-3 animate-slideDown">
                ✨ Introducing
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight animate-slideUp">
                <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-2xl">
                  {BRAND_NAME}
                </span>
              </h1>
              <div className="flex justify-center mt-3 sm:mt-4">
                <div className="h-1 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 rounded-full animate-expandWidth"></div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto py-4 sm:py-6 md:py-8 animate-float flex-shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-white/10">
                  <img
                    className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700"
                    src="https://ik.imagekit.io/43tomntsa/Generated%20Image%20September%2018,%202025%20-%2011_50PM.png"
                    alt="Banner"
                  />
                </div>
              </div>
            </div>

            {/* Tagline Card */}
            <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto w-full mb-4 sm:mb-6 animate-fadeIn flex-shrink-0" style={{animationDelay: '0.3s'}}>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-fuchsia-500/50 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                  <p className="text-center text-sm sm:text-base md:text-lg font-semibold text-white/90 tracking-wide">
                    Pay Smarter, Save Bigger, Earn Rewards 
                    <span className="ml-2 inline-block animate-bounce">💰</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto w-full mb-4 sm:mb-6 flex-shrink-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {/* Mobile Card */}
                <div className="group relative animate-fadeIn" style={{animationDelay: '0.4s'}}>
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 filter brightness-0 invert" src="https://ik.imagekit.io/43tomntsa/svgexport-9(1).svg" alt="Mobile" />
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-white/90">Mobile</p>
                    </div>
                  </div>
                </div>

                {/* DTH Card */}
                <div className="group relative animate-fadeIn" style={{animationDelay: '0.5s'}}>
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/10 hover:border-violet-400/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 filter brightness-0 invert" src="https://ik.imagekit.io/43tomntsa/svgexport-12(1).svg" alt="DTH" />
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-white/90">DTH</p>
                    </div>
                  </div>
                </div>

                {/* BBPS Card */}
                <div className="group relative animate-fadeIn" style={{animationDelay: '0.6s'}}>
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-white/10 hover:border-fuchsia-400/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <img className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 filter brightness-0 invert" src="https://ik.imagekit.io/43tomntsa/svgexport-8(1).svg" alt="BBPS" />
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-semibold text-white/90">BBPS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Pills */}
           

            {/* Spacer */}
            {/* <div className="flex-grow"></div> */}

            {/* Bottom CTA Section */}
            <div className="pb-6 sm:pb-8 md:pb-10 space-y-3 sm:space-y-4 max-w-md sm:max-w-lg mx-auto w-full flex-shrink-0">
              {/* CTA Button */}
              <button
                onClick={() => setStep(3)}
                className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-[2px] animate-fadeIn"
                style={{animationDelay: '0.8s'}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 animate-gradient-x"></div>
                <div className="relative bg-slate-950 hover:bg-transparent rounded-[10px] sm:rounded-[14px] px-6 py-3.5 sm:py-4 md:py-5 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
                    Get Started
                  </span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>

              {/* Terms */}
              <p className="text-[9px] sm:text-[10px] md:text-xs tracking-wide text-center text-white/40 leading-relaxed animate-fadeIn" style={{animationDelay: '0.9s'}}>
                By continuing, I accept the{" "}
                <span onClick={() => openExternalURL("http://billbro.in/terms-conditions")} className="text-violet-400 font-semibold cursor-pointer hover:text-violet-300 transition-colors">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span onClick={() => openExternalURL("http://billbro.in/privacy-policy")} className="text-violet-400 font-semibold cursor-pointer hover:text-violet-300 transition-colors">
                  Privacy Policy
                </span>
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-[10px] sm:text-xs text-white/50 animate-fadeIn" style={{animationDelay: '1s'}}>
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Verified</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </div>
                  <span>Trusted</span>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{commonStyles}</style>
        </div>
      )}

      {/* ========== STEP 3 - Phone Input Screen ========== */}
      {step === 3 && (
        <div className="flex flex-col min-h-screen bg-slate-950 relative overflow-x-hidden">
          {/* Animated Gradient Orbs */}
          <div className="fixed top-[-10%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-violet-600/40 via-fuchsia-500/30 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="fixed bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
          <div className="fixed top-[50%] left-[20%] w-[25vw] h-[25vw] max-w-[250px] max-h-[250px] bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '2s'}}></div>

          {/* Grid Pattern */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(2)} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 pb-28 sm:pb-32 overflow-y-auto">
            <div className="max-w-md sm:max-w-lg mx-auto w-full">
              
              {/* Welcome Section */}
              <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                {/* Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-wide font-black text-center animate-slideUp">
                  <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                    Almost There!
                  </span>
                </h3>

                {/* Subtitle */}
                <p className="text-center text-xs sm:text-sm md:text-base text-white/60 leading-relaxed px-4 animate-slideUp animation-delay-100">
                  Login or Create an account to start using
                </p>

                {/* Brand Badge */}
                <div className="flex justify-center animate-slideUp animation-delay-200">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-slate-950 rounded-full border border-white/10">
                      <h3 className="text-sm sm:text-base md:text-lg uppercase font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-wider">
                        {BRAND_NAME}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Input */}
              <div className="mt-6 sm:mt-8 md:mt-10 space-y-3 sm:space-y-4 animate-slideUp animation-delay-300">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-50 focus-within:opacity-75 blur transition-all duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-violet-400/30 focus-within:border-violet-400/50 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-4 sm:py-5 transition-all duration-300">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex items-center space-x-2 pr-3 sm:pr-4 border-r border-white/20">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                          +91
                        </span>
                      </div>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        maxLength={10}
                        placeholder="Enter Phone Number"
                        className="flex-1 bg-transparent outline-none placeholder-white/30 text-base sm:text-lg md:text-xl font-semibold text-white tracking-wide"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                      />
                      {phone.length === 10 && (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-500 rounded-full flex items-center justify-center animate-scaleIn shadow-lg shadow-emerald-500/30">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Helper */}
                <div className="px-2">
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/40 flex items-center space-x-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>We'll send you a verification code</span>
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center space-x-6 sm:space-x-8 md:space-x-10 animate-fadeIn animation-delay-400">
                <div className="flex flex-col items-center space-y-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center group-hover:border-emerald-400/40 transition-all">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Secure</span>
                </div>

                <div className="flex flex-col items-center space-y-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center group-hover:border-blue-400/40 transition-all">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Instant</span>
                </div>

                <div className="flex flex-col items-center space-y-2 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center group-hover:border-violet-400/40 transition-all">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Trusted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-4 sm:p-5 md:p-6">
            <div className="max-w-md sm:max-w-lg mx-auto">
              <button
                onClick={handleLogin}
                disabled={phone.length !== 10}
                className={`group relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-[2px] transition-all duration-300 ${
                  phone.length === 10 ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`absolute inset-0 ${phone.length === 10 ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 animate-gradient-x' : 'bg-white/20'}`}></div>
                <div className={`relative rounded-[10px] sm:rounded-[14px] px-6 py-3.5 sm:py-4 md:py-5 flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-300 ${
                  phone.length === 10 ? 'bg-slate-950 group-hover:bg-transparent' : 'bg-slate-900'
                }`}>
                  <span className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 ${
                    phone.length === 10 ? 'bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:text-white' : 'text-white/40'
                  }`}>
                    Get OTP
                  </span>
                  {phone.length === 10 && (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          <style jsx>{commonStyles}</style>
        </div>
      )}

      {/* ========== STEP 4 - OTP Verification Screen ========== */}
      {step === 4 && (
        <div className="flex flex-col min-h-screen bg-slate-950 relative overflow-x-hidden">
          {/* Background Orbs */}
          <div className="fixed top-[-10%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-emerald-600/40 via-teal-500/30 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="fixed bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>

          {/* Grid Pattern */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 pb-36 sm:pb-40 overflow-y-auto">
            <div className="max-w-md sm:max-w-lg mx-auto w-full">
              
              {/* Icon */}
              <div className="flex justify-center mb-6 animate-fadeIn">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3 mb-8 animate-slideUp">
                <h3 className="text-2xl sm:text-3xl md:text-4xl tracking-wide font-black text-center">
                  <span className="bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                    OTP Verification
                  </span>
                </h3>
                <p className="text-center text-xs sm:text-sm md:text-base text-white/60 leading-relaxed px-4">
                  We've sent a verification code to
                </p>
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-50"></div>
                    <div className="relative px-4 sm:px-5 py-2 bg-slate-950 rounded-full border border-white/10">
                      <p className="text-white font-bold text-sm sm:text-base">+91 {phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* OTP Input */}
              <div className="space-y-6 animate-slideUp animation-delay-200">
                <div className="flex justify-center">
                  <OtpInput
                    containerStyle={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                    inputStyle={{
                      width: "44px",
                      height: "52px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      border: "2px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                    }}
                    focusStyle={{
                      border: "2px solid #10b981",
                      outline: "none",
                      boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.2)",
                    }}
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span></span>}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>

                {/* Timer & Resend */}
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{formatTimer(timer)}</span>
                  </div>
                  <button
                    onClick={handleResendOTP}
                    disabled={!canResend}
                    className={`text-sm font-bold flex items-center space-x-1 group transition-all duration-300 ${
                      canResend ? "text-emerald-400 hover:text-emerald-300 cursor-pointer" : "text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <span>{canResend ? "Resend OTP" : `Resend in ${timer}s`}</span>
                    {canResend && (
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Progress */}
                {otp.length > 0 && (
                  <div className="px-4 animate-scaleIn">
                    <div className="flex items-center justify-center space-x-2 text-xs font-medium text-white/50">
                      <span>{otp.length}/6 digits entered</span>
                      {otp.length === 6 && (
                        <svg className="w-4 h-4 text-emerald-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex items-center justify-center space-x-6 sm:space-x-8 animate-fadeIn animation-delay-300">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Encrypted</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">SMS Secure</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-4 sm:p-5 space-y-3">
            <div className="max-w-md sm:max-w-lg mx-auto">
              <button
                onClick={handleOTPVerify}
                disabled={otp.length !== 6}
                className={`group relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-[2px] transition-all duration-300 ${
                  otp.length === 6 ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`absolute inset-0 ${otp.length === 6 ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 animate-gradient-x' : 'bg-white/20'}`}></div>
                <div className={`relative rounded-[10px] sm:rounded-[14px] px-6 py-3.5 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-300 ${
                  otp.length === 6 ? 'bg-slate-950 group-hover:bg-transparent' : 'bg-slate-900'
                }`}>
                  <span className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                    otp.length === 6 ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent group-hover:text-white' : 'text-white/40'
                  }`}>
                    Verify & Continue
                  </span>
                  {otp.length === 6 && (
                    <svg className="w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full text-sm font-semibold text-white/40 hover:text-white/70 py-2 transition-colors duration-200"
              >
                Wrong number? Change it
              </button>
            </div>
          </div>

          <style jsx>{commonStyles}</style>
        </div>
      )}

      {/* ========== STEP 5 - Profile Form Screen ========== */}
      {step === 5 && (
        <div className="flex flex-col min-h-screen bg-slate-950 relative overflow-x-hidden">
          {/* Background Orbs */}
          <div className="fixed top-[-10%] right-[-15%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-violet-600/40 via-fuchsia-500/30 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none"></div>
          <div className="fixed bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>

          {/* Grid Pattern */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>

          {/* Header */}
          <div className="fixed top-0 w-full z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
            <CommonHeader title={BRAND_NAME} handleclick={() => setStep(3)} />
          </div>

          {/* Scrollable Content */}
          <div className="relative z-10 flex-1 overflow-y-auto pt-20 sm:pt-24 pb-28 sm:pb-32 px-4 sm:px-6 md:px-8">
            <div className="max-w-md sm:max-w-lg mx-auto w-full">
              
              {/* Welcome Section */}
              <div className="mb-6 animate-fadeIn">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-2xl shadow-violet-500/30">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl tracking-wide font-black text-center animate-slideUp">
                  <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                    Personal Details
                  </span>
                </h3>
                <p className="text-center text-xs sm:text-sm text-white/60 leading-relaxed px-4 mt-2 animate-slideUp animation-delay-100">
                  Complete your profile to start using
                </p>

                {/* Brand Badge */}
                <div className="flex justify-center mt-3 animate-slideUp animation-delay-200">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 rounded-full blur opacity-50"></div>
                    <div className="relative px-5 sm:px-6 py-2 bg-slate-950 rounded-full border border-white/10">
                      <h3 className="text-sm uppercase font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent tracking-wider">
                        {BRAND_NAME}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-4 animate-slideUp animation-delay-300">
                {/* First Name */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-50 focus-within:opacity-75 blur transition-all duration-300"></div>
                  <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-cyan-400/30 focus-within:border-cyan-400/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-cyan-500/20 rounded-xl mr-3">
                      <FaUser className="text-cyan-400 text-lg" />
                    </div>
                    <input
                      value={formVal.firstName}
                      name="firstName"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter First Name"
                      className="flex-1 bg-transparent outline-none text-white font-medium placeholder-white/30"
                    />
                    {formVal.firstName && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-scaleIn">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-50 focus-within:opacity-75 blur transition-all duration-300"></div>
                  <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-violet-400/30 focus-within:border-violet-400/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-violet-500/20 rounded-xl mr-3">
                      <FaUser className="text-violet-400 text-lg" />
                    </div>
                    <input
                      value={formVal.lastName}
                      name="lastName"
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter Last Name"
                      className="flex-1 bg-transparent outline-none text-white font-medium placeholder-white/30"
                    />
                    {formVal.lastName && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-scaleIn">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-50 focus-within:opacity-75 blur transition-all duration-300"></div>
                  <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-emerald-400/30 focus-within:border-emerald-400/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-xl mr-3">
                      <FaEnvelope className="text-emerald-400 text-lg" />
                    </div>
                    <input
                      value={formVal.email}
                      name="email"
                      onChange={handleChange}
                      type="email"
                      placeholder="Enter Email Address"
                      className="flex-1 bg-transparent outline-none text-white font-medium placeholder-white/30"
                    />
                    {formVal.email && (
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-scaleIn">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Referral Code */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-50 focus-within:opacity-75 blur transition-all duration-300"></div>
                  <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 group-hover:border-amber-400/30 focus-within:border-amber-400/50 rounded-xl sm:rounded-2xl px-4 py-3.5 sm:py-4 transition-all duration-300">
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-500/20 rounded-xl mr-3">
                      <FaLink className="text-amber-400 text-lg" />
                    </div>
                    <input
                      value={formVal.referalId}
                      name="referalId"
                      onChange={handleChange}
                      type="text"
                      placeholder="Have a referral code?"
                      className="flex-1 bg-transparent outline-none text-white font-medium placeholder-white/30"
                    />
                    {formVal.referalId && (
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                          Applied
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {formVal.referalId && (
                  <div className="ml-1 flex items-center space-x-1 text-xs text-emerald-400 animate-fadeIn">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>You'll earn ₹15 rewards on first recharge!</span>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex items-center justify-center space-x-6 sm:space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Secure</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Private</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-violet-500/10 border border-violet-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-white/50">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 p-4 sm:p-5">
            <div className="max-w-md sm:max-w-lg mx-auto">
              <button
                onClick={handleSubmit}
                disabled={!formVal.firstName || !formVal.lastName || !formVal.email}
                className={`group relative w-full overflow-hidden rounded-xl sm:rounded-2xl p-[2px] transition-all duration-300 ${
                  formVal.firstName && formVal.lastName && formVal.email ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`absolute inset-0 ${
                  formVal.firstName && formVal.lastName && formVal.email ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 animate-gradient-x' : 'bg-white/20'
                }`}></div>
                <div className={`relative rounded-[10px] sm:rounded-[14px] px-6 py-3.5 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3 transition-all duration-300 ${
                  formVal.firstName && formVal.lastName && formVal.email ? 'bg-slate-950 group-hover:bg-transparent' : 'bg-slate-900'
                }`}>
                  <span className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                    formVal.firstName && formVal.lastName && formVal.email ? 'bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:text-white' : 'text-white/40'
                  }`}>
                    Complete Profile
                  </span>
                  {formVal.firstName && formVal.lastName && formVal.email && (
                    <svg className="w-5 h-5 text-violet-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>

          <style jsx>{commonStyles}</style>
        </div>
      )}

      {newRegisterLoader && <Loader />}
    </div>
  );
};

export default AuthScreen;
import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { MdContacts, MdPhone } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import BannerSlider from "../../Components/BannerSlider";
import { getOperatorandCirclebyPhone } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import Loader from "../../Components/Loader";
import {
  All_Recharge_Circle_List,
  All_Recharge_Operator_List,
} from "../../Utils/MockData";
import ToastComp from "../../Components/ToastComp";
import { MOBILE_RECHARGE, SERVICE } from "../../Utils/Constant";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
import { setRechargeData } from "../../Redux/Slices/ServiceSlice/RechargeSlice";

const MobileHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [conSearch, setConSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);

  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service,
  );

  const { plans, loader } = useSelector(
    (state) => state.RechargeSlice.getPlans,
  );
  const { loaderUniversal, operatorandCircle } = useSelector(
    (state) => state.RechargeSlice,
  );
  const { bannerData } = useSelector((state) => state.PublicSlice.bannerList);

  useEffect(() => {
    if (
      operatorandCircle.ResponseStatus === 1 &&
      operatorandCircle.Data.STATUS == 1
    ) {
      const PLANAPI_OPERATOR_FIND = All_Recharge_Operator_List.find(
        (a) => a.PlanApi_Operator_code == operatorandCircle.Data.OpCode,
      );
      const PLANAPI_CIRCLE_FIND = All_Recharge_Circle_List.find(
        (a) => a.planapi_circlecode == operatorandCircle.Data.CircleCode,
      );
      dispatch(
        setRechargeData({
          ...rechargeData,
          operator: {
            OperatorCode: PLANAPI_OPERATOR_FIND?.PlanApi_Operator_code,
            OperatorName: PLANAPI_OPERATOR_FIND?.Operator_name,
            img: PLANAPI_OPERATOR_FIND?.img,
          },
          circle: {
            circlecode: PLANAPI_CIRCLE_FIND?.planapi_circlecode,
            circlename:
              PLANAPI_CIRCLE_FIND?.circlename == "CHHATTISGARH"
                ? "MP and Chattisgarh"
                : PLANAPI_CIRCLE_FIND?.circlename,
          },
        }),
      );
    }
  }, [operatorandCircle]);

  useEffect(() => {
    dispatch(setRechargeData({ ...rechargeData, plans: "" }));
    if (rechargeData.mobileNumber.length === 10 && /^\d{10}$/.test(rechargeData.mobileNumber)) {
      const timer = setTimeout(() => {
        dispatch(
          getOperatorandCirclebyPhone({ phone: rechargeData.mobileNumber }),
        );
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [rechargeData.mobileNumber]);

  useEffect(() => {
    if (rechargeData.circle) {
      navigate("/plans");
    }
  }, [rechargeData.circle]);

  const isValidNumber =
    rechargeData.mobileNumber.length === 10 &&
    /^\d{10}$/.test(rechargeData.mobileNumber);

  return (
    <div className="min-h-screen bg-theme-base">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-theme-card shadow-theme-card">
        <CommonHeader
          title={"Mobile Recharge"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mb-4 shadow-lg">
            <MdPhone className="text-white text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-theme-primary mb-2">
            Quick Recharge
          </h2>
          <p className="text-theme-secondary text-sm">
            Instant mobile recharge in just a few taps
          </p>
        </div>

        {/* Phone Input Card */}
        <div className="bg-theme-card rounded-3xl shadow-xl p-6 mb-6 transform transition-all duration-300 hover:shadow-2xl">
          <label className="block text-sm font-semibold text-theme-secondary mb-3">
            Mobile Number
          </label>

          <div
            className={`relative flex items-center bg-theme-card-2 border-2 rounded-2xl px-3 py-3 transition-all duration-300 ${
              isFocused
                ? "border-purple-500 bg-purple-50/50 shadow-lg"
                : "border-theme hover:border-theme"
            }`}
          >
            {/* Country Code Badge */}
            <div className="flex items-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-2 rounded-xl mr-3 font-bold text-sm shadow-md">
              +91
            </div>

            {/* Input Field */}
            <input
              value={rechargeData.mobileNumber}
              onChange={(e) => {
                dispatch(
                  setRechargeData({
                    ...rechargeData,
                    mobileNumber: e.target.value,
                  }),
                );
                setConSearch(e.target.value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="tel"
              maxLength={10}
              pattern="^[6-9]\d{9}$"
              placeholder="Enter 10 digit number"
              className="flex-1 font-semibold outline-none placeholder-gray-400 bg-transparent text-theme-primary"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />

            {/* Contact Icon */}
            {/* <MdContacts
              className={`text-2xl transition-colors duration-300 cursor-pointer ${
                isFocused ? "text-purple-500" : "text-gray-400"
              }`}
            /> */}
          </div>

          {/* Validation Indicator */}
          {rechargeData.mobileNumber.length > 0 && (
            <div className="mt-3 flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 transition-all duration-300 ${
                  isValidNumber ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isValidNumber ? "text-green-600" : "text-red-600"
                }`}
              >
                {isValidNumber
                  ? "✓ Valid number"
                  : `${10 - rechargeData.mobileNumber.length} digits remaining`}
              </span>
            </div>
          )}
        </div>

        {/* Operator & Circle Info */}
        {rechargeData.operator && (
          <div className="bg-theme-card rounded-3xl shadow-lg p-5 mb-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {rechargeData.operator.img && (
                  <img
                    src={rechargeData.operator.img}
                    alt={rechargeData.operator.OperatorName}
                    className="w-12 h-12 object-contain rounded-xl bg-theme-card-2 p-2"
                  />
                )}
                <div>
                  <p className="text-sm text-theme-secondary font-medium">Operator</p>
                  <p className="text-base font-bold text-theme-primary">
                    {rechargeData.operator.OperatorName}
                  </p>
                </div>
              </div>
              {rechargeData.circle && (
                <div className="text-right">
                  <p className="text-sm text-theme-secondary font-medium">Circle</p>
                  <p className="text-base font-bold text-theme-primary">
                    {rechargeData.circle.circlename}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Banner Section */}
        {serviceList.Data?.find((a) => a.name == "MOBILE_HOME_BANNER")
          ?.isShow && (
          <div className="mb-6 animate-fade-in">
            <h3 className="text-lg font-bold text-theme-primary mb-3 px-1">
              Special Offers
            </h3>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <BannerSlider style={{ borderRadius: 24 }} />
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-3xl p-5 border border-purple-200">
          <h4 className="font-bold text-theme-primary mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Quick Tips
          </h4>
          <ul className="space-y-2 text-sm text-theme-secondary">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Enter your 10-digit mobile number to continue</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>We'll automatically detect your operator and circle</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Choose from various recharge plans and offers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Loader */}
      {(loaderUniversal || loader) && <Loader />}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MobileHome;

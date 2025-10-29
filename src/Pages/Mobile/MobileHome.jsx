import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { MdContacts } from "react-icons/md";
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
  const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);

  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );

  const { plans, loader } = useSelector(
    (state) => state.RechargeSlice.getPlans
  );
  const { loaderUniversal, operatorandCircle } = useSelector(
    (state) => state.RechargeSlice
  );
  const { bannerData } = useSelector((state) => state.PublicSlice.bannerList);

  useEffect(() => {
    if (
      operatorandCircle.ResponseStatus === 1 &&
      operatorandCircle.Data.STATUS == 1
    ) {
      const PLANAPI_OPERATOR_FIND = All_Recharge_Operator_List.find(
        (a) => a.PlanApi_Operator_code == operatorandCircle.Data.OpCode
      );
      const PLANAPI_CIRCLE_FIND = All_Recharge_Circle_List.find(
        (a) => a.planapi_circlecode == operatorandCircle.Data.CircleCode
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
        })
      );
    }
  }, [operatorandCircle]);
  useEffect(() => {
    dispatch(setRechargeData({ ...rechargeData, plans: "" }));
    if (rechargeData.mobileNumber.length === 10) {
      if (/^\d{10}$/.test(rechargeData.mobileNumber)) {
        dispatch(
          getOperatorandCirclebyPhone({ phone: rechargeData.mobileNumber })
        );
      }
    }
  }, [rechargeData.mobileNumber]);
  useEffect(() => {
    if (rechargeData.circle) {
      navigate("/plans");
    }
  }, [rechargeData.circle]);
  return (
    <div>
      <div className="fixed top-0 w-full">
        <CommonHeader
          title={"Mobile Recharges"}
          handleclick={() => navigate("/")}
        />
      </div>
      <div className="mt-16 p-4">
        <div className="flex bg-gray-100  items-center border border-gray-200 rounded-xl px-3 py-4 ">
          <span className=" font-bold text-black mr-2">+91</span>
          <input
            value={rechargeData.mobileNumber}
            onChange={(e) => {
              dispatch(
                setRechargeData({
                  ...rechargeData,
                  mobileNumber: e.target.value,
                })
              );
              setConSearch(e.target.value);
            }}
            type="tel"
            maxLength={10}
            pattern="^[6-9]\d{9}$"
            placeholder="Enter Phone Number"
            className="flex-1 text-sm outline-none placeholder-gray-500 font-black"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Non-numeric hata dega
            }}
          />
          {/* <MdContacts className="text-gray-700" size={20} /> */}
        </div>
        {serviceList.Data?.find((a) => a.name == "MOBILE_HOME_BANNER")
          ?.isShow && (
          <div className="mt-5">
            <BannerSlider style={{ borderRadius: 10 }} />
          </div>
        )}
      </div>
      {(loaderUniversal || loader) && <Loader />}
    </div>
  );
};

export default MobileHome;

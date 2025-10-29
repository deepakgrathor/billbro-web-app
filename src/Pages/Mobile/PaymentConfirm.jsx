import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import { COMPANY_LOGO, MOBILE_RECHARGE } from "../../Utils/Constant";
import { useDispatch, useSelector } from "react-redux";
import { generateUniqueTrxnRefId } from "../../Utils/CommonFunc";
import {
  DTHRechargeRequest,
  RechargeRequest,
  resetRechargeData,
} from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import ToastComp from "../../Components/ToastComp";
import Loader from "../../Components/Loader";
import ButtonComp from "../../Components/ButtonComp";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { primaryColor } from "../../Utils/Style";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import RechargeStatus from "./RechargeStatus";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [load, setLoad] = useState(false);
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const { walletSelect } = useSelector((state) => state.PaymentSlice);

  const { Totalprice } = useSelector((state) => state.PaymentSlice.PaymentType);
  const rechargeData = location.state;
  const MobileRecharge = async () => {
    // Input validation
    if (
      !rechargeData?.mobileNumber ||
      !rechargeData?.operator?.OperatorCode ||
      !Totalprice?.amount
    ) {
      ToastComp({
        message: "❌ Missing required recharge details",
        type: "error",
      });
      return;
    }

    setLoad(true);

    try {
      const payload = {
        MobileNumber: rechargeData.mobileNumber,
        Operator_Code: rechargeData.operator.OperatorCode,
        Circle_Code: rechargeData.circle?.circlecode || null,
        amount: Number(Totalprice.amount),
        isPrepaid: true,
      };

      const res = await dispatch(RechargeRequest(payload));

      // Response validation
      if (!res?.payload) {
        throw new Error("No response received from server");
      }

      const { ResponseStatus, Data, Remarks } = res.payload;

      if (ResponseStatus !== 1) {
        throw new Error(Remarks || "Invalid response status");
      }

      const status = Data?.status?.toLowerCase();

      // Handle Success and Pending cases
      if (status === "success" || status === "pending") {
        const navigationData = {
          MobileNumber: payload.MobileNumber,
          Operator_Code: payload.Operator_Code,
          amount: payload.amount,
          transactionId: res.payload.Data.transactionId,
          status: status.toUpperCase(),
          type: "MOBILE",
          ...(status === "success" && {
            OP_REF: Data?.opRefNo || Data?.operator_ref_id,
          }),
        };

        navigate("/rechargestatus", { state: navigationData });
      } else {
        throw new Error(Data?.message || "Recharge status unknown");
      }
    } catch (error) {
      console.error("Mobile Recharge Error:", error);

      // User-friendly error message
      const errorMessage =
        error?.response?.data?.Remarks ||
        error?.payload?.Remarks ||
        error?.message ||
        "Recharge Failed. Please try again.";

      ToastComp({
        message: errorMessage,
        type: "error",
      });
    } finally {
      // Always execute - cleanup
      setLoad(false);
    }
  };
  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 w-full z-10 bg-white">
        <CommonHeader
          title={"Confirm Plan"}
          handleclick={() => {
            dispatch(resetRechargeData());
            navigate("/mobile");
          }}
        />
      </div>

      {/* Scrollable content with proper padding */}
      <div className="pt-18 pb-24 overflow-y-auto h-screen">
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl m-4">
          <div className="flex border-b border-gray-300 pb-5 mb-5 space-x-3 justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg p-2 bg-white">
                <img
                  className=""
                  width={20}
                  src={rechargeData.operator.img}
                  alt=""
                />
              </div>
              <div className=" ">
                <div className="flex space-x-1 items-center">
                  <p className="font-semibold text-xs">
                    {rechargeData.mobileNumber}
                  </p>
                  <p>-</p>
                  <p className="font-semibold text-xs">
                    {rechargeData.operator.OperatorName}
                  </p>
                </div>
                <p className="text-[10px]">Madhya Pradesh</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/plans")}
              className="text-[10px] bg-blue-800 text-white px-4 py-2 rounded-full tracking-wide"
            >
              Change Plan
            </button>
          </div>
          <div className="flex mx-2 border-b border-gray-300 pb-3 mb-3 flex-row items-center justify-between">
            <p className="text-black  pr-5  text-base   font-black">
              ₹{rechargeData.plans.amount}
            </p>
            <div>
              <p className="text-black text-[8px]  pr-5 tracking-widest">
                Data
              </p>
              <p className="text-black  pr-5 text-[10px]   font-black">
                {rechargeData.plans.data || "N/A"}
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div>
                <p className="text-black text-[8px] pr-5 tracking-widest">
                  Validity
                </p>
                <p className="text-black  text-[10px] font-black">
                  {rechargeData.plans.validity}
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs p-2">
            <p className="text-[10px]">{rechargeData.plans.desc}</p>
            {rechargeData.plans.planBenefitItemList && (
              <div className="flex flex-row  ml-2 mt-3">
                {rechargeData.plans.planBenefitItemList?.map((item, index) => (
                  <img
                    key={index}
                    src={item.logoUrl || COMPANY_LOGO}
                    width={30}
                    style={{
                      borderRadius: 100,
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "lightgray",
                      padding: 2,
                      marginLeft: -10,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-4 mt-7">
          <p className="m-2 font-bold mb-3 text-sm">Select Payment Method</p>
          <div
            onClick={() => dispatch(setWalletSelect(true))}
            style={{
              borderColor: walletSelect ? primaryColor : "",
              borderWidth: walletSelect ? 1 : 0,
            }}
            className={`flex items-center justify-between py-2 pl-2  bg-gray-100   border-blue-700 border-r-4 rounded-xl`}
          >
            <div className="flex items-center space-x-4">
              <img
                width={25}
                src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
                alt=""
              />
              <div className="">
                <p className="text-[10px] tracking-wider">Wallet Balance</p>
                <div className="flex items-center space-x-2">
                  <p className="font-black text-base">
                    ₹
                    {new Intl.NumberFormat("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(ProfileData?.Data?.wallet?.balance || 0)}
                  </p>
                  {ProfileData?.Data?.wallet?.balance <
                    Number(Totalprice.amount) && (
                    <p className="text-[8px] tracking-wider bg-red-500 text-white rounded-full px-2 py-0.5">
                      Low Balance
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div
              onClick={() => navigate("/wallet")}
              className="flex  bg-[#1447e6] text-white pl-2 pr-1 py-2 rounded-l-full items-center space-x-2"
            >
              <MdOutlineAddCircleOutline size={20} />
              <p className="text-[10px] tracking-wide">Add Money</p>
            </div>
          </div>
          <div
            onClick={() => dispatch(setWalletSelect(false))}
            style={{
              borderColor: !walletSelect ? primaryColor : "",
              borderWidth: !walletSelect ? 1 : 0,
            }}
            className={`flex items-center justify-between py-3.5 pl-2 bg-gray-100 mt-2  rounded-xl`}
          >
            <div className="flex items-center space-x-4">
              <img
                width={25}
                src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_170312.png"
                alt=""
              />
              <div className="">
                <div className="flex items-center space-x-2">
                  <p className="font-black text-base">UPI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 mx-4 rounded-full my-5"></div>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl m-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-700 font-semibold">
              Payable Amount
            </p>
            <p className="text-sm font-bold ">₹{Totalprice.amount}</p>
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="fixed bottom-4 text-center left-0 w-full px-4 z-10 bg-white pt-2">
        <ButtonComp
          disabled={
            Number(Totalprice.amount) > ProfileData?.Data?.wallet?.balance &&
            walletSelect
          }
          title={
            Number(Totalprice.amount) > ProfileData?.Data?.wallet?.balance &&
            walletSelect
              ? "Wallet Balance is Low!"
              : "Proceed to Pay"
          }
          handleClick={MobileRecharge}
        />
      </div>

      {load && <Loader />}
    </div>
  );
};

export default PaymentConfirm;

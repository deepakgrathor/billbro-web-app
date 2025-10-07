import React, { useState } from "react";
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

const PaymentConfirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [load, setLoad] = useState(false);
  const { profileLoader, ProfileData } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );
  const { Totalprice, type, detail, ids, serviceType } = useSelector(
    (state) => state.PaymentSlice.PaymentType
  );
  const rechargeData = location.state;
  const MobileRecharge = async () => {
    setLoad(true);
    const MobileNumber = rechargeData?.mobileNumber;
    const Operator_Code = rechargeData.operator?.OperatorCode;
    const Circle_Code = rechargeData.circle?.circlecode || null;
    const amount = Totalprice.amount;
    const transactionId = generateUniqueTrxnRefId();

    const res = await dispatch(
      RechargeRequest({
        MobileNumber,
        Operator_Code,
        Circle_Code,
        amount,
        transactionId,
        isPrepaid: true,
      })
    );

    if (
      res.payload?.ResponseStatus === 1 &&
      res.payload.Data?.status === "Success"
    ) {
      const data = {
        MobileNumber,
        Operator_Code,
        amount,
        transactionId,
        status: "SUCCESS",
        type: "MOBILE",
        OP_REF: res.payload.Data?.opRefNo || res.payload.Data?.operator_ref_id,
      };

      setLoad(false);
      navigate("RechargeStatus", { state: data });
    } else if (
      res.payload?.ResponseStatus === 1 &&
      res.payload.Data?.status === "Pending"
    ) {
      const data = {
        MobileNumber,
        Operator_Code,
        amount,
        transactionId,
        status: "PENDING",
        type: "MOBILE",
      };

      setLoad(false);
      navigate("RechargeStatus", { state: data });
    } else {
      ToastComp({
        message:
          res.payload.Remarks.length > 1
            ? res.payload.Remarks
            : "Recharge is Failed",
        type: "error",
      });

      setLoad(false);
    }
  };
  const DTHRecharge = async () => {
    setLoad(true);
    const MobileNumber = rechargeData?.customerId;
    const Operator_Code = rechargeData.operator.Mobikwik_Operator_code;
    const amount = rechargeData.amount;
    const transactionId = generateUniqueTrxnRefId();
    const res = await dispatch(
      DTHRechargeRequest({
        MobileNumber,
        Operator_Code,
        amount,
        transactionId,
      })
    );

    if (
      res.payload?.ResponseStatus === 1 &&
      res.payload.Data?.status === "Success"
    ) {
      const data = {
        MobileNumber,
        Operator_Code,
        amount,
        transactionId,
        status: "SUCCESS",
        type: "DTH",
        OP_REF: res.payload.Data?.opRefNo || res.payload.Data?.operator_ref_id,
      };

      setLoad(false);
      navigate("RechargeStatus", { state: data });
    } else if (
      res.payload?.ResponseStatus === 1 &&
      res.payload.Data?.status === "Pending"
    ) {
      const data = {
        MobileNumber,
        Operator_Code,
        amount,
        transactionId,
        status: "PENDING",
        type: "DTH",
      };

      setLoad(false);
      navigate("RechargeStatus", { state: data });
    } else {
      ToastComp({ message: "Recharge Failed", type: "error" });

      setLoad(false);
    }
  };
  return (
    <div>
      <div className="">
        <div className="fixed top-0 w-full">
          <CommonHeader
            title={"Confirm Plan"}
            handleclick={() => {
              dispatch(resetRechargeData());
              navigate("/mobile");
            }}
          />
        </div>
        <div className="mt-18">
          <div className="p-3 bg-gray-100 rounded-lg m-2">
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
                className="text-[10px] bg-blue-800 text-white px-2 py-1 rounded tracking-wide"
              >
                Change Plan
              </button>
            </div>
            <div
              //   onClick={() => {
              //     handleProcess({
              //       plans: item,
              //     });
              //   }}
              className="flex mx-2 border-b border-gray-300 pb-3 mb-3 flex-row items-center justify-between"
            >
              <p
                // style={{ fontFamily: LatoBold, fontSize: Width * 0.05 }}
                className="text-black  pr-5  text-base   font-black"
              >
                ₹{rechargeData.plans.amount}
              </p>
              <div>
                <p
                  //   style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
                  className="text-black text-[8px]  pr-5 tracking-widest"
                >
                  Data
                </p>
                <p
                  //   style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
                  className="text-black  pr-5 text-[10px]   font-black"
                >
                  {rechargeData.plans.data || "N/A"}
                </p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <p
                    // style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
                    className="text-black text-[8px] pr-5 tracking-widest"
                  >
                    Validity
                  </p>
                  <p
                    // style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
                    className="text-black  text-[10px] font-black"
                  >
                    {rechargeData.plans.validity}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-xs p-2">
              <p className="text-[10px]">{rechargeData.plans.desc}</p>
              {rechargeData.plans.planBenefitItemList && (
                <div className="flex flex-row  ml-2 mt-3">
                  {rechargeData.plans.planBenefitItemList?.map(
                    (item, index) => (
                      <img
                        key={index}
                        src={item.logoUrl || COMPANY_LOGO}
                        width={30}
                        style={{
                          // width: Width * 0.08,
                          // height: Width * 0.08,
                          borderRadius: 100,
                          backgroundColor: "white",
                          borderWidth: 1,
                          borderColor: "lightgray",
                          padding: 2,
                          marginLeft: -10,
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 space-y-2 left-0 w-full px-2">
          <ButtonComp
            handleClick={
              serviceType === MOBILE_RECHARGE ? MobileRecharge : DTHRecharge
            }
            title={"Proceed to Pay"}
          />
        </div>
      </div>
      {load && <Loader />}
    </div>
  );
};

export default PaymentConfirm;

import React, { useEffect, useState } from "react";
import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { primaryColor } from "../../Utils/Style";
import { useDispatch, useSelector } from "react-redux";
import ToastComp from "../../Components/ToastComp";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import ButtonComp from "../../Components/ButtonComp";
import API from "../../Redux/API";
import { BBPS_PAY_BILL } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import Loader from "../../Components/Loader";

const BillPreview = ({ data, operatorData, number, ButtonName }) => {
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const [orderId, setOrderId] = useState();
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  //   const { billPaymentLoader } = useSelector(
  //     (state) => state.ServiceSlice.billPayment
  //   );
  const { ids, serviceType } = useSelector(
    (state) => state.PaymentSlice.PaymentType
  );
  const [amount, setAmount] = useState();
  const handlePayment = async () => {
    try {
      setLoad(true);
      let valData;
      if (ids !== "64c9e66d1efc768da459ef09") {
        const { cn, ...restFields } = number;
        const adFields = {};
        Object.values(restFields).forEach((val, index) => {
          adFields[`ad${index + 1}`] = val;
        });

        valData = {
          number: cn,
          operator: {
            name: operatorData.operator_name,
            category: operatorData.categoryId,
            operator_id: operatorData.op_id,
          },
          ...adFields,
          amount,
          serviceId: ids,
        };
      } else {
        valData = {
          number: number,
          operator: {
            name: operatorData.operator_name,
            category: operatorData.categoryId,
            operator_id: operatorData.op_id,
          },
          ad1: operatorData.ad || "",
          amount,
          serviceId: ids,
        };
      }
      const res = await dispatch(BBPS_PAY_BILL({ valData }));
      const payload = res?.payload;
      if (!payload) {
        ToastComp({
          message: "No response received from server",
          type: "error",
        });
        return;
      }

      if (payload.ResponseStatus === 0) {
        ToastComp({
          message: payload.Remarks || payload.message || "Transaction failed",
          type: "error",
        });
        return;
      }

      if (payload.ResponseStatus === 1) {
        const { status, transactionId, opRefNo, operator_ref_id } =
          payload.Data || {};

        if (["Success", "success", "Pending", "pending"].includes(status)) {
          const ResponseData = {
            MobileNumber: number.cn || number,
            Operator_Code: operatorData.op_id,
            amount,
            transactionId,
            status,
            type: "BBPS",
            OP_REF: opRefNo || operator_ref_id,
          };
          navigate("bbpsstatus", { state: ResponseData });
          return;
        }
      }

      ToastComp({
        message: payload.Remarks || payload.message || "Transaction failed",
        type: "error",
      });
    } catch (error) {
      ToastComp({
        message: error?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    setAmount(data.billAmount);
  }, [data.billAmount]);
  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={60}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt=""
        />
      </div>
    );
  };
  return (
    <div>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-10">
          <CommonHeader
            style={{ fontSize: 13 }}
            title={`${operatorData?.operator_name?.slice(0, 25)}...`}
            handleclick={() => navigate(-1)}
            rightDesign={rightDesign}
          />
        </div>

        {/* Content */}
        <div className="flex-1 mt-16 overflow-y-auto p-2">
          <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 border-b border-gray-300 pb-3">
              <img
                src={DummyAvatarForPassbook}
                className="w-12 rounded-full"
              />
              <div className="space-y-1">
                <p className="text-black text-sm font-medium">
                  {data.userName}
                </p>
                <p className="text-gray-400 text-xs">
                  Number: {data.cellNumber}
                </p>
              </div>
            </div>

            {/* Bill Details */}
            <p className="text-black text-sm font-medium mt-3">Bill Details</p>
            <div className="border-b border-gray-300 my-2" />
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <p className="text-gray-600">Bill Date</p>
                <p className="text-black">{data.billdate || "N/A"}</p>
              </div>
              <div className="flex justify-between text-xs">
                <p className="text-red-600">Due Date</p>
                <p className="text-red-600">{data.dueDate || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-gray-100 border border-gray-300 flex items-center space-x-2 p-3 rounded-lg mb-3">
            <p className="text-2xl font-black">₹</p>
            <input
              disabled={!data.acceptPartPay}
              placeholder="Enter Amount"
              value={amount?.toString()}
              onChange={(e) => setAmount(e)}
              className="flex-1 font-black text-xl outline-none placeholder:font-light"
            />
          </div>

          {/* Note */}
          <p className="text-gray-500 text-[8px] bg-blue-100 p-2 rounded-md mb-10">
            Note: The service provider may occasionally take up to 72 hours to
            process your bill.
          </p>
        </div>

        {/* Bottom Button */}
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 shadow">
          <ButtonComp title={"Proceed to pay"} handleClick={handlePayment} />
        </div>
      </div>
      {load && <Loader />}
    </div>
  );
};

export default BillPreview;

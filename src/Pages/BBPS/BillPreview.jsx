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
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";

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

      // Validation: Check minimum amount for FASTag
      if (ids === "64c9e66d1efc768da459ef09" && amount < 10) {
        ToastComp({
          message: "Minimum FASTag recharge amount is ₹10",
          type: "error",
        });
        return;
      }

      // Prepare payment data
      const valData = preparePaymentData();

      // Make API call
      const res = await dispatch(BBPS_PAY_BILL({ valData }));

      // Handle response
      handlePaymentResponse(res?.payload);
    } catch (error) {
      handlePaymentError(error);
    } finally {
      setLoad(false);
    }
  };

  // Helper function to prepare payment data
  const preparePaymentData = () => {
    const baseData = {
      operator: {
        name: operatorData.operator_name,
        category: operatorData.categoryId,
        operator_id: operatorData.op_id,
      },
      amount,
      serviceId: ids,
    };

    // FASTag service
    if (ids === "64c9e66d1efc768da459ef09") {
      return {
        ...baseData,
        number: number,
        ad1: operatorData.ad || "",
      };
    }

    // Other services
    const { cn, ...restFields } = number;
    const adFields = Object.values(restFields).reduce((acc, val, index) => {
      acc[`ad${index + 1}`] = val;
      return acc;
    }, {});

    return {
      ...baseData,
      number: cn,
      ...adFields,
    };
  };

  // Helper function to handle API response
  const handlePaymentResponse = (payload) => {
    if (!payload) {
      throw new Error("No response received from server");
    }
    console.log(payload, "payload");
    // Response status check
    if (payload.ResponseStatus === 0) {
      const errorMsg =
        payload.Remarks ||
        payload.message ||
        "Transaction failed. Please try again.";
      throw new Error(errorMsg);
    }

    if (payload.ResponseStatus === 1) {
      const data = payload.Data || {};
      const { status, transactionId, opRefNo, operator_ref_id } = data;

      // Success or Pending status
      if (["Success", "success", "Pending", "pending"].includes(status)) {
        const responseData = {
          MobileNumber: number.cn || number,
          Operator_Code: operatorData,
          amount,
          transactionId,
          status,
          type: "BBPS",
          OP_REF: opRefNo || operator_ref_id,
        };

        navigate("/bbpsstatus", { state: responseData });
        return;
      }

      // Failed transaction
      throw new Error(data.message || "Transaction failed");
    }

    // Unexpected response status
    throw new Error(
      payload.Remarks ||
        payload.message ||
        "Transaction failed. Please try again."
    );
  };

  // Helper function to handle errors
  const handlePaymentError = (error) => {
    const errorMessages = {
      "Network Error": "Network error. Please check your internet connection.",
      timeout: "Request timeout. Please try again.",
      insufficient: "Insufficient balance. Please recharge your wallet.",
      invalid: "Invalid details provided. Please check and try again.",
    };

    let message = error?.message || "Something went wrong. Please try again.";

    // Check for specific error patterns
    const errorKey = Object.keys(errorMessages).find((key) =>
      message.toLowerCase().includes(key.toLowerCase())
    );

    if (errorKey) {
      message = errorMessages[errorKey];
    }

    ToastComp({
      message,
      type: "error",
    });
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
        <div className="flex-1 mt-16 overflow-y-auto p-4">
          <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 border-b border-gray-300 pb-3">
              <img src={DummyAvatarForPassbook} className="w-12 rounded-full" />
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
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 font-black text-xl outline-none placeholder:font-light"
            />
          </div>

          <div className="my-4">
            <div className="flex space-x-3 overflow-x-auto items-center">
              {PriceArr.map((item, idx) => (
                <p
                  key={idx}
                  onClick={() => setAmount(item)}
                  className="text-[12px] text-gray-700 tracking-wider rounded-full border border-gray-300 p-1.5 px-4"
                >
                  +{item}
                </p>
              ))}
            </div>
          </div>
          <div className=" mt-8 mb-4 ">
            <p className="m-1 font-bold mb-3 text-sm">Select Payment Method</p>
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
                {/* <MdOutlineAccountBalanceWallet size={35} /> */}
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
                    {ProfileData?.Data?.wallet?.balance < amount && (
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
                {/* <MdOutlineAccountBalanceWallet size={35} /> */}
                <div className="">
                  <div className="flex items-center space-x-2">
                    <p className="font-black text-base">UPI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Note */}
          <p className="text-gray-500 text-[8px] bg-blue-100 p-2 rounded-md mb-10">
            Note: The service provider may occasionally take up to 72 hours to
            process your bill.
          </p>
        </div>

        {/* Bottom Button */}
        <div className="sticky text-center bottom-0 left-0 right-0 bg-white p-4 shadow">
          <ButtonComp
            disabled={
              Number(amount) > ProfileData?.Data?.wallet?.balance &&
              walletSelect
            }
            title={
              Number(amount) > ProfileData?.Data?.wallet?.balance &&
              walletSelect
                ? "Wallet Balance is Low!"
                : "Proceed to pay"
            }
            handleClick={handlePayment}
          />
        </div>
      </div>
      {load && <Loader />}
    </div>
  );
};
const PriceArr = [100, 200, 500, 1000, 5000, 10000];

export default BillPreview;

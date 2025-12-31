import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import BottomSheet from "../../Components/BottomSheet";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServiceList,
  GOOGLE_PLAY_PAYMENT,
} from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import ToastComp from "../../Components/ToastComp";
import { generateUniqueTrxnRefId } from "../../Utils/CommonFunc";
import ButtonComp from "../../Components/ButtonComp";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { primaryColor } from "../../Utils/Style";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import Loader from "../../Components/Loader";

const GooglePlay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );
  const { walletSelect } = useSelector((state) => state.PaymentSlice);

  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);

  const { googlePaymentLoader } = useSelector((state) => state.ServiceSlice);
  const { profileLoader, ProfileData } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const [amount, setAmount] = useState(100);
  const [load, setLoad] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const HowtoRedeem = () => {
    return (
      <div className="">
        <p className="mb-4 text-xs text-gray-500">
          Follow the steps to redeem your code.
        </p>
        <div className="text-gray-500">
          <p className="mb-3 text-xs">
            1. Visit Google PlayStore or play.google.com{" "}
          </p>
          <p className="mb-3 text-xs">{`2. Click on profile > Select Payments > Subscriptions.`}</p>
          <p className="mb-3 text-xs">{`3. Select Redeem Code > Enter Gift Card details and avail the benefits.`}</p>
        </div>
      </div>
    );
  };
  const ThingNoted = () => {
    return (
      <div className="">
        <p className="text-xs text-gray-500">
          Google Play Terms & Conditions: <br />
          <br />
          1. Google Play recharge code purchases are non- refundable.
          <br />
          <br />
          2. Google Play recharge codes can only be used on the Google Play
          Store to purchase apps, games, digital content, and in-app items
          available on the Store.
          <br />
          <br />
          3. Users must be Indian residents aged 18+. Between the ages of 13 and
          17, the consent of a parent or guardian is required prior to making a
          purchase.
          <br />
          <br />
          4. Issued by Google Payment Singapore Pte. Ltd. for purchases of
          eligible items on Google Play only.
          <br />
          <br />
          5. Requires a Google Payments account and Internet access to redeem.
          Not usable for hardware and certain subscriptions.
          <br />
          <br />
          6. Other limits may apply. No fees or expiration.
          <br />
          <br />
          7. Card not redeemable for cash or other cards, not reloadable or
          refundable and cannot be combined with non-Google Play balances,
          resold, exchanged, or transferred for value. User is responsible for
          the loss of the card.
        </p>
        <br />
        <br />
      </div>
    );
  };
  // const handlePayNow = async () => {
  //   const transactionId = generateUniqueTrxnRefId();
  //   const valData = {
  //     number: ProfileData.Data.phone,
  //     amount: Number(amount),
  //     transactionId: transactionId,
  //     serviceId: ids,
  //   };
  //   const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));
  //   if (res.payload.ResponseStatus === 0) {
  //     ToastComp({ message: res.payload.Remarks, type: "success" });
  //   } else if (
  //     (res.payload.ResponseStatus === 1 &&
  //       res.payload.Data.status === "Success") ||
  //     (res.payload.ResponseStatus === 1 &&
  //       res.payload.Data.status === "Pending")
  //   ) {
  //     navigate("BBPSSuccess", res.payload.Data);
  //   } else {
  //     ToastComp({ message: res.payload.Remarks, type: "success" });
  //   }
  // };

  const handlePayNow = async () => {
    try {
      setLoad(true);

      // Validation: Check minimum amount for FASTag
      if (amount < 50) {
        ToastComp({
          message: "Minimum Recharge amount is ₹50",
          type: "error",
        });
        return;
      }

      // Prepare payment data
      const valData = preparePaymentData();

      // Make API call
      const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));

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
    const valData = {
      number: ProfileData.Data.phone,
      amount: Number(amount),
      serviceId: ids,
    };

    // Other services
    return valData;
  };

  // Helper function to handle API response
  const handlePaymentResponse = (payload) => {
    if (!payload) {
      throw new Error("No response received from server");
    }
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
          MobileNumber: ProfileData.Data.phone,
          Operator_Code: "GOOGLE PLAY",
          amount,
          transactionId,
          status,
          type: "GOOGLEPLAY",
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
    dispatch(getUserProfile());
    // dispatch(fetchBBPSHistory({serviceId: ids}));
  }, []);
  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
          <CommonHeader
            title={"Google Play"}
            handleclick={() => navigate(-1)}
            rightDesign={() => {
              return (
                <>
                  <img
                    width={100}
                    height={40}
                    src="https://production-api.billbro.info/uploads/services/1745668990300-APD_icon_GPRC._CB594689751_.png"
                  />
                </>
              );
            }}
          />
        </div>
        <div className="flex-1 mt-14 overflow-y-auto">
          <div className="px-4 my-6">
            <div className="flex  items-center  bg-gray-100 border border-gray-200 rounded-lg px-3 py-3 ">
              <span className="text-lg font-bold text-black mr-2">₹</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="Enter Amount"
                className="flex-1 outline-none placeholder-gray-500  font-black"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Non-numeric hata dega
                }}
              />
            </div>
            <div className="mt-4">
              <div className="flex space-x-3 overflow-x-auto items-center">
                {PriceArr.map((item, idx) => (
                  <p
                    key={idx}
                    onClick={() => setAmount(item)}
                    className="text-[10px] text-gray-700 tracking-wider rounded-full border border-gray-300 p-1.5 px-3"
                  >
                    +{item}
                  </p>
                ))}
              </div>
            </div>
            <div className=" my-8 ">
              <p className="m-1 font-bold mb-3 text-sm">
                Select Payment Method
              </p>
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

            <div className="space-y-3 mt-6">
              <div
                onClick={() => {
                  setIsOpen(true);
                  setContent(HowtoRedeem);
                  setTitle("How to Redeem");
                }}
                className="flex items-center border-b pb-2 border-gray-200 justify-between"
              >
                <p className="text-[10px]">How to Redeem</p>
                <IoIosArrowForward />
              </div>
              <div
                onClick={() => {
                  setIsOpen(true);
                  setContent(ThingNoted);
                  setTitle("Things to be Noted");
                }}
                className="flex items-center justify-between"
              >
                <p className="text-[10px]">Things to be Noted</p>
                <IoIosArrowForward />
              </div>
            </div>
          </div>
          <div className="fixed bottom-4 space-y-2 left-0 w-full px-4">
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
              handleClick={handlePayNow}
            />
          </div>
        </div>

        <BottomSheet
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          content={content}
          title={title}
        />
      </div>
      {load && <Loader />}
    </>
  );
};

const PriceArr = [50, 100, 200, 500, 1000, 5000];

export default GooglePlay;

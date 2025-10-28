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

const GooglePlay = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );
  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);

  const { googlePaymentLoader } = useSelector((state) => state.ServiceSlice);
  const { profileLoader, ProfileData } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const [amount, setAmount] = useState(100);

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
  const handlePayNow = async () => {
    const transactionId = generateUniqueTrxnRefId();
    const valData = {
      number: ProfileData.Data.phone,
      amount: amount,
      transactionId: transactionId,
      serviceId: ids,
    };
    console.log(valData, "valData");
    const res = await dispatch(GOOGLE_PLAY_PAYMENT({ valData }));
    console.log(res.payload, "res.payload")
    if (res.payload.ResponseStatus === 0) {
      ToastComp({ message: res.payload.Remarks, type: "success" });
    } else if (
      (res.payload.ResponseStatus === 1 &&
        res.payload.Data.status === "Success") ||
      (res.payload.ResponseStatus === 1 &&
        res.payload.Data.status === "Pending")
    ) {
      // navigate("BBPSSuccess", res.payload.Data);
    } else {
      ToastComp({ message: res.payload.Remarks, type: "success" });
    }
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
                    width={30}
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
              disabled={amount > 5000}
              title={amount > 5000 ? "MAX Purchase Amount ₹5000" : "Proceed"}
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
    </>
  );
};

const PriceArr = [50, 100, 200, 500, 1000, 5000];

export default GooglePlay;

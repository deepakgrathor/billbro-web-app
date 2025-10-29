import React, { useEffect, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useLocation, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import SuccessLottie from "../../assets/Lotties/success.json";
import PendingLottie from "../../assets/Lotties/pending.json";
import { BRAND_NAME } from "../../Utils/Constant";
import dayjs from "dayjs";
import BottomSheet from "../../Components/BottomSheet";
import PlayStoreRating from "../../Components/PlayStoreRating";

const RechargeStatus = (route) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState();
  const [open, setOpen] = useState(false);
  const data = location.state;
  console.log(data, "data")
  useEffect(() => {
    if (data.status === "SUCCESS") {
      const timer = setTimeout(() => {
        setContent(PlayStoreRating);
        setOpen(true);
      }, 1000);

      // Cleanup - component unmount hone par timer cancel ho jaye
      return () => clearTimeout(timer);
    }
  }, [data?.status]); // dependency array mein data.status add kiya
  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
          <CommonHeader
            title={"Transaction Details"}
            handleclick={() => navigate("/")}
          />
        </div>
        <div className="flex-1 mt-14 overflow-y-auto">
          <div className="px-4 my-6">
            <div className="flex flex-col items-center justify-center">
              <Lottie
                style={{ width: 100 }}
                animationData={
                  data.status === "SUCCESS" ? SuccessLottie : PendingLottie
                }
                loop={true}
              />
              <p className="font-semibold uppercase">Recharge {data.status}</p>
              <p className="text-xs text-gray-500 mt-1">
                Your request has been successfully done.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {dayjs().format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
            <div className=" my-8 border-t border-gray-200 pt-6">
              <div className="bg-gray-100/50 border-gray-100 border p-3 px-4  rounded-t-xl rounded-b-xl">
                <div className="">
                  <h2 className="text-sm font-normal">Amount</h2>
                  <p className="text-2xl font-bold mt-1">₹{data.amount}</p>
                </div>
                <div className="border my-4 border-gray-200 border-dashed"></div>
                <div className="">
                  <h2 className="text-xs font-normal">Operator Ref. No.</h2>
                  <p className="text-sm font-bold mt-1">{data.OP_REF}</p>
                </div>
                <div className="border my-4 border-gray-200 border-dashed"></div>
                <div className="">
                  <h2 className="text-xs font-normal">Transaction ID</h2>
                  <p className="text-sm font-bold mt-1">{data.transactionId}</p>
                </div>
                <div className="border my-4 border-gray-200 border-dashed"></div>
                <div className="">
                  <h2 className="text-xs font-normal">Number</h2>
                  <p className="text-sm font-bold mt-1">{data.MobileNumber}</p>
                </div>
                <div className="border my-4 border-gray-200 border-dashed"></div>
                <div className="">
                  <h2 className="text-xs font-normal">Payment Method</h2>
                  <p className="text-sm font-bold mt-1">UPI</p>
                </div>
                <div className="border my-4 border-gray-200 border-dashed"></div>
                <div className="">
                  <h2 className="text-xs font-normal">Paid To</h2>
                  <p className="text-sm font-bold mt-1">{BRAND_NAME}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed bottom-4 space-y-2 left-0 w-full px-4">
            {/* <ButtonComp
              disabled={amount > 5000}
              title={amount > 5000 ? "MAX Purchase Amount ₹5000" : "Proceed"}
              handleClick={handlePayNow}
            /> */}
          </div>
        </div>
      </div>
      <BottomSheet
        content={content}
        isOpen={open}
        setIsOpen={setOpen}
        bottomButton={false}
      />
    </>
  );
};

export default RechargeStatus;

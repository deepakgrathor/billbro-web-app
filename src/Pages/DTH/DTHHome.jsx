import React, { use, useEffect, useRef, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { DTH_OPERATOR_ARR } from "../../Utils/MockData";
import SelectDTHOperator from "./SelectDTHOperator";
import ButtonComp from "../../Components/ButtonComp";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BottomSheet from "../../Components/BottomSheet";
import { setWalletSelect } from "../../Redux/Slices/PaymentSlice";
import { useDispatch, useSelector } from "react-redux";
import { primaryColor } from "../../Utils/Style";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ToastComp from "../../Components/ToastComp";
import { generateUniqueTrxnRefId } from "../../Utils/CommonFunc";
import { DTHRechargeRequest } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import Loader from "../../Components/Loader";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";

const DTHHome = () => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [step, setStep] = useState(1);
  const [number, setNumber] = useState(null);
  const [amount, setAmount] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const { walletSelect } = useSelector((state) => state.PaymentSlice);
  const { profileLoader, ProfileData } = useSelector(
    (state) => state.LoginSlice.profile
  );
  const FindContentDesign = () => {
    return (
      <>
        <p className="text-xs text-gray-500">{data.findContent}</p>
      </>
    );
  };

  const minAmountMap = {
    tata_sky: 200,
    airtel_tv: 100,
    dish_tv: 150,
    sun_tv: 150,
    videocon: 150,
  };

  const DTHRecharge = async () => {
    const minAmount = minAmountMap[data.id];

    // Input validation
    if (!number || !amount || isNaN(amount) || amount <= 0 || !data?.id) {
      ToastComp({
        message: "❌ Missing or invalid DTH number/amount/operator",
        type: "error",
      });
      return;
    }
    if (Number(amount) < minAmount) {
      ToastComp({
        message: `Minimum amount for ${data.title} is ₹${minAmount}`,
        type: "error",
      });
      return;
    }

    setLoad(true);

    try {
      const payload = {
        MobileNumber: number.trim(),
        Operator_Code: data.id,
        amount: Number(amount),
      };

      const res = await dispatch(DTHRechargeRequest(payload));

      // Response validation
      if (!res?.payload) {
        throw new Error("No response received from server");
      }

      const { ResponseStatus, Data, Remarks } = res.payload;

      if (ResponseStatus !== 1 || !Data) {
        throw new Error(Remarks || "Invalid response");
      }

      const status = Data.status?.toLowerCase();

      if (status === "success" || status === "pending") {
        const navigateData = {
          MobileNumber: payload.MobileNumber,
          Operator_Code: payload.Operator_Code,
          amount: payload.amount,
          transactionId: res.payload.Data.transactionId,
          status: status.toUpperCase(),
          type: "DTH",
          ...(status === "success" && {
            OP_REF: Data.opRefNo || Data.operator_ref_id,
          }),
        };
        navigate("/rechargestatus", {
          state: navigateData,
        });
      } else {
        throw new Error(Data.message || "Recharge failed");
      }
    } catch (error) {

      const errorMessage =
        error.response?.data?.Remarks ||
        error.payload?.Remarks ||
        error.message ||
        "Recharge Failed. Please try again.";

      ToastComp({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);
  return (
    <>
      <div className="">
        {step === 1 && (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                title={"Select Operator"}
                handleclick={() => navigate(-1)}
              />
            </div>
            <div className="mt-16">
              <SelectDTHOperator
                data={DTH_OPERATOR_ARR}
                setStep={setStep}
                setData={setData}
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                style={{ fontSize: 12 }}
                title={`${data?.title}`}
                handleclick={() => setStep(1)}
                // rightDesign={rightDesign}
              />
            </div>
            <div className="relative mt-16 flex-1 p-4">
              <div className="bg-gray-100 p-4 mb-3 border border-gray-200 rounded-lg">
                <div className="">
                  <input
                    ref={inputRef}
                    autoFocus
                    autoComplete="off"
                    className="outline-none text-sm placeholder:font-semibold font-semibold tracking-wider w-full p-1"
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value);
                    }}
                    placeholder={data.placeholder}
                    type={"text"} // type=number na rakho, taaki maxLength & regex work kare
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  setOpen(true);
                  setContent(FindContentDesign);
                  setTitle(`How to find ${data.placeholder}`);
                }}
                className="flex items-center p-1 justify-between"
              >
                <p className="text-xs font-semibold text-gray-600">
                  How to find {data.placeholder}
                </p>
                <AiOutlineInfoCircle />
              </div>

              <div className="fixed bottom-4 space-y-2 left-0 w-full px-2 text-center">
                <ButtonComp handleClick={() => setStep(3)} title={"Continue"} />
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                title={"Review & Confirm"}
                handleclick={() => setStep(2)}
              />
            </div>
            <div className="mt-16">
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-sm">DTH Recharge for - {data.title}</p>
                  <h2 className="text-black font-bold text-lg">{number}</h2>
                </div>
                <div className="mt-5">
                  <div className="flex mb-3  items-center  bg-gray-100 border border-gray-200 rounded-lg px-3 py-3 ">
                    <span className="text-2xl font-bold text-black mr-2">
                      ₹
                    </span>
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
                          className="text-[12px] text-gray-700 tracking-wider rounded-full border border-gray-300 p-1.5 px-4"
                        >
                          +{item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className=" mt-12">
                  <p className="m-2 font-bold mb-3 text-sm">
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
                        <p className="text-[10px] tracking-wider">
                          Wallet Balance
                        </p>
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
                    : "Proceed"
                }
                handleClick={DTHRecharge}
              />
            </div>
          </div>
        )}
      </div>
      <BottomSheet
        content={content}
        title={title}
        isOpen={open}
        setIsOpen={setOpen}
      />
      {load && <Loader />}
    </>
  );
};

const PriceArr = [100, 200, 500, 1000, 5000];

export default DTHHome;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Fetch_BPPS_BILL,
  Fetch_BPPS_Operator_List,
} from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import ToastComp from "../../Components/ToastComp";
import SelectBBPSOperator from "./SelectBBPSOperator";
import { primaryColor } from "../../Utils/Style";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import ButtonComp from "../../Components/ButtonComp";
import BillPreview from "./BillPreview";
import Loader from "../../Components/Loader";

const MainBBPS = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [data, setData] = useState();
  const [number, setNumber] = useState(null);
  const [isFastag, setIsFastag] = useState(false);
  const { bbpsOperatorList, universalLoader, fetchBBPSBill } = useSelector(
    (state) => state.ServiceSlice
  );
 
  const handlFetchBill = async () => {
    const { cn, ...restFields } = formData;
    const adFields = {};
    Object.values(restFields).forEach((val, index) => {
      adFields[`ad${index + 1}`] = val;
    });
    const payload = {
      operator: data.op_id,
      number: cn,
      ...adFields,
    };

    const res = await dispatch(Fetch_BPPS_BILL({ payload }));
    if (res.payload.ResponseStatus === 1) {
      if (res.payload.Data.status == "success") {
        setStep(3);
      } else {
        ToastComp({ message: res.payload.Data.message, type: "failed" });
      }
    } else {
      ToastComp({ message: res.payload.Remarks, type: "error" });
    }
  };

  const handlFetchFastagBill = async () => {
    const payload = {
      operator: data.op_id,
      number: number,
      ad1: data.ad,
    };

    const res = await dispatch(Fetch_BPPS_BILL({ payload }));
    if (res.payload.ResponseStatus === 1) {
      if (res.payload.Data.status == "success") {
        setStep(3);
      } else {
        ToastComp({ message: res.payload.Data.message, type: "failed" });
      }
    } else {
      ToastComp({ message: res.payload.Remarks, type: "error" });
    }
  };

  useEffect(() => {
    const serviceId = state._id;
    dispatch(Fetch_BPPS_Operator_List({ serviceId }));
    setIsFastag(serviceId === "64c9e66d1efc768da459ef09");
  }, []);
  const handleInputChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
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
      {step === 1 && (
        <div className="">
          <div className="fixed top-0 w-full">
            <CommonHeader
              title={"Select Biller"}
              handleclick={() => navigate(-1)}
              rightDesign={rightDesign}
            />
          </div>
          <div className="mt-16">
            <SelectBBPSOperator
              data={bbpsOperatorList.Data}
              setStep={setStep}
              setData={setData}
            />
          </div>
        </div>
      )}
      {step === 2 &&
        (!isFastag ? (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                style={{ fontSize: 12 }}
                title={`${data?.operator_name?.slice(0, 30)}...`}
                handleclick={() => setStep(1)}
                rightDesign={rightDesign}
              />
            </div>
            <div className="relative mt-16 flex-1 p-2">
              {data.fieldSchema?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 mb-3 rounded-lg"
                  >
                    <div className="">
                      <input
                        className="outline-none text-xs placeholder:font-semibold font-semibold tracking-wider w-full p-1"
                        value={formData[item.id] || ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Sirf allowed characters check karo
                          if (!/^[0-9N]*$/.test(value)) return; // N ya digits allow

                          handleInputChange(item.id, value);
                        }}
                        placeholder={
                          `Enter ${item.displayname}` || "Enter Number"
                        }
                        type={"text"} // type=number na rakho, taaki maxLength & regex work kare
                      />
                    </div>
                  </div>
                );
              })}

              <div className="fixed bottom-4 text-center space-y-2 left-0 w-full px-2">
                <ButtonComp title={"Fetch Bill"} handleClick={handlFetchBill} />
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="fixed top-0 w-full">
              <CommonHeader
                style={{ fontSize: 13 }}
                title={`${data?.operator_name?.slice(0, 30)}...`}
                handleclick={() => setStep(1)}
                rightDesign={rightDesign}
              />
            </div>
            <div className="relative mt-16 flex-1 p-2">
              <div className="bg-gray-100 border-gray-400 border p-3 mb-3 rounded-lg">
                <div>
                  <input
                    className="outline-none placeholder:font-semibold font-semibold tracking-wider w-full p-1"
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value);
                    }}
                    placeholder={`Enter ${data.displayname}` || "Enter Number"}
                    type={"text"} // type=number na rakho, taaki maxLength & regex work kare
                  />
                </div>
              </div>
              <div className="fixed text-center bottom-4 space-y-2 left-0 w-full px-2">
                <ButtonComp
                  title={"Confirm"}
                  handleClick={handlFetchFastagBill}
                />
              </div>
            </div>
          </div>
        ))}
      {step === 3 && (
        <BillPreview
          data={fetchBBPSBill?.Data?.data}
          operatorData={data}
          number={!isFastag ? formData : number}
          ButtonName={'PAY BILL'}
        />
      )}
      {universalLoader && <Loader/>}
    </div>
  );
};

export default MainBBPS;

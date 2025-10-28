import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import { MdOutlineArrowBack } from "react-icons/md";
import { primaryColor } from "../../Utils/Style";
import { useDispatch, useSelector } from "react-redux";
import ToastComp from "../../Components/ToastComp";
import {
  getMobileRechargePlan,
  resetRechargeData,
  setRechargeData,
} from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import SearchBarComp from "../../Components/SearchBarComp";
import { COMPANY_LOGO, MOBILE_RECHARGE, SERVICE } from "../../Utils/Constant";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
import Loader from "../../Components/Loader";

const CardDesign = ({ item, rechargeData, handleProcess }) => {
  const [showDesc, setShowDesc] = useState({
    status: false,
    id: "",
  });
  return (
    <div>
      <div className=" bg-gray-100/50 relative  mx-3 my-2 py-4 rounded-2xl px-5">
        {/* {(item.recharge_amount || item.rs || item.amount) == 349 && (
          <p
            // style={{ backgroundColor: primaryColor, fontSize: Width * 0.03 }}
            className="absolute text-white px-3 py-1 rounded-full tracking-wider left-3 -top-1.5"
          >
            Bestseller
          </p>
        )} */}
        <div className="flex  flex-row  justify-between ">
          <div className="flex-1 ">
            <div
              onClick={() => {
                handleProcess({
                  plans: item,
                });
              }}
              className="flex border-b border-gray-300 pb-3 mb-3 flex-row items-center justify-between"
            >
              <p
                // style={{ fontFamily: LatoBold, fontSize: Width * 0.05 }}
                className="text-black  pr-5  text-[16px]   font-black"
              >
                ₹{item.recharge_amount || item.rs || item.amount}
              </p>
              <div>
                <p
                  //   style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
                  className="text-black text-[10px]  pr-5 tracking-widest"
                >
                  Data
                </p>
                <p
                  //   style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
                  className="text-black  pr-5  text-xs  font-semibold"
                >
                  {item.data || item.recharge_data || item.dataBenefit || "N/A"}
                </p>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div>
                  <p
                    // style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
                    className="text-black text-[10px] pr-5 tracking-widest"
                  >
                    Validity
                  </p>
                  <p
                    // style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
                    className="text-black text-xs  font-semibold"
                  >
                    {item.recharge_validity || item.validity}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              {item.planBenefitItemList && (
                <div className="flex flex-row">
                  {item.planBenefitItemList?.map((item, index) => (
                    <img
                      key={index}
                      src={item.logoUrl || COMPANY_LOGO}
                      width={25}
                      style={{
                        // width: Width * 0.08,
                        // height: Width * 0.08,
                        borderRadius: 100,
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "lightgray",
                        padding: 2,
                        marginLeft: -8,
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="">
                <p className="text-red-600 text-[10px]  font-semibold">Per Day Cost : ₹ {((item.recharge_amount || item.rs || item.amount)/(item.recharge_validity || item.validity)).toLocaleString()}</p>
              </div>
              <p
                onClick={() =>
                  setShowDesc({
                    status: !showDesc.status,
                    id: item.rs,
                  })
                }
                className="rounded-full text-[8px] bg-gray-200/70 px-3 py-1"
                // style={{ fontSize: Width * 0.03, color: "gray" }}
              >
                {showDesc.status ? "Show Less" : "Show More"}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {showDesc.status && showDesc.id == item?.rs && (
            <div className="mt-4">
              <p
                // style={{ fontSize: Width * 0.03 }}
                className="text-gray-600 pb-2 text-[10px]"
              >
                Details :{" "}
                {item.recharge_desc || item.desc || item.planDescription}
              </p>
              {item.planBenefitItemList && (
                <div>
                  <p className="text-gray-600 text-[10px] my-2 border-t pt-2 border-gray-200">
                    Additional Benefits
                  </p>

                  {item.planBenefitItemList?.map((a) => {
                    return (
                      <div className="flex mb-2 ml-1 flex-row items-center space-x-2">
                        <img
                          width={30}
                          src={a.logoUrl || COMPANY_LOGO}
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
                        <p className="text-gray-600 text-[10px] flex-wrap">
                          {a.displayName}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BrowsePlans = () => {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState();
  console.log(plans, 'plans')
  const [selectedPlan, setSelectedPlan] = useState();
  const [types, setTypes] = useState();
  const [selectedType, setSelectedType] = useState(); //
  const [filteredPlans, setFilteredPlans] = useState();
  const [search, setSearch] = useState(null);
  const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);
  const { loader } = useSelector((state) => state.RechargeSlice.getPlans);
  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
  const navigate = useNavigate();
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFilteredPlans(
      plans.filter((plan) => (plan.planTab || plan.Type) === type)
    );
  };
  const handleGetPlans = async () => {
    if (
      !rechargeData.mobileNumber ||
      !rechargeData.operator ||
      !rechargeData.circle
    ) {
      ToastComp({ message: "Please Select Required Fields", type: "error" });
      return; // Prevent further execution
    }

    const Circle_Code = rechargeData.circle.circlecode;
    const Operator_Code = rechargeData.operator.OperatorCode;
    const MobileNumber = rechargeData.mobileNumber;

    try {
      const res = await dispatch(
        getMobileRechargePlan({ Circle_Code, Operator_Code, MobileNumber })
      );

      if (res.payload && res.payload.Data?.length > 0) {
        // Update plans
        setPlans(res.payload.Data);
        const typ = [
          ...new Set(res.payload.Data.map((plan) => plan.planTab || plan.Type)),
        ];
        setTypes(typ);
        setSelectedType(typ[0]);
        const filtPlan = res.payload.Data.filter(
          (plan) => (plan.planTab || plan.Type) === typ[0]
        );
        setFilteredPlans(filtPlan);
      } else {
        ToastComp({ message: "Error in Plan Fetching", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      ToastComp({
        message: "Something went wrong while fetching plans.",
        type: "error",
      });
    }
  };
  const handleProcess = ({ plans }) => {
    if (
      !rechargeData.mobileNumber ||
      !rechargeData.operator ||
      !(plans || rechargeData.plans)
    ) {
      ToastComp({ message: "Please Enter Details", type: "error" });
    } else {
      const updatedRechargeData = {
        ...rechargeData,
        plans: plans ? plans : rechargeData.plans,
      };
      dispatch(setRechargeData(updatedRechargeData));
      const data = {
        type: SERVICE,
        amount: plans || rechargeData.plans,
        ids: ids,
        serviceType: MOBILE_RECHARGE,
      };
      dispatch(setPaymentType(data));

      navigate("/paymentconfirm", { state: updatedRechargeData });
    }
  };
  useEffect(() => {
    handleGetPlans();
  }, []);
  // useEffect(() => {
  //   const filteredHai = search
  //     ? plans.filter((a) =>
  //         (a.recharge_amount || a.rs || a.amount)?.toString().includes(search)
  //       )
  //     : filteredPlans;
  //   setFilteredPlans(filteredHai);
  // }, [search]);
  useEffect(() => {
  if (!search) {
    setFilteredPlans(filteredPlans);
    return;
  }

  const lowerSearch = search.toString().toLowerCase().trim();

  const parseDataValue = (dataStr) => {
    if (!dataStr) return 0;
    const match = dataStr.match(/([\d.]+)\s*(GB|MB)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    return unit === "GB" ? value * 1024 : value; // convert GB to MB
  };

  const searchDataValue = parseDataValue(lowerSearch);

  const rankedPlans = plans
    .map(plan => {
      let rank = 0;

      // Exact match for amount
      if (plan.amount && plan.amount.toString() === lowerSearch) rank += 10;

      // Exact match for validity
      if (plan.validity && plan.validity.includes(lowerSearch)) rank += 5;

      // Exact match for data
      if (plan.data) {
        const planDataValue = parseDataValue(plan.data);
        if (searchDataValue && planDataValue === searchDataValue) {
          rank += 15; // data exact match highest priority
        } else if (plan.data.toLowerCase().includes(lowerSearch)) {
          rank += 8; // partial match
        }
      }

      // Partial match in description or planName
      if (plan.desc && plan.desc.toLowerCase().includes(lowerSearch)) rank += 2;
      if (plan.planName && plan.planName.toLowerCase().includes(lowerSearch)) rank += 2;

      return { ...plan, rank };
    })
    // Include only plans with some match
    .filter(plan => plan.rank > 0)
    // Sort descending by rank
    .sort((a, b) => b.rank - a.rank);

  setFilteredPlans(rankedPlans);
}, [search, plans]);
  return (
    <div className="flex flex-col h-screen ">
      {/* Fixed top bar */}
      <div className="fixed top-0 w-full bg-white shadow h-16 p-2 z-10">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            <div
              onClick={() => {
                dispatch(resetRechargeData());
                navigate("/mobile");
              }}
              className="bg-gray-100 p-2 rounded-lg"
            >
              <MdOutlineArrowBack size={25} color={primaryColor} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-xl">
                <img src={rechargeData.operator.img} width={25} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p
                    style={{ fontSize: 12 }}
                    className="text-gray-600 font-semibold"
                  >
                    {rechargeData.mobileNumber} -
                  </p>
                  <p style={{ fontSize: 12 }} className="text-gray-600">
                    {rechargeData.operator.OperatorName}
                  </p>
                </div>
                <p style={{ fontSize: 10 }} className="text-gray-600">
                  {rechargeData.circle.circlename}
                </p>
              </div>
            </div>
          </div>
          <p
            onClick={() => navigate("/OperatorAndCircle")}
            className="border text-[10px] tracking-wide border-gray-300 p-1.5 rounded-full px-3"
          >
            Change
          </p>
        </div>
      </div>

      {/* Scrollable content below the fixed top bar */}
      <div className="pt-18 flex-1 overflow-y-auto">
        <div className="px-2">
          <SearchBarComp
            setFunc={setSearch}
            placeholder={"Search for a Plan, eg 239, 719"}
          />
        </div>
        <div className="flex p-2 whitespace-nowrap overflow-x-auto items-center space-x-3">
          {types?.map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: selectedType === item ? primaryColor : "white",
                color: selectedType === item ? "white" : primaryColor,
              }}
              className="text-xs rounded-full px-2.5 py-1.5 cursor-pointer"
              onClick={() => handleTypeChange(item)}
            >
              <p className="tracking-wider text-[10px]">
                {item?.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
        <div className="overflow-y-auto mb-20">
          {filteredPlans?.map((item) => (
            <CardDesign
              key={item.id}
              item={item}
              setRechargeData={setRechargeData}
              rechargeData={rechargeData}
              handleProcess={handleProcess}
            />
          ))}
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default BrowsePlans;

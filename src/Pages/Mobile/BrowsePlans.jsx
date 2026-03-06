// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import CommonHeader from "../../Components/CommonHeader";
// import { MdOutlineArrowBack } from "react-icons/md";
// import { primaryColor } from "../../Utils/Style";
// import { useDispatch, useSelector } from "react-redux";
// import ToastComp from "../../Components/ToastComp";
// import {
//   getMobileRechargePlan,
//   resetRechargeData,
//   setRechargeData,
// } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
// import SearchBarComp from "../../Components/SearchBarComp";
// import { COMPANY_LOGO, MOBILE_RECHARGE, SERVICE } from "../../Utils/Constant";
// import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
// import Loader from "../../Components/Loader";

// const CardDesign = ({ item, rechargeData, handleProcess }) => {
//   const [showDesc, setShowDesc] = useState({
//     status: false,
//     id: "",
//   });
//   return (
//     <div>
//       <div className=" bg-gray-100/50 relative  mx-3 my-2 py-4 rounded-2xl px-5">
//         <div className="flex  flex-row  justify-between ">
//           <div className="flex-1 ">
//             <div
//               onClick={() => {
//                 handleProcess({
//                   plans: item,
//                 });
//               }}
//               className="flex border-b border-gray-300 pb-3 mb-3 flex-row items-center justify-between"
//             >
//               <p
//                 // style={{ fontFamily: LatoBold, fontSize: Width * 0.05 }}
//                 className="text-black  pr-5  text-[16px]   font-black"
//               >
//                 ₹{item.recharge_amount || item.rs || item.amount}
//               </p>
//               <div>
//                 <p
//                   //   style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
//                   className="text-black text-[10px]  pr-5 tracking-widest"
//                 >
//                   Data
//                 </p>
//                 <p
//                   //   style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
//                   className="text-black  pr-5  text-xs  font-semibold"
//                 >
//                   {item.data || item.recharge_data || item.dataBenefit || "N/A"}
//                 </p>
//               </div>
//               <div className="flex flex-row items-center space-x-2">
//                 <div>
//                   <p
//                     // style={{ fontFamily: LatoBold, fontSize: Width * 0.02 }}
//                     className="text-black text-[10px] pr-5 tracking-widest"
//                   >
//                     Validity
//                   </p>
//                   <p
//                     // style={{ fontFamily: LatoBold, fontSize: Width * 0.035 }}
//                     className="text-black text-xs  font-semibold"
//                   >
//                     {item.recharge_validity || item.validity}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-row items-center justify-between">
//               {item.planBenefitItemList && (
//                 <div className="flex flex-row">
//                   {item.planBenefitItemList?.map((item, index) => (
//                     <img
//                       key={index}
//                       src={item.logoUrl || COMPANY_LOGO}
//                       width={25}
//                       style={{
//                         // width: Width * 0.08,
//                         // height: Width * 0.08,
//                         borderRadius: 100,
//                         backgroundColor: "white",
//                         borderWidth: 1,
//                         borderColor: "lightgray",
//                         padding: 2,
//                         marginLeft: -8,
//                       }}
//                     />
//                   ))}
//                 </div>
//               )}
//               {item.perDayCost !== "N/A" && (
//                 <div className="">
//                   <p className="text-red-600 text-[10px]  font-semibold">
//                     Per Day Cost : ₹{item.perDayCost}
//                   </p>
//                 </div>
//               )}

//               <p
//                 onClick={() =>
//                   setShowDesc({
//                     status: !showDesc.status,
//                     id: item.rs,
//                   })
//                 }
//                 className="rounded-full text-[8px] bg-gray-200/70 px-3 py-1"
//                 // style={{ fontSize: Width * 0.03, color: "gray" }}
//               >
//                 {showDesc.status ? "Show Less" : "Show More"}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="space-y-1">
//           {showDesc.status && showDesc.id == item?.rs && (
//             <div className="mt-4">
//               <p
//                 // style={{ fontSize: Width * 0.03 }}
//                 className="text-gray-600 pb-2 text-[10px]"
//               >
//                 Details :{" "}
//                 {item.recharge_desc || item.desc || item.planDescription}
//               </p>
//               {item.planBenefitItemList && (
//                 <div>
//                   <p className="text-gray-600 text-[10px] my-2 border-t pt-2 border-gray-200">
//                     Additional Benefits
//                   </p>

//                   {item.planBenefitItemList?.map((a) => {
//                     return (
//                       <div className="flex mb-2 ml-1 flex-row items-center space-x-2">
//                         <img
//                           width={30}
//                           src={a.logoUrl || COMPANY_LOGO}
//                           style={{
//                             // width: Width * 0.08,
//                             // height: Width * 0.08,
//                             borderRadius: 100,
//                             backgroundColor: "white",
//                             borderWidth: 1,
//                             borderColor: "lightgray",
//                             padding: 2,
//                             marginLeft: -10,
//                           }}
//                         />
//                         <p className="text-gray-600 text-[10px] flex-wrap">
//                           {a.displayName}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const BrowsePlans = () => {
//   const dispatch = useDispatch();
//   const [plans, setPlans] = useState();
//   const [selectedPlan, setSelectedPlan] = useState();
//   const [types, setTypes] = useState();
//   const [selectedType, setSelectedType] = useState(); //
//   const [filteredPlans, setFilteredPlans] = useState();
//   const [search, setSearch] = useState(null);
//   const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);
//   const { loader } = useSelector((state) => state.RechargeSlice.getPlans);
//   const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
//   const navigate = useNavigate();
//   const handleTypeChange = (type) => {
//     setSelectedType(type);
//     setFilteredPlans(
//       plans.filter((plan) => (plan.planTab || plan.Type) === type)
//     );
//   };
//   const handleGetPlans = async () => {
//     if (
//       !rechargeData.mobileNumber ||
//       !rechargeData.operator ||
//       !rechargeData.circle
//     ) {
//       ToastComp({ message: "Please Select Required Fields", type: "error" });
//       return; // Prevent further execution
//     }

//     const Circle_Code = rechargeData.circle.circlecode;
//     const Operator_Code = rechargeData.operator.OperatorCode;
//     const MobileNumber = rechargeData.mobileNumber;

//     try {
//       const res = await dispatch(
//         getMobileRechargePlan({ Circle_Code, Operator_Code, MobileNumber })
//       );

//       if (res.payload && res.payload.Data?.length > 0) {
//         // Update plans
//         setPlans(res.payload.Data);
//         const typ = [
//           ...new Set(res.payload.Data.map((plan) => plan.planTab || plan.Type)),
//         ];
//         setTypes(typ);
//         setSelectedType(typ[0]);
//         const filtPlan = res.payload.Data.filter(
//           (plan) => (plan.planTab || plan.Type) === typ[0]
//         );
//         setFilteredPlans(filtPlan);
//       } else {
//         ToastComp({ message: "Error in Plan Fetching", type: "error" });
//       }
//     } catch (error) {
//       ToastComp({
//         message: "Something went wrong while fetching plans.",
//         type: "error",
//       });
//     }
//   };
//   const handleProcess = ({ plans }) => {
//     if (
//       !rechargeData.mobileNumber ||
//       !rechargeData.operator ||
//       !(plans || rechargeData.plans)
//     ) {
//       ToastComp({ message: "Please Enter Details", type: "error" });
//     } else {
//       const updatedRechargeData = {
//         ...rechargeData,
//         plans: plans ? plans : rechargeData.plans,
//       };
//       dispatch(setRechargeData(updatedRechargeData));
//       const data = {
//         type: SERVICE,
//         amount: plans || rechargeData.plans,
//         ids: ids,
//         serviceType: MOBILE_RECHARGE,
//       };
//       dispatch(setPaymentType(data));

//       navigate("/paymentconfirm", { state: updatedRechargeData });
//     }
//   };
//   useEffect(() => {
//     handleGetPlans();
//   }, []);
//   // useEffect(() => {
//   //   const filteredHai = search
//   //     ? plans.filter((a) =>
//   //         (a.recharge_amount || a.rs || a.amount)?.toString().includes(search)
//   //       )
//   //     : filteredPlans;
//   //   setFilteredPlans(filteredHai);
//   // }, [search]);
//   useEffect(() => {
//     if (!search) {
//       setFilteredPlans(filteredPlans);
//       return;
//     }

//     const lowerSearch = search.toString().toLowerCase().trim();

//     const parseDataValue = (dataStr) => {
//       if (!dataStr) return 0;
//       const match = dataStr.match(/([\d.]+)\s*(GB|MB)/i);
//       if (!match) return 0;
//       const value = parseFloat(match[1]);
//       const unit = match[2].toUpperCase();
//       return unit === "GB" ? value * 1024 : value; // convert GB to MB
//     };

//     const searchDataValue = parseDataValue(lowerSearch);

//     const rankedPlans = plans
//       .map((plan) => {
//         let rank = 0;

//         // Exact match for amount
//         if (plan.amount && plan.amount.toString() === lowerSearch) rank += 10;

//         // Exact match for validity
//         if (plan.validity && plan.validity.includes(lowerSearch)) rank += 5;

//         // Exact match for data
//         if (plan.data) {
//           const planDataValue = parseDataValue(plan.data);
//           if (searchDataValue && planDataValue === searchDataValue) {
//             rank += 15; // data exact match highest priority
//           } else if (plan.data.toLowerCase().includes(lowerSearch)) {
//             rank += 8; // partial match
//           }
//         }

//         // Partial match in description or planName
//         if (plan.desc && plan.desc.toLowerCase().includes(lowerSearch))
//           rank += 2;
//         if (plan.planName && plan.planName.toLowerCase().includes(lowerSearch))
//           rank += 2;

//         return { ...plan, rank };
//       })
//       // Include only plans with some match
//       .filter((plan) => plan.rank > 0)
//       // Sort descending by rank
//       .sort((a, b) => b.rank - a.rank);

//     setFilteredPlans(rankedPlans);
//   }, [search, plans]);
//   return (
//     <div className="flex flex-col h-screen ">
//       {/* Fixed top bar */}
//       <div className="fixed top-0 w-full bg-white shadow h-16 p-2 z-10">
//         <div className="flex items-center justify-between h-full">
//           <div className="flex items-center space-x-3">
//             <div
//               onClick={() => {
//                 dispatch(resetRechargeData());
//                 navigate("/mobile");
//               }}
//               className="bg-gray-100 p-2 rounded-lg"
//             >
//               <MdOutlineArrowBack size={25} color={primaryColor} />
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="bg-white p-2 rounded-xl">
//                 <img src={rechargeData.operator.img} width={25} />
//               </div>
//               <div>
//                 <div className="flex items-center space-x-2">
//                   <p
//                     style={{ fontSize: 12 }}
//                     className="text-gray-600 font-semibold"
//                   >
//                     {rechargeData.mobileNumber} -
//                   </p>
//                   <p style={{ fontSize: 12 }} className="text-gray-600">
//                     {rechargeData.operator.OperatorName}
//                   </p>
//                 </div>
//                 <p style={{ fontSize: 10 }} className="text-gray-600">
//                   {rechargeData.circle.circlename}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <p
//             onClick={() => navigate("/OperatorAndCircle")}
//             className="border text-[10px] tracking-wide border-gray-300 p-1.5 rounded-full px-3"
//           >
//             Change
//           </p>
//         </div>
//       </div>

//       {/* Scrollable content below the fixed top bar */}
//       <div className="pt-18 flex-1 overflow-y-auto">
//         <div className="px-2">
//           <SearchBarComp
//             setFunc={setSearch}
//             placeholder={"Search for a Plan, eg 239, 719"}
//           />
//         </div>
//         <div className="flex p-2 whitespace-nowrap overflow-x-auto items-center space-x-3">
//           {types?.map((item) => (
//             <div
//               key={item}
//               style={{
//                 backgroundColor: selectedType === item ? primaryColor : "white",
//                 color: selectedType === item ? "white" : primaryColor,
//               }}
//               className="text-xs rounded-full px-2.5 py-1.5 cursor-pointer"
//               onClick={() => handleTypeChange(item)}
//             >
//               <p className="tracking-wider text-[10px]">
//                 {item?.toUpperCase()}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="overflow-y-auto mb-20">
//           {filteredPlans?.map((item) => (
//             <CardDesign
//               key={item.id}
//               item={item}
//               setRechargeData={setRechargeData}
//               rechargeData={rechargeData}
//               handleProcess={handleProcess}
//             />
//           ))}
//         </div>
//       </div>
//       {loader && <Loader />}
//     </div>
//   );
// };

// export default BrowsePlans;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import { MdOutlineArrowBack, MdCheckCircle } from "react-icons/md";
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

  const amount = item.recharge_amount || item.rs || item.amount;
  const data = item.data || item.recharge_data || item.dataBenefit || "N/A";
  const validity = item.recharge_validity || item.validity;
  const description = item.recharge_desc || item.desc || item.planDescription;

  return (
    <div className="mb-3 px-3 animate-card-appear">
      <div className="border-theme bg-theme-card shadow-theme-card rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-200">
        {/* Main Content */}
        <div
          onClick={() => handleProcess({ plans: item })}
          className="p-5 cursor-pointer active:scale-[0.98] transition-transform"
        >
          {/* Top Section - Amount & Key Info */}
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-theme">
            {/* Amount */}
            <div className="flex-shrink-0">
              <div className="inline-flex  items-baseline bg-gradient-to-br from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl shadow-md bg-theme-card-2">
                <span className="text-2xl font-black ">₹{amount}</span>
              </div>
            </div>

            {/* Data & Validity */}
            <div className="flex gap-4 ml-4">
              {/* Data */}
              <div className="text-right">
                <p className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold mb-1">
                  Data
                </p>
                <p className="text-base font-bold text-theme-primary">{data}</p>
              </div>

              {/* Validity */}
              <div className="text-right">
                <p className="text-[10px] text-theme-muted uppercase tracking-wider font-semibold mb-1">
                  Validity
                </p>
                <p className="text-base font-bold text-theme-primary">
                  {validity}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section - Additional Info */}
          <div className="flex items-center justify-between">
            {/* Benefit Icons */}
            {item.planBenefitItemList &&
              item.planBenefitItemList.length > 0 && (
                <div className="flex items-center -space-x-2">
                  {item.planBenefitItemList
                    .slice(0, 4)
                    .map((benefit, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full bg-theme-card border-2 border-theme p-1 shadow-sm"
                      >
                        <img
                          src={benefit.logoUrl || COMPANY_LOGO}
                          alt="benefit"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                  {item.planBenefitItemList.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-theme flex items-center justify-center text-[10px] font-bold text-purple-700">
                      +{item.planBenefitItemList.length - 4}
                    </div>
                  )}
                </div>
              )}

            <div className="flex items-center gap-3">
              {/* Per Day Cost */}
              {item.perDayCost && item.perDayCost !== "N/A" && (
                <div className="bg-red-50 px-3 py-1.5 rounded-lg">
                  <p className="text-[10px] text-red-600 font-bold">
                    ₹{item.perDayCost}/day
                  </p>
                </div>
              )}

              {/* Show More Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDesc({
                    status: !showDesc.status,
                    id: item.rs,
                  });
                }}
                className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                {showDesc.status && showDesc.id === item.rs
                  ? "Less ▲"
                  : "More ▼"}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        {showDesc.status && showDesc.id === item.rs && (
          <div className="px-5 pb-5 pt-0 border-t border-theme bg-theme-card shadow-theme-card animate-expand">
            {/* Description */}
            <div className="mt-4 mb-4">
              <p className="text-xs font-semibold text-theme-secondary mb-2">
                Plan Details:
              </p>
              <p className="text-xs text-theme-secondary leading-relaxed">
                {description}
              </p>
            </div>

            {/* Additional Benefits */}
            {item.planBenefitItemList &&
              item.planBenefitItemList.length > 0 && (
                <div className="pt-3 border-t border-theme">
                  <p className="text-xs font-semibold text-theme-secondary mb-3">
                    Additional Benefits:
                  </p>
                  <div className="space-y-2">
                    {item.planBenefitItemList.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border border-theme bg-theme-card shadow-theme-card p-2 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-lg bg-theme-card-2 border border-theme p-1 flex-shrink-0">
                          <img
                            src={benefit.logoUrl || COMPANY_LOGO}
                            alt={benefit.displayName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-theme-secondary font-medium flex-1">
                          {benefit.displayName}
                        </p>
                        <MdCheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

const BrowsePlans = () => {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState();
  const [selectedPlan, setSelectedPlan] = useState();
  const [types, setTypes] = useState();
  const [selectedType, setSelectedType] = useState();
  const [filteredPlans, setFilteredPlans] = useState();
  const [search, setSearch] = useState(null);
  const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);
  const { loader } = useSelector((state) => state.RechargeSlice.getPlans);
  const { ids } = useSelector((state) => state.PaymentSlice.PaymentType);
  const navigate = useNavigate();

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFilteredPlans(
      plans.filter((plan) => (plan.planTab || plan.Type) === type),
    );
  };

  const handleGetPlans = async () => {
    if (
      !rechargeData.mobileNumber ||
      !rechargeData.operator ||
      !rechargeData.circle
    ) {
      ToastComp({ message: "Please Select Required Fields", type: "error" });
      return;
    }

    const Circle_Code = rechargeData.circle.circlecode;
    const Operator_Code = rechargeData.operator.OperatorCode;
    const MobileNumber = rechargeData.mobileNumber;

    try {
      const res = await dispatch(
        getMobileRechargePlan({ Circle_Code, Operator_Code, MobileNumber }),
      );

      if (res.payload && res.payload.Data?.length > 0) {
        setPlans(res.payload.Data);
        const typ = [
          ...new Set(res.payload.Data.map((plan) => plan.planTab || plan.Type)),
        ];
        setTypes(typ);
        setSelectedType(typ[0]);
        const filtPlan = res.payload.Data.filter(
          (plan) => (plan.planTab || plan.Type) === typ[0],
        );
        setFilteredPlans(filtPlan);
      } else {
        ToastComp({ message: "Error in Plan Fetching", type: "error" });
      }
    } catch (error) {
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
      return unit === "GB" ? value * 1024 : value;
    };

    const searchDataValue = parseDataValue(lowerSearch);

    const rankedPlans = plans
      .map((plan) => {
        let rank = 0;

        if (plan.amount && plan.amount.toString() === lowerSearch) rank += 10;
        if (plan.validity && plan.validity.includes(lowerSearch)) rank += 5;

        if (plan.data) {
          const planDataValue = parseDataValue(plan.data);
          if (searchDataValue && planDataValue === searchDataValue) {
            rank += 15;
          } else if (plan.data.toLowerCase().includes(lowerSearch)) {
            rank += 8;
          }
        }

        if (plan.desc && plan.desc.toLowerCase().includes(lowerSearch))
          rank += 2;
        if (plan.planName && plan.planName.toLowerCase().includes(lowerSearch))
          rank += 2;

        return { ...plan, rank };
      })
      .filter((plan) => plan.rank > 0)
      .sort((a, b) => b.rank - a.rank);

    setFilteredPlans(rankedPlans);
  }, [search, plans]);

  return (
    <div className="flex bg-theme-base flex-col h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 w-full shadow-md z-50 bg-theme-header backdrop-blur-xl border-b border-theme">
        <div className="px-4 py-3">
          {/* Top Row - Back Button & Change */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                dispatch(resetRechargeData());
                navigate("/mobile");
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <MdOutlineArrowBack size={20} className="text-purple-700" />
              <span className="text-sm font-semibold text-purple-700">
                Back
              </span>
            </button>

            <button
              onClick={() => navigate("/OperatorAndCircle")}
              className="text-xs font-semibold text-purple-600 border-2 border-purple-200 hover:border-purple-300 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              Change
            </button>
          </div>

          {/* Operator Info Card */}
          <div className="rounded-2xl p-3 border border-theme bg-theme-card">
            <div className="flex items-center gap-3">
              <div className="bg-theme-card-2 p-2 rounded-xl shadow-sm">
                <img
                  src={rechargeData.operator.img}
                  alt="operator"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-theme-primary">
                    {rechargeData.mobileNumber}
                  </p>
                  <span className="text-theme-muted">•</span>
                  <p className="text-xs font-semibold text-theme-primary">
                    {rechargeData.operator.OperatorName}
                  </p>
                </div>
                <p className="text-[10px] text-theme-secondary font-medium">
                  {rechargeData.circle.circlename}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-36 pb-6 flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="px-3 my-4">
          <SearchBarComp
            setFunc={setSearch}
            placeholder={"Search amount, data, validity..."}
          />
        </div>

        {/* Plan Type Tabs */}
        <div className="px-3 mb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {types?.map((item) => (
              <button
                key={item}
                onClick={() => handleTypeChange(item)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-xl font-semibold text-[10px] uppercase tracking-wide
                  transition-all duration-300 active:scale-95 border border-theme bg-theme-card
                  ${
                    selectedType === item
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg "
                      : "bg-theme-card text-theme-secondary border-2 border-theme hover:border-purple-300"
                  }
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Plans List */}
        <div className="overflow-y-auto">
          {filteredPlans && filteredPlans.length > 0 ? (
            filteredPlans.map((item, index) => (
              <CardDesign
                key={item.id || index}
                item={item}
                rechargeData={rechargeData}
                handleProcess={handleProcess}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-theme-card-2 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-theme-secondary font-semibold mb-2">No plans found</p>
              <p className="text-sm text-theme-muted text-center">
                Try adjusting your search or select a different plan type
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loader */}
      {loader && (
        <Loader
          loading={loader}
          title="Fetching plans"
          subtitle="Best offers load ho rahe hain…"
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes card-appear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes expand {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-card-appear {
          animation: card-appear 0.3s ease-out;
        }

        .animate-expand {
          animation: expand 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BrowsePlans;

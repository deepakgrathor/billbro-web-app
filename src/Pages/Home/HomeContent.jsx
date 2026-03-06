// import React, { useEffect } from "react";
// import BottomNavigation from "../../Navigation/BottomNavigation";
// import HeaderHome from "./HeaderHome";
// import BannerSlider from "../../Components/BannerSlider";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
// import {
//   MdOutlineAccountBalanceWallet,
//   MdOutlineAddCircleOutline,
//   MdWhatsapp,
//   MdOutlineShare,
// } from "react-icons/md";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   BILL,
//   BRAND_NAME,
//   DTH_RECHARGE,
//   ImageBaseURL,
//   MOBILE_RECHARGE,
//   SERVICE,
// } from "../../Utils/Constant";
// import ServiceSection from "../../Components/ServiceSection";
// import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
// import {
//   getSettingFunc,
//   handleChatWhatsapp,
//   openExternalURL,
//   WhatsappShare,
// } from "../../Utils/CommonFunc";
// import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
// import ButtonComp from "../../Components/ButtonComp";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { Autoplay } from "swiper/modules";
// import { getBannerList } from "../../Redux/Slices/PublicSlice/PublicSlice";
// const HomeContent = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { serviceList, serviceLoader } = useSelector(
//     (state) => state.ServiceSlice.service
//   );
//   const { bannerData, bannerLoader } = useSelector(
//     (state) => state.PublicSlice.bannerList
//   );
//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(fetchServiceList());
//     dispatch(getBannerList({ type: "service" }));
//     dispatch(getUserProfile());
//     getSettingFunc();
//   }, []);
//   const allowedSections = ["recharge", "finance"];

//   let filteredServices = [];
//   let TravelServices = [];
//   let InsuranceServices = [];

//   serviceList.Data?.forEach((a) => {
//     if (a.isShow) {
//       if (allowedSections.includes(a.section)) {
//         filteredServices.push(a);
//       } else if (a.section === "travel") {
//         TravelServices.push(a);
//       } else if (a.section === "insurance") {
//         InsuranceServices.push(a);
//       }
//     }
//   });

//   const MobileServices = filteredServices.slice(0, 7);

//   return (
//     <div className="relative h-screen">
//       <div className="">
//         <div className="fixed  w-full z-50">
//           <HeaderHome ProfileData={ProfileData} />
//         </div>

//         <div className="overflow-y-auto pt-16">
//           {serviceList.Data?.find((a) => a.name === "BANNER_SHOW")?.isShow && (
//             <div className="h-52 ">
//               {bannerLoader ? (
//                 <div className=" m-2 h-full bg-gray-200 animate-pulse rounded-lg"></div>
//               ) : (
//                 <BannerSlider data={bannerData.Data}/>
//               )}
//             </div>
//           )}

//           {/* Wallet & Add Money */}
//           <div className="flex items-center justify-between py-2 pl-2 bg-gray-100/60 m-2  border-blue-700 border-r-4 rounded-xl">
//             <div className="flex items-center space-x-4">
//               <img
//                 width={25}
//                 src="https://ik.imagekit.io/43tomntsa/svgexport-3.png"
//                 alt=""
//               />
//               {/* <MdOutlineAccountBalanceWallet size={35} /> */}
//               <div className="">
//                 <p className="text-[10px] tracking-wider">Wallet Balance</p>
//                 <div className="flex items-center space-x-2">
//                   <p className="font-black text-base">
//                     ₹
//                     {new Intl.NumberFormat("en-IN", {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     }).format(ProfileData?.Data?.wallet?.balance || 0)}
//                   </p>
//                   {ProfileData?.Data?.wallet?.balance <= 10 && (
//                     <p className="text-[8px] tracking-wider bg-red-500 text-white rounded-full px-2 py-0.5">
//                       Low
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div
//               onClick={() => navigate("/wallet")}
//               className="flex  bg-[#1447e6] text-white pl-2 pr-1 py-2 rounded-l-full items-center space-x-2"
//             >
//               <MdOutlineAddCircleOutline size={20} />
//               <p className="text-[10px] tracking-wide">Add Money</p>
//             </div>
//           </div>

//           {/* Support Section */}
//           <div
//             onClick={
//               () => navigate("/contact")
//               // handleChatWhatsapp({
//               //   number: `+91${localStorage.getItem("customerPhone")}`,
//               //   registered_phone: ProfileData?.Data?.phone,
//               // })
//             }
//             className="flex active:scale-90 transition transform duration-200 items-center bg-gray-100 p-2 m-2 rounded-lg justify-center space-x-3"
//           >
//             <MdWhatsapp size={20} />
//             <p className="text-[10px] text-gray-500 tracking-wider">
//               Need Help? Let's Connect with Support
//             </p>
//           </div>

//           {/* Service Section */}
//           <div className="p-2">
//             <p className="font-semibold text-sm">Services</p>
//             <div className="grid grid-cols-4 gap-2 mt-2">
//               {serviceLoader
//                 ? Array(7)
//                     .fill(0)
//                     .map((_, idx) => (
//                       <div
//                         key={idx}
//                         className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse"
//                       >
//                         <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
//                         <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
//                       </div>
//                     ))
//                 : MobileServices?.map((item, idx) => (
//                     <div
//                       onClick={() => {
//                         if (item._id === "64c9e5bf1efc768da459ef00") {
//                           // Mobile
//                           navigate("/mobile", { state: item });
//                           const data = {
//                             type: SERVICE,
//                             ids: item._id,
//                             serviceType: MOBILE_RECHARGE,
//                           };
//                           dispatch(setPaymentType(data));
//                         } else if (item._id === "64c9e5de1efc768da459ef03") {
//                           // DTH
//                           navigate("/dth", { state: item });
//                           const data = {
//                             type: SERVICE,
//                             ids: item._id,
//                             serviceType: DTH_RECHARGE,
//                           };
//                           dispatch(setPaymentType(data));
//                         } else if (item._id === "661061ecda6832bf278254e1") {
//                           // Google

//                           navigate("/googleplay", { state: item });
//                           const data = {
//                             type: SERVICE,
//                             ids: "661061ecda6832bf278254e1",
//                             serviceType: BILL,
//                           };
//                           dispatch(setPaymentType(data));
//                         } else {
//                           // BBPS
//                           navigate("/mainbbps", { state: item });
//                           const data = {
//                             type: SERVICE,
//                             ids: item._id,
//                             serviceType: BILL,
//                           };
//                           dispatch(setPaymentType(data));
//                         }
//                       }}
//                       key={idx}
//                       className="text-center active:scale-90 transition transform duration-200 space-y-2 bg-gray-100/50 p-2 py-4 rounded-md"
//                     >
//                       <img
//                         width={35}
//                         src={`${ImageBaseURL}${item.icon}`}
//                         alt={item.name}
//                         className=" mx-auto"
//                       />
//                       <p className="text-[9px] tracking-wider">{item.name}</p>
//                     </div>
//                   ))}

//               {/* 8th item "See All" */}
//               {serviceLoader ? (
//                 <div className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse">
//                   <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
//                   <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
//                 </div>
//               ) : (
//                 <div
//                   className="flex flex-col items-center space-y-2 justify-center cursor-pointer bg-gray-100/50 p-2 py-4 rounded-md"
//                   onClick={() => navigate("/bbpslist")} // yaha apni state/logic lagao
//                 >
//                   <img
//                     width={30}
//                     className=""
//                     src="https://app.billhub.in/assets/bbps-logo.png"
//                     alt=""
//                   />
//                   <p className="text-[10px] ">See All</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Refer Section */}
//           <div className="bg-blue-300/10 m-2 p-3 rounded-xl border-l-4 border-blue-700">
//             <div className="flex space-x-1 items-center">
//               <img
//                 width={120}
//                 src="https://ik.imagekit.io/43tomntsa/refer.png"
//                 alt=""
//               />
//               <div className="space-y-0.5">
//                 <p className="text-[10px]  text-blue-500">
//                   Invite your friends to {BRAND_NAME}
//                 </p>
//                 <p className="font-bold text-[14px] tracking-wider">
//                   Get Upto ₹15
//                 </p>
//                 <p className="text-[9px] text-gray-500">
//                   When your friend add ₹100 or more to their wallet
//                 </p>
//               </div>
//             </div>
//             <div
//               onClick={() => {
//                 navigate("/refer");
//               }}
//               className="flex space-x-3 items-center mt-2 bg-blue-300/20 p-2 rounded-lg justify-center"
//             >
//               <MdOutlineShare size={20} />
//               <p className="text-[10px] text-gray-600 font-semibold tracking-wider">
//                 Invite a Friend
//               </p>
//             </div>
//           </div>

//           {/* Travel Section */}
//           {/* <ServiceSection
//             title="Travel"
//             services={TravelServices}
//             serviceLoader={serviceLoader}
//             skeletonCount={4}
//           /> */}
//           {/* Insurance Section */}
//           {/* <ServiceSection
//             title="Insurance"
//             services={InsuranceServices}
//             serviceLoader={serviceLoader}
//             skeletonCount={4}
//           /> */}
//           <div className="bg-gray-100 h-32 mb-16 mt-12 p-4 justify-center items-center flex flex-col">
//             <p className="text-center text-4xl text-gray-300 font-semibold tracking-wide">
//               {BRAND_NAME}
//             </p>
//             <p className="text-center text-gray-300 mt-2 text-xs">
//               MADE WITH ❤️ IN INDIA
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="absolute bottom-0 w-full flex items-center justify-center">
//         <BottomNavigation path={location.pathname} />
//       </div>
//     </div>
//   );
// };

// export default HomeContent;

import React, { useEffect, useMemo, useState } from "react";
import BottomNavigation from "../../Navigation/BottomNavigation";
import HeaderHome from "./HeaderHome";
import BannerSlider from "../../Components/BannerSlider";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import {
  MdWhatsapp,
  MdOutlineShare,
  MdTrendingUp,
  MdStar,
  MdArrowForward,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BILL,
  BRAND_NAME,
  DTH_RECHARGE,
  ImageBaseURL,
  MOBILE_RECHARGE,
  SERVICE,
} from "../../Utils/Constant";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import { getSettingFunc } from "../../Utils/CommonFunc";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
import { getBannerList } from "../../Redux/Slices/PublicSlice/PublicSlice";

const HomeContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [referralAmount, setReferralAmount] = useState(0);
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service,
  );
  const { bannerData, bannerLoader } = useSelector(
    (state) => state.PublicSlice.bannerList,
  );
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);

  useEffect(() => {
    dispatch(fetchServiceList());
    dispatch(getBannerList({ type: "service" }));
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleGetReferAmount = async () => {
    const settings = await getSettingFunc();
    setReferralAmount(settings?.referAmount || 0);
  };

  useEffect(() => {
    handleGetReferAmount();
  }, []);

  const allowedSections = ["recharge", "finance"];

  const { MobileServices, TravelServices, InsuranceServices, showBanner } =
    useMemo(() => {
      let filtered = [];
      let travel = [];
      let insurance = [];

      const data = serviceList?.Data || [];
      data.forEach((a) => {
        if (a?.isShow) {
          if (allowedSections.includes(a.section)) filtered.push(a);
          else if (a.section === "travel") travel.push(a);
          else if (a.section === "insurance") insurance.push(a);
        }
      });

      const bannerFlag = data?.find((a) => a?.name === "BANNER_SHOW")?.isShow;

      return {
        MobileServices: filtered.slice(0, 7),
        TravelServices: travel,
        InsuranceServices: insurance,
        showBanner: !!bannerFlag,
      };
    }, [serviceList]);

  const handleServiceClick = (item) => {
    if (item._id === "64c9e5bf1efc768da459ef00") {
      navigate("/mobile", { state: item });
      const data = {
        type: SERVICE,
        ids: item._id,
        serviceType: MOBILE_RECHARGE,
      };
      dispatch(setPaymentType(data));
    } else if (item._id === "64c9e5de1efc768da459ef03") {
      navigate("/dth", { state: item });
      const data = { type: SERVICE, ids: item._id, serviceType: DTH_RECHARGE };
      dispatch(setPaymentType(data));
    } else if (item._id === "661061ecda6832bf278254e1") {
      navigate("/googleplay", { state: item });
      const data = {
        type: SERVICE,
        ids: "661061ecda6832bf278254e1",
        serviceType: BILL,
      };
      dispatch(setPaymentType(data));
    } else {
      navigate("/mainbbps", { state: item });
      const data = { type: SERVICE, ids: item._id, serviceType: BILL };
      dispatch(setPaymentType(data));
    }
  };

  const walletBalance = ProfileData?.Data?.wallet?.balance?.toFixed(2) || "0";

  // Section visibility check
  const isRechargeEnabled = serviceList?.Data?.find(
    (a) => a.name === "RECHARGE_SECTION",
  )?.isShow;

  const isBillPaymentEnabled = serviceList?.Data?.find(
    (a) => a.name === "BILL_PAYMENT_SECTION",
  )?.isShow;

  // Services को filter करें based on section
  const filteredServices = MobileServices?.filter((service) => {
    // Individual service check
    if (!service.isShow) return false;

    // Section wise filter
    if (service.section === "recharge" && !isRechargeEnabled) return false;
    if (service.section === "finance" && !isBillPaymentEnabled) return false;

    return true;
  });

  // Section तभी show करें जब कोई service हो
  const showSection = filteredServices?.length > 0;

  return (
    <div className="min-h-screen bg-theme-base">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-theme-header backdrop-blur-xl border-b border-theme">
        <HeaderHome ProfileData={ProfileData} />
      </div>

      {/* Page Container (Mobile-first) */}
      <div className="mx-auto w-full max-w-[520px] px-2 pt-2 pb-[calc(96px+env(safe-area-inset-bottom))]">
        {/* Banner */}
        {showBanner && (
          <section className="mb-5">
            {bannerLoader ? (
              <div className="h-44 rounded-3xl bg-theme-card-2 animate-pulse shadow-sm" />
            ) : (
              <div className="rounded-3xl overflow-hidden border border-theme shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
                <BannerSlider data={bannerData?.Data} />
              </div>
            )}
          </section>
        )}

        {/* Wallet Card */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-theme bg-theme-card shadow-theme-card">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-fuchsia-600/10 to-sky-600/10" />
            <div className="relative p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                    <MdAccountBalanceWallet size={24} className="text-white" />
                  </div>

                  <div className="leading-tight">
                    <p className="text-[11px] font-semibold text-theme-secondary">
                      Wallet Balance
                    </p>
                    <p className="text-2xl font-black tracking-tight text-theme-primary">
                      ₹{walletBalance}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/wallet")}
                  className="h-11 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg active:scale-[0.98] transition"
                >
                  Add Money
                </button>
              </div>

              {/* <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Secure payments
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Instant updates
                </span>
              </div> */}
            </div>
          </div>
        </section>

        {/* Quick Services */}
        {/* {serviceList?.Data?.find((a) => a.name === "RECHARGE_SECTION")
          ?.isShow && (
          <section className="mb-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">Payments</p>
                <h2 className="text-lg font-black tracking-tight text-slate-900">
                  Quick Services
                </h2>
              </div>

              <button
                onClick={() => navigate("/bbpslist")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 active:opacity-70"
              >
                See all <MdArrowForward size={16} />
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.08)]">
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {serviceLoader
                    ? Array(8)
                        .fill(0)
                        .map((_, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-200 animate-pulse" />
                            <div className="h-3 w-12 mx-auto rounded bg-slate-200 animate-pulse" />
                          </div>
                        ))
                    : MobileServices?.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleServiceClick(item)}
                          className="group flex flex-col items-center gap-2 active:scale-[0.98] transition"
                        >
                          <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                            <img
                              src={`${ImageBaseURL}${item.icon}`}
                              alt={item.name}
                              className="h-9 w-9 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-slate-700 text-center leading-tight">
                            {item.name}
                          </p>
                        </button>
                      ))}

                  {!serviceLoader && (
                    <button
                      onClick={() => navigate("/bbpslist")}
                      className="group flex flex-col items-center gap-2 active:scale-[0.98] transition"
                    >
                      <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                        <MdArrowForward size={25} />
                        <img
                          src="https://app.billhub.in/assets/bbps-logo.png"
                          alt="Pay Bills"
                          className="h-10 w-10 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-700">
                        Pay Bills
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )} */}
        {showSection && (
          <section className="mb-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-theme-secondary">
                  Payments
                </p>
                <h2 className="text-lg font-black tracking-tight text-theme-primary">
                  Quick Services
                </h2>
              </div>

              {isBillPaymentEnabled && (
                <button
                  onClick={() => navigate("/bbpslist")}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 active:opacity-70"
                >
                  See all <MdArrowForward size={16} />
                </button>
              )}
            </div>

            <div className="rounded-3xl border border-theme bg-theme-card shadow-theme-card">
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {serviceLoader
                    ? Array(8)
                        .fill(0)
                        .map((_, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="h-14 w-14 mx-auto rounded-2xl bg-theme-card-2 animate-pulse" />
                            <div className="h-3 w-12 mx-auto rounded bg-theme-card-2 animate-pulse" />
                          </div>
                        ))
                    : filteredServices?.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleServiceClick(item)}
                          className="group flex flex-col items-center gap-2 active:scale-[0.98] transition"
                        >
                          <div className="h-14 w-14 rounded-2xl border border-theme bg-theme-card-2 shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                            <img
                              src={`${ImageBaseURL}${item.icon}`}
                              alt={item.name}
                              className="h-9 w-9 object-contain"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-theme-secondary text-center leading-tight">
                            {item.name}
                          </p>
                        </button>
                      ))}

                  {/* Pay Bills - only when bill payment enabled */}
                  {!serviceLoader && isBillPaymentEnabled && (
                    <button
                      onClick={() => navigate("/bbpslist")}
                      className="group flex flex-col items-center gap-2 active:scale-[0.98] transition"
                    >
                      <div className="h-14 w-14 rounded-2xl border border-theme bg-theme-card-2 shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                        <div className="h-14 w-14 rounded-2xl border border-theme bg-theme-card-2 shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                          <img
                            src="https://ik.imagekit.io/43tomntsa/B%20mnemonic_PNG.png"
                            alt="Pay Bills"
                            className="h-10 w-10 object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] font-semibold text-theme-secondary">
                        Pay Bills
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Travel / Insurance (Optional sections if available) */}
        {/* {(TravelServices?.length > 0 || InsuranceServices?.length > 0) && (
          <section className="mb-6 space-y-5">
            {TravelServices?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-black text-slate-900">
                    Travel
                  </h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {TravelServices.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleServiceClick(item)}
                      className="min-w-[160px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm active:scale-[0.99] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500/15 to-indigo-500/15 border border-slate-200 flex items-center justify-center">
                          <img
                            src={`${ImageBaseURL}${item.icon}`}
                            alt={item.name}
                            className="h-8 w-8 object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-extrabold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Tap to continue
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {InsuranceServices?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-black text-slate-900">
                    Insurance
                  </h3>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {InsuranceServices.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleServiceClick(item)}
                      className="min-w-[160px] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm active:scale-[0.99] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-slate-200 flex items-center justify-center">
                          <img
                            src={`${ImageBaseURL}${item.icon}`}
                            alt={item.name}
                            className="h-8 w-8 object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-extrabold text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Quick & secure
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )} */}

        {/* Refer & Earn */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-[28px] border border-theme bg-theme-card shadow-theme-card">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-fuchsia-600/10 to-sky-600/10" />
            <div className="relative p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br  from-indigo-600 to-fuchsia-600 border border-white/20 flex items-center justify-center">
                    <img
                      src="https://ik.imagekit.io/43tomntsa/refer.png"
                      alt="Refer"
                      className="h-10 w-10 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-[12px] font-semibold text-slate-500">
                      Invite friends to{" "}
                      <span className="font-black text-slate-500">
                        {BRAND_NAME}
                      </span>
                    </p>
                    <p className="text-[20px] font-black text-theme-primary">
                      Earn ₹{referralAmount} instantly
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-200 border border-gray-300 px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-800" />
                      <span className="text-[10px] font-semibold text-black/90">
                        No limit on invites
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/refer")}
                  className="shrink-0 rounded-2xl  bg-black text-white px-4 py-3 text-sm font-extrabold shadow-lg active:scale-[0.98] transition inline-flex items-center gap-2"
                >
                  <MdOutlineShare size={18} />
                  Invite
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="mb-6">
          <button
            onClick={() => navigate("/contact")}
            className="w-full rounded-3xl border border-emerald-200 bg-theme-card shadow-theme-card p-4 flex items-center gap-4 active:scale-[0.99] transition"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <MdWhatsapp size={26} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-black text-theme-primary">
                Need help?
              </p>
              <p className="text-xs text-theme-secondary">
                Chat with our support team
              </p>
            </div>
            <MdArrowForward size={20} className="text-theme-muted" />
          </button>
        </section>

        {/* Why Choose Us */}
        <section className="mb-8">
          <div className="mb-3">
            <p className="text-xs font-semibold text-theme-secondary">Trust</p>
            <h2 className="text-lg font-black tracking-tight text-theme-primary">
              Why choose us
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-theme bg-theme-card p-4 shadow-theme-card">
              <div className="h-11 w-11 rounded-2xl bg-indigo-600/10 border border-theme flex items-center justify-center mb-3">
                <MdTrendingUp size={24} className="text-indigo-700" />
              </div>
              <p className="text-sm font-black text-theme-primary">Instant</p>
              <p className="text-xs text-theme-secondary mt-1">
                Fast transactions, minimal steps
              </p>
            </div>

            <div className="rounded-3xl border border-theme bg-theme-card p-4 shadow-theme-card">
              <div className="h-11 w-11 rounded-2xl bg-fuchsia-600/10 border border-theme flex items-center justify-center mb-3">
                <MdStar size={24} className="text-fuchsia-700" />
              </div>
              <p className="text-sm font-black text-theme-primary">Rewards</p>
              <p className="text-xs text-theme-secondary mt-1">
                Benefits on recharges & bills
              </p>
            </div>

            <div className="rounded-3xl border border-theme bg-theme-card p-4 shadow-theme-card">
              <div className="h-11 w-11 rounded-2xl bg-emerald-600/10 border border-theme flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-emerald-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-black text-theme-primary">Secure</p>
              <p className="text-xs text-theme-secondary mt-1">
                Encrypted & protected payments
              </p>
            </div>

            <div className="rounded-3xl border border-theme bg-theme-card p-4 shadow-theme-card">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-theme flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-amber-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <p className="text-sm font-black text-theme-primary">Trusted</p>
              <p className="text-xs text-theme-secondary mt-1">
                Loved by growing users
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="rounded-3xl border border-theme bg-theme-card p-6 shadow-theme-card">
          <div className="text-center">
            <p className="text-3xl font-black tracking-tight text-theme-muted">
              {BRAND_NAME}
            </p>
            <p className="text-xs text-theme-secondary mt-2 font-semibold">
              MADE WITH ❤️ IN INDIA
            </p>
          </div>
        </footer>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation path={location.pathname} />
      </div>
    </div>
  );
};

export default HomeContent;

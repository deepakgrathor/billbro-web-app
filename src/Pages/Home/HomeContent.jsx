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

import React, { useEffect } from "react";
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
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );
  const { bannerData, bannerLoader } = useSelector(
    (state) => state.PublicSlice.bannerList
  );
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchServiceList());
    dispatch(getBannerList({ type: "service" }));
    dispatch(getUserProfile());
    getSettingFunc();
  }, []);

  const allowedSections = ["recharge", "finance"];

  let filteredServices = [];
  let TravelServices = [];
  let InsuranceServices = [];

  serviceList.Data?.forEach((a) => {
    if (a.isShow) {
      if (allowedSections.includes(a.section)) {
        filteredServices.push(a);
      } else if (a.section === "travel") {
        TravelServices.push(a);
      } else if (a.section === "insurance") {
        InsuranceServices.push(a);
      }
    }
  });

  const MobileServices = filteredServices.slice(0, 7);

  const handleServiceClick = (item) => {
    if (item._id === "64c9e5bf1efc768da459ef00") {
      // Mobile
      navigate("/mobile", { state: item });
      const data = {
        type: SERVICE,
        ids: item._id,
        serviceType: MOBILE_RECHARGE,
      };
      dispatch(setPaymentType(data));
    } else if (item._id === "64c9e5de1efc768da459ef03") {
      // DTH
      navigate("/dth", { state: item });
      const data = {
        type: SERVICE,
        ids: item._id,
        serviceType: DTH_RECHARGE,
      };
      dispatch(setPaymentType(data));
    } else if (item._id === "661061ecda6832bf278254e1") {
      // Google
      navigate("/googleplay", { state: item });
      const data = {
        type: SERVICE,
        ids: "661061ecda6832bf278254e1",
        serviceType: BILL,
      };
      dispatch(setPaymentType(data));
    } else {
      // BBPS
      navigate("/mainbbps", { state: item });
      const data = {
        type: SERVICE,
        ids: item._id,
        serviceType: BILL,
      };
      dispatch(setPaymentType(data));
    }
  };
  return (
    <div className="relative h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Header */}
      <div className="fixed w-full z-50">
        <HeaderHome ProfileData={ProfileData} />
      </div>

      {/* Scrollable Content */}c
      <div className="overflow-y-auto pt-[70px] pb-20">
        {/* Banner Section */}
        {serviceList.Data?.find((a) => a.name === "BANNER_SHOW")?.isShow && (
          <div className="px-4">
            {bannerLoader ? (
              <div className="h-44 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <BannerSlider data={bannerData.Data} />
              </div>
            )}
          </div>
        )}
        <div className="px-4 pb-4 mt-6">
          <div className=" border bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              {/* Wallet Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MdAccountBalanceWallet size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-medium tracking-wide">
                    Wallet Balance
                  </p>
                  <p className="text-white font-bold text-2xl tracking-wide">
                    ₹{ProfileData.Data?.wallet?.balance.toLocaleString() || "0"}
                  </p>
                </div>
              </div>

              {/* Add Money Button */}
              <button
                onClick={() => navigate("/wallet")}
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 active:scale-95 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions - Services */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></span>
              <span>Quick Services</span>
            </h2>
            <button
              onClick={() => navigate("/bbpslist")}
              className="text-sm font-semibold text-blue-600 flex items-center space-x-1 hover:text-blue-700 transition-colors"
            >
              <span>See All</span>
              <MdArrowForward size={16} />
            </button>
          </div>

          {/* Services Grid */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <div className="grid grid-cols-4 gap-4">
              {serviceLoader
                ? Array(8)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center space-y-2 animate-pulse"
                      >
                        <div className="w-16 h-16 bg-gray-300 rounded-2xl"></div>
                        <div className="h-3 w-12 bg-gray-300 rounded"></div>
                      </div>
                    ))
                : MobileServices?.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleServiceClick(item)}
                      className="flex flex-col items-center space-y-2 cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300 border border-gray-200">
                        <img
                          src={`${ImageBaseURL}${item.icon}`}
                          alt={item.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                        {item.name}
                      </p>
                    </div>
                  ))}

              {/* See All Button */}
              {!serviceLoader && (
                <div
                  onClick={() => navigate("/bbpslist")}
                  className="flex flex-col items-center space-y-2 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 group-active:scale-95 transition-all duration-300 border-2 border-dashed border-gray-400">
                    <img
                      src="https://app.billhub.in/assets/bbps-logo.png"
                      alt="See All"
                      className="w-8 h-8"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-700">
                    See All
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Refer & Earn Card */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 flex items-center justify-between relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center space-x-4">
                <img
                  src="https://ik.imagekit.io/43tomntsa/refer.png"
                  alt="Refer"
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                />
                <div className="space-y-1">
                  <p className="text-white/90 text-[11px] font-medium">
                    Invite friends to {BRAND_NAME}
                  </p>
                  <p className="text-white font-black text-2xl">Get ₹15</p>
                  <p className="text-white/80 text-[9px] leading-relaxed">
                    When they add ₹100 or more
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate("/refer")}
                className="relative z-10 bg-white hover:bg-gray-50 text-purple-600 font-bold px-6 py-3 rounded-xl shadow-xl transition-all duration-300 active:scale-90 flex items-center space-x-2"
              >
                <MdOutlineShare size={20} />
                <span className="text-sm">Invite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="px-4 mt-6">
          <div
            onClick={() => navigate("/contact")}
            className="bg-white rounded-2xl shadow-lg p-4 flex items-center space-x-4 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95 border border-green-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <MdWhatsapp size={26} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Need Help?</p>
              <p className="text-xs text-gray-600">
                Connect with our support team
              </p>
            </div>
            <MdArrowForward size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-4 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
            <span>Why Choose Us?</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <MdTrendingUp size={24} className="text-white" />
              </div>
              <p className="text-white font-bold text-sm">Instant</p>
              <p className="text-white/80 text-xs mt-1">
                Lightning fast transactions
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <MdStar size={24} className="text-white" />
              </div>
              <p className="text-white font-bold text-sm">Rewards</p>
              <p className="text-white/80 text-xs mt-1">
                Earn on every recharge
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-white"
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
              <p className="text-white font-bold text-sm">Secure</p>
              <p className="text-white/80 text-xs mt-1">
                100% safe & encrypted
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 shadow-lg">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">Trusted</p>
              <p className="text-white/80 text-xs mt-1">By lakhs of users</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 mt-8 mb-4 py-8 px-4">
          <div className="text-center">
            <p className="text-4xl font-black text-gray-300 tracking-wider">
              {BRAND_NAME}
            </p>
            <p className="text-gray-400 text-xs mt-3 font-medium tracking-wide">
              MADE WITH ❤️ IN INDIA
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full">
        <BottomNavigation path={location.pathname} />
      </div>
    </div>
  );
};

export default HomeContent;

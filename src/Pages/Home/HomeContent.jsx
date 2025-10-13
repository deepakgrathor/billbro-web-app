import React, { useEffect } from "react";
import BottomNavigation from "../../Navigation/BottomNavigation";
import HeaderHome from "./HeaderHome";
import BannerSlider from "../../Components/BannerSlider";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineAddCircleOutline,
  MdWhatsapp,
  MdOutlineShare,
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
import ServiceSection from "../../Components/ServiceSection";
import { getUserProfile } from "../../Redux/Slices/AuthSlice/LoginSlice";
import {
  getSettingFunc,
  handleChatWhatsapp,
  openExternalURL,
  WhatsappShare,
} from "../../Utils/CommonFunc";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";
import ButtonComp from "../../Components/ButtonComp";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
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
    dispatch(getBannerList({type : "SERVICE"}));
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

  return (
    <div className="relative h-screen">
      <div className="">
        <div className="fixed  w-full z-50">
          <HeaderHome ProfileData={ProfileData} />
        </div>

        <div className="overflow-y-auto pt-16">
          {serviceList.Data?.find((a) => a.name === "BANNER_SHOW")?.isShow && (
            <div className="h-52 ">
              {serviceLoader ? (
                <div className=" m-2 h-full bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                <BannerSlider />
              )}
            </div>
          )}

          {/* Wallet & Add Money */}
          <div className="flex items-center justify-between py-2 pl-2 bg-gray-100/60 m-2  border-blue-700 border-r-4 rounded-xl">
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
                  {ProfileData?.Data?.wallet?.balance <= 10 && (
                    <p className="text-[8px] tracking-wider bg-red-500 text-white rounded-full px-2 py-0.5">
                      Low
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

          {/* Support Section */}
          <div
            onClick={() =>
              handleChatWhatsapp({
                number: `+91${localStorage.getItem("customerPhone")}`,
                registered_phone: ProfileData?.Data?.phone,
              })
            }
            className="flex active:scale-90 transition transform duration-200 items-center bg-gray-100 p-2 m-2 rounded-lg justify-center space-x-3"
          >
            <MdWhatsapp size={20} />
            <p className="text-[10px] text-gray-500 tracking-wider">
              Need Help? Let's Connect with Support
            </p>
          </div>

          {/* Service Section */}
          <div className="p-2">
            <p className="font-semibold text-sm">Services</p>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {serviceLoader
                ? Array(7)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse"
                      >
                        <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
                        <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
                      </div>
                    ))
                : MobileServices?.map((item, idx) => (
                    <div
                      onClick={() => {
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
                      }}
                      key={idx}
                      className="text-center active:scale-90 transition transform duration-200 space-y-2 bg-gray-100/50 p-2 py-4 rounded-md"
                    >
                      <img
                        width={35}
                        src={`${ImageBaseURL}${item.icon}`}
                        alt={item.name}
                        className=" mx-auto"
                      />
                      <p className="text-[9px] tracking-wider">{item.name}</p>
                    </div>
                  ))}

              {/* 8th item "See All" */}
              {serviceLoader ? (
                <div className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse">
                  <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
                  <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center space-y-2 justify-center cursor-pointer bg-gray-100 p-2 py-4 rounded-md"
                  onClick={() => navigate("/bbpslist")} // yaha apni state/logic lagao
                >
                  <img
                    width={30}
                    className=""
                    src="https://app.billhub.in/assets/bbps-logo.png"
                    alt=""
                  />
                  <p className="text-[10px] ">See All</p>
                </div>
              )}
            </div>
          </div>
          {/* Refer Section */}
          <div className="bg-blue-300/10 m-2 p-3 rounded-xl border-l-4 border-blue-700">
            <div className="flex space-x-1 items-center">
              <img
                width={120}
                src="https://ik.imagekit.io/43tomntsa/refer.png"
                alt=""
              />
              <div className="space-y-0.5">
                <p className="text-[10px]  text-blue-500">
                  Invite your friends to {BRAND_NAME}
                </p>
                <p className="font-bold text-[14px] tracking-wider">
                  Get Upto ₹15
                </p>
                <p className="text-[9px] text-gray-500">
                  When your friend add ₹100 or more to their wallet
                </p>
              </div>
            </div>
            <div onClick={() => {navigate("/refer")}} className="flex space-x-3 items-center mt-2 bg-blue-300/20 p-2 rounded-lg justify-center">
              <MdOutlineShare size={20} />
              <p className="text-[10px] text-gray-600 font-semibold tracking-wider">
                Invite a Friend
              </p>
            </div>
          </div>

          {/* Travel Section */}
          {/* <ServiceSection
            title="Travel"
            services={TravelServices}
            serviceLoader={serviceLoader}
            skeletonCount={4}
          /> */}
          {/* Insurance Section */}
          {/* <ServiceSection
            title="Insurance"
            services={InsuranceServices}
            serviceLoader={serviceLoader}
            skeletonCount={4}
          /> */}
          <div className="bg-gray-100 h-32 mb-16 mt-12 p-4 justify-center items-center flex flex-col">
            <p className="text-center text-4xl text-gray-300 font-semibold tracking-wide">
              {BRAND_NAME}
            </p>
            <p className="text-center text-gray-300 mt-2 text-xs">
              MADE WITH ❤️ IN INDIA
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full flex items-center justify-center">
        <BottomNavigation path={location.pathname} />
      </div>
    </div>
  );
};

export default HomeContent;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageBaseURL } from "../../Utils/Constant";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import API from "../../Redux/API";
import Loader from "../../Components/Loader";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import {
  MdPhone,
  MdTv,
  MdElectricBolt,
  MdLocalGasStation,
  MdTrendingUp,
  MdCardGiftcard,
} from "react-icons/md";

const CommissionList = () => {
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [operatorsArr, setOperatorsArr] = useState([
    {
      id: 0,
      title: "Airtel",
      img: "https://ik.imagekit.io/43tomntsa/airtel.webp",
      code: "airtel",
    },
    {
      id: 1,
      title: "Jio",
      img: "https://ik.imagekit.io/43tomntsa/Jio.webp",
      code: "jio",
    },
    {
      id: 2,
      title: "VI",
      img: "https://ik.imagekit.io/43tomntsa/VI.webp",
      code: "vi",
    },
    {
      id: 3,
      title: "BSNL",
      img: "https://ik.imagekit.io/43tomntsa/Bsnl.webp",
      code: "bsnl",
    },
  ]);

  const [dthOperatorArr, setDTHOperatorArr] = useState([
    {
      id: 1,
      img: "https://ik.imagekit.io/43tomntsa/airtel.webp",
      title: "AIRTEL DTH",
    },
    {
      id: 2,
      img: "https://ik.imagekit.io/43tomntsa/DishTV.webp",
      title: "DISH TV",
    },
    {
      id: 3,
      img: "https://ik.imagekit.io/43tomntsa/SunDirect.webp",
      title: "SUN DIRECT",
    },
    {
      id: 4,
      img: "https://ik.imagekit.io/43tomntsa/TataPlay.webp",
      title: "TATA PLAY",
    },
    {
      id: 5,
      img: "https://ik.imagekit.io/43tomntsa/VideoCon.webp",
      title: "VIDEOCON DTH",
    },
  ]);

  const { serviceList } = useSelector((state) => state.ServiceSlice.service);

  const serviceNames = [
    "Postpaid",
    "Electricity",
    "Fastag",
    "LPG",
    "Insurance",
    "Landline",
    "Broadband",
  ];

  const getPercentData = (name) =>
    serviceList?.Data?.find((a) => a.name === name);

  const serviceDataMap = {};
  serviceNames.forEach((name) => {
    serviceDataMap[name] = getPercentData(name);
  });

  const BBPSArr = serviceNames.map((name) => {
    const data = serviceDataMap[name];
    return {
      img: data?.icon,
      title: data?.name,
      margin: data?.percent,
    };
  });

  const fetchDTHPercent = getPercentData("DTH");
  const fetchGooglePlayPercent = serviceList?.Data?.find(
    (a) => a._id === "661061ecda6832bf278254e1"
  )?.percent;

  useEffect(() => {
    if (fetchDTHPercent) {
      const updatedOperators = dthOperatorArr.map((operator) => ({
        ...operator,
        margin: fetchDTHPercent.percent || 0,
      }));

      const isDifferent = !updatedOperators.every(
        (operator, index) => operator.margin === dthOperatorArr[index].margin
      );

      if (isDifferent) {
        setDTHOperatorArr(updatedOperators);
      }
    }
  }, [fetchDTHPercent]);

  useEffect(() => {
    const FetchRechargeOperatorPercent = async () => {
      setLoad(true);
      try {
        const res = await API.get("cyrus/recharge-operator-percent");
        const updatedOperators = operatorsArr.map((operator) => ({
          ...operator,
          margin: res.data[operator.code] || 0,
        }));
        setOperatorsArr(updatedOperators);
      } catch (error) {
        console.error("Error fetching recharge operator percent:", error);
      } finally {
        setLoad(false);
      }
    };

    FetchRechargeOperatorPercent();
    dispatch(fetchServiceList());
  }, []);

  // Render Commission Card Component
  const CommissionCard = ({ item, type = "percentage" }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="p-4 flex items-center justify-between">
        {/* Left - Logo & Name */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
            <img
              src={type === "bbps" ? `${ImageBaseURL}${item.img}` : item.img}
              alt={item.title}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 capitalize">
              {item.title}
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">Commission Rate</p>
          </div>
        </div>

        {/* Right - Commission Badge */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl shadow-lg">
          <p className="text-white font-bold text-sm">
            {type === "bbps" ? `₹${item.margin}` : `${item.margin}%`}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white shadow-md">
        <CommonHeader
          title={"Commission Chart"}
          handleclick={() => navigate(-1)}
        />
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6 px-4">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MdTrendingUp size={32} className="text-white" />
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">
                  Earn Commission
                </p>
                <p className="text-white font-black text-2xl mt-1">
                  On Every Transaction
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <p className="text-white text-xs font-medium">Live Rates</p>
            </div>
          </div>
        </div>

        {/* Prepaid Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdPhone size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Mobile Prepaid
              </h2>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {operatorsArr.length} Operators
            </span>
          </div>

          <div className="space-y-3">
            {operatorsArr.map((item) => (
              <CommissionCard key={item.id} item={item} type="percentage" />
            ))}
          </div>
        </div>

        {/* DTH Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdTv size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">DTH Recharge</h2>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {dthOperatorArr.length} Operators
            </span>
          </div>

          <div className="space-y-3">
            {dthOperatorArr.map((item) => (
              <CommissionCard key={item.id} item={item} type="percentage" />
            ))}
          </div>
        </div>

        {/* Bill Payment Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdElectricBolt size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Bill Payments</h2>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Flat Rate
            </span>
          </div>

          <div className="space-y-3">
            {BBPSArr.map((item, index) => (
              <CommissionCard key={index} item={item} type="bbps" />
            ))}
          </div>
        </div>

        {/* Others Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdCardGiftcard size={20} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Others</h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group">
            <div className="p-4 flex items-center justify-between">
              {/* Left - Logo & Name */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_Play_2022_icon.svg/1856px-Google_Play_2022_icon.svg.png"
                    alt="Google Play"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Google Play</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Gift Card</p>
                </div>
              </div>

              {/* Right - Commission Badge */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl shadow-lg">
                <p className="text-white font-bold text-sm">
                  {fetchGooglePlayPercent}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                📊 Commission Info
              </p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Commissions are credited instantly to your wallet after each
                successful transaction. Rates may vary based on operator and
                transaction amount.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-200">
            <p className="text-2xl font-black text-blue-600">
              {operatorsArr.length + dthOperatorArr.length}
            </p>
            <p className="text-[10px] text-gray-600 mt-1 font-medium">
              Operators
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-200">
            <p className="text-2xl font-black text-green-600">Instant</p>
            <p className="text-[10px] text-gray-600 mt-1 font-medium">Credit</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-200">
            <p className="text-2xl font-black text-purple-600">24/7</p>
            <p className="text-[10px] text-gray-600 mt-1 font-medium">
              Available
            </p>
          </div>
        </div>
      </div>

      {/* Loader */}
      {load && <Loader />}
    </div>
  );
};

export default CommissionList;

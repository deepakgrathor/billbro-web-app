import React, { useEffect, useState } from "react";
import { primaryColor } from "../../Utils/Style";
import { useDispatch, useSelector } from "react-redux";
import { ImageBaseURL } from "../../Utils/Constant";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import API from "../../Redux/API";
import Loader from "../../Components/Loader";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";

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
    "Landline", // ✅ Note: Correct spelling
    "Broadband", // ✅ Use correct spelling if exists in serviceList
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
    // Only run if fetchDTHPercent is available
    if (fetchDTHPercent) {
      const updatedOperators = dthOperatorArr.map((operator) => ({
        ...operator,
        margin: fetchDTHPercent.percent || 0,
      }));

      // Check if the updated data is different from the current state
      // Compare the margin value to avoid unnecessary updates
      const isDifferent = !updatedOperators.every(
        (operator, index) => operator.margin === dthOperatorArr[index].margin
      );

      // If there's a change, update the state
      if (isDifferent) {
        setDTHOperatorArr(updatedOperators);
      }
    }
  }, [fetchDTHPercent, dthOperatorArr]);
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
        // console.error("Error fetching recharge operator percent:", error);
      } finally {
        setLoad(false);
      }
    };

    FetchRechargeOperatorPercent();
    dispatch(fetchServiceList());
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full ">
        <CommonHeader
          title={"Commission Chart"}
          handleclick={() => navigate(-1)}
        />
      </div>
      <div className="p-2 mt-16">
        <p
          className="my-2 mb-4 text-center"
          style={{
            fontSize: 15,
            fontWeight: "700",
            // fontFamily: LatoBold,
            color: "black",
          }}
        >
          Prepaid
        </p>

        {operatorsArr.map((item) => {
          return (
            <div
              style={{
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderRadius: 16,
                borderColor: primaryColor,
                borderWidth: 0.5,
              }}
              className="flex p-2.5 bg-white mb-2 px-3 flex-row items-center justify-between"
            >
              <div className="flex flex-row items-center space-x-5">
                <img width={30} height={35} src={item.img} />
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: primaryColor,
                  }}
                >
                  {item.title}
                </p>
              </div>
              <p
                style={{
                  fontSize: 12,
                  // fontFamily: LatoBold,
                  color: "green",
                }}
              >
                Flat {item.margin}%
              </p>
            </div>
          );
        })}
      </div>
      <div className="p-2">
        <p
          className="my-2 mb-4 text-center"
          style={{
            fontSize: 15,
            fontWeight: "700",
            // fontFamily: LatoBold,
            color: "black",
          }}
        >
          DTH
        </p>
        {dthOperatorArr.map((item) => {
          return (
            <div
              style={{
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderRadius: 16,
                borderColor: primaryColor,
                borderWidth: 0.5,
              }}
              className="flex p-2.5 bg-white mb-2 px-3  flex-row items-center justify-between"
            >
              <div className="flex flex-row items-center space-x-5">
                <img width={30} height={35} src={item.img} />
                <p
                  className="capitalize"
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: primaryColor,
                  }}
                >
                  {item.title}
                </p>
              </div>
              <p
                style={{
                  fontSize: 12,
                  // fontFamily: LatoBold,
                  color: "green",
                }}
              >
                Flat {item.margin}%
              </p>
            </div>
          );
        })}
      </div>
      <div className=" mb-4 p-2">
        <p
          className="my-2 mb-4 text-center"
          style={{
            fontSize: 15,
            fontWeight: "700",
            // fontFamily: LatoBold,
            color: "black",
          }}
        >
          Bill Payment
        </p>
        {BBPSArr.map((item) => {
          return (
            <div
              style={{
                borderBottomWidth: 3,
                borderRightWidth: 3,
                borderRadius: 16,
                borderColor: primaryColor,
                borderWidth: 0.5,
              }}
              className="flex p-2.5 bg-white mb-2 px-3  flex-row items-center justify-between"
            >
              <div className="flex flex-row items-center space-x-5">
                <img width={30} height={35} src={item.img} />
                <p
                  className="capitalize"
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: primaryColor,
                  }}
                >
                  {item.title}
                </p>
              </div>
              <p
                style={{
                  fontSize: 12,
                  // fontFamily: LatoBold,
                  color: "green",
                }}
              >
                Flat ₹{item.margin}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mb-24 p-2">
        <p
          className="my-2 mb-4 text-center"
          style={{
            fontSize: 15,
            fontWeight: "700",
            // fontFamily: LatoBold,
            color: "black",
          }}
        >
          Others
        </p>

        <div
          style={{
            borderBottomWidth: 3,
            borderRightWidth: 3,
            borderRadius: 16,
            borderColor: primaryColor,
            borderWidth: 0.5,
          }}
          className="flex p-2.5 bg-white mb-2 px-3  rounded-lg flex-row items-center justify-between"
        >
          <div className="flex flex-row items-center space-x-5">
            <img
              width={24}
              height={35}
              src={`https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_Play_2022_icon.svg/1856px-Google_Play_2022_icon.svg.png`}
            />
            <p
              className="capitalize"
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: primaryColor,
              }}
            >
              Google Play
            </p>
          </div>
          <p
            style={{
              fontSize: 12,
              // fontFamily: LatoBold,
              color: "green",
            }}
          >
            Flat {fetchGooglePlayPercent}%
          </p>
        </div>
      </div>
      {load && <Loader />}
    </div>
  );
};

export default CommissionList;

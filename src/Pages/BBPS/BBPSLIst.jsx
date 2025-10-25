import React, { useEffect } from "react";
import { primaryColor, secondaryColor } from "../../Utils/Style";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import Loader from "../../Components/Loader";
import { BILL, ImageBaseURL, SERVICE } from "../../Utils/Constant";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { setPaymentType } from "../../Redux/Slices/PaymentSlice";

const BBPSLIst = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { serviceList, serviceLoader } = useSelector(
    (state) => state.ServiceSlice.service
  );
  useEffect(() => {
    dispatch(fetchServiceList());
  }, []);
  return (
    // <div>
    //   <CommonHeader title={"Bill Payments"} handleclick={() => navigate(-1)} />
    //   <div style={{ backgroundColor: secondaryColor }} className="">
    //     <div className="m-2">
    //       <div className="grid grid-cols-4">
    //         {serviceList.Data?.filter(
    //           (a) => a.section === "finance" && a.isShow
    //         ).map((item) => {
    //           return (
    //             <div
    //               onPress={() => {
    //                 const data = {
    //                   type: SERVICE,
    //                   ids: item._id,
    //                   serviceType: BILL,
    //                 };
    //                 // dispatch(setPaymentType(data));
    //                 navigation.navigate(
    //                   item._id === "661061ecda6832bf278254e1"
    //                     ? "GooglePlay"
    //                     : "MainBBPSScreen",
    //                   item
    //                 );
    //               }}
    //               style={{
    //                 flex: 1,
    //                 margin: 5,
    //                 // marginBottom: Width * 0.02,
    //                 // marginTop: Width * 0.02,
    //                 // borderRadius: Width * 0.07,
    //                 // backgroundColor: "white",
    //                 // borderBottomWidth: 3,
    //                 // borderRightWidth: 3,
    //                 // borderRadius: 12,
    //                 // borderColor: primaryColor,
    //                 // borderWidth: 0.5,
    //               }}
    //               // style={{elevation: 1}}
    //               className=" rounded-3xl  relative mb-1  flex justify-center items-center "
    //             >
    //               {/* <Text
    //                 style={{
    //                   backgroundColor: primaryColor,
    //                   fontSize: 9,
    //                   paddingVertical: 2,
    //                 }}
    //                 className="text-white font-medium rounded-t-md text-center w-full absolute ">
    //                 Flat {item.percent && `${item.percent}%`} {''}
    //                 {item.type === 'Cashback'
    //                   ? 'CB'
    //                   : item.type === 'Discount'
    //                   ? 'DC'
    //                   : 'GCB'}
    //               </Text> */}
    //               {/* <Text className="text-[10px] rounded-t-2xl text-center mt-1.5 w-4/5 py-1 bg-blue-100/50 text-black tracking-wide">
    //                 Flat {item.percent}%
    //               </Text> */}

    //               <div
    //                 style={{
    //                   marginBottom: 10,
    //                   marginTop: 10,
    //                 }}
    //                 className="items-center flex flex-col  justify-center"
    //               >
    //                 <img
    //                   width={50}
    //                   //   resizeMode="contain"
    //                   //   style={{ width: Width * 0.09, height: Width * 0.13 }}
    //                   src={item.icon}
    //                 />
    //                 <p
    //                   style={{
    //                     fontSize: 13,
    //                     fontWeight: "600",
    //                     // marginTop: -15,
    //                     // fontFamily: LatoBold,
    //                   }}
    //                   className="text-black capitalize  font-medium tracking-wide text-center"
    //                 >
    //                   {item.name}
    //                 </p>
    //               </div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //       {/* <FlatList
    //         className=""
    //         showsHorizontalScrollIndicator={false}
    //         // horizontal
    //         numColumns={4}
    //         data={serviceList.Data?.filter(
    //           (a) => a.section === "finance" && a.isShow
    //         )}
    //         renderItem={({ item, index }) => {
    //           return (

    //           );
    //         }}
    //       /> */}
    //     </div>

    //     <div className="flex absolute bottom-0 bg-white self-center w-full py-2 border-t border-gray-200 flex-row justify-center items-center mt-2 space-x-1">
    //       <p className="text-gray-400">Powered by</p>
    //       <img
    //         width={70}
    //         src={"https://ik.imagekit.io/isjriggan/images%20(1).png"}
    //       />
    //     </div>
    //   </div>
    //   {serviceLoader && <Loader />}
    // </div>
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="fixed top-0 w-full ">
        <CommonHeader title="Bill Payments" handleclick={() => navigate(-1)} />
      </div>

      {/* Services Grid */}
      <div style={{ backgroundColor: secondaryColor }} className="flex-1 mt-16">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {serviceList.Data?.filter(
              (a) => a.section === "finance" && a.isShow
            ).map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  navigate("/mainbbps", { state: item });
                  const data = {
                    type: SERVICE,
                    ids: item._id,
                    serviceType: BILL,
                  };
                  dispatch(setPaymentType(data));
                }}
                className="bg-white  rounded-2xl p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={`${ImageBaseURL}${item.icon}`}
                  alt={item.name}
                  width={30}
                  className=" object-contain mb-2"
                />
                <p className="text-[10px] font-semibold text-gray-700 text-center">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex absolute bottom-0 bg-white self-center w-full py-2 border-t border-gray-200 flex-row justify-center items-center mt-2 space-x-1">
          <p className="text-gray-400 text-sm">Powered by</p>
          <img
            width={60}
            src={"https://ik.imagekit.io/isjriggan/images%20(1).png"}
          />
        </div>
      </div>

      {/* Loader */}
      {serviceLoader && <Loader />}
    </div>
  );
};

export default BBPSLIst;

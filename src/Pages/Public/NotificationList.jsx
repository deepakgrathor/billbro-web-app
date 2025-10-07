import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { primaryColor, secondaryColor } from "../../Utils/Style";
import moment from "moment/moment";
import { getNotification } from "../../Redux/Slices/PublicSlice/PublicSlice";
import Loader from "../../Components/Loader";
import { COMPANY_LOGO, DummyAddtoWalletAvatar } from "../../Utils/Constant";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notificationList, notificationLoader } = useSelector(
    (state) => state.PublicSlice.notification
  );
  const getNotify = useCallback(async () => {
    dispatch(getNotification());
  }, [dispatch]);
  useEffect(() => {
    getNotify();
  }, []);
  return (
    <div>
      <div className="fixed top-0 w-full ">
        <CommonHeader
          title={"Notifications"}
          handleclick={() => navigate('/HomeContent')}
        />
      </div>
      <div
        className="flex-1 mt-16 min-h-screen"
        style={{ backgroundColor: secondaryColor }}
      >
        {!notificationLoader && notificationList.Data ? (
          <div className="p-2 space-y-1.5">
            {notificationList.Data.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white rounded-xl border border-gray-300 px-4 py-4"
                // style={{ borderColor: primaryColor }}
              >
                {/* Left section */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.sender
                        ? item.sender._id === item.recipient
                          ? DummyAddtoWalletAvatar
                          : DummyAddtoWalletAvatar
                        : COMPANY_LOGO
                    }
                    alt="icon"
                    width={25}
                    className=" rounded-lg object-cover"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      <p className="text-[12px] font-medium text-black">
                        {item?.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500">{item?.body}</p>
                  </div>
                </div>

                {/* Time */}
                <p className="text-[10px] text-gray-400">
                  {moment(item.createdAt).fromNow()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-40">
            {!notificationLoader ? (
              <div className="bg-white p-6 rounded-lg shadow">
                {/* No data found component */}
                <p className="text-gray-500">No notifications found</p>
              </div>
            ) : (
              <Loader />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;

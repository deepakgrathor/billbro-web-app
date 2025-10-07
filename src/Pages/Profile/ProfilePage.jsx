import React, { useContext } from "react";
import BottomNavigation from "../../Navigation/BottomNavigation";
import HeaderHome from "../Home/HeaderHome";
import ButtonComp from "../../Components/ButtonComp";
import { useSelector } from "react-redux";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { BRAND_NAME, COMPANY_LOGO } from "../../Utils/Constant";
import { ProfileArr, SocialArr } from "../../Utils/MockData";
import Loader from "../../Components/Loader";
import { TbLogout } from "react-icons/tb";
import { AuthContext } from "../../Navigation/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const { ProfileData, profileLoader } = useSelector(
    (state) => state.LoginSlice.profile
  );

  // logout();
  return (
    <div>
      <div className="">
        <div className="fixed top-0 w-full ">
          <CommonHeader title={"Profile"} handleclick={() => navigate(-1)} />
        </div>
        <div className="mt-16">
          <div className="flex border-b border-gray-200 p-4 space-x-2 items-center">
            <img src={COMPANY_LOGO} width={40} alt="" />
            <div className="">
              <p className="font-semibold">
                {ProfileData?.Data?.firstName} {ProfileData?.Data?.lastName}
              </p>
              <p className="font-light text-xs">{ProfileData?.Data?.phone}</p>
            </div>
          </div>
          <div className="">
            {ProfileArr.map((item, index) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.handleclick) {
                      item.handleclick();
                    } else {
                      navigate(item.route);
                    }
                  }}
                  key={index}
                  className="flex bg-gray-50 mx-2 my-3 rounded-md p-3 space-x-2 items-center"
                >
                  {item.image ? (
                    <img width={25} src={item.image} />
                  ) : (
                    <item.icon className="text-2xl text-gray-500" />
                  )}
                  <div className="">
                    <p className="font-medium tracking-wider text-xs">
                      {item.title}
                    </p>
                  </div>
                </div>
              );
            })}
            <div
              onClick={() => logout()}
              className="flex bg-gray-50 m-3 rounded-xl p-3 space-x-2 items-center"
            >
              <TbLogout className="text-2xl text-gray-500" />
              <div className="">
                <p className="font-medium tracking-wider text-xs">Logout</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-10 space-y-2">
            <p className="text-xs text-gray-400">Follow us on Social Media</p>
            <div className="flex space-x-4 mt-2 mx-2">
              {SocialArr.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex bg-gray-200 p-2 text-xl rounded-lg items-center space-x-2"
                  >
                    {item.icon}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-100 h-32 mt-12 p-4 justify-center items-center flex flex-col">
            <p className="text-center text-4xl text-gray-300 font-semibold tracking-wide">
             
              {BRAND_NAME}
            </p>
            <p className="text-center text-gray-300 mt-2 text-xs">MADE WITH ❤️ IN INDIA</p>
          </div>
        </div>
        {/* <div className="pt-16 pb-96">
          <div className="p-2">
            <ButtonComp title={"Logout"} handleClick={logout} />
          </div>
        </div> */}
      </div>

      {profileLoader && <Loader />}
    </div>
  );
};

export default ProfilePage;

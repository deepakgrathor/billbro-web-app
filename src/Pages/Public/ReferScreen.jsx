import React from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import { BRAND_NAME } from "../../Utils/Constant";
import { MdWhatsapp, MdOutlineHistory } from "react-icons/md";
import { useSelector } from "react-redux";

const ReferScreen = () => {
  const navigate = useNavigate();
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  return (
    <div>
      <div className="">
        <div className="fixed top-0 w-full ">
          <CommonHeader
            title={"Refer & Earn"}
            handleclick={() => navigate("/HomeContent")}
          />
        </div>
        <div className="mt-16">
          <div className="item-center justify-center flex flex-col p-4 space-y-4">
            <img src="https://ik.imagekit.io/43tomntsa/refer.png" alt="" />
            <p className="text-center text-xs">{`Share ${BRAND_NAME} with your friends and earn rewards!`}</p>
            <p className="text-center font-bold">Get Upto ₹15</p>
            <p className="text-center font-extralight text-xs">
              When they add ₹100 or more
            </p>
            <p className="text-center tracking-wider font-semibold text-lg bg-gray-100 p-2 rounded-lg border border-gray-200">
              {ProfileData.Data.referalId}
            </p>
            <div className="fixed bottom-4 space-y-2 left-0 w-full px-2">
              <div className="flex  w-full items-center space-x-2  justify-between">
                <div className="flex w-full bg-blue-100 cursor-pointer rounded-xl p-2 justify-center items-center space-x-2">
                  <MdWhatsapp size={20} />
                  <p className="text-[10px] text-center tracking-wide">Whatsapp Share</p>
                </div>
                <div
                  onClick={() => navigate("/referlist")}
                  className="flex  bg-blue-100  cursor-pointer w-full justify-center rounded-xl p-2 items-center space-x-2"
                >
                  <MdOutlineHistory size={20} />
                  <p className="text-[10px] text-center tracking-wide">Refer Histories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferScreen;

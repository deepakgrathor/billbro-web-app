import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { primaryColor } from "../Utils/Style";
import { useNavigate } from "react-router-dom";

const CommonHeader = ({ title, handleclick, rightDesign, style }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between bg-white shadow h-16 p-2">
      <div className=" flex items-center space-x-4">
        <div onClick={handleclick} className="bg-gray-100 p-2 rounded-lg">
          <MdOutlineArrowBack size={25} color={primaryColor} />
        </div>
        <p style={style} className="font-semibold tracking-wide text-sm">
          {title}
        </p>
      </div>
      <div className="p-2">{rightDesign ? rightDesign() : null}</div>
    </div>
  );
};

export default CommonHeader;

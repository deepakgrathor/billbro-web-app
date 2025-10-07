import React from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";

const ReferList = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="">
        <div className="fixed top-0 w-full ">
          <CommonHeader
            title={"Refer Histories"}
            handleclick={() => navigate(-1)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferList;

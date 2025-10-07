import React, { useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import ButtonComp from "../../Components/ButtonComp";
const BBPSComplain = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const rightDesign = () => {
    return (
      <div className="">
        <img
          width={60}
          src="https://ik.imagekit.io/isjriggan/images%20(1).png"
          alt=""
        />
      </div>
    );
  };
  return (
    <div>
      <div className="fixed top-0 w-full ">
        <CommonHeader
          title="BBPS Complaint"
          handleclick={() => navigate(-1)}
          rightDesign={rightDesign}
        />
      </div>
      <div className="">
        <div className="px-4 mt-18">
          <div className="flex items-center space-x-4 justify-between">
            <p
              onClick={() => setStep(1)}
              className={`bg-gray-100 border tracking-wider text-xs ${
                step === 1 ? "border-gray-400" : "border-gray-200"
              } rounded-lg p-2 w-full text-center`}
            >
              Complaint Register
            </p>
            <p
              onClick={() => setStep(2)}
              className={`bg-gray-100 border tracking-wider text-xs ${
                step === 2 ? "border-gray-400" : "border-gray-200"
              } rounded-lg p-2 w-full text-center`}
            >
              Complaint Tracking
            </p>
          </div>
        </div>
        {step === 1 && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <input
                  className="outline-none text-sm w-full"
                  placeholder="Transaction ID"
                  type="text"
                  name=""
                  id=""
                />
              </div>
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <textarea
                  className="outline-none text-sm w-full"
                  placeholder="Complaint Details"
                  type="text"
                  name=""
                  id=""
                />
              </div>
              <ButtonComp title="Submit" />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg p-3 bg-gray-100">
                <input
                  className="outline-none text-sm w-full"
                  placeholder="Complaint ID"
                  type="text"
                  name=""
                  id=""
                />
              </div>

              <ButtonComp title="Submit" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BBPSComplain;

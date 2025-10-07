import React, { useState } from "react";
import {
  All_Recharge_Circle_List,
  All_Recharge_Operator_List,
} from "../../Utils/MockData";
import { setRechargeData } from "../../Redux/Slices/ServiceSlice/RechargeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";

const OperatorAndCircle = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rechargeData = useSelector((state) => state.RechargeSlice.rechargeData);
  const [operator, setOperator] = useState({
    OperatorCode: null,
    OperatorName: null,
    img: null,
  });
  const handleStep1 = (item) => {
    setStep(2);
    setOperator({
      OperatorCode: item.PlanApi_Operator_code,
      OperatorName: item.Operator_name,
      img: item.img,
    });
  };

  const handleStep2 = (item) => {
    dispatch(
      setRechargeData({
        ...rechargeData,
        operator: {
          OperatorCode: operator.OperatorCode,
          OperatorName: operator.OperatorName,
          img: operator.img,
        },
        circle: {
          circlecode: item?.planapi_circlecode,
          circlename:
            item?.circlename == "CHHATTISGARH"
              ? "MP and Chattisgarh"
              : item?.circlename,
        },
      })
    );
    navigate(-1);
  };

  return (
    <div>
      <div className="fixed top-0 w-full">
        <CommonHeader
          title={"Change Operator & Circle"}
          handleclick={() => navigate('/plans')}
        />
      </div>
      <div className="flex-1 mt-16 bg-white">
        {(step === 1
          ? All_Recharge_Operator_List.slice(0, 4)
          : All_Recharge_Circle_List
        ).map((item, index) => (
          <div
            key={index}
            onClick={() => (step === 1 ? handleStep1(item) : handleStep2(item))}
            className="flex border border-blue-100 bg-white m-2 rounded-md flex-row items-center space-x-3 p-3 cursor-pointer"
          >
            {step === 1 && (
              <img
                width={30}
                src={item.img}
                alt={item.Operator_name}
                style={
                  {
                    //   width: `${Width * 0.08}px`,
                    //   height: `${Width * 0.08}px`,
                  }
                }
              />
            )}
            <span
              style={
                {
                  // fontSize: `${step === 1 ? Width * 0.05 : Width * 0.04}px`,
                  // fontFamily: LatoBold,
                }
              }
              className="text-gray-600"
            >
              {step === 1 ? item.Operator_name : item.circlename}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatorAndCircle;

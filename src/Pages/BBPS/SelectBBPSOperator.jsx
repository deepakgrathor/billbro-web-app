import React, { useState } from "react";
import { primaryColor, secondaryColor } from "../../Utils/Style";
import SearchBarComp from "../../Components/SearchBarComp";
import CommonHeader from "../../Components/CommonHeader";

const SelectBBPSOperator = ({ data, setStep, setData }) => {
  const [search, setSearch] = useState(null);

  const handleClick = async ({ item }) => {
    setData(item);
    setStep(2);
    // setLoad(true);
    // route.params[0](item);
    // const payload = {
    //   methodname: 'get_billerinfo',
    //   operator: item.OperatorCode,
    // };

    // const res = await dispatch(fetchBillerInfo({payload}));
    // if (res.payload.Data.Request) {
    //   navigation.goBack();
    //   setLoad(false);
    // }
  };
  return (
    <div>
      <div style={{ backgroundColor: secondaryColor }} className="p-3 min-h-screen">
        <SearchBarComp placeholder={"Search Your Biller"} setFunc={setSearch} />
        <div className="mt-2 overflow-y-auto space-y-2">
          {(search
            ? data?.filter((a) =>
                a.operator_name?.toLowerCase().includes(search?.toLowerCase())
              )
            : data
          )?.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick({ item })}
              className="flex flex-row justify-between items-center bg-gray-200/50 border border-gray-100 rounded-lg px-3 py-3"
            >
              <div className="flex flex-row items-center space-x-4">
                <img width={25} src={item.icon} className=" rounded-full" />
                <p className="text-[10px] text-black font-semibold tracking-wide leading-5">
                  {item.operator_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectBBPSOperator;

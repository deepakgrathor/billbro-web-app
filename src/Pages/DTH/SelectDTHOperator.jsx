import React, { useState } from "react";
import { secondaryColor } from "../../Utils/Style";

const SelectDTHOperator = ({ data, setStep, setData }) => {
  const [search, setSearch] = useState(null);
  const handleClick = async ({ item }) => {
    setData(item);
    setStep(2);
  };
  return (
    <div>
      <div
        style={{ backgroundColor: secondaryColor }}
        className="p-3 min-h-screen"
      >
        {/* <SearchBarComp placeholder={"Search Your Biller"} setFunc={setSearch} /> */}
        <div className="mt-2 overflow-y-auto space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick({ item })}
              className="flex flex-row justify-between items-center bg-gray-200/50 border border-gray-100 rounded-lg px-3 py-3"
            >
              <div className="flex flex-row items-center space-x-4">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <p className="text-xs text-black font-semibold tracking-wide leading-5">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectDTHOperator;

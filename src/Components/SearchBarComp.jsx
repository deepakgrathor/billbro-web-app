import React from "react";
import { primaryColor } from "../Utils/Style";
import { MdSearch } from "react-icons/md";
const SearchBarComp = ({ setFunc, placeholder }) => {
  return (
    <div>
      <div
        style={{
          //   backgroundColor: "white",
          marginHorizontal: 5,
        }}
        className="flex m-1 rounded-xl p-4 bg-gray-100 border border-gray-200 items-center space-x-2 flex-row"
      >
        <MdSearch color={"black"} size={20} />
        <input
          className="outline-none"
          onChange={(e) => setFunc(e.target.value)}
          style={{
            // backgroundColor: "white",
            width: "90%",
            color: "black",
            fontSize: 12,
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SearchBarComp;

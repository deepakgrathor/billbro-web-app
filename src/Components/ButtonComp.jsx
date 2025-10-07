import React from "react";
import { primaryColor } from "../Utils/Style";

const ButtonComp = ({ title, handleClick, disabled }) => {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={handleClick}
        style={{ backgroundColor: disabled ? "gray" : primaryColor }}
        className="w-full max-w-sm mx-auto font-bold tracking-wider text-sm text-white p-4 rounded-full"
      >
        {title}
      </button>
    </div>
  );
};

export default ButtonComp;

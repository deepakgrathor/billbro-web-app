import React, { useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";

const Reports = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 w-full z-10">
        <CommonHeader title={"Reports"} handleclick={() => navigate(-1)} />
      </div>

      {/* Body */}
      <div className="mt-16 p-4">
        <div className="max-w-sm mx-auto">
          <Datepicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
            displayFormat="DD/MM/YYYY"
            inputClassName="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="Select Date Range"
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;

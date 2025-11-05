import React, { useState, useRef, useEffect } from "react";

const ServiceDropdown = ({ selectedService, onServiceChange, services }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceSelect = (service) => {
    onServiceChange(service);
    setShowDropdown(false);
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-4 py-2 bg-gray-100 rounded-xl text-left flex items-center justify-between hover:bg-gray-200 transition-colors"
      >
        <span className="text-gray-900 text-sm font-medium">
          {selectedService.name}
        </span>
        <span className="text-gray-500">{showDropdown ? "▲" : "▼"}</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto z-40">
          {services.map((service) => (
            <button
              key={service.serviceId}
              onClick={() => handleServiceSelect(service)}
              className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors ${
                selectedService.serviceId === service.serviceId
                  ? "bg-blue-50 text-blue-900 font-medium"
                  : "text-gray-700"
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;

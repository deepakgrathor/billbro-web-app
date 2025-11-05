import React from "react";
import { BOTTOM_ICON_COLOR, BOTTOM_TEXT_COLOR } from "../Utils/Style";
import { BOTTOM_MENU_DATA } from "../Utils/MockData";
import { useNavigate } from "react-router-dom";
const BottomNavigation = ({ path }) => {
  
  const navigate = useNavigate();
  return (
    <div className="fixed text-sm bottom-0 left-0 w-full bg-white  border-t border-gray-200 p-2 flex justify-around items-center z-50">
      {BOTTOM_MENU_DATA.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            onClick={() => navigate(item.route)}
            key={index}
            className="flex space-y-1 flex-col items-center"
          >
            <Icon className={`${item.active ? 'text-blue-500' : 'text-gray-700'}`} size={28} />
            <p className={`text-xs ${item.active ? 'text-blue-500' : 'text-gray-500'}`}>
              {item.name}
            </p>
          </div>
        );  
      })}
    </div>
  );
};

export default BottomNavigation;

import { DummyAvatarForPassbook } from "../../Utils/MockData";
import { RiDiscountPercentLine } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const HeaderHome = ({ ProfileData }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white/40  shadow h-16 p-2 flex justify-between items-center">
        <div className="">
          <p className="text-[10px] tracking-wider">Welcome Back!</p>
          <p className="font-semibold text-sm tracking-wider">
            {ProfileData?.Data?.firstName}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div
            onClick={() => navigate("/commission")}
            className="bg-gray-200 p-2 rounded-lg"
          >
            <RiDiscountPercentLine size={20} color="red"/>
          </div>
          <div
            onClick={() => navigate("/notification")}
            className="bg-gray-200 p-2 rounded-lg"
          >
            <MdNotificationsNone size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderHome;

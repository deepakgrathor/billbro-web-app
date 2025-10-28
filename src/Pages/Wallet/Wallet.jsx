import React, { useEffect, useRef, useState } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ButtonComp from "../../Components/ButtonComp";
import ToastComp from "../../Components/ToastComp";
const Wallet = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(500);
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    // Sirf digits allow karo
    if (!/^\d*$/.test(value)) return;

    // Set value
    setAmount(value);

    // Validation check
    if (Number(value) > 50000) {
      ToastComp({
        message: "Amount cannot be more than ₹50,000",
        type: "error",
      });
    } else {
    }
  };
  const mountRef = useRef(null);
  const upiAppRef = useRef(null);

  // useEffect(() => {
  //   const cashfree = Cashfree({ mode: "sandbox" });
    
  //   upiAppRef.current = cashfree.create('upiApp', {
  //     values: { upiApp: 'gpay', buttonText: 'GPAY', buttonIcon: true }
  //   });

  //   upiAppRef.current.on('loaderror', (data) => console.log(data.error));
  //   upiAppRef.current.on('ready', (d) => console.log(d.value));
    
  //   upiAppRef.current.mount(mountRef.current);

  //   return () => upiAppRef.current?.unmount();
  // }, []);

  const handlePayment = () => {
  const cashfree = window.Cashfree({ mode: "sandbox" });
    
    upiAppRef.current = cashfree.create('upiApp', {
      values: { upiApp: 'gpay', buttonText: 'GPAY', buttonIcon: true }
    });

    upiAppRef.current.on('loaderror', (data) => console.log(data.error));
    upiAppRef.current.on('ready', (d) => console.log(d.value));
    
    upiAppRef.current.mount(mountRef.current);
  };

  return (
    <div ref={mountRef} className="bg-white min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
        <CommonHeader
          title={"Add Money to Wallet"}
          handleclick={() => navigate(-1)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 mt-14 p-4 overflow-y-auto">
        <p className="font-semibold text-sm tracking-wider">
          Available Balance
        </p>
        <div className="flex items-center space-x-2">
          <p className="font-black text-lg">
            ₹
            {new Intl.NumberFormat("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(ProfileData?.Data?.wallet?.balance || 0)}
          </p>
          {ProfileData?.Data?.wallet?.balance <= 10 && (
            <p className="text-[8px] tracking-wider bg-red-500 text-white rounded-full px-2 py-0.5">
              Low
            </p>
          )}
        </div>

        <div className="my-4">
          <div className="flex bg-gray-100 items-center space-x-1 border border-gray-400 rounded-xl p-3">
            <p className="text-2xl px-2 font-black">₹</p>
            <input
              value={amount}
              onChange={handleChange}
              className="text-2xl font-black outline-none w-full"
              maxLength={5}
              placeholder="0"
              type="text"
            />
          </div>

          <div className="my-5">
            <p className="text-sm tracking-wide mb-3">Recommended</p>
            <div className="flex space-x-3 overflow-x-auto items-center">
              {PriceArr.map((item, idx) => (
                <p
                  key={idx}
                  onClick={() => setAmount(item)}
                  className="text-[10px] text-gray-700 tracking-wider rounded-lg border border-gray-400 p-2 px-3"
                >
                  +{item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4">
        <ButtonComp
          handleClick={handlePayment}
          disabled={amount > 50000 || !amount}
          title={"Process to Add"}
        />
      </div>
    </div>
  );
};

const PriceArr = [500, 1000, 2000, 5000, 10000, 50000];


export default Wallet;

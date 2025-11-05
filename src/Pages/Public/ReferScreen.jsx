import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import { BRAND_NAME } from "../../Utils/Constant";
import {
  MdWhatsapp,
  MdOutlineHistory,
  MdContentCopy,
  MdCheck,
} from "react-icons/md";
import { useSelector } from "react-redux";

const ReferScreen = () => {
  const navigate = useNavigate();
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const [copied, setCopied] = useState(false);

  const referralCode = ProfileData?.Data?.referalId || "LOADING...";

  // Copy to clipboard function
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp share function
  const handleWhatsAppShare = () => {
    const message = `🎉 Join ${BRAND_NAME} and get amazing rewards!\n\n💰 Use my referral code: ${referralCode}\n\n✅ Get ₹15 when you add ₹100 or more\n\nDownload now: [Your App Link]`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="fixed top-0 w-full z-10 bg-white shadow-sm">
        <CommonHeader
          title={"Refer & Earn"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-28 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center space-y-6 mt-4">
          {/* Illustration with Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <img
              src="https://ik.imagekit.io/43tomntsa/refer.png"
              alt="Refer & Earn"
              className="w-72 h-72r object-contain relative drop-shadow-2xl animate-float"
            />
          </div>

          {/* Title & Description */}
          <div className="text-center space-y-3 px-4">
            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
              Share & Earn Together! 🎉
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Share {BRAND_NAME} with your friends and earn exciting rewards
              when they join!
            </p>
          </div>

          {/* Reward Card */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm transform hover:scale-105 transition-transform duration-300">
            <div className="text-center space-y-2">
              <p className="text-white text-sm font-medium opacity-90">
                Earn Up To
              </p>
              <p className="text-white text-5xl font-bold drop-shadow-lg">
                ₹15
              </p>
              <p className="text-white text-xs opacity-90 pt-2">
                When your friend adds ₹100 or more
              </p>
            </div>
          </div>

          {/* Referral Code Card */}
          <div className="w-full max-w-sm space-y-3">
            <p className="text-center text-sm font-semibold text-gray-700">
              Your Referral Code
            </p>
            <div
              onClick={handleCopyCode}
              className="relative bg-white border-2 border-dashed border-blue-400 rounded-2xl p-5 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-50"></div>

              {/* Code Display */}
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-center text-2xl font-bold text-gray-800 tracking-widest font-mono">
                    {referralCode}
                  </p>
                </div>
                <div className="ml-4">
                  {copied ? (
                    <div className="bg-green-500 p-2 rounded-full animate-bounce">
                      <MdCheck size={24} className="text-white" />
                    </div>
                  ) : (
                    <div className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors">
                      <MdContentCopy size={24} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Hint */}
              <p className="text-center text-xs text-gray-500 mt-3">
                {copied ? "✓ Copied to clipboard!" : "Tap to copy code"}
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-5 space-y-4 mt-4">
            <h3 className="text-center font-bold text-gray-800 text-lg">
              How It Works? 🤔
            </h3>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Share Your Code
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Share your referral code with friends via WhatsApp or social
                    media
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Friend Signs Up
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your friend registers using your referral code
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-gray-800">
                    Get Rewards
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Earn ₹15 when they add ₹100 or more to their wallet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed flex space-x-2 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
        {/* WhatsApp Share Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-4 flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-all duration-200"
        >
          <MdWhatsapp size={20} />
          <span className="font-semibold text-xs tracking-wide">
            Share on WhatsApp
          </span>
        </button>

        {/* Refer History Button */}
        {/* <button
          onClick={() => {
            navigate("/reports", {
              state: {
                activeTab: "referrals",
              },
            });
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-4 flex items-center justify-center space-x-3 shadow-lg active:scale-95 transition-all duration-200"
        >
          <MdOutlineHistory size={20} />
          <span className="font-semibold text-xs tracking-wide">
            View Refer History
          </span>
        </button> */}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ReferScreen;

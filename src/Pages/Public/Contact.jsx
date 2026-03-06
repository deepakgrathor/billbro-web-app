// import React from "react";
// import CommonHeader from "../../Components/CommonHeader";
// import { useNavigate } from "react-router-dom";
// import { handleChatWhatsapp, openExternalURL } from "../../Utils/CommonFunc";
// import { useSelector } from "react-redux";
// import { BsHeadphones } from "react-icons/bs";

// const Contact = () => {
//   const navigate = useNavigate();
//   const { ProfileData } = useSelector((state) => state.LoginSlice.profile);

//   return (
//     <>
//       <div className="bg-white min-h-screen flex flex-col">
//         <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
//           <CommonHeader
//             title={"Live Support"}
//             handleclick={() => navigate("/")}
//             rightDesign={() => {
//               return (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <BsHeadphones className="text-gray-600" />
//                     <p className="text-xs text-gray-600">24x7 - Chat Support</p>
//                   </div>
//                 </>
//               );
//             }}
//           />
//         </div>
//         <div className="flex-1 mt-14 overflow-y-auto">
//           <div className="flex items-center justify-center">
//             <img
//               width={300}
//               src="https://ik.imagekit.io/43tomntsa/LiveSupport%20(1).png"
//               alt=""
//             />
//           </div>
//           <h2 class="text-center font-bold text-xl mt-4">
//             We're always here for you
//           </h2>
//           <p class="text-sm text-center mt-2">
//             Click the circle at the bottom right to start the conversation
//           </p>
//           <div className="">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 512 442.137"
//               class="w-[150px] absolute right-[80px] bottom-[130px]"
//               fill="blue"
//             >
//               <path d="M498.536 442.137c-31.387-25.229-67.042-47.435-83.064-62.714-5.282-5.036-11.007-12.153-1.664-8.574 25.872 9.909 54.004 27.667 75.003 49.744-2.547-18.498 2.366-41.616 9.997-60.504.939-2.328 3.886-11.918 7.547-15.089 1.358-1.177 2.819-1.472 4.307-.18.849.739 1.28 1.995 1.333 3.707.152 4.983-3.387 19.558-6.693 33.835-4.904 21.183-7.422 37.783-6.766 59.775z"></path>
//               <path d="M243.828 236.348c4.322-22.157 5.797-44.278 4.95-66.742 45.792 16.983 86.744 47.759 120.988 82.094 41.377 41.487 75.893 91.781 100.677 142.434 7.709 15.756 12.142 22.106 22.781 36.215-19.821-95.783-137.213-251.196-246.698-274.194C232.218 29.162 103.055-53.717 0 40.704c95.353-64.986 210.522-25.748 234.658 113.48-11.685-1.414-23.233-1.219-34.515.824-26.693 4.83-52.462 12.782-72.736 38.719-28.125 35.979-26.324 94.975 19.286 115.587 54.862 24.792 87.927-25.739 97.135-72.966zm-7.016-67.487c.889 23.575-1.128 48.171-6.111 71.196-8.03 37.107-29.726 69.192-65.407 62.82-22.084-3.943-35.695-18.675-40.56-38.116-17.522-70.029 62.617-107.875 112.078-95.9z"></path>
//             </svg>
//             <div
//               onClick={() => {
//                 handleChatWhatsapp({
//                   number: `+91${localStorage.getItem("customerPhone")}`,
//                   registered_phone: ProfileData?.Data?.phone,
//                 });
//               }}
//               class="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full w-[70px] h-[70px] bg-green-500/10 hover:bg-green-500/20 transition-all shadow-lg"
//             >
//               <svg
//                 stroke="currentColor"
//                 fill="currentColor"
//                 stroke-width="0"
//                 viewBox="0 0 448 512"
//                 height="30"
//                 width="30"
//                 xmlns="http://www.w3.org/2000/svg"
//                 class="text-green-600"
//               >
//                 <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Contact;
import React, { useCallback } from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import { handleChatWhatsapp } from "../../Utils/CommonFunc";
import { useSelector } from "react-redux";
import { BsHeadphones, BsWhatsapp } from "react-icons/bs";
import { MdSupportAgent, MdEmail, MdPhone } from "react-icons/md";

const Contact = () => {
  const navigate = useNavigate();
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);

  // ✅ OPTIMIZATION: Memoized WhatsApp handler
  const handleWhatsAppClick = useCallback(() => {
    handleChatWhatsapp({
      number: `+91${localStorage.getItem("customerPhone")}`,
      registered_phone: ProfileData?.Data?.phone,
    });
  }, [ProfileData?.Data?.phone]);

  // ✅ OPTIMIZATION: Memoized right design component
  const rightDesign = useCallback(() => (
    <div className="flex items-center gap-2">
      <BsHeadphones className="text-purple-600" size={18} />
      <p className="text-xs text-theme-secondary font-bold">11AM to 7PM Support</p>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-theme-base flex flex-col relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-theme-header backdrop-blur-xl border-b border-theme">
        <CommonHeader
          title={"Live Support"}
          handleclick={() => navigate("/")}
          rightDesign={rightDesign}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-32 px-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Hero Image */}
          <div className="flex items-center justify-center mb-8 animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"></div>
              <img
                width={280}
                src="https://ik.imagekit.io/43tomntsa/LiveSupport%20(1).png"
                alt="Live Support"
                className="relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-theme-primary mb-3 tracking-tight">
              We're Always Here for You
            </h2>
            <p className="text-sm text-theme-secondary font-medium max-w-md mx-auto">
              Our support team is available 11AM to 7PM, Mon to Fri to assist you with any questions or concerns
            </p>
          </div>

          {/* Support Options */}
          <div className="grid gap-4 mb-8">
            {/* WhatsApp Card */}
            <div 
              onClick={handleWhatsAppClick}
              className="bg-theme-card backdrop-blur-sm rounded-2xl p-5 border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BsWhatsapp className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-theme-primary mb-1">
                    WhatsApp Chat
                  </h3>
                  <p className="text-xs text-theme-secondary font-medium">
                    Instant support via WhatsApp messaging
                  </p>
                </div>
                <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                  →
                </div>
              </div>
            </div>

            {/* Email Card */}
            {/* <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-200 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MdEmail className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1">
                    Email Support
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    Get detailed assistance via email
                  </p>
                </div>
              </div>
            </div> */}

            {/* Phone Card */}
            {/* <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <MdPhone className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black text-gray-900 mb-1">
                    Phone Support
                  </h3>
                  <p className="text-xs text-gray-600 font-medium">
                    Speak directly with our support team
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Info Card */}
          <div className="bg-theme-card-2 rounded-2xl p-5 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <MdSupportAgent className="text-purple-600 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-black text-theme-primary mb-2">
                  Quick Response Guaranteed
                </h4>
                <p className="text-xs text-theme-secondary leading-relaxed">
                  Our dedicated support team typically responds within minutes. For urgent matters, 
                  we recommend using WhatsApp for the fastest response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

   

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default Contact;
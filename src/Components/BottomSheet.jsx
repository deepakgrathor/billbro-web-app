import React from "react";

const BottomSheet = ({ setIsOpen, isOpen, title, content }) => {
  return (
    <>
      {/* Button */}
      {/* <div className="flex justify-center mt-10">
        <button
          onClick={() => setIsOpen(true)}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          Open Bottom Drawer
        </button>
      </div> */}

      {/* Overlay (dark background) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        ></div>
      )}

      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 relative">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
          {content}

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 mt-3 bg-blue-600 text-white rounded-xl shadow cursor-pointer hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Got It
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;

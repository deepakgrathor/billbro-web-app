import React from "react";
import { motion } from "framer-motion";
import { primaryColor } from "../Utils/Style";
import { BRAND_NAME } from "../Utils/Constant";
import { MdLockPerson } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";



const SplashScreen = () => {
  return (
    <div>
      <div
        style={{ backgroundColor: primaryColor }}
        className="fixed inset-0 space-y-3 flex flex-col items-center justify-center text-white"
      >
        {/* Logo spin karega */}
        <motion.img
          src="https://ik.imagekit.io/43tomntsa/BillBro_White_Logo.svg" // apna logo path daalna
          alt="Logo"
          className="w-18 h-18 mb-4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />

        {/* Brand name right se aayega */}
        <motion.h1
          className="text-4xl font-extrabold tracking-widest"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {BRAND_NAME}
        </motion.h1>
        <div className="absolute bottom-10 flex justify-evenly w-full">
          <div className="flex items-center space-x-2">
            <MdLockPerson size={25} />
            <div className="">
              <p className="text-[14px] font-black">100%</p>
              <p className="text-[8px] text-red-300">Secured</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <IoShieldCheckmarkSharp size={25} />
            <div className="">
              <p className="text-[14px] font-black">10k+ Users</p>
              <p className="text-[8px] text-red-300">Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

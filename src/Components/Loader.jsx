import React from "react";
import { motion } from "framer-motion";
const Loader = () => {
  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
        <motion.img
          src="https://ik.imagekit.io/43tomntsa/BillBro_Logo.svg" // apna logo ka path daalna
          alt="Logo"
          className="w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default Loader;

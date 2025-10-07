import toast, { Toaster } from "react-hot-toast";
import React from "react";

const ToastComp = ({ message, type }) => {
  return toast[type](message);
};

export default ToastComp;

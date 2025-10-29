import React from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header/> */}
      <div className="">
        <div className="fixed top-0 w-full ">
          <CommonHeader
            title={"Refund Policy"}
            handleclick={() => navigate("/")}
          />
        </div>
        <div className=" mx-auto mb-12 bg-white px-6 mt-20">
          <p className=" text-gray-700 mb-6">
            Thank you for choosing{" "}
            <strong className="text-indigo-600">BillBro</strong> (a product of
            **Zapnity Services OPC Pvt Ltd**) for your recharge needs. We aim to
            provide a seamless and reliable platform for all your mobile and DTH
            recharge transactions. However, we understand that circumstances may
            arise where a refund is required. Please take a moment to review our
            refund policy to ensure clarity and transparency regarding refund
            procedures.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            Your satisfaction is our utmost priority, and we are dedicated to
            resolving any concerns you may have.
          </p>

          {/* --- Refund Duration Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Refund Duration
          </h2>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700 mb-8">
            <li>
              Refund requests for **failed transactions** can be initiated
              within **7 business days** from the date of the transaction.
            </li>
            <li>
              Once approved for refund, the amount will be credited to the
              customer's account within **5-7 business days**.
            </li>
          </ul>

          {/* --- Conditions for Refunds Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Conditions for Refunds
          </h2>
          <p className="text-gray-700 mb-8">
            Refunds are **strictly issued for failed transactions** only. Our
            automated system ensures swift processing of refunds in such
            instances.
          </p>

          {/* --- Refund Request Process Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Refund Request Process
          </h2>
          <p className="text-gray-700 mb-8">
            To request a refund, users may **initiate a complaint** for the
            specific transaction or directly reach out to our dedicated
            **support team**. Our representatives are committed to assisting you
            promptly and efficiently.
          </p>

          {/* --- Fees and Deductions Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Fees and Deductions
          </h2>
          <p className="text-gray-700 mb-8">
            We prioritize transparency in our refund process. Rest assured,
            there are **no additional fees or deductions** associated with
            refunds. The entire transaction amount will be refunded to your
            original payment method.
          </p>

          {/* --- Modes of Refund Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Modes of Refund
          </h2>
          <p className="text-gray-700 mb-8">
            Refunds will be credited back to the **original payment method**
            utilized for the transaction. We value your trust and strive to
            ensure a seamless experience throughout the refund process.
          </p>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-lg text-gray-800 font-medium">
              Should you have any inquiries or require further assistance
              regarding refunds, our knowledgeable support team remains at your
              disposal.
            </p>
            <p className="text-base text-gray-600 mt-2">
              Thank you for your understanding and continued support.
            </p>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default RefundPolicy;

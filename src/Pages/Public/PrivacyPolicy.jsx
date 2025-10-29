import React from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <Header/> */}
      <div className=" min-h-screen py-12">
        <div className="fixed top-0 w-full ">
          <CommonHeader
            title={"Privacy Policy"}
            handleclick={() => navigate("/")}
          />
        </div>
        <div className=" mx-auto  p-8 md:p-12 rounded-xl">
          <p className="text-sm text-gray-600 mb-8">
            Effective Date: 1 Oct 2025
          </p>

          <p className="text-lg text-gray-700 mb-6">
            At <strong className="text-indigo-600">BillBro</strong>, accessible
            from{" "}
            <a
              href="https://billbro.in"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              https://billbro.in
            </a>
            , one of our main priorities is the privacy of our visitors. This
            Privacy Policy document contains types of information that is
            collected and recorded by **BillBro** (a product of **Zapnity
            Services OPC Pvt Ltd**) and how we use it.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            If you have additional questions or require more information about
            our Privacy Policy, do not hesitate to contact us. This policy is
            not applicable to any information collected offline or via channels
            other than this website.
          </p>

          {/* --- Consent Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Consent
          </h2>
          <p className="text-gray-700 mb-8">
            By using our website, you hereby **consent** to our Privacy Policy
            and agree to its terms.
          </p>

          {/* --- Information We Collect Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            The personal information that you are asked to provide, and the
            reasons why you are asked to provide it, will be made clear to you
            at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700 mb-8">
            <li>
              If you contact us directly, we may receive additional information
              about you such as your **name**, **email address**, **phone
              number**, the contents of the message and/or attachments you may
              send us, and any other information you may choose to provide.
            </li>
            <li>
              When you register for an Account, we may ask for your contact
              information, including items such as **name**, **company name**,
              **address**, **email address**, and **telephone number**.
            </li>
          </ul>

          {/* --- How We Use Your Information Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700 mb-8">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>
              Develop new products, services, features, and functionality.
            </li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website, and for
              marketing and promotional purposes.
            </li>
            <li>Send you emails.</li>
            <li>Find and prevent fraud.</li>
          </ul>

          {/* --- Log Files Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Log Files
          </h2>
          <p className="text-gray-700 mb-8">
            **BillBro** follows a standard procedure of using **log files**. The
            information collected includes **IP addresses**, **browser type**,
            **ISP**, date and time stamp, referring/exit pages, and possibly the
            number of clicks. These are not linked to any information that is
            personally identifiable and are used for analyzing trends and
            administering the site.
          </p>

          {/* --- Cookies Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Cookies and Web Beacons
          </h2>
          <p className="text-gray-700 mb-4">
            Like any other website, **BillBro** uses **'cookies'** to store
            information including visitors' preferences, and the pages the
            visitor accessed. This information is used to **optimize the users'
            experience** by customizing our web page content based on browser
            type and other information.
          </p>
          <p className="text-gray-700 mb-8">
            For more general information on cookies, please read the{" "}
            <a
              href="https://www.termsfeed.com/blog/cookies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Cookies article on TermsFeed website
            </a>
            .
          </p>

          {/* --- Third Party Policies Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Advertising Partners and Third-Party Privacy Policies
          </h2>
          <p className="text-gray-700 mb-4">
            Third-party ad servers or ad networks use technologies like
            **cookies**, **JavaScript**, or **Web Beacons** in their
            advertisements. Note that **BillBro** has no access to or control
            over these third-party cookies.
          </p>
          <p className="text-gray-700 mb-8">
            **BillBro's** Privacy Policy does not apply to other advertisers or
            websites. We advise you to consult the respective Privacy Policies
            of these third parties for more detailed information on their
            practices and how to opt-out. You can also choose to **disable
            cookies** through your individual browser options.
          </p>

          {/* --- CCPA Rights Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p className="text-gray-700 mb-4">
            Under the CCPA, California consumers have the right to:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700 mb-8">
            <li>
              Request disclosure of the categories and specific pieces of
              personal data collected.
            </li>
            <li>
              Request that a business **delete** any personal data collected.
            </li>
            <li>
              Request that a business that sells a consumer's personal data,
              **not sell** the consumer's personal data.
            </li>
          </ul>

          {/* --- GDPR Rights Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            GDPR Data Protection Rights
          </h2>
          <p className="text-gray-700 mb-4">
            Every user is entitled to the following data protection rights:
          </p>
          <ul className="list-disc list-inside space-y-3 pl-4 text-gray-700 mb-8">
            <li>
              The right to **access** (request copies of your personal data).
            </li>
            <li>
              The right to **rectification** (request correction of inaccurate
              or incomplete information).
            </li>
            <li>
              The right to **erasure** (request deletion of your personal data,
              under certain conditions).
            </li>
            <li>
              The right to **restrict processing** (request restriction of
              processing, under certain conditions).
            </li>
            <li>
              The right to **object to processing** (object to our processing of
              your personal data, under certain conditions).
            </li>
            <li>
              The right to **data portability** (request transfer of collected
              data to another organization or directly to you, under certain
              conditions).
            </li>
          </ul>
          <p className="text-gray-700 mb-8">
            For both CCPA and GDPR requests, we have **one month** to respond to
            you. Please contact us to exercise these rights.
          </p>

          {/* --- Children's Information Section --- */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pt-4">
            Children's Information
          </h2>
          <p className="text-gray-700 mb-4">
            **BillBro** does not knowingly collect any Personal Identifiable
            Information from children under the age of **13**. If you think that
            your child provided this kind of information on our website, we
            strongly encourage you to contact us immediately, and we will do our
            best efforts to promptly remove such information from our records.
          </p>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default PrivacyPolicy;

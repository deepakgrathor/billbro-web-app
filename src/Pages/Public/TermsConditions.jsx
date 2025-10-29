import React from "react";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header/> */}
      <div className="fixed top-0 w-full ">
        <CommonHeader
          title={"Terms & Conditions"}
          handleclick={() => navigate("/")}
        />
      </div>
      <div className=" mx-auto bg-white rounded-xl p-8 my-10 leading-relaxed text-gray-800">
        {/* <SectionHeader title={"Terms and Conditions"} /> */}
        <p className="text-sm text-gray-500 mt-1">
          Effective date: <strong>October 2025</strong>
        </p>

        <p className="mt-4">
          These terms and conditions outline the rules and regulations for the
          use of <strong>Zapnity Services OPC Pvt Ltd</strong>'s Website,
          located at{" "}
          <a
            href="https://billbro.in"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://billbro.in
          </a>
          .
        </p>

        <p className="mt-3">
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use <strong>BillBro</strong> if you do
          not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Terminology
        </h2>
        <p>
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: "Client",
          "You" and "Your" refers to you, the person log on this website and
          compliant to the Company's terms and conditions. "The Company",
          "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
          "Parties", or "Us", refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client's
          needs in respect of provision of the Company's stated services, in
          accordance with and subject to, prevailing law of India.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">Cookies</h2>
        <p>
          We employ the use of cookies. By accessing BillBro, you agree to use
          cookies in agreement with{" "}
          <strong>Zapnity Services OPC Pvt Ltd</strong>
          's Privacy Policy.
        </p>
        <p className="mt-2">
          Most interactive websites use cookies to let us retrieve the user's
          details for each visit. Cookies are used by our website to enable the
          functionality of certain areas to make it easier for people visiting
          our website. Some of our affiliate/advertising partners may also use
          cookies.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">License</h2>
        <p>
          Unless otherwise stated, <strong>Zapnity Services OPC Pvt Ltd</strong>{" "}
          and/or its licensors own the intellectual property rights for all
          material on BillBro. All intellectual property rights are reserved.
          You may access this from BillBro for your own personal use subjected
          to restrictions set in these terms and conditions.
        </p>

        <p className="mt-2">You must not:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Republish material from BillBro</li>
          <li>Sell, rent or sub-license material from BillBro</li>
          <li>Reproduce, duplicate or copy material from BillBro</li>
          <li>Redistribute content from BillBro</li>
        </ul>

        <p className="mt-4">
          Parts of this website offer an opportunity for users to post and
          exchange opinions and information in certain areas of the website.{" "}
          <strong>Zapnity Services OPC Pvt Ltd</strong> does not filter, edit,
          publish or review Comments prior to their presence on the website.
          Comments do not reflect the views and opinions of{" "}
          <strong>Zapnity Services OPC Pvt Ltd</strong>, its agents and/or
          affiliates. Comments reflect the views and opinions of the person who
          posts their views and opinions.
        </p>

        <p className="mt-2">
          To the extent permitted by applicable laws,{" "}
          <strong>Zapnity Services OPC Pvt Ltd</strong> shall not be liable for
          the Comments or for any liability, damages or expenses caused and/or
          suffered as a result of any use of and/or posting of and/or appearance
          of the Comments on this website.
        </p>

        <p className="mt-2">
          <strong>Zapnity Services OPC Pvt Ltd</strong> reserves the right to
          monitor all Comments and to remove any Comments which can be
          considered inappropriate, offensive or causes breach of these Terms
          and Conditions.
        </p>

        <p className="mt-2">You warrant and represent that:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            You are entitled to post the Comments on our website and have all
            necessary licenses and consents to do so;
          </li>
          <li>
            The Comments do not invade any intellectual property right,
            including without limitation copyright, patent or trademark of any
            third party;
          </li>
          <li>
            The Comments do not contain any defamatory, libelous, offensive,
            indecent or otherwise unlawful material which is an invasion of
            privacy;
          </li>
          <li>
            The Comments will not be used to solicit or promote business or
            custom or present commercial activities or unlawful activity.
          </li>
        </ul>

        <p className="mt-3">
          You hereby grant <strong>Zapnity Services OPC Pvt Ltd</strong> a
          non-exclusive license to use, reproduce, edit and authorize others to
          use, reproduce and edit any of your Comments in any and all forms,
          formats or media.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Hyperlinking to our Content
        </h2>
        <p>
          The following organizations may link to our Website without approval:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Government agencies</li>
          <li>Search engines</li>
          <li>News organizations</li>
          <li>
            Online directory distributors may link to our Website in the same
            manner as they hyperlink to other businesses’ websites
          </li>
          <li>
            System wide Accredited Businesses except soliciting non-profit
            organizations, charity malls, and fundraising groups
          </li>
        </ul>

        <p className="mt-3">
          These organizations may link to our home page, to publications or to
          other Website information so long as the link: (a) is not in any way
          deceptive; (b) does not falsely imply sponsorship, endorsement or
          approval; and (c) fits within the context of the linking party's site.
        </p>

        <p className="mt-3">
          We may consider and approve other link requests from consumer/business
          sources, community sites, associations, internet portals, consulting
          firms, educational institutions, and trade associations.
        </p>

        <p className="mt-3">
          Approved organizations may hyperlink by using our corporate name or
          domain <strong>billbro.in</strong>. No use of{" "}
          <strong>Zapnity Services OPC Pvt Ltd</strong>’s logo or other artwork
          will be allowed without a trademark license.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">iFrames</h2>
        <p>
          Without prior approval and written permission, you may not create
          frames around our Webpages that alter in any way the visual
          presentation or appearance of our Website.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Content Liability
        </h2>
        <p>
          We shall not be held responsible for any content that appears on your
          Website. You agree to protect and defend us against all claims that
          arise on your Website.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Reservation of Rights
        </h2>
        <p>
          We reserve the right to request that you remove all links or any
          particular link to our Website. You approve to immediately remove all
          links upon request. We also reserve the right to amend these terms and
          linking policy at any time.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Removal of Links
        </h2>
        <p>
          If you find any link on our Website that is offensive for any reason,
          you are free to contact us anytime. We will consider requests to
          remove links but are not obligated to do so or to respond directly.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">Charges</h2>
        <p>
          Adding money through UPI PPI (Prepaid Instrument) and UPI CC (Credit
          Card) is chargeable, with fees of up to 2.5%.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">
          Plan Verification & Accuracy
        </h2>
        <p>
          We rely on third-party service providers (operators) to supply the
          plans and tariff details. While we make efforts to display accurate
          and up-to-date information, we do not guarantee that every plan shown
          is valid, available, or fully accurate. You are advised to verify the
          plan, rates, and terms from the respective operator before proceeding.
          The actual recharge will be carried out via BillBro; in case the
          operator plan has changed or is unavailable, we reserve the right to
          refuse or adjust the recharge and will not be liable for discrepancies
          arising due to outdated or inaccurate plan data.
        </p>

        <h2 className="text-lg font-semibold text-blue-900 mt-6">Disclaimer</h2>
        <p>
          To the maximum extent permitted by applicable law, we exclude all
          representations, warranties and conditions relating to our website and
          the use of this website. Nothing in this disclaimer will limit or
          exclude liability for death, injury, or fraud. As long as the website
          and the information and services on the website are provided free of
          charge, we will not be liable for any loss or damage of any nature.
        </p>

        <hr className="my-6" />
        <p className="text-sm text-gray-600">
          <strong>Company:</strong> Zapnity Services OPC Pvt Ltd <br />
          <strong>Brand Name:</strong> BillBro <br />
        </p>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default TermsConditions;

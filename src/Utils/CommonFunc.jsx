import CryptoJS from "crypto-js";
import {
  BRAND_NAME,
  COMPANY_PHONE,
  CRYPTO_SECRET,
  PACKAGE_NAME,
} from "./Constant";
import API from "../Redux/API";

export const getToken = async () => {
  try {
    const data = await localStorage.getItem("token");
    if (data) {
      return data;
    }
  } catch (error) {}
};

export const decryptFunc = (data) => {

  const decryptData = CryptoJS.AES.decrypt(data, CRYPTO_SECRET);

  const parseDecryptData = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
  return parseDecryptData;
};
export const openExternalURL = async (url) => {
  window.open(url, "_blank");
};
export const handleChatWhatsapp = ({ number, registered_phone }) => {
  const phoneNumber = number || COMPANY_PHONE; // Replace with the recipient's phone number
  console.log(phoneNumber, "phoneNumber")
  // const message = `Hello ${BRAND_NAME}, Registered Number is ${registered_phone}`; // Replace with the predefined message
  const URL = `https://wa.me/${phoneNumber}?text=Hello%20${BRAND_NAME},%20Phone%20Number%20is%20${registered_phone}`
  // const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
  //   message
  // )}`;
  openExternalURL(URL);
};
export const getSettingFunc = async () => {
  try {
    const res = await API.get(`setting`);
    const data = res.data.Data;
    if (data.customerPhone)
      localStorage.setItem("customerPhone", data.customerPhone);
    if (data.isCashfreeProduction)
      localStorage.setItem("isCashfreeProduction", data.isCashfreeProduction);
  } catch (error) {
    // console.error("CheckAppVersion failed:", error);
  }
};
export const WhatsappShare = ({ ProfileData }) => {
  const imageUrl =
    "https://ik.imagekit.io/43tomntsa/Generated%20Image%20September%2018,%202025%20-%2011_50PM.png";
  const message = encodeURIComponent(
    `🔥 Refer Karo, Kamao ₹! 🔥\n\n` +
      `${BRAND_NAME} App ke saath kamaai ka naya tareeka! 💸\n\n` +
      `Step 1: Use my link to download the app\n\n` +
      `Step 2: Register using your mobile number\n\n` +
      `Step 3: Apne doston ko refer karo aur har successful referral par pao cashback! 📲💰\n\n` +
      `✅ Recharge\n` +
      `✅ Bill Payment\n` +
      `✅ Cashback\n` +
      `✅ Easy Referral Earnings\n\n` +
      `1+ Lakh users trust ${BRAND_NAME} — it's 100% safe and secure. 🔐\n\n` +
      `Refer Code: ${ProfileData.Data.referalId}\n\n` +
      `📥 Download now:\n` +
      `https://play.google.com/store/apps/details?id=${PACKAGE_NAME}\n\n` +
      `Image: ${imageUrl}`
  );

  const whatsappUrl = `https://wa.me/?text=${message}`;

  // Browser me open karna
  window.open(whatsappUrl, "_blank");
};
export function generateUniqueTrxnRefId() {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const usedIds = new Set();

  let alphanumericId = "";

  while (alphanumericId.length < 16) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters[randomIndex];
    alphanumericId += randomChar;
  }

  if (usedIds.has(alphanumericId)) {
    // If the generated ID is not unique, recursively call the function again
    return generateUniqueAlphanumericId(24);
  }

  usedIds.add(alphanumericId);

  return alphanumericId;
}

// export const getDeviceToken = async (setTokenLoad, setDevToken) => {
//   setTokenLoad(true);
//   // const data = await OneSignal.getDeviceState();

//   // const player_id = data.userId;
//   // return player_id;

//   return new Promise(resolve => {
//     let attempts = 0;
//     const maxAttempts = 20; // Increase the number of attempts
//     const delay = 1500; // Increase delay between attempts to give more time

//     const checkToken = async () => {
//       const data = await OneSignal.getDeviceState();
//       if (data && data.userId) {
//         setTokenLoad(false);
//         setDevToken(data.userId);
//         resolve(data.userId);
//       } else if (attempts < maxAttempts) {
//         attempts++;
//         setTimeout(checkToken, delay);
//       } else {
//         resolve(null); // Return null if we reach max attempts
//       }
//     };
//     checkToken();
//   });
// };

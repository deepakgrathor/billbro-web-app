// Operator code to name mapping
const operatorMapping = {
  2: "Airtel",
  11: "Jio",
  23: "Vi (Vodafone Idea)",
  4: "BSNL",
  // Add more as needed
};

const dthOperatorMapping = {
  airtel_tv: "Airtel Digital TV",
  dish_tv: "Dish TV",
  sun_tv: "Sun Direct",
  tata_play: "Tata Play",
  videocon: "Videocon D2H",
  // Add more as needed
};

export const getOperatorName = (code) => {
  return operatorMapping[code] || code || "Unknown Operator";
};

export const getDTHOperatorName = (code) => {
  return dthOperatorMapping[code] || code || "DTH Service";
};

export const getOperatorLogo = (code) => {
  if (!code) return "📱";
  const name = getOperatorName(code).toLowerCase();
  if (name.includes("airtel"))
    return "https://ik.imagekit.io/43tomntsa/airtel.webp";
  if (name.includes("jio")) return "https://ik.imagekit.io/43tomntsa/Jio.webp";
  if (name.includes("vi") || name.includes("vodafone"))
    return "https://ik.imagekit.io/43tomntsa/VI.webp";
  if (name.includes("bsnl"))
    return "https://ik.imagekit.io/43tomntsa/Bsnl.webp";
  return "📱";
};
export const getDTHOperatorLogo = (code) => {
  // if (!code) return "📱";
  // const name = getOperatorName(code).toLowerCase();
  // if (name.includes("airtel"))
  //   return "https://ik.imagekit.io/43tomntsa/airtel.webp";
  // if (name.includes("jio")) return "https://ik.imagekit.io/43tomntsa/Jio.webp";
  // if (name.includes("vi") || name.includes("vodafone"))
  //   return "https://ik.imagekit.io/43tomntsa/VI.webp";
  // if (name.includes("bsnl"))
  //   return "https://ik.imagekit.io/43tomntsa/Bsnl.webp";
  // return "📱";
};

export const getBillLogo = (name) => {
  const logos = {
    Electricity:
      "https://production-api.billbro.info/uploads/services/1745668704827-icon_set_Pratima_Elec._CB616315948_.png",
    Water:
      "https://production-api.billbro.info/uploads/services/1745668897444-icon_set_Pratima_Water._CB616315951_.png",
    Gas: "https://production-api.billbro.info/uploads/services/1745668902639-icon_set_Pratima_Pipegas._CB616315948_.png",
    LPG: "https://production-api.billbro.info/uploads/services/1745668731399-icon_set_Pratima_LPG._CB616315951_.png",
    Cable:
      "https://production-api.billbro.info/uploads/services/1745668908819-icon_set_Pratima_CableTV._CB616315948_.png",
    Broadband:
      "https://production-api.billbro.info/uploads/services/1745668928510-icon_set_Pratima_Braodband._CB616315948_.png",
    Landline:
      "https://production-api.billbro.info/uploads/services/1745668722159-icon_set_Pratima_Landline._CB616315951_.png",
    FASTag:
      "https://production-api.billbro.info/uploads/services/1745668710482-APD_icon_Amazon_Pay_ICICI_Fastag._CB600226984_.png",
    Postpaid:
      "https://production-api.billbro.info/uploads/services/1747125919671-icon_set_Pratima_M_Postoaid._CB616315951_.png",
    "Education Fee":
      "https://production-api.billbro.info/uploads/services/1745668740665-icon_set_Pratima_Edu_fee._CB616315948_.png",
    EMI: "https://production-api.billbro.info/uploads/services/1745668760286-Desktop_APD_EMI-new._CB612762929_.png",
    "Credit Card":
      "https://production-api.billbro.info/uploads/services/1745668767465-icon_set_Pratima_CC_Bill._CB616315951_.png",
    Housing:
      "https://production-api.billbro.info/uploads/services/1745668781878-icon_set_Pratima_M_Tax._CB616315951_.png",
    "Hospital Bills":
      "https://production-api.billbro.info/uploads/services/1693388449224-HospitalBills.webp",
    Subscription:
      "https://production-api.billbro.info/uploads/services/1693388457630-SubscriptionFee.webp",
    "Club Assoc":
      "https://production-api.billbro.info/uploads/services/1693388473176-ClubAsso.webp",
    Tax: "https://production-api.billbro.info/uploads/services/1745668859879-icon_set_Pratima_M_Tax._CB616315951_.png",
    Municipality:
      "https://production-api.billbro.info/uploads/services/1693388494314-MunicipalService.webp",
    "Google Play":
      "https://production-api.billbro.info/uploads/services/1745668990300-APD_icon_GPRC._CB594689751_.png",
  };
  return logos[name] || "📄";
};

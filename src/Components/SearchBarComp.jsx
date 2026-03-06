// import React from "react";
// import { primaryColor } from "../Utils/Style";
// import { MdSearch } from "react-icons/md";
// const SearchBarComp = ({ setFunc, placeholder }) => {
//   return (
//     <div>
//       <div
//         style={{
//           //   backgroundColor: "white",
//           marginHorizontal: 5,
//         }}
//         className="flex m-1 rounded-xl p-4 bg-gray-100 border border-gray-200 items-center space-x-2 flex-row"
//       >
//         <MdSearch color={"black"} size={20} />
//         <input
//           className="outline-none"
//           onChange={(e) => setFunc(e.target.value)}
//           style={{
//             // backgroundColor: "white",
//             width: "90%",
//             color: "black",
//             fontSize: 12,
//           }}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   );
// };

// export default SearchBarComp;
import React from "react";
import { motion } from "framer-motion";
import { MdSearch } from "react-icons/md";

const SearchBarComp = ({ setFunc, placeholder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      {/* Gradient border glow on focus */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 focus-within:opacity-20 blur transition-opacity duration-300" />

      <div className="relative flex items-center gap-3 rounded-2xl border-slate-200  px-4 py-3 shadow-sm focus-within:shadow-md transition-all border border-theme bg-theme-card shadow-theme-card">
        {/* Icon */}
        <MdSearch className="text-slate-400 text-xl shrink-0" />

        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => setFunc(e.target.value)}
          className="
            w-full bg-transparent outline-none
            text-sm font-semibold text-theme-primary
            placeholder:text-theme-muted
          "
        />
      </div>
    </motion.div>
  );
};

export default SearchBarComp;

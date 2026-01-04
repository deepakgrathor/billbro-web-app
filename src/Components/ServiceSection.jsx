// const ServiceSection = ({
//   title,
//   services,
//   serviceLoader,
//   skeletonCount = 4,
// }) => {
//   return (
//     <div className="p-2">
//       <p className="font-semibold">{title}</p>
//       <div className="grid grid-cols-4 gap-2 mt-2">
//         {serviceLoader
//           ? Array(skeletonCount)
//               .fill(0)
//               .map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse"
//                 >
//                   <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
//                   <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
//                 </div>
//               ))
//           : services?.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="text-center active:scale-90 transition transform duration-200 space-y-2 bg-gray-100/50 p-2 py-4 rounded-md"
//               >
//                 <img
//                   // src={item.icon}
//                   src={item.icon}
//                   alt={item.name}
//                   className="w-10 h-10 mx-auto"
//                 />
//                 <p className="text-[10px] tracking-wider">{item.name}</p>
//               </div>
//             ))}
//       </div>
//     </div>
//   );
// };

// export default ServiceSection;
import React from "react";

const ServiceSection = ({
  title,
  services,
  serviceLoader,
  skeletonCount = 4,
}) => {
  return (
    <section className="px-4 py-3">
      {/* Title */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
            Payments
          </p>
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>

        {!serviceLoader && (
          <span className="text-[11px] font-bold text-slate-500">
            {services?.length || 0} items
          </span>
        )}
      </div>

      {/* Card Container */}
      <div className="mt-3 rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.06)]">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {serviceLoader
              ? Array(skeletonCount)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="space-y-2 text-center">
                      <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-200 animate-pulse" />
                      <div className="h-3 w-12 mx-auto rounded bg-slate-200 animate-pulse" />
                    </div>
                  ))
              : services?.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="group flex flex-col items-center gap-2 active:scale-[0.98] transition"
                  >
                    <div className="h-14 w-14 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm group-hover:shadow-md transition flex items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="h-9 w-9 object-contain"
                        loading="lazy"
                      />
                    </div>

                    <p className="text-[10px] font-semibold text-slate-700 text-center leading-tight line-clamp-2">
                      {item.name}
                    </p>
                  </button>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

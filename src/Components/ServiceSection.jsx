const ServiceSection = ({
  title,
  services,
  serviceLoader,
  skeletonCount = 4,
}) => {
  return (
    <div className="p-2">
      <p className="font-semibold">{title}</p>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {serviceLoader
          ? Array(skeletonCount)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="text-center space-y-2 bg-gray-100/50 p-2 py-4 rounded-md animate-pulse"
                >
                  <div className="w-10 h-10 mx-auto bg-gray-300 rounded"></div>
                  <div className="h-3 w-12 mx-auto bg-gray-300 rounded"></div>
                </div>
              ))
          : services?.map((item, idx) => (
              <div
                key={idx}
                className="text-center active:scale-90 transition transform duration-200 space-y-2 bg-gray-100/50 p-2 py-4 rounded-md"
              >
                <img
                  // src={item.icon}
                  src={item.icon}
                  alt={item.name}
                  className="w-10 h-10 mx-auto"
                />
                <p className="text-[10px] tracking-wider">{item.name}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ServiceSection;

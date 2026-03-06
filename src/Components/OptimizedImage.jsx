import React from "react";

const OptimizedImage = React.memo(({
  src,
  alt = "",
  width,
  height,
  className = "",
  ...props
}) => {
  const optimizedSrc = (() => {
    if (!src) return "";
    // ImageKit URLs support transformation parameters
    if (src.includes("ik.imagekit.io")) {
      const params = [];
      if (width) params.push(`w-${width}`);
      params.push("q-80", "f-webp");
      return `${src}?tr=${params.join(",")}`;
    }
    return src;
  })();

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { ImageBaseURL } from "../Utils/Constant";
import { useNavigate } from "react-router-dom";
import { openExternalURL } from "../Utils/CommonFunc";

const BannerSlider = React.memo(({ style, data }) => {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        slidesPerView={1}
        loop={data.length > 1}
        spaceBetween={5}
      >
        {data.map((item, idx) => (
          <SwiperSlide key={item._id || idx}>
            <img
              onClick={() => {
                item.type === "https"
                  ? openExternalURL(item.link)
                  : navigate(item.link);
              }}
              style={style}
              className="w-full h-52 bg-center bg-cover bg-slate-100"
              src={`${ImageBaseURL}${item.image}`}
              alt={item.title || `Banner ${idx + 1}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});

BannerSlider.displayName = "BannerSlider";

export default BannerSlider;

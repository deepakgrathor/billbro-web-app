import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { ImageBaseURL } from "../Utils/Constant";
import { useNavigate } from "react-router-dom";
import { openExternalURL } from "../Utils/CommonFunc";

const BannerSlider = ({ style, data }) => {
  const navigate = useNavigate();
  const slides = [
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083050280.png&w=640&q=75",
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083029381.png&w=640&q=75",
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083064991.png&w=640&q=75",
  ];

  return (
    <div className="w-full overflow-hidden ">
      <Swiper
        modules={[Autoplay]} // 👈 enable autoplay module
        autoplay={{ delay: 2500 }} // 2 sec delay
        slidesPerView={1}
        loop={true}
        spaceBetween={5}
        s
      >
        {data.map((item, idx) => (
          <SwiperSlide key={idx}>
            <img
              onClick={() => {
                item.type === "https"
                  ? openExternalURL(item.link)
                  : navigate(item.link);
              }}
              style={style}
              className="w-full h-52 bg-center bg-cover"
              src={`${ImageBaseURL}${item.image}`}
              alt=""
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;

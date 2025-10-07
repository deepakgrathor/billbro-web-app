import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const BannerSlider = ({ style }) => {
  const slides = [
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083050280.png&w=640&q=75",
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083029381.png&w=640&q=75",
    "https://app.billhub.in/_next/image?url=https%3A%2F%2Fapi.billhub.in%2FQ7AhYIDEGwOVl2EeaMnv%2F%2Fuploads%2Fbanners%2F2025083064991.png&w=640&q=75",
  ];

  return (
    <div className="w-full overflow-hidden ">
      <Swiper
        modules={[Autoplay]} // 👈 enable autoplay module
        autoplay={{ delay: 2000 }} // 2 sec delay
        slidesPerView={1}
        loop={true}
        spaceBetween={5}
        s
      >
        {slides.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              style={style}
              className="w-full h-52 bg-center bg-cover"
              src={img}
              alt=""
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;

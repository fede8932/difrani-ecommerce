/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { getAllBanners } from "../../../axios/request/productsRequest";

interface BannerProps {
  height?: string; // opcional si querés personalizar altura
}

const Banner: React.FC<BannerProps> = ({ height = "300px" }) => {
  const [list, setList] = useState<any>([]);
  // console.log(list)

  useEffect(() => {
    getAllBanners().then((res) => {
      setList(res);
    });
  }, []);
  return (
    <div className={styles.container} style={{ height }}>
      <Swiper
        style={{ marginTop: "-5px" }}
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {list.map((d: any, i: number) => (
          <SwiperSlide key={i}>
            <div>
              <img src={d.image} alt="Banner" className={styles.image} />
              <div className={styles.gradient} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;

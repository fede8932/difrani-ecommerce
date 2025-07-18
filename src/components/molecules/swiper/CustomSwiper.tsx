/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import SaleView from "../../organisms/saleView/SaleView";

interface IProps {
  list: any[]
}

export default function CustomSwiper(props: IProps) {
  const { list } = props;
  return (
    <>
      <Swiper
        style={{ marginTop: "-5px" }}
        slidesPerView={4}
        spaceBetween={30}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        {list.map((d, i) => (
          <SwiperSlide key={i}>
            <SaleView
              image={d.image}
              type={d.type}
              ofertas={d.ofertas}
              producto={d.producto}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

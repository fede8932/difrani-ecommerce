/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
// import data from "./data.json";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
// import ModalComponent from "../modal/ModalComponent";
import SaleView from "../../organisms/saleView/SaleView";

interface IProps {
  list: any[]
}

export default function CustomSwiper(props: IProps) {
  const { list } = props;
  console.log(list)
  return (
    <>
      <Swiper
        style={{ marginTop: "-5px" }}
        slidesPerView={4}
        spaceBetween={30}
        // pagination={{ clickable: true }}
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
            {/* <ModalComponent
              title={d.type === "oferta" ? "OFERTA" : "LANZAMIENTO"}
              button={
                <div style={{ height: "195px" }}>
                  <img
                    src={d.image}
                    alt={d.producto.article}
                    className="image"
                  />
                </div>
              }
            >
              <SaleView
                image={d.image}
                type={d.type}
                ofertas={d.ofertas}
                producto={d.producto}
              />
            </ModalComponent> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

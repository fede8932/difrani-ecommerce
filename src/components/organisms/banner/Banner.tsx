import React from "react";
import styles from "./banner.module.css";

interface BannerProps {
  imageUrl: string;
  height?: string; // opcional si querés personalizar altura
}

const Banner: React.FC<BannerProps> = ({ imageUrl, height = "300px" }) => {
  return (
    <div className={styles.container} style={{ height }}>
      <img src={imageUrl} alt="Banner" className={styles.image} />
      <div className={styles.gradient} />
    </div>
  );
};

export default Banner;

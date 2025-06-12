import styles from "./saleView.module.css";
import img from "../../../assets/amortiguador-de-coche.jpg"; // aca va la imagen sin imagen
import { Popup } from "semantic-ui-react";

interface Oferta {
  minimo: number;
  porcentaje: number;
  name: string;
}

interface Producto {
  id: number;
  article: string;
  description: string;
  price: number;
}

interface ProductCardProps {
  producto: Producto;
  image: string;
  type: string;
  ofertas?: Oferta[];
}

const SaleView: React.FC<ProductCardProps> = ({
  producto,
  image,
  type,
  ofertas,
}) => {
  return (
    <div className={styles.card}>
      <img
        src={image != "" ? image : img}
        alt={producto.description}
        className={styles.image}
      />
      <div className={styles.info}>
        <h3>{producto.article?.toUpperCase()}</h3>
        <Popup
          content={producto.description?.toUpperCase()}
          trigger={
            <p style={{ fontSize: "9px" }}>
              {producto.description?.substring(0, 45).toUpperCase()}
            </p>
          }
        />
        {/* <p className={styles.price}>${producto.price.toFixed(2)}</p> */}
        <span
          className={`${styles.badge} ${
            type === "oferta" ? styles.offer : styles.new
          }`}
        >
          {type === "oferta" ? "Oferta" : "Lanzamiento"}
        </span>

        {type === "oferta" && ofertas && (
          <ul className={styles.ofertas}>
            {ofertas.map((oferta, idx) => (
              <li key={idx}>
                {oferta.porcentaje * 100}% (mínimo {oferta.minimo} u.)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SaleView;

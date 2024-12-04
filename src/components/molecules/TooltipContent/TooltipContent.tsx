/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo } from "react";
import { IProduct, ISale } from "../../../redux/reducers/catalogoReducer";
import styles from "./tooltip.module.css"

const TooltipContent = (props: any) => {
  const product: IProduct = props.product;

  const salesClasificate = useCallback(() => {
    const brandSales: ISale[] = product.brand.sales;
    const productSales: ISale[] = product.sales;

    if (brandSales.length > 0) return { sales: brandSales, type: "brand" };

    return { sales: productSales, type: "product" };
  }, [product.brand?.sales, product.sales]);

  const listSales: { type: string; sales: ISale[] } = useMemo(
    () => salesClasificate(),
    [salesClasificate]
  );

  return (
    <div style={{ width: "325px" }}>
        <h4 className={styles.title}>{listSales.type == 'brand' ? "OFERTA EN TODA LA MARCA" : "PRODUCTO EN OFERTA"}</h4>
      {listSales.sales.map((sale) => (
        <div className={styles.tooltipContainer}>
            <h6 className={styles.subtitle}>Referencia: <span>{sale.referencia}</span></h6>
            <h6 className={styles.subtitle}>Descuento: <span>{sale.percentage * 100} %</span></h6>
            <h6 className={styles.subtitle}>Unidades: <span>{sale.minUnit} </span></h6>
        </div>
      ))}
    </div>
  );
};

export default TooltipContent;

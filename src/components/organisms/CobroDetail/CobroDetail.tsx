import { Label } from "semantic-ui-react";
import { ISellerReceipt } from "../../../redux/reducers/SellerReceipt";
import styles from "./cobroDetail.module.css";

interface IProps {
  sellerRec: ISellerReceipt;
}

function CobroDetail(props: IProps): React.ReactElement {
  const { sellerRec } = props;
  console.log(sellerRec);
  return (
    <div className={styles.cobroCont}>
      <div>
        <p>Facturas:</p>
        <div className={styles.facturas}>
          {sellerRec.movements.map((m) => {
            let type: string = "";
            if (m.type == 0) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              type = "F-";
            }
            if (m.type == 1) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              type = "NC-";
            }
            if (m.type == 3) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              type = "NC-";
            }
            return <Label style={{marginTop: "2px"}}>{`${type}${m.numComprobante}`}</Label>;
          })}
        </div>
      </div>
      <div className={styles.payContainer}>
        <p>Cheques: ${sellerRec.montoCheque}</p>
        <div className={styles.facturas}>
          {sellerRec.cheques.map((c) => <Label style={{marginTop: "2px"}}>{`N° ${c.numero}`}</Label>)}
        </div>
      </div>
      <div className={styles.payContainer}>
        <p>Transferencia: ${sellerRec.montoTransf}</p>
        <div className={styles.facturas}>
        <Label style={{marginTop: "2px"}}>OP: {sellerRec.numOperación}</Label>
        <Label style={{marginTop: "2px"}}>Entidad: {sellerRec.bancoTransf?.toUpperCase()}</Label>
        </div>
      </div>
      <div className={styles.payContainer}>
        <p>Efectivo: ${sellerRec.montoEfect}</p>
      </div>
    </div>
  );
}

export default CobroDetail;

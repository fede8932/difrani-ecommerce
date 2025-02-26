import { Label } from "semantic-ui-react";
import styles from "./cobroDetail.module.css";
import { useEffect, useState } from "react";
import { IDailyClosingSeller } from "../../../redux/reducers/SellerClosing";
import { GetClosingId } from "../../../axios/request/sellerRequest";

interface IProps {
  closeId: number;
}

function CloseDetail(props: IProps): React.ReactElement {
  const { closeId } = props;
  const [close, setClose] = useState<IDailyClosingSeller | null>(null);

  useEffect(() => {
    GetClosingId(closeId).then((res) => setClose(res));
  }, [closeId]);
  return (
    <div className={styles.cobroCont}>
      <div>
        <p>Facturas:</p>
        <div className={styles.facturas}>
          {close?.movements.map((m) => {
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
        <p>Cobros: ${close?.sellerReceipts.reduce((acum, s) => acum + s.total, 0)}</p>
        <div className={styles.facturas}>
          {close?.sellerReceipts.map((s) => <Label style={{marginTop: "2px"}}>{`N° ${s.id}`}</Label>)}
        </div>
      </div>
    </div>
  );
}

export default CloseDetail;

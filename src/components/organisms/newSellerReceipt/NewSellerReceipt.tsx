/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
import styles from "./newSellerReceipt.module.css";
// import { IAcountState } from "../../../redux/reducers/acountReducer";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
import { DatePicker } from "antd";
import { Button } from "semantic-ui-react";

function NewSellerReceipt(): ReactNode {
  const [montoEf, setMontoEf] = useState(0);
  const [montoCh, setMontoCh] = useState(0);
  const [montoTr, setMontoTr] = useState(0);

  const [bancoTr, setBancoTr] = useState("");
  const [bancoCh, setBancoCh] = useState("");

  const [op, setOp] = useState("");
  const [numCh, setNumCh] = useState("");

  const [coment, setComent] = useState("");
  const [cobroCh, setCobroCh] = useState<string | string[]>("");

  const handleChange = (e: any, fn: any) => {
    fn(e.target.value);
  };

  console.log(cobroCh);
  //   const acountStatus: IAcountState = useSelector(
  //     (state: RootState) => state.acount
  //   );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Total facturado:</span>
        <span>${1111}</span>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputCont}>
          <label>Monto en efectivo</label>
          <input
            className={styles.newImput}
            placeholder="Monto en pesos en efectivo"
            value={montoEf}
            onChange={(e) => handleChange(e, setMontoEf)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Monto transferido</label>
          <input
            className={styles.newImput}
            placeholder="Monto pagado por transferencia"
            value={montoTr}
            onChange={(e) => handleChange(e, setMontoTr)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Entidad financiera</label>
          <input
            className={styles.newImput}
            placeholder="Ingresar el nombre de la entidad"
            value={bancoTr}
            onChange={(e) => handleChange(e, setBancoTr)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Número de operación</label>
          <input
            className={styles.newImput}
            placeholder="Ingresar el N° de operación emitido por la entidad"
            value={op}
            onChange={(e) => handleChange(e, setOp)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Monto de cheque</label>
          <input
            className={styles.newImput}
            placeholder="Monto pagado por cheque"
            value={montoCh}
            onChange={(e) => handleChange(e, setMontoCh)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Entidad bancaria</label>
          <input
            className={styles.newImput}
            placeholder="Nombre de la entidad que figura en el cheque"
            value={bancoCh}
            onChange={(e) => handleChange(e, setBancoCh)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Número de cheque</label>
          <input
            className={styles.newImput}
            placeholder="Ingresar tal cual figura en el cheque"
            value={numCh}
            onChange={(e) => handleChange(e, setNumCh)}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Fecha de cobro</label>
          <DatePicker
            placeholder="Seleccioná la fecha"
            onChange={(_, ds) => {
              setCobroCh(ds);
            }}
            className={styles.newImput}
          />
        </div>
        <div className={styles.inputCont}>
          <label>Comentarios</label>
          <textarea
            className={styles.newText}
            placeholder="Puedes ingresar comentarios importantes"
            value={coment}
            onChange={(e) => handleChange(e, setComent)}
          />
        </div>
        <div className={styles.butCont}>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </div>
  );
}

export default NewSellerReceipt;

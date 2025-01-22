import { ReactNode } from "react";
import styles from "./newSellerReceipt.module.css";
// import { IAcountState } from "../../../redux/reducers/acountReducer";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
import { DatePicker } from "antd";

function NewSellerReceipt(): ReactNode {
//   const acountStatus: IAcountState = useSelector(
//     (state: RootState) => state.acount
//   );
  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <form className={styles.form}>
        <div className={styles.inputCont}>
          <label>Monto en efectivo</label>
          <input className={styles.newImput} placeholder="Monto en pesos en efectivo"/>
        </div>
        <div className={styles.inputCont}>
          <label>Monto transferido</label>
          <input className={styles.newImput} placeholder="Monto pagado por transferencia"/>
        </div>
        <div className={styles.inputCont}>
          <label>Entidad financiera</label>
          <input className={styles.newImput} placeholder="Ingresar el nombre de la entidad"/>
        </div>
        <div className={styles.inputCont}>
          <label>Número de operación</label>
          <input className={styles.newImput} placeholder="Ingresar el N° de operación emitido por la entidad"/>
        </div>
        <div className={styles.inputCont}>
          <label>Monto de cheque</label>
          <input className={styles.newImput} placeholder="Monto pagado por cheque"/>
        </div>
        <div className={styles.inputCont}>
          <label>Entidad bancaria</label>
          <input className={styles.newImput} placeholder="Nombre de la entidad que figura en el cheque"/>
        </div>
        <div className={styles.inputCont}>
          <label>Número de cheque</label>
          <input className={styles.newImput} placeholder="Ingresar tal cual figura en el cheque"/>
        </div>
        <div className={styles.inputCont}>
          <label>Fecha de cobro</label>
          <DatePicker placeholder="Seleccioná la fecha" onChange={() => {}} className={styles.newImput}/>
        </div>
        <div className={styles.inputCont}>
          <label>Comentarios</label>
          <textarea className={styles.newText}/>
        </div>
      </form>
    </div>
  );
}

export default NewSellerReceipt;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useState } from "react";
import styles from "./newSellerReceipt.module.css";
// import { IAcountState } from "../../../redux/reducers/acountReducer";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../redux/store";
import { DatePicker } from "antd";
import { Button, Checkbox } from "semantic-ui-react";

function NewSellerReceipt(): ReactNode {
  type CheckType = { [key in "efec" | "cheq" | "tran"]: boolean };
  type CheQueType = {
    montoCh: string;
    bancoCh: string;
    numCh: string;
    cobroCh: string | string[];
  };
  const [checkType, setCheckType] = useState<CheckType>({
    efec: true,
    cheq: false,
    tran: false,
  });

  const [montoEf, setMontoEf] = useState(0);
  const [montoTr, setMontoTr] = useState(0);

  const [bancoTr, setBancoTr] = useState("");

  const [op, setOp] = useState("");

  const [coment, setComent] = useState("");

  const [chequeState, setChequeState] = useState<CheQueType[]>([
    { montoCh: "", bancoCh: "", numCh: "", cobroCh: "" },
  ]);

  const handleChange = (e: any, fn: any) => {
    fn(e.target.value);
  };
  const handleChequeChange = (e: any, i: number) => {
    const newChequeState = [...chequeState];
    newChequeState[i] = e.target.value;
    setChequeState(newChequeState);
  };
  //   const acountStatus: IAcountState = useSelector(
  //     (state: RootState) => state.acount
  //   );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleChecked = (name: "efec" | "cheq" | "tran") => {
    const newCheckType = { ...checkType };
    newCheckType[name] = !newCheckType[name];
    let update: boolean = false;
    for (const key in newCheckType) {
      if (newCheckType[key as keyof typeof newCheckType]) {
        update = true;
      }
    }
    if (update) {
      setCheckType(newCheckType);
    }
  };

  const addNewCheq = () => {
    const newChequeState = [...chequeState];
    newChequeState.push({ montoCh: "", bancoCh: "", numCh: "", cobroCh: "" });
    setChequeState(newChequeState);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Total facturado:</span>
        <span>${1111}</span>
      </div>
      <div className={styles.cheCont}>
        <Checkbox
          label="Efectivo"
          checked={checkType.efec}
          onChange={() => handleChecked("efec")}
        />
        <Checkbox
          label="Transferencia"
          checked={checkType.tran}
          onChange={() => handleChecked("tran")}
        />
        <Checkbox
          label="Cheque"
          checked={checkType.cheq}
          onChange={() => handleChecked("cheq")}
        />
      </div>
      <form className={styles.formu} onSubmit={handleSubmit}>
        {checkType.efec ? (
          <div className={styles.inputCont}>
            <label>Monto en efectivo</label>
            <input
              className={styles.newImput}
              placeholder="Monto en pesos en efectivo"
              value={montoEf}
              onChange={(e) => handleChange(e, setMontoEf)}
            />
          </div>
        ) : null}
        {checkType.tran ? (
          <>
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
          </>
        ) : null}
        {checkType.cheq
          ? chequeState.map((item, i) => (
              <>
                <div className={styles.inputCont}>
                  <label>{chequeState.length < 2 ? "Monto de cheque" : `Monto de cheque ${i+1}`}</label>
                  <input
                    className={styles.newImput}
                    placeholder="Monto pagado por cheque"
                    value={item.montoCh}
                    onChange={(e) => handleChequeChange(e, i)}
                  />
                </div>
                <div className={styles.inputCont}>
                  <label>{chequeState.length < 2 ? "Entidad bancaria" : `Entidad bancaria de cheque ${i+1}`}</label>
                  <input
                    className={styles.newImput}
                    placeholder="Nombre de la entidad que figura en el cheque"
                    value={item.bancoCh}
                    onChange={(e) => handleChequeChange(e, i)}
                  />
                </div>
                <div className={styles.inputCont}>
                  <label>{chequeState.length < 2 ? "Número de cheque" : `Número de cheque ${i+1}`}</label>
                  <input
                    className={styles.newImput}
                    placeholder="Ingresar tal cual figura en el cheque"
                    value={item.numCh}
                    onChange={(e) => handleChequeChange(e, i)}
                  />
                </div>
                <div className={styles.inputCont}>
                <label>{chequeState.length < 2 ? "Fecha de cobro" : `Fecha de cobro de cheque ${i+1}`}</label>
                  <DatePicker
                    placeholder="Seleccioná la fecha"
                    onChange={(_, ds) => {
                      const newChequeState = [...chequeState];
                      newChequeState[i].cobroCh = ds;
                      setChequeState(newChequeState);
                    }}
                    className={styles.newImput}
                  />
                </div>
                {chequeState.length < 2 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      width: "95%",
                    }}
                  >
                    <button
                      type="button"
                      onClick={addNewCheq}
                      className={styles.addBut}
                    >
                      Add
                    </button>
                  </div>
                ) : null}
              </>
            ))
          : null}
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

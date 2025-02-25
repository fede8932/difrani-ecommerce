/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useMemo, useState } from "react";
import styles from "./newSellerReceipt.module.css";
import {
  GetCurrentAcountState,
  IAcountState,
  resetAcountState,
} from "../../../redux/reducers/acountReducer";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { DatePicker } from "antd";
import { Button, Checkbox } from "semantic-ui-react";
import toast from "react-hot-toast";
import {
  AddPay,
  ICreateSellerReceipt,
} from "../../../redux/reducers/SellerReceipt";
import { useDispatch } from "react-redux";
import { applyInTermPayDiscount } from "../../../utils";

interface IProps {
  onClose?: () => void;
}

function NewSellerReceipt(props: IProps): ReactNode {
  const { onClose } = props;
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

  const dispatch: AppDispatch = useDispatch();
  const [discApply, setDiscApply] = useState(false);
  const [montoEf, setMontoEf] = useState("");
  const [montoTr, setMontoTr] = useState("");

  const [bancoTr, setBancoTr] = useState("");

  const [op, setOp] = useState("");

  const [coment, setComent] = useState("");

  const [chequeState, setChequeState] = useState<CheQueType[]>([
    { montoCh: "", bancoCh: "", numCh: "", cobroCh: "" },
  ]);

  const handleChange = (e: any, fn: any) => {
    fn(e.target.value);
  };

  const handleChequeChange = (
    e: any,
    i: number,
    key: "montoCh" | "bancoCh" | "numCh" | "cobroCh"
  ) => {
    const newChequeState = [...chequeState];
    newChequeState[i][key] = e.target.value;
    setChequeState(newChequeState);
  };
  const acountStatus: IAcountState = useSelector(
    (state: RootState) => state.acount
  );

  // console.log(acountStatus);
  const user = useSelector((state: RootState) => state.user);
  const { loading } = useSelector((state: RootState) => state.sellerReceipt);
  const { totalSelect, selectMovements } = useSelector(
    (state: RootState) => state.acount
  );

  // console.log(user);

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

  const total = useMemo(() => {
    if (discApply) return applyInTermPayDiscount(totalSelect);
    return totalSelect;
  }, [discApply, totalSelect]);

  const addNewCheq = () => {
    const newChequeState = [...chequeState];
    newChequeState.push({ montoCh: "", bancoCh: "", numCh: "", cobroCh: "" });
    setChequeState(newChequeState);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (
      checkType.efec &&
      (montoEf === null || montoEf == "" || isNaN(Number(montoEf)))
    ) {
      toast.error("El campo monto en efectivo no es correcto");
      return;
    }
    if (
      checkType.tran &&
      (montoTr === null ||
        montoTr == "" ||
        isNaN(Number(montoTr)) ||
        op == "" ||
        op === null ||
        bancoTr === null ||
        bancoTr === "null")
    ) {
      toast.error("Los campos de transferencia no están bien definidos");
      return;
    }
    let totalCheque = 0;
    let sendChequeState = [...chequeState];
    if (checkType.cheq) {
      sendChequeState.map((cheque, index) => {
        if (
          cheque.bancoCh === null ||
          cheque.bancoCh == "" ||
          cheque.cobroCh === null ||
          cheque.cobroCh == "" ||
          cheque.montoCh === null ||
          cheque.montoCh == "" ||
          isNaN(Number(cheque.montoCh)) ||
          cheque.numCh === null ||
          cheque.numCh == ""
        ) {
          toast.error(
            `Los campos en el cheque ${index + 1}, no están bien definido`
          );
          return;
        }
        totalCheque += Number(cheque.montoCh);
      });
    } else {
      sendChequeState = [];
    }

    if (Number(montoEf) + Number(montoTr) + totalCheque > total) {
      toast.error(`El pago total no puede superar los movimientos marcados`);
      return;
    }
    const send: ICreateSellerReceipt = {
      clientId: acountStatus?.data?.client?.id,
      userId: user?.data?.userId,
      montoEfect: Number(montoEf),
      montoTransf: Number(montoTr),
      bancoTransf: bancoTr,
      numOperación: op,
      comments: coment,
      chequeData: sendChequeState,
      movIds: selectMovements.map((item) => item.movement.id),
      inTermPayDiscount: discApply,
    };
    dispatch(AddPay(send))
      .then((res: any) => {
        if (res.error) {
          toast.error(`Error: ${res.error.message}`);
          return;
        }
        dispatch(resetAcountState());
        dispatch(
          GetCurrentAcountState({
            clientId: user.data?.clientId || 0,
            rows: 10,
            page: 1,
            pending: true,
          })
        ).then(() => {
          toast.success("Guardado con éxito");
        });
        onClose!();
      })
      .catch((err: any) => {
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Total a cobrar:</span>
        <span>${total}</span>
      </div>
      <div className={styles.cheCont}>
        <Checkbox
          label="Aplicar desucuento por pago en término"
          checked={discApply}
          onChange={() => setDiscApply(!discApply)}
        />
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
                  <label>
                    {chequeState.length < 2
                      ? "Monto de cheque"
                      : `Monto de cheque ${i + 1}`}
                  </label>
                  <input
                    className={styles.newImput}
                    placeholder="Monto pagado por cheque"
                    value={item.montoCh}
                    onChange={(e) => handleChequeChange(e, i, "montoCh")}
                  />
                </div>
                <div className={styles.inputCont}>
                  <label>
                    {chequeState.length < 2
                      ? "Entidad bancaria"
                      : `Entidad bancaria de cheque ${i + 1}`}
                  </label>
                  <input
                    className={styles.newImput}
                    placeholder="Nombre de la entidad que figura en el cheque"
                    value={item.bancoCh}
                    onChange={(e) => handleChequeChange(e, i, "bancoCh")}
                  />
                </div>
                <div className={styles.inputCont}>
                  <label>
                    {chequeState.length < 2
                      ? "Número de cheque"
                      : `Número de cheque ${i + 1}`}
                  </label>
                  <input
                    className={styles.newImput}
                    placeholder="Ingresar tal cual figura en el cheque"
                    value={item.numCh}
                    onChange={(e) => handleChequeChange(e, i, "numCh")}
                  />
                </div>
                <div className={styles.inputCont}>
                  <label>
                    {chequeState.length < 2
                      ? "Fecha de cobro"
                      : `Fecha de cobro de cheque ${i + 1}`}
                  </label>
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
          <Button disabled={loading} type="submit">
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default NewSellerReceipt;

/* eslint-disable prefer-const */
import { Button, Divider } from "semantic-ui-react";
import Input from "../../atoms/input/Input";
import styles from "./changePass.module.css";
import { useMemo, useState } from "react";
import { ChangePassReq } from "../../../axios/request/userRequest";
import toast from "react-hot-toast";
import { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { changePassOmit } from "../../../redux/reducers/userReducer";

function ChangePass() {
  const dispatch: AppDispatch = useDispatch()
  const [formInput, setFormInput] = useState({
    pass: "",
    newPass: "",
    newPassw: "",
  });
  const [loading, setLoading] = useState(false);
  const disabled: boolean = useMemo(() => {
    if (
      formInput.pass == "" ||
      formInput.pass == null ||
      formInput.newPass == "" ||
      formInput.newPass == null ||
      formInput.newPassw == "" ||
      formInput.newPassw == null ||
      formInput.newPass != formInput.newPassw ||
      formInput.newPass.length < 8
    )
      return true;
    return false;
  }, [formInput]);

  const changePass = () => {
    setLoading(true);
    ChangePassReq({ pass: formInput.pass, newPass: formInput.newPass })
      .then(() => {
        toast.success("Has actualizado tus datos con éxito");
        setFormInput({
          pass: "",
          newPass: "",
          newPassw: "",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
      })
      .finally(() => setLoading(false));
  };

  const omitChange = () => {
    dispatch(changePassOmit())
  }

  return (
    <div>
      <div className={styles.inputCont}>
        <label>Contraseña actual</label>
        <Input
          width="65%"
          height="29px"
          type="password"
          placeholder="Ingresá tu contraseña actual"
          value={formInput.pass}
          onChange={(v) => {
            let newFormState = { ...formInput };
            newFormState.pass = v;
            setFormInput(newFormState);
          }}
        />
      </div>
      <div className={styles.inputCont}>
        <label>
          Nueva contraseña{" "}
          <span className={styles.req}>* Mínimo 8 dígitos</span>
        </label>
        <Input
          width="65%"
          height="29px"
          type="password"
          placeholder="Ingresá tu nueva contraseña"
          value={formInput.newPass}
          onChange={(v) => {
            let newFormState = { ...formInput };
            newFormState.newPass = v;
            setFormInput(newFormState);
          }}
        />
      </div>
      <div className={styles.inputCont}>
        <label>
          Nueva contraseña{" "}
          <span className={styles.req}>* Debe ser igual al campo anterior</span>
        </label>
        <Input
          width="65%"
          height="29px"
          type="password"
          placeholder="Volvé a ingresar tu nueva contraseña"
          value={formInput.newPassw}
          onChange={(v) => {
            let newFormState = { ...formInput };
            newFormState.newPassw = v;
            setFormInput(newFormState);
          }}
        />
      </div>
      <Divider />
      <div className={styles.buttonContainer}>
        <Button
          color="yellow"
          onClick={omitChange}
          className={styles.but}
        >
          Omitir
        </Button>
        <Button
          disabled={disabled}
          color="green"
          onClick={changePass}
          className={styles.but}
        >
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>
    </div>
  );
}

export default ChangePass;

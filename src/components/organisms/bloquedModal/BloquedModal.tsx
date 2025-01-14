import styles from "./bloquedModal.module.css";
import { Divider } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect } from "react";

interface Iprops {
  children: React.ReactNode;
  title?: string;
}

function BloquedModal(props: Iprops) {
  const { title, children } = props;

  const dataUser = useSelector((state: RootState) => state.user.data);

  // console.log(dataUser);

  useEffect(() => {
    if (dataUser?.firstEntry) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      // Restaurar scroll al desmontar el componente
      document.body.style.overflow = "auto";
    };
  }, [dataUser]);

  return (
    <>
      {dataUser?.firstEntry ? (
        <div className={styles.display}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h5>{title || "Título"}</h5>
            </div>
            <Divider />
            <div className={styles.modalBody}>
              <p>
                Por razones de seguridad, al ser este su primer ingreso al
                sistema, le solicitamos cambiar su contraseña. Esto garantizará
                la protección de su cuenta y el acceso seguro a nuestros
                servicios. Por favor, siga las instrucciones proporcionadas para
                realizar el cambio.
              </p>
              <div>{children}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default BloquedModal;

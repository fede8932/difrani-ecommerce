import React from "react";
import styles from "./permissionDenied.module.css";

function PermissionDenied(): React.ReactNode {
  return (
    <div className={styles.view}>
      <div className={styles.container}>
        <span
          style={{ fontSize: "55px" }}
          className="material-symbols-outlined"
        >
          lock
        </span>
        <span className={styles.title}>Acceso Denegado</span>
        <span className={styles.message}>
          Comunicate con el administrador de permisos
        </span>
      </div>
    </div>
  );
}

export default PermissionDenied;

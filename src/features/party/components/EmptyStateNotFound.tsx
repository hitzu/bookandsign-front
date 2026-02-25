import React from "react";
import styles from "@assets/css/party-public.module.css";

const EmptyStateNotFound = () => {
  return (
    <section className={styles.notFoundState}>
      <h2>Evento no encontrado</h2>
      <p>Verifica el enlace o solicita un nuevo acceso al equipo Brillipoint.</p>
    </section>
  );
};

export default EmptyStateNotFound;

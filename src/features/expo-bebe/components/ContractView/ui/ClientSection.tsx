import styles from "@assets/css/expo-bebe.module.css";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function ClientSection({ vm }: { vm: ContractFormVM }) {
  const { nombre, setNombre, email, setEmail, telefono, setTelefono, isLocked } =
    vm;

  return (
    <section className={styles.panel}>
      <SectionHead n="02" text="datos del" accent="cliente" />

      <div>
        <label className={styles.cfLabel}>
          Nombre <span className={styles.cfRequired}>✦</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre y apellidos"
          className={styles.cfInput}
          disabled={isLocked}
        />
      </div>

      <div className={styles.cfGrid2} style={{ marginTop: 12 }}>
        <div>
          <label className={styles.cfLabel}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className={styles.cfInput}
            disabled={isLocked}
          />
        </div>
        <div>
          <label className={styles.cfLabel}>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="10 dígitos"
            className={styles.cfInput}
            disabled={isLocked}
          />
        </div>
      </div>
    </section>
  );
}

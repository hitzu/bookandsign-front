import { useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import {
  isValidEmailFormat,
  PHONE_DIGITS_LENGTH,
  sanitizePhoneInput,
} from "../../../utils/contactValidation";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function ClientSection({ vm }: { vm: ContractFormVM }) {
  const [emailTouched, setEmailTouched] = useState(false);
  const { nombre, setNombre, email, setEmail, telefono, setTelefono, isLocked } =
    vm;
  const showEmailInvalid = emailTouched && !isValidEmailFormat(email);

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
            onBlur={() => setEmailTouched(true)}
            placeholder="correo@ejemplo.com"
            className={`${styles.cfInput} ${showEmailInvalid ? styles.cfInputInvalid : ""}`.trim()}
            disabled={isLocked}
            autoComplete="email"
          />
        </div>
        <div>
          <label className={styles.cfLabel}>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(sanitizePhoneInput(e.target.value))}
            placeholder="10 dígitos"
            className={styles.cfInput}
            disabled={isLocked}
            autoComplete="tel"
            inputMode="numeric"
            maxLength={PHONE_DIGITS_LENGTH}
          />
        </div>
      </div>
    </section>
  );
}

import styles from "@assets/css/expo-bebe.module.css";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function NotesSection({ vm }: { vm: ContractFormVM }) {
  const { notas, setNotas, isLocked } = vm;

  return (
    <section className={styles.panel}>
      <SectionHead n="05" text="promociones /" accent="aclaraciones" />
      <label className={styles.cfLabel}>
        Notas{" "}
        <span
          style={{
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.04em",
            fontSize: 10,
            marginLeft: 4,
            color: "var(--eb-ink-faint)",
          }}
        >
          (opcional)
        </span>
      </label>
      <textarea
        className={styles.cfTextarea}
        rows={4}
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Descuentos, aclaraciones especiales, detalles del evento…"
        disabled={isLocked}
      />
    </section>
  );
}

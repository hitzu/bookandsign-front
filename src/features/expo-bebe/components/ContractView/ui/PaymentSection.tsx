import styles from "@assets/css/expo-bebe.module.css";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function PaymentSection({ vm }: { vm: ContractFormVM }) {
  const {
    subtotal,
    discountTotal,
    anticipo,
    setAnticipo,
    anticipoNum,
    formaPago,
    setFormaPago,
    isLocked,
    requiredMinAmountHoldSlot,
    fmtPrice,
  } = vm;

  return (
    <section className={styles.panel}>
      <SectionHead n="04" text="resumen de" accent="pago" />
      <div className={styles.cfSummary}>
        <div className={styles.cfSummaryRow}>
          <span className={styles.cfSummaryLabel}>Subtotal</span>
          <span className={styles.cfSummaryValue}>$ {fmtPrice(subtotal)}</span>
        </div>

        {discountTotal > 0 && (
          <div className={styles.cfSummaryRow}>
            <span className={styles.cfSummaryLabel}>Descuento</span>
            <span
              className={styles.cfSummaryValue}
              style={{ color: "var(--av-ink)" }}
            >
              − $ {fmtPrice(discountTotal)}
            </span>
          </div>
        )}

        <div className={styles.cfSummaryDivider} />

        <div className={styles.cfSummaryRow}>
          <span className={styles.cfSummaryLabel} style={{ fontWeight: 700 }}>
            Precio final
          </span>
          <span className={styles.cfSummaryFinal}>
            $ {fmtPrice(subtotal - discountTotal)}
          </span>
        </div>

        <div className={styles.cfSummaryDividerLight} />

        <div className={styles.cfSummaryRow}>
          <div>
            <div className={styles.cfSummaryLabel}>Anticipo</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "var(--eb-ink-faint)",
                marginTop: 2,
              }}
            >
              MÍN. ${fmtPrice(requiredMinAmountHoldSlot)}
            </div>
          </div>
          <div className={styles.cfAnticipoField}>
            <span className={styles.cfAnticipoPrefix}>$</span>
            <input
              type="number"
              value={anticipo}
              min={0}
              onChange={(e) => setAnticipo(e.target.value)}
              className={styles.cfAnticipoInput}
              disabled={isLocked}
            />
          </div>
        </div>

        <div className={styles.cfSummaryRow} style={{ marginTop: 10 }}>
          <span className={styles.cfSummaryLabel}>Forma de pago</span>
          <select
            className={styles.cfSelect}
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
            style={{ width: "auto", minWidth: 148 }}
            disabled={isLocked}
          >
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>

        <div className={styles.cfSummaryDividerLight} style={{ marginTop: 8 }} />

        <div className={styles.cfSummaryRow}>
          <span className={styles.cfSummaryLabel} style={{ fontWeight: 700 }}>
            Restante
          </span>
          <div>
            <span className={styles.cfSummaryRestante}>
              $ {fmtPrice(subtotal - discountTotal - anticipoNum)}
            </span>
            <span className={styles.cfSummaryRestanteNote}>+ traslado</span>
          </div>
        </div>
      </div>
    </section>
  );
}

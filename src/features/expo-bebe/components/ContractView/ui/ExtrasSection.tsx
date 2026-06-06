import styles from "@assets/css/expo-bebe.module.css";
import { IconPlus } from "../../Icons";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function ExtrasSection({ vm }: { vm: ContractFormVM }) {
  const {
    extrasCatalog,
    selectedExtraId,
    setSelectedExtraId,
    extraItems,
    isLocked,
    handleAgregarExtra,
    incExtraItem,
    decExtraItem,
    removeExtraItem,
  } = vm;

  return (
    <section className={styles.panel}>
      <SectionHead n="03b" text="extras /" accent="adicionales" />

      <div style={{ marginBottom: 10 }}>
        <label className={styles.cfLabel}>Extra</label>
        <select
          className={styles.cfSelect}
          value={selectedExtraId}
          onChange={(e) =>
            setSelectedExtraId(e.target.value ? Number(e.target.value) : "")
          }
          disabled={isLocked}
        >
          <option value="">Selecciona…</option>
          {extrasCatalog.map((extra) => (
            <option key={extra.id} value={extra.id}>
              {extra.name} — ${extra.price.toLocaleString("es-MX")}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        className={styles.cfAddBtn}
        onClick={handleAgregarExtra}
        disabled={!selectedExtraId || isLocked}
      >
        <IconPlus /> Agregar al contrato
      </button>

      {extraItems.length === 0 ? (
        <div className={styles.cfEmptyState}>Aún no has agregado extras</div>
      ) : (
        <div className={styles.cfProductList}>
          {extraItems.map((it, i) => (
            <div key={it.extra.id} className={styles.cfProductItem}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className={styles.cfProductNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className={styles.cfProductName}>{it.extra.name}</div>
                  <div className={styles.cfProductPrice}>
                    ${(it.extra.price * it.quantity).toLocaleString("es-MX")}
                    {it.quantity > 1 && (
                      <span style={{ fontWeight: 400, opacity: 0.7 }}>
                        {" "}
                        ({it.quantity}×)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {!isLocked && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    type="button"
                    className={styles.cfQtyBtn}
                    onClick={() => decExtraItem(it.extra.id)}
                  >
                    −
                  </button>
                  <span className={styles.cfQtyVal}>{it.quantity}</span>
                  <button
                    type="button"
                    className={styles.cfQtyBtn}
                    onClick={() => incExtraItem(it.extra.id)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={styles.cfRemoveBtn}
                    onClick={() => removeExtraItem(it.extra.id)}
                    aria-label="Eliminar"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

import styles from "@assets/css/expo-bebe.module.css";
import { IconPlus } from "../../Icons";
import { SectionHead } from "../../SectionHead";
import type { ContractFormVM } from "../hooks/useContractForm";

export function ProductsSection({ vm }: { vm: ContractFormVM }) {
  const {
    brands,
    packages,
    selectedBrandId,
    setSelectedBrandId,
    selectedBrandName,
    isBrandSelectionLocked,
    selectedPackageId,
    setSelectedPackageId,
    items,
    isLocked,
    handleAgregar,
    incItem,
    decItem,
    removeItem,
  } = vm;

  return (
    <section className={styles.panel}>
      <SectionHead n="03" text="productos /" accent="servicios" />

      <div className={styles.cfGrid2} style={{ marginBottom: 10 }}>
        <div>
          <label className={styles.cfLabel}>Marca</label>
          {isBrandSelectionLocked ? (
            <input
              className={styles.cfInput}
              value={selectedBrandName || ""}
              disabled
              readOnly
            />
          ) : (
            <select
              className={styles.cfSelect}
              value={selectedBrandId}
              onChange={(e) =>
                setSelectedBrandId(e.target.value ? Number(e.target.value) : "")
              }
              disabled={isLocked}
            >
              <option value="">Selecciona…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className={styles.cfLabel}>Paquete</label>
          <select
            className={styles.cfSelect}
            value={selectedPackageId}
            onChange={(e) =>
              setSelectedPackageId(e.target.value ? Number(e.target.value) : "")
            }
            disabled={isLocked}
          >
            <option value="">Selecciona…</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — ${p.basePrice.toLocaleString("es-MX")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className={styles.cfAddBtn}
        onClick={handleAgregar}
        disabled={!selectedPackageId || isLocked}
      >
        <IconPlus /> Agregar al contrato
      </button>

      {items.length === 0 ? (
        <div className={styles.cfEmptyState}>Aún no has agregado paquetes</div>
      ) : (
        <div className={styles.cfProductList}>
          {items.map((it, i) => (
            <div key={it.pkg.id} className={styles.cfProductItem}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className={styles.cfProductNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className={styles.cfProductName}>{it.pkg.name}</div>
                  <div className={styles.cfProductPrice}>
                    ${(it.pkg.basePrice * it.quantity).toLocaleString("es-MX")}
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
                    onClick={() => decItem(it.pkg.id)}
                  >
                    −
                  </button>
                  <span className={styles.cfQtyVal}>{it.quantity}</span>
                  <button
                    type="button"
                    className={styles.cfQtyBtn}
                    onClick={() => incItem(it.pkg.id)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={styles.cfRemoveBtn}
                    onClick={() => removeItem(it.pkg.id)}
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

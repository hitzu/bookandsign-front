import { useEffect, useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import { clampQuantity } from "../../../utils/quantity";

type QuantityStepperProps = {
  value: number;
  itemName: string;
  onChange: (quantity: number) => void;
  onRemove: () => void;
};

/**
 * Quantity control for contract line items: +/- buttons for small tweaks and a
 * typable field so large amounts (per-person packages) don't need 50 clicks.
 */
export function QuantityStepper({
  value,
  itemName,
  onChange,
  onRemove,
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <button
        type="button"
        className={styles.cfQtyBtn}
        onClick={() => onChange(clampQuantity(value - 1))}
        aria-label={`Quitar una unidad de ${itemName}`}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        className={styles.cfQtyInput}
        value={draft}
        aria-label={`Cantidad de ${itemName}`}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          setDraft(digits);
          if (digits) onChange(clampQuantity(Number(digits)));
        }}
        onBlur={() => setDraft(String(value))}
      />
      <button
        type="button"
        className={styles.cfQtyBtn}
        onClick={() => onChange(clampQuantity(value + 1))}
        aria-label={`Agregar una unidad de ${itemName}`}
      >
        +
      </button>
      <button
        type="button"
        className={styles.cfRemoveBtn}
        onClick={onRemove}
        aria-label={`Eliminar ${itemName}`}
      >
        ×
      </button>
    </div>
  );
}

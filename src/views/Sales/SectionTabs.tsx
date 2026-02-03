import React from "react";
import styles from "../../assets/css/sales-section-tabs.module.css";

export type SectionTabsProps = {
  active: MainSectionKey;
  onChange: (next: MainSectionKey) => void;
  sectionType: "main" | "payments";
};

export type MainSectionKey = "calendar" | "transportation-fee" | "photos" | "receipt" | "payments";

export const SectionTabs = ({ active, onChange, sectionType }: SectionTabsProps) => {

  let items: Array<{ key: MainSectionKey; label: string }> = [];
  if (sectionType === "main") {
    items = [
      { key: "calendar", label: "Calendario" },
      { key: "transportation-fee", label: "Tarifa de traslado" },
      { key: "photos", label: "Fotos" },
    ];
  } else if (sectionType === "payments") {
    items = [
      { key: "receipt", label: "Recibidos" },
      { key: "payments", label: "Pagos" },
    ];
  }

  return (
    <div role="tablist" className={styles.salesSectionTabsContainer}>
      {items.map((it) => {
        const isActive = active === it.key;
        return (
          <button
            key={it.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(it.key)}
            className={
              styles.salesSectionTabs +
              " " +
              (isActive
                ? styles.salesSectionTabsActive
                : styles.salesSectionTabsInactive)
            }
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
};

import { useState } from "react";
import styles from "@assets/css/expo-bebe.module.css";
import { CalendarView } from "../components/CalendarView";
import { ContractView } from "../components/ContractView";
import { ServiceDetail } from "../components/ServiceDetail";
import { Tabs } from "../components/Tabs";
import { EXTRAS, SERVICES } from "../data/serviceCatalog";
import type { CatalogMode, ContentTabKey, TabKey } from "../types";

export function ExpoBebePage() {
  const [tab, setTab] = useState<ContentTabKey>("cal");
  const [catalogMode, setCatalogMode] = useState<CatalogMode | null>(null);
  const [detailIndex, setDetailIndex] = useState(0);

  const catalogItems =
    catalogMode === "extras" ? EXTRAS : catalogMode === "servicios" ? SERVICES : [];
  const activeMenu: TabKey =
    catalogMode === "extras" ? "ext" : catalogMode === "servicios" ? "srv" : tab;

  const openCatalog = (mode: CatalogMode) => {
    setCatalogMode(mode);
    setDetailIndex(0);
  };

  const handleMenuChange = (next: TabKey) => {
    if (next === "srv") {
      openCatalog("servicios");
      return;
    }

    if (next === "ext") {
      openCatalog("extras");
      return;
    }

    setCatalogMode(null);
    setTab(next);
  };

  const goToDetail = (nextIndex: number) => {
    if (!catalogItems.length) return;
    setDetailIndex(
      ((nextIndex % catalogItems.length) + catalogItems.length) %
        catalogItems.length
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <Tabs value={activeMenu} onChange={handleMenuChange} />

          {tab === "cal" && <CalendarView />}
          {tab === "ctr" && <ContractView />}

          {tab !== "ctr" && (
            <footer className={styles.footer}>
              <span className={styles.footerStar}>✦</span> Traslado con costo
              adicional fuera de Puebla, Cholula o Cuautlancingo.
              <br />
              Precios válidos durante expo. Apartado con 30% de anticipo.
            </footer>
          )}
        </div>
      </div>

      <ServiceDetail
        isOpen={!!catalogMode}
        items={catalogItems}
        currentIndex={detailIndex}
        modeLabel={catalogMode === "extras" ? "Extras" : "Servicios"}
        onClose={() => setCatalogMode(null)}
        onSelectIndex={setDetailIndex}
        onPrevious={() => goToDetail(detailIndex - 1)}
        onNext={() => goToDetail(detailIndex + 1)}
      />
    </div>
  );
}

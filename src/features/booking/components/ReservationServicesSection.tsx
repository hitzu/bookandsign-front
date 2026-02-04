import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { ContractPackages } from "../../../interfaces";

export const ReservationServicesSection = ({
  items,
}: {
  items: ContractPackages[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatMoney = (amount: number) => {
    const n = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <Row className={`mb-4 ${styles["center-information-content"]}`}>
      <Col xs={12} md={10}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Servicios contratados</h2>{" "}
          <button
            type="button"
            className={styles.detailToggle}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Ocultar detalles" : "Ver detalles"}
          </button>
          <div className={styles.sectionBody}>
            {items.length === 0 ? (
              <div
                style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}
              >
                Aún no hay servicios vinculados a este contrato.
              </div>
            ) : (
              <ul className={styles.list}>
                {items.map((it) => {
                  const products =
                    it.package?.packageProducts
                      ?.map((pp) => pp.product?.name)
                      .filter(Boolean) ?? [];
                  const pkg = it.package;
                  const qty = it.quantity ?? 1;

                  return (
                    <li key={it.id} className={styles.listItem}>
                      <div className={styles.itemRow}>
                        <div style={{ minWidth: 0 }}>
                          <div className={styles.itemName}>
                            {pkg?.name ?? "Paquete"}
                            {qty > 1 ? (
                              <span className={styles.itemQty}>×{qty}</span>
                            ) : null}
                          </div>
                          <div className={styles.itemName}>
                            {it.promotion?.name ?? "—"}
                          </div>
                        </div>

                        <div style={{ flexShrink: 0, textAlign: "right" }}>
                          <div className={styles.itemPrice}>
                            {formatMoney((it.package?.basePrice ?? 0) * qty)}
                          </div>
                          {it.promotion && it.promotion.value > 0 && (
                            <div className={styles.itemPrice}>
                              -{" "}
                              {formatMoney(
                                (it.package.basePrice *
                                  qty *
                                  it.promotion.value) /
                                  100,
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className={styles.detailsBlock}>
                          {products.length > 0 ? (
                            <ul className={styles.detailsList}>
                              {products.map((name, idx) => (
                                <li key={`${it.packageId}-${idx}`}>{name}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </Col>
    </Row>
  );
};

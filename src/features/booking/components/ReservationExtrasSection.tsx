import { Col, Row } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { ContractExtra } from "../../../interfaces";

export const ReservationExtrasSection = ({
  items,
}: {
  items: ContractExtra[];
}) => {
  const formatMoney = (amount: number) => {
    const n = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  if (items.length === 0) return null;

  return (
    <Row className={`mb-4 ${styles["center-information-content"]}`}>
      <Col xs={12} md={10}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Extras contratados</h2>
          <div className={styles.sectionBody}>
            <ul className={styles.list}>
              {items.map((it) => {
                const qty = it.quantity ?? 1;

                return (
                  <li key={it.id} className={styles.listItem}>
                    <div className={styles.itemRow}>
                      <div style={{ minWidth: 0 }}>
                        <div className={styles.itemName}>
                          {it.nameSnapshot ?? it.extra?.name ?? "Extra"}
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
                          {formatMoney(it.basePriceSnapshot ?? 0)}
                        </div>
                        {it.promotion && it.promotion.value > 0 && (
                          <div className={styles.itemPrice}>
                            -{" "}
                            {formatMoney(
                              ((it.extra?.price ?? 0) *
                                qty *
                                it.promotion.value) /
                                100,
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </Col>
    </Row>
  );
};

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
                const hasDiscount = (it.discountPercentageSnapshot ?? 0) > 0;

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
                        {hasDiscount && (
                          <div className={styles.itemName}>
                            {it.discountPercentageSnapshot}% off
                          </div>
                        )}
                      </div>

                      <div style={{ flexShrink: 0, textAlign: "right" }}>
                        {hasDiscount && (
                          <div
                            className={styles.itemPrice}
                            style={{ textDecoration: "line-through", opacity: 0.6 }}
                          >
                            {formatMoney(it.basePriceSnapshot ?? 0)}
                          </div>
                        )}
                        <div className={styles.itemPrice}>
                          {formatMoney(it.finalPriceSnapshot ?? 0)}
                        </div>
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

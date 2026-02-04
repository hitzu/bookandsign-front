import { Col, Row } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { Contract, Payment } from "../../interfaces";
import { formatLongSpanishDate } from "@common/dates";
import { useMemo } from "react";

export const ReservationFinanceSection = ({
  contract,
  payments,
  paidAmount,
}: {
  contract: Contract;
  payments: Payment[];
  paidAmount: number;
}) => {
  const formatMoney = (amount: number) => {
    const n = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);
  };

  const formatPaymentDate = (raw: string) => {
    const base = raw.includes("T") ? raw : `${raw}T00:00:00`;
    const d = new Date(base);
    return Number.isNaN(d.getTime()) ? "—" : formatLongSpanishDate(d);
  };

  const paymentsSorted = useMemo(() => {
    const list = (payments ?? []).slice();
    list.sort((a, b) => {
      const aRaw = a?.receivedAt ?? "";
      const bRaw = b?.receivedAt ?? "";
      const aD = aRaw.includes("T")
        ? new Date(aRaw)
        : new Date(`${aRaw}T00:00:00`);
      const bD = bRaw.includes("T")
        ? new Date(bRaw)
        : new Date(`${bRaw}T00:00:00`);
      const aT = Number.isNaN(aD.getTime()) ? 0 : aD.getTime();
      const bT = Number.isNaN(bD.getTime()) ? 0 : bD.getTime();
      return aT - bT; // oldest -> newest
    });
    return list;
  }, [payments]);

  const paidAmountFromPayments = useMemo(() => {
    if (paymentsSorted.length === 0) return paidAmount ?? 0;
    return paymentsSorted.reduce((sum, p) => sum + (p?.amount ?? 0), 0);
  }, [paidAmount, paymentsSorted]);

  return (
    <Row className={`mb-4 ${styles["center-information-content"]}`}>
      <Col xs={12} md={10}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Tu pago y saldo</h2>
          <div
            className={styles.sectionBody}
            style={{ display: "grid", gap: "0.75rem" }}
          >
            <div className={styles.financeRow}>
              <span>Subtotal</span>
              <span className={styles.financeValue}>
                {formatMoney(contract.subtotal)}
              </span>
            </div>

            <div className={styles.financeRow}>
              <span>Descuentos</span>
              <span className={styles.financeDiscount}>
                –{formatMoney(contract.discountTotal)}
              </span>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <div className={styles.totalLabel}>Total final</div>
              <div className={styles.totalValue}>
                {formatMoney(contract.total)}{" "}
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.subSectionTitle}>Historial de pagos</div>

            {paymentsSorted.length === 0 ? (
              <div className={styles.emptySubText}>
                Aún no hay pagos registrados.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {paymentsSorted.map((p, idx) => (
                  <div key={p.id ?? idx} className={styles.financeRow}>
                    <span>
                      Total pagado {idx + 1}:{" "}
                      {formatPaymentDate(p.receivedAt ?? "")}
                    </span>
                    <span className={styles.financeValue}>
                      {formatMoney(p.amount ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.divider} />

            <div className={styles.financeRow}>
              <span>Total pagado</span>
              <span className={styles.financeValue}>
                {formatMoney(paidAmountFromPayments)}
              </span>
            </div>

            <div className={styles.financeRow}>
              <span>Restante por pagar</span>
              <span
                className={[
                  styles.financeValue,
                  styles.financeValuePaymentPending,
                ].join(" ")}
              >
                {formatMoney(contract.total - paidAmountFromPayments)}
                <span className={styles.moveValueText}> + traslado</span>
              </span>
            </div>
          </div>
        </section>
      </Col>
    </Row>
  );
};

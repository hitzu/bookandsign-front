import { Col, Row } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { ContractSlot } from "../../interfaces";
import { translateContractSlotPurpose } from "@common/translations";
import { formatLongSpanishDate } from "@common/dates";

export const ReservationDatesSection = ({
  slots,
}: {
  slots: ContractSlot[];
}) => {
  return (
    <Row className={`mb-4 ${styles["center-information-content"]}`}>
      <Col xs={12} md={10}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Fechas de los eventos</h2>
          <div className={styles.sectionBody}>
            {slots.map((slot) => (
              <div key={slot.id} className={styles.financeRow}>
                <span className={styles.financeValue}>
                  {translateContractSlotPurpose(slot.purpose)}
                </span>
                <span>
                  {slot.slot?.eventDate
                    ? formatLongSpanishDate(new Date(slot.slot.eventDate))
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </Col>
    </Row>
  );
};

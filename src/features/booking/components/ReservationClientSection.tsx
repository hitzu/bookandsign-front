import { useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { Contract } from "../../../interfaces";

function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at <= 0) return "****";

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);

  const visibleCount = Math.min(local.length, local.length >= 4 ? 4 : 1);
  const visible = local.slice(0, visibleCount);

  if (!domain) return `${visible}****`;
  if (local.length <= visibleCount) return `${local}@${domain}`;

  return `${visible}****@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***${digits.slice(-4)}`;
}

export const ReservationClientSection = ({
  contract,
}: {
  contract: Contract;
}) => {
  const maskedEmail = useMemo(() => {
    const email = contract?.clientEmail;
    if (!email) return "—";
    return maskEmail(email);
  }, [contract?.clientEmail]);

  const maskedPhone = useMemo(() => {
    const phone = contract?.clientPhone;
    if (!phone) return "—";
    return maskPhone(phone);
  }, [contract?.clientPhone]);

  return (
    <Row className={`mb-4 ${styles["center-information-content"]}`}>
      <Col xs={12} md={10}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Datos del cliente</h2>
          <div className={styles.sectionBody}>
            <Container fluid className={styles.noPad}>
              <Row className={styles.gutterMd}>
                <Col xs={12} md={4}>
                  <div className={styles.kv}>
                    <div className={styles.kvLabel}>Nombre</div>
                    <div className={styles.kvValue}>
                      {contract?.clientName ?? "—"}
                    </div>
                  </div>
                </Col>

                <Col xs={12} md={4}>
                  <div className={styles.kv}>
                    <div className={styles.kvLabel}>Email</div>
                    <div className={styles.kvValue}>{maskedEmail}</div>
                  </div>
                </Col>

                <Col xs={12} md={4}>
                  <div className={styles.kv}>
                    <div className={styles.kvLabel}>Teléfono</div>
                    <div className={styles.kvValue}>{maskedPhone}</div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </section>
      </Col>
    </Row>
  );
};

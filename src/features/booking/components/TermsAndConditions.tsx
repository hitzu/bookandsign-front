import { Container, Row, Col } from "react-bootstrap";
import styles from "@assets/css/contract-public.module.css";
import { GetTermsResponse } from "../../../interfaces";

const TermsAndConditions = ({
  packageTerms,
  terms,
}: {
  packageTerms: GetTermsResponse[];
  terms: GetTermsResponse[];
}) => {
  return (
    <div>
      <Row className={`mb-4 ${styles["center-information-content"]}`}>
        <Col xs={12} md={10}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Consideraciones importantes</h2>
            {packageTerms.length === 0 && terms.length === 0 ? (
              <p className={styles.termsIntro}>
                No hay términos y condiciones vinculados a los servicios de este
                contrato.
              </p>
            ) : (
              <>
                <p className={styles.termsIntro}>
                  Estos son los términos y condiciones de los servicios
                  contratados.
                </p>

                <ul className={styles.termsList}>
                  {terms.map((t) => (
                    <li key={t.id} className={styles.termsItem}>
                      <div className={styles.termTitle}>{t.title}</div>
                      <div className={styles.termContent}>{t.content}</div>
                    </li>
                  ))}
                  {packageTerms.map((t) => (
                    <li key={t.id} className={styles.termsItem}>
                      <div className={styles.termTitle}>{t.title}</div>
                      <div className={styles.termContent}>{t.content}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default TermsAndConditions;

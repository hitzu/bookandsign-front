import React, { ReactElement, useState } from "react";
import NonLayout from "@layout/NonLayout";

import logoWhite from "@assets/images/logo-white.png";
import styles from "../../assets/css/calendar.module.css";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import { SectionTabs, MainSectionKey } from "@views/Sales/SectionTabs";
import { CalendarSection } from "@views/Sales/Calendar";
import { TransportationFee } from "@views/Sales/TransportationFee";
import { Photos } from "@views/Sales/Photos";

const SalesPage = () => {
  const [activeSection, setActiveSection] = useState<MainSectionKey>("photos");
  const onChangeSection = (next: MainSectionKey) => {
    setActiveSection(next);
  };

  return (
    <div className={styles.calendarContainer}>
      <Row className="justify-content-center">
        <Col className="text-center">
          <Image src={logoWhite} alt="logo" width={90} height={90} />
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col>
          <SectionTabs active={activeSection} onChange={onChangeSection} />
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col>
          {activeSection === "calendar" && <CalendarSection />}{" "}
          {activeSection === "transportation-fee" && <TransportationFee />}
          {activeSection === "photos" && <Photos />}
        </Col>
      </Row>
    </div>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};

export default SalesPage;

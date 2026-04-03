import Layout from "@layout/index";
import React, { ReactElement } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import Link from "next/link";

const EventEditIndex = () => {
  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Eventos" subTitle="Editar evento" />
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Body className="text-center py-5">
              <p className="text-muted mb-3">
                Selecciona un evento de la lista para editarlo.
              </p>
              <Link href="/event-list" className="btn btn-primary">
                Ir al listado de eventos
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

EventEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EventEditIndex;

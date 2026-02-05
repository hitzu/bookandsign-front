import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useEffect } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast } from "react-bootstrap";
import { ContractCompleteResponse } from "../../../interfaces";
import { SectionTabs, MainSectionKey } from "@views/Sales/SectionTabs";
import { getContractBySku } from "src/api/services/contractService";

const ContractEdit = () => {
  const router = useRouter();
  const { sku } = router.query;
  const [activeSection, setActiveSection] = useState<MainSectionKey>("receipt");
  const [contract, setContract] = useState<ContractCompleteResponse | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const onChangeSection = (next: MainSectionKey) => {
    setActiveSection(next);
  };

  useEffect(() => {
    const fetchContractBySku = async () => {
      try {
        if (sku && typeof sku === "string") {
          const response = (await getContractBySku(
            sku as string
          )) as ContractCompleteResponse;
          setContract(response);
        }
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };
    fetchContractBySku();
  }, [sku]);

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Contratos" subTitle="Revision Contrato" />

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Éxito" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>

      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Definicion del contrato</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3 col-sm-12">
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                      name="scope"
                      value={contract?.contract.sku ?? ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>clientName</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="clientName"
                    name="title"
                    value={contract?.contract.clientName}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>clientPhone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="clientPhone"
                    name="clientPhone"
                    value={contract?.contract.clientPhone ?? ""}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>clientEmail</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="clientEmail"
                    name="clientEmail"
                    value={contract?.contract.clientEmail ?? ""}
                    disabled
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>subtotal</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="subtotal"
                    name="subtotal"
                    value={contract?.contract.subtotal ?? ""}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>discountTotal</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="discountTotal"
                    name="discountTotal"
                    value={contract?.contract.discountTotal ?? ""}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 col-sm-12 col-md-4">
                  <Form.Label>total</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="total"
                    name="total"
                    value={contract?.contract.total ?? ""}
                    disabled
                  />
                </Form.Group>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col>
          <SectionTabs
            active={activeSection}
            onChange={onChangeSection}
            sectionType="payments"
          />
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col>
          {activeSection === "receipt" && <div>recibidos</div>}{" "}
          {activeSection === "payments" && <div>pagos</div>}
        </Col>
      </Row>
    </React.Fragment>
  );
};

ContractEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ContractEdit;

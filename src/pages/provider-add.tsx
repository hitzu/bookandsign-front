import Layout from "@layout/index";
import React, { ReactElement, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { CreateProviderPayload } from "../interfaces";
import { createProvider } from "../api/services/providerService";
import * as yup from "yup";

interface ProviderFormValues {
  name: string;
  contactName: string;
  contactPhone: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del proveedor es requerido"),
  contactName: yup.string().optional(),
  contactPhone: yup.string().optional(),
});

const ProviderAdd = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const formik = useFormik<ProviderFormValues>({
    initialValues: {
      name: "",
      contactName: "",
      contactPhone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload: CreateProviderPayload = {
        name: values.name,
        ...(values.contactName ? { contactName: values.contactName } : {}),
        ...(values.contactPhone ? { contactPhone: values.contactPhone } : {}),
      };

      try {
        await createProvider(payload);
        setToastMessage("Proveedor creado exitosamente");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          formik.resetForm();
        }, 500);
      } catch (error: any) {
        console.error("Error creating provider:", error);
        setToastMessage("Error al crear el proveedor");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Proveedores" subTitle="Agregar proveedor" />

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
              <h5>Descripción del proveedor</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del proveedor"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("name")}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre de contacto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de contacto"
                    name="contactName"
                    value={formik.values.contactName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("contactName")}
                    isInvalid={
                      formik.touched.contactName && !!formik.errors.contactName
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contactName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono de contacto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono de contacto"
                    name="contactPhone"
                    value={formik.values.contactPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("contactPhone")}
                    isInvalid={
                      formik.touched.contactPhone &&
                      !!formik.errors.contactPhone
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.contactPhone}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Crear proveedor
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProviderAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProviderAdd;


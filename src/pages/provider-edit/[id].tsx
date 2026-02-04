import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import { Provider, UpdateProviderPayload } from "../../interfaces";
import {
  getProviderById,
  getProviders,
  updateProviderById,
} from "../../api/services/providerService";
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

const ProviderEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  // Para búsqueda rápida, mismo patrón que productos/edit/[id]
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);

  const formik = useFormik<ProviderFormValues>({
    initialValues: {
      name: "",
      contactName: "",
      contactPhone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload: UpdateProviderPayload = {
        name: values.name,
        ...(values.contactName ? { contactName: values.contactName } : {}),
        ...(values.contactPhone ? { contactPhone: values.contactPhone } : {}),
      };

      try {
        await updateProviderById(Number(id), payload);
        setToastMessage("Proveedor actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error: any) {
        console.error("Error updating provider:", error);
        setToastMessage("Error al actualizar el proveedor");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchProvider = async () => {
        try {
          const provider = await getProviderById(Number(id));
          formik.setValues({
            name: provider.name || "",
            contactName: provider.contactName || "",
            contactPhone: provider.contactPhone || "",
          });
          setSearchTerm(provider.name || "");
        } catch (error) {
          console.error("Error fetching provider:", error);
          setToastMessage("Error al cargar el proveedor");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) return [];
    return providers
      .filter((p) => p.name?.toLowerCase().includes(term))
      .slice(0, 50);
  }, [providers, searchTerm]);

  const showSearchResults = searchTerm.trim().length >= 2;

  const handleSelectProvider = (provider: Provider) => {
    setSearchTerm("");
    router.push(`/provider-edit/${provider.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Proveedores" subTitle="Editar proveedor" />

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
          <Card className="mb-3">
            <Card.Header>
              <h5>Buscar proveedor</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar proveedor por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {showSearchResults && searchResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      width: "100%",
                      marginTop: "4px",
                    }}
                  >
                    {searchResults.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => handleSelectProvider(provider)}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f5f5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <strong>{provider.name}</strong>
                        {!!provider.contactName && (
                          <>
                            <br />
                            <small className="text-muted">
                              {provider.contactName}
                            </small>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showSearchResults && searchResults.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "12px",
                      marginTop: "4px",
                      width: "100%",
                    }}
                  >
                    <small className="text-muted">
                      No se encontraron proveedores con ese nombre
                    </small>
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>

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
                  Actualizar proveedor
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProviderEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProviderEdit;

import Layout from "@layout/index";
import React, { ReactElement, useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import {
  CreateTermPayload,
  GetBrandsResponse,
  GetPackagesResponse,
} from "../../interfaces";
import * as yup from "yup";
import { getPackages } from "../../api/services/packageService";
import {
  createTerm,
  uploadTermsPackagesInBulk,
} from "../../api/services/termsService";
import { getBrands } from "../../api/services/brandService";

interface TermsAndConditionsFormValues {
  scope: "global" | "package";
  title: string;
  content: string;
}

const termScopes = [
  { value: "global", label: "Globales" },
  { value: "package", label: "Paquetes" },
];

const validationSchema = yup.object().shape({
  scope: yup
    .string()
    .oneOf(termScopes.map((scope: { value: string }) => scope.value))
    .required("El scope es requerido"),
  title: yup.string().required("El titulo es requerido"),
  content: yup.string().required("El contenido es requerido"),
});

const TermsAndConditionsAdd = () => {
  const [showToast, setShowToast] = useState(false);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<
    MultiValue<{ value: number; label: string }>
  >([]);
  const [packageOptions, setPackageOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = (await getBrands()) as GetBrandsResponse[];
        setBrands(response);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = (await getPackages({
          brandId: brandId || undefined,
        })) as GetPackagesResponse[];
        setPackageOptions(
          response.map((packages) => ({
            value: packages.id,
            label: packages.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, [brandId]);

  const formik = useFormik<TermsAndConditionsFormValues>({
    initialValues: {
      scope: "global",
      title: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        scope: values.scope,
        title: values.title,
        content: values.content,
      };
      try {
        const termCreated = await createTerm(payload as CreateTermPayload);
        if (selectedPackages.length > 0) {
          await uploadTermsPackagesInBulk(
            termCreated.id,
            selectedPackages.map((packages) => packages.value)
          );
        }
        setToastMessage("Producto creado exitosamente");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          formik.resetForm();
          setSelectedPackages([]);
        }, 500);
      } catch (error: any) {
        console.error("Error creating term:", error);
        setToastMessage("Error al crear el termino y condicion");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  return (
    <React.Fragment>
      <BreadcrumbItem
        mainTitle="Terminos y condiciones"
        subTitle="Agregar termino y condicion"
      />

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
              <h5>Agregar termino y condicion</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Scope</Form.Label>
                  <Form.Select
                    name="scope"
                    value={formik.values.scope}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "scope",
                        e.target.value as "global" | "package"
                      );
                    }}
                    onBlur={formik.handleBlur("brandId")}
                    isInvalid={formik.touched.scope && !!formik.errors.scope}
                  >
                    {termScopes.map((scope) => (
                      <option key={scope.value} value={scope.value}>
                        {scope.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.scope}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Titulo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Titulo"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("title")}
                    isInvalid={formik.touched.title && !!formik.errors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Contenido del termino y condicion"
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("content")}
                    isInvalid={
                      formik.touched.content && !!formik.errors.content
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.content}
                  </Form.Control.Feedback>
                </Form.Group>

                {formik.values.scope === "package" && (
                  <React.Fragment>
                    <Form.Group className="mb-3">
                      <Form.Label>Marca</Form.Label>
                      <Form.Select
                        name="brandId"
                        value={brandId || ""}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "brandId",
                            e.target.value ? parseInt(e.target.value) : ""
                          );
                          setBrandId(parseInt(e.target.value));
                        }}
                        onBlur={formik.handleBlur("brandId")}
                      >
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Paquetes</Form.Label>
                      <Select
                        isMulti
                        options={packageOptions}
                        value={selectedPackages}
                        onChange={(newValues) => setSelectedPackages(newValues)}
                        placeholder="Seleccione paquetes"
                      />
                    </Form.Group>
                  </React.Fragment>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Crear termino y condicion
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

TermsAndConditionsAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsAdd;

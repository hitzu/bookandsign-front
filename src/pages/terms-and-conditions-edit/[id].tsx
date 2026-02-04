import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import {
  GetBrandsResponse,
  GetPackagesResponse,
  GetTermsResponse,
} from "../../interfaces";
import { getBrands } from "../../api/services/brandService";
import {
  getTermById,
  getTerms,
  updateTermsById,
  uploadTermsPackagesInBulk,
} from "../../api/services/termsService";
import * as yup from "yup";
import { getPackages } from "../../api/services/packageService";
import { multiSelectStyles } from "@common/reactSelectStyles";

interface TermsAndConditionsFormValues {
  scope: "global" | "package";
  title: string;
  content: string;
}

const validationSchema = yup.object().shape({
  scope: yup.string().required("El scope es requerido"),
  title: yup.string().required("El titulo es requerido"),
  content: yup.string().required("El contenido es requerido"),
});

const TermsAndConditionsEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [showToast, setShowToast] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GetTermsResponse[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scope, setScope] = useState<"global" | "package">("global");
  const [brandId, setBrandId] = useState<number | null>(null);

  const termScopes = [
    { value: "global", label: "Globales" },
    { value: "package", label: "Paquetes" },
  ];

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
        await updateTermsById(Number(id), payload);
        setToastMessage("Termino y condicion actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error: any) {
        console.error("Error actualizando el termino y condicion:", error);
        setToastMessage("Error al actualizar el termino y condicion");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

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
    if (id && typeof id === "string") {
      const fetchTerm = async () => {
        try {
          const term = await getTermById(Number(id));
          formik.setValues({
            scope: term.scope,
            title: term.title,
            content: term.content,
          });

          setBrandId(term.packageTerms?.[0]?.package?.brandId || null);

          setSelectedPackages(
            term.packageTerms?.map((packageTerm) => ({
              value: packageTerm.package.id,
              label: packageTerm.package.name,
            })) || []
          );
        } catch (error) {
          console.error("Error fetching term:", error);
          setToastMessage("Error al cargar el producto");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchTerm();
    }
  }, [id]);

  useEffect(() => {
    const fetchPackagesByBrandId = async () => {
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
    fetchPackagesByBrandId();
  }, [brandId]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await getTerms({ termScope: scope, query: term });
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectTerm = async (term: GetTermsResponse) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/terms-and-conditions-edit/${term.id}`);
  };

  const handleUploadTermsPackages = async (
    newValues: MultiValue<{ value: number; label: string }>
  ) => {
    try {
      setSelectedPackages(newValues);
      if (formik.values.scope === "package" && newValues.length > 0) {
        await uploadTermsPackagesInBulk(
          Number(id),
          newValues.map((p) => p.value)
        );
      }
      setToastMessage("Terminos y condiciones actualizados exitosamente");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error uploading products:", error);
      setToastMessage("Error al actualizar los terminos y condiciones");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <React.Fragment>
      <BreadcrumbItem
        mainTitle="Terminos y condiciones"
        subTitle="Editar termino y condicion"
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
          <Card className="mb-3">
            <Card.Header>
              <h5>Buscar termino y condicion</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Scope</Form.Label>
                <Form.Select
                  name="scope"
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as "global" | "package");
                  }}
                >
                  {termScopes.map((scope) => (
                    <option key={scope.value} value={scope.value}>
                      {scope.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Buscar termino y condicion por titulo o contenido
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el titulo o contenido del termino y condicion..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div
                    style={{
                      position: "relative",
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
                    {searchResults.map((term) => (
                      <div
                        key={term.id}
                        onClick={() => handleSelectTerm(term)}
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
                        <strong>{term.title}</strong>
                        <br />
                        <small className="text-muted">{term.content}</small>
                      </div>
                    ))}
                  </div>
                )}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchTerm.length >= 2 && (
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1000,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "12px",
                        marginTop: "4px",
                      }}
                    >
                      <small className="text-muted">
                        No se encontraron terminos y condiciones con ese nombre
                      </small>
                    </div>
                  )}
              </Form.Group>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>Definicion del termino y condicion</h5>
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
                    onBlur={formik.handleBlur("scope")}
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
                        onChange={(newValues) =>
                          handleUploadTermsPackages(newValues)
                        }
                        placeholder="Seleccione paquetes"
                        styles={multiSelectStyles}
                      />
                    </Form.Group>
                  </React.Fragment>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Actualizar termino y condicion
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

TermsAndConditionsEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsEdit;

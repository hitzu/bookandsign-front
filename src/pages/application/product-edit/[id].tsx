import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useEffect } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import {
  Card,
  Col,
  Form,
  Row,
  Toast,
  Button,
} from "react-bootstrap";
import { useFormik } from "formik";
import {
  GetBrandsResponse,
  GetProductsResponse,
  Provider,
} from "../../../interfaces";
import { getBrands } from "../../../api/services/brandService";
import {
  createPaymentObligationBulk,
  getPaymentObligationByProductId,
  getProductById,
  getProducts,
  updateProductById,
} from "../../../api/services/productsService";
import * as yup from "yup";
import { getProviders } from "../../../api/services/providerService";

interface PaymentObligationInitialValues {
  providerId: number | "";
  amount: number | "";
}

interface ProductFormValues {
  name: string;
  brandId: number | "";
  paymentObligation: PaymentObligationInitialValues[];
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del producto es requerido"),
  brandId: yup
    .number()
    .required("La marca es requerida")
    .min(1, "Seleccione una marca válida"),
});

const ProductEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GetProductsResponse[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showPaymentForms, setShowPaymentForms] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

  const makeEmptyPaymentObligationRow = (): PaymentObligationInitialValues => ({
    providerId: "",
    amount: "",
  });

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      brandId: "",
      paymentObligation: [makeEmptyPaymentObligationRow()],
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        brandId: values.brandId as number,
      };
      try {
        await updateProductById(Number(id), payload);
        
        const rowsToSave = values.paymentObligation.filter(
          (row) => row.providerId !== "" && row.amount !== ""
        );

        await createPaymentObligationBulk(Number(id),rowsToSave.map((row) => ({
          providerId: row.providerId as number,
          amount: row.amount as number,
        })));
        
        setToastMessage("Producto actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error: any) {
        console.error("Error actualizando el producto:", error);
        setToastMessage("Error al actualizar el producto");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  const removePaymentObligationRow = (indexToRemove: number) => {
    const currentRows = formik.values.paymentObligation || [];
    if (currentRows.length <= 1) {
      setShowPaymentForms(false);
    }
    const nextRows = currentRows.filter((_, idx) => idx !== indexToRemove);
    formik.setFieldValue(
      "paymentObligation",
      nextRows
    );
  };

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
      const fetchProduct = async () => {
        try {
          const product = await getProductById(Number(id));
          formik.setValues({
            name: product.name,
            brandId: product.brandId,
            paymentObligation: [makeEmptyPaymentObligationRow()],
          });

          const paymentObligation = await getPaymentObligationByProductId(Number(id));

          if (paymentObligation.length > 0) {
            setShowPaymentForms(true);
            formik.setFieldValue(
              "paymentObligation",
              paymentObligation.map((po) => ({
                providerId: po.providerId,
                amount: po.amount,
              }))
            );
          } else {
            setShowPaymentForms(false);
          }

          setSearchTerm(product.name);
        } catch (error) {
          console.error("Error fetching product:", error);
          setToastMessage("Error al cargar el producto");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    };
    fetchProviders();
  }, []);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await getProducts({ term });
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

  const handleSelectProduct = async (product: GetProductsResponse) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/application/product-edit/${product.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Productos" subTitle="Agregar producto" />

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
              <h5>Buscar producto</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar producto por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del producto..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
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
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
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
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.brand.name}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>Descripción del producto</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Select
                    name="brandId"
                    value={formik.values.brandId}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "brandId",
                        e.target.value ? parseInt(e.target.value) : ""
                      )
                    }
                    onBlur={formik.handleBlur("brandId")}
                    isInvalid={
                      formik.touched.brandId && !!formik.errors.brandId
                    }
                  >
                    <option>Seleccione una marca</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.brandId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del producto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del producto"
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
                  <Form.Label>¿Tiene un proveedor asociado?</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="hasProvider"
                    checked={showPaymentForms}
                    onChange={() => {
                      const next = !showPaymentForms;
                      setShowPaymentForms(next);
                      if (!next) {
                        formik.setFieldValue("paymentObligation", [
                          makeEmptyPaymentObligationRow(),
                        ]);
                      }
                    }}
                  />
                </Form.Group>

                {showPaymentForms && (
                  <>
                    {(formik.values.paymentObligation || []).map((row, index) => (
                      <Row key={index} className="align-items-end">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Select
                              name={`paymentObligation.${index}.providerId`}
                              value={row.providerId}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `paymentObligation.${index}.providerId`,
                                  e.target.value ? parseInt(e.target.value) : ""
                                )
                              }
                              onBlur={formik.handleBlur(
                                `paymentObligation.${index}.providerId`
                              )}
                            >
                              <option>Seleccione un proveedor</option>
                              {providers.map((provider) => (
                                <option key={provider.id} value={provider.id}>
                                  {provider.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={5}>
                          <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Cantidad"
                              name={`paymentObligation.${index}.amount`}
                              value={row.amount}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `paymentObligation.${index}.amount`,
                                  e.target.value ? Number(e.target.value) : ""
                                )
                              }
                              onBlur={formik.handleBlur(
                                `paymentObligation.${index}.amount`
                              )}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={1}>
                          <Form.Group className="mb-3">
                            <Button
                              type="button"
                              variant="outline-primary"
                              onClick={() => removePaymentObligationRow(index)}
                            >
                              -
                            </Button>
                          </Form.Group>
                        </Col>
                      </Row>
                    ))}

                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        type="button"
                        variant="outline-primary"
                        onClick={() =>
                          formik.setFieldValue("paymentObligation", [
                            ...(formik.values.paymentObligation || []),
                            makeEmptyPaymentObligationRow(),
                          ])
                        }
                      >
                        +
                      </Button>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Actualizar producto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProductEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductEdit;

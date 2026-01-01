import Layout from "@layout/index";
import { useRouter } from "next/router";
import Select, { MultiValue } from "react-select";
import React, { ReactElement, useState, useEffect } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import {
  Card,
  Col,
  Form,
  Row,
  Toast,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useFormik } from "formik";
import { GetBrandsResponse, GetPackagesResponse } from "../../../interfaces";
import { getBrands } from "../../../api/services/brandService";
import * as yup from "yup";
import { translatePackageStatus } from "../../../Common/translations";
import {
  deletePackageById,
  getPackageById,
  getPackages,
  updatePackageById,
  getPackagesStatuses,
  uploadProductsBulk,
} from "../../../api/services/packageService";
import { getProducts } from "src/api/services/productsService";
import { multiSelectStyles } from "@common/reactSelectStyles";

interface ProductFormValues {
  name: string;
  description: string;
  basePrice: string;
  discount: string;
  status: string;
  brandId: number | "";
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del paquete es requerido"),
  description: yup.string().required("La descripción es requerida"),
  basePrice: yup
    .string()
    .required("El precio base es requerido")
    .matches(/^\d+(\.\d{1,2})?$/, "Ingrese un precio base válido"),
  discount: yup
    .string()
    .nullable()
    .matches(/^\d+(\.\d{1,2})?$/, "Ingrese un descuento válido"),
  status: yup.string().required("El status es requerido"),
  brandId: yup
    .number()
    .required("La marca es requerida")
    .min(1, "Seleccione una marca válida"),
});

const PackageEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [packageStatuses, setPackageStatuses] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GetPackagesResponse[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [productOptions, setProductOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    MultiValue<{ value: number; label: string }>
  >([]);
  const [brandId, setBrandId] = useState<number | null>(null);

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      description: "",
      basePrice: "",
      discount: "",
      status: "",
      brandId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        description: values.description,
        basePrice: parseFloat(values.basePrice),
        discount: values.discount ? parseFloat(values.discount) : null,
        status: values.status,
        brandId: values.brandId as number,
      };
      try {
        await updatePackageById(Number(id), payload);
        setToastMessage("Paquete actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error: any) {
        console.error("Error actualizando el paquete:", error);
        setToastMessage("Error al actualizar el paquete");
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

    const fetchPackageStatuses = async () => {
      try {
        const response = (await getPackagesStatuses()) as string[];
        setPackageStatuses(response);
      } catch (error) {
        console.error("Error fetching product statuses:", error);
      }
    };

    fetchBrands();
    fetchPackageStatuses();
  }, []);

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchProduct = async () => {
        try {
          const packageData = await getPackageById(Number(id));
          formik.setValues({
            name: packageData.name,
            description: packageData.description,
            basePrice: packageData.basePrice.toString(),
            discount: packageData.discount?.toString() || "",
            status: packageData.status,
            brandId: packageData.brand.id,
          });
          setSearchTerm(packageData.name);
          setBrandId(packageData.brand.id);
          setSelectedProducts(
            packageData.packageProducts.map((packageProduct) => ({
              value: packageProduct.product.id,
              label: packageProduct.product.name,
            }))
          );
        } catch (error) {
          console.error("Error fetching package:", error);
          setToastMessage("Error al cargar el producto");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({
        ...(brandId && { brandId }),
      });

      const productOptions = data.map((product) => ({
        value: product.id,
        label: product.name,
      }));
      setProductOptions(productOptions);
    };
    fetchProducts();
  }, [brandId]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await getPackages({ term });
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

  const handleSelectPackage = async (packageSelected: GetPackagesResponse) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/application/package-edit/${packageSelected.id}`);
  };

  const handleDeletePackage = async () => {
    try {
      await deletePackageById(Number(id));
      router.push("/application/package-list");
    } catch (error) {
      console.error("Error deleting package:", error);
      setToastMessage("Error al eliminar el paquete");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  const handleUploadProducts = async (
    newValues: MultiValue<{ value: number; label: string }>
  ) => {
    setSelectedProducts(newValues);
    try {
      await uploadProductsBulk(
        Number(id),
        newValues.map((product) => product.value)
      );
      setToastMessage("Productos actualizados exitosamente");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error uploading products:", error);
      setToastMessage("Error al actualizar los productos");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Paquetes" subTitle="Editar paquete" />

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
              <h5>Buscar paquete</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar paquete por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del paquete..."
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
                    {searchResults.map((packageSelected) => (
                      <div
                        key={packageSelected.id}
                        onClick={() => handleSelectPackage(packageSelected)}
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
                        <strong>{packageSelected.name}</strong>
                        <br />
                        <small className="text-muted">
                          {packageSelected.brand.name} - Status:{" "}
                          {translatePackageStatus(packageSelected.status)}
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
              <h5>Productos del paquete</h5>
            </Card.Header>
            <Card.Body>
              <Select
                isMulti
                options={productOptions}
                value={selectedProducts}
                onChange={(newValues) => handleUploadProducts(newValues)}
                placeholder="Seleccione productos"
                styles={multiSelectStyles}
              />
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>Descripción del paquete</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="brandId"
                    value={
                      brands.find((brand) => brand.id === brandId)?.name || ""
                    }
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
                    disabled={true}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.brandId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del paquete</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del paquete"
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
                  <Form.Label>Descripción del paquete</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Descripción del paquete"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("description")}
                    isInvalid={
                      formik.touched.description && !!formik.errors.description
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Price"
                      name="basePrice"
                      value={formik.values.basePrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.basePrice && !!formik.errors.basePrice
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.basePrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descuento</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>%</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Descuento"
                      name="discount"
                      value={formik.values.discount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.discount && !!formik.errors.discount
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.basePrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio con descuento</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>%</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Precio con descuento"
                      name="priceWithDiscount"
                      value={
                        (parseFloat(formik.values.basePrice) || 0) -
                        ((parseFloat(formik.values.basePrice) || 0) *
                          (parseFloat(formik.values.discount) || 0)) /
                          100
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.discount && !!formik.errors.discount
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.basePrice}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.status && !!formik.errors.status}
                  >
                    <option value="">Seleccione un status</option>
                    {packageStatuses.map((status) => (
                      <option key={status} value={status}>
                        {translatePackageStatus(status)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.status}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="g-2">
                  <Col xs={12} sm={10}>
                    <Button
                      type="submit"
                      variant="primary"
                      className="btn-page w-100"
                    >
                      Actualizar paquete
                    </Button>
                  </Col>
                  <Col xs={12} sm={2}>
                    <Button
                      type="button"
                      onClick={handleDeletePackage}
                      variant="danger"
                      className="btn-page w-100"
                    >
                      Eliminar paquete
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PackageEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PackageEdit;

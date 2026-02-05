import Layout from "@layout/index";
import React, { ReactElement, useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
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
import { GetBrandsResponse, CreatePackagePayload } from "../../interfaces";
import { getBrands } from "../../api/services/brandService";
import * as yup from "yup";
import { translateProductStatus } from "../../Common/translations";
import {
  createPackage,
  getPackagesStatuses,
  uploadProductsBulk,
} from "../../api/services/packageService";
import { getProducts } from "../../api/services/productsService";
import { multiSelectStyles } from "@common/reactSelectStyles";

interface PackageFormValues {
  name: string;
  basePrice: string;
  brandId: number | "";
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del paquete es requerido"),
  basePrice: yup
    .string()
    .required("El precio base es requerido")
    .matches(/^\d+(\.\d{1,2})?$/, "Ingrese un precio base válido"),
  brandId: yup
    .number()
    .required("La marca es requerida")
    .min(1, "Seleccione una marca válida"),
});

const PackageAdd = () => {
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );
  const [productOptions, setProductOptions] = useState<
    { value: number; label: string }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    MultiValue<{ value: number; label: string }>
  >([]);
  const [brandId, setBrandId] = useState<number | null>(null);

  const formik = useFormik<PackageFormValues>({
    initialValues: {
      name: "",
      basePrice: "",
      brandId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        basePrice: parseFloat(values.basePrice),
        brandId: values.brandId as number,
      };
      try {
        const packageCreated = await createPackage(
          payload as CreatePackagePayload
        );
        await uploadProductsBulk(
          packageCreated.id,
          selectedProducts.map((product) => product.value)
        );
        setToastMessage("Producto creado exitosamente");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          formik.resetForm();
          setSelectedProducts([]);
          setBrandId(null);
        }, 500);
      } catch (error: any) {
        console.error("Error creating package:", error);
        setToastMessage("Error al crear el paquete");
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

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Paquetes" subTitle="Agregar paquete" />

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
              <h5>Descripción del paquete</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Select
                    name="brandId"
                    value={formik.values.brandId}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "brandId",
                        e.target.value ? parseInt(e.target.value) : ""
                      );
                      setBrandId(parseInt(e.target.value));
                    }}
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
                  <Form.Label>Nombre del paquete</Form.Label>
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
                  <Form.Label>Precio</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Precio base"
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
                  <Form.Label>Productos del paquete</Form.Label>
                  <Select
                    isMulti
                    options={productOptions}
                    value={selectedProducts}
                    onChange={(newValues) => setSelectedProducts(newValues)}
                    placeholder="Seleccione productos"
                    styles={multiSelectStyles}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Crear paquete
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PackageAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PackageAdd;

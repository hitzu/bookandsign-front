import Layout from "@layout/index";
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
import { GetBrandsResponse, CreateProductPayload } from "../../interfaces";
import { getBrands } from "../../api/services/brandService";
import {
  getProductsStatuses,
  createProduct,
} from "../../api/services/productsService";
import * as yup from "yup";
import { translateProductStatus } from "../../Common/translations";

interface ProductFormValues {
  name: string;
  brandId: number | "";
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del producto es requerido"),
  brandId: yup
    .number()
    .required("La marca es requerida")
    .min(1, "Seleccione una marca válida"),
});

const ProductAdd = () => {
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      brandId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        brandId: values.brandId as number,
      };
      try {
        await createProduct(payload as CreateProductPayload);
        setToastMessage("Producto creado exitosamente");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          formik.resetForm();
        }, 500);
      } catch (error: any) {
        console.error("Error creating product:", error);
        setToastMessage("Error al crear el producto");
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

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Crear producto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProductAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductAdd;

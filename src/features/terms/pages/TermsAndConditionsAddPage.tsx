import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row, Toast } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import type { MultiValue } from "react-select";
import type {
  CreateTermPayload,
  GetBrandsResponse,
  GetPackagesResponse,
  TermScope,
} from "../../../interfaces";
import { getBrands } from "../../../api/services/brandService";
import { getPackages } from "../../../api/services/packageService";
import {
  createTerm,
  uploadTermsBrandsInBulk,
  uploadTermsPackagesInBulk,
} from "../../../api/services/termsService";
import {
  mapPackagesToOptions,
  termScopeValues,
  type SelectOption,
} from "../constants";
import { TermEditorCard } from "../components/TermEditorCard";
import type { TermsAndConditionsFormValues } from "../types";

const validationSchema = yup.object().shape({
  scope: yup
    .string<TermScope>()
    .oneOf(termScopeValues)
    .required("El scope es requerido"),
  title: yup.string().required("El titulo es requerido"),
  content: yup.string().required("El contenido es requerido"),
});

const toastStyles = {
  position: "fixed" as const,
  top: "20px",
  right: "20px",
  zIndex: 9999,
};

export function TermsAndConditionsAddPage() {
  const [showToast, setShowToast] = useState(false);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [brandId, setBrandId] = useState<number | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<
    MultiValue<SelectOption>
  >([]);
  const [selectedBrands, setSelectedBrands] = useState<
    MultiValue<SelectOption>
  >([]);
  const [packageOptions, setPackageOptions] = useState<SelectOption[]>([]);
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
        setPackageOptions(mapPackagesToOptions(response));
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
      const payload: CreateTermPayload = {
        scope: values.scope,
        title: values.title,
        content: values.content,
      };

      try {
        const termCreated = await createTerm(payload);

        if (values.scope === "package" && selectedPackages.length > 0) {
          await uploadTermsPackagesInBulk(
            termCreated.id,
            selectedPackages.map((pkg) => pkg.value)
          );
        }

        if (values.scope === "brand" && selectedBrands.length > 0) {
          await uploadTermsBrandsInBulk(
            termCreated.id,
            selectedBrands.map((brand) => brand.value)
          );
        }

        setToastMessage("Término y condición creado exitosamente");
        setToastVariant("success");
        setShowToast(true);

        setTimeout(() => {
          formik.resetForm();
          setBrandId(null);
          setSelectedPackages([]);
          setSelectedBrands([]);
        }, 500);
      } catch (error) {
        console.error("Error creating term:", error);
        setToastMessage("Error al crear el termino y condicion");
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  const handleScopeChange = (nextScope: TermScope) => {
    formik.setFieldValue("scope", nextScope);

    if (nextScope !== "package") {
      setBrandId(null);
      setSelectedPackages([]);
    }

    if (nextScope !== "brand") {
      setSelectedBrands([]);
    }
  };

  return (
    <>
      <BreadcrumbItem
        mainTitle="Terminos y condiciones"
        subTitle="Agregar termino y condicion"
      />

      <div style={toastStyles}>
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
            <TermEditorCard
              title="Agregar termino y condicion"
              submitLabel="Crear termino y condicion"
              formik={formik}
              brands={brands}
              brandId={brandId}
              packageOptions={packageOptions}
              selectedPackages={selectedPackages}
              selectedBrands={selectedBrands}
              onScopeChange={handleScopeChange}
              onBrandIdChange={setBrandId}
              onPackagesChange={setSelectedPackages}
              onBrandsChange={setSelectedBrands}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

import BreadcrumbItem from "@common/BreadcrumbItem";
import { Col, Row, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import type { MultiValue } from "react-select";
import * as yup from "yup";
import type {
  GetBrandsResponse,
  GetPackagesResponse,
  GetTermsResponse,
  TermScope,
  UpdateTermsPayload,
} from "../../../interfaces";
import { getBrands } from "../../../api/services/brandService";
import { getPackages } from "../../../api/services/packageService";
import {
  addTermToBrand,
  getTermById,
  removeTermFromBrand,
  updateTermsById,
  uploadTermsPackagesInBulk,
} from "../../../api/services/termsService";
import {
  mapBrandTermsToOptions,
  mapPackagesToOptions,
  mapPackageTermsToOptions,
  termScopeValues,
  type SelectOption,
} from "../constants";
import { TermEditorCard } from "../components/TermEditorCard";
import { TermSearchCard } from "../components/TermSearchCard";
import { useTermBrowser } from "../hooks/useTermBrowser";
import type { TermsAndConditionsFormValues } from "../types";

const validationSchema = yup.object().shape({
  scope: yup.string<TermScope>().oneOf(termScopeValues).required("El scope es requerido"),
  title: yup.string().required("El titulo es requerido"),
  content: yup.string().required("El contenido es requerido"),
});

export function TermsAndConditionsEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const termId = Number(id);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<MultiValue<SelectOption>>([]);
  const [selectedBrands, setSelectedBrands] = useState<MultiValue<SelectOption>>([]);
  const [packageOptions, setPackageOptions] = useState<SelectOption[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");
  const [brandId, setBrandId] = useState<number | null>(null);
  const termBrowser = useTermBrowser();

  const formik = useFormik<TermsAndConditionsFormValues>({
    initialValues: { scope: "global", title: "", content: "" },
    validationSchema,
    onSubmit: async (values) => {
      const payload: UpdateTermsPayload = {
        scope: values.scope,
        title: values.title,
        content: values.content,
      };
      try {
        await updateTermsById(termId, payload);
        setToastMessage("Termino y condicion actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error) {
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
        setBrands((await getBrands()) as GetBrandsResponse[]);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchTerm = async () => {
      try {
        const term = await getTermById(Number(id));
        formik.setValues({ scope: term.scope, title: term.title, content: term.content });
        setBrandId(term.packageTerms?.[0]?.package?.brandId ?? null);
        setSelectedPackages(mapPackageTermsToOptions(term.packageTerms));
        setSelectedBrands(mapBrandTermsToOptions(term.brandTerms));
      } catch (error) {
        console.error("Error fetching term:", error);
        setToastMessage("Error al cargar el termino y condicion");
        setToastVariant("danger");
        setShowToast(true);
      }
    };
    fetchTerm();
  }, [id]);

  useEffect(() => {
    const fetchPackagesByBrandId = async () => {
      try {
        const response = (await getPackages({ brandId: brandId || undefined })) as GetPackagesResponse[];
        setPackageOptions(mapPackagesToOptions(response));
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackagesByBrandId();
  }, [brandId]);

  const handleSelectTerm = (term: GetTermsResponse) => {
    router.push(`/terms-and-conditions-edit/${term.id}`);
  };

  const handleScopeChange = (nextScope: TermScope) => {
    formik.setFieldValue("scope", nextScope);
    if (nextScope !== "package") {
      setBrandId(null);
      setSelectedPackages([]);
    }
    if (nextScope !== "brand") setSelectedBrands([]);
  };

  const handleUploadTermsPackages = async (newValues: MultiValue<SelectOption>) => {
    try {
      setSelectedPackages(newValues);
      if (formik.values.scope === "package" && newValues.length > 0) {
        await uploadTermsPackagesInBulk(termId, newValues.map((pkg) => pkg.value));
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

  const handleSyncTermBrands = async (newValues: MultiValue<SelectOption>) => {
    try {
      const previousBrandIds = selectedBrands.map((brand) => brand.value);
      const nextBrandIds = newValues.map((brand) => brand.value);
      const brandIdsToAdd = nextBrandIds.filter((value) => !previousBrandIds.includes(value));
      const brandIdsToRemove = previousBrandIds.filter((value) => !nextBrandIds.includes(value));
      await Promise.all([
        ...brandIdsToAdd.map((brandIdValue) => addTermToBrand({ brandId: brandIdValue, termId })),
        ...brandIdsToRemove.map((brandIdValue) => removeTermFromBrand({ brandId: brandIdValue, termId })),
      ]);
      setSelectedBrands(newValues);
      setToastMessage("Marcas actualizadas exitosamente");
      setToastVariant("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error syncing term brands:", error);
      setToastMessage("Error al actualizar las marcas del termino");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <BreadcrumbItem mainTitle="Terminos y condiciones" subTitle="Editar termino y condicion" />
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide bg={toastVariant}>
          <Toast.Header>
            <strong className="me-auto">{toastVariant === "success" ? "Éxito" : "Error"}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>
      <Row>
        <Col sm={12}>
          <TermSearchCard
            scope={termBrowser.scope}
            brands={termBrowser.brands}
            packages={termBrowser.packages}
            selectedBrandId={termBrowser.selectedBrandId}
            selectedPackageId={termBrowser.selectedPackageId}
            filter={termBrowser.filter}
            terms={termBrowser.terms}
            isLoading={termBrowser.isLoading}
            onScopeChange={termBrowser.changeScope}
            onBrandChange={termBrowser.setSelectedBrandId}
            onPackageChange={termBrowser.setSelectedPackageId}
            onFilterChange={termBrowser.setFilter}
            onSelectTerm={handleSelectTerm}
          />
          <TermEditorCard
            title="Definicion del termino y condicion"
            submitLabel="Actualizar termino y condicion"
            formik={formik}
            brands={brands}
            brandId={brandId}
            packageOptions={packageOptions}
            selectedPackages={selectedPackages}
            selectedBrands={selectedBrands}
            onScopeChange={handleScopeChange}
            onBrandIdChange={setBrandId}
            onPackagesChange={handleUploadTermsPackages}
            onBrandsChange={handleSyncTermBrands}
          />
        </Col>
      </Row>
    </>
  );
}

import { useRouter } from "next/router";
import React from "react";
import type { GetTermsResponse } from "../../../interfaces";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Col, Row } from "react-bootstrap";
import { TermSearchCard } from "../components/TermSearchCard";
import { useTermBrowser } from "../hooks/useTermBrowser";

export function TermsAndConditionsEditIndexPage() {
  const router = useRouter();
  const {
    scope,
    brands,
    packages,
    selectedBrandId,
    selectedPackageId,
    filter,
    terms,
    isLoading,
    changeScope,
    setSelectedBrandId,
    setSelectedPackageId,
    setFilter,
  } = useTermBrowser();

  const handleSelectTerm = (term: GetTermsResponse) => {
    router.push(`/terms-and-conditions-edit/${term.id}`);
  };

  return (
    <>
      <BreadcrumbItem
        mainTitle="Terminos y condiciones"
        subTitle="Editar termino y condicion"
      />

      <Row>
        <Col sm={12}>
          <TermSearchCard
            scope={scope}
            brands={brands}
            packages={packages}
            selectedBrandId={selectedBrandId}
            selectedPackageId={selectedPackageId}
            filter={filter}
            terms={terms}
            isLoading={isLoading}
            onScopeChange={changeScope}
            onBrandChange={setSelectedBrandId}
            onPackageChange={setSelectedPackageId}
            onFilterChange={setFilter}
            onSelectTerm={handleSelectTerm}
          />
        </Col>
      </Row>
    </>
  );
}

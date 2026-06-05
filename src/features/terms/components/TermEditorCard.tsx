import { Button, Card, Form } from "react-bootstrap";
import type { MultiValue } from "react-select";
import type { FormikProps } from "formik";
import type { GetBrandsResponse, TermScope } from "../../../interfaces";
import { termScopes, type SelectOption } from "../constants";
import type { TermsAndConditionsFormValues } from "../types";
import { TermTargetsFields } from "./TermTargetsFields";

interface TermEditorCardProps {
  title: string;
  submitLabel: string;
  formik: FormikProps<TermsAndConditionsFormValues>;
  brands: GetBrandsResponse[];
  brandId: number | null;
  packageOptions: SelectOption[];
  selectedPackages: readonly SelectOption[];
  selectedBrands: readonly SelectOption[];
  onScopeChange: (scope: TermScope) => void;
  onBrandIdChange: (brandId: number | null) => void;
  onPackagesChange: (values: MultiValue<SelectOption>) => void;
  onBrandsChange: (values: MultiValue<SelectOption>) => void;
}

export function TermEditorCard({
  title,
  submitLabel,
  formik,
  brands,
  brandId,
  packageOptions,
  selectedPackages,
  selectedBrands,
  onScopeChange,
  onBrandIdChange,
  onPackagesChange,
  onBrandsChange,
}: TermEditorCardProps) {
  return (
    <Card>
      <Card.Header>
        <h5>{title}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Scope</Form.Label>
            <Form.Select
              name="scope"
              value={formik.values.scope}
              onChange={(e) => onScopeChange(e.target.value as TermScope)}
              onBlur={formik.handleBlur("scope")}
              isInvalid={formik.touched.scope && !!formik.errors.scope}
            >
              {termScopes.map((termScope) => (
                <option key={termScope.value} value={termScope.value}>
                  {termScope.label}
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
              isInvalid={formik.touched.content && !!formik.errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.content}
            </Form.Control.Feedback>
          </Form.Group>

          <TermTargetsFields
            scope={formik.values.scope}
            brands={brands}
            brandId={brandId}
            packageOptions={packageOptions}
            selectedPackages={selectedPackages}
            selectedBrands={selectedBrands}
            onBrandIdChange={onBrandIdChange}
            onPackagesChange={onPackagesChange}
            onBrandsChange={onBrandsChange}
          />

          <Button type="submit" variant="primary" className="btn-page w-100">
            {submitLabel}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

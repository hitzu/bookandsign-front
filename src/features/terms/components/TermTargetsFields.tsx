import { Form } from "react-bootstrap";
import Select, { MultiValue } from "react-select";
import type { GetBrandsResponse, TermScope } from "../../../interfaces";
import { multiSelectStyles } from "@common/reactSelectStyles";
import type { SelectOption } from "../constants";

interface TermTargetsFieldsProps {
  scope: TermScope;
  brands: GetBrandsResponse[];
  brandId: number | null;
  packageOptions: SelectOption[];
  selectedPackages: readonly SelectOption[];
  selectedBrands: readonly SelectOption[];
  onBrandIdChange: (brandId: number | null) => void;
  onPackagesChange: (values: MultiValue<SelectOption>) => void;
  onBrandsChange: (values: MultiValue<SelectOption>) => void;
}

export function TermTargetsFields({
  scope,
  brands,
  brandId,
  packageOptions,
  selectedPackages,
  selectedBrands,
  onBrandIdChange,
  onPackagesChange,
  onBrandsChange,
}: TermTargetsFieldsProps) {
  if (scope === "global") {
    return null;
  }

  if (scope === "brand") {
    return (
      <Form.Group className="mb-3">
        <Form.Label>Marcas</Form.Label>
        <Select
          isMulti
          options={brands.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }))}
          value={selectedBrands}
          onChange={onBrandsChange}
          placeholder="Seleccione marcas"
          styles={multiSelectStyles}
        />
      </Form.Group>
    );
  }

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Marca</Form.Label>
        <Form.Select
          name="brandId"
          value={brandId ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            onBrandIdChange(value ? Number.parseInt(value, 10) : null);
          }}
        >
          <option value="">Todas las marcas</option>
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
          onChange={onPackagesChange}
          placeholder="Seleccione paquetes"
          styles={multiSelectStyles}
        />
      </Form.Group>
    </>
  );
}

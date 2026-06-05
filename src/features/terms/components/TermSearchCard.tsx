import { Card, Form, ListGroup } from "react-bootstrap";
import type {
  GetBrandsResponse,
  GetPackagesResponse,
  GetTermsResponse,
  TermScope,
} from "../../../interfaces";
import { termScopes } from "../constants";

interface TermSearchCardProps {
  scope: TermScope;
  brands: GetBrandsResponse[];
  packages: GetPackagesResponse[];
  selectedBrandId: number | null;
  selectedPackageId: number | null;
  filter: string;
  terms: GetTermsResponse[];
  isLoading: boolean;
  onScopeChange: (scope: TermScope) => void;
  onBrandChange: (brandId: number | null) => void;
  onPackageChange: (packageId: number | null) => void;
  onFilterChange: (value: string) => void;
  onSelectTerm: (term: GetTermsResponse) => void;
}

const listContainerStyles = {
  marginTop: "4px",
  maxHeight: "320px",
  overflowY: "auto" as const,
};

export function TermSearchCard({
  scope,
  brands,
  packages,
  selectedBrandId,
  selectedPackageId,
  filter,
  terms,
  isLoading,
  onScopeChange,
  onBrandChange,
  onPackageChange,
  onFilterChange,
  onSelectTerm,
}: TermSearchCardProps) {
  const needsTarget = scope === "brand" || scope === "package";
  const hasTarget =
    scope === "global" ||
    (scope === "brand" && selectedBrandId !== null) ||
    (scope === "package" && selectedPackageId !== null);

  return (
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
            onChange={(e) => onScopeChange(e.target.value as TermScope)}
          >
            {termScopes.map((termScope) => (
              <option key={termScope.value} value={termScope.value}>
                {termScope.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {scope === "brand" && (
          <Form.Group className="mb-3">
            <Form.Label>Marca</Form.Label>
            <Form.Select
              name="brandId"
              value={selectedBrandId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                onBrandChange(value ? Number.parseInt(value, 10) : null);
              }}
            >
              <option value="">Seleccione una marca</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {scope === "package" && (
          <Form.Group className="mb-3">
            <Form.Label>Paquete</Form.Label>
            <Form.Select
              name="packageId"
              value={selectedPackageId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                onPackageChange(value ? Number.parseInt(value, 10) : null);
              }}
            >
              <option value="">Seleccione un paquete</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        {needsTarget && !hasTarget && (
          <small className="text-muted">
            Seleccione {scope === "brand" ? "una marca" : "un paquete"} para
            listar sus terminos y condiciones
          </small>
        )}

        {hasTarget && (
          <Form.Group>
            <Form.Label>Filtrar por titulo o contenido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escriba para filtrar la lista..."
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
            />

            {isLoading && (
              <ListGroup className="mt-1">
                <ListGroup.Item className="text-muted">
                  <small>Cargando terminos...</small>
                </ListGroup.Item>
              </ListGroup>
            )}

            {!isLoading && terms.length > 0 && (
              <ListGroup style={listContainerStyles} className="mt-1">
                {terms.map((term) => (
                  <ListGroup.Item
                    key={term.id}
                    action
                    onClick={() => onSelectTerm(term)}
                    className="py-2 px-3"
                  >
                    <div className="fw-semibold">{term.title}</div>
                    <div
                      className="text-muted small mt-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                      }}
                    >
                      {term.content}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            {!isLoading && terms.length === 0 && (
              <ListGroup className="mt-1">
                <ListGroup.Item className="text-muted">
                  <small>No se encontraron terminos y condiciones</small>
                </ListGroup.Item>
              </ListGroup>
            )}
          </Form.Group>
        )}
      </Card.Body>
    </Card>
  );
}

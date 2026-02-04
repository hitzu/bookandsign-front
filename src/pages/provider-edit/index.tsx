import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Provider } from "../../interfaces";
import { getProviders } from "../../api/services/providerService";

const ProviderEditIndex = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) return [];
    return providers
      .filter((p) => p.name?.toLowerCase().includes(term))
      .slice(0, 50);
  }, [providers, searchTerm]);

  const showResults = searchTerm.trim().length >= 2;

  const handleSelectProvider = (provider: Provider) => {
    setSearchTerm("");
    router.push(`/provider-edit/${provider.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Proveedores" subTitle="Editar proveedor" />

      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Buscar proveedor para editar</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar proveedor por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {showResults && filteredProviders.length > 0 && (
                  <div
                    style={{
                      position: "relative",
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
                    {filteredProviders.map((provider) => (
                      <div
                        key={provider.id}
                        onClick={() => handleSelectProvider(provider)}
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
                        <strong>{provider.name}</strong>
                        {!!provider.contactName && (
                          <>
                            <br />
                            <small className="text-muted">
                              {provider.contactName}
                            </small>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {showResults && filteredProviders.length === 0 && (
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "12px",
                      marginTop: "4px",
                    }}
                  >
                    <small className="text-muted">
                      No se encontraron proveedores con ese nombre
                    </small>
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProviderEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProviderEditIndex;

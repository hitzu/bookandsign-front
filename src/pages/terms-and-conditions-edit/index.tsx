import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row } from "react-bootstrap";
import { GetTermsResponse } from "../../interfaces";
import { getTerms } from "../../api/services/termsService";

const TermsAndConditionsEditIndex = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GetTermsResponse[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [scope, setScope] = useState<"global" | "package">("global");

  const termScopes = [
    { value: "global", label: "Globales" },
    { value: "package", label: "Paquetes" },
  ];

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await getTerms({ termScope: scope, query: term });
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

  const handleSelectTerm = (term: GetTermsResponse) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/terms-and-conditions-edit/${term.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem
        mainTitle="Terminos y condiciones"
        subTitle="Editar termino y condicion"
      />

      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Buscar termino y condicion</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Scope</Form.Label>
                <Form.Select
                  name="scope"
                  value={scope}
                  onChange={(e) => {
                    setScope(e.target.value as "global" | "package");
                  }}
                >
                  {termScopes.map((scope) => (
                    <option key={scope.value} value={scope.value}>
                      {scope.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Buscar termino y condicion por titulo o contenido
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el titulo o contenido del termino y condicion..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {showSearchResults && searchResults.length > 0 && (
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
                    {searchResults.map((term) => (
                      <div
                        key={term.id}
                        onClick={() => handleSelectTerm(term)}
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
                        <strong>{term.title}</strong>
                        <br />
                        <small className="text-muted">{term.content}</small>
                      </div>
                    ))}
                  </div>
                )}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchTerm.length >= 2 && (
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
                        No se encontraron terminos y condiciones con ese nombre
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

TermsAndConditionsEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TermsAndConditionsEditIndex;

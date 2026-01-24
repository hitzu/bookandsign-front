import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Contract } from "../../../interfaces";
import { getContractsBySku } from "../../../api/services/contractService";

const ContractEditIndex = () => {
  const router = useRouter();
  const [searchContract, setSearchContract] = useState("");
  const [searchResults, setSearchResults] = useState<Contract[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (sku: string) => {
    setSearchContract(sku);
    if (sku.length >= 2) {
      try {
        const results = await getContractsBySku(sku);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Error searching contracts:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSelectContract = (term: Contract) => {
    setSearchContract("");
    setShowSearchResults(false);
    router.push(`/application/contract-edit/${term.sku}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem
        mainTitle="Contratos"
        subTitle="Buscar contrato por SKU"
      />

      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Buscar contrato por SKU</h5>
            </Card.Header>
            <Card.Body>

              <Form.Group>
                <Form.Label>
                  Buscar termino y condicion por titulo o contenido
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el titulo o contenido del termino y condicion..."
                  value={searchContract}
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
                    {searchResults.map((contract) => (
                      <div
                        key={contract.id}
                        onClick={() => handleSelectContract(contract)}
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
                        <strong>{contract.sku}</strong>
                        <br />
                        <small className="text-muted">{contract.total}</small>
                      </div>
                    ))}
                  </div>
                )}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchContract.length >= 2 && (
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

ContractEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ContractEditIndex;

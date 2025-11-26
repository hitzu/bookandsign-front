import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row } from "react-bootstrap";
import { GetProductsResponse } from "../../../interfaces";
import { getProducts } from "../../../api/services/productsService";
import { translateProductStatus } from "../../../Common/translations";

const ProductEditIndex = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GetProductsResponse[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length >= 2) {
      try {
        const results = await getProducts({ term });
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

  const handleSelectProduct = (product: GetProductsResponse) => {
    setSearchTerm("");
    setShowSearchResults(false);
    router.push(`/application/product-edit/${product.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Productos" subTitle="Editar producto" />

      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <h5>Buscar producto para editar</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar producto por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del producto..."
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
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
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
                        <strong>{product.name}</strong>
                        <br />
                        <small className="text-muted">
                          {product.brand.name} - Status:{" "}
                          {translateProductStatus(product.status)}
                        </small>
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
                        No se encontraron productos con ese nombre
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

ProductEditIndex.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductEditIndex;

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import { GetProductsResponse, GetBrandsResponse } from "../interfaces";
import {
  getProducts,
  deleteProductById,
} from "../api/services/productsService";
import { getBrands } from "../api/services/brandService";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";

const ProductList = () => {
  const [products, setProducts] = useState<GetProductsResponse[]>([]);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [brandId, setBrandId] = useState<number>(0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

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
    const fetchProducts = async () => {
      const params = {
        ...(brandId && { brandId }),
      };
      const response = (await getProducts(params)) as GetProductsResponse[];
      setProducts(response);
    };
    fetchProducts();
  }, [brandId]);

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
  };

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deleteProductById(deleteId);
        setProducts(products.filter((product) => product.id !== deleteId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    handleClose();
  };

  const handleDelete = useCallback((id: number) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Marca",
        enableColumnFilter: false,
        accessorKey: "brand",
        cell: (cellProps: any) => {
          return <div>{cellProps.row.original.brand.name}</div>;
        },
      },
      {
        header: "Acciones",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          return (
            <React.Fragment>
              <ul className="list-inline me-auto mb-0">
                <li
                  className="list-inline-item align-bottom"
                  data-bs-toggle="tooltip"
                  title="Edit"
                >
                  <Link
                    href={`/product-edit/${cellProps.row.original.id}`}
                    className="avtar avtar-xs btn-link-success btn-pc-default"
                  >
                    <i className="ti ti-edit-circle f-18"></i>
                  </Link>
                </li>
                <li
                  className="list-inline-item align-bottom"
                  data-bs-toggle="tooltip"
                  title="Delete"
                >
                  <Link
                    href="#!"
                    className="avtar avtar-xs btn-link-danger btn-pc-default"
                    onClick={() => handleDelete(cellProps.row.original.id)}
                  >
                    <i className="ti ti-trash f-18"></i>
                  </Link>
                </li>
              </ul>
            </React.Fragment>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleClose}
        handleDeleteId={handleDeleteId}
      />

      <BreadcrumbItem mainTitle="Productos" subTitle="Lista de productos" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center p-sm-4 pb-sm-2">
                <select
                  className="form-select w-75"
                  value={brandId || ""}
                  onChange={(e) => {
                    const newBrandId = parseInt(e.target.value);
                    setBrandId(newBrandId);
                  }}
                >
                  <option value="">Todas las marcas</option>
                  {brands.map((brand: GetBrandsResponse) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <Link
                  href="/product-add"
                  className="btn btn-primary"
                >
                  <i className="ti ti-plus f-18"></i> Agregar producto
                </Link>
              </div>
              <TableContainer
                columns={columns || []}
                data={products || []}
                isGlobalFilter={true}
                isBordered={false}
                customPageSize={50}
                tableClass="table table-hover tbl-product datatable-table"
                theadClass="table-light"
                isPagination={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

ProductList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProductList;

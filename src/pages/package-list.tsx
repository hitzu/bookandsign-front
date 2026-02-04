import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import { GetPackagesResponse, GetBrandsResponse } from "../interfaces";
import { getBrands } from "../api/services/brandService";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";
import {
  deletePackageById,
  getPackages,
} from "../api/services/packageService";

const PackageList = () => {
  const [packages, setPackages] = useState<GetPackagesResponse[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [brands, setBrands] = useState<GetBrandsResponse[]>([]);
  const [brandId, setBrandId] = useState<number>(0);
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
    const fetchPackages = async () => {
      const params = {
        ...(brandId && { brandId }),
      };
      const response = (await getPackages(params)) as GetPackagesResponse[];
      setPackages(response);
    };
    fetchPackages();
  }, [brandId]);

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deletePackageById(deleteId);
        setPackages(
          packages.filter((currentPackage) => currentPackage.id !== deleteId)
        );
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
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
        header: "Precio",
        enableColumnFilter: false,
        accessorKey: "basePrice",
        cell: (cellProps: any) => {
          return <div>${cellProps.row.original.basePrice}</div>;
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
                    href={`/package-edit/${cellProps.row.original.id}`}
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

      <BreadcrumbItem mainTitle="Paquetes" subTitle="Lista de paquetes" />
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
                  href="/package-add"
                  className="btn btn-primary"
                >
                  <i className="ti ti-plus f-18"></i> Agregar paquete
                </Link>
              </div>
              <TableContainer
                columns={columns || []}
                data={packages || []}
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

PackageList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PackageList;

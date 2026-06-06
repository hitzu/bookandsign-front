import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import { Extra, GetBrandsResponse } from "../interfaces";
import { getBrands } from "../api/services/brandService";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";
import { deleteExtraById, getExtras } from "../api/services/extrasService";
import { translatePackageStatus } from "../Common/translations";

const ExtrasList = () => {
  const [extras, setExtras] = useState<Extra[]>([]);
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
    const fetchExtras = async () => {
      const params = {
        ...(brandId && { brandId }),
      };
      const response = await getExtras(params);
      setExtras(response);
    };
    fetchExtras();
  }, [brandId]);

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deleteExtraById(deleteId);
        setExtras(extras.filter((extra) => extra.id !== deleteId));
      } catch (error) {
        console.error("Error deleting extra:", error);
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
        accessorKey: "price",
        cell: (cellProps: any) => {
          return <div>${cellProps.row.original.price}</div>;
        },
      },
      {
        header: "Estado",
        enableColumnFilter: false,
        accessorKey: "status",
        cell: (cellProps: any) => {
          return <div>{translatePackageStatus(cellProps.row.original.status)}</div>;
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
                    href={`/extras-edit/${cellProps.row.original.id}`}
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
    [handleDelete]
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleClose}
        handleDeleteId={handleDeleteId}
      />

      <BreadcrumbItem mainTitle="Extras" subTitle="Lista de extras" />
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
                <Link href="/extras-add" className="btn btn-primary">
                  <i className="ti ti-plus f-18"></i> Agregar extra
                </Link>
              </div>
              <TableContainer
                columns={columns || []}
                data={extras || []}
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

ExtrasList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ExtrasList;

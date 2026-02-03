import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import { Provider } from "../../interfaces";
import {
  deleteProviderById,
  getProviders,
} from "../../api/services/providerService";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";

const ProviderList = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = (await getProviders()) as Provider[];
        setProviders(response);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
  };

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deleteProviderById(deleteId);
        setProviders(providers.filter((provider) => provider.id !== deleteId));
      } catch (error) {
        console.error("Error deleting provider:", error);
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
        header: "Contacto",
        accessorKey: "contactName",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const provider: Provider = cellProps.row.original;
          return <div>{provider.contactName || "-"}</div>;
        },
      },
      {
        header: "Teléfono",
        accessorKey: "contactPhone",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const provider: Provider = cellProps.row.original;
          return <div>{provider.contactPhone || "-"}</div>;
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
                    href={`/application/provider-edit/${cellProps.row.original.id}`}
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

      <BreadcrumbItem mainTitle="Proveedores" subTitle="Lista de proveedores" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center p-sm-4 pb-sm-2">
                <div />
                <Link
                  href="/application/provider-add"
                  className="btn btn-primary"
                >
                  <i className="ti ti-plus f-18"></i> Agregar proveedor
                </Link>
              </div>
              <TableContainer
                columns={columns || []}
                data={providers || []}
                isGlobalFilter={true}
                isBordered={false}
                customPageSize={50}
                tableClass="table table-hover datatable-table"
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

ProviderList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ProviderList;

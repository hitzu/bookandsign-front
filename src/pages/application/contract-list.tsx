import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";
import {
  deleteContractById,
  getContracts,
} from "../../api/services/contractService";
import { Contract } from "../../interfaces";

const ContractList = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = (await getContracts()) as Contract[];
      setContracts(response);
    };
    fetchProducts();
  }, []);

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
  };

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deleteContractById(deleteId);
        setContracts(contracts.filter((contract) => contract.id !== deleteId));
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
        header: "sku",
        accessorKey: "sku",
        enableColumnFilter: false,
      },
      {
        header: "Nombre del cliente",
        enableColumnFilter: false,
        accessorKey: "clientName",
      },
      {
        header: "Telefono del cliente",
        enableColumnFilter: false,
        accessorKey: "clientPhone",
      },
      {
        header: "token",
        enableColumnFilter: false,
        accessorKey: "token",
        cell: (cellProps: any) => {
          return (
            <div>
              <Link
                href={`/pages/c/${cellProps.row.original.token}`}
                target="_blank"
              >
                {cellProps.row.original.token}
              </Link>
            </div>
          );
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
                    href={`/application/contract-edit/${cellProps.row.original.sku}`}
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

      <BreadcrumbItem mainTitle="Contratos" subTitle="Lista de contratos" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              <TableContainer
                columns={columns || []}
                data={contracts || []}
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

ContractList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default ContractList;

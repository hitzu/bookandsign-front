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
import { Promotion } from "../interfaces";
import { getPromotions } from "../api/services/promotionsService";

const PromotionsList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    const fetchPromotions = async () => {
      const response = (await getPromotions()) as Promotion[];
      setPromotions(response);
    };
    fetchPromotions();
  }, []);

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
  };

  const columns = useMemo(
    () => [
      {
        header: "nombre",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Tipo",
        enableColumnFilter: false,
        accessorKey: "type",
      },
      {
        header: "Valor",
        enableColumnFilter: false,
        accessorKey: "value",
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Promociones" subTitle="Lista de promociones" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              <TableContainer
                columns={columns || []}
                data={promotions || []}
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

PromotionsList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PromotionsList;

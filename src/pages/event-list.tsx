import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Layout from "@layout/index";
import { Event } from "../interfaces";
import { deleteEventById, getEvents } from "../api/services/eventsService";
import TableContainer from "@common/TableContainer";
import Link from "next/link";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleClose = () => {
    setShowDeleteModal(false);
    setDeleteId(0);
  };

  const handleDeleteId = async () => {
    if (deleteId) {
      try {
        await deleteEventById(deleteId);
        setEvents(events.filter((e) => e.id !== deleteId));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
    handleClose();
  };

  const handleDelete = useCallback((id: number) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Key",
        accessorKey: "key",
        enableColumnFilter: false,
      },
      {
        header: "Token",
        accessorKey: "token",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          return (
            <Link
              href={`/fiesta/${cellProps.row.original.token}`}
              target="_blank"
            >
              {cellProps.row.original.token}
            </Link>
          );
        },
      },
      {
        header: "Festejados",
        accessorKey: "honoreesNames",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const event: Event = cellProps.row.original;
          return <div>{event.honoreesNames || "-"}</div>;
        },
      },
      {
        header: "Salon",
        accessorKey: "venueName",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const event: Event = cellProps.row.original;
          return <div>{event.venueName || "-"}</div>;
        },
      },
      {
        header: "Fecha",
        accessorKey: "serviceStartsAt",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const event: Event = cellProps.row.original;
          return <div>{formatDate(event.serviceStartsAt)}</div>;
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
                    href={`/event-edit/${cellProps.row.original.id}`}
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
                <li
                  className="list-inline-item align-bottom"
                  data-bs-toggle="tooltip"
                  title="Ver Fotos"
                >
                  <Link
                    href={`/photos-list/${cellProps.row.original.token}`}
                    className="avtar avtar-xs btn-link-success btn-pc-default"
                  >
                    <i className="ph-duotone ph-images"></i>
                  </Link>
                </li>
              </ul>
            </React.Fragment>
          );
        },
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={showDeleteModal}
        handleClose={handleClose}
        handleDeleteId={handleDeleteId}
      />

      <BreadcrumbItem mainTitle="Eventos" subTitle="Lista de eventos" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center p-sm-4 pb-sm-2">
                <div />
                <Link href="/event-add" className="btn btn-primary">
                  <i className="ti ti-plus f-18"></i> Agregar evento
                </Link>
              </div>
              <TableContainer
                columns={columns || []}
                data={events || []}
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

EventList.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EventList;

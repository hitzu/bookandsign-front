import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import Layout from "@layout/index";
import { EventPhoto } from "../../interfaces";
import { getEventPhotos, deletePhotoById } from "../../api/services/photosService";
import TableContainer from "@common/TableContainer";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Row } from "react-bootstrap";
import DeleteModal from "@common/DeleteModal";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return dateStr;
  }
};

const PhotosListByToken = () => {
  const router = useRouter();
  const { token } = router.query;

  const [photos, setPhotos] = useState<EventPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);

  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEventPhotos(token);
        setPhotos(response.items);
        if (response.items.length === 0) {
          setError("No se encontraron fotos para este evento");
        }
      } catch (err: any) {
        console.error("Error fetching photos:", err);
        setError(
          err?.response?.status === 404
            ? "Evento no encontrado"
            : "Error al cargar las fotos"
        );
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [token]);

  const handleClose = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteId(0);
  }, []);

  const handleDeleteId = useCallback(async () => {
    if (deleteId) {
      try {
        await deletePhotoById(deleteId);
        setPhotos((prev) => prev.filter((photo) => photo.id !== deleteId));
      } catch (err) {
        console.error("Error deleting photo:", err);
      }
    }
    handleClose();
  }, [deleteId, handleClose]);

  const handleDelete = useCallback((id: number) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Imagen",
        accessorKey: "publicUrl",
        enableColumnFilter: false,
        cell: (cellProps: any) => {
          const url = cellProps.row.original.publicUrl;
          return (
            <div className="d-flex align-items-center">
              {url ? (
                <img
                  src={url}
                  alt=""
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
                />
              ) : (
                <span className="text-muted">-</span>
              )}
            </div>
          );
        },
      },
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false,
      },
      {
        header: "Fecha creacion",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (cellProps: any) => (
          <span>{formatDate(cellProps.row.original.createdAt)}</span>
        ),
      },
      {
        header: "Consentimiento",
        accessorKey: "consentAt",
        enableColumnFilter: false,
        cell: (cellProps: any) => (
          <span>{formatDate(cellProps.row.original.consentAt)}</span>
        ),
      },
      {
        header: "Acciones",
        enableColumnFilter: false,
        cell: (cellProps: any) => (
          <ul className="list-inline me-auto mb-0">
            <li
              className="list-inline-item align-bottom"
              data-bs-toggle="tooltip"
              title="Delete"
            >
              <button
                type="button"
                className="avtar avtar-xs btn-link-danger btn-pc-default"
                onClick={() => handleDelete(cellProps.row.original.id)}
              >
                <i className="ti ti-trash f-18"></i>
              </button>
            </li>
          </ul>
        ),
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

      <BreadcrumbItem mainTitle="Fotos" subTitle="Listado de fotos del evento" />
      <Row>
        <Col sm={12}>
          <Card className="table-card">
            <Card.Body>
              {loading && (
                <div className="text-center p-4">Cargando fotos...</div>
              )}

              {error && (
                <div className="alert alert-warning mx-sm-4 mb-0" role="alert">
                  {error}
                </div>
              )}

              {!loading && (
                <TableContainer
                  columns={columns}
                  data={photos}
                  isGlobalFilter={true}
                  isBordered={false}
                  customPageSize={50}
                  tableClass="table table-hover tbl-product datatable-table"
                  theadClass="table-light"
                  isPagination={true}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

PhotosListByToken.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default PhotosListByToken;

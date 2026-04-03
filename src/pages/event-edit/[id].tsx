import Layout from "@layout/index";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Event,
  UpdateEventPayload,
  GetEventTypesResponse,
} from "../../interfaces";
import {
  getEventById,
  getEvents,
  updateEventById,
} from "../../api/services/eventsService";
import { getEventTypes } from "../../api/services/eventTypesService";
import * as yup from "yup";

interface EventFormValues {
  name: string;
  description: string;
  key: string;
  eventType: string;
  honoreesNames: string;
  albumPhrase: string;
  venueName: string;
  serviceLocationUrl: string;
  serviceStartsAt: string;
  serviceEndsAt: string;
  delegateName: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre del evento es requerido"),
  description: yup.string().optional(),
  key: yup.string().required("La clave del evento es requerida"),
  eventType: yup.string().required("El tipo de evento es requerido"),
  honoreesNames: yup.string().required("Los nombres de los festejados son requeridos"),
  albumPhrase: yup.string().optional(),
  venueName: yup.string().required("El nombre del salon es requerido"),
  serviceLocationUrl: yup.string().url("Debe ser una URL valida").optional(),
  serviceStartsAt: yup.string().required("La fecha de inicio es requerida"),
  serviceEndsAt: yup.string().required("La fecha de fin es requerida"),
  delegateName: yup.string().optional(),
});

const toLocalDatetimeValue = (isoStr: string) => {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EventEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");
  const [eventTypes, setEventTypes] = useState<GetEventTypesResponse[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const formik = useFormik<EventFormValues>({
    initialValues: {
      name: "",
      description: "",
      key: "",
      eventType: "",
      honoreesNames: "",
      albumPhrase: "",
      venueName: "",
      serviceLocationUrl: "",
      serviceStartsAt: "",
      serviceEndsAt: "",
      delegateName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload: UpdateEventPayload = {
        name: values.name,
        description: values.description,
        key: values.key,
        eventTypeId: Number(values.eventType),
        honoreesNames: values.honoreesNames,
        albumPhrase: values.albumPhrase,
        venueName: values.venueName,
        serviceLocationUrl: values.serviceLocationUrl,
        serviceStartsAt: new Date(values.serviceStartsAt).toISOString(),
        serviceEndsAt: new Date(values.serviceEndsAt).toISOString(),
        delegateName: values.delegateName,
      };

      try {
        await updateEventById(Number(id), payload);
        setToastMessage("Evento actualizado exitosamente");
        setToastVariant("success");
        setShowToast(true);
      } catch (error: any) {
        console.error("Error updating event:", error);
        const msg =
          error?.response?.data?.message || "Error al actualizar el evento";
        setToastMessage(msg);
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchEvent = async () => {
        try {
          const event = await getEventById(Number(id));
          formik.setValues({
            name: event.name || "",
            description: event.description || "",
            key: event.key || "",
            eventType: String(event.eventTypeId || ""),
            honoreesNames: event.honoreesNames || "",
            albumPhrase: event.albumPhrase || "",
            venueName: event.venueName || "",
            serviceLocationUrl: event.serviceLocationUrl || "",
            serviceStartsAt: toLocalDatetimeValue(event.serviceStartsAt),
            serviceEndsAt: toLocalDatetimeValue(event.serviceEndsAt),
            delegateName: event.delegateName || "",
          });
          setSearchTerm(event.name || "");
        } catch (error) {
          console.error("Error fetching event:", error);
          setToastMessage("Error al cargar el evento");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, eventTypesRes] = await Promise.all([
          getEvents(),
          getEventTypes(),
        ]);
        setAllEvents(eventsRes);
        setEventTypes(eventTypesRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length < 2) return [];
    return allEvents
      .filter((e) => e.name?.toLowerCase().includes(term))
      .slice(0, 50);
  }, [allEvents, searchTerm]);

  const showSearchResults = searchTerm.trim().length >= 2;

  const handleSelectEvent = (event: Event) => {
    setSearchTerm("");
    router.push(`/event-edit/${event.id}`);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Eventos" subTitle="Editar evento" />

      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
        }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Exito" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </div>

      <Row>
        <Col sm={12}>
          <Card className="mb-3">
            <Card.Header>
              <h5>Buscar evento</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Buscar evento por nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Escriba el nombre del evento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {showSearchResults && searchResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
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
                    {searchResults.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
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
                        <strong>{event.name}</strong>
                        <br />
                        <small className="text-muted">
                          {eventTypes.find((et) => et.id === event.eventTypeId)?.name || "Sin tipo"} - {event.honoreesNames}
                        </small>
                      </div>
                    ))}
                  </div>
                )}

                {showSearchResults && searchResults.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 1000,
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "12px",
                      marginTop: "4px",
                      width: "100%",
                    }}
                  >
                    <small className="text-muted">
                      No se encontraron eventos con ese nombre
                    </small>
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5>Informacion del evento</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del evento</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre del evento"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("name")}
                        isInvalid={formik.touched.name && !!formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Clave del evento</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Clave del evento"
                        name="key"
                        value={formik.values.key}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("key")}
                        isInvalid={formik.touched.key && !!formik.errors.key}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.key}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de evento</Form.Label>
                      <Form.Select
                        name="eventType"
                        value={formik.values.eventType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("eventType")}
                        isInvalid={formik.touched.eventType && !!formik.errors.eventType}
                      >
                        <option value="">Seleccionar tipo...</option>
                        {eventTypes.map((et) => (
                          <option key={et.id} value={et.id}>
                            {et.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.eventType}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres de festejados</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombres de festejados"
                        name="honoreesNames"
                        value={formik.values.honoreesNames}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("honoreesNames")}
                        isInvalid={formik.touched.honoreesNames && !!formik.errors.honoreesNames}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.honoreesNames}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Descripcion del evento"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("description")}
                    isInvalid={formik.touched.description && !!formik.errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Frase del album</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Frase del album"
                    name="albumPhrase"
                    value={formik.values.albumPhrase}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("albumPhrase")}
                    isInvalid={formik.touched.albumPhrase && !!formik.errors.albumPhrase}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.albumPhrase}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del salon</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre del salon"
                        name="venueName"
                        value={formik.values.venueName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("venueName")}
                        isInvalid={formik.touched.venueName && !!formik.errors.venueName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.venueName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>URL de ubicacion</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="https://maps.app.goo.gl/..."
                        name="serviceLocationUrl"
                        value={formik.values.serviceLocationUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("serviceLocationUrl")}
                        isInvalid={formik.touched.serviceLocationUrl && !!formik.errors.serviceLocationUrl}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.serviceLocationUrl}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Inicio del servicio</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="serviceStartsAt"
                        value={formik.values.serviceStartsAt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("serviceStartsAt")}
                        isInvalid={formik.touched.serviceStartsAt && !!formik.errors.serviceStartsAt}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.serviceStartsAt}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fin del servicio</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="serviceEndsAt"
                        value={formik.values.serviceEndsAt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("serviceEndsAt")}
                        isInvalid={formik.touched.serviceEndsAt && !!formik.errors.serviceEndsAt}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.serviceEndsAt}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre del contacto/delegado</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Contacto principal del evento"
                    name="delegateName"
                    value={formik.values.delegateName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("delegateName")}
                    isInvalid={formik.touched.delegateName && !!formik.errors.delegateName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.delegateName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="btn-page w-100"
                >
                  Actualizar evento
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

EventEdit.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EventEdit;

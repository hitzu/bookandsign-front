import Layout from "@layout/index";
import React, { ReactElement, useEffect, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Contract,
  CreateEventPayload,
  GetEventTypesResponse,
} from "../interfaces";
import { createEvent } from "../api/services/eventsService";
import { getContracts } from "../api/services/contractService";
import { getEventTypes } from "../api/services/eventTypesService";
import * as yup from "yup";

interface EventFormValues {
  contractId: string;
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
  contractId: yup.string().required("El contrato es requerido"),
  name: yup.string().required("El nombre del evento es requerido"),
  description: yup.string().optional(),
  key: yup.string().required("La clave del evento es requerida"),
  eventType: yup.string().required("El tipo de evento es requerido"),
  honoreesNames: yup
    .string()
    .required("Los nombres de los festejados son requeridos"),
  albumPhrase: yup.string().optional(),
  venueName: yup.string().required("El nombre del salon es requerido"),
  serviceLocationUrl: yup.string().url("Debe ser una URL valida").optional(),
  serviceStartsAt: yup.string().required("La fecha de inicio es requerida"),
  serviceEndsAt: yup.string().required("La fecha de fin es requerida"),
  delegateName: yup.string().optional(),
});

const EventAdd = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success",
  );
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [eventTypes, setEventTypes] = useState<GetEventTypesResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractsRes, eventTypesRes] = await Promise.all([
          getContracts({ includeFinalized: false, excludeWithEvents: true }),
          getEventTypes(),
        ]);
        setContracts(contractsRes);
        setEventTypes(eventTypesRes);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik<EventFormValues>({
    initialValues: {
      contractId: "",
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
      const payload: CreateEventPayload = {
        contractId: Number(values.contractId),
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
        await createEvent(payload);
        setToastMessage("Evento creado exitosamente");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          formik.resetForm();
        }, 500);
      } catch (error: any) {
        console.error("Error creating event:", error);
        const msg =
          error?.response?.data?.message || "Error al crear el evento";
        setToastMessage(msg);
        setToastVariant("danger");
        setShowToast(true);
      }
    },
  });

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Eventos" subTitle="Agregar evento" />

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
          <Card>
            <Card.Header>
              <h5>Informacion del evento</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contrato</Form.Label>
                      <Form.Select
                        name="contractId"
                        value={formik.values.contractId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("contractId")}
                        isInvalid={
                          formik.touched.contractId &&
                          !!formik.errors.contractId
                        }
                      >
                        <option value="">Seleccionar contrato...</option>
                        {contracts.map((c) => (
                          <option key={c.id} value={c.id}>
                            #{c.id} - {c.clientName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.contractId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de evento</Form.Label>
                      <Form.Select
                        name="eventType"
                        value={formik.values.eventType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("eventType")}
                        isInvalid={
                          formik.touched.eventType && !!formik.errors.eventType
                        }
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
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del evento</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Sinai & Eduardo"
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
                        placeholder="Ej: 21-03-27"
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

                <Form.Group className="mb-3">
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ej: Nuestro para siempre comienza hoy"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("description")}
                    isInvalid={
                      formik.touched.description && !!formik.errors.description
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres de festejados</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Sinai y Eduardo"
                        name="honoreesNames"
                        value={formik.values.honoreesNames}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("honoreesNames")}
                        isInvalid={
                          formik.touched.honoreesNames &&
                          !!formik.errors.honoreesNames
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.honoreesNames}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Frase del album</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ej: Nuestro para siempre comienza hoy"
                        name="albumPhrase"
                        value={formik.values.albumPhrase}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("albumPhrase")}
                        isInvalid={
                          formik.touched.albumPhrase &&
                          !!formik.errors.albumPhrase
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.albumPhrase}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del salon</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre del salon o venue"
                        name="venueName"
                        value={formik.values.venueName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("venueName")}
                        isInvalid={
                          formik.touched.venueName && !!formik.errors.venueName
                        }
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
                        isInvalid={
                          formik.touched.serviceLocationUrl &&
                          !!formik.errors.serviceLocationUrl
                        }
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
                        isInvalid={
                          formik.touched.serviceStartsAt &&
                          !!formik.errors.serviceStartsAt
                        }
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
                        isInvalid={
                          formik.touched.serviceEndsAt &&
                          !!formik.errors.serviceEndsAt
                        }
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
                    isInvalid={
                      formik.touched.delegateName &&
                      !!formik.errors.delegateName
                    }
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
                  Crear evento
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

EventAdd.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default EventAdd;

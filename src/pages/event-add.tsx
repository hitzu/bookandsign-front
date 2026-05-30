import Layout from "@layout/index";
import React, { ReactElement, useEffect, useState } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import { Card, Col, Form, Row, Toast, Button } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Contract,
  CreateEventPayload,
  EventPrintTemplate,
  GetEventServiceTypesResponse,
  EventThemes,
  GetEventTypesResponse,
} from "../interfaces";
import { createEvent } from "../api/services/eventsService";
import { getContracts } from "../api/services/contractService";
import { getEventServiceTypes } from "../api/services/eventServiceTypesService";
import { getEventTypes } from "../api/services/eventTypesService";
import { getEventThemes } from "../api/services/eventThemesService";
import * as yup from "yup";

interface EventFormValues {
  contractId: string;
  key: string;
  eventType: string;
  serviceTypeId: string;
  eventThemeId: string;
  honoreesNames: string;
  albumPhrase: string;
  venueName: string;
  serviceLocationUrl: string;
  serviceStartsAt: string;
  serviceEndsAt: string;
  delegateName: string;
  photoCount: string;
  printTemplates: string;
}

const PHOTO_COUNT_OPTIONS = ["1", "2", "3", "4", "5"];

const parsePrintTemplates = (
  value: string,
): EventPrintTemplate[] | undefined => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return undefined;

  const parsedValue: unknown = JSON.parse(trimmedValue);

  if (!Array.isArray(parsedValue)) {
    throw new Error("Las plantillas deben ser un arreglo JSON");
  }

  return parsedValue.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`La plantilla #${index + 1} debe ser un objeto`);
    }

    const template = item as Record<string, unknown>;

    if (typeof template.type !== "string" || !template.type.trim()) {
      throw new Error(`La plantilla #${index + 1} requiere un campo "type"`);
    }

    if (typeof template.template !== "string" || !template.template.trim()) {
      throw new Error(
        `La plantilla #${index + 1} requiere un campo "template"`,
      );
    }

    if (template.icon != null && typeof template.icon !== "string") {
      throw new Error(`La plantilla #${index + 1} tiene un "icon" inválido`);
    }

    if (template.border != null && typeof template.border !== "string") {
      throw new Error(`La plantilla #${index + 1} tiene un "border" inválido`);
    }

    return {
      type: template.type.trim(),
      template: template.template.trim(),
      ...(typeof template.icon === "string" && template.icon.trim()
        ? { icon: template.icon.trim() }
        : {}),
      ...(typeof template.border === "string" && template.border.trim()
        ? { border: template.border.trim() }
        : {}),
    };
  });
};

const validationSchema = yup.object().shape({
  contractId: yup.string().required("El contrato es requerido"),
  key: yup.string().required("La clave del evento es requerida"),
  eventType: yup.string().required("El tipo de evento es requerido"),
  serviceTypeId: yup.string().required("El tipo de servicio es requerido"),
  eventThemeId: yup.string().optional(),
  honoreesNames: yup
    .string()
    .required("Los nombres de los festejados son requeridos"),
  albumPhrase: yup.string().optional(),
  venueName: yup.string().optional(),
  serviceLocationUrl: yup.string().url("Debe ser una URL valida").optional(),
  serviceStartsAt: yup.string().optional(),
  serviceEndsAt: yup.string().optional(),
  delegateName: yup.string().optional(),
  photoCount: yup.number().integer().min(1).max(5).optional(),
  printTemplates: yup
    .string()
    .test(
      "valid-print-templates",
      "Las plantillas deben ser un JSON válido",
      (value) => {
        if (!value?.trim()) return true;

        try {
          parsePrintTemplates(value);
          return true;
        } catch {
          return false;
        }
      },
    ),
});

const EventAdd = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success",
  );
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [eventTypes, setEventTypes] = useState<GetEventTypesResponse[]>([]);
  const [eventServiceTypes, setEventServiceTypes] = useState<
    GetEventServiceTypesResponse[]
  >([]);
  const [eventThemes, setEventThemes] = useState<EventThemes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          contractsRes,
          eventTypesRes,
          eventServiceTypesRes,
          eventThemesRes,
        ] = await Promise.all([
          getContracts({ includeFinalized: false, excludeWithEvents: true }),
          getEventTypes(),
          getEventServiceTypes(),
          getEventThemes(),
        ]);
        setContracts(contractsRes);
        setEventTypes(eventTypesRes);
        setEventServiceTypes(eventServiceTypesRes);
        setEventThemes(eventThemesRes);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const formik = useFormik<EventFormValues>({
    initialValues: {
      contractId: "",
      key: "",
      eventType: "",
      serviceTypeId: "",
      eventThemeId: "",
      honoreesNames: "",
      albumPhrase: "",
      venueName: "",
      serviceLocationUrl: "",
      serviceStartsAt: "",
      serviceEndsAt: "",
      delegateName: "",
      photoCount: "2",
      printTemplates: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload: CreateEventPayload = {
          contractId: Number(values.contractId),
          key: values.key,
          eventTypeId: Number(values.eventType),
          serviceTypeId: Number(values.serviceTypeId),
          ...(values.eventThemeId
            ? { eventThemeId: Number(values.eventThemeId) }
            : {}),
          honoreesNames: values.honoreesNames,
          albumPhrase: values.albumPhrase,
          ...(values.venueName.trim() ? { venueName: values.venueName } : {}),
          ...(values.serviceLocationUrl.trim()
            ? { serviceLocationUrl: values.serviceLocationUrl }
            : {}),
          ...(values.serviceStartsAt
            ? {
                serviceStartsAt: new Date(
                  values.serviceStartsAt,
                ).toISOString(),
              }
            : {}),
          ...(values.serviceEndsAt
            ? { serviceEndsAt: new Date(values.serviceEndsAt).toISOString() }
            : {}),
          ...(values.delegateName.trim()
            ? { delegateName: values.delegateName }
            : {}),
          ...(values.photoCount
            ? { photoCount: Number(values.photoCount) }
            : {}),
          ...(values.printTemplates.trim()
            ? { printTemplates: parsePrintTemplates(values.printTemplates) }
            : {}),
        };

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
          error instanceof SyntaxError
            ? "Las plantillas deben ser un JSON válido"
            : error?.response?.data?.message || "Error al crear el evento";
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
                            #{c.sku} - {c.clientName}
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
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de servicio</Form.Label>
                      <Form.Select
                        name="serviceTypeId"
                        value={formik.values.serviceTypeId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("serviceTypeId")}
                        isInvalid={
                          formik.touched.serviceTypeId &&
                          !!formik.errors.serviceTypeId
                        }
                      >
                        <option value="">Seleccionar tipo de servicio...</option>
                        {eventServiceTypes.map((serviceType) => (
                          <option key={serviceType.id} value={serviceType.id}>
                            {serviceType.name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.serviceTypeId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tema del evento</Form.Label>
                      <Form.Select
                        name="eventThemeId"
                        value={formik.values.eventThemeId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("eventThemeId")}
                      >
                        <option value="">Sin tema...</option>
                        {eventThemes.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de fotos</Form.Label>
                      <Form.Select
                        name="photoCount"
                        value={formik.values.photoCount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur("photoCount")}
                        isInvalid={
                          formik.touched.photoCount &&
                          !!formik.errors.photoCount
                        }
                      >
                        {PHOTO_COUNT_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.photoCount}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Clave del evento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: 20"
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
                  <Form.Label>Plantillas de impresión (JSON)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder='[{"type":"polaroid","template":"polaroid_rc_2","icon":"rings","border":"led"}]'
                    name="printTemplates"
                    value={formik.values.printTemplates}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur("printTemplates")}
                    isInvalid={
                      formik.touched.printTemplates &&
                      !!formik.errors.printTemplates
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.printTemplates}
                  </Form.Control.Feedback>
                </Form.Group>

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

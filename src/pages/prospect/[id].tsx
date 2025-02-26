import { useRouter } from 'next/router';
import { useEffect, ReactElement, useState } from 'react';
import { GetProspectsResponse } from '../../interfaces';
import { getProspectById, updateProspectById } from '../../api/services/prospectsService';
import { getEventTypes } from '../../api/services/eventTypesService';
import { getContactMethods } from '../../api/services/contactMethodsService';
import Layout from "@layout/index";
import { Button, Card, CardBody, CardHeader, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

const ProspectPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [prospect, setProspect] = useState<GetProspectsResponse | null>(null);
  const [eventTypes, setEventTypes] = useState<{ value: number; label: string }[]>([]);
  const [contactMethods, setContactMethods] = useState<{ value: number; label: string }[]>([]);
  const [disableEditing, setDisableEditing] = useState(true);

  const customStyles = {
    control: (base: any) => ({
        ...base,
        backgroundColor: "#1F2937",
        borderColor: "#374151", 
        color: "#E5E7EB", 
        fontSize: "0.875rem", 
        padding: "4px", 
        boxShadow: "none", 
        "&:hover": {
          borderColor: "#0cbdff",
        },
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#1F2937",
        color: "#E5E7EB",
    }),
    option: (base: any, { isFocused }: any) => ({
        ...base,
        backgroundColor: isFocused
          ? "#3B82F6"
          : "transparent",
      }),
    singleValue: (base: any) => ({
        ...base,
        color: "#E5E7EB",
        
    }),
    };

  useEffect(() => {
    if (id) {
      const fetchProspect = async () => {
        try {
          const response = await getProspectById(Number(id));
          setProspect(response);
          console.log(response);
        } catch (error) {
          console.error('Error fetching prospect:', error);
        }
      };

      const fetchEventTypes = async () => {
        try {
          const response = await getEventTypes();
          const eventTypesList = response.map(event => ({
            value: event.id,
            label: event.name
          }));
          setEventTypes(eventTypesList);
        } catch (error) {
          console.error('Error fetching event types:', error);
        }
      };

      const fetchContactMethods = async () => {
        try {
          const response = await getContactMethods();
          const contactMethodsList = response.map(event => ({
            value: event.id,
            label: event.method
          }));
          setContactMethods(contactMethodsList);
        } catch (error) {
          console.error('Error fetching event types:', error);
        }
      };

      fetchProspect();
      fetchEventTypes();
      fetchContactMethods();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (!prospect) return; 
    const { name, value } = e.target; 
    setProspect(prevState => prevState ? { ...prevState, [name]: value } : null);
   };

   const handleSelectChange = (fieldName: string, selectedOption: { value: number; } | null) => {
    setProspect(prospect ? {
        ...prospect,
        [fieldName]: selectedOption ? selectedOption.value : null,
      } : null);
    };

    const handleEditButton = () => { 
        setDisableEditing(!disableEditing);
    };
    
    const handleUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const payload = { 
            "firstName": prospect?.firstName,
            "lastName": prospect?.lastName,
            "email": prospect?.email,
            "phoneCountryCode": prospect?.phoneCountryCode,
            "phoneNumber": prospect?.phoneNumber,
            "contactMethodId": prospect?.contactMethodId,
            "eventTypeId": prospect?.contactMethodId,
            "address": prospect?.address,
            "city": prospect?.city,
            "budget": prospect?.budget,
            "eventDate": prospect?.eventDate,
            };
            console.log({ payload })
            await updateProspectById(Number(id), payload);
        } catch (err: any) {
            console.log({ err })
        }
    };

  if (!prospect) {
    return <div>Loading...</div>;
  }

  return (
      <Row>
          <div className="col-12">
              <Card>
                  <CardHeader>
                    <Row className="justify-content-between align-items-center mb-3 g-3">
                        <Col sm="auto">
                            <h4 className="mb-0">Información del prospecto</h4>
                        </Col>
                        <Col sm="auto">
                            <Button variant="light" className="btn btn-light-secondary btn-search"
                                onClick={handleEditButton}>
                                <i className="fas fa-user-edit me-2 fs-5"></i>
                                {disableEditing ? "Editar prospecto" : "Cancelar edición"}
                            </Button>
                        </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleUpdate}>
                        <Row>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Nombre</label>
                                  <Form.Control 
                                    type="text"
                                    name="firstName"
                                    placeholder="Nombre"
                                    value={prospect?.firstName || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Apellido</label>
                                  <Form.Control 
                                    type="text"
                                    name="lastName"
                                    placeholder="Apellido"
                                    value={prospect?.lastName || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Correo electrónico</label>
                                  <Form.Control 
                                    type="text"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={prospect?.email || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={2}>
                              <div className="mb-3">
                                  <label className="form-label">Código</label>
                                  <Form.Control 
                                    type="text"
                                    name="phoneCountryCode"
                                    placeholder="Código de país"
                                    value={prospect?.phoneCountryCode || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={4}>
                              <div className="mb-3">
                              <label className="form-label">Teléfono</label>
                              <Form.Control 
                                    type="number"
                                    name="phoneNumber"
                                    placeholder="Teléfono"
                                    value={prospect?.phoneNumber || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                />
                              </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Método de Contacto</label>
                                  <Select
                                    options={contactMethods}
                                    id="contactMethod"
                                    name="contactMethod"
                                    value={contactMethods.find(option => option.value === prospect.contactMethodId) || null}
                                    onChange={(selectedOption) => handleSelectChange("contactMethodId", selectedOption)}
                                    styles={customStyles}
                                    isDisabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Tipo de Evento</label>
                                  <Select
                                    options={eventTypes}
                                    id="eventType"
                                    name="eventType"
                                    value={eventTypes.find(option => option.value === prospect.eventTypeId) || null}
                                    onChange={(selectedOption) => handleSelectChange("eventTypeId", selectedOption)}
                                    styles={customStyles}
                                    isDisabled={disableEditing}
                                />
                              </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Dirección</label>
                                  <Form.Control 
                                    type="text"
                                    name="address"
                                    placeholder="Dirección"
                                    value={prospect?.address || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Ciudad</label>
                                  <Form.Control 
                                    type="text"
                                    name="city"
                                    placeholder="Ciudad"
                                    value={prospect?.city || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Presupuesto</label>
                                  <Form.Control 
                                    type="number"
                                    name="budget"
                                    placeholder="Presupuesto"
                                    value={prospect?.budget || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Fecha del evento</label>
                                  <input 
                                    type="date"
                                    name="eventDate"
                                    value={prospect?.eventDate || ""}
                                    onChange={handleChange}
                                    disabled={disableEditing}
                                    className="form-control"
                                  />
                              </div>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md={12} className="text-end">
                              <button className="btn btn-primary" disabled={disableEditing}>
                                Actualizar prospecto
                              </button>
                          </Col>
                        </Row>
                    </Form>
                  </CardBody>
              </Card>
          </div>
      </Row>
)
};

ProspectPage.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default ProspectPage;


import { useRouter } from 'next/router';
import { useEffect, ReactElement, useState } from 'react';
import { GetProspectsResponse } from '../../interfaces';
import { getProspectById } from '../../api/services/prospectsService';
import { getEventTypes } from '../../api/services/eventTypesService';
import { getContactMethods } from '../../api/services/contactMethodsService';
import Layout from "@layout/index";
import { Card, CardBody, CardHeader, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

const ProspectPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [prospect, setProspect] = useState<GetProspectsResponse | null>(null);
  const [eventTypes, setEventTypes] = useState<{ value: number; label: string }[]>([]);
  const [contactMethods, setContactMethods] = useState<{ value: number; label: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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
          console.log(eventTypesList);
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
          console.log(contactMethodsList);
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
    console.log({ e })
    setProspect({ ...prospect, [e.target.name]: e.target.value }); 
   };

   const handleSelectChange = (fieldName: string, selectedOption: { value: number; } | null) => {
    console.log({ selectedOption });
    setProspect(prospect ? {
        ...prospect,
        [fieldName]: selectedOption ? selectedOption.value : null,
      } : null);
  };

  const handleUpdate = async (event: React.FormEvent) => {
        
    };

  if (!prospect) {
    return <div>Loading...</div>;
  }

  return (
      <Row>
          <div className="col-12">
              <Card>
                  <CardHeader>
                      <h5 className="mb-0">Informacion del prospecto</h5>
                  </CardHeader>
                  <CardBody>
                    <Form onSubmit={handleUpdate}>
                        <Row>
                          <Col md={6}>
                          {isEditing}
                              <div className="mb-3">
                                  <label className="form-label">Nombre</label>
                                  <Form.Control 
                                    type="text"
                                    placeholder="Nombre"
                                    value={prospect?.firstName || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Apellido</label>
                                  <Form.Control 
                                    type="text"
                                    placeholder="Apellido"
                                    value={prospect?.lastName || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
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
                                    placeholder="Correo electrónico"
                                    value={prospect?.email || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={2}>
                              <div className="mb-3">
                                  <label className="form-label">Código</label>
                                  <Form.Control 
                                    type="text"
                                    placeholder="Código de país"
                                    value={prospect?.phoneCountryCode || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={4}>
                              <div className="mb-3">
                              <label className="form-label">Teléfono</label>
                              <Form.Control 
                                    type="number"
                                    placeholder="Teléfono"
                                    value={prospect?.phoneNumber || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
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
                                    placeholder="Dirección"
                                    value={prospect?.address || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Ciudad</label>
                                  <Form.Control 
                                    type="text"
                                    placeholder="Ciudad"
                                    value={prospect?.city || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
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
                                    placeholder="Presupuesto"
                                    value={prospect?.budget || ""}
                                    onChange={handleChange}
                                    disabled={isEditing}
                                  />
                              </div>
                          </Col>
                          <Col md={6}>
                              <div className="mb-3">
                                  <label className="form-label">Fecha del evento</label>
                                  <input type="date" className="form-control" />
                              </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} className="text-end">
                              <button className="btn btn-primary">Submit</button>
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


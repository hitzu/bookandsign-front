import React, { useState, ComponentType } from "react";
import { Card, Col, Form } from "react-bootstrap";
import CleaveOriginal from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.in";

// Type assertion to fix React 18 compatibility
const Cleave = CleaveOriginal as ComponentType<any>;

const InputMaskData = () => {
  const [date, setDate] = useState<string>("");
  const [date1, setDate1] = useState<string>("");

  return (
    <React.Fragment>
      <Col md={12}>
        <Card>
          <Card.Header>
            <h5>Date</h5>
            <span className="d-block m-t-5">
              Add class of <code>.date</code> with <code>data-mark</code>{" "}
              attribute
            </span>
          </Card.Header>
          <Card.Body>
            <Form>
              <div className="form-group row mb-3">
                <Form.Label column lg={3} sm={12} className="text-lg-end">
                  Insert Date 1
                </Form.Label>
                <Col lg={6} md={12} sm={12}>
                  <Cleave
                    options={{
                      date: true,
                      delimiter: "/",
                      datePattern: ["d", "m", "Y"],
                    }}
                    value={date}
                    onChange={(e: any) => setDate(e.target.rawValue)}
                    className="form-control"
                  />
                </Col>
              </div>
              <div className="form-group row">
                <Form.Label column lg={3} sm={12} className="text-lg-end">
                  Insert Date 2
                </Form.Label>
                <Col lg={6} md={12} sm={12}>
                  <Cleave
                    options={{
                      date: true,
                      delimiter: "-",
                      datePattern: ["d", "m", "Y"],
                    }}
                    value={date1}
                    onChange={(e: any) => setDate1(e.target.rawValue)}
                    className="form-control"
                  />
                </Col>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default InputMaskData;

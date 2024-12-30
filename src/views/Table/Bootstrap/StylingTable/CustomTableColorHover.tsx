import React from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';

const CustomTableColor = () => {
  return (
    <React.Fragment>
    <Card>
      <CardHeader>
        <h5>Custom Table Color with Hover and Stripped</h5>
        <span className="d-block m-t-5">use class <code>table-*</code> inside table element</span>
      </CardHeader>
      <CardBody className="table-border-style">
        <div className="table-responsive">
          <table className="table table-styling table-hover table-striped table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
    </React.Fragment>
  );
};

export default CustomTableColor;

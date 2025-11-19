import React, { useEffect, useState, ReactElement } from "react";
import BreadcrumbItem from "@common/BreadcrumbItem";
import Layout from "@layout/index";
import { Row, Card, CardBody, CardHeader, Form } from "react-bootstrap";
import Link from "next/link";
// import { getProspectsByUser } from '../api/services/prospectsService';
import { GetProspectsResponse } from "../interfaces";

const Index = () => {
  const [prospects, setProspects] = useState<GetProspectsResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  //   useEffect(() => {
  //     const getProspects = async () => {
  // 			const userProspects = await getProspectsByUser();
  // 			console.log(userProspects)
  // 			setProspects(userProspects);
  // 		};
  //     getProspects();
  //   }, []);

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset page to 1 when search query changes
  };

  const handleEntriesPerPageChange = (e: any) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset page to 1 when entries per page changes
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = prospects.filter((item) =>
    item.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <React.Fragment>
      <BreadcrumbItem mainTitle="Lista de prospectos" />
      <Row>
        <div className="col-12">
          <Card className="table-card">
            <CardHeader>
              <h5>Prospectos</h5>
            </CardHeader>
            <div className="d-sm-flex align-items-center mt-4">
              <ul className="list-inline me-auto my-1 ms-4">
                <li className="list-inline-item">
                  <select
                    className="form-select"
                    onChange={handleEntriesPerPageChange}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                  </select>
                </li>
                <span> entries per page</span>
              </ul>
              <ul className="list-inline ms-auto my-1 me-4">
                <li className="list-inline-item">
                  <form className="form-search" style={{ marginLeft: "23px" }}>
                    <Form.Control
                      type="search"
                      placeholder="Search...."
                      onChange={handleSearchChange}
                    />
                  </form>
                </li>
              </ul>
            </div>
            <CardBody className="pt-3">
              <div className="table-responsive">
                <table className="table table-hover" id="pc-dt-simple">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Telefono</th>
                      <th>Email</th>
                      <th>Tipo de evento</th>
                      <th>Fecha del evento</th>
                      <th>Presupuesto</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map((item: any, index: number) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.firstName} {item.lastName}
                            </Link>
                          </td>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.phoneCountryCode} {item.phoneNumber}
                            </Link>
                          </td>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.email}
                            </Link>
                          </td>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.eventType.name}
                            </Link>
                          </td>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.eventDate}
                            </Link>
                          </td>
                          <td>
                            <Link href={`/prospect/${item.id}`} passHref>
                              {item.budget}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`/prospect/${item.id}`}
                              className="avtar avtar-xs btn-link-secondary"
                            >
                              <i className="ti ti-edit f-20"></i>
                            </Link>
                            <Link
                              href={`/prospect/${item.id}`}
                              className="avtar avtar-xs btn-link-secondary"
                            >
                              <i className="ti ti-trash f-20"></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <nav>
                <ul className="pagination justify-content-end me-3 mt-2">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button className="page-link" onClick={goToPreviousPage}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button className="page-link" onClick={goToNextPage}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </CardBody>
          </Card>
        </div>
      </Row>
    </React.Fragment>
  );
};

Index.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default Index;

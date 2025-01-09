import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useState } from "react";
import Link from "next/link";
import ApiService from "../utils/ApiService"; 
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const Loginv2 = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
          const payload = { email, password };
          const response = await ApiService.post("/auth/login", payload); // Cambia el endpoint según tu API
    
          // Manejar la respuesta exitosa
          console.log("Login successful:", response);
    
          // Guardar token y redirigir
          if (response.token) {
            localStorage.setItem("token", response.token);
            window.location.href = "/dashboard"; // Cambia la ruta según tu aplicación
          }
        } catch (err) {
          console.error("Error during login:", err);
          setError("Invalid email or password. Please try again.");
        }
      };

    return (
          <div className="auth-main v2">
              {/* <div className="bg-overlay bg-dark"></div> */}
              <div className="auth-wrapper">
                  <div className="auth-form">
                      <div className="card my-5 mx-3">
                          <div className="card-body">
                              <h4 className="f-w-500 mb-1">Login with your email</h4>
                              <p className="mb-3">Don't have an Account? <a href="register" className="link-primary ms-1">Create Account</a></p>
                              <Form onSubmit={handleLogin}>
                                    <div className="form-group mb-3">
                                        <Form.Control 
                                            type="email" 
                                            className="form-control" 
                                            id="floatingInput" 
                                            placeholder="Email Address" 
                                            aria-describedby="emailHelp"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <Form.Control 
                                            type="password" 
                                            className="form-control" 
                                            id="floatingInput1" 
                                            placeholder="Password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="d-grid mt-4">
                                        <Button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            >Login</Button>
                                    </div>
                              </Form>
                              <div className="saprator my-3">
                                  <span>Or continue with</span>
                              </div>
                              <div className="text-center">
                                  <ul className="list-inline mx-auto mt-3 mb-0">
                                      {/* <li className="list-inline-item">
                                          <Link href="https://www.facebook.com/" className="avtar avtar-s rounded-circle bg-facebook" target="_blank">
                                              <i className="fab fa-facebook-f text-white"></i>
                                          </Link>
                                      </li>
                                      <li className="list-inline-item">
                                          <Link href="https://twitter.com/" className="avtar avtar-s rounded-circle bg-twitter" target="_blank">
                                              <i className="fab fa-twitter text-white"></i>
                                          </Link>
                                      </li> */}
                                      <li className="list-inline-item">
                                          <Link href="https://myaccount.google.com/" className="avtar avtar-s rounded-circle bg-googleplus" target="_blank">
                                              <i className="fab fa-google text-white"></i>
                                          </Link>
                                      </li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
    );
}


Loginv2.getLayout = (page: ReactElement) => {
    return (
        <NonLayout>
            {page}
        </NonLayout>
    )
};
export default Loginv2;
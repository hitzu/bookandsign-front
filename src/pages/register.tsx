import NonLayout from "@layout/NonLayout";
import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

// img
import logodark from "@assets/images/logo-dark.svg";

const Registerv2 = () => {
    return (
        <div className="auth-main v2">
            {/* <div className="bg-overlay bg-dark"></div> */}
            <div className="auth-wrapper">
                <div className="auth-form">
                    <Card className="my-5 mx-3">
                        <Card.Body>
                            <h4 className="f-w-500 mb-1">Register with your email</h4>
                            <p className="mb-3">Already have an Account? <Link href="login" className="link-primary">Log in</Link></p>
                            <div className="form-group mb-3">
                                <Form.Control type="text" placeholder="First Name" />
                            </div>
                            <div className="form-group mb-3">
                                <Form.Control type="text" placeholder="Last Name" />
                            </div>
                            <div className="form-group mb-3">
                                <Form.Control type="email" placeholder="Email Address" />
                            </div>
                            <div className="form-group mb-3">
                                <Form.Control type="password" placeholder="Password" />
                            </div>
                            <div className="form-group mb-3">
                                <Form.Control type="password" placeholder="Confirm Password" />
                            </div>
                            {/* <div className="d-flex mt-1 justify-content-between">
                                <div className="form-check">
                                    <input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked />
                                    <label className="form-check-label text-muted" htmlFor="customCheckc1">I agree to all the Terms & Condition</label>
                                </div>
                            </div> */}
                            <div className="d-grid mt-4">
                                <button type="button" className="btn btn-primary">Create Account</button>
                            </div>
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
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

Registerv2.getLayout = (page: ReactElement) => {
    return (
        <NonLayout>
            {page}
        </NonLayout>
    )
};

export default Registerv2;
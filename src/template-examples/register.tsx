import React, { useState, ReactElement } from "react";
import NonLayout from "@layout/NonLayout";
import Link from "next/link";
import { Card, Form } from "react-bootstrap";
import { register } from "../api/services/authService";
import { useRouter } from 'next/router';

const Registerv2 = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    const checkForm = () => {
        const isAnyFieldEmpty = Object.values({ name, lastName, email, password, passwordConfirm }).some(
            (field) => !field.trim()
          );
          if (isAnyFieldEmpty) {
            setError("All fields are required");
            setShowToast(true);
            return false;
          }
        if(password != passwordConfirm){
            setError("Passwords do not match")
            setShowToast(true);
            return false;
        }
        return true;
    }

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
          const payload = { name, lastName, email, password };
          const validForm = checkForm();
          if(validForm){
            const response = await register(payload);
            localStorage.setItem("authToken", response.data.accessToken);
            router.replace('/');
            }
        } catch (err: any) {
          setError(`${JSON.stringify((err.response?.data?.message) || 'Invalid email or password. Please try again.')}`.replace(/['"]+/g, ''));
          setShowToast(true);
        }
    };

    return (
        <div className="auth-main v2">
            {/* <div className="bg-overlay bg-dark"></div> */}
            <div className="auth-wrapper">
                <div className="auth-form">
                    <Card className="my-5 mx-3">
                        <Card.Body>
                            <h4 className="f-w-500 mb-1">Register with your email</h4>
                            <p className="mb-3">Already have an Account? <Link href="login" className="link-primary">Log in</Link></p>
                            <Form onSubmit={handleRegister}>
                                <div className="form-group mb-3">
                                    <Form.Control 
                                        type="text"
                                        placeholder="First Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <Form.Control type="text" 
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <Form.Control type="email" 
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <Form.Control type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <Form.Control type="password" 
                                        placeholder="Confirm Password"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                    />
                                </div>
                                {/* <div className="d-flex mt-1 justify-content-between">
                                    <div className="form-check">
                                        <input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked />
                                        <label className="form-check-label text-muted" htmlFor="customCheckc1">I agree to all the Terms & Condition</label>
                                    </div>
                                </div> */}
                                {/* Toast */}
                                <div className="d-grid mt-4 text-center">
                                    <div className={`toast-container w-100`} >
                                        <div className={`toast ${showToast ? 'show' : ''} w-100`} 
                                            role="alert" 
                                            aria-live="assertive" 
                                            aria-atomic="true"
                                        >
                                            <div className="toast-header bg-danger text-white">
                                                <strong className="me-auto">Error</strong>
                                                <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
                                            </div>
                                            <div className="toast-body">
                                                {error}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-primary">Create Account</button>
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
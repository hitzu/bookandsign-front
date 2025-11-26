import NonLayout from "@layout/NonLayout";
import React, { ReactElement, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { login } from "../api/services/authService";
import { useRouter } from "next/router";
import { UserInfo } from "../interfaces";
import { useAuthStore } from "../stores/authStore";

const Loginv2 = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { setUserInfo } = useAuthStore();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = { email, password };
      const authInfo = await login(payload);
      const { accessToken, refreshToken } = authInfo.data.accessAndRefreshToken;
      if (!accessToken || !refreshToken) {
        throw new Error("Invalid access token or refresh token");
      }
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUserInfo(authInfo.data.userInfo as UserInfo);
      router.replace("/");
    } catch (err: any) {
      setError(
        `${JSON.stringify(
          err.response?.data?.message ||
            "Invalid email or password. Please try again."
        )}`.replace(/['"]+/g, "")
      );
      setShowToast(true);
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
                {/* Toast */}
                <div className="d-grid mt-4 text-center">
                  <div className={`toast-container w-100`}>
                    <div
                      className={`toast ${showToast ? "show" : ""} w-100`}
                      role="alert"
                      aria-live="assertive"
                      aria-atomic="true"
                    >
                      <div className="toast-header bg-danger text-white">
                        <strong className="me-auto">Error</strong>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowToast(false)}
                        ></button>
                      </div>
                      <div className="toast-body">{error}</div>
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <Button type="submit" className="btn btn-primary">
                    Login
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Loginv2.getLayout = (page: ReactElement) => {
  return <NonLayout>{page}</NonLayout>;
};
export default Loginv2;

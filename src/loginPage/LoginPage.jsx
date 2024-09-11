import React, { useState, useRef } from "react";
import "./LoginPage.scss";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { InputOtp } from "primereact/inputotp";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import api from "../axiosInceptor/api";

export default function LoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  console.log(isValidEmail);

  const toast = useRef(null);

  const loginRequest = async () => {
    setSpinner(true);
    try {
      const response = await api.post(
        "/linkup/login",
        {
          email: email,
          password: password,
        },
        {}
      );
      Cookies.set('access_Token', response.data.accessToken);
      Cookies.set('refresh_Token', response.data.refreshToken);
      localStorage.setItem('userEmail', response.data.person.email);
      localStorage.setItem('personId', response.data.person.personId);
      // localStorage.setItem('profile', response.data.person?.profileImg);
      // console.log(response.data);
      
      setTimeout(() => {
        navigate("/linkup");
      },2000)
    } catch (error) {
      console.error("Error during login:", error);
      toast.current.show({
        severity: "warn",
        summary: "Invalid email or password",
        detail: "Please enter a valid email address and password",
      });
      setSpinner(false)
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (validateEmail(email)) setIsValidEmail(true);
  };

  const validateEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username)) return true;
    else return false;
  };

  const handleLogin = () => {
    if (!isValidEmail) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
      });
    } else if (!email && !password) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "Please enter email and password.",
      });
    } else {
      loginRequest();
    }
  };

  return (
    <>
      <div className="login-page-main">
        <Toast ref={toast} />
        <div className="login-page-container">
          <div className="login-page-container-part1">
            <div className="lp-c-p1-title">Link Up</div>
            <div className="lp-c-p1-content">
              Create your profile and start building your connections
            </div>
          </div>
          <div className="login-page-container-part2">
            <div className="lp-c-p2-form">
              <div className="form-section">
                <InputText
                  className="form-inputs"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div className="form-section">
                <Password
                  className="form-inputs"
                  toggleMask
                  feedback={false}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-section">
                <Button
                  className="form-button"
                  style={{ backgroundColor: "#0866ff", width: "100%" }}
                  onClick={handleLogin}
                >
                  {!spinner ? (
                    <span>Login</span>
                  ) : (
                    <ProgressSpinner
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "white",
                      }}
                      strokeWidth="8"
                      fill="#0866ff"
                      strokec
                      className="verify-spinner"
                      color="white"
                    />
                  )}
                </Button>
              </div>
              <div
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </div>
              <div className="form-section">
                <Button
                  className="form-button"
                  style={{ backgroundColor: "#42b72a", width: "60%" }}
                  onClick={() => navigate("/sign-up")}
                >
                  <span>Create New Account</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

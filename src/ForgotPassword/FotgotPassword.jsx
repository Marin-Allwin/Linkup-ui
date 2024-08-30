import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { InputOtp } from "primereact/inputotp";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import { Dialog } from "primereact/dialog";
import axios from "axios";
import api from "../axiosInceptor/api";

export default function FotgotPassword() {
  const [forgotEmail, setForgotEmail] = useState();
  const [token, setTokens] = useState();
  const [showOtp, setShwOtp] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPasword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const navigate = useNavigate();
  const toast = useRef(null);

  const isAccountExist = async () => {
    try {
      const response = await api.post(
        `/linkup/find-account?email=${forgotEmail}`,
        {},
        {}
      );

      toast.current.show({
        severity: "success",
        summary: "Account Found",
        detail: "Otp send to the email address",
      });
      //   setForgotEmail("");
      setTimeout(() => {
        setShwOtp(true);
      }, 3000);
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Account not Exist",
        detail: "Account does not exit create new Account",
      });
    }
  };

  const handlefindAccount = () => {
    if (!isValidEmail) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
      });
    } else {
      isAccountExist();
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/linkup/verify-account`,
        {
          email: forgotEmail,
          otp: token,
        },
        {}
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Otp Verified Successfully",
      });

      setTimeout(() => {
        setShowPasswordChange(true);
        setShwOtp(false);
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Otp",
        detail: "Invalid otp please try again",
      });
    }
  };

  const changePassword = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/linkup/change-password`,
        {
          email: forgotEmail,
          newPasword: newPasword,
        },
        {}
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
      });

      setTimeout(() => {
        navigate("/");
      }, 400);
    } catch (error) {
      toast.current.show({
        severity: "info",
        summary: "Something went wrong",
        detail: "Something went wrong please try agin later",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPasword != confirmPassword) {
      toast.current.show({
        severity: "warn",
        summary: "Password not match",
        detail: "Check the password tou have entered",
      });
    } else {
      changePassword();
    }
  };

  const handleForgotEmail = (e) => {
    setForgotEmail(e.target.value);
    if (validateEmail(forgotEmail)) setIsValidEmail(true);
    else setIsValidEmail(false);
  };

  const validateEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username)) return true;
    else return false;
  };

  return (
    <>
      <div className="forgot-password-main">
        <Toast ref={toast} />

        <div className="forgot-password-container">
          {!showPasswordChange ? (
            <div className="forgot-dialoge">
              <div className="forgot-dialoge-title">
                Enter your email to find your Account
              </div>
              <div className="find-section">
                <InputText
                  value={forgotEmail}
                  className="find-email"
                  onChange={handleForgotEmail}
                />
                {forgotEmail && (
                  <span onClick={handlefindAccount}>
                    <i
                      className="pi pi-search"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="new-password-container">
              <div className="new-password-section">
                <Password
                  feedback={false}
                  placeholder="New Password"
                  value={newPasword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  toggleMask
                />
              </div>
              <div className="new-password-section">
                <Password
                  feedback={false}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  toggleMask
                />
              </div>
              <div className="new-password-section">
                <Button
                  className="change-password"
                  label="Change Password"
                  onClick={handleChangePassword}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog
        header="Enter the Otp to verify your Acount"
        className="dialoge-forgot"
        visible={showOtp}
        style={{ width: "25vw" }}
        onHide={() => {
          if (!showOtp) return;
          setShwOtp(false);
        }}
        draggable={false}
      >
        <div className="forgot-otp">
          <InputOtp
            value={token}
            onChange={(e) => setTokens(e.value)}
            integerOnly
            length={6}
          />
        </div>
        {token && (
          <div className="verify-button-container">
            <Button
              label="Verify"
              className="m-3"
              onClick={() => verifyOtp()}
            />
          </div>
        )}
      </Dialog>
    </>
  );
}

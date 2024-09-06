import React from "react";
import "./SignUp.scss";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../axiosInceptor/api";

export default function SignUp() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [firstName, setFirstName] = useState();
  const [lastName, SetLastName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const toast = useRef(null);

  const navigate = useNavigate();

  const genderOption = [
    { name: "Male", code: "Male" },
    { name: "Female", code: "Female" },
  ];

  console.log(gender);

  const SignUp = async () => {
    try {
      const response = await api.post(
        "/linkup/sign-up",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          dob: dob,
          gender: gender,
        },
        {}
      );
      document.cookie = `access_Token=${response.data.accessToken}`;
      document.cookie = `refresh_Token=${response.data.refreshToken}`;
      document.cookie = `person=${response.data.person}`;
      localStorage.setItem('userEmail', response.data.person.email);
      localStorage.setItem('profile', response.data.person?.profileImg);

      console.log(response.data);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Signup successfully",
      });

      setTimeout(() => {
        navigate("/linkup");
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "Email already exist try to login",
      });
    }
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    validateEmail(email);
  };

  const validateEmail = (username) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(username));
  };

  const handleSignUp = () => {
    if (!isValidEmail) {
      toast.current.show({
        severity: "warn",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
      });
    } else if (
      !firstName &&
      !lastName &&
      !email &&
      !password &&
      !dob &&
      !gender
    ) {
      toast.current.show({
        severity: "info",
        summary: "Info",
        detail: "Please fill all the fields",
      });
    } else {
      SignUp();
    }
  };

  const handleISTChange = (date) => {
    const utcDate = new Date(date);

    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);

    return istDate;
  };

  return (
    <div className="sign-up-main">
      <Toast ref={toast} />
      <div className="sign-up-container">
        <div className="container-one">
          <div className="sup-c-p1-title">Join Link Up Today!</div>
          <div className="sup-c-p1-content">
            Create your profile and start building your connections Share, chat,
            and stay updated.
          </div>
        </div>
        <div className="container-two">
          <div className="signup-form">
            <div className="double-content">
              <InputText
                placeholder="Firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <InputText
                placeholder="Lastname"
                value={lastName}
                onChange={(e) => SetLastName(e.target.value)}
              />
            </div>
            <div className="single-content">
              <InputText
                placeholder="Enter your email"
                value={email}
                onChange={handleEmail}
              />
            </div>
            <div className="single-content">
              <Password
                toggleMask
                feedback={false}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="double-content">
              <Calendar
                dateFormat="dd/mm/yy"
                placeholder="Date of birth"
                value={dob}
                onChange={(e) => setDob(handleISTChange(e.target.value))}
              />
              <Dropdown
                value={gender}
                onChange={(e) => setGender(e.value.name)}
                options={genderOption}
                optionLabel="name"
                placeholder={gender ? gender : "select gender"}
              />
            </div>
            <div className="single-content">
              <Button
                label="Submit"
                className="signup-button"
                onClick={handleSignUp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

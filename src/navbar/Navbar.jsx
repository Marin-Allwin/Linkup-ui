import React, { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import profileImg from "../assets/profileImg.jpg";
import { useUserContext } from "../contextFolder/UserProvider ";
import { Image } from "primereact/image";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import api from "../axiosInceptor/api";
import logo from "../assets/Black And White Illustrated Eagle Logo (7).png"

export default function Navbar() {
  const navigate = useNavigate();
  const Bearer = Cookies.get("access_Token");
  const { userData, setUserData } = useUserContext();
  const { refresh, setRefresh } = useUserContext();

  console.log(refresh);
  const menuRight = useRef(null);
  const items = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        navigate("/profile");
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => handleLogOut(),
    },
  ];

  const returnImage = (data) => {
    if (data === undefined) {
      return profileImg;
    } else return `data:image/png;base64,${data}`;
  };

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    api
      .get(`/user/get-person?email=${email}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [refresh]);

  const handleLogOut = () => {
    console.log("logout");
    api
      .post(
        `/user/logout?email=${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Bearer}`,
          },
        }
      )
      .then(() => {
        localStorage.removeItem("userEmail");
        Cookies.remove("access_Token");
        Cookies.remove("refresh_Token");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="navbar-main">
      <div className="navbar-sec-one">
        <div className="title">
          <img className="linkup-logo" src={logo}/>
          Linkup
        </div>
        <div className="navbar-search">
          <IconField>
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText v-model="value1" placeholder="Search" />
          </IconField>
        </div>
      </div>
      <div className="navbar-sec-two">
        <div className="navbar-sec-two-container">
          <div
            className="navbar-sec-two-items"
            onClick={() => navigate("/linkup")}
          >
            <i className="pi pi-home"></i>
          </div>
          <div
            className="navbar-sec-two-items"
            onClick={() => navigate("/people")}
          >
            <i className="pi pi-user"></i>
          </div>
          <div className="navbar-sec-two-items">
            <i className="pi pi-youtube"></i>
          </div>
          <div className="navbar-sec-two-items">
            <i className="pi pi-users"></i>
          </div>
        </div>
      </div>
      <div className="navbar-sec-three">
        <div className="nav-sec-three-container">
          <div className="navbar-sec-three-items">
            <FontAwesomeIcon icon={faMessage} className="nav-sec-three-icons" onClick={()=>navigate("/chat")}/>
          </div>
          <div className="navbar-sec-three-items">
            <FontAwesomeIcon icon={faBell} className="nav-sec-three-icons" />
          </div>
          <div className="navbar-sec-three-items">
            <div
              className="nav-profile"
              onClick={(event) => menuRight.current.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
            >
              {userData?.profileImg ? (
                <img
                  src={`${`data:image/jpeg;base64,${userData?.profileImg}`}`}
                  className="profile-pic-nav"
                />
              ) : (
                <i className="pi pi-user profile-icon"></i>
              )}
            </div>
            <Menu
              model={items}
              popup
              ref={menuRight}
              id="popup_menu_right"
              popupAlignment="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

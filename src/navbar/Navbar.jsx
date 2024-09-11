import React, { useEffect, useRef, useState } from "react";
import "./Navbar.scss";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage } from "@fortawesome/free-regular-svg-icons";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import profileImg from "../assets/profileImg.jpg";
import { useUserContext } from "../contextFolder/UserProvider ";
import { Image } from "primereact/image";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import api from "../axiosInceptor/api";
import logo from "../assets/Black And White Illustrated Eagle Logo (7).png";
import { Badge } from "primereact/badge";
import LandingPage from "../landingpage/LandingPage";

export default function Navbar() {
  const navigate = useNavigate();
  const Bearer = Cookies.get("access_Token");
  const { userData, setUserData, setAllPost } = useUserContext();
  const {
    refresh,
    setRefresh,
    landingPageNotification,
    setLandingPageNotification,
    peopleNotificatoin,
    setPeopleNotification,
    stompClient,
    isConnected,
    bellNotification,
    setBellNotification,
  } = useUserContext();
  const location = useLocation();

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
  const personId = localStorage.getItem("personId");

  useEffect(() => {
    if (isConnected == true) {
      stompClient.subscribe(`/user/${email}/queue/notifications`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          // alert(notification.message);
          console.log("Received private notification:", notification);
          setPeopleNotification((x) => x + 1);
        } catch (e) {
          console.error("Failed to parse notification message:", e);
        }
      });

      stompClient.subscribe("/public/posts", (message) => {
        const newPost = JSON.parse(message.body);
        setAllPost((prevPosts) => [newPost, ...prevPosts]);
        setLandingPageNotification((x) => x + 1);
      });

      stompClient.subscribe(
        `/user/${email}/queue/acceptNotification`,
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            // alert(notification.message);
            console.log("Received private notification:", notification);
            bellNotification((x) => x + 1);
          } catch (e) {
            console.error("Failed to parse notification message:", e);
          }
        }
      );
    }
  }, [stompClient, isConnected]);

  useEffect(() => {
    api
      .get(`/user/get-person?personId=${personId}`, {
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
          <img className="linkup-logo" src={logo} />
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
            onClick={() => {
              if (location.pathname === "/linkup") {
                document
                  .getElementById("new-post-section")
                  ?.scrollIntoView({ behavior: "smooth" });
                setLandingPageNotification(0);
              } else {
                navigate("/linkup");
              }
            }}
          >
            <i className="pi pi-home">
              {landingPageNotification > 0 && (
                <Badge
                  value={landingPageNotification}
                  className="badge"
                ></Badge>
              )}
            </i>
          </div>
          <div
            className="navbar-sec-two-items"
            // onClick={() => navigate("/people")}
            onClick={() => {
              if (location.pathname === "/people") {
                document
                  .getElementById("request-container")
                  ?.scrollIntoView({ behavior: "smooth" });
                setPeopleNotification(0);
              } else {
                navigate("/people");
                setPeopleNotification(0);
              }
            }}
          >
            <i className="pi pi-user">
              {peopleNotificatoin > 0 && (
                <Badge value={peopleNotificatoin} className="badge"></Badge>
              )}
            </i>
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
            <FontAwesomeIcon
              icon={faMessage}
              className="nav-sec-three-icons"
              onClick={() => navigate("/chat")}
            ></FontAwesomeIcon>
          </div>
          <div className="navbar-sec-three-items">
            <FontAwesomeIcon icon={faBell} className="nav-sec-three-icons">
              {bellNotification > 0 && (
                <Badge
                  value={bellNotification}
                  className="badge"
                ></Badge>
              )}
            </FontAwesomeIcon>
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

import React, { useEffect, useState } from "react";
import "./People.scss";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import axios from "axios";
import Cookies from "js-cookie";
import { Divider } from "primereact/divider";
import profile from "../assets/profile2.jpg";
import { Outlet, useNavigate } from "react-router-dom";

export default function People() {
  const [tabMenu, setTabMenu] = useState("find");
  const [findFriends, setFindFriends] = useState([]);
  const email = localStorage.getItem("userEmail");
  const Bearer = Cookies.get("access_Token");

  const navigate = useNavigate();

  console.log(findFriends);

  const items = [
    {
      label: "MyFriend",
      command: () => {
        setTabMenu("myfriends");
      },
    },
    {
      label: "Requests",
      command: () => {
        setTabMenu("requests");
      },
    },
    {
      label: "Find Friends",
      command: () => {
        setTabMenu("find");
      },
    },
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/get-all-user?email=${email}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setFindFriends(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleProfileClick = (person) => {
    navigate(`/people/${person.firstName}-${person.lastName}`, {
      state: { email: person.email },
    });
  };

  return (
    <>
      <div className="people-main">
        <div className="people-container-overall">
          <TabMenu model={items} />
          {tabMenu === "requests" && (
            <div className="people-container ">
              <div className="request-container">
                <div className="request-container-part-one">
                  <div className="request-img">
                    <img></img>
                  </div>
                </div>
                <div className="request-container-part-two">
                  <div>Name</div>
                  <div>Bio</div>
                </div>
                <div className="request-container-part-three">
                  <Button label="Accept" severity="info" />
                  <Button label="Delete" severity="danger" />
                </div>
              </div>
            </div>
          )}
          {tabMenu === "find" && (
            <div className="find-container">
              {findFriends.map((person) => (
                <>
                  <div className="find-people ">
                    <div
                      className="find-people-image"
                      onClick={() => handleProfileClick(person)}
                    >
                      {person?.profile != null ? (
                        <img
                          src={`${`data:image/jpeg;base64,${person?.profile}`}`}
                          className="find-people-profile"
                        />
                      ) : (
                        <img src={profile} className="find-people-profile" />
                      )}
                    </div>
                    <div
                      className="find-people-about"
                      onClick={() => handleProfileClick(person)}
                    >
                      <div className="find-people-name">
                        {person?.firstName + " " + person?.lastName}
                      </div>
                      <div className="find-people-bio">{person?.bio}</div>
                    </div>
                    <div className="find-people-action">
                      <Button label="Add friend" severity="info" />
                    </div>
                  </div>
                  <Divider />
                </>
              ))}
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}

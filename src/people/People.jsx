import React, { useEffect, useState } from "react";
import "./People.scss";
import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import axios from "axios";
import Cookies from "js-cookie";
import { Divider } from "primereact/divider";
import profile from "../assets/profile2.jpg";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../axiosInceptor/api";
import { useUserContext } from "../contextFolder/UserProvider ";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import WebSocketComponent from "../websocket/WebSocketComponent";

export default function People() {
  const [tabMenu, setTabMenu] = useState("requests");
  const [findFriends, setFindFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const email = localStorage.getItem("userEmail");
  const Bearer = Cookies.get("access_Token");
  const [fetchData, setFetchData] = useState(true);

  const {
    userData,
    setUserData,
    isConnected,
    stompClient,
    peopleNotificatoin,
    setPeopleNotification,
  } = useUserContext();

  console.log(isConnected);
  console.log("this is request " + requests);

  const navigate = useNavigate();

  console.log(findFriends);
  console.log(requests);

  const items = [
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
    {
      label: "MyFriend",
      command: () => {
        setTabMenu("myfriends");
      },
    },
  ];

  useEffect(() => {
    api
      .get(`/user/get-all-user?email=${email}`, {
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
  }, [fetchData]);

  useEffect(() => {
    api
      .get(`/user/request-received?email=${email}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setRequests(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchData]);

  useEffect(() => {
    api
      .get(`/user/get-my-friends?email=${email}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setMyFriends(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchData]);

  const handleAddFriend = (to) => {
    console.log(email);
    console.log(to);
    api
      .post(`/user/send-request/${email}`, null, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
        params: {
          to: to,
        },
      })
      .then((response) => {
        console.log(response);
        setFetchData((x) => !x);
      })
      .catch((error) => console.log(error));
  };

  const handleCancelFriend = (to) => {
    console.log(email);
    console.log(to);
    api
      .post(`/user/delete-send-request/${email}`, null, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
        params: {
          to: to,
        },
      })
      .then((response) => {
        console.log(response);
        setFetchData((x) => !x);
      })
      .catch((error) => console.log(error));
  };

  const handleAcceptRequest = (friend) => {
    api
      .post(`/user/accept-request/${email}`, null, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
        params: {
          from: friend,
        },
      })
      .then((response) => {
        console.log(response);
        setFetchData((x) => !x);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleterequest = (person) => {
    api
      .post(`/user/decline-request/${email}`, null, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
        params: {
          who: person,
        },
      })
      .then((response) => {
        console.log(response);
        setFetchData((x) => !x);
      })
      .catch((error) => console.log(error));
  };

  const handleProfileClick = (person) => {
    navigate(`/people/${person.firstName}-${person.lastName}`, {
      state: { personId: person.personId },
    });
  };

  return (
    <>
      <div className="people-main">
        <div className="people-container-overall">
          <TabMenu model={items} />


          {tabMenu === "requests" && (
            <div className="people-container">
              {requests && requests.length > 0 ? (
                requests.map((person) => (
                  <div key={person.email}>
                    {" "}
                    {/* Add a unique key for each item */}
                    <div className="request-container">
                      <div className="request-container-part-one">
                        <div className="request-img">
                          {person?.profile ? (
                            <img
                              src={`data:image/jpeg;base64,${person.profile}`}
                              alt="Profile"
                              className="find-people-profile"
                            />
                          ) : (
                            <img
                              src={profile}
                              alt="Default Profile"
                              className="find-people-profile"
                            />
                          )}
                        </div>
                      </div>
                      <div className="request-container-part-two">
                        <div className="find-people-name">
                          {`${person.firstName} ${person.lastName}`}
                        </div>
                        <div className="find-people-bio">{person.bio}</div>
                      </div>
                      <div className="request-container-part-three">
                        <Button
                          label="Accept"
                          severity="info"
                          onClick={() => handleAcceptRequest(person.email)}
                        />
                        <Button
                          label="Delete"
                          severity="danger"
                          onClick={() => handleDeleterequest(person.email)}
                        />
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))
              ) : (
                <div className="no-request">You don't have any requests</div>
              )}
            </div>
          )}

          {tabMenu === "find" && (
            <div className="find-container">
              {findFriends.length > 0 &&
                findFriends?.map((person) => (
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
                        {person.friendshipStatus != "sent" ? (
                          <Button
                            label="Add friend"
                            severity="info"
                            onClick={() => handleAddFriend(person?.email)}
                          />
                        ) : (
                          <Button
                            label="cancel"
                            severity="danger"
                            className="cancel-send"
                            onClick={() => handleCancelFriend(person?.email)}
                          />
                        )}
                      </div>
                    </div>
                    <Divider />
                  </>
                ))}
            </div>
          )}
          {tabMenu === "myfriends" && (
            <div className="my-friends-container">
              {myFriends.length > 0 ?
                myFriends?.map((friend) => (
                  <>
                    <div className="friends-container">
                      <div className="friends-container-part-one">
                        <div className="friends-img">
                          {friend?.profile != null ? (
                            <img
                              src={`${`data:image/jpeg;base64,${friend?.profile}`}`}
                              className="friends-profile"
                            />
                          ) : (
                            <img src={profile} className="friends-profile" />
                          )}
                        </div>
                      </div>
                      <div className="friends-container-part-two">
                        <div className="friends-people-name">
                          {friend?.firstName + " " + friend?.lastName}
                        </div>
                        <div className="friends-people-bio">{friend?.bio}</div>
                      </div>
                      <div className="friends-container-part-three"></div>
                    </div>
                    <Divider />
                  </>
                )) : <div className="no-friends">Let's find some friends</div>}
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}

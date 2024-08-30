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
  const [tabMenu, setTabMenu] = useState("myfriends");
  const [findFriends, setFindFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const email = localStorage.getItem("userEmail");
  const Bearer = Cookies.get("access_Token");
  const { userData, setUserData } = useUserContext();
  const [fetchData, setFetchData] = useState(true);

  const navigate = useNavigate();

  console.log(findFriends);
  console.log(requests);

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
        console.log(response.da);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fetchData]);

  // useEffect(() => {
  //   const fetchRequests = () => {
  //     api
  //       .get(`/user/request-received?email=${email}`, {
  //         headers: {
  //           Authorization: `Bearer ${Bearer}`,
  //         },
  //       })
  //       .then((response) => {
  //         setRequests(response.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   fetchRequests();  // Fetch requests initially

  //   const client = new Client({
  //     brokerURL: "ws://localhost:8080/ws",
  //     reconnectDelay: 5000,
  //     webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  //     onConnect: () => {
  //       console.log("Connected to WebSocket");

  //       // Subscribe to the user's notifications
  //       client.subscribe(`/topic/notifications/${email}`, () => {
  //         // Re-fetch requests when a notification is received
  //         fetchRequests();
  //       });
  //     },
  //   });

  //   client.activate();

  //   return () => {
  //     client.deactivate();
  //   };
  // }, [email, Bearer]);

  useEffect(() => {
    api
      .get(`/user/get-my-friends?email=${email}`, {
        headers: {
          Authorization: `Bearer ${Bearer}`,
        },
      })
      .then((response) => {
        setMyFriends(response.data);
        console.log(response.da);
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
      state: { email: person.email },
    });
  };

  return (
    <>
      <WebSocketComponent />

      <div className="people-main">
        <div className="people-container-overall">
          <TabMenu model={items} />

          {tabMenu === "myfriends" && (
            <div className="my-friends-container">
              {myFriends &&
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
                ))}
            </div>
          )}
          {tabMenu === "requests" && (
            <div className="people-container ">
              {requests &&
                requests?.map((person) => (
                  <>
                    <div className="request-container">
                      <div className="request-container-part-one">
                        <div className="request-img">
                          {person?.profile != null ? (
                            <img
                              src={`${`data:image/jpeg;base64,${person?.profile}`}`}
                              className="find-people-profile"
                            />
                          ) : (
                            <img
                              src={profile}
                              className="find-people-profile"
                            />
                          )}
                        </div>
                      </div>
                      <div className="request-container-part-two">
                        <div className="find-people-name">
                          {person.firstName + " " + person.lastName}
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
                  </>
                ))}
            </div>
          )}
          {tabMenu === "find" && (
            <div className="find-container">
              {findFriends &&
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
        </div>
      </div>
      <Outlet />
    </>
  );
}

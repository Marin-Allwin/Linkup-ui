import React, { createContext, useContext, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [showAddPost, SetShowAddPost] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [landingPageNotification, setLandingPageNotification] = useState(0);
  const [peopleNotificatoin, setPeopleNotification] = useState(0);
  const [bellNotification, setBellNotification] = useState();
  const [allPost, setAllPost] = useState([]);
  const [tabMenu, setTabMenu] = useState("requests");
  const email = localStorage.getItem("userEmail");
  const Bearer = Cookies.get("access_Token");

  console.log("this is email :" + email);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${Bearer}`,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  // useEffect(() => {
  //   const client = new Client({
  //     brokerURL: "ws://localhost:8080/ws",
  //     reconnectDelay: 5000,
  //     webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  //     connectHeaders: {
  //       Authorization: `Bearer ${Bearer}`,
  //     },
  //     onConnect: () => {
  //       console.log("Connected to WebSocket");
  //       setIsConnected(true);
  //     },
  //     onStompError: (frame) => {
  //       console.error("Broker error:", frame.headers["message"]);
  //       setIsConnected(false);
  //     },
  //   });

  //   client.activate();
  //   setStompClient(client);

  //   // Cleanup on unmount
  //   return () => {
  //     client.deactivate();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isConnected && email !== null) {
  //     console.log("Inside function: " + email);

  //     const subscription = stompClient.subscribe(`/user/${email}/queue/notifications`, (message) => {
  //       console.log("Received message: " + message.body); // Log the message
  //       try {
  //         const notification = JSON.parse(message.body);
  //         alert(notification.message); // Show an alert with the notification message
  //         console.log("Received private notification:", notification); // Log the notification
  //       } catch (e) {
  //         console.error("Failed to parse notification message:", e); // Log any JSON parsing errors
  //       }
  //     });

  //     // Cleanup subscription on unmount
  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   } else {
  //     console.log("Connection not established or email is null");
  //   }
  // }, [isConnected, email]); // Add dependencies to trigger the effect

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        refresh,
        setRefresh,
        showAddPost,
        SetShowAddPost,
        stompClient,
        isConnected,
        landingPageNotification,
        setLandingPageNotification,
        showComments,
        setShowComments,
        peopleNotificatoin,
        setPeopleNotification,
        allPost,
        setAllPost,
        bellNotification,
        setBellNotification,
        tabMenu,
        setTabMenu,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);

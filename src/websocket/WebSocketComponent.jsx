// // import React, { useEffect } from "react";
// // import { Client } from "@stomp/stompjs";
// // import SockJS from "sockjs-client";
// // import { useUserContext } from "../contextFolder/UserProvider ";

// // function WebSocketComponent() {

// //   const { userData, setUserData } = useUserContext();

// //   useEffect(() => {
// //     const client = new Client({
// //       brokerURL: "ws://localhost:8080/ws",
// //       reconnectDelay: 5000,
// //       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
// //       onConnect: () => {
// //         console.log("Connected to WebSocket");

// //         client.subscribe("/topic/messages", (message) => {
// //           console.log("Message from server:", message.body);
// //         });

// //         client.subscribe(`/topic/friend-requests/${userData?.email}`, (message) => {
// //           console.log("Friend request received:", message.body);
// //           alert("friend request from" ,message.body)
// //         });

// //         client.publish({
// //           destination: "/app/hello",
// //           body: JSON.stringify({ message: "Hello, Server!" }),
// //         });
// //       },
// //       onStompError: (frame) => {
// //         console.error("Broker error:", frame.headers["message"]);
// //       },
// //     });

// //     client.activate();

// //     return () => {
// //       client.deactivate();
// //     };
// //   }, []);

// //   return <div></div>;
// // }

// // export default WebSocketComponent;

// import React, { useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useUserContext } from "../contextFolder/UserProvider ";
// import { Button } from "primereact/button";

// function WebSocketComponent() {
//   const [requests, setRequests] = useState([]);
//   const { userData, setUserData } = useUserContext();
//   const [stompClient, setStompClient] = useState(null);


//   useEffect(() => {
//      const client = new Client({
//       brokerURL: "ws://localhost:8080/ws",
//       reconnectDelay: 5000,
//       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//       onConnect: () => {
//         console.log("Connected to WebSocket");
//         client.subscribe("/public/notifications", (message) => {
//           console.log("Received notification: " + message.body);
//         });

//         client.subscribe("/user/queue/notifications", (message) => {
//           const notification = JSON.parse(message.body);
//           // alert(notification);
//           console.log("Received private notification:", notification);
//         });
//       },
//       onStompError: (frame) => {
//         console.error("Broker error:", frame.headers["message"]);
//       },
//     });

//     setStompClient(client);

//     client.activate();

//     return () => {
//       client.deactivate();
//     };
//   }, []);



//   const sendNotification = (user, message) => {
//     if (stompClient && stompClient.connected) {
//       stompClient.publish({
//         destination: "/app/send-notification",
//         headers: {
//           user: user,
//         },
//         body: message,
//       });
//     } else {
//       console.log("Stomp client is not connected.");
//     }
//   };

//   return (
//     <div>

//       <button
//         onClick={() =>
//           sendNotification("marin.allwin@althisolutions.com", "Hello, this is a notification!")
//         }
//       >
//         Send Private Notification
//       </button>
//     </div>
//   );
// }

// export default {WebSocketComponent};

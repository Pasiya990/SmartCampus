import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (email, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: () => {},
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Connected to WebSocket");

      // 🔥 subscribe to user-specific notifications
      stompClient.subscribe(`/topic/notifications/${email}`, (message) => {
        if (message.body) {
          onMessageReceived(message.body);
        }
      });
    },
  });

  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};
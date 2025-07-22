// WebSocketContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribersRef = useRef([]);
  const isDisconnectingRef = useRef(false); // Adiciona este ref

  const initializeWebSocket = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.active) {
      return; // WebSocket já está conectado
    }

    const socketUrl = "https://higiprohomol.hmbm.org.br/ws";
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      debug: (str) => console.log(str),
      reconnectDelay: 2000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket conectado com sucesso");
        setIsConnected(true);
        stompClient.subscribe("/topic/changes", (message) => {
          console.log("Mensagem recebida:", message.body);
          // Notifique todos os assinantes
          subscribersRef.current.forEach((callback) => callback(message));
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: () => {
        console.log("WebSocket desconectado");
        setIsConnected(false);
        if (!isDisconnectingRef.current) {
          console.log("Tentando reconectar...");
          // O STOMP client lidará com a reconexão baseada no reconnectDelay
        }
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  }, []);

  const disconnectWebSocket = useCallback(async () => {
    if (stompClientRef.current && stompClientRef.current.active) {
      console.log("Desconectando o WebSocket...");
      isDisconnectingRef.current = true;
      stompClientRef.current.reconnectDelay = 0; // Evita reconexão
      await stompClientRef.current.deactivate();
      isDisconnectingRef.current = false;
    }
  }, []);

  const addSubscriber = useCallback((callback) => {
    subscribersRef.current.push(callback);
  }, []);

  const removeSubscriber = useCallback((callback) => {
    subscribersRef.current = subscribersRef.current.filter(
      (sub) => sub !== callback
    );
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        initializeWebSocket,
        disconnectWebSocket,
        isConnected,
        addSubscriber,
        removeSubscriber,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

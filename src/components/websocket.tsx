import React, { useEffect, useState } from "react";

interface WebSocketProps {
  onMessage: (message: any) => void; // Função para tratar mensagens recebidas
  children?: (sendMessage: (message: any) => void) => React.ReactNode;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ onMessage, children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/connect");

    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensagem recebida do servidor:", data);
      onMessage(data); // Chama a função passada via props para tratar a mensagem
    };

    ws.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket encerrada.");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [onMessage]);

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      console.log("Mensagem enviada ao servidor:", message);
    } else {
      console.error("WebSocket não está conectado.");
    }
  };

  return <>{children && children(sendMessage)}</>;
};

export default WebSocketComponent;

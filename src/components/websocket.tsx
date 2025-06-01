import React, { useEffect, useState } from "react";

interface WebSocketProps {
  onMessage: (message: any) => void; // Função para tratar mensagens recebidas
  children?: (sendMessage: (message: any) => void) => React.ReactNode;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ onMessage, children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://batalha-bk-production.up.railway.app/ws/connect");

    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida.");
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("📦 Mensagem JSON recebida do servidor:", parsed);
        onMessage(parsed); // you can handle the JSON result here
      } catch (err) {
        console.log("💬 Mensagem simples recebida do servidor:", event.data);
        // Optional: handle plain strings if needed
      }
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
      socket.send(JSON.stringify('{"action": "get_game_info","game_id": 1,"player_id": 1}'));
      console.log("Mensagem enviada ao servidor:", message);
    } else {
      console.error("WebSocket não está conectado.");
    }
  };

  return <>{children && children(sendMessage)}</>;
};

export default WebSocketComponent;

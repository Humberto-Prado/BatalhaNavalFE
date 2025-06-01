import React, { useEffect, useState } from "react";

interface WebSocketProps {
  onMessage: (message: any) => void;
  children?: (sendMessage: (message: any) => void) => React.ReactNode;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ onMessage, children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://batalha-bk-production.up.railway.app/ws/connect");

    ws.onopen = () => {
      console.log("✅ WebSocket conectado.");
    };

    ws.onmessage = (event) => {
      console.log("🧾 RAW:", event.data);

      try {
        const data = JSON.parse(event.data);
        console.log("📦 JSON:", data);
        onMessage(data);
      } catch {
        console.log("💬 Texto:", event.data);
        if (event.data.includes("Welcome")) {
          const msg = { action: "get_game_info", game_id: 1, player_id: 1 };
          ws.send(JSON.stringify(msg));
          console.log("📤 Enviado:", msg);
        }
      }
    };

    ws.onerror = (error) => {
      console.error("❗ Erro WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("❌ Conexão encerrada.");
    };

    window.addEventListener("beforeunload", () => {
      ws.close();
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [onMessage]);

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      console.log("📤 Enviado pelo usuário:", message);
    } else {
      console.error("⚠️ WebSocket não está conectado.");
    }
  };

  return <>{children && children(sendMessage)}</>;
};

export default WebSocketComponent;

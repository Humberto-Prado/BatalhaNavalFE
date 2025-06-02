import React, { useEffect, useRef, useState } from "react";

interface WebSocketProps {
  onMessage: (message: any) => void;
  children?: (sendMessage: (message: any) => void) => React.ReactNode;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ onMessage, children }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [sendMessageFn, setSendMessageFn] = useState<(message: any) => void>(() => () => {
    console.warn("⚠️ WebSocket não está pronto ainda.");
  });

  useEffect(() => {
    //const ws = new WebSocket("wss://batalha-bk-production.up.railway.app/ws/connect");
    const ws = new WebSocket("ws://localhost:8000/ws/connect");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket conectado.");
      setSendMessageFn(() => (message: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
          console.log("📤 Enviado pelo usuário:", message);
        } else {
          console.warn("⚠️ WebSocket não está pronto.");
        }
      });
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
      console.warn("🔌 WebSocket desconectado.");
    };

    const cleanup = () => {
      ws.close();
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [onMessage]);

  return <>{children && children(sendMessageFn)}</>;
};

export default WebSocketComponent;

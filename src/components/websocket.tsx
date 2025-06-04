import React, { useEffect, useRef, useState } from "react";

interface WebSocketProps {
    children: (sendMessage: (message: any) => void, message: any) => React.ReactNode;
}

const WebSocketComponent: React.FC<WebSocketProps> = ({ children }) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [message, setMessage] = useState<any>(null);
    const [sendMessageFn, setSendMessageFn] = useState<(message: any) => void>(() => () => {
        console.warn("⚠️ WebSocket não está pronto ainda.");
    });

    useEffect(() => {
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
                setMessage(data);
            } catch {
                console.log("💬 Texto:", event.data);

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
    }, []);

    return <>{children(sendMessageFn, message)}</>;
};

export default WebSocketComponent;

import React, { useState } from "react";
import WebSocketComponent from "./websocket"; // Adjust import path if needed
import Styles from "./battleGrid.module.css";

interface DeployedCoordinate {
  row: string;
  col: number;
}

const BattleGrid: React.FC = () => {
  const rows: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
  const columns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);
  const [playerDeployed, setPlayerDeployed] = useState<DeployedCoordinate[]>([]);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(null);
  const [hoveredGrid, setHoveredGrid] = useState<"grid-user" | "grid-player" | null>(null);

  // Handle messages received from the WebSocket
  const handleWebSocketMessage = (data: any) => {
    console.log("Mensagem recebida do servidor:", data);
  };

  return (
    <WebSocketComponent onMessage={handleWebSocketMessage}>
      {(sendMessage) => (
        <>
          <div>
            <h1>Batalha Naval</h1>
          </div>

          {/* Grid do usuário */}
          <div id={Styles["grid-user"]}>
            {rows.map((row) =>
              columns.map((col) => {
                const buttonId = `${row}${col}`;

                return (
                  <button
                    key={buttonId}
                    className={Styles.cels}
                    onClick={() => {
                      setUserDeployed((prev) => [...prev, { row, col }]);
                      sendMessage({
                        action: "place_ship_click",
                        player: "user",
                        position: { row, col },
                      });
                    }}
                    onMouseEnter={() => {
                      setHoveredCoordinate(buttonId);
                      setHoveredGrid("grid-user");
                    }}
                    onMouseLeave={() => {
                      setHoveredCoordinate(null);
                      setHoveredGrid(null);
                    }}
                  >
                    {userDeployed.some((d) => d.row === row && d.col === col) && (
                      <span className={Styles.alert}>X</span>
                    )}
                    {hoveredCoordinate === buttonId && hoveredGrid === "grid-user" && (
                      <span className={Styles.alert}>{buttonId}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Grid do jogador */}
          <div id={Styles["grid-player"]}>
            {rows.map((row) =>
              columns.map((col) => {
                const buttonId = `${row}${col}`;

                return (
                  <button
                    key={buttonId}
                    className={Styles.cels}
                    onClick={() => {
                      setPlayerDeployed((prev) => [...prev, { row, col }]);
                      sendMessage({
                        action: "shoot",
                        player: "user",
                        target: { row, col },
                      });
                    }}
                    onMouseEnter={() => {
                      setHoveredCoordinate(buttonId);
                      setHoveredGrid("grid-player");
                    }}
                    onMouseLeave={() => {
                      setHoveredCoordinate(null);
                      setHoveredGrid(null);
                    }}
                  >
                    {playerDeployed.some((d) => d.row === row && d.col === col) && (
                      <span className={Styles.alert}>X</span>
                    )}
                    {hoveredCoordinate === buttonId && hoveredGrid === "grid-player" && (
                      <span className={Styles.alert}>{buttonId}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </WebSocketComponent>
  );
};

export default BattleGrid;

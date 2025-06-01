
import React, { useState } from "react";
import Styles from "./battleGrid.module.css";
import WebSocketComponent from "./websocket";

interface DeployedCoordinate {
  row: string;
  col: number;
}

const BattleGrid: React.FC = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
  const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Estados para armazenar as coordenadas clicadas de cada grid
  const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);
  const [playerDeployed, setPlayerDeployed] = useState<DeployedCoordinate[]>([]);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(null);
  const [hoveredGrid, setHoveredGrid] = useState<"grid-user" | "grid-player" | null>(null);

  // Função para lidar com cliques nos botões
  const onClick = (row: string, col: number, grid: "grid-user" | "grid-player"): void => {
    const coordId = `${row}${col}${grid}`;
    const position = grid === "grid-user" ? " (Usuário)" : " (Jogador)";
    // Envia a mensagem para o servidor WebSocket
    console.log(`Enviando coordenada: ${coordId}${position}`);
    

    if (grid === "grid-user") {
        setUserDeployed((prevDeployed) => [...prevDeployed, { row, col }]);
      } else if (grid === "grid-player") {
        setPlayerDeployed((prevDeployed) => [...prevDeployed, { row, col }]);
      }
  };

  const handleMessage = (data: any) => {
    console.log("📬 Resposta do servidor:", data);
  };

  return (
    <WebSocketComponent onMessage={handleMessage}>
      {() => (
        <>
          <div id={Styles["grid-user"]}>
            {rows.map((row) =>
              columns.map((col) => {
                const buttonId = `${row}${col}`;
                const isSelected = userDeployed.some((d) => d.row === row && d.col === col);
                return (
                  <button
                    id={buttonId}
                    className={Styles.cels}
                    onClick={() => onClick(row, col, "grid-player")}
                    onMouseEnter={() => {
                      setHoveredCoordinate(buttonId);
                      setHoveredGrid("grid-player");
                    }}
                    onMouseLeave={() => {
                      setHoveredCoordinate(null);
                      setHoveredGrid(null);
                    }}
                  >
                    {isSelected && <span className={Styles.alert}>X</span>}
                    {userDeployed.some((deploy) => deploy.row === row && deploy.col === col) && (
                      <span className={Styles.alert}> X </span>
                    )}
                    {hoveredCoordinate === buttonId && hoveredGrid === "grid-player" && (
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

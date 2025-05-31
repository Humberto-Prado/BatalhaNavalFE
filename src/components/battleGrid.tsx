import React, { useEffect, useState } from "react";
import Styles from "./battleGrid.module.css";

interface DeployedCoordinate {
  row: string;
  col: number;
}

const BattleGrid: React.FC = () => {
  const rows: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
  const columns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Estados para armazenar as coordenadas clicadas de cada grid
  const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);
  const [playerDeployed, setPlayerDeployed] = useState<DeployedCoordinate[]>([]);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(null);
  const [hoveredGrid, setHoveredGrid] = useState<"grid-user" | "grid-player" | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("wss://batalha-bk-production.up.railway.app:8000");

    // Evento disparado ao abrir a conexão WebSocket
    ws.onopen = () => {
      console.log("Conexão WebSocket estabelecida.");
      setIsConnected(true); // Atualiza o estado indicando que a conexão foi estabelecida
    };

    // Evento disparado ao receber mensagens
    ws.onmessage = (event) => {
      console.log("Mensagem recebida:", event.data);
    };

    // Evento disparado ao fechar a conexão
    ws.onclose = () => {
      console.log("Conexão WebSocket encerrada.");
      setIsConnected(false); // Atualiza o estado indicando que a conexão foi encerrada
    };

    // Evento disparado em caso de erro
    ws.onerror = (error) => {
      console.error("Erro na conexão WebSocket:", error);
    };

    // Cleanup para fechar a conexão ao desmontar o componente
    return () => {
      ws.close();
    };
  }, []);

  // Função para lidar com cliques nos botões
  const onClick = (row: string, col: number, grid: "grid-user" | "grid-player"): void => {
    const coordId = `${row}${col}${grid}`;
    console.log(`Botão clicado: ${coordId}`);

    if (grid === "grid-user") {
      setUserDeployed((prevDeployed) => [...prevDeployed, { row, col }]);
    } else if (grid === "grid-player") {
      setPlayerDeployed((prevDeployed) => [...prevDeployed, { row, col }]);
    }
  };

  return (
    <>
      <div>
        <h1>Batalha Naval</h1>
        <p>Status da conexão: {isConnected ? "Conectado" : "Desconectado"}</p>
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
                onClick={() => onClick(row, col, "grid-user")}
                onMouseEnter={() => {
                  setHoveredCoordinate(buttonId);
                  setHoveredGrid("grid-user");
                }}
                onMouseLeave={() => {
                  setHoveredCoordinate(null);
                  setHoveredGrid(null);
                }}
              >
                {userDeployed.some((deploy) => deploy.row === row && deploy.col === col) && (
                  <span className={Styles.alert}> X </span>
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
                {playerDeployed.some((deploy) => deploy.row === row && deploy.col === col) && (
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
    </>
  );
};

export default BattleGrid;

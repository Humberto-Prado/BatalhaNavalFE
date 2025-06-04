import React, { useState, useEffect, use } from "react";
import Styles from "./battleGrid.module.css";
import { gameMachine } from "../gameMachine";
import { useMachine } from "@xstate/react";
import type { EventFrom } from "xstate";


interface DeployedCoordinate {
  row: string;
  col: number;
  result?: "hit" | "miss";
}

interface BattleGridProps {
  sendMessage: ((msg: any) => void) | null;
  wsData: any;
  onNextTurn: () => void;
  onGameOver?: () => void;
  send: (event: EventFrom<typeof gameMachine>) => void;
  currentTurn: number;
}



const BattleGrid: React.FC<BattleGridProps> = ({
  sendMessage,
  wsData,
  onNextTurn,
  onGameOver,
  currentTurn
}) => {
  const rows = "ABCDEFGHIJKLMNO".split("");
  const columns = Array.from({ length: 15 }, (_, i) => i + 1);

  const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);
  const [playerDeployed, setPlayerDeployed] = useState<DeployedCoordinate[]>([]);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(null);
  const [hoveredGrid, setHoveredGrid] = useState<"grid-user" | "grid-player" | null>(null);
  const [lastTarget, setLastTarget] = useState<{ row: string; col: number } | null>(null);

  const handleGridClick = (
    row: string,
    col: number,
    grid: "grid-user" | "grid-player"
  ) => {
    const tile = `${row}${col}`;

    if (sendMessage && grid === "grid-player") {
  if (currentTurn % 2 !== 0) {
    // Jogador 1
    sendMessage({ action: "shoot", game_id: 1, player_id: 1, target: tile });
    setLastTarget({ row, col });
  } else {
    // Jogador 2 (exemplo, se tiver outro player)
    // sendMessage({ action: "shoot", game_id: 1, player_id: 2, target: tile });
    // setLastTarget({ row, col });
  }
}

    if (grid === "grid-user") {
      setUserDeployed((prev) => [...prev, { row, col }]);
    }

    if (onNextTurn) onNextTurn();
  };

  // Resposta do WebSocket aplicada quando wsData atualiza
  useEffect(() => {
    if (lastTarget && wsData?.status) {
      const result = wsData.status as "hit" | "miss";
      setPlayerDeployed((prev) => [
        ...prev,
        { row: lastTarget.row, col: lastTarget.col, result },
      ]);
      setLastTarget(null);
    }
  }, [wsData]);

  return (
    <>
      {/* Player Grid */}
      <div id={Styles["grid-player"]}>
        {rows.map((row) =>
          columns.map((col) => {
            const buttonId = `${row}${col}`;
            const deployed = playerDeployed.find((d) => d.row === row && d.col === col);
            const isHit = deployed?.result === "hit";
            const isMiss = deployed?.result === "miss";

            return (
              <button
                key={buttonId}
                className={`${Styles.cels} ${isHit ? Styles.hit : ""} ${isMiss ? Styles.miss : ""}`}
                onClick={() => handleGridClick(row, col, "grid-player")}
                onMouseEnter={() => {
                  setHoveredCoordinate(buttonId);
                  setHoveredGrid("grid-player");
                }}
                onMouseLeave={() => {
                  setHoveredCoordinate(null);
                  setHoveredGrid(null);
                }}
              >
                
                {hoveredCoordinate === buttonId && hoveredGrid === "grid-player" && (
                  <span className={Styles.alert}>{buttonId}</span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* User Grid */}
      <div id={Styles["grid-user"]}>
        {rows.map((row) =>
          columns.map((col) => {
            const buttonId = `${row}${col}`;
            const isSelected = userDeployed.some((d) => d.row === row && d.col === col);
            return (
              <button
                key={buttonId}
                className={Styles.cels}
                onClick={() => handleGridClick(row, col, "grid-user")}
                onMouseEnter={() => {
                  setHoveredCoordinate(buttonId);
                  setHoveredGrid("grid-user");
                }}
                onMouseLeave={() => {
                  setHoveredCoordinate(null);
                  setHoveredGrid(null);
                }}
              >
                
                {hoveredCoordinate === buttonId && hoveredGrid === "grid-user" && (
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

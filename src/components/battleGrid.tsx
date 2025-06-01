// BattleGrid.tsx
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

  const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);

  const handleMessage = (data: any) => {
    console.log("📬 Resposta do servidor:", data);
  };

  return (
    <WebSocketComponent onMessage={handleMessage}>
      {() => (
        <div id={Styles["grid-user"]}>
          {rows.map((row) =>
            columns.map((col) => {
              const buttonId = `${row}${col}`;
              const isSelected = userDeployed.some((d) => d.row === row && d.col === col);
              return (
                <button
                  key={buttonId}
                  className={Styles.cels}
                  onClick={() =>
                    setUserDeployed((prev) => [...prev, { row, col }])
                  }
                >
                  {isSelected && <span className={Styles.alert}>X</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </WebSocketComponent>
  );
};

export default BattleGrid;

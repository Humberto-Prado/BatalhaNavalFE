import React, { useState } from "react";
import Styles from "./battleGrid.module.css";

interface DeployedCoordinate {
    row: string;
    col: number;
}

interface BattleGridProps {
    sendMessage: ((msg: any) => void) | null;
    wsData: any;
}

const BattleGrid: React.FC<BattleGridProps> = ({ sendMessage, wsData }) => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];
    const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    const [userDeployed, setUserDeployed] = useState<DeployedCoordinate[]>([]);
    const [playerDeployed, setPlayerDeployed] = useState<DeployedCoordinate[]>([]);
    const [hoveredCoordinate, setHoveredCoordinate] = useState<string | null>(null);
    const [hoveredGrid, setHoveredGrid] = useState<"grid-user" | "grid-player" | null>(null);

    const handleGridClick = (row: string, col: number, grid: "grid-user" | "grid-player") => {
        
        if (!wsData) return;
        console.log("BETTTTTOOOOOSSOSOOOOO DFUYN_)DKMASJIONDNASOIDUBA", wsData);

            // do something useful, like update board based on ship positions

        
        const coordId = `${row}${col}${grid}`;
        console.log(`🧭 Clicado: ${coordId}`);

        if (grid === "grid-user") {
            setUserDeployed((prev) => [...prev, { row, col }]);
        } else {
            setPlayerDeployed((prev) => [...prev, { row, col }]);
        }

        if (sendMessage) {
            sendMessage({
                action: "get_game_info",
                game_id: 1,
                player_id: 1,
            });
        } else {
            console.warn("❌ WebSocket não iniciado ainda.");
        }
    };

    return (
        <>
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
                                    setHoveredGrid("grid-player");
                                }}
                                onMouseLeave={() => {
                                    setHoveredCoordinate(null);
                                    setHoveredGrid(null);
                                }}
                            >
                                {isSelected && <span className={Styles.alert}>X</span>}
                                {hoveredCoordinate === buttonId && hoveredGrid === "grid-player" && (
                                    <span className={Styles.alert}>{buttonId}</span>
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Player Grid */}
            <div id={Styles["grid-player"]}>
                {rows.map((row) =>
                    columns.map((col) => {
                        const buttonId = `${row}${col}`;
                        const isSelected = playerDeployed.some((d) => d.row === row && d.col === col);
                        return (
                            <button
                                key={buttonId}
                                className={Styles.cels}
                                onClick={() => handleGridClick(row, col, "grid-player")}
                                onMouseEnter={() => {
                                    setHoveredCoordinate(buttonId);
                                    setHoveredGrid("grid-user");
                                }}
                                onMouseLeave={() => {
                                    setHoveredCoordinate(null);
                                    setHoveredGrid(null);
                                }}
                            >
                                {isSelected && <span className={Styles.alert}>X</span>}
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
